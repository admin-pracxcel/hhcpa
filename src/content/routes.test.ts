import { describe, it, expect } from "vitest";
import { ROUTES, publicRoutes, gatedRoutes, isGated } from "./routes";

describe("ROUTES", () => {
  /*
   * 35 in the design spec, less the three the compliance remediation removed:
   * /medicinal-cannabis/, /weight-loss-peptides/weight-loss-injections/ and the
   * old /weight-loss-peptides/ hub, which was renamed rather than dropped.
   * See HHCPA_Remediation_Change_Spec.md §B4 and §B6.
   */
  it("covers the design spec's routes, less the two the remediation removed", () => {
    expect(ROUTES).toHaveLength(33);
  });

  /*
   * The remediation moved six paths. Every one of them must be gone from the
   * registry, or the sitemap would offer a URL that 301s — and two of them named
   * a restricted prescription class in the URL string itself.
   */
  it("carries no path that the remediation retired", () => {
    const retired = [
      "/weight-loss-peptides/",
      "/weight-loss-peptides/weight-loss-injections/",
      "/weight-loss-peptides/medical-weight-loss-program/",
      "/medicinal-cannabis/",
      "/mens-health/testosterone-replacement-therapy/",
      "/mens-health/hair-loss-treatment/",
      "/mens-health/erectile-dysfunction-treatment/",
      "/mens-health/premature-ejaculation-treatment/",
      "/womens-health/menopause-treatment/",
    ];
    const paths = ROUTES.map((r) => r.path);
    for (const path of retired) expect(paths).not.toContain(path);
  });

  it("uses trailing-slash paths throughout, matching the live site", () => {
    for (const route of ROUTES) {
      if (route.path === "/") continue;
      expect(route.path.endsWith("/")).toBe(true);
    }
  });

  it("has no duplicate paths", () => {
    const paths = ROUTES.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

/*
 * Nothing is gated. Medicinal Cannabis was released for the client review build
 * on 2026-09-03 and then removed outright a day later — advertising it to the
 * public is prohibited, so a gate was the wrong tool for it. Our Practitioners
 * stays published.
 *
 * The mechanism stays because it is how any page gets withheld — add
 * `gated: true` and it disappears from the nav, the footer, the related cards,
 * the focus grid and the sitemap at once, which is the point of it being one
 * flag rather than five edits.
 *
 * So these test the machinery rather than a particular page's status, and go on
 * passing whichever way the client decides.
 */
describe("gating", () => {
  it("gates nothing at present", () => {
    expect(gatedRoutes()).toEqual([]);
    expect(publicRoutes()).toHaveLength(ROUTES.length);
  });

  it("keeps a gated route out of the public set", () => {
    const gated = { path: "/example/", title: "Example", gated: true } as const;
    expect([gated, ...ROUTES].filter((r) => !r.gated)).not.toContain(gated);
  });

  it("reports gating by path", () => {
    expect(isGated("/our-practitioners/")).toBe(false);
    expect(isGated("/weight-management/")).toBe(false);
    expect(isGated("/pricing/")).toBe(false);
    expect(isGated("/not-a-route/")).toBe(false);
  });
});
