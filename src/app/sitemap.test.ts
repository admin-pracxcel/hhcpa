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

  /*
   * The articles were absent entirely until 2026-10-29: only the /articles/
   * hub was listed, so every published article was invisible to the sitemap.
   * These pin the derivation rather than a count, because the blog programme
   * adds 48 more and a hard-coded number would have to be edited 48 times —
   * which is the same hand-maintenance that let them go missing.
   */
  it("lists every article, derived from ARTICLES", async () => {
    const { ARTICLES } = await import("@/content/articles");
    const urls = (await sitemapWith(true)).map((entry) => entry.url);
    const articleUrls = urls.filter((url) =>
      url.startsWith(`${SITE_URL}/article/`),
    );

    expect(articleUrls).toHaveLength(ARTICLES.length);
    for (const article of ARTICLES) {
      expect(urls).toContain(`${SITE_URL}/article/${article.slug}/`);
    }
  });

  it("uses the singular /article/ path, not the plural", async () => {
    /* The plural 404s. The blog programme specified it and every slug was
       wrong; the audit's decision was to keep singular. A sitemap full of
       404s is worse than one that omits them. */
    const urls = (await sitemapWith(true)).map((entry) => entry.url);
    for (const url of urls.filter((u) => u.includes("/article"))) {
      expect(url.startsWith(`${SITE_URL}/articles/`)).toBe(
        url === `${SITE_URL}/articles/`,
      );
    }
  });

  it("does not list the consolidated sleep article", async () => {
    /* Removed 2026-10-29 and 308'd to the longer one. Listing a URL that
       redirects invites indexing of the address we just retired. */
    const urls = (await sitemapWith(true)).map((entry) => entry.url);
    expect(urls).not.toContain(
      `${SITE_URL}/article/why-sleep-matters-in-chronic-pain/`,
    );
  });
});
