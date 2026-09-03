import { describe, expect, it } from "vitest";

/**
 * Every page hero shows two buttons. They have to do two different things.
 *
 * They did not: "Check your eligibility" and "Book a consultation" sat side by
 * side on some thirty pages and both opened `/quiz/`. Two labels, one
 * destination, which reads as a broken link rather than a choice. The second
 * is now the phone.
 *
 * This walks the content files rather than checking the pages that were fixed,
 * because the failure is easy to reintroduce one page at a time — the pairs are
 * declared per page, and a new service page copied from an old one would bring
 * the duplicate back with it.
 */
/* The negation matters: without it the glob imports the sibling test files and
   re-runs every suite in `src/content` inside this one. */
const MODULES = import.meta.glob(["./**/*.ts", "!./**/*.test.ts"], {
  eager: true,
}) as Record<
  string,
  Record<string, unknown>
>;

interface Cta {
  readonly label: string;
  readonly href: string;
}

function isCta(value: unknown): value is Cta {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.label === "string" && typeof candidate.href === "string"
  );
}

/** Every hero across the content files, with the file and export it came from. */
const HEROES = Object.entries(MODULES).flatMap(([file, module]) =>
  Object.entries(module).flatMap(([name, value]) => {
    if (typeof value !== "object" || value === null) return [];
    const hero = (value as { hero?: unknown }).hero;
    if (typeof hero !== "object" || hero === null) return [];
    const { primary, secondary } = hero as Record<string, unknown>;
    if (!isCta(primary) || !isCta(secondary)) return [];
    return [{ where: `${file} → ${name}`, primary, secondary }];
  }),
);

describe("page hero CTAs", () => {
  it("finds the heroes to check", () => {
    /* A glob that silently matched nothing would make every assertion below
       vacuously pass. */
    expect(HEROES.length).toBeGreaterThan(20);
  });

  it("never points both buttons at the same place", () => {
    for (const hero of HEROES) {
      expect(hero.secondary.href, hero.where).not.toBe(hero.primary.href);
    }
  });

  it("gives the two buttons different labels", () => {
    for (const hero of HEROES) {
      expect(hero.secondary.label, hero.where).not.toBe(hero.primary.label);
    }
  });
});
