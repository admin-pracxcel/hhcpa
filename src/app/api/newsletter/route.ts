/**
 * `POST /api/newsletter` — forwards a newsletter signup to n8n.
 *
 * Same shape as `/api/contact` and for the same four reasons: the webhook URL
 * stays out of the client bundle, there is no cross-origin surface to spam
 * from another site, the server stamps the fields the browser must not be
 * trusted with, and the payload is validated once where the client cannot
 * skip it.
 *
 * ⚠️ This is a mailing-list signup, nothing more. It is not a consultation
 * request and must not count toward the Clause 1.2 patient quota — the same
 * warning the contact route carries, and for the same reason: the Risk-Share
 * Bond is measured on that number. `formType` and `countsTowardPatientQuota`
 * say so in the payload.
 *
 * It also collects no health information, which is why there is no clinical
 * segregation here as there is on the quiz route. An email address and where
 * the visitor came from is the whole of it. Keep it that way: the moment a
 * health field is added to a newsletter form it stops being a mailing list
 * and starts being a patient record.
 *
 * Signing is optional and off unless `NEWSLETTER_WEBHOOK_SECRET` is set.
 */

import { createHmac } from "node:crypto";

import { aestDate, aestDateTime } from "@/lib/aest";

const DEFAULT_WEBHOOK_URL =
  "https://n8n.pracxcel.com.au/webhook/hhcpa-newsletter";

const WEBHOOK_URL = process.env.NEWSLETTER_WEBHOOK_URL ?? DEFAULT_WEBHOOK_URL;

/*
 * Say so, loudly, when signups are being diverted. An override is for local
 * testing, and a stale one silently swallows real signups while the form
 * still reports success to the person who sent it.
 */
if (WEBHOOK_URL !== DEFAULT_WEBHOOK_URL) {
  console.warn(
    `[newsletter] NEWSLETTER_WEBHOOK_URL override active — signups go to ${WEBHOOK_URL}, not n8n.`,
  );
}

const FIELD_LIMIT = 400;
const TIMEOUT_MS = 10_000;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, FIELD_LIMIT) : "";
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  /*
   * Honeypot. A field no human sees and no human fills; bots fill everything.
   * Answer 200 so the bot has no signal that it was caught, but send nothing
   * on. This matters more here than on the other forms: an email box with one
   * field and a button is the easiest thing on the site to script.
   */
  if (clean(payload.company) !== "") {
    return Response.json({ ok: true });
  }

  const email = clean(payload.email);

  if (email === "") {
    return Response.json(
      { error: "Please enter your email address." },
      { status: 400 },
    );
  }

  /* Deliberately permissive: an over-strict pattern rejects real addresses. */
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { error: "That email address does not look right." },
      { status: 400 },
    );
  }

  const now = new Date();

  const body = JSON.stringify({
    formType: "newsletter",
    /* Not a consultation request. See the header. */
    countsTowardPatientQuota: false,

    email,

    /*
     * Which of the three signup forms this came from — "footer", "closing-cta"
     * or "hero". They are the same field on the same list, and without this
     * there is no way to tell from n8n which placement actually converts.
     */
    formPlacement: clean(payload.formPlacement),

    /* Where the visitor is, guessed from their browser. */
    leadCountry: clean(payload.leadCountry),
    leadCountryName: clean(payload.leadCountryName),

    /* First touch, then the visit that converted. See lib/attribution.ts. */
    leadSource: clean(payload.leadSource),
    leadSourceLatest: clean(payload.leadSourceLatest),

    /* Stamped here, not in the browser: a client clock can be wrong or edited. */
    leadDate: aestDate(now),
    leadDateTime: aestDateTime(now),
    leadTimezone: "AEST (+10:00)",

    pagePath: clean(payload.pagePath),
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const secret = process.env.NEWSLETTER_WEBHOOK_SECRET;
  if (secret !== undefined && secret !== "") {
    headers["X-HHCP-Signature"] = createHmac("sha256", secret)
      .update(body)
      .digest("hex");
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (!response.ok) {
      /* Log the status, never the body: it carries an email address. */
      console.error(`Newsletter webhook responded ${response.status}`);
      return Response.json({ error: "delivery-failed" }, { status: 502 });
    }
  } catch (error) {
    console.error(
      "Newsletter webhook unreachable:",
      error instanceof Error ? error.name : "unknown",
    );
    return Response.json({ error: "delivery-failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
