import { describe, it, expect } from "vitest";
import { PRICES, formatPrice, PROVISIONAL_PRICE_KEYS } from "./pricing";

describe("formatPrice", () => {
  it("renders a plain fee without a 'from' prefix", () => {
    // Derived, not literal: the fee has changed twice and a literal here
    // fails the build for a reason that has nothing to do with formatting.
    expect(formatPrice("firstConsult")).toBe(`$${PRICES.firstConsult.amount}`);
  });

  it("prefixes 'from' where the fee is a starting price", () => {
    expect(formatPrice("weightManagement")).toBe("from $99");
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
 * An advertised "from" price is the INITIAL consultation, not the cheapest
 * fee the service charges.
 *
 * That is how Ranjeeta uses it on her own site, and it is the only reading
 * under which all of her statements agree — see the note on weightManagement
 * in pricing.ts. Read as "the cheapest fee", nearly every row collapses to
 * the $59 follow-up and the prices stop telling a patient which service costs
 * what.
 *
 * Holistic care is the single exception, by Bilal's instruction. It is
 * asserted here rather than excluded, so it cannot quietly become two
 * exceptions, and so nobody "fixes" it later without meeting this comment.
 */
describe("advertised from-prices", () => {
  const PER_VISIT = {
    weightManagement: {
      initial: "weightLossInitial",
      cheapest: "weightLossFollowUp",
    },
    holisticCare: { initial: "holisticInitial", cheapest: "followUpConsult" },
  } as const;

  const amount = (key: string) =>
    PRICES[key as keyof typeof PRICES].amount;

  it("advertises weight management at its initial consultation", () => {
    expect(amount("weightManagement")).toBe(amount("weightLossInitial"));
  });

  it("advertises holistic care at its follow-up, the one exception", () => {
    expect(amount("holisticCare")).toBe(amount("followUpConsult"));
    expect(amount("holisticCare")).toBeLessThan(amount("holisticInitial"));
  });

  it("keeps every per-visit service marked as a from-price", () => {
    for (const key of Object.keys(PER_VISIT)) {
      /* A from-price rendered without "from" reads as the only price. */
      expect(PRICES[key as keyof typeof PRICES].from, key).toBe(true);
    }
  });

  it("keeps each initial above the cheapest, or the split says nothing", () => {
    for (const [key, fees] of Object.entries(PER_VISIT)) {
      expect(amount(fees.initial), key).toBeGreaterThan(amount(fees.cheapest));
    }
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
