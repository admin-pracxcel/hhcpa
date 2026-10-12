import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The browser half. What matters is that it never gets in the patient's way:
 * a blocked script, a slow Google or a missing key all resolve rather than
 * throw, so a submit button is never left spinning on a third party.
 */
describe("recaptcha (browser)", () => {
  beforeEach(() => {
    vi.resetModules();
    document.head.innerHTML = "";
    delete (window as unknown as { grecaptcha?: unknown }).grecaptcha;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const load = async () => await import("./recaptcha");

  it("adds no script and no token when no site key is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "");
    const { loadRecaptcha, recaptchaToken } = await load();
    expect(await loadRecaptcha()).toBe(false);
    expect(await recaptchaToken("quiz")).toBeNull();
    expect(document.getElementById("hhcp-recaptcha")).toBeNull();
  });

  it("injects the script once, however many forms ask", async () => {
    /* The newsletter is in the footer of every page alongside other forms;
       each asking for its own copy would be three script tags. */
    vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "site-key");
    const { loadRecaptcha } = await load();
    void loadRecaptcha();
    void loadRecaptcha();
    void loadRecaptcha();
    const tags = document.querySelectorAll("script#hhcp-recaptcha");
    expect(tags).toHaveLength(1);
    expect(tags[0].getAttribute("src")).toContain("render=site-key");
  });

  it("resolves false when the script is blocked", async () => {
    /* An ad blocker or a privacy browser. Ordinary here, not an exception. */
    vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "site-key");
    const { loadRecaptcha } = await load();
    const pending = loadRecaptcha();
    document.getElementById("hhcp-recaptcha")?.dispatchEvent(new Event("error"));
    expect(await pending).toBe(false);
  });

  it("returns a token for the action it was asked for", async () => {
    vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "site-key");
    const execute = vi.fn(async () => "a-token");
    (window as unknown as { grecaptcha: unknown }).grecaptcha = {
      ready: (cb: () => void) => cb(),
      execute,
    };
    const { recaptchaToken } = await load();
    expect(await recaptchaToken("contact")).toBe("a-token");
    expect(execute).toHaveBeenCalledWith("site-key", { action: "contact" });
  });

  it("returns null rather than throwing when execute fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "site-key");
    (window as unknown as { grecaptcha: unknown }).grecaptcha = {
      ready: (cb: () => void) => cb(),
      execute: async () => { throw new Error("nope"); },
    };
    const { recaptchaToken } = await load();
    await expect(recaptchaToken("quiz")).resolves.toBeNull();
  });

  it("returns null for an empty token", async () => {
    vi.stubEnv("NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "site-key");
    (window as unknown as { grecaptcha: unknown }).grecaptcha = {
      ready: (cb: () => void) => cb(),
      execute: async () => "",
    };
    const { recaptchaToken } = await load();
    expect(await recaptchaToken("quiz")).toBeNull();
  });

  it("carries the notice Google requires when the badge is hidden", async () => {
    const { RECAPTCHA_NOTICE } = await load();
    const text =
      RECAPTCHA_NOTICE.before + RECAPTCHA_NOTICE.privacy.label +
      RECAPTCHA_NOTICE.between + RECAPTCHA_NOTICE.terms.label +
      RECAPTCHA_NOTICE.after;
    expect(text).toBe(
      "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.",
    );
    /* "Google Privacy Policy", so it cannot be confused with the footer's
       own Privacy Policy link by anyone navigating by link list. */
    expect(RECAPTCHA_NOTICE.privacy.label).toBe("Google Privacy Policy");
    expect(RECAPTCHA_NOTICE.privacy.href).toContain("policies.google.com/privacy");
    expect(RECAPTCHA_NOTICE.terms.href).toContain("policies.google.com/terms");
  });
});
