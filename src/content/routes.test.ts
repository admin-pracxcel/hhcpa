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

describe("gating", () => {
  it("gates exactly the two compliance-blocked pages", () => {
    expect(gatedRoutes().map((r) => r.path).sort()).toEqual([
      "/medicinal-cannabis/",
      "/our-practitioners/",
    ]);
  });

  it("excludes gated routes from the public set", () => {
    const publicPaths = publicRoutes().map((r) => r.path);
    expect(publicPaths).not.toContain("/medicinal-cannabis/");
    expect(publicPaths).not.toContain("/our-practitioners/");
  });

  it("reports gating by path", () => {
    expect(isGated("/medicinal-cannabis/")).toBe(true);
    expect(isGated("/pricing/")).toBe(false);
    expect(isGated("/not-a-route/")).toBe(false);
  });
});
