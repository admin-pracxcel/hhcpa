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

import { aestDate, aestDateTime } from "@/lib/aest";

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

/**
 * The readable view of the clinical answers — see lib/readable.ts.
 *
 * Rebuilt from the payload rather than trusted whole: it reaches n8n and from
 * there an email, so every string is length-capped and every entry is checked
 * for shape. An entry missing a key or a label is dropped rather than
 * forwarded half-formed.
 */
function readable(value: unknown): { key: string; label: string; value: string; source: string }[] {
  if (!Array.isArray(value)) return [];
  const out: { key: string; label: string; value: string; source: string }[] = [];
  for (const entry of value.slice(0, 200)) {
    if (typeof entry !== "object" || entry === null) continue;
    const row = entry as Record<string, unknown>;
    const key = clean(row.key).slice(0, 80);
    const label = clean(row.label).slice(0, 400);
    if (key === "" || label === "") continue;
    out.push({
      key,
      label,
      value: clean(row.value),
      /* Anything unrecognised is treated as an answer, which is the reading
         that overstates least: it never presents a patient's words as
         something the system worked out. */
      source: row.source === "derived" ? "derived" : "answer",
    });
  }
  return out;
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
   * The discharge letter form on /discharge/.
   *
   * Its own POST with its own submission id, no contact block and no consents
   * of its own, and everything it carries is clinical — including the letter
   * — so the whole `intake` object travels under the segregated key rather
   * than beside it.
   *
   * The key is still called `intake` because this branch used to serve two
   * submissions: this one and the clinical intake form that ran at
   * /quiz-book/ between triage and booking. That form was removed on
   * 2026-09-15 (see the note on /quiz-book/); renaming the key now would
   * break every n8n mapping built on it for no gain.
   */
  const stage = clean(payload.stage);
  if (stage === "discharge") {
    /*
     * Checked on the raw object, not through `record()`.
     *
     * `record()` flattens to string values and drops everything else, so an
     * intake carrying only nested objects — `{ answers: {...} }`, which is
     * exactly what the discharge form sends — came out empty and was rejected
     * as unmatched. The payload is forwarded whole under `clinical` anyway;
     * this only needs to know something is there.
     */
    const intake = payload.intake;
    const hasIntake =
      typeof intake === "object" &&
      intake !== null &&
      Object.keys(intake as Record<string, unknown>).length > 0;
    const priorId = clean(payload.submissionId);
    if (priorId === "" || !hasIntake) {
      return Response.json(
        { error: "That form could not be matched to your earlier answers." },
        { status: 400 },
      );
    }
    const stagedAt = new Date();
    return forward(
      JSON.stringify({
        submissionId: priorId,
        formType: "quiz",
        stage,
        submittedAt: stagedAt.toISOString(),
        /* Its own enquiry, with no stage one behind it, so it counts. */
        countsTowardPatientQuota: true,
        service: clean(payload.service),
        safetyFlag: payload.safetyFlag === true,

        /*
         * The same three lead fields, in the same names, as every other form.
         * This branch returns early and so was missing all of them — a
         * discharge submission is its own enquiry, and it arrived at n8n with
         * no country, no campaign and no AEST date at all.
         */
        attribution: record(payload.attribution),
        leadCountry: clean(payload.leadCountry),
        leadCountryName: clean(payload.leadCountryName),
        leadSource: clean(payload.leadSource),
        leadSourceLatest: clean(payload.leadSourceLatest),
        leadDate: aestDate(stagedAt),
        leadDateTime: aestDateTime(stagedAt),
        leadTimezone: "AEST (+10:00)",
        pagePath: clean(payload.pagePath),

        clinical: { intake: payload.intake },
        /* See the note on the main payload below. Same data, same
           sensitivity, laid out for a human to read. */
        clinicalReadable: readable(
          (payload.intake as Record<string, unknown> | undefined)
            ?.answersReadable,
        ),
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
  const now = new Date();
  const submittedAt = now.toISOString();
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

    /*
     * The full campaign set — click ids, every utm_ parameter, the landing
     * page and the referrer. leadSource below is the one field lifted out of
     * it, because every other form on the site sends that name at the top
     * level and n8n should not have to reach into a nested object here alone.
     */
    attribution: record(payload.attribution),

    /* The three lead fields every form carries, in the same names and the
       same place. See lib/lead-fields.ts. */
    leadCountry: clean(payload.leadCountry),
    leadCountryName: clean(payload.leadCountryName),
    leadSource: clean(payload.leadSource),
    leadSourceLatest: clean(payload.leadSourceLatest),
    /*
     * submittedAt above is ISO UTC and stays, because the idempotency key and
     * the audit trail are keyed on it. These three are the AEST reading of the
     * same instant, which is what n8n formats against. Both are the server's
     * clock, never the browser's.
     */
    leadDate: aestDate(now),
    leadDateTime: aestDateTime(now),
    leadTimezone: "AEST (+10:00)",
    /* Flat, like every other form sends it. `page` below keeps the title. */
    pagePath: clean(payload.pagePath),
    page: { path: "/quiz/", title: clean(payload.pageTitle) },

    /*
     * Segregated. Sensitive information under APP 3 and APP 11 — n8n strips
     * this before any marketing-facing branch. Never log its contents.
     */
    clinical: record(payload.clinical),
    /*
     * The same answers as `clinical`, each beside the question that produced
     * it, in the order they were asked. Additive: `clinical` is unchanged and
     * anything reading it keeps working. This is for the email n8n sends the
     * clinic, where a bare key says nothing — `cert_consent5: true` is one of
     * eight declarations and names none of them.
     *
     * ⚠️ Same sensitivity as `clinical`, and easier to mishandle because it
     * reads well. APP 3 and APP 11 apply to it, it must not reach a marketing
     * branch, and the mailbox it is sent to has to be one the clinic treats as
     * clinical. Never log its contents.
     */
    clinicalReadable: readable(payload.clinicalReadable),
  });

  return forward(body, submissionId);
}

/**
 * Deliver to n8n, with the retry, the signature and the fallback.
 *
 * Extracted so the triage submission and the discharge form use the same
 * path. The second one was written as a copy of this loop first, which is one
 * of those duplications that stays right up until the retry policy changes on
 * only one of them.
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
