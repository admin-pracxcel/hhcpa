import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Captured source artefacts under docs/research are verbatim copies of the
    // target site's own code, kept for auditability. They are reference
    // material, not project source, so they should not be linted.
    "docs/research/**",
  ]),
]);

export default eslintConfig;
