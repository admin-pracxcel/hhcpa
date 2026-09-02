/**
 * `POST /api/contact` — forwards a contact-form submission to n8n.
 *
 * The browser posts here rather than straight to the webhook, which buys four
 * things: the webhook URL stays out of the client bundle, there is no
 * cross-origin surface for someone to spam from another site, the server can
 * stamp fields the browser must not be trusted with, and the payload can be
 * validated once in a place the client cannot skip.
 *
 * ⚠️ This is the contact form only. `/quiz/` is the sole lead-capturing flow
 * that counts toward the Clause 1.2 patient quota (spec D3), and a general
 * contact message is not a consultation request. Whatever consumes this
 * webhook must not add these to the quota, or it inflates the number the
 * Risk-Share Bond is measured on. The payload says so in `formType`.
 *
 * Signing is optional and off unless `CONTACT_WEBHOOK_SECRET` is set. When it
 * is, an HMAC-SHA256 of the exact body goes out in `X-HHCP-Signature` so n8n
 * can reject anything that did not come from this server.
 */

import { createHmac } from "node:crypto";

import { aestDate, aestDateTime } from "@/lib/aest";

const DEFAULT_WEBHOOK_URL =
  "https://n8n.pracxcel.com.au/webhook/hhcpa-contact";

const WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL ?? DEFAULT_WEBHOOK_URL;

/*
 * Say so, loudly, when submissions are being diverted. An override is for
 * local testing, and a stale one silently swallows real enquiries while the
 * form still reports success to the person who sent it.
 */
if (WEBHOOK_URL !== DEFAULT_WEBHOOK_URL) {
  console.warn(
    `[contact] CONTACT_WEBHOOK_URL override active — submissions go to ${WEBHOOK_URL}, not n8n.`,
  );
}

const FIELD_LIMIT = 4000;
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
   * Answer 200 so the bot has no signal that it was caught, but send nothing on.
   */
  if (clean(payload.company) !== "") {
    return Response.json({ ok: true });
  }

  const firstName = clean(payload.firstName);
  const lastName = clean(payload.lastName);
  const email = clean(payload.email);
  const message = clean(payload.message);

  const missing = [
    firstName === "" && "first name",
    lastName === "" && "last name",
    email === "" && "email",
    message === "" && "message",
  ].filter(Boolean);

  if (missing.length > 0) {
    return Response.json(
      { error: `Please provide your ${missing.join(", ")}.` },
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
  const phone = clean(payload.phone);
  const phoneCountry = clean(payload.phoneCountry);
  const phoneDial = clean(payload.phoneDial);

  const body = JSON.stringify({
    formType: "contact",
    /* Not a consultation request. See the header. */
    countsTowardPatientQuota: false,

    firstName,
    lastName,
    email,
    phone,
    /* The country the number belongs to, as chosen in the field. */
    phoneCountry,
    phoneDial,
    phoneE164: phone === "" ? "" : `${phoneDial}${phone.replace(/[^\d]/g, "")}`,
    message,

    /* Where the visitor is, guessed from their browser, not where they dial. */
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

  const secret = process.env.CONTACT_WEBHOOK_SECRET;
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
      /*
       * Log the status, never the body: it is a patient's message. The visitor
       * sees a generic failure with the phone number, which is live.
       */
      console.error(`Contact webhook responded ${response.status}`);
      return Response.json({ error: "delivery-failed" }, { status: 502 });
    }
  } catch (error) {
    console.error(
      "Contact webhook unreachable:",
      error instanceof Error ? error.name : "unknown",
    );
    return Response.json({ error: "delivery-failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
