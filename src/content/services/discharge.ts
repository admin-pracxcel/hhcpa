/**
 * PAGE 28: `/discharge/` — her Discharge Letter page.
 *
 * Rebuilt on 2026-09-11 to match
 * https://www.horizonhealthcarepartners.com.au/discharge/
 *
 * It had been a full service-template page: dark hero band, a four-step
 * explainer, a what-to-bring split, a related-pages block, the site-wide
 * closing tagline, and her form bolted on the end. Hers is one screen, in two
 * columns, on white — the offer headline and four reasons on the left, the
 * form in a mint card on the right — then the "Easy Access, Professional Care"
 * band. None of the template's sections are on her page, so none of them are
 * here, and the page no longer goes through `ServicePage` at all.
 *
 * The $59 transfer consultation fee went with it. Her page never quotes a
 * price, and the figure still appears on /pricing/, /holistic-alternative-care/
 * and in the home FAQ, so nothing is lost by not repeating it here.
 *
 * No breadcrumb: hers has none, and a BreadcrumbList with nothing visible on
 * the page to match it is the kind of structured data Google asks you not to
 * emit. MedicalWebPage stays.
 */

export const DISCHARGE_META = {
  /* Her own title, verbatim. */
  title: "Discharge Letter | Switch to Horizon Health Care Partners",
  description:
    "Switch to Horizon Health Care Partners and save 15% on your first consultation. Complete the discharge letter form and we will handle the secure transfer of your medical records.",
  path: "/discharge/",
} as const;

/**
 * The left column, verbatim from her page — including her spaced hyphens and
 * her contraction. These had been tidied into commas and "you are", which is
 * the kind of silent copy-editing that makes a replica stop being one.
 */
export const DISCHARGE_PAGE = {
  eyebrow: "Make the switch",
  heading:
    "Switch to Horizon Health Care Partners & Save 15% on Your First Consultation!",
  intro:
    "Making the switch is simple. Fill out our quick online form, book a telehealth appointment that suits you, and we'll handle the secure transfer of your medical records - so your care continues seamlessly.",
  whyHeading: "Why patients choose Horizon Health Care Partners",
  /*
   * Four reasons, bodies verbatim. They carry no titles on her page and none
   * here — the titles that were here through the tile grid were ours.
   */
  reasons: [
    "Speak with AHPRA-registered practitioners via video or phone - no travel required. Discuss your health concerns from the comfort of your home.",
    "Work with practitioners to develop care plans that may address your individual health needs, lifestyle, and wellness goals.",
    "Clear pricing and flexible online booking designed to fit healthcare around your schedule - not the other way around.",
    "Access care from anywhere in Australia. Continue your consultations whether you're travelling, working remotely, or relocating.",
  ],
} as const;

/**
 * The Discharge Letter form's own copy — hers, all of it.
 *
 * ─── NOTHING HERE IS OURS, BY INSTRUCTION ──────────────────────────────────
 *
 * Two additions used to sit on this page and both are gone, on Bilal's
 * instruction of 2026-09-11: "No additions to the original stuff."
 *
 *   1. The offer line had been reworded by the v2.4 answer to Q32, which tied
 *      the 15% to transferring care rather than to holding a prescription —
 *      the reasoning being that eligibility conditional on a prescription, on
 *      the transfer path for the holistic service, edges from a discount
 *      toward an inducement connected to a prescription-only medicine.
 *
 *   2. A paragraph of offer terms had been added beneath it, on the basis
 *      that the National Law lets you advertise a discount provided its terms
 *      are stated, and her page states none.
 *
 * Both were raised with him with that reasoning, and he asked for her page as
 * it stands. The decision to run it this way is Pracxcel's, not hers, and it
 * is the thing to put in front of her when the site goes back for review.
 *
 * This comment is the record. Do not quietly reinstate either one — and do
 * not delete this note either, because without it the next person finds a
 * discount advertised with no terms and assumes it was an oversight.
 */export const DISCHARGE_FORM = {
  headings: { details: "Your Details", clinic: "Clinic Details" },
  helpLabel:
    "If you need support with acquiring a discharge letter or have any questions, please let us know below and we'll contact you shortly.",
  offer:
    "Receive 15% off your Initial Consultation with a valid discharge letter from your current prescribing doctor or clinic.",
} as const;
