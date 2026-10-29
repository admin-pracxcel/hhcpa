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
