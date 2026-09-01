import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { publicRoutes, gatedRoutes } from "@/content/routes";
import { visibleNavItems } from "@/content/nav";
import { visibleFooterColumns } from "@/content/footer";
import sitemap from "@/app/sitemap";

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

  it("is a non-empty set, so the test cannot pass vacuously", () => {
    expect(gatedPaths.length).toBeGreaterThan(0);
  });
});
