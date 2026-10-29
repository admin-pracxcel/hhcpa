import { describe, expect, it } from "vitest";
import { readFileSync, globSync } from "node:fs";

/**
 * Data must not be exported from a `"use client"` module.
 *
 * ─── WHY THIS EXISTS ───────────────────────────────────────────────────────
 *
 * Next replaces every export of a client module with a client reference when
 * a server component imports it. For a component that is the whole point. For
 * a plain string it is a silent corruption: the importer receives a stub, and
 * interpolating that stub into a template literal yields
 * "Attempted to call X() from the server but X is on the client" as text.
 *
 * On 2026-10-29 that text was interpolated into a stylesheet. The accordion
 * CSS lived in FaqAccordion.tsx, ArticleBody is a server component, and the
 * published article rendered with every FAQ panel open and no layout at all.
 *
 * Nothing caught it. The build passed, typecheck passed, 370 tests passed,
 * and a component test asserting the CSS rendered ALSO passed — vitest does
 * not enforce the client boundary, so the import resolves normally there.
 * The only thing that noticed was looking at the page.
 *
 * Hence a source-level rule rather than a behavioural one. This is the only
 * form of check that can see the problem.
 *
 * The rule: a `"use client"` module exports components, not data. Styles,
 * constants and content arrays belong in a plain module that either side can
 * import.
 */
const CLIENT_FILES = globSync("src/**/*.{ts,tsx}").filter(
  (file) => !/\.test\.tsx?$/.test(file),
);

/** `export const SOME_NAME = ...` — screaming snake case is this codebase's data convention. */
const EXPORTED_DATA = /^export const ([A-Z][A-Z0-9_]*)\s*[:=]/gm;

describe("the client boundary", () => {
  const clientModules = CLIENT_FILES.filter((file) => {
    const head = readFileSync(file, "utf8").slice(0, 200);
    return /^\s*["']use client["']/.test(head);
  });

  it("finds client modules to check", () => {
    /* The assertion below iterates over them. With none it would pass
       having checked nothing. */
    expect(clientModules.length).toBeGreaterThan(0);
  });

  it("never exports data from a client module", () => {
    for (const file of clientModules) {
      const source = readFileSync(file, "utf8");
      const exported = [...source.matchAll(EXPORTED_DATA)].map((m) => m[1]);
      expect(
        exported,
        `${file} exports ${exported.join(", ")} from a "use client" module. A server component importing one receives a stub, not the value. Move it to a plain module.`,
      ).toEqual([]);
    }
  });
});
