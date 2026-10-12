/**
 * reCAPTCHA v3 verification, server side.
 *
 * Every form posts a token; every route checks it here before forwarding
 * anything to n8n. A submission that does not pass is refused and never
 * reaches the client — that is the whole point of having it.
 *
 * ─── WHY A FAILURE IS A REFUSAL ────────────────────────────────────────────
 *
 * Letting an unverifiable submission through would make this decorative: a bot
 * that simply omits the token would walk past it. So "no token" is refused for
 * the same reason "bad score" is.
 *
 * The cost is real and accepted: an ad blocker, a privacy browser or a
 * corporate proxy can stop the script loading, and that patient is refused
 * too. The routes answer with the clinic's phone number rather than a dead
 * end, which is the same fallback the booking page and the amber triage
 * outcome already use.
 *
 * ⚠️ Tokens expire two minutes after they are minted, so a form must call for
 * one at SUBMIT, never at page load. The quiz takes far longer than two
 * minutes to complete; a token taken when the page opened would fail here
 * every single time and refuse every genuine lead on the site.
 */

const DEFAULT_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/*
 * Overridable for local testing only, the same shape as every webhook URL in
 * this codebase and for the same reason: Google's public test keys answer
 * `success: true` with no `action` and no `score`, so they cannot exercise
 * the path where a submission is ACCEPTED — only the refusals. Pointing this
 * at a local stand-in is the only way to prove the whole chain end to end.
 *
 * It warns at boot, loudly, because an override left on in production would
 * hand verification to something that is not Google.
 */
const VERIFY_URL = process.env.RECAPTCHA_VERIFY_URL ?? DEFAULT_VERIFY_URL;

if (VERIFY_URL !== DEFAULT_VERIFY_URL) {
  console.warn(
    `[recaptcha] RECAPTCHA_VERIFY_URL override active — tokens are checked by ${VERIFY_URL}, NOT by Google.`,
  );
}

/* Google's own default. Raise it to catch more, at the cost of more real
   people refused — there is nothing downstream to recover them. */
const DEFAULT_MIN_SCORE = 0.5;

const TIMEOUT_MS = 3_000;

export interface RecaptchaResult {
  readonly ok: boolean;
  /** 0.0–1.0 from Google, or null when there was nothing to score. */
  readonly score: number | null;
  /** Short reason, for the server log. Never shown to the visitor. */
  readonly reason: string;
}

/** `RECAPTCHA_MIN_SCORE` so the threshold can move without a deploy. */
function minScore(): number {
  const raw = Number(process.env.RECAPTCHA_MIN_SCORE);
  return Number.isFinite(raw) && raw > 0 && raw <= 1 ? raw : DEFAULT_MIN_SCORE;
}

/**
 * Verifies a token for one form.
 *
 * `expectedAction` is checked against what Google reports. Without it a token
 * minted by the newsletter box — the cheapest form on the site to automate —
 * could be replayed against the quiz, which is the one that counts.
 *
 * Never throws. Anything unexpected is a refusal with a reason.
 */
export async function verifyRecaptcha(
  token: unknown,
  expectedAction: string,
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  /*
   * No secret configured means the site cannot verify anything. It refuses
   * rather than waves everything through: a missing environment variable
   * should not silently turn the protection off on the one deployment that
   * forgot it.
   */
  if (secret === undefined || secret === "") {
    return { ok: false, score: null, reason: "secret-not-configured" };
  }

  if (typeof token !== "string" || token === "") {
    return { ok: false, score: null, reason: "no-token" };
  }

  let payload: {
    success?: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
  };

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) {
      return { ok: false, score: null, reason: `http-${response.status}` };
    }
    payload = (await response.json()) as typeof payload;
  } catch {
    /* Unreachable, timed out, or not JSON. */
    return { ok: false, score: null, reason: "unreachable" };
  }

  if (payload.success !== true) {
    const codes = (payload["error-codes"] ?? []).join(",");
    return { ok: false, score: null, reason: `rejected:${codes}` };
  }

  if (payload.action !== expectedAction) {
    return {
      ok: false,
      score: typeof payload.score === "number" ? payload.score : null,
      reason: `action-mismatch:${String(payload.action)}`,
    };
  }

  const score = typeof payload.score === "number" ? payload.score : null;
  if (score === null) {
    return { ok: false, score: null, reason: "no-score" };
  }

  if (score < minScore()) {
    return { ok: false, score, reason: "low-score" };
  }

  return { ok: true, score, reason: "ok" };
}

/**
 * What a refused visitor is told.
 *
 * A person, not an error code. Most of the people who see this will be real —
 * a bot does not read it — so it has to give them somewhere to go.
 */
export function recaptchaRefusal(phone: string): string {
  return `We could not verify that submission. Please call ${phone} and our team will help you from there.`;
}
