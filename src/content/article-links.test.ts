import { describe, expect, it } from "vitest";

import { ARTICLES, type ArticleBlock, type ArticleLink } from "./articles";
import { ROUTES } from "./routes";
import { isExternalHref } from "@/lib/external-link";

/**
 * Links inside article copy.
 *
 * Each link names the phrase it wraps rather than being written as markup, so
 * the copy stays readable. The cost of that is a phrase and a string that can
 * drift apart in an edit: the renderer drops a link whose phrase it cannot
 * find, silently and with no visible damage. These tests are the thing that
 * notices.
 */
function linksOf(block: ArticleBlock): readonly ArticleLink[] {
  return "links" in block && block.links ? block.links : [];
}

function textOf(block: ArticleBlock): string {
  if (block.kind === "ul" || block.kind === "ol") return block.items.join(" ");
  if (block.kind === "callout") return block.text;
  if (block.kind === "p") return block.text;
  return "";
}

describe("article links", () => {
  const all = ARTICLES.flatMap((article) =>
    article.blocks.map((block) => ({ article, block })),
  );

  it("finds links to check", () => {
    /* The assertions below iterate over links. With none they would pass
       having checked nothing. */
    const count = all.reduce((n, { block }) => n + linksOf(block).length, 0);
    expect(count).toBeGreaterThan(5);
  });

  it("anchors every link to a phrase that is actually in the copy", () => {
    for (const { article, block } of all) {
      const text = textOf(block);
      for (const link of linksOf(block)) {
        expect(
          text.includes(link.text),
          `${article.slug}: "${link.text}" is not in the copy it links`,
        ).toBe(true);
      }
    }
  });

  it("points every internal link at a page this site serves", () => {
    const known = new Set<string>([
      ...ROUTES.map((route) => route.path),
      ...ARTICLES.map((a) => `/article/${a.slug}/`),
    ]);

    for (const { article, block } of all) {
      for (const link of linksOf(block)) {
        if (isExternalHref(link.href)) continue;
        expect(known, `${article.slug} → ${link.href}`).toContain(link.href);
      }
    }
  });

  it("writes internal links as paths, not as our own domain", () => {
    /* An absolute self-link costs a redirect and reads as offsite to the
       helper that decides target and rel. */
    for (const { article, block } of all) {
      for (const link of linksOf(block)) {
        expect(
          link.href,
          `${article.slug} → ${link.href}`,
        ).not.toContain("horizonhealthcarepartners.com.au");
      }
    }
  });

  it("uses https for every external link", () => {
    for (const { article, block } of all) {
      for (const link of linksOf(block)) {
        if (!isExternalHref(link.href)) continue;
        expect(link.href, article.slug).toMatch(/^https:\/\//);
      }
    }
  });

  /*
   * Every image an article references must exist AND be committed.
   *
   * ⚠️ On disk is not enough, and this test learned that the hard way. The
   * first version checked `existsSync` only. It passed on the machine that
   * had just saved the files into public/images, the article shipped, and
   * all three images 404'd in production because the commit staged `src/`
   * and the images live under `public/`.
   *
   * A file that is present locally and untracked is invisible to the build,
   * and nothing else in the pipeline notices: the markup is correct, the
   * page renders, the alt text is right, and the images are simply gone.
   */
  it("ships every image the articles reference", async () => {
    const { existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    const { execFileSync } = await import("node:child_process");

    const sources = ARTICLES.flatMap((article) =>
      [
        article.image,
        ...article.blocks.flatMap((block) =>
          block.kind === "image" ? [block.src] : [],
        ),
      ].map((src) => ({ slug: article.slug, src })),
    );

    for (const { slug, src } of sources) {
      expect(
        existsSync(join(process.cwd(), "public", src)),
        `${slug} → ${src} is not on disk`,
      ).toBe(true);
    }

    /*
     * Tracked, not merely present. Skipped where git is unavailable rather
     * than failing, so the suite still runs outside a checkout.
     */
    let tracked: Set<string>;
    try {
      tracked = new Set(
        execFileSync("git", ["ls-files", "public/images"], {
          encoding: "utf8",
        })
          .split("\n")
          .filter(Boolean),
      );
    } catch {
      return;
    }

    for (const { slug, src } of sources) {
      expect(
        tracked.has(`public${src}`),
        `${slug} → ${src} exists but is not committed, so it will 404 in production`,
      ).toBe(true);
    }
  });
});

/*
 * The money-page callout is template copy, not the article's own words, and
 * it is opt-in. Bilal's instruction on 2026-10-29: keep it on the two
 * migrated articles, do not add it to new ones unless asked.
 *
 * Pinned by slug rather than by count so that adding an article cannot
 * quietly acquire one, and removing it from a migrated article is a
 * deliberate edit to this list rather than a silent change.
 */
describe("the money-page callout", () => {
  const WITH_CALLOUT = [
    "why-weight-loss-is-difficult-to-maintain-and-what-actually-works-long-term",
    "why-sleep-is-essential-for-chronic-pain-weight-and-overall-health",
  ];

  it("appears only on the articles it was asked for", () => {
    for (const article of ARTICLES) {
      const expected = WITH_CALLOUT.includes(article.slug);
      expect(
        article.moneyPage !== undefined,
        expected
          ? `${article.slug} should carry a money-page callout`
          : `${article.slug} must not carry one unless it was asked for`,
      ).toBe(expected);
    }
  });

  it("points at a page this site serves where it is set", () => {
    const known = new Set<string>(ROUTES.map((route) => route.path));
    for (const article of ARTICLES) {
      if (!article.moneyPage) continue;
      expect(known, `${article.slug} → ${article.moneyPage.href}`).toContain(
        article.moneyPage.href,
      );
    }
  });
});

/*
 * The headline and the meta title are different strings for different places.
 *
 * `title` is the document's H1 and goes on the page, the card and the
 * breadcrumb. `metaTitle` is its "Meta title" line and goes in <title> only.
 *
 * They were collapsed into one field when the first two articles shipped on
 * 2026-10-29, so readers saw the search-optimised meta title as the headline:
 * "Why Weight Comes Back After Dieting: What Research Shows" on a page whose
 * document said "Why Weight Comes Back After a Diet, and What Changes the
 * Pattern". Nothing failed — both are valid strings.
 */
describe("article titles", () => {
  it("keeps the headline and the meta title apart where both exist", () => {
    for (const article of ARTICLES) {
      if (article.metaTitle === undefined) continue;
      expect(
        article.metaTitle,
        `${article.slug}: metaTitle duplicates the headline, so one of them is wrong`,
      ).not.toBe(article.title);
    }
  });

  it("never uses a meta title as the headline", () => {
    /*
     * A heuristic, deliberately. A meta title is written for a search result
     * and reads like one — it carries a colon and a promise ("X: What
     * Research Shows"), and it is short. A headline is a sentence. Neither
     * rule is absolute, so this only fires when BOTH hold and the document
     * supplied a separate meta title to use instead.
     */
    for (const article of ARTICLES) {
      if (article.metaTitle === undefined) continue;
      const looksLikeMeta =
        article.title.includes(":") && article.title.length < 50;
      expect(
        looksLikeMeta,
        `${article.slug}: "${article.title}" reads like a meta title, not a headline`,
      ).toBe(false);
    }
  });

  it("stays inside what a search result will show", () => {
    /*
     * Google truncates around 60 characters.
     *
     * Only where a document supplied a meta title. The two migrated articles
     * have one title doing both jobs — their headline is 75 characters and
     * will truncate — but that is a content decision on copy carried over
     * from the live site, not a field in the wrong place.
     */
    for (const article of ARTICLES) {
      if (article.metaTitle === undefined) continue;
      expect(
        article.metaTitle.length,
        `${article.slug}: meta title is ${article.metaTitle.length} chars`,
      ).toBeLessThanOrEqual(60);
    }
  });
});
