import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { POST } from "./route";

const WEBHOOK = "http://webhook.test/hook";

function request(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
    process.env.CONTACT_WEBHOOK_URL = WEBHOOK;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 200 })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.CONTACT_WEBHOOK_URL;
    delete process.env.CONTACT_WEBHOOK_SECRET;
  });

  const sent = () =>
    JSON.parse((vi.mocked(fetch).mock.calls[0][1] as RequestInit).body as string);

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
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("rejects an unparseable email", async () => {
    const response = await POST(request({ ...valid, email: "not-an-email" }));
    expect(response.status).toBe(400);
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("swallows a honeypot submission without forwarding it", async () => {
    // 200 so the bot learns nothing, but nothing reaches the webhook.
    const response = await POST(request({ ...valid, company: "Acme Pty Ltd" }));
    expect(response.status).toBe(200);
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("signs the body only when a secret is configured", async () => {
    await POST(request(valid));
    let headers = (vi.mocked(fetch).mock.calls[0][1] as RequestInit)
      .headers as Record<string, string>;
    expect(headers["X-HHCP-Signature"]).toBeUndefined();

    vi.mocked(fetch).mockClear();
    process.env.CONTACT_WEBHOOK_SECRET = "shhh";
    await POST(request(valid));
    headers = (vi.mocked(fetch).mock.calls[0][1] as RequestInit)
      .headers as Record<string, string>;
    expect(headers["X-HHCP-Signature"]).toMatch(/^[a-f0-9]{64}$/);
  });

  it("reports a delivery failure rather than claiming success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("no", { status: 500 }));
    const response = await POST(request(valid));
    expect(response.status).toBe(502);
  });
});
