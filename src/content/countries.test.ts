import { describe, expect, it } from "vitest";

import { COUNTRIES, DEFAULT_COUNTRY, findCountry } from "./countries";

describe("country dialling codes", () => {
  it("has a unique ISO code per entry", () => {
    const codes = COUNTRIES.map((country) => country.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("gives every country a dial code, flag and example number", () => {
    // The example is the field's placeholder, so a missing one silently
    // leaves the input unlabelled for that country.
    for (const country of COUNTRIES) {
      expect(country.dial).toMatch(/^\+\d+$/);
      expect(country.flag).not.toBe("");
      expect(country.example).not.toBe("");
      expect(country.code).toMatch(/^[A-Z]{2}$/);
    }
  });

  it("never writes the dial code into the example number", () => {
    // The selector already shows +61; "＋61 412 345 678" in the placeholder
    // would read as though the country code has to be typed twice.
    for (const country of COUNTRIES) {
      expect(country.example.startsWith("+")).toBe(false);
      expect(country.example).not.toContain(country.dial);
    }
  });

  it("falls back to the default for an unknown code", () => {
    expect(findCountry("ZZ").code).toBe(DEFAULT_COUNTRY);
    expect(findCountry(DEFAULT_COUNTRY).code).toBe(DEFAULT_COUNTRY);
  });

  it("resolves each declared timezone to exactly one country", () => {
    // Two countries claiming one zone would make detection order-dependent.
    const seen = new Map<string, string>();
    for (const country of COUNTRIES) {
      for (const zone of country.zones ?? []) {
        expect(seen.get(zone)).toBeUndefined();
        seen.set(zone, country.code);
      }
    }
    expect(seen.size).toBeGreaterThan(20);
  });
});
