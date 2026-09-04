import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SITE_URL } from "@/lib/schema";

/*
 * SITE_INDEXABLE is read at module load, so the flag has to be set before the
 * sitemap module is imported and the registry reset between the two states.
 */
async function sitemapWith(indexable: boolean) {
  vi.resetModules();
  if (indexable) vi.stubEnv("SITE_INDEXABLE", "true");
  else vi.stubEnv("SITE_INDEXABLE", "");
  const mod = await import("./sitemap");
  return mod.default();
}

describe("sitemap", () => {
  beforeEach(() => vi.stubEnv("SITE_INDEXABLE", "true"));
  afterEach(() => vi.unstubAllEnvs());

  it("is empty where the deployment must not be indexed", async () => {
    /* A staging host offering a sitemap of production URLs invites exactly the
       indexing the noindex on every page is there to prevent. */
    expect(await sitemapWith(false)).toEqual([]);
    expect((await sitemapWith(true)).length).toBeGreaterThan(30);
  });

  it("lists every public route as an absolute url", async () => {
    const entries = await sitemapWith(true);
    expect(entries.length).toBeGreaterThan(30);
    for (const entry of entries) {
      expect(entry.url.startsWith(SITE_URL)).toBe(true);
    }
  });

  it("lists the published pages and none the remediation retired", async () => {
    /*
     * A sitemap entry for a URL that 301s is an invitation to index the old
     * address, and two of the retired paths named a restricted prescription
     * class in the URL string itself (HHCPA_Remediation_Change_Spec.md §C).
     */
    const urls = (await sitemapWith(true)).map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}/our-practitioners/`);
    expect(urls).toContain(`${SITE_URL}/weight-management/`);
    expect(urls).toContain(`${SITE_URL}/mens-health/low-testosterone/`);

    for (const retired of [
      "/medicinal-cannabis/",
      "/weight-loss-peptides/",
      "/weight-loss-peptides/weight-loss-injections/",
      "/mens-health/testosterone-replacement-therapy/",
      "/mens-health/hair-loss-treatment/",
      "/womens-health/menopause-treatment/",
    ]) {
      expect(urls).not.toContain(`${SITE_URL}${retired}`);
    }
  });

  it("gives the homepage the highest priority", async () => {
    const home = (await sitemapWith(true)).find((entry) => entry.url === `${SITE_URL}/`);
    expect(home?.priority).toBe(1);
  });
});
