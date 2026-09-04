import { describe, it, expect } from "vitest";
import { NAV_ITEMS, visibleNavItems } from "./nav";
import { FOOTER_COLUMNS, visibleFooterColumns } from "./footer";
import { ROUTES } from "./routes";

/** Every href the menu offers, columns and stacked silos included. */
function navHrefs(): string[] {
  return visibleNavItems().flatMap((item) => [
    item.href,
    ...(item.children ?? []).map((child) => child.href),
    ...(item.columns ?? [])
      .flatMap((column) => [column, ...(column.below ?? [])])
      .flatMap((silo) => [silo.href, ...silo.links.map((link) => link.href)]),
  ]);
}

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
    expect(services.columns?.length).toBe(4);
    for (const column of services.columns ?? []) {
      expect(column.href.startsWith("/")).toBe(true);
    }
  });
});

describe("visibleNavItems", () => {
  it("carries the remediated Weight Management silo", () => {
    /*
     * HHCPA_Remediation_Change_Spec.md §A1. "Weight Loss & Peptides" named a
     * restricted prescription class, "Weight Loss Injections" was a page whose
     * whole identity was an injectable prescription, and Medicinal Cannabis
     * cannot be advertised at all. What is left is one hub and one child.
     */
    const services = visibleNavItems()[0];
    expect(services.columns).toHaveLength(4);

    const weight = services.columns?.[0];
    expect(weight?.title).toBe("Weight Management");
    expect(weight?.href).toBe("/weight-management/");
    expect(weight?.links.map((l) => l.href)).toEqual([
      "/weight-management/medical-weight-loss-program/",
    ]);

    // Nothing stacks a second silo today; `below` is kept for the next one.
    expect(services.columns?.flatMap((c) => c.below ?? [])).toEqual([]);
  });

  it("shows Our Practitioners and no removed destination", () => {
    const hrefs = navHrefs();
    expect(hrefs).toContain("/our-practitioners/");
    expect(hrefs).not.toContain("/medicinal-cannabis/");
  });

  it("names no restricted prescription term in any label", () => {
    /*
     * §A6: the restricted terms are barred from every public surface, and a
     * menu label is about as public as copy gets. This is the structural half of
     * that rule — the sitewide sweep in restricted-terms.test.ts is the other.
     */
    const labels = visibleNavItems().flatMap((item) => [
      item.label,
      ...(item.children ?? []).map((child) => child.label),
      ...(item.columns ?? [])
        .flatMap((column) => [column, ...(column.below ?? [])])
        .flatMap((silo) => [silo.title, ...silo.links.map((link) => link.label)]),
    ]);
    for (const label of labels) {
      expect(label).not.toMatch(
        /\b(peptides?|GLP-?1|semaglutide|tirzepatide|ozempic|wegovy|mounjaro|cannabis|THC|CBD|TRT|MHT|HRT)\b|testosterone replacement|weight[- ]loss injection/i,
      );
    }
  });

  it("points only at paths the route registry knows", () => {
    /*
     * The remediation moved six URLs. A menu link left on an old path would
     * still resolve — the 301s see to that — which is exactly why it would go
     * unnoticed. Nothing should link to a redirecting URL (§C).
     */
    const known = new Set(ROUTES.map((route) => route.path));
    for (const href of navHrefs()) {
      if (href.startsWith("http") || href.startsWith("#")) continue;
      expect(known).toContain(href);
    }
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
  it("keeps every column and drops the removed service links", () => {
    const columns = visibleFooterColumns();
    expect(columns).toHaveLength(5);
    const hrefs = columns.flatMap((column) => column.links.map((link) => link.href));
    expect(hrefs).toContain("/our-practitioners/");
    expect(hrefs).toContain("/weight-management/");
    expect(hrefs).not.toContain("/medicinal-cannabis/");
    expect(hrefs).not.toContain("/weight-loss-peptides/");
  });

  it("points only at paths the route registry knows", () => {
    const known = new Set(ROUTES.map((route) => route.path));
    for (const column of visibleFooterColumns()) {
      for (const link of column.links) {
        if (link.href.startsWith("http") || link.href.startsWith("#")) continue;
        expect(known).toContain(link.href);
      }
    }
  });
});
