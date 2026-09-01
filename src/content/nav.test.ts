import { describe, it, expect } from "vitest";
import { NAV_ITEMS, visibleNavItems } from "./nav";
import { FOOTER_COLUMNS, visibleFooterColumns } from "./footer";

describe("NAV_ITEMS", () => {
  it("leads with the four service silos", () => {
    expect(NAV_ITEMS.slice(0, 4).map((item) => item.label)).toEqual([
      "Weight Loss & Peptides",
      "Men's Health",
      "Women's Health",
      "Online Doctor",
    ]);
  });

  it("gives every service dropdown an overview link to its own hub", () => {
    for (const item of NAV_ITEMS.slice(0, 4)) {
      expect(item.children?.[0].href).toBe(item.href);
    }
  });
});

describe("visibleNavItems", () => {
  it("omits gated destinations", () => {
    const hrefs = visibleNavItems().flatMap((item) => [
      item.href,
      ...(item.children ?? []).map((child) => child.href),
    ]);
    expect(hrefs).not.toContain("/medicinal-cannabis/");
    expect(hrefs).not.toContain("/our-practitioners/");
  });
});

describe("FOOTER_COLUMNS", () => {
  it("has the five columns from the sitemap document", () => {
    expect(FOOTER_COLUMNS).toHaveLength(5);
    expect(FOOTER_COLUMNS.map((column) => column.title)).toEqual([
      "Horizon Health Care Partners",
      "Our Services",
      "Patients",
      "About & Trust",
      "Newsletter",
    ]);
  });
});

describe("visibleFooterColumns", () => {
  it("omits gated links but keeps every column", () => {
    const columns = visibleFooterColumns();
    expect(columns).toHaveLength(5);
    const hrefs = columns.flatMap((column) => column.links.map((link) => link.href));
    expect(hrefs).not.toContain("/medicinal-cannabis/");
    expect(hrefs).not.toContain("/our-practitioners/");
  });
});
