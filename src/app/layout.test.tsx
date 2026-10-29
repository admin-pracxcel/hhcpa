import { describe, it, expect } from "vitest";
import { buildSiteGraph, ORGANISATION_ID } from "@/lib/schema";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The root layout is the only place the organisation is described.
 *
 * It is not rendered here. The component returns `<html>` and `<body>`, which
 * jsdom cannot mount inside an existing document without React objecting, and
 * the assertion that matters is not about the DOM anyway — it is that the one
 * emission point still exists and still carries the graph.
 *
 * So this reads the source. Crude, but it fails if someone deletes the
 * injection, and the alternative is a test that cannot run.
 */
const read = (file: string) =>
  readFileSync(join(process.cwd(), "src/app", file), "utf8");

const SOURCE = read("layout.tsx");

describe("root layout", () => {
  it("emits the site-wide graph", () => {
    expect(SOURCE).toContain("buildSiteGraph()");
    expect(SOURCE).toContain("<JsonLd");
  });

  /*
   * Every page inherits the root layout, including /quiz/, which is outside
   * the (site) route group. Before the move it was the only page on the site
   * with no organisation markup — the audit flagged it separately as its own
   * finding, and putting the graph here is what closes it.
   */
  it("covers routes outside the (site) group", () => {
    /* Emits none of its own, rather than never mentioning it — the comment
       recording the move names the builder it moved to. */
    const siteLayout = read("(site)/layout.tsx");
    expect(siteLayout).not.toContain("<JsonLd");
    expect(siteLayout).not.toContain("buildSiteGraph(");
    expect(siteLayout).not.toContain("buildMedicalClinic(");
  });
});

describe("the graph it emits", () => {
  it("is one connected entity, not a list of strangers", () => {
    const graph = buildSiteGraph();
    const ids = new Set<string>(graph["@graph"].map((node) => node["@id"]));
    expect(ids.has(ORGANISATION_ID)).toBe(true);

    /*
     * Every @id referenced from inside the graph must either be defined in
     * the graph or be a practitioner node defined on /our-practitioners/.
     * A reference to an id nothing defines is the silent failure mode here:
     * it does not error, it just produces a dangling edge.
     */
    const referenced = [
      ...JSON.stringify(graph).matchAll(/"@id":"([^"]+)"/g),
    ].map((match) => match[1]);

    for (const id of referenced) {
      const defined = ids.has(id);
      const practitioner = id.includes("/our-practitioners/#");
      const logo = id.endsWith("#logo");
      expect(defined || practitioner || logo, `dangling @id: ${id}`).toBe(true);
    }
  });
});
