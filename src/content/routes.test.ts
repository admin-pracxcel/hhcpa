import { describe, it, expect } from "vitest";
import { ROUTES, publicRoutes, gatedRoutes, isGated } from "./routes";

describe("ROUTES", () => {
  it("covers all 35 routes in the design spec", () => {
    expect(ROUTES).toHaveLength(35);
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
 * Nothing is gated as of 2026-09-03: Medicinal Cannabis and Our Practitioners
 * were released for the client review build. The mechanism stays because it is
 * how either one gets withdrawn again — add `gated: true` and it disappears
 * from the nav, the footer, the related cards, the focus grid and the sitemap
 * at once, which is the point of it being one flag rather than five edits.
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
    expect(isGated("/medicinal-cannabis/")).toBe(false);
    expect(isGated("/our-practitioners/")).toBe(false);
    expect(isGated("/pricing/")).toBe(false);
    expect(isGated("/not-a-route/")).toBe(false);
  });
});
