import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

/**
 * Scoped stylesheets in this codebase are template literals, so a backtick
 * inside one terminates the string and the file stops parsing — usually with a
 * TypeScript error pointing at a line some distance from the real one.
 *
 * AGENTS.md warns about it because three agents hit it; two more have since,
 * both writing a CSS comment that quoted a class name in backticks the way the
 * doc comments above do. A note in a file people do not re-read has not been
 * enough, so this fails instead.
 *
 * The check is deliberately blunt: no backticks at all inside a style literal.
 * Nothing in these stylesheets has any use for one.
 */
const FILES = globSync("src/**/*.tsx");

/**
 * The body of every CSS template literal in a file.
 *
 * Ends at the literal's real closer — a backtick that begins a line and is
 * followed by a semicolon — not at the first backtick found. Slicing at the
 * first backtick is what a previous version of this did, and it made the whole
 * check vacuous: the body then ends *at* the stray backtick and so can never be
 * found to contain one.
 */
function styleLiterals(source: string): string[] {
  const out: string[] = [];
  const opener = /const\s+[A-Z_]*(?:STYLES|CSS)\s*=\s*`/g;
  let match: RegExpExecArray | null;
  while ((match = opener.exec(source)) !== null) {
    const start = match.index + match[0].length;
    const end = source.indexOf("\n`;", start);
    out.push(source.slice(start, end === -1 ? source.length : end));
    if (end !== -1) opener.lastIndex = end;
  }
  return out;
}

describe("scoped style literals", () => {
  it("finds the stylesheets to check", () => {
    const withStyles = FILES.filter(
      (file) => styleLiterals(readFileSync(file, "utf8")).length > 0,
    );
    expect(withStyles.length).toBeGreaterThan(10);
  });

  it("never contains a backtick, which would terminate the literal", () => {
    for (const file of FILES) {
      const source = readFileSync(file, "utf8");
      /*
       * A file whose literal was broken by a backtick would not compile, so
       * reaching here means the literals are well-formed. What this catches is
       * the same mistake at review time, and in a message that names the file.
       */
      for (const [index, body] of styleLiterals(source).entries()) {
        expect(body.includes("`"), `${file} — style literal ${index + 1}`).toBe(
          false,
        );
      }
    }
  });
});
