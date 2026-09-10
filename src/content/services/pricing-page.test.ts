import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PRICING_PAGE } from "./pricing-page";
import { PRICES } from "../pricing";
import type { PriceKey } from "../pricing";

/**
 * The pricing page is the canonical list, and nineteen service pages quote
 * figures from the same record. These guard the two ways that can go wrong.
 */
describe("pricing page", () => {
  /**
   * Both price modules render as cards now, so the keys are gathered from three
   * places rather than two sets of table rows: the banded free item, the three
   * consultation cards, and the tiles.
   */
  const shown: PriceKey[] = PRICING_PAGE.modules.flatMap((module) => {
    switch (module.kind) {
      case "priceCards":
        return [module.feature.key, ...module.plans.map((plan) => plan.key)];
      case "priceTiles":
        return [...module.rows];
      default:
        return [];
    }
  });

  /**
   * Prices disclosed in prose on this page rather than as a row of their own.
   *
   * `prescriptionsComplex` is the upper tier of the prescriptions ladder. The
   * build spec fixes that table at twelve rows with prescriptions shown as
   * "from $19", so the $49 cannot be a thirteenth row — but it is a fee a
   * patient can be charged, and the rule below exists because such a fee must
   * be findable. It is stated in the tiles' own note, which the second test
   * checks is still there.
   */
  const DISCLOSED_IN_PROSE: readonly PriceKey[] = ["prescriptionsComplex"];

  it("states the prescription ladder's upper tier in the note", () => {
    const tiles = PRICING_PAGE.modules.find((m) => m.kind === "priceTiles");
    const note = tiles !== undefined && "note" in tiles ? (tiles.note ?? "") : "";
    expect(note).toContain(`$${PRICES.prescriptionsComplex.amount}`);
    expect(note).toContain(`$${PRICES.prescriptions.amount}`);
  });

  it("lists every price in the record exactly once", () => {
    const all = (Object.keys(PRICES) as PriceKey[]).filter(
      (key) => !DISCLOSED_IN_PROSE.includes(key),
    );

    // Nothing missing: a price that exists but is not on the pricing page is a
    // fee a patient can be charged without being able to look it up.
    expect([...shown].sort()).toEqual([...all].sort());
    // Nothing shown twice across the two modules.
    expect(new Set(shown).size).toBe(shown.length);
  });

  it("hardcodes no dollar figure anywhere in the page's source", () => {
    /*
     * Scans the source, not the rendered strings.
     *
     * It used to scan the output for a "$" followed by a digit, which is a
     * proxy for "hardcoded" and stopped being an accurate one: the tiles' note
     * now interpolates the prescription tiers from PRICES, so it renders "$19"
     * while being exactly what the rule wants. In source a derived price reads
     * `$${...}` — dollar then brace — and a hardcoded one reads `$19`, so the
     * distinction the rule is actually about is visible here and nowhere else.
     */
    const source = readFileSync(
      join(process.cwd(), "src/content/services/pricing-page.ts"),
      "utf8",
    );
    const withoutComments = source
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/[^\n]*/g, (_m, lead: string) => lead);

    const offenders = withoutComments
      .split("\n")
      .map((line, index) => ({ line: line.trim(), number: index + 1 }))
      .filter(({ line }) => /\$\d/.test(line));

    expect(offenders).toEqual([]);
  });
});
