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
   * Every body image must exist on disk. A missing one is a broken image in
   * the middle of a published article, and nothing else in the build fails.
   */
  it("ships every image the articles reference", async () => {
    const { existsSync } = await import("node:fs");
    const { join } = await import("node:path");

    for (const article of ARTICLES) {
      const sources = [
        article.image,
        ...article.blocks.flatMap((block) =>
          block.kind === "image" ? [block.src] : [],
        ),
      ];
      for (const src of sources) {
        expect(
          existsSync(join(process.cwd(), "public", src)),
          `${article.slug} → ${src}`,
        ).toBe(true);
      }
    }
  });
});
