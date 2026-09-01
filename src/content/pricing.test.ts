import { describe, it, expect } from "vitest";
import { PRICES, formatPrice, PROVISIONAL_PRICE_KEYS } from "./pricing";

describe("formatPrice", () => {
  it("renders a plain fee without a 'from' prefix", () => {
    expect(formatPrice("firstConsult")).toBe("$59");
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
