import { describe, expect, it } from "vitest";

import { ARTICLES, articleCards, formatArticleDate } from "./articles";

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
      /* The one field that is transformed rather than passed through: stored
         as ISO for the schema, rendered for the card. */
      expect(card.date).toBe(formatArticleDate(article.date));
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

/*
 * Dates were stored as "26 Jan 2026" until 2026-10-29 and passed straight
 * into `datePublished`, which schema.org cannot parse — Google ignored the
 * publication date on every article on the site. One ISO value now feeds both
 * the schema and the display, so they cannot disagree.
 */
describe("article dates", () => {
  it("stores every date as ISO 8601", () => {
    for (const article of ARTICLES) {
      expect(article.date, article.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(article.date)), article.slug).toBe(false);
    }
  });

  it("renders the display form the cards actually show", () => {
    expect(formatArticleDate("2026-01-26")).toBe("26 Jan 2026");
  });

  it("does not shift the date with the machine's timezone", () => {
    /* A build in another timezone moving a publication date by a day is the
       kind of fault nobody thinks to look for. */
    const previous = process.env.TZ;
    try {
      process.env.TZ = "Pacific/Kiritimati";
      expect(formatArticleDate("2026-01-26")).toBe("26 Jan 2026");
      process.env.TZ = "Pacific/Midway";
      expect(formatArticleDate("2026-01-26")).toBe("26 Jan 2026");
    } finally {
      process.env.TZ = previous;
    }
  });

  it("treats an unrevised article as modified when published", () => {
    for (const article of ARTICLES) {
      const modified = article.dateModified ?? article.date;
      expect(Date.parse(modified)).toBeGreaterThanOrEqual(
        Date.parse(article.date),
      );
    }
  });
});
