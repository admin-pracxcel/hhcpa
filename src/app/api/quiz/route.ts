/**
 * `POST /api/quiz` — the lead path.
 *
 * ⚠️ THIS IS THE COUNTABLE EVENT. Spec §5.1: the quiz's closing step is the New
 * Patient Booking under Clause 1.2 of the Service Agreement, and the
 * $1,000/month Risk-Share Bond is measured on the count. Two consequences:
 *
 *   1. `countsTowardPatientQuota` is true here and false on the contact form.
 *      Whatever consumes the webhook must respect the flag rather than counting
 *      every submission.
 *   2. `submissionId` is an idempotency key. Retries reuse it, so a delivery
 *      that succeeds on the second attempt is one patient, not two. Counting
 *      retries as separate leads would inflate the number in our favour, which
 *      is the failure mode that loses trust in it.
 *
 * Clinical answers travel under a dedicated `clinical` key (spec §6.4). They are
 * sensitive information under APP 3 and APP 11, and the segregation exists so
 * n8n can route them to the clinical destination and strip them before any
 * marketing branch. Health-inferred data must never reach an ad platform.
 *
 * Reliability (spec §6.3): three attempts with exponential backoff. On
 * exhaustion the patient still sees success — their booking must not fail
 * because our webhook did — and the failure is logged without any clinical
 * content.
 *
 * ⚠️ NOT YET BUILT: the durable fallback store. The spec requires one, because
 * on exhaustion the submission is otherwise lost and under Clause 5.4 it is the
 * only evidence in a quota dispute. It must not be the app filesystem, which
 * Hostinger wipes on deploy. `persistFallback` below is the seam.
 */

import { createHmac, randomUUID } from "node:crypto";

const DEFAULT_WEBHOOK_URL = "https://n8n.pracxcel.com.au/webhook/hhcpa-quiz";
const WEBHOOK_URL = process.env.QUIZ_WEBHOOK_URL ?? DEFAULT_WEBHOOK_URL;

if (WEBHOOK_URL !== DEFAULT_WEBHOOK_URL) {
  console.warn(
    `[quiz] QUIZ_WEBHOOK_URL override active — submissions go to ${WEBHOOK_URL}, not n8n.`,
  );
}

const FIELD_LIMIT = 4000;
const TIMEOUT_MS = 10_000;
const ATTEMPTS = 3;
const BACKOFF_MS = [0, 2_000, 4_000];

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, FIELD_LIMIT) : "";
}

function record(value: unknown): Record<string, string> {
  if (typeof value !== "object" || value === null) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => [key.slice(0, 80), clean(item)])
      .filter(([, item]) => item !== ""),
  );
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Last line of defence for a submission n8n would not take.
 *
 * Deliberately unimplemented rather than quietly dropping the record: the
 * console line is what a launch checklist should trip over. See the header.
 */
function persistFallback(submissionId: string): void {
  console.error(
    `[quiz] FALLBACK STORE NOT CONFIGURED — submission ${submissionId} was not delivered and is not persisted anywhere. See spec §6.3.`,
  );
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  /* Honeypot: 200 so a bot learns nothing, but nothing is forwarded. */
  if (clean(payload.company) !== "") {
    return Response.json({ ok: true });
  }

  const contact = record(payload.contact);
  const missing = [
    !contact.firstName && "first name",
    !contact.lastName && "last name",
    !contact.email && "email",
    !contact.phone && "phone number",
  ].filter(Boolean);

  if (missing.length > 0) {
    return Response.json(
      { error: `Please provide your ${missing.join(", ")}.` },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    return Response.json(
      { error: "That email address does not look right." },
      { status: 400 },
    );
  }

  const consents = payload.consents;
  const consentGiven = (id: string) =>
    typeof consents === "object" &&
    consents !== null &&
    (consents as Record<string, unknown>)[id] === true;

  /* Marketing is optional; the other three are not. */
  if (
    !consentGiven("terms") ||
    !consentGiven("privacy") ||
    !consentGiven("clinicalUnderstanding")
  ) {
    return Response.json(
      { error: "Please accept the required consents to continue." },
      { status: 400 },
    );
  }

  const submissionId = randomUUID();
  const submittedAt = new Date().toISOString();
  const consentedAt = clean(payload.consentedAt) || submittedAt;
  const consentVersion = clean(payload.consentVersion);

  const body = JSON.stringify({
    submissionId,
    formType: "quiz",
    submittedAt,
    /* The quiz is the countable New Patient Booking. See the header. */
    countsTowardPatientQuota: true,

    contact: {
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      phoneCountry: contact.phoneCountry ?? "",
      phoneDial: contact.phoneDial ?? "",
      phoneE164: contact.phoneE164 ?? "",
    },

    service: clean(payload.service),
    outcome: clean(payload.outcome) || "eligible",

    consents: Object.fromEntries(
      ["terms", "privacy", "marketing", "clinicalUnderstanding"].map((id) => [
        id,
        { given: consentGiven(id), version: consentVersion, at: consentedAt },
      ]),
    ),

    attribution: record(payload.attribution),
    leadCountry: clean(payload.leadCountry),
    leadCountryName: clean(payload.leadCountryName),
    page: { path: "/quiz/", title: clean(payload.pageTitle) },

    /*
     * Segregated. Sensitive information under APP 3 and APP 11 — n8n strips
     * this before any marketing-facing branch. Never log its contents.
     */
    clinical: record(payload.clinical),
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    /* Lets n8n discard a duplicate rather than count one patient twice. */
    "Idempotency-Key": submissionId,
  };

  const secret = process.env.QUIZ_WEBHOOK_SECRET;
  if (secret !== undefined && secret !== "") {
    headers["X-HHCPA-Signature"] = createHmac("sha256", secret)
      .update(body)
      .digest("hex");
  }

  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    if (BACKOFF_MS[attempt] > 0) await sleep(BACKOFF_MS[attempt]);
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
      if (response.ok) {
        return Response.json({ ok: true, submissionId });
      }
      console.error(
        `[quiz] webhook responded ${response.status} on attempt ${attempt + 1}`,
      );
    } catch (error) {
      console.error(
        `[quiz] webhook unreachable on attempt ${attempt + 1}:`,
        error instanceof Error ? error.name : "unknown",
      );
    }
  }

  persistFallback(submissionId);

  /*
   * 200, deliberately. Spec §6.3: the patient always sees their success screen.
   * `delivered: false` lets a monitor distinguish this from a clean run without
   * telling the patient their booking failed.
   */
  return Response.json({ ok: true, submissionId, delivered: false });
}
