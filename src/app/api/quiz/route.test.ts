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
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 200 })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.QUIZ_WEBHOOK_URL;
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
