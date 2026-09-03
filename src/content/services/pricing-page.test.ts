import { describe, expect, it } from "vitest";

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

  it("lists every price in the record exactly once", () => {
    const all = Object.keys(PRICES) as PriceKey[];

    // Nothing missing: a price that exists but is not on the pricing page is a
    // fee a patient can be charged without being able to look it up.
    expect([...shown].sort()).toEqual([...all].sort());
    // Nothing shown twice across the two modules.
    expect(new Set(shown).size).toBe(shown.length);
  });

  it("carries no hardcoded dollar figure outside the price modules", () => {
    // The intro, the FAQ answers and the free-quiz band are prose; a literal
    // price in any of them would silently outlive a change to pricing.ts.
    expect(PRICING_PAGE.faq).toBeDefined();
    const prose = [
      PRICING_PAGE.intro,
      ...(PRICING_PAGE.faq?.items ?? []).map((item) => item.answer),
      ...PRICING_PAGE.modules.flatMap((module) => {
        if (module.kind === "statement") return module.paragraphs;
        if (module.kind === "priceCards") {
          return [module.feature.title, module.feature.body];
        }
        if (module.kind === "priceTiles") return [module.note ?? ""];
        return [];
      }),
    ].join(" ");

    expect(prose).not.toMatch(/\$\d/);
  });
});
