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

  it("excludes compliance-gated routes", async () => {
    const urls = (await sitemapWith(true)).map((entry) => entry.url);
    expect(urls).not.toContain(`${SITE_URL}/medicinal-cannabis/`);
    expect(urls).not.toContain(`${SITE_URL}/our-practitioners/`);
  });

  it("gives the homepage the highest priority", async () => {
    const home = (await sitemapWith(true)).find((entry) => entry.url === `${SITE_URL}/`);
    expect(home?.priority).toBe(1);
  });
});
