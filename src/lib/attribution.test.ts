import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";

import { captureLeadSource, getLeadSource } from "./attribution";

/**
 * Lead-source precedence.
 *
 * The rule, in Bilal's words on 2026-11-09: a search visit records
 * "organic"; an existing source is never overwritten; except that organic is
 * replaced when the visitor later arrives through a paid campaign.
 */

/** Clears every cookie this module writes. */
function clearCookies() {
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; path=/; max-age=0`;
  }
}

/** Simulates one page view: a URL, and the referrer the document loaded with. */
function visit(url: string, referrer = "") {
  vi.stubGlobal("location", new URL(url));
  Object.defineProperty(document, "referrer", {
    value: referrer,
    configurable: true,
  });
  captureLeadSource();
}

/** A fresh visit: the session marker is gone, as it would be in a new tab. */
function endSession() {
  document.cookie = "hhcp_visit=; path=/; max-age=0";
}

const SITE = "https://horizonhealthcarepartners.com.au";

describe("lead source", () => {
  beforeEach(() => {
    clearCookies();
    vi.stubGlobal("window", globalThis);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("records a search visit as organic", () => {
    visit(`${SITE}/`, "https://www.google.com/");
    expect(getLeadSource().leadSource).toBe("organic");
  });

  it("recognises the other search engines too", () => {
    for (const engine of [
      "https://www.bing.com/search?q=x",
      "https://duckduckgo.com/",
      "https://au.search.yahoo.com/",
      "https://www.ecosia.org/",
      "https://search.brave.com/",
      "https://yandex.com/",
    ]) {
      clearCookies();
      visit(`${SITE}/`, engine);
      expect(getLeadSource().leadSource, engine).toBe("organic");
    }
  });

  it("ignores a referrer that is not a search engine", () => {
    visit(`${SITE}/`, "https://somehealthblog.example/post");
    expect(getLeadSource().leadSource).toBe("");
  });

  it("does not treat an internal link as a referral", () => {
    visit(`${SITE}/pricing/`, `${SITE}/`);
    expect(getLeadSource().leadSource).toBe("");
  });

  it("never overwrites a source that is already set", () => {
    visit(`${SITE}/?utm_source=newsletter`);
    endSession();
    visit(`${SITE}/`, "https://www.google.com/");
    expect(getLeadSource().leadSource).toBe("newsletter");
  });

  /* The one exception. */
  it("lets a paid campaign replace organic", () => {
    visit(`${SITE}/`, "https://www.google.com/");
    expect(getLeadSource().leadSource).toBe("organic");

    endSession();
    visit(`${SITE}/?utm_source=google_ads`);
    expect(getLeadSource().leadSource).toBe("google_ads");
  });

  it("lets meta_ads replace organic too", () => {
    visit(`${SITE}/`, "https://www.google.com/");
    endSession();
    visit(`${SITE}/?utm_source=meta_ads`);
    expect(getLeadSource().leadSource).toBe("meta_ads");
  });

  it("does not let one paid campaign replace another", () => {
    visit(`${SITE}/?utm_source=google_ads`);
    endSession();
    visit(`${SITE}/?utm_source=meta_ads`);
    expect(getLeadSource().leadSource).toBe("google_ads");
  });

  it("does not let organic replace a paid source", () => {
    visit(`${SITE}/?utm_source=google_ads`);
    endSession();
    visit(`${SITE}/`, "https://www.google.com/");
    expect(getLeadSource().leadSource).toBe("google_ads");
  });

  /*
   * ⚠️ Google Ads auto-tagging sets gclid and no utm_source, and the referrer
   * on that click is google.com. Read the referrer first and every paid
   * Google click is filed as organic.
   */
  it("reads a Google Ads click id as paid, not as a search visit", () => {
    visit(`${SITE}/?gclid=abc123`, "https://www.google.com/");
    expect(getLeadSource().leadSource).toBe("google_ads");
  });

  it("treats wbraid and gbraid the same way", () => {
    for (const id of ["wbraid", "gbraid"]) {
      clearCookies();
      visit(`${SITE}/?${id}=abc`, "https://www.google.com/");
      expect(getLeadSource().leadSource, id).toBe("google_ads");
    }
  });

  it("lets a gclid visit replace organic", () => {
    visit(`${SITE}/`, "https://www.google.com/");
    endSession();
    visit(`${SITE}/?gclid=abc`, "https://www.google.com/");
    expect(getLeadSource().leadSource).toBe("google_ads");
  });

  /*
   * ⚠️ document.referrer does not change on a client-side navigation, and
   * this runs on every route change. Without the per-visit marker, page two
   * of a paid visit reclassifies the lead as organic.
   */
  it("does not downgrade a paid visit on the next page view", () => {
    visit(`${SITE}/?gclid=abc`, "https://www.google.com/");
    /* Same visit, next page: no click id in the URL, referrer unchanged. */
    visit(`${SITE}/mens-health/`, "https://www.google.com/");
    expect(getLeadSource().leadSource).toBe("google_ads");
    expect(getLeadSource().leadSourceLatest).toBe("google_ads");
  });

  it("still honours a campaign that appears mid-visit", () => {
    visit(`${SITE}/`, "https://www.google.com/");
    visit(`${SITE}/?utm_source=google_ads`);
    expect(getLeadSource().leadSourceLatest).toBe("google_ads");
  });

  it("moves last touch on every visit that carries a source", () => {
    visit(`${SITE}/?utm_source=newsletter`);
    endSession();
    visit(`${SITE}/`, "https://www.bing.com/");
    expect(getLeadSource().leadSource).toBe("newsletter");
    expect(getLeadSource().leadSourceLatest).toBe("organic");
  });

  it("records nothing for a direct visit", () => {
    visit(`${SITE}/`, "");
    expect(getLeadSource().leadSource).toBe("");
    expect(getLeadSource().leadSourceLatest).toBe("");
  });
});
