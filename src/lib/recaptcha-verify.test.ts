import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { verifyRecaptcha, recaptchaRefusal } from "./recaptcha-verify";

/**
 * This decides whether a submission reaches the clinic at all, so every
 * branch is asserted rather than reviewed. A mistake here is silent in both
 * directions: too strict and real patients vanish with no record, too loose
 * and the protection is decorative.
 */
const googleSays = (body: unknown, status = 200) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status }));

describe("verifyRecaptcha", () => {
  beforeEach(() => {
    process.env.RECAPTCHA_SECRET_KEY = "test-secret";
    delete process.env.RECAPTCHA_MIN_SCORE;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.RECAPTCHA_SECRET_KEY;
    delete process.env.RECAPTCHA_MIN_SCORE;
  });

  it("passes a good score on the right action", async () => {
    vi.stubGlobal("fetch", googleSays({ success: true, score: 0.9, action: "quiz" }));
    const result = await verifyRecaptcha("token", "quiz");
    expect(result.ok).toBe(true);
    expect(result.score).toBe(0.9);
  });

  it("refuses a score below the threshold", async () => {
    vi.stubGlobal("fetch", googleSays({ success: true, score: 0.1, action: "quiz" }));
    const result = await verifyRecaptcha("token", "quiz");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("low-score");
    /* Kept so the log can show what was refused and at what number. */
    expect(result.score).toBe(0.1);
  });

  it("treats the threshold as inclusive", async () => {
    vi.stubGlobal("fetch", googleSays({ success: true, score: 0.5, action: "quiz" }));
    expect((await verifyRecaptcha("token", "quiz")).ok).toBe(true);
  });

  it("honours RECAPTCHA_MIN_SCORE so the bar can move without a deploy", async () => {
    process.env.RECAPTCHA_MIN_SCORE = "0.8";
    vi.stubGlobal("fetch", googleSays({ success: true, score: 0.6, action: "quiz" }));
    expect((await verifyRecaptcha("token", "quiz")).reason).toBe("low-score");
  });

  it("ignores a nonsense threshold rather than letting everything through", async () => {
    /* "" , "abc", "0", "5" — a typo in the env must not disable the check. */
    for (const bad of ["", "abc", "0", "5", "-1"]) {
      process.env.RECAPTCHA_MIN_SCORE = bad;
      vi.stubGlobal("fetch", googleSays({ success: true, score: 0.4, action: "quiz" }));
      expect((await verifyRecaptcha("token", "quiz")).ok, bad).toBe(false);
    }
  });

  it("refuses a token minted for a different form", async () => {
    /*
     * The newsletter box is the cheapest form here to automate. Without this
     * a token farmed from it would be accepted by the quiz, which is the one
     * that counts toward the quota.
     */
    vi.stubGlobal("fetch", googleSays({ success: true, score: 0.9, action: "newsletter" }));
    const result = await verifyRecaptcha("token", "quiz");
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("action-mismatch");
  });

  it("refuses when there is no token", async () => {
    /* The obvious bypass: a bot that simply does not send one. */
    for (const token of [undefined, null, "", 42, {}]) {
      const result = await verifyRecaptcha(token, "quiz");
      expect(result.ok, String(token)).toBe(false);
      expect(result.reason).toBe("no-token");
    }
  });

  it("refuses when Google rejects the token", async () => {
    vi.stubGlobal("fetch", googleSays({ success: false, "error-codes": ["timeout-or-duplicate"] }));
    const result = await verifyRecaptcha("token", "quiz");
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("timeout-or-duplicate");
  });

  it("refuses when Google is unreachable or slow", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network"); }));
    expect((await verifyRecaptcha("token", "quiz")).reason).toBe("unreachable");
  });

  it("refuses on a non-200 from Google", async () => {
    vi.stubGlobal("fetch", googleSays({}, 500));
    expect((await verifyRecaptcha("token", "quiz")).reason).toBe("http-500");
  });

  it("refuses a success with no score at all", async () => {
    /* v2's shape. If the keys are ever swapped for a v2 pair this is what
       arrives, and a missing score must not read as a passing one. */
    vi.stubGlobal("fetch", googleSays({ success: true, action: "quiz" }));
    expect((await verifyRecaptcha("token", "quiz")).reason).toBe("no-score");
  });

  it("refuses when the secret is not configured", async () => {
    /*
     * A deployment that forgot the variable must not quietly turn the
     * protection off — that is the one failure nobody would notice.
     */
    delete process.env.RECAPTCHA_SECRET_KEY;
    const spy = vi.fn();
    vi.stubGlobal("fetch", spy);
    const result = await verifyRecaptcha("token", "quiz");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("secret-not-configured");
    expect(spy).not.toHaveBeenCalled();
  });

  it("never sends the secret anywhere but Google", async () => {
    const spy = googleSays({ success: true, score: 0.9, action: "quiz" });
    vi.stubGlobal("fetch", spy);
    await verifyRecaptcha("token", "quiz");
    const [url, init] = spy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://www.google.com/recaptcha/api/siteverify");
    expect(String(init.body)).toContain("secret=test-secret");
  });
});

describe("recaptchaRefusal", () => {
  it("gives the refused person a way through", () => {
    /* Most people who see this are real — a bot does not read it. */
    const message = recaptchaRefusal("1300 336 572");
    expect(message).toContain("1300 336 572");
    expect(message).not.toMatch(/score|token|recaptcha|bot/i);
  });
});
