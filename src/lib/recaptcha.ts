/**
 * reCAPTCHA v3, browser side.
 *
 * Two jobs: load Google's script, and mint a token when a form submits.
 *
 * ─── LOADED ON FIRST TOUCH, NOT ON EVERY PAGE ──────────────────────────────
 *
 * Google's own advice is to put the script on every page so its risk engine
 * sees the whole visit. We do not, because the newsletter box sits in the
 * footer of every page — "load it where there is a form" would mean loading
 * it everywhere, including `/quiz/`, where the visitor is a patient answering
 * clinical questions.
 *
 * So it loads the first time someone focuses a field in a form that uses it.
 * Someone who reads the site and leaves makes no request to Google and gets
 * no `_GRECAPTCHA` cookie. Scores are a little weaker for the shorter
 * history; they are still enough for the traffic these forms actually get.
 *
 * ⚠️ `token()` is called at SUBMIT, never at page load. A token expires two
 * minutes after it is minted and the quiz takes much longer than that to
 * complete — a token taken when the page opened would be stale by the time
 * it was checked, and every genuine lead on the site would be refused.
 */

const SCRIPT_ID = "hhcp-recaptcha";

export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

/** The action name each form reports, so Google scores them separately. */
export type RecaptchaAction =
  | "quiz"
  | "discharge"
  | "contact"
  | "newsletter";

interface Grecaptcha {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
}

const grecaptcha = (): Grecaptcha | undefined =>
  (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;

let loading: Promise<boolean> | null = null;

/**
 * Injects the script once and resolves when it is usable.
 *
 * Resolves `false` rather than rejecting when it cannot load — a blocked
 * script is an ordinary outcome here, not an exception, and the caller's job
 * is to carry on and let the server refuse.
 */
export function loadRecaptcha(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (RECAPTCHA_SITE_KEY === "") return Promise.resolve(false);
  if (loading !== null) return loading;

  loading = new Promise<boolean>((resolve) => {
    if (grecaptcha() !== undefined) {
      resolve(true);
      return;
    }

    const existing = document.getElementById(SCRIPT_ID);
    if (existing !== null) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(
      RECAPTCHA_SITE_KEY,
    )}`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(true), { once: true });
    /* Blocked by an extension, offline, or Google unreachable. */
    script.addEventListener("error", () => resolve(false), { once: true });
    document.head.appendChild(script);
  });

  return loading;
}

/**
 * A fresh token for this submit, or `null` if one cannot be had.
 *
 * Never throws and never hangs: a submit button must not be left spinning
 * because a third party is slow. `null` travels to the server, which refuses
 * it and answers with the clinic's phone number.
 */
export async function recaptchaToken(
  action: RecaptchaAction,
): Promise<string | null> {
  try {
    const ready = await loadRecaptcha();
    if (!ready) return null;

    const api = grecaptcha();
    if (api === undefined) return null;

    const token = await Promise.race([
      new Promise<string>((resolve, reject) => {
        api.ready(() => {
          api.execute(RECAPTCHA_SITE_KEY, { action }).then(resolve, reject);
        });
      }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 8_000)),
    ]);

    return typeof token === "string" && token !== "" ? token : null;
  } catch {
    return null;
  }
}

/**
 * Starts the load without waiting for it. Wire to `onFocus` on a form so the
 * script is already there by the time anyone presses submit.
 */
export function primeRecaptcha(): void {
  void loadRecaptcha();
}

/**
 * The notice Google's terms require when the badge is hidden.
 *
 * The badge is hidden — see globals.css — because it floats bottom-right and
 * would sit on top of the sticky mobile call bar. Hiding it is permitted
 * provided this appears in the form, so it is not optional decoration.
 */
/*
 * The first link reads "Google Privacy Policy", not "Privacy Policy".
 *
 * The sentence is identical either way, but the footer already has a link
 * named "Privacy Policy" pointing at ours — two links with the same
 * accessible name and different destinations is ambiguous to anyone
 * navigating by link list, and it is Google's that should carry the
 * qualifier.
 */
export const RECAPTCHA_NOTICE = {
  before: "This site is protected by reCAPTCHA and the ",
  privacy: {
    label: "Google Privacy Policy",
    href: "https://policies.google.com/privacy",
  },
  between: " and ",
  terms: {
    label: "Terms of Service",
    href: "https://policies.google.com/terms",
  },
  after: " apply.",
} as const;
