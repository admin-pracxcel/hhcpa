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

/*
 * Nothing is gated as of 2026-09-03 — Medicinal Cannabis and Our Practitioners
 * were released for the client review build. These keep working either way: the
 * loops below run over whatever is gated at the time, so they hold if a page is
 * withdrawn again, and the About Us case asserts the other half of the
 * mechanism — that lifting a gate actually restores the copy it suppressed.
 */
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
     * that brings the card back when the gate lifts.
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
  });

  it("restore the copy they suppressed once the gate lifts", () => {
    /*
     * About Us is where a gate is visible in prose rather than only in a link:
     * its approved copy ends with a sentence pointing at /our-practitioners/,
     * and both the sentence and the button were withheld while that page was
     * gated. Now that it is published, both must be back — otherwise lifting a
     * gate would quietly leave the page reading as though the destination did
     * not exist.
     */
    expect(gatedPaths).not.toContain("/our-practitioners/");
    const { container } = render(<ServicePage data={ABOUT_US} />);
    const hrefs = [...container.querySelectorAll("a[href]")].map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toContain("/our-practitioners/");
    expect(container.textContent).toContain("practitioners page");
  });
});
