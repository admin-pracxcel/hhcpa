import { describe, expect, it } from "vitest";

import { PRICING_PAGE } from "./pricing-page";
import { PRICES } from "../pricing";
import type { PriceKey } from "../pricing";

/**
 * The pricing page is the canonical list, and nineteen service pages quote
 * figures from the same record. These guard the two ways that can go wrong.
 */
describe("pricing page", () => {
  const tables = PRICING_PAGE.modules.filter(
    (module) => module.kind === "priceTable",
  );

  it("lists every price in the record exactly once", () => {
    const shown = tables.flatMap((table) =>
      table.kind === "priceTable" ? [...table.rows] : [],
    );
    const all = Object.keys(PRICES) as PriceKey[];

    // Nothing missing: a price that exists but is not on the pricing page is a
    // fee a patient can be charged without being able to look it up.
    expect([...shown].sort()).toEqual([...all].sort());
    // Nothing duplicated across the two tables.
    expect(new Set(shown).size).toBe(shown.length);
  });

  it("carries no hardcoded dollar figure outside the tables", () => {
    // The intro and FAQ answers are prose from the source document; a literal
    // price in them would silently outlive a change to pricing.ts.
    expect(PRICING_PAGE.faq).toBeDefined();
    const prose = [
      PRICING_PAGE.intro,
      ...(PRICING_PAGE.faq?.items ?? []).map((item) => item.answer),
      ...PRICING_PAGE.modules.flatMap((module) =>
        module.kind === "statement" ? module.paragraphs : [],
      ),
    ].join(" ");

    expect(prose).not.toMatch(/\$\d/);
  });
});
