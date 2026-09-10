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

import { QUIZ_CONSENTS, REQUIRED_CONSENT_IDS } from "@/content/quiz";

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

  /*
   * Stage two: the clinical intake form.
   *
   * A separate POST, carrying the submission id the triage stage returned, so
   * n8n can attach it to the person already in the queue (v2.4 Q36). It has no
   * contact block and no consents — those were taken and validated at stage
   * one, and asking for them again would mean holding a second copy.
   *
   * Everything in `intake` is clinical, including the signature and the
   * declaration it signs, so the whole object travels under the segregated
   * key rather than beside it.
   */
  if (clean(payload.stage) === "intake") {
    const intake = record(payload.intake);
    const priorId = clean(payload.submissionId);
    if (priorId === "" || Object.keys(intake).length === 0) {
      return Response.json(
        { error: "That form could not be matched to your earlier answers." },
        { status: 400 },
      );
    }
    return forward(
      JSON.stringify({
        submissionId: priorId,
        formType: "quiz",
        stage: "intake",
        submittedAt: new Date().toISOString(),
        /* Counted once, at stage one. This is detail on an existing patient. */
        countsTowardPatientQuota: false,
        service: clean(payload.service),
        safetyFlag: payload.safetyFlag === true,
        clinical: { intake: payload.intake },
      }),
      priorId,
    );
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

  /*
   * The required set is derived from the consent list itself, so adding an
   * acknowledgement to the form cannot leave this check behind. Marketing is
   * the only optional one.
   */
  if (!REQUIRED_CONSENT_IDS.every(consentGiven)) {
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
    /*
     * The triage level — green, amber or red. Red means do not auto-book: a
     * human has to make contact. See `triage` in content/quiz.ts.
     */
     outcome: clean(payload.outcome) || "green",
    /*
     * Set when the patient disclosed crisis or self-harm. Its own field, not a
     * shade of `outcome`: red also covers pregnancy and active cancer
     * treatment, and only this one needs somebody paged.
     *
     * ⚠️ Nothing on this side raises the alert. n8n has to branch on this and
     * notify a monitored channel with a named recipient — v2.4 makes that a
     * launch blocker, because the red exit message promises the patient that
     * a member of the team will contact them. Shipping the promise without
     * the alert is worse than the hard exit it replaced.
     */
    safetyFlag: payload.safetyFlag === true,

    consents: Object.fromEntries(
      QUIZ_CONSENTS.map((consent) => [
        consent.id,
        {
          given: consentGiven(consent.id),
          required: consent.required,
          version: consentVersion,
          at: consentedAt,
        },
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

  return forward(body, submissionId);
}

/**
 * Deliver to n8n, with the retry, the signature and the fallback.
 *
 * Extracted so both stages use the same path. The intake stage was written as
 * a second copy of this loop first, which is one of those duplications that
 * stays right up until the retry policy changes on only one of them.
 */
async function forward(body: string, submissionId: string) {
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
