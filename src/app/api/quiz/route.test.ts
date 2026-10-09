import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { POST } from "./route";
import { REQUIRED_CONSENT_IDS } from "@/content/quiz";

/**
 * The quiz route's forwarding contract.
 *
 * Narrow on purpose: this covers the fields n8n branches on, because those are
 * the ones whose absence is silent. A missing `safetyFlag` does not throw and
 * does not fail a render — the workflow simply never fires the alert, and
 * nobody finds out until it matters.
 */
const WEBHOOK = "http://webhook.test/quiz";
const DISCHARGE_WEBHOOK = "http://webhook.test/discharge";

const valid = {
  contact: {
    firstName: "Jane",
    lastName: "Citizen",
    email: "jane@example.com",
    phone: "412 345 678",
  },
  consents: Object.fromEntries(REQUIRED_CONSENT_IDS.map((id) => [id, true])),
};

function request(body: unknown) {
  return new Request("http://localhost/api/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/quiz", () => {
  beforeEach(() => {
    process.env.QUIZ_WEBHOOK_URL = WEBHOOK;
    process.env.DISCHARGE_WEBHOOK_URL = DISCHARGE_WEBHOOK;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 200 })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.QUIZ_WEBHOOK_URL;
    delete process.env.DISCHARGE_WEBHOOK_URL;
  });

  const forwarded = () =>
    JSON.parse(
      (vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string,
    ) as Record<string, unknown>;

  it("forwards a disclosed crisis as its own field", async () => {
    /*
     * Separate from the triage colour on purpose. Red also covers pregnancy
     * and active cancer treatment; only this one needs somebody paged.
     */
    const response = await POST(
      request({ ...valid, outcome: "red", safetyFlag: true }),
    );
    expect(response.status).toBe(200);
    expect(forwarded().safetyFlag).toBe(true);
    expect(forwarded().outcome).toBe("red");
  });

  it("sends the flag as false rather than omitting it", async () => {
    // n8n branches on it, so it has to be present and boolean every time.
    await POST(request({ ...valid, outcome: "green" }));
    expect(forwarded().safetyFlag).toBe(false);
  });

  it("keeps clinical answers under their own key and nowhere else", async () => {
    /*
     * APP 3 and APP 11: n8n strips `clinical` before any marketing-facing
     * branch, which only works if nothing clinical is also sitting at the top
     * level. Note the route forwards no `answers` object at all — the general
     * answers are dropped and only `service` survives, which is the strictest
     * reading of data minimisation and worth keeping.
     */
    await POST(
      request({
        ...valid,
        outcome: "green",
        service: "Men's Health",
        answers: { service_selection: "Men's Health" },
        clinical: { mn_concern: "Low energy" },
      }),
    );
    const body = forwarded();
    expect(body.clinical).toMatchObject({ mn_concern: "Low energy" });
    expect(body.service).toBe("Men's Health");

    const rest = { ...body };
    delete rest.clinical;
    expect(JSON.stringify(rest)).not.toContain("Low energy");
  });
});

describe("second-stage submissions", () => {
  beforeEach(() => {
    process.env.QUIZ_WEBHOOK_URL = "http://webhook.test/quiz";
    process.env.DISCHARGE_WEBHOOK_URL = "http://webhook.test/discharge";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.QUIZ_WEBHOOK_URL;
    delete process.env.DISCHARGE_WEBHOOK_URL;
  });

  const sent = () =>
    JSON.parse(
      (vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string,
    ) as Record<string, unknown>;

  /*
   * The intake stage is gone. Her six FRMs ran at /quiz-book/ between triage
   * and booking until 2026-09-15; the route no longer has a branch for them.
   *
   * Asserted rather than deleted, because "accepted and forwarded" and "not a
   * stage at all" are different behaviours and only one of them is right. A
   * stale client still posting `stage: "intake"` should be told no, not have
   * a clinical payload quietly relayed to n8n under a stage nothing consumes.
   */
  it("no longer accepts the clinical intake stage", async () => {
    const response = await POST(
      request({
        stage: "intake",
        submissionId: "sub-1",
        intake: { formId: "HHCPA-FRM-005", signature: "Jane Citizen" },
      }),
    );
    expect(response.status).toBe(400);
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("accepts the discharge letter form and counts it", async () => {
    // No stage one behind it, so it is its own enquiry.
    const response = await POST(
      request({
        stage: "discharge",
        submissionId: "sub-2",
        intake: { formId: "HHCPA-DISCHARGE", answers: { email: "a@b.co" } },
      }),
    );
    expect(response.status).toBe(200);
    expect(sent().stage).toBe("discharge");
    expect(sent().countsTowardPatientQuota).toBe(true);
  });

  it("keeps a second-stage payload entirely inside the clinical key", async () => {
    await POST(
      request({
        stage: "discharge",
        submissionId: "sub-3",
        intake: { answers: { previousDoctor: "Dr Example" } },
      }),
    );
    const body = sent();
    const rest = { ...body };
    delete rest.clinical;
    expect(JSON.stringify(rest)).not.toContain("Dr Example");
  });

  /*
   * The two enquiries shared one webhook until 2026-10-09 and were told apart
   * downstream by `stage`. They have a workflow each now, and crossing them
   * breaks nothing visible — the submission still succeeds and the patient
   * still sees their confirmation. It just lands in the wrong place, which is
   * why it is asserted rather than left to a reviewer's eye.
   */
  const sentTo = () => vi.mocked(fetch).mock.calls[0][0] as string;

  it("sends a discharge request to the discharge workflow", async () => {
    await POST(
      request({
        stage: "discharge",
        submissionId: "sub-4",
        intake: { answers: { reason: "Moving clinics" } },
      }),
    );
    expect(sentTo()).toBe("http://webhook.test/discharge");
  });

  it("leaves the quiz on the quiz workflow", async () => {
    await POST(request(valid));
    expect(sentTo()).toBe("http://webhook.test/quiz");
  });

  it("does not change the discharge payload shape along with its address", async () => {
    /* Only the destination moved, so a mapping built on this keeps working. */
    await POST(
      request({
        stage: "discharge",
        submissionId: "sub-5",
        intake: { answers: { reason: "Moving clinics" } },
      }),
    );
    expect(sent().formType).toBe("quiz");
    expect(sent().stage).toBe("discharge");
  });

  it("rejects a second stage with nothing to attach it to", async () => {
    const response = await POST(
      request({ stage: "discharge", intake: { a: 1 } }),
    );
    expect(response.status).toBe(400);
  });

});
