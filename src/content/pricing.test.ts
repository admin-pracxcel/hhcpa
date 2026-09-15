import { describe, it, expect } from "vitest";
import { PRICES, formatPrice, PROVISIONAL_PRICE_KEYS } from "./pricing";

describe("formatPrice", () => {
  it("renders a plain fee without a 'from' prefix", () => {
    // Derived, not literal: the fee has changed twice and a literal here
    // fails the build for a reason that has nothing to do with formatting.
    expect(formatPrice("firstConsult")).toBe(`$${PRICES.firstConsult.amount}`);
  });

  it("prefixes 'from' where the fee is a starting price", () => {
    /* $69 since 2026-09-15: weight loss prices per visit and the floor is its
       follow-up, not its initial. See the per-visit block below. */
    expect(formatPrice("weightManagement")).toBe("from $69");
  });

  it("renders cents only when the amount has them", () => {
    expect(formatPrice("medicalCertificate")).toBe("from $19.90");
  });

  it("renders Free for a zero amount", () => {
    expect(formatPrice("quiz")).toBe("Free");
  });
});

describe("PRICES", () => {
  it("covers every fee the content doc displays", () => {
    const required = [
      "quiz", "firstConsult", "followUpConsult", "transferConsult",
      "generalConsult", "afterHoursConsult", "priorityConsult",
      "medicalCertificate", "prescriptions", "pathologyReferral",
      "mentalHealth", "mensWomensHealth", "weightManagement", "healthProgram",
    ] as const;
    for (const key of required) {
      expect(PRICES[key]).toBeDefined();
    }
  });
});

/*
 * A "from" price is the least a patient can be charged for that service.
 *
 * Two services price per visit — weight management and holistic care — and
 * their floors are therefore equal to their own cheapest fee, not to a number
 * chosen separately. Left unguarded, someone changes a follow-up and the
 * floor keeps advertising the old one, which under-quotes on the homepage
 * badge, the /services/ box and the /pricing/ table all at once.
 *
 * The floors themselves are Bilal's call of 2026-09-15, from Ranjeeta's email
 * of the same day.
 */
describe("per-visit services advertise their true floor", () => {
  const FLOORS = {
    weightManagement: ["weightLossInitial", "weightLossFollowUp"],
    holisticCare: ["holisticInitial", "followUpConsult", "transferConsult"],
  } as const;

  for (const [floorKey, feeKeys] of Object.entries(FLOORS)) {
    it(`${floorKey} equals the cheapest fee it covers`, () => {
      const cheapest = Math.min(
        ...feeKeys.map((key) => PRICES[key as keyof typeof PRICES].amount),
      );
      expect(PRICES[floorKey as keyof typeof PRICES].amount).toBe(cheapest);
      /* A floor that is not marked "from" reads as the only price. */
      expect(PRICES[floorKey as keyof typeof PRICES].from).toBe(true);
    });
  }

  it("keeps the initial fee above the floor, or the split is pointless", () => {
    expect(PRICES.weightLossInitial.amount).toBeGreaterThan(
      PRICES.weightManagement.amount,
    );
    expect(PRICES.holisticInitial.amount).toBeGreaterThan(
      PRICES.holisticCare.amount,
    );
  });
});

describe("PROVISIONAL_PRICE_KEYS", () => {
  it("lists every price still awaiting written confirmation", () => {
    expect(PROVISIONAL_PRICE_KEYS).toContain("weightManagement");
    expect(PROVISIONAL_PRICE_KEYS).toContain("healthProgram");
  });

  it("is derived from the table rather than hand-maintained", () => {
    const derived = Object.entries(PRICES)
      .filter(([, price]) => price.provisional)
      .map(([key]) => key)
      .sort();
    expect([...PROVISIONAL_PRICE_KEYS].sort()).toEqual(derived);
  });
});
