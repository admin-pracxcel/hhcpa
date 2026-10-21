/**
 * Ava — the clinic's web chat, from Tellix AI.
 *
 * Ranjeeta's request of 2026-10-21, as her vendor specified it: the vendor's
 * own tag, `data-client` verbatim, `afterInteractive`, no tag manager and no
 * iframe. The only departure is where it loads.
 *
 * ─── NOT ON THE THREE QUIZ ROUTES ──────────────────────────────────────────
 *
 * `/quiz/`, `/quiz-book/` and `/quiz-thank-you/` are withheld, at Bilal's
 * instruction on 2026-10-21.
 *
 * Reading the widget's source is what settled it. On load it makes one
 * `GET /chat/available`, which carries no cookies and — under the default
 * referrer policy — gives the vendor our origin rather than the path. But
 * when a visitor SENDS a message it posts, beside what they typed:
 *
 *     { page_url: window.location.href, cookies: { … } }
 *
 * `page_url` is the full URL. On `/quiz-thank-you/` that URL is itself the
 * clinical outcome, because only a patient whose answers were flagged for
 * review ever lands there. On `/quiz/` the visitor is mid-questionnaire.
 *
 * And the cookie names are not in the script. They arrive in the
 * `/chat/available` response and the widget reads whatever it was told to —
 * a list the vendor can widen at runtime, with no deploy and no diff here.
 * That is the documented lead-attribution feature, not a trick, but it means
 * the scope is theirs rather than ours.
 *
 * ⚠️ WHAT THIS DOES NOT PROTECT. The widget is an AI that answers health
 * questions in a bubble on our pages. `restricted-terms.test.ts` fails the
 * build if the SITE names a prescription medicine; it cannot see a word Ava
 * says. Ava's guardrails are outside this repository and carry Ranjeeta's
 * registration, not ours. Withholding three routes narrows where she speaks;
 * it does not review what she says.
 */

"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

/** Ranjeeta's client id, verbatim from her vendor. */
const CLIENT_ID = "89131950-b2c7-40c2-8a46-c54b57a86c77";

const WIDGET_SRC = "https://api.tellixai.com/widget.js";

/** The element the widget appends to `document.body`, per its own source. */
const HOST_SELECTOR = "[data-capture-chat]";

/**
 * The launcher sits `fixed; right: 20px; bottom: 20px` inside the widget's
 * own shadow root, which puts it on top of the sticky mobile call bar — over
 * the right-hand end of "Call us", which is the fallback this site leans on
 * for amber outcomes, for a refused reCAPTCHA and for every service with no
 * connected calendar.
 *
 * The widget takes only `data-client`, `data-g` and `data-open`, so there is
 * no offset to pass. Its shadow root is `mode: "open"`, so a style injected
 * into it is the one lever available.
 *
 * Deliberately shallow: if the vendor renames `.cc-root` this rule stops
 * matching and the launcher returns to where it was. Nothing breaks, the
 * overlap just comes back — which is why the real fix is an offset option
 * from them, and this is a stopgap.
 */
const NUDGE_ID = "hhcp-ava-nudge";

const WITHHELD: readonly string[] = [
  "/quiz",
  "/quiz-book",
  "/quiz-thank-you",
];

/**
 * True where Ava must not appear.
 *
 * `trailingSlash` is on, so a pathname arrives as `/quiz-book/`; the bare
 * form is accepted too rather than depending on which side of that 308 the
 * caller sits.
 */
export function isChatWithheld(pathname: string | null): boolean {
  if (pathname === null || pathname === "") return false;
  const trimmed =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return WITHHELD.includes(trimmed);
}

export function AvaChat() {
  const pathname = usePathname();
  const withheld = isChatWithheld(pathname);

  /*
   * Not rendering the <Script> is enough on a fresh load of a withheld route
   * — nothing is fetched at all. It is NOT enough on a client-side move onto
   * one: next/script does not unload, so a visitor who opens the homepage and
   * then clicks through to the quiz would carry the button with them.
   *
   * So the host is hidden rather than removed. Removed, it could not come
   * back: the script has already run and only mounts itself once, so leaving
   * the quiz would leave a site with no chat until the next hard load.
   */
  /*
   * Lift the launcher clear of the sticky call bar, once the widget exists.
   * Polled briefly rather than assumed: it mounts itself whenever its script
   * finishes, which is after this effect first runs.
   */
  useEffect(() => {
    if (withheld) return;
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      const host = document.querySelector<HTMLElement>(HOST_SELECTOR);
      const root = host?.shadowRoot ?? null;
      if (root !== null && root.getElementById(NUDGE_ID) === null) {
        const bar =
          getComputedStyle(document.documentElement)
            .getPropertyValue("--hhcp-sticky-cta-h")
            .trim() || "73px";
        const style = document.createElement("style");
        style.id = NUDGE_ID;
        style.textContent = `@media (max-width: 767px) { .cc-root { bottom: calc(${bar} + 16px) !important; } }`;
        root.appendChild(style);
      }
      if (root !== null || tries > 40) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
  }, [withheld]);

  useEffect(() => {
    const host = document.querySelector<HTMLElement>(HOST_SELECTOR);
    if (host === null) return;
    if (withheld) {
      /* `important`, because the widget seals its own host with
         `all: initial !important` and a plain value would lose to it. */
      host.style.setProperty("display", "none", "important");
      host.setAttribute("aria-hidden", "true");
    } else {
      host.style.removeProperty("display");
      host.removeAttribute("aria-hidden");
    }
  }, [withheld, pathname]);

  if (withheld) return null;

  return (
    <Script
      id="ava-chat"
      src={WIDGET_SRC}
      data-client={CLIENT_ID}
      strategy="afterInteractive"
    />
  );
}
