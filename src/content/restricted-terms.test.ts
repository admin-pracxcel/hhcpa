import { describe, it, expect } from "vitest";
import { readFileSync, globSync } from "node:fs";

/**
 * The site-wide restricted-term sweep.
 *
 * HHCPA_Remediation_Change_Spec.md §A6 and §F1: none of these may appear in page
 * copy, headings, titles, meta descriptions, URLs, image alt text or JSON-LD
 * schema. They name prescription medicines, classes or brands, and advertising
 * a prescription medicine to the public is prohibited under the Therapeutic
 * Goods Advertising Code — a disclaimer does not cure it, and reframing the
 * sentence around the term does not either.
 *
 * Conditions are not on this list and must not be added to it: low testosterone,
 * erectile dysfunction, menopause, PCOS and hair loss may all be named, and so
 * may weight loss as a goal or a service. The line the regulator draws is
 * between the condition and the medicine, not between comfortable and
 * uncomfortable words.
 *
 * This runs over source rather than over the rendered pages because that is
 * where a term gets reintroduced. Comments are stripped first: the files that
 * record *why* a term was removed necessarily quote it, and a rule that
 * punished the explanation would be deleted the first time it fired.
 */
const RESTRICTED =
  /\b(peptides?|GLP-?1|semaglutide|tirzepatide|ozempic|wegovy|mounjaro|cannabis|THC|CBD|TRT|MHT|HRT)\b|testosterone replacement|weight[- ]loss injection|weight loss injection/i;

/** Source with block and line comments removed, line count preserved. */
function stripComments(source: string): string {
  const withoutBlocks = source.replace(/\/\*[\s\S]*?\*\//g, (match) =>
    match.replace(/[^\n]/g, " "),
  );
  return withoutBlocks.replace(/(^|[^:])\/\/[^\n]*/g, (_m, lead: string) => lead);
}

const FILES = globSync("src/**/*.{ts,tsx}").filter(
  (file) => !/\.test\.tsx?$/.test(file),
);

/**
 * The one hole in the net, and it is deliberate.
 *
 * HHCPA-FRM-007 asks "have you previously used peptide therapy or other health
 * optimisation treatment?" and its declaration says "health optimisation or
 * peptide treatment is not guaranteed". Both are Ranjeeta's wording.
 *
 * The build spec asked twice for that wording to be replaced, and the second
 * time (v2.4 Q29) preferred a neutral question publicly with her wording kept
 * for the post-booking record. Bilal directed on 2026-09-10 that her exact
 * wording ships as written and the risk is flagged to her at review instead.
 * That is his call to make and it is recorded, not silently absorbed.
 *
 * The exemption is scoped as narrowly as it can be: one file, one word, and
 * only inside the intake form definitions. Every other restricted term still
 * fails the build in that file, and "peptide" still fails the build
 * everywhere else — including in page copy, metadata, schema and the public
 * Step 4 screening, which is where the original incident happened.
 *
 * REMOVE THIS the moment she asks for the neutral wording, or if the intake
 * form ever moves somewhere a member of the public can reach without booking.
 */
const EXEMPT = new Map<string, RegExp>([
  ["src/content/intake-forms.ts", /^peptides?$/i],
]);

describe("restricted prescription terms", () => {
  it("has a file list to scan at all", () => {
    // A broken glob would make every assertion below vacuously true.
    expect(FILES.length).toBeGreaterThan(50);
  });

  it("appear nowhere outside comments", () => {
    const offenders: string[] = [];
    for (const file of FILES) {
      const allowed = EXEMPT.get(file);
      const lines = stripComments(readFileSync(file, "utf8")).split("\n");
      lines.forEach((line, index) => {
        const hit = RESTRICTED.exec(line);
        if (hit === null) return;
        if (allowed !== undefined && allowed.test(hit[0])) return;
        offenders.push(`${file}:${index + 1}  ${hit[0]}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it("keeps the exemption to one file and one word", () => {
    /*
     * An exemption that quietly widens is worse than no rule. This pins it:
     * one entry, and the pattern it allows matches "peptide" and nothing else
     * on the register.
     */
    expect([...EXEMPT.keys()]).toEqual(["src/content/intake-forms.ts"]);
    const allowed = EXEMPT.get("src/content/intake-forms.ts");
    expect(allowed?.test("peptide")).toBe(true);
    expect(allowed?.test("peptides")).toBe(true);
    for (const term of ["cannabis", "GLP-1", "semaglutide", "TRT", "MHT"]) {
      expect(allowed?.test(term)).toBe(false);
    }
  });

  it("still fails the build on a restricted term in the exempt file", () => {
    // The exemption covers one word, not the file.
    const source = readFileSync("src/content/intake-forms.ts", "utf8");
    const allowed = EXEMPT.get("src/content/intake-forms.ts");
    for (const line of stripComments(source).split("\n")) {
      const hit = RESTRICTED.exec(line);
      if (hit === null) continue;
      expect(allowed?.test(hit[0])).toBe(true);
    }
  });

  it("still catches a term when one is reintroduced", () => {
    // Guards the stripper: a rule that silently matches nothing is worse than
    // no rule, because it reads as a passing check.
    expect(RESTRICTED.test('const x = "peptides for weight loss";')).toBe(true);
    expect(RESTRICTED.test(stripComments('const x = "TRT in Australia";'))).toBe(
      true,
    );
    expect(RESTRICTED.test(stripComments("/* peptides */ const x = 1;"))).toBe(
      false,
    );
    // Conditions stay sayable.
    expect(RESTRICTED.test("low testosterone, assessed online")).toBe(false);
    expect(RESTRICTED.test("medical weight loss")).toBe(false);
  });
});
