import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { SITE_URL } from "@/lib/schema";

describe("sitemap", () => {
  it("lists every public route as an absolute url", () => {
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(30);
    for (const entry of entries) {
      expect(entry.url.startsWith(SITE_URL)).toBe(true);
    }
  });

  it("excludes compliance-gated routes", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).not.toContain(`${SITE_URL}/medicinal-cannabis/`);
    expect(urls).not.toContain(`${SITE_URL}/our-practitioners/`);
  });

  it("gives the homepage the highest priority", () => {
    const home = sitemap().find((entry) => entry.url === `${SITE_URL}/`);
    expect(home?.priority).toBe(1);
  });
});
