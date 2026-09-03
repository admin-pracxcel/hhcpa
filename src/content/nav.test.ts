import { describe, it, expect } from "vitest";
import { NAV_ITEMS, visibleNavItems } from "./nav";
import { FOOTER_COLUMNS, visibleFooterColumns } from "./footer";

describe("NAV_ITEMS", () => {
  it("keeps the top row to four items so the header cannot overflow", () => {
    // Seven top-level items with service-length labels measured 935px of nav
    // against 1300px of available row, which overflowed the document. The four
    // silos live in the Services mega-menu instead. See CUSTOMISATIONS.md.
    expect(NAV_ITEMS).toHaveLength(4);
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      "Services",
      "How It Works",
      "Pricing",
      "About",
    ]);
  });

  it("budgets the rendered nav width to fit the 1300px row", () => {
    // Roboto Mono is monospace, so this is exact rather than an estimate:
    // 12px advance = 7.2px, plus 0.36px letter-spacing, plus 20px per chevron
    // and 32px between items.
    const CHAR = 12 * 0.6 + 0.36;
    const width =
      NAV_ITEMS.reduce(
        (total, item) =>
          total +
          item.label.length * CHAR +
          (item.children || item.columns ? 20 : 0),
        0,
      ) +
      32 * (NAV_ITEMS.length - 1);
    // Logo 145 + phone 84 + CTA 175 + bar padding 48 + three 67.5px gaps = 655.
    expect(width).toBeLessThan(1300 - 655);
  });

  it("gives every mega-menu column a hub link of its own", () => {
    const services = NAV_ITEMS[0];
    expect(services.columns?.length).toBe(5);
    for (const column of services.columns ?? []) {
      expect(column.href.startsWith("/")).toBe(true);
    }
  });
});

describe("visibleNavItems", () => {
  it("carries every services silo now that none is gated", () => {
    const services = visibleNavItems()[0];
    expect(services.columns?.map((c) => c.href)).toContain("/medicinal-cannabis/");
    expect(services.columns).toHaveLength(5);
  });

  it("shows the two formerly gated destinations", () => {
    const hrefs = visibleNavItems().flatMap((item) => [
      item.href,
      ...(item.children ?? []).map((child) => child.href),
      ...(item.columns ?? []).flatMap((column) => [
        column.href,
        ...column.links.map((link) => link.href),
      ]),
    ]);
    expect(hrefs).toContain("/medicinal-cannabis/");
    expect(hrefs).toContain("/our-practitioners/");
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
  it("keeps every column and carries the formerly gated links", () => {
    const columns = visibleFooterColumns();
    expect(columns).toHaveLength(5);
    const hrefs = columns.flatMap((column) => column.links.map((link) => link.href));
    expect(hrefs).toContain("/medicinal-cannabis/");
    expect(hrefs).toContain("/our-practitioners/");
  });
});
