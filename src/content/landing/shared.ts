/**
 * Shared pieces for the three paid-acquisition landing pages.
 *
 * ─── WHAT THESE PAGES ARE ──────────────────────────────────────────────────
 *
 * Destinations for Meta advertising, specified in "New HHCPA landing pages and
 * ads.md" (repo root). They are not part of the site's information
 * architecture: they are absent from `ROUTES`, so they appear in no sitemap,
 * no navigation and no breadcrumb trail, and each page sets
 * `robots: { index: false, follow: false }` of its own.
 *
 * ⚠️ NOINDEX IS DELIBERATE AND LOAD-BEARING. Page C in particular covers the
 * same ground as `/online-doctor/`. Two indexable pages competing for the same
 * queries would split the ranking signal the real page was built to win. If
 * anyone ever wants these in search, that is a decision about the whole silo,
 * not a line to flip here.
 *
 * ─── COPY PROVENANCE ───────────────────────────────────────────────────────
 *
 * Every word comes from that document, which was written compliance-aware:
 * conditions are never named, no medicine or class appears, and every claim is
 * hedged to a process rather than an outcome. Do not "improve" the copy. Its
 * flatness is the point — it is what lets a health service advertise at all.
 *
 * The document's own checklist carries an unticked item, "Complete Australian
 * advertising-law review". That has not happened. These pages are built so
 * they are ready when it does; nothing here should be advertised against until
 * it is.
 *
 * ─── IMAGES ARE PLACEHOLDERS ───────────────────────────────────────────────
 *
 * `public/images/lp-*.webp` are generated hatched boxes reading "PLACEHOLDER".
 * The source document supplied no artwork — its 19 image links are
 * `images.openai.com` thumbnails of other companies' websites, including a
 * physiotherapy clinic and a competing telehealth brand. None is licensed and
 * none may ship.
 *
 * The heroes have no `media` at all, which is why they render as the standard
 * dark band. The specification asks for a lifestyle photograph there. That is
 * a gap, not a design choice.
 */

import { CALL_CTA } from "../clinic";

/** The one conversion every page drives at. */
export const ASSESSMENT_CTA = {
  label: "Start your free assessment",
  href: "/quiz/",
} as const;

export const SECONDARY_CTA = CALL_CTA;

/**
 * The footnote the document places under every final call to action.
 *
 * Carried verbatim. It is the sentence that keeps the page on the right side
 * of the line: it disclaims diagnosis, puts clinical decisions with the
 * practitioner, and guarantees no outcome.
 */
export const LANDING_FOOTNOTE =
  "The pre-screening assessment is not a diagnosis or substitute for a medical consultation. Clinical suitability and any treatment decisions are determined independently by an appropriately qualified practitioner. No prescription or treatment outcome is guaranteed.";

/** `sectionImage()` for the landing-page placeholders. */
export function landingImage(name: string): string {
  return `/images/${name}.webp`;
}

export const PLACEHOLDER_ALT =
  "Placeholder graphic. Final photography has not been supplied.";
