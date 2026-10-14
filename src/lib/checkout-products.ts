/**
 * The clinic's checkout catalogue — every ref and every price, in one file.
 *
 * Ranjeeta's product list has 45 consultations. Thirty-one have a
 * practitioner's calendar connected and can be paid for today; the rest exist
 * in her portal but cannot be booked.
 *
 * Thirteen were approved on 2026-10-09. Eighteen more arrived on 2026-10-14
 * as "Dr Yulia's links" — the same refs, re-highlighted, which is a statement
 * about whose calendar is connected rather than a new set of URLs. The two
 * lists are unioned, not replaced: Priority / After Hours is live and absent
 * from hers, because she does not do after-hours.
 *
 * Still dark: Health Optimisation & Complete Wellness, Holistic Care /
 * Alternative Medicine, Smoking / Vaping Cessation, Menopause /
 * Perimenopause, and the hormone-therapy products.
 *
 * ─── THE ONLY FILE TO EDIT WHEN A LINK ARRIVES ─────────────────────────────
 *
 * Nothing else on the site holds a ref or a checkout price. When the remaining
 * doctors connect their calendars, add the product here and point its service
 * at it; no component changes. A service with no products falls through to the
 * phone block on its own.
 *
 * ⚠️ Prices here are the portal's, which is what a patient is actually charged
 * at checkout. They are NOT the same source as `content/pricing.ts`, which is
 * what the site advertises, and two of them disagree TODAY, on screen:
 *
 *   mental health          site "from $59"  ·  cheapest here $79
 *   men's & women's health site "from $89"  ·  cheapest here $69
 *
 * Until 2026-10-14 those services had no buttons, so the gap was invisible.
 * It is now visible at the point of payment: a patient reads $59 on
 * /online-doctor/mental-health/ and the cheapest button says $79.
 *
 * Raised with Bilal on 2026-10-14 and his instruction was to proceed. Neither
 * number is to be "fixed" by editing one to match the other — the advertised
 * figure is Ranjeeta's decision and this one is what her portal charges. It
 * is recorded here because it is a live inconsistency, not a stale note.
 *
 * ⚠️ A `note` may state a verifiable fact and nothing else.
 *
 * Her spreadsheet carries a name, a price and a link, so anything a note adds
 * is ours. That is fine where it is checkable — how many days a certificate
 * covers, that after-hours means evenings and weekends, which rung of the
 * prescription ladder the quiz just put the patient on — and not fine where
 * it is advice about which tier to choose, because we would be inventing the
 * clinic's own tiering and charging a patient on it.
 *
 * So several products have no note, and that is deliberate rather than
 * unfinished. The General GP tiers are the ones worth filling in: her
 * consultation durations would say everything the removed guidance tried to,
 * as fact. They are not on the spreadsheet; they need asking for.
 *
 * ⚠️ Her catalogue names a hormone-therapy product by its restricted
 * abbreviation. It is deliberately not in this file: nothing here reaches
 * public copy today, but a ref and a label that sit in `src/` are one careless
 * import away from doing so, and `restricted-terms.test.ts` would fail the
 * build if it did. It has no live link either way.
 */

/** Her portal. The ref is the only parameter it takes. */
const CHECKOUT_BASE =
  "https://portal.horizonhealthcarepartners.com.au/book/consult";

export interface CheckoutProduct {
  /** The `ref` her portal resolves. Never constructed, always written out. */
  readonly ref: string;
  /** What the patient reads on the button, before the price. */
  readonly label: string;
  /** AUD, as her portal charges it. */
  readonly price: number;
  /** Shown under the label where the tier is not obvious from it. */
  readonly note?: string;
}

/**
 * Builds the checkout URL.
 *
 * No patient data, no campaign parameters, nothing but the ref. This page is
 * reached having just answered clinical questions, and anything added to this
 * URL travels into her portal's logs and into the referrer of whatever it
 * loads next.
 */
export function checkoutUrl(product: CheckoutProduct): string {
  return `${CHECKOUT_BASE}?ref=${encodeURIComponent(product.ref)}`;
}

/* -------------------------------------------------------------------------
   The thirteen live products
   ------------------------------------------------------------------------- */

const WEIGHT: readonly CheckoutProduct[] = [
  {
    ref: "weight-metabolic-health-initial",
    label: "Initial consultation",
    price: 99,
    note: "Your first appointment",
  },
  {
    ref: "weight-metabolic-health-short-follow-up",
    label: "Short follow-up",
    price: 69,
    note: "A check-in after your initial consultation",
  },
  /* No note, for the same reason the General GP tiers have none: "when there
     is more to go through" was our guess at when to pick this over a short
     follow-up, not something her catalogue says. */
  {
    ref: "weight-metabolic-health-long-complex-review",
    label: "Long or complex review",
    price: 119,
  },
  {
    ref: "weight-metabolic-health-pathology-results-review",
    label: "Pathology results review",
    price: 59,
    note: "To go through pathology results with your practitioner",
  },
];

const PRESCRIPTION_SIMPLE: CheckoutProduct = {
  ref: "prescriptions-referrals-repeat-prescription-simple",
  label: "Repeat prescription",
  price: 29,
  note: "One medication you already take, no repeats",
};

const PRESCRIPTION_REVIEW: CheckoutProduct = {
  ref: "prescriptions-referrals-prescription-medication-review",
  label: "Prescription or medication review",
  price: 49,
  /* The mirror of the note above: this is what the ladder sends here. */
  note: "More than one medication, repeats, or a new request",
};

const CERTIFICATES: readonly CheckoutProduct[] = [
  {
    ref: "medical-certificates-single-day-certificate",
    label: "Single-day certificate",
    price: 24.9,
    note: "One day",
  },
  {
    ref: "medical-certificates-multi-day-certificate-consultation",
    label: "Multi-day certificate",
    price: 49,
    note: "Two or more days",
  },
];

const GENERAL_CARE: readonly CheckoutProduct[] = [
  /*
   * No notes on the three General GP tiers.
   *
   * They had some, and they said which tier to pick — "one straightforward
   * issue", "more than one issue". Nothing in her catalogue says that. We
   * inferred it from the tier names, and a patient who picks a tier from our
   * guess and is told at the consultation it was the wrong one is owed a
   * refund conversation we caused.
   *
   * Pending her consultation durations. Minutes are a fact and would say all
   * of this without any inference; until they arrive these stay bare.
   */
  { ref: "general-gp-short", label: "Short consultation", price: 59 },
  { ref: "general-gp-standard", label: "Standard consultation", price: 79 },
  { ref: "general-gp-long", label: "Long consultation", price: 109 },
  {
    ref: "priority-after-hours-after-hours",
    label: "After-hours consultation",
    price: 79,
    /* Her own wording, from the after-hours service box. */
    note: "Evenings and weekends",
  },
  /*
   * "First available appointment" came off her own service box and is a
   * promise about availability that is still unresolved with her. Wherever
   * else it sits, it must not sit on a button that takes a payment.
   */
  {
    ref: "priority-after-hours-priority",
    label: "Priority consultation",
    price: 99,
  },
];

/*
 * Added 2026-10-14 from Ranjeeta's second list, "Dr Yulia's links". The refs
 * are the same catalogue as before — these are not per-practitioner URLs —
 * so the list is a statement about which products now have a calendar behind
 * them, not a new set of links.
 *
 * Additive, at Bilal's instruction: Priority / After Hours is live and is
 * absent from her list, because she does not do after-hours. Treating the
 * file as the definitive set would have taken two buttons off the Online
 * Doctor general-care path for no reason anyone asked for.
 */

/* Three tiers each, same shape as General GP: short, standard, long. */
const MENS_HEALTH: readonly CheckoutProduct[] = [
  { ref: "mens-health-short", label: "Short consultation", price: 69 },
  { ref: "mens-health-standard", label: "Standard consultation", price: 89 },
  {
    ref: "mens-health-initial-long",
    label: "Initial or long consultation",
    price: 119,
  },
];

const WOMENS_HEALTH: readonly CheckoutProduct[] = [
  { ref: "womens-health-short", label: "Short consultation", price: 69 },
  { ref: "womens-health-standard", label: "Standard consultation", price: 89 },
  {
    ref: "womens-health-initial-long",
    label: "Initial or long consultation",
    price: 119,
  },
];

const MENTAL_HEALTH: readonly CheckoutProduct[] = [
  { ref: "mental-health-short", label: "Short consultation", price: 79 },
  { ref: "mental-health-standard", label: "Standard consultation", price: 99 },
  {
    ref: "mental-health-initial-long",
    label: "Initial or long consultation",
    price: 129,
  },
];

const CONTINUITY: readonly CheckoutProduct[] = [
  { ref: "continuity-preventative-health-short", label: "Short consultation", price: 69 },
  {
    ref: "continuity-preventative-health-standard",
    label: "Standard consultation",
    price: 89,
  },
  {
    ref: "continuity-preventative-health-comprehensive",
    label: "Comprehensive consultation",
    price: 119,
  },
];

/*
 * The same three tiers at the same three prices as CONTINUITY, under
 * different refs. Which set a patient gets is decided by `cp_focus` in the
 * quiz — "What kind of ongoing care are you looking for?" — whose first
 * option is "Chronic Disease Management". The patient sees identical prices
 * either way; the ref is what routes them to the right product in her portal.
 */
const CHRONIC_DISEASE: readonly CheckoutProduct[] = [
  { ref: "chronic-disease-management-short", label: "Short consultation", price: 69 },
  {
    ref: "chronic-disease-management-standard",
    label: "Standard consultation",
    price: 89,
  },
  { ref: "chronic-disease-management-long", label: "Long consultation", price: 119 },
];

/*
 * All three, because the quiz asks one question — "a pathology, imaging or
 * specialist referral" — and does not ask which. The patient picks here, the
 * same way they pick a certificate length.
 */
const REFERRALS: readonly CheckoutProduct[] = [
  {
    ref: "prescriptions-referrals-pathology-referral",
    label: "Pathology referral",
    price: 49,
  },
  {
    ref: "prescriptions-referrals-imaging-referral",
    label: "Imaging referral",
    price: 49,
  },
  {
    ref: "prescriptions-referrals-specialist-allied-health-referral",
    label: "Specialist or allied health referral",
    price: 49,
  },
];

/* -------------------------------------------------------------------------
   Which products a finished quiz offers
   ------------------------------------------------------------------------- */

/**
 * The four answers to "What do you need from the online doctor?".
 *
 * Kept as the literal option strings from `od_kind` in content/quiz.ts rather
 * than as a mapped enum: the answer travels as text, and a second vocabulary
 * in between is one more thing that can drift out of step with the question.
 */
/* The first option on `cp_focus`, kept as its literal string for the same
   reason as the `od_kind` answers below. */
const CP_CHRONIC = "Chronic Disease Management";

const OD_PRESCRIPTION = "A prescription or repeat script";
const OD_CERTIFICATE = "A medical certificate";
const OD_GENERAL = "General or everyday care";
const OD_REFERRAL = "A pathology, imaging or specialist referral";

export interface CheckoutSelection {
  readonly service: string;
  /** The `online_doctor_kind` answer, when the service is Online Doctor. */
  readonly onlineDoctorKind?: string;
  /** `prescriptionFee` from content/quiz.ts: 29 for simple, 49 otherwise. */
  readonly prescriptionFee?: number | null;
  /**
   * The `continuity_focus` answer, when the service is Continuity &
   * Preventative Health. Chronic disease management is its own set of refs.
   */
  readonly continuityFocus?: string;
}

/**
 * The products to show, or an empty list meaning "offer the phone instead".
 *
 * Empty is the default and the safe one. A service with no live link, an
 * unrecognised answer, a referral request, or anything this does not know
 * about all land on the phone block rather than on a checkout that cannot
 * complete.
 */
export function productsFor(
  selection: CheckoutSelection,
): readonly CheckoutProduct[] {
  switch (selection.service) {
    case "Weight Management":
      return WEIGHT;
    case "Men's Health":
      return MENS_HEALTH;
    case "Women's Health":
      return WOMENS_HEALTH;
    case "Mental Health Support":
      return MENTAL_HEALTH;
    case "Continuity & Preventative Health":
      /* Her first `cp_focus` option. Everything else on that question —
         preventative programs, care plans, monitoring, risk assessment — is
         ongoing care rather than management of a diagnosed condition. */
      return selection.continuityFocus === CP_CHRONIC
        ? CHRONIC_DISEASE
        : CONTINUITY;
    default:
      break;
  }

  if (selection.service !== "Online Doctor") {
    /*
     * Health Optimisation & Complete Wellness and Holistic Care /
     * Alternative Medicine. Both are in her catalogue; neither is on Dr
     * Yulia's list and neither had a calendar before it. They arrive here by
     * having no branch rather than by being listed, so adding one is adding
     * its products above and nothing else.
     */
    return [];
  }

  switch (selection.onlineDoctorKind) {
    case OD_PRESCRIPTION:
      /*
       * Her portal sells the two tiers of the prescription ladder separately,
       * and the quiz has already worked out which one applies — `rx_count`,
       * `rx_repeats` and `rx_current`, through `prescriptionFee`. Showing the
       * patient both would ask them to re-answer a question they have
       * answered, and let them pick the cheaper one wrongly.
       */
      return [
        selection.prescriptionFee === PRESCRIPTION_SIMPLE.price
          ? PRESCRIPTION_SIMPLE
          : PRESCRIPTION_REVIEW,
      ];
    case OD_CERTIFICATE:
      /* Both, because the length is the patient's to choose and the
         certificate assessment does not decide it for them. */
      return CERTIFICATES;
    case OD_GENERAL:
      return GENERAL_CARE;
    case OD_REFERRAL:
      return REFERRALS;
    default:
      return [];
  }
}
