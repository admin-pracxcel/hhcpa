import { describe, expect, it } from "vitest";

import { ARTICLES, articleCards } from "./articles";

/**
 * The homepage teases these articles and `/articles/` lists them, in the same
 * cards. They used to come from two places: the target's own hardcoded copies
 * in `BlogSection`, and `articles.ts`. The two disagreed about every one of
 * topic, read time and date for all three articles — "General · 3 minutes ·
 * May 05, 2026" on the homepage against "Weight management · 6 min read ·
 * 26 Jan 2026" on the article itself.
 *
 * Both pages now call this, so what these assert is that it stays the one
 * source rather than a third copy that drifts from the articles.
 */
describe("article cards", () => {
  it("carries each article's own facts through unchanged", () => {
    const cards = articleCards();
    expect(cards).toHaveLength(ARTICLES.length);

    for (const [index, card] of cards.entries()) {
      const article = ARTICLES[index];
      expect(card.title).toBe(article.title);
      expect(card.topic).toBe(article.topic);
      expect(card.readTime).toBe(article.readTime);
      expect(card.date).toBe(article.date);
      expect(card.image).toBe(article.image);
      expect(card.alt).toBe(article.imageAlt);
    }
  });

  it("links each card at the article's own page", () => {
    for (const card of articleCards()) {
      const slug = card.href.replace(/^\/article\/|\/$/g, "");
      expect(ARTICLES.map((article) => article.slug)).toContain(slug);
    }
  });

  it("gives the teaser the newest few and the index all of them", () => {
    /* The homepage passes a limit; the knowledge hub passes none. */
    expect(articleCards(3)).toHaveLength(Math.min(3, ARTICLES.length));
    expect(articleCards()).toHaveLength(ARTICLES.length);
  });

  it("shows the same facts on the teaser as on the index", () => {
    const teaser = articleCards(3);
    const index = articleCards();
    for (const [position, card] of teaser.entries()) {
      expect(card).toEqual(index[position]);
    }
  });
});
