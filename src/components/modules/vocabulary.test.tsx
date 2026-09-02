import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { publicRoutes, gatedRoutes } from "@/content/routes";
import { visibleNavItems } from "@/content/nav";
import { visibleFooterColumns } from "@/content/footer";
import sitemap from "@/app/sitemap";
import { ABOUT_US } from "@/content/services/about-us";
import { ServicePage } from "@/components/sections/ServicePage";

const MODULE_DIR = join(process.cwd(), "src/components/modules");

describe("module vocabulary", () => {
  it("contains no testimonial, review or rating module", () => {
    // AHPRA treats testimonials about clinical care as advertising a regulated
    // health service; Clause 2.6 forbids them. This asserts the constraint is
    // structural rather than a matter of remembering.
    const forbidden = /testimonial|review|rating|star/i;
    const offenders = readdirSync(MODULE_DIR).filter((file) => forbidden.test(file));
    expect(offenders).toEqual([]);
  });
});

describe("gated routes", () => {
  const gatedPaths = gatedRoutes().map((route) => route.path);

  it("appear in no public channel", () => {
    const navHrefs = visibleNavItems().flatMap((item) => [
      item.href,
      ...(item.children ?? []).map((child) => child.href),
    ]);
    const footerHrefs = visibleFooterColumns().flatMap((column) =>
      column.links.map((link) => link.href),
    );
    const sitemapPaths = sitemap().map((entry) => new URL(entry.url).pathname);
    const publicPaths = publicRoutes().map((route) => route.path);

    for (const path of gatedPaths) {
      expect(navHrefs).not.toContain(path);
      expect(footerHrefs).not.toContain(path);
      expect(sitemapPaths).not.toContain(path);
      expect(publicPaths).not.toContain(path);
    }
  });

  it("appear in no rendered page's links or copy", () => {
    /*
     * Rendered output, not the data behind it. Some components filter gated
     * destinations themselves — RelatedCards drops gated links and then drops
     * a card left with none — so the data legitimately still holds the href
     * that brings the card back when the gate lifts. What must never appear is
     * the rendered result.
     *
     * About Us is the live case: its approved copy ends with a sentence and a
     * button pointing at /our-practitioners/, gated pending the AHPRA
     * registration numbers, and both are withheld while the gate holds.
     */
    const { container } = render(<ServicePage data={ABOUT_US} />);
    const html = container.innerHTML;
    const hrefs = [...container.querySelectorAll("a[href]")].map((a) =>
      a.getAttribute("href"),
    );

    for (const path of gatedPaths) {
      expect(hrefs).not.toContain(path);
      expect(html).not.toContain(path);
    }
    // Nor a sentence describing a page the reader cannot open.
    expect(container.textContent).not.toContain("practitioners page");
  });

});
