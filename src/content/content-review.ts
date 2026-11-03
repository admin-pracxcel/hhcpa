/**
 * Who reviewed the site's health content, and when.
 *
 * ─── WHAT THIS CLAIM IS, AND WHAT IT IS NOT ────────────────────────────────
 *
 * Ranjeeta Roshan reviewed and approved the website content as Director of
 * Horizon Health Care Partners Australia. That is a CONTENT AND
 * ORGANISATIONAL review: the Director confirming the site represents the
 * business accurately.
 *
 * ⚠️ It is NOT a clinical review, and nothing here may suggest it was.
 *
 * She told us plainly, on 2026-10-29: "As I do not hold an AHPRA registration
 * number, please use my name and position." So:
 *
 *   - no `identifier`, because there is no registration number to publish and
 *     inventing one would be fabricating a credential
 *   - `jobTitle` is "Director", never a clinical title
 *   - no `medicalSpecialty`, no `IndividualPhysician`, no `Physician`
 *   - the type is `Person`, which is what she is here
 *
 * The practitioner nodes on /our-practitioners/ are the site's clinical
 * credentials and are published separately, each with a real AHPRA number
 * and a type derived from its prefix. These two things must not be confused,
 * and `content-review.test.ts` asserts they are not.
 *
 * ─── IF A PRACTITIONER EVER SIGNS OFF CLINICALLY ───────────────────────────
 *
 * `reviewedBy` would then point at that practitioner's existing node by @id —
 * they are already in the graph — and this record would stay as the separate
 * fact it is. Do not overwrite one with the other.
 */

import { CLINIC } from "./clinic";

/**
 * The reviewer's node id.
 *
 * Apex, not `www`. The brief suggested a www URL; every other `@id` on this
 * site is apex and `www` 308s to it, so a www id would name a host that
 * redirects and would not match the organisation node it links to.
 */
export const CONTENT_REVIEWER_ID = "#ranjeeta-roshan";

export const CONTENT_REVIEWER = {
  name: "Ranjeeta Roshan",
  jobTitle: "Director",
  organisation: `${CLINIC.name} Australia`,
} as const;

/**
 * The date the content was reviewed. ISO 8601, date only.
 *
 * ⚠️ A fixed string, never `new Date()`.
 *
 * A computed date would move on every build and silently claim a review that
 * happened on whatever day the site was last deployed. `lastReviewed` is an
 * assertion about something a person did, so it changes when that person does
 * it again and at no other time.
 *
 * Confirmed by Ranjeeta on 2026-10-29; recorded as the date this was
 * published, which is when the claim first appears on the site.
 */
export const CONTENT_REVIEWED_AT = "2026-11-03";

/**
 * The pages the review claim is published on.
 *
 * Held as one list rather than a flag on each page so the scope of a
 * governance claim can be read in a single place, and so adding a page cannot
 * pick it up by accident.
 *
 * ─── WHAT IS ON THE LIST ───────────────────────────────────────────────────
 *
 * Pages whose content is health information a reader may act on: the service
 * pillars, the conditions under them, and the safety guidance.
 *
 * ─── WHAT IS DELIBERATELY OFF IT ───────────────────────────────────────────
 *
 * Process pages (/how-it-works/, /transfer-your-care/, /discharge/),
 * commercial pages (/pricing/), governance and legal pages (/about-us/,
 * /complaints/, /conflict-of-interest-disclosure/, /privacy/,
 * /terms-and-conditions/), /contact/, and the two hubs (/articles/,
 * /our-practitioners/).
 *
 * All of them were reviewed too — she reviewed the whole site — but
 * `lastReviewed` on a `MedicalWebPage` is read as a statement about medical
 * content, and putting it on a fee table or a privacy policy stretches it
 * past what it means.
 *
 * /faqs/ is off the list for a different reason: it emits `FAQPage` and no
 * `MedicalWebPage`, and the brief is explicit that a page should not acquire
 * `MedicalWebPage` in order to carry this.
 */
export const REVIEWED_PATHS: readonly string[] = [
  "/weight-management/",
  "/weight-management/medical-weight-loss-program/",
  "/health-optimisation/",
  "/mens-health/",
  "/mens-health/erectile-dysfunction/",
  "/mens-health/hair-loss/",
  "/mens-health/low-testosterone/",
  "/mens-health/premature-ejaculation/",
  "/womens-health/",
  "/womens-health/contraception/",
  "/womens-health/menopause/",
  "/womens-health/pcos-management/",
  "/continuity-preventative-health/",
  "/holistic-alternative-care/",
  "/online-doctor/",
  "/online-doctor/medical-certificates/",
  "/online-doctor/mental-health/",
  "/online-doctor/online-prescriptions/",
  "/online-doctor/pathology-imaging-referrals/",
  "/online-doctor/specialist-referrals/",
  "/patient-safety/",
  "/services/",
];

export function isReviewed(path: string): boolean {
  return REVIEWED_PATHS.includes(path);
}

/**
 * The conditions a page is genuinely about.
 *
 * Only pages whose subject IS the condition. A service page that treats a
 * condition is not the same thing: /womens-health/contraception/ is about an
 * intervention, and /weight-management/medical-weight-loss-program/ is about
 * a program, so neither is here.
 *
 * Naming a condition is permitted — the restricted-terms guard bars
 * prescription classes, not diagnoses — and the remediation spec says so
 * explicitly.
 */
export const PAGE_CONDITIONS: Readonly<Record<string, string>> = {
  "/mens-health/erectile-dysfunction/": "Erectile dysfunction",
  "/mens-health/premature-ejaculation/": "Premature ejaculation",
  "/mens-health/low-testosterone/": "Low testosterone",
  "/mens-health/hair-loss/": "Hair loss",
  "/womens-health/menopause/": "Menopause and perimenopause",
  "/womens-health/pcos-management/": "Polycystic ovary syndrome",
};
