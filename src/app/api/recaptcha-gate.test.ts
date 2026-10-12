import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST as contact } from "./contact/route";
import { POST as newsletter } from "./newsletter/route";
import { POST as quiz } from "./quiz/route";
import { REQUIRED_CONSENT_IDS } from "@/content/quiz";
import { CLINIC } from "@/content/clinic";

/**
 * The gate itself, across all three routes.
 *
 * Bilal's instruction of 2026-10-12: nothing that scores as a bot reaches the
 * client, and there is no downstream filter to recover it. So a refusal here
 * is the end of that submission — which makes "did it actually refuse" and
 * "did it actually forward" both worth asserting on every route, not just the
 * one that happened to get a test first.
 */
const SITEVERIFY = "https://www.google.com/recaptcha/api/siteverify";
const isVerify = (url: unknown) => String(url).startsWith(SITEVERIFY);

function google(body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string | URL | Request) =>
      isVerify(url)
        ? new Response(JSON.stringify(body), { status: 200 })
        : new Response("{}", { status: 200 }),
    ),
  );
}

const forwarded = () =>
  vi.mocked(fetch).mock.calls.filter(([url]) => !isVerify(url));

const post = (url: string, body: unknown) =>
  new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const ROUTES = [
  {
    name: "quiz",
    action: "quiz",
    run: quiz,
    body: {
      contact: {
        firstName: "Jane",
        lastName: "Citizen",
        email: "jane@example.com",
        phone: "412345678",
      },
      consents: Object.fromEntries(REQUIRED_CONSENT_IDS.map((id) => [id, true])),
    },
  },
  {
    name: "contact",
    action: "contact",
    run: contact,
    body: {
      firstName: "Jane",
      lastName: "Citizen",
      email: "jane@example.com",
      message: "Hello",
    },
  },
  {
    name: "newsletter",
    action: "newsletter",
    run: newsletter,
    body: { email: "jane@example.com" },
  },
] as const;

describe("the reCAPTCHA gate", () => {
  beforeEach(() => {
    process.env.RECAPTCHA_SECRET_KEY = "test-secret";
    process.env.QUIZ_WEBHOOK_URL = "http://webhook.test/quiz";
    process.env.CONTACT_WEBHOOK_URL = "http://webhook.test/contact";
    process.env.NEWSLETTER_WEBHOOK_URL = "http://webhook.test/news";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.RECAPTCHA_SECRET_KEY;
    delete process.env.QUIZ_WEBHOOK_URL;
    delete process.env.CONTACT_WEBHOOK_URL;
    delete process.env.NEWSLETTER_WEBHOOK_URL;
  });

  for (const route of ROUTES) {
    describe(`/api/${route.name}`, () => {
      it("forwards a submission that verifies", async () => {
        google({ success: true, score: 0.9, action: route.action });
        const response = await route.run(
          post(`http://localhost/api/${route.name}`, {
            ...route.body,
            recaptchaToken: "good",
          }),
        );
        expect(response.status).toBe(200);
        expect(forwarded()).toHaveLength(1);
      });

      it("refuses a low score and forwards nothing", async () => {
        google({ success: true, score: 0.1, action: route.action });
        const response = await route.run(
          post(`http://localhost/api/${route.name}`, {
            ...route.body,
            recaptchaToken: "bad",
          }),
        );
        expect(response.status).toBe(400);
        expect(forwarded()).toHaveLength(0);
      });

      it("refuses a missing token, which is the obvious bypass", async () => {
        /* A bot that simply omits it. If this passed, none of the rest
           would matter. */
        google({ success: true, score: 0.9, action: route.action });
        const response = await route.run(
          post(`http://localhost/api/${route.name}`, route.body),
        );
        expect(response.status).toBe(400);
        expect(forwarded()).toHaveLength(0);
      });

      it("refuses a token minted for a different form", async () => {
        google({ success: true, score: 0.9, action: "something-else" });
        const response = await route.run(
          post(`http://localhost/api/${route.name}`, {
            ...route.body,
            recaptchaToken: "stolen",
          }),
        );
        expect(response.status).toBe(400);
        expect(forwarded()).toHaveLength(0);
      });

      it("tells a refused person to call, not what went wrong", async () => {
        google({ success: true, score: 0.1, action: route.action });
        const response = await route.run(
          post(`http://localhost/api/${route.name}`, {
            ...route.body,
            recaptchaToken: "bad",
          }),
        );
        const body = (await response.json()) as { error?: string };
        expect(body.error).toContain(CLINIC.phone);
        expect(body.error).not.toMatch(/score|token|recaptcha/i);
      });
    });
  }

  it("refuses everything when the secret is missing", async () => {
    /* A deployment that forgot the variable must not quietly serve an
       unprotected site. */
    delete process.env.RECAPTCHA_SECRET_KEY;
    google({ success: true, score: 0.9, action: "quiz" });
    const response = await quiz(
      post("http://localhost/api/quiz", {
        ...ROUTES[0].body,
        recaptchaToken: "good",
      }),
    );
    expect(response.status).toBe(400);
    expect(forwarded()).toHaveLength(0);
  });

  it("still lets the honeypot answer first, so a bot learns nothing", async () => {
    /*
     * The honeypot replies 200 on purpose. If the reCAPTCHA refusal ran
     * first it would answer 400 and tell a bot its filled field was seen.
     */
    google({ success: true, score: 0.9, action: "quiz" });
    const response = await quiz(
      post("http://localhost/api/quiz", {
        ...ROUTES[0].body,
        company: "ACME",
        recaptchaToken: "good",
      }),
    );
    expect(response.status).toBe(200);
    expect(forwarded()).toHaveLength(0);
  });
});
