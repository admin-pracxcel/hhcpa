import { describe, it, expect } from "vitest";
import { CLINIC, SITE_DISCLAIMER, EMERGENCY_CONTACTS, TRUST_BAR_DEFAULT } from "./clinic";

describe("CLINIC", () => {
  it("carries the registered legal entity and ABN from the Service Agreement", () => {
    expect(CLINIC.legalName).toBe("Horizon Health Care Partners Pty Ltd");
    expect(CLINIC.abn).toBe("92 689 872 811");
  });

  it("exposes a dialable tel: href alongside the display number", () => {
    expect(CLINIC.phone).toBe("1300 336 572");
    expect(CLINIC.phoneHref).toBe("tel:1300336572");
  });

  it("flags the business hours as unconfirmed", () => {
    expect(CLINIC.hoursProvisional).toBe(true);
  });
});

describe("SITE_DISCLAIMER", () => {
  it("carries every mandated element", () => {
    expect(SITE_DISCLAIMER).toContain("no treatment outcomes are guaranteed");
    expect(SITE_DISCLAIMER).toContain("real-time consultation");
    expect(SITE_DISCLAIMER).toContain("000");
    expect(SITE_DISCLAIMER).toContain("13 11 14");
    expect(SITE_DISCLAIMER).toContain("1300 22 4636");
  });
});

describe("EMERGENCY_CONTACTS", () => {
  it("lists emergency, Lifeline and Beyond Blue with dialable hrefs", () => {
    expect(EMERGENCY_CONTACTS).toHaveLength(3);
    expect(EMERGENCY_CONTACTS.map((c) => c.number)).toEqual([
      "000",
      "13 11 14",
      "1300 22 4636",
    ]);
    for (const contact of EMERGENCY_CONTACTS) {
      expect(contact.href.startsWith("tel:")).toBe(true);
      expect(contact.href).not.toContain(" ");
    }
  });
});

describe("TRUST_BAR_DEFAULT", () => {
  it("has the five items the content doc specifies", () => {
    expect(TRUST_BAR_DEFAULT).toHaveLength(5);
    expect(TRUST_BAR_DEFAULT[0]).toBe("AHPRA-registered practitioners");
  });
});
