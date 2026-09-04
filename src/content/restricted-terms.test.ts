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

describe("restricted prescription terms", () => {
  it("has a file list to scan at all", () => {
    // A broken glob would make every assertion below vacuously true.
    expect(FILES.length).toBeGreaterThan(50);
  });

  it("appear nowhere outside comments", () => {
    const offenders: string[] = [];
    for (const file of FILES) {
      const lines = stripComments(readFileSync(file, "utf8")).split("\n");
      lines.forEach((line, index) => {
        const hit = RESTRICTED.exec(line);
        if (hit !== null) offenders.push(`${file}:${index + 1}  ${hit[0]}`);
      });
    }
    expect(offenders).toEqual([]);
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
