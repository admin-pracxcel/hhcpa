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

/** The left column, verbatim from her page. */
export const DISCHARGE_PAGE = {
  eyebrow: "Make the switch",
  heading:
    "Switch to Horizon Health Care Partners & Save 15% on Your First Consultation!",
  intro:
    "Making the switch is simple. Fill out our quick online form, book a telehealth appointment that suits you, and we'll handle the secure transfer of your medical records so your care continues seamlessly.",
  whyHeading: "Why patients choose Horizon Health Care Partners",
  /*
   * Four reasons, bodies verbatim. They carry no titles on her page and none
   * here — the titles that were here through the tile grid were ours.
   */
  reasons: [
    "Speak with AHPRA-registered practitioners via video or phone, no travel required. Discuss your health concerns from the comfort of your home.",
    "Work with practitioners to develop care plans that may address your individual health needs, lifestyle, and wellness goals.",
    "Clear pricing and flexible online booking designed to fit healthcare around your schedule, not the other way around.",
    "Access care from anywhere in Australia. Continue your consultations whether you are travelling, working remotely, or relocating.",
  ],
} as const;

/**
 * The Discharge Letter form's own copy (build spec v2.3 §8).
 *
 * ─── THE OFFER LINE IS HERS, VERBATIM, BY INSTRUCTION ──────────────────────
 *
 * The v2.4 answer to Q32 had retied the 15% from "a valid discharge letter
 * from your current prescribing doctor or clinic" to transferring care,
 * reasoning that eligibility conditional on holding a prescription — on the
 * transfer path for the holistic service — edges from a discount toward an
 * inducement connected to a prescription-only medicine.
 *
 * That was raised with Bilal on 2026-09-11 and he asked for her wording back:
 * the page is to be a replica. So it is hers, character for character, and
 * this comment is the record of why it says what it says. Do not quietly
 * reword it again — it is her offer, and the decision to run it is Pracxcel's.
 *
 * The terms below are still ours. They stay because the National Law lets you
 * advertise a discount provided its terms are stated, and her page states
 * none. They are the one addition to her copy on this page, and they too need
 * her approval — it is her margin.
 *
 * Their first sentence restates the eligibility basis, so it follows the offer
 * line rather than sitting beside it saying something different. It read
 * "new patients transferring their care from another provider" while the offer
 * above it named a discharge letter, which is the page contradicting itself
 * about who qualifies. Keep the two in step.
 */
export const DISCHARGE_FORM = {
  headings: { details: "Your Details", clinic: "Clinic Details" },
  helpLabel:
    "If you need support with acquiring a discharge letter or have any questions, please let us know below and we'll contact you shortly.",
  /* Hers, verbatim. See the header before changing this. */
  offer:
    "Receive 15% off your Initial Consultation with a valid discharge letter from your current prescribing doctor or clinic.",
  terms:
    "Offer terms: 15% applies to the first consultation fee for new patients who provide a valid discharge letter from their current prescribing doctor or clinic. One use per patient. The discount applies to the consultation fee only and does not apply to medicines, pathology, imaging or any third-party cost. Not available in conjunction with any other offer. A consultation with an AHPRA-registered practitioner is required, and no treatment or prescription is guaranteed. Horizon Health Care Partners may vary or withdraw this offer at any time.",
} as const;
