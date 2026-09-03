import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { publicRoutes } from "@/content/routes";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("uses relative paths, never the live WordPress domain", () => {
    const { container } = render(<SiteHeader />);
    const external = Array.from(container.querySelectorAll("a[href]")).filter((a) =>
      a.getAttribute("href")?.includes("horizonhealthcarepartners.com.au"),
    );
    expect(external).toHaveLength(0);
  });

  it("keeps four top-level items so the row cannot overflow", () => {
    render(<SiteHeader />);
    const nav = screen.getAllByRole("navigation")[0];
    const topLevel = within(nav).getAllByRole("link").filter((a) =>
      a.classList.contains("hhcp-hdr__nav-link"),
    );
    expect(topLevel.map((a) => a.textContent)).toEqual([
      "Services",
      "How It Works",
      "Pricing",
      "About",
    ]);
  });

  it("reaches all four visible silos and their sub-pages via the mega-menu", () => {
    // The mega panel ships `visibility: hidden` until hover, so it is absent
    // from the accessibility tree. Query the DOM directly rather than by role.
    const { container } = render(<SiteHeader />);
    const hrefs = Array.from(container.querySelectorAll("a[href]")).map((a) =>
      a.getAttribute("href"),
    );
    for (const href of [
      "/weight-loss-peptides/",
      "/mens-health/",
      "/womens-health/",
      "/online-doctor/",
      "/weight-loss-peptides/weight-loss-injections/",
      "/mens-health/hair-loss-treatment/",
      "/womens-health/pcos-management/",
      "/online-doctor/mental-health/",
    ]) {
      expect(hrefs).toContain(href);
    }
  });

  it("keeps every sitemap service page reachable from the header", () => {
    const { container } = render(<SiteHeader />);
    const hrefs = new Set(
      Array.from(container.querySelectorAll("a[href]")).map((a) => a.getAttribute("href")),
    );
    // 5 hubs + their sub-pages, with nothing gated.
    const servicePaths = publicRoutes()
      .map((r) => r.path)
      .filter((p) =>
        /^\/(weight-loss-peptides|mens-health|womens-health|online-doctor)\//.test(p),
      );
    expect(servicePaths).toHaveLength(18);
    for (const path of servicePaths) expect(hrefs).toContain(path);
  });

  it("links the formerly gated destinations", () => {
    const { container } = render(<SiteHeader />);
    const hrefs = Array.from(container.querySelectorAll("a[href]")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toContain("/medicinal-cannabis/");
    expect(hrefs).toContain("/our-practitioners/");
  });

  it("carries the CTA as the drawer's last item", () => {
    // Below 768px the bar is logo + hamburger only, so this is the CTA's only
    // home in the header. Tablets keep it in the bar and hide this row.
    const { container } = render(<SiteHeader />);
    const drawerItems = container.querySelectorAll(".hhcp-hdr__drawer-list > li");
    const last = drawerItems[drawerItems.length - 1];
    expect(last).toHaveClass("hhcp-hdr__drawer-cta-row");
    const cta = last.querySelector("a");
    expect(cta).toHaveAttribute("href", "/quiz/");
    expect(cta?.textContent).toBe("Book a consultation");
  });

  it("shows the CTA in the bar on tablet and in the drawer on phones", () => {
    // One CTA visible per viewport band, never two and never none: the bar's
    // button below 991px, swapped for the drawer row below 768px.
    const { container } = render(<SiteHeader />);
    const css = Array.from(container.querySelectorAll("style"))
      .map((node) => node.textContent ?? "")
      .join("\n")
      /* Comments would otherwise sit between a media query and its rule. */
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ");

    // The bar's actions survive the tablet band and only drop out on phones.
    expect(css).toContain("@media (max-width: 767px) { .hhcp-hdr__actions { display: none; } }");
    // The drawer row is the mirror image: off by default, on below 768px.
    expect(css).toContain(".hhcp-hdr__drawer-cta-row { display: none;");
    expect(css).toContain("@media (max-width: 767px) { .hhcp-hdr__drawer-cta-row { display: block; } }");
    // Tablet order: the button sits left of the hamburger, not right of it.
    expect(css).toContain(".hhcp-hdr__actions { order: 1;");
    expect(css).toContain(".hhcp-hdr__burger { display: block; order: 2; }");
  });

  it("stacks above the rest of the page", () => {
    // `.hhcp-hdr__container` has a z-index, so it is a stacking context: the
    // drawer's 999 and the overlay's 998 only order things inside the header.
    // Against the page this one number is all that counts, and it lost at 1 —
    // the marquee's edge fades (z-index 1, later in the document) drew a white
    // band across the open drawer and the sticky CTA bar (z-50) covered it.
    const { container } = render(<SiteHeader />);
    const css = Array.from(container.querySelectorAll("style"))
      .map((node) => node.textContent ?? "")
      .join("\n");
    const match = /\.hhcp-hdr__container\s*\{[^}]*z-index:\s*(\d+)/.exec(css);
    expect(match).not.toBeNull();
    expect(Number(match![1])).toBeGreaterThan(50);
  });

  it("points the primary CTA at the quiz", () => {
    render(<SiteHeader />);
    expect(
      screen.getAllByRole("link", { name: /Book a consultation/i })[0],
    ).toHaveAttribute("href", "/quiz/");
  });
});
