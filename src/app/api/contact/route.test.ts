import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { POST } from "./route";

/*
 * Every form now posts a reCAPTCHA token and every route verifies it before
 * forwarding, so these tests behave like a real submission: a stubbed Google
 * that passes, and a `fetch` that can tell the two calls apart.
 *
 * The token carries the action it was minted for — "token:discharge" — and
 * the stub echoes it back, so one stub serves both forms that post to this
 * route and the action check is exercised rather than bypassed.
 *
 * `webhookCall()` finds the forward rather than assuming it is the first
 * call, because verification goes out first.
 */
const SITEVERIFY = "https://www.google.com/recaptcha/api/siteverify";

const isVerify = (url: unknown) => String(url).startsWith(SITEVERIFY);

/** `webhookStatus` lets a test fail the forward while verification passes. */
function stubFetch(opts: { webhookStatus?: number; score?: number } = {}) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      if (isVerify(url)) {
        const token = new URLSearchParams(String(init?.body ?? "")).get(
          "response",
        );
        const action = (token ?? "").includes(":")
          ? (token ?? "").split(":")[1]
          : "quiz";
        return new Response(
          JSON.stringify({ success: true, score: opts.score ?? 0.9, action }),
          { status: 200 },
        );
      }
      return new Response("{}", { status: opts.webhookStatus ?? 200 });
    }),
  );
}

const webhookCalls = () =>
  vi.mocked(fetch).mock.calls.filter(([url]) => !isVerify(url));

const webhookCall = () => {
  const call = webhookCalls()[0];
  if (call === undefined) throw new Error("nothing was forwarded");
  return call as unknown as [string, RequestInit];
};

const WEBHOOK = "http://webhook.test/hook";

/* Each test body gets a token; the stub above makes it verify. */
function request(body: unknown) {
  const withToken =
    typeof body === "object" && body !== null
      ? { recaptchaToken: "test-token:contact", ...body }
      : body;
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(withToken),
  });
}

const valid = {
  firstName: "Jordan",
  lastName: "Fraser",
  email: "jordan@example.com",
  phone: "412 345 678",
  phoneCountry: "AU",
  phoneDial: "+61",
  message: "A question.",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    process.env.RECAPTCHA_SECRET_KEY = "test-secret";
    process.env.CONTACT_WEBHOOK_URL = WEBHOOK;
    stubFetch();
  });

  afterEach(() => {
    delete process.env.RECAPTCHA_SECRET_KEY;
    vi.unstubAllGlobals();
    delete process.env.CONTACT_WEBHOOK_URL;
    delete process.env.CONTACT_WEBHOOK_SECRET;
  });

  const sent = () =>
    JSON.parse(webhookCall()[1].body as string);

  it("forwards the visible fields and the derived ones", async () => {
    const response = await POST(request({ ...valid, leadCountry: "GB", leadCountryName: "United Kingdom", leadSource: "google-ads", leadSourceLatest: "newsletter" }));
    expect(response.status).toBe(200);

    const body = sent();
    expect(body.firstName).toBe("Jordan");
    expect(body.leadCountry).toBe("GB");
    expect(body.leadSource).toBe("google-ads");
    expect(body.leadSourceLatest).toBe("newsletter");
    // Stamped by the server, in AEST, as year-month-day.
    expect(body.leadDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(body.leadDateTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \+10:00$/);
    expect(body.leadTimezone).toBe("AEST (+10:00)");
  });

  it("marks the submission as outside the patient quota", async () => {
    // A contact message is not a consultation request; counting it would
    // inflate the number the Clause 1.2 Risk-Share Bond is measured on.
    await POST(request(valid));
    expect(sent().countsTowardPatientQuota).toBe(false);
    expect(sent().formType).toBe("contact");
  });

  it("builds an E.164 number from the dial code and the digits", async () => {
    await POST(request(valid));
    expect(sent().phoneE164).toBe("+61412345678");
  });

  it("rejects a submission missing required fields, naming them", async () => {
    const response = await POST(request({ ...valid, firstName: "", email: "" }));
    expect(response.status).toBe(400);
    expect((await response.json()).error).toContain("first name");
    expect(webhookCalls()).toHaveLength(0);
  });

  it("rejects an unparseable email", async () => {
    const response = await POST(request({ ...valid, email: "not-an-email" }));
    expect(response.status).toBe(400);
    expect(webhookCalls()).toHaveLength(0);
  });

  it("swallows a honeypot submission without forwarding it", async () => {
    // 200 so the bot learns nothing, but nothing reaches the webhook.
    const response = await POST(request({ ...valid, company: "Acme Pty Ltd" }));
    expect(response.status).toBe(200);
    expect(webhookCalls()).toHaveLength(0);
  });

  it("signs the body only when a secret is configured", async () => {
    await POST(request(valid));
    let headers = webhookCall()[1]
      .headers as Record<string, string>;
    expect(headers["X-HHCP-Signature"]).toBeUndefined();

    vi.mocked(fetch).mockClear();
    process.env.CONTACT_WEBHOOK_SECRET = "shhh";
    await POST(request(valid));
    headers = webhookCall()[1]
      .headers as Record<string, string>;
    expect(headers["X-HHCP-Signature"]).toMatch(/^[a-f0-9]{64}$/);
  });

  it("reports a delivery failure rather than claiming success", async () => {
    /* Verification passes; it is the forward to n8n that fails. */
    stubFetch({ webhookStatus: 500 });
    const response = await POST(request(valid));
    expect(response.status).toBe(502);
  });
});
