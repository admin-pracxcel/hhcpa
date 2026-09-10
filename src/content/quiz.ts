/**
 * The pre-screening quiz.
 *
 * The flow is data, not code: `next` maps an answer to the next step, so the
 * branch logic is inspectable in one place rather than spread through a
 * component. `QuizStep` is a discriminated union and the renderer has an
 * exhaustiveness guard, so adding a step kind without rendering it is a
 * compile error.
 *
 * ─── PROVENANCE ────────────────────────────────────────────────────────────
 *
 * The gates and the mental-health and holistic branches were migrated from the
 * client's live FluentForms build. The weight-loss and health-optimisation
 * branches come from Ranjeeta's written specification (September 2026), which
 * supersedes what was live.
 *
 * Where that specification was incomplete, the decision taken is recorded at
 * the step. Search this file for "DECISION" to find all of them. None of them
 * invented a clinical question; each either resolved a conflict between two of
 * her own rules or added the minimum needed to implement a rule she stated.
 *
 * ─── FLAGGED FOR SIGN-OFF ──────────────────────────────────────────────────
 *
 * Three things here were raised with the client and built at their direction.
 * They are not code defects; they are decisions for the compliance reviewer.
 *
 *   1. The holistic branch is a medicinal-cannabis SAS-B eligibility screen
 *      under a wellness label. Its "Unable to Proceed" exits name the answer
 *      that disqualified the patient, so a second run-through passes. The
 *      content brief's own rule is that the quiz "must not coach answers or
 *      determine any prescribing decision".
 *   2. The BMI band messages and the weight-loss closing message state a
 *      treatment direction before any practitioner has seen the patient. See
 *      BMI_BANDS and TRIAGE_MESSAGES.
 *   3. Sex at birth offers Female and Male only, as specified. Standard for the
 *      clinical purpose, but it is the one question here a patient cannot
 *      answer accurately for every body.
 */

import { PRICES } from "./pricing";

/* -------------------------------------------------------------------------
   Step model
   ------------------------------------------------------------------------- */

export type QuizFieldType = "number" | "date" | "text";

export interface QuizField {
  readonly name: string;
  readonly label: string;
  readonly type: QuizFieldType;
  readonly placeholder?: string;
  readonly min?: number;
  readonly max?: number;
  readonly unit?: string;
}

/** A text box revealed by one specific answer — "if yes, please specify". */
export interface FollowUp {
  readonly when: string;
  readonly name: string;
  readonly label: string;
}

interface StepBase {
  readonly id: string;
  readonly question: string;
  /**
   * The "Why are we asking this question?" copy. Shown under the question,
   * always — it is the answer to a question patients ask about ethnicity and
   * sex, and burying it would defeat the point of having written it.
   */
  readonly note?: string;
  /** Clinical answers travel under the segregated `clinical` key. */
  readonly clinical?: boolean;
}

export type QuizStep =
  | (StepBase & {
      readonly kind: "choice";
      /** Posted field name. */
      readonly field: string;
      readonly options: readonly string[];
      /** Advisory shown when a given option is chosen. Does not end the flow. */
      readonly optionNotes?: Readonly<Record<string, string>>;
      /**
       * Options that must surface crisis support on screen the moment they are
       * chosen, before anything else, and set the safety flag on the
       * submission.
       *
       * Not an exit. The v2.4 answer to Q31: a hard exit turns away someone
       * who has just disclosed, and leaves nobody to follow up. Red plus the
       * contact step means they see the numbers immediately, they are not
       * blocked from continuing or from leaving, they are not auto-booked, and
       * a human is told.
       */
      readonly optionCrisis?: readonly string[];
      readonly followUp?: FollowUp;
      /** Answer → next step id. `*` is the fallback for any other answer. */
      readonly next: Readonly<Record<string, string>>;
    })
  | (StepBase & {
      readonly kind: "multi";
      readonly field: string;
      readonly options: readonly string[];
      readonly optionNotes?: Readonly<Record<string, string>>;
      /** Free text for "Other, please add ___". */
      readonly other?: { readonly name: string; readonly label: string };
      readonly next: string;
    })
  | (StepBase & {
      readonly kind: "input";
      readonly fields: readonly QuizField[];
      readonly next: string;
    })
  | (StepBase & {
      readonly kind: "bmi";
      readonly next: string;
    })
  | {
      readonly kind: "summary";
      readonly id: string;
      readonly heading: string;
      readonly body: string;
      readonly next: string;
    }
  | {
      readonly kind: "exit";
      readonly id: string;
      readonly variant: "blocked" | "crisis" | "emergency";
      readonly heading: string;
      readonly body: string;
    }
  | { readonly kind: "contact"; readonly id: string };

/* -------------------------------------------------------------------------
   Page copy
   ------------------------------------------------------------------------- */

export const QUIZ_META = {
  title: "Free Pre-Screening Quiz | Check Your Eligibility | HHCPA",
  description:
    "Take the free pre-screening quiz to see if online telehealth care may suit you. Not a diagnosis. No obligation.",
  path: "/quiz/",
} as const;

export const QUIZ_PAGE = {
  crumbs: [{ label: "Home", href: "/" }],
  hero: {
    eyebrow: "Pre-screening quiz",
    heading: "See whether we are likely to be able to help",
    primary: { label: "Start the quiz", href: "#quiz" },
    secondary: { label: "Talk to us instead", href: "/contact/" },
  },
  intro:
    "This short quiz helps us understand your situation and see whether we are likely to be able to help. It is free, there is no obligation, and it is not a diagnosis. Whatever your answers, nothing is prescribed from this quiz. If it looks like we can help, the next step is a real consultation with an AHPRA-registered practitioner, who makes any clinical decisions.",
  safety: {
    eyebrow: "If it is urgent",
    heading: "This quiz is not for emergencies",
    body: "If you are in crisis, thinking about harming yourself, or facing a medical emergency, do not wait for a reply. Call 000, or contact Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636. Both are free and answer 24 hours a day.",
  },
  closing: {
    heading: "Prefer to speak to someone first?",
    body: "You do not have to take the quiz to reach us. Send a message or call, and we will point you to the right starting place.",
    primary: { label: "Contact us", href: "/contact/" },
  },
} as const;

/* -------------------------------------------------------------------------
   BMI
   ------------------------------------------------------------------------- */

/**
 * BMI bands, highest first — `bmiMessage` returns the first band the value
 * reaches.
 *
 * DECISION: plain BMI, no ethnicity adjustment. The specification mentioned a
 * lower threshold for Asian and Aboriginal and Torres Strait Islander patients
 * (27.5 rather than 30) but left that sentence without a consequent, and it
 * conflicted with the three bands given immediately after. The client confirmed
 * "calculate the BMI as usual" and supplied the wording below verbatim.
 * Ethnicity is still collected and goes to the practitioner, who can apply the
 * adjusted threshold with the patient in front of them.
 *
 * ⚠️ FLAGGED: the >= 27 message tells a patient they "might need medication"
 * before any practitioner has assessed them. Built as directed.
 */
export const BMI_BANDS = [
  {
    min: 27,
    message:
      "Your BMI result suggests that you are overweight and you might need medication as part of your overall weight loss treatment. Please answer the following questions to have a better understanding of your health condition.",
  },
  {
    min: 25,
    message:
      "Your BMI result suggests that you are overweight and you should begin with a reduced or a low energy diet, combined with a program to increase regular physical activity.",
  },
  {
    min: 0,
    message:
      "Your BMI is within the healthy range. Weight management treatments may not be appropriate, however a practitioner can discuss your health goals and determine suitable options.",
  },
] as const;

/** BMI = weight (kg) / height (m) squared. Null until both are usable. */
export function calculateBmi(heightCm: string, weightKg: string): number | null {
  const metres = Number(heightCm) / 100;
  const kilos = Number(weightKg);
  if (!Number.isFinite(metres) || !Number.isFinite(kilos)) return null;
  if (metres <= 0 || kilos <= 0) return null;
  return Math.round((kilos / (metres * metres)) * 10) / 10;
}

export function bmiMessage(bmi: number): string {
  return BMI_BANDS.find((band) => bmi >= band.min)?.message ?? "";
}

/* -------------------------------------------------------------------------
   Flow
   ------------------------------------------------------------------------- */

/** Offered on every multi-select, so "none" is answerable without skipping. */
export const NONE_OF_THESE = "None of these";

/**
 * Where the flow starts.
 *
 * Exported rather than hardcoded in the form, because the reachability test
 * walks from here too — and when the emergency gate was promoted ahead of the
 * age gate, a literal "age" in two files meant the new first step was
 * unreachable in one of them and the test found it in the other.
 */
export const QUIZ_ENTRY_STEP = "emergency";

export const QUIZ_STEPS: readonly QuizStep[] = [
  /* ---------- gates ----------
     Build spec v2.3 §1 puts three gates ahead of everything: emergency, age,
     residency. Age and residency were already here and already applied to
     every service; the emergency question was not — it sat inside the holistic
     branch, so someone in crisis picking any other service was never asked.
     It is Step 0 now, for all eight.

     Two reasons it runs before anything else, both from the v2.2 answer to
     Q23: someone in an emergency should not complete seven minutes of intake
     before being told to call 000, and collecting a name, date of birth and
     address from them would be a data-minimisation failure on top of a safety
     one.

     DECISION: the age gate stays a yes/no rather than becoming the weight-loss
     branch's date of birth. Nothing identifying is collected until the closing
     step, so abandoning the quiz early leaves no partial record of a person. A
     date of birth at question one would end that property. */
  {
    kind: "choice",
    id: "emergency",
    field: "emergency_check",
    question: "Are you experiencing a medical emergency?",
    options: ["Yes", "No"],
    next: { Yes: "exit-emergency", No: "age" },
  },
  {
    kind: "exit",
    id: "exit-emergency",
    variant: "emergency",
    heading: "Emergency",
    body: "Please call 000 or attend your nearest emergency department immediately.",
  },
  {
    kind: "choice",
    id: "age",
    field: "age_check",
    question: "Are you 18 years of age or older?",
    options: ["Yes", "No"],
    next: { Yes: "australia", No: "exit-age" },
  },
  {
    kind: "exit",
    id: "exit-age",
    variant: "blocked",
    heading: "Unable to Proceed",
    body: "You must be 18 years of age or older to use our services.",
  },
  {
    kind: "choice",
    id: "australia",
    field: "australia_check",
    question: "Are you currently located in Australia?",
    options: ["Yes", "No"],
    next: { Yes: "service", No: "exit-location" },
  },
  {
    kind: "exit",
    id: "exit-location",
    variant: "blocked",
    heading: "Unable to Proceed",
    body: "Our services are only available to patients currently located in Australia.",
  },

  /* ---------- branch selection ----------
     Eight services, matching the site's navigation (build spec v2 §1.1). It
     was four, which is why her instruction said the screening questions are
     currently the same for every service even where they do not suit.

     Three of the eight run no screening at all and go straight to the closing
     step. Online Doctor's general care, its referral branches and Continuity &
     Preventative Health are everyday GP work: the consultation is the
     screening, and there is no assessment form for any of them (v2.4 answer to
     Q30). Advertising a questionnaire with no questions behind it is worse
     than not having one. */
  {
    kind: "choice",
    id: "service",
    field: "service_selection",
    question: "What service are you interested in?",
    options: [
      "Weight Management",
      "Health Optimisation & Complete Wellness",
      "Men's Health",
      "Women's Health",
      "Mental Health Support",
      "Online Doctor",
      "Continuity & Preventative Health",
      "Holistic Care / Alternative Medicine",
    ],
    next: {
      "Weight Management": "wl_dob",
      "Health Optimisation & Complete Wellness": "ho_goal",
      "Men's Health": "mn_concern",
      "Women's Health": "wh_concern",
      "Mental Health Support": "mh_diagnosed",
      "Online Doctor": "od_kind",
      "Continuity & Preventative Health": "contact",
      "Holistic Care / Alternative Medicine": "hl_concern",
    },
  },
  {
    kind: "choice",
    id: "od_kind",
    field: "online_doctor_kind",
    question: "What do you need from the online doctor?",
    options: [
      "A prescription or repeat script",
      "A medical certificate",
      "A pathology, imaging or specialist referral",
      "General or everyday care",
    ],
    /*
     * Prescriptions and certificates have their own flows to come (§4.8 and
     * §4.9). Until those are built every branch lands on the closing step,
     * which books a consultation — the safe default, and the same thing the
     * referral and general-care branches do permanently.
     */
    next: {
      "A prescription or repeat script": "rx_count",
      "*": "contact",
    },
  },

  /* ---------- online prescriptions, the conditional ladder (§4.8) ----------
     Her three questions, in her order. She modelled them on a competitor's
     flow and asked for the wording changed rather than copied, so these are
     rewritten; the branching and the two prices are hers.

     Every answer that is not the simple case takes the fee to the upper tier —
     one medication, no repeats, already taking it, or $49. That is the v2.2
     answer to Q8: the ladder as she wrote it maps each question independently
     to a price, which leaves six of the eight combinations undefined, and "any
     trigger lifts it" is the only reading consistent with the flow she
     screenshotted. Going to her as a one-line confirmation because it is money.

     ⚠️ BLOCKED, and built around: whether the $19 tier includes a real-time
     consultation is Section 8 item 2. Nothing here asserts either way — the
     fee is shown, the routing is the same as every other branch, and the
     answer only changes what n8n does with it. */
  {
    kind: "choice",
    id: "rx_count",
    field: "rx_count",
    clinical: true,
    question: "How many medications are you requesting?",
    options: ["One", "More than one"],
    next: { "*": "rx_repeats" },
  },
  {
    kind: "choice",
    id: "rx_repeats",
    field: "rx_repeats",
    clinical: true,
    question: "Would you like to request repeats?",
    options: ["No", "Yes"],
    next: { "*": "rx_current" },
  },
  {
    kind: "choice",
    id: "rx_current",
    field: "rx_current",
    clinical: true,
    question: "Are you currently taking this medication?",
    options: ["Yes", "No"],
    next: { "*": "contact" },
  },

  /* ---------- mental health (migrated, unchanged) ---------- */
  {
    kind: "choice",
    id: "mh_diagnosed",
    field: "mh_diagnosed",
    clinical: true,
    question: "Have you been diagnosed with a mental health condition?",
    options: ["Yes", "No"],
    next: { "*": "mh_on_treatment" },
  },
  {
    kind: "choice",
    id: "mh_on_treatment",
    field: "mh_on_treatment",
    clinical: true,
    question:
      "Are you currently on treatment for your mental health condition?",
    options: ["Yes", "No"],
    next: { "*": "mh_severe_crisis" },
  },
  {
    kind: "choice",
    id: "mh_severe_crisis",
    field: "mh_severe_crisis",
    clinical: true,
    question: "Are you experiencing severe symptoms or crisis?",
    options: ["Yes", "No"],
    /*
     * Was `Yes: "exit-crisis"`, a hard exit. The v2.4 answer to Q31 replaced
     * it: the numbers appear immediately and inline, the person can carry on
     * or leave as they choose, the outcome is red so nothing auto-books, and
     * the submission carries `safetyFlag` so a human is actually told. The old
     * exit did the first part and none of the rest — it showed the numbers and
     * then dropped the person, with no record that anyone had disclosed.
     */
    optionCrisis: ["Yes"],
    optionNotes: {
      Yes: "If you are in crisis or thinking about harming yourself, please contact one of the services above now. You can still continue if you would like us to arrange a consultation, and someone from our team will be in touch.",
    },
    next: { "*": "contact" },
  },

  /* ---------- weight loss (the 14-question instrument) ---------- */
  {
    kind: "input",
    id: "wl_dob",
    clinical: true,
    question: "What is your date of birth?",
    fields: [{ name: "wl_dob", label: "Date of birth", type: "date" }],
    next: "wl_sex",
  },
  {
    kind: "choice",
    id: "wl_sex",
    field: "wl_sex_at_birth",
    clinical: true,
    question: "What is your sex at birth?",
    note: "Abdominal obesity and treatment approach will differ according to sex.",
    options: ["Female", "Male"],
    next: { "*": "wl_bmi" },
  },
  {
    kind: "bmi",
    id: "wl_bmi",
    clinical: true,
    question: "What is your current weight and height?",
    next: "wl_waist",
  },
  {
    kind: "input",
    id: "wl_waist",
    clinical: true,
    question: "What is your waist circumference?",
    note: "You can measure properly if you place the tape measure between the top of your hip and the bottom of your ribs.",
    fields: [
      {
        name: "wl_waist_cm",
        label: "Waist circumference",
        type: "number",
        placeholder: "92",
        min: 40,
        max: 250,
        unit: "cm",
      },
    ],
    next: "wl_ethnicity",
  },
  {
    kind: "choice",
    id: "wl_ethnicity",
    field: "wl_ethnicity",
    clinical: true,
    question: "What is your ethnic background?",
    note: "Fat distribution in the body can differ across races. By understanding your ethnic background, our practitioners can better assess potential risks.",
    options: [
      "African",
      "Asian (incl. Indian subcontinent)",
      "Australian Aboriginal & Torres Strait Islander",
      "Caucasian",
      "Middle Eastern",
      "Latino/Hispanic",
      "Pacific Islander or Maori",
      "Other",
    ],
    followUp: {
      when: "Other",
      name: "wl_ethnicity_other",
      label: "Please describe",
    },
    next: { "*": "wl_bloods" },
  },
  {
    kind: "multi",
    id: "wl_bloods",
    field: "wl_recent_bloods",
    clinical: true,
    question:
      "Have you had a recent blood test where your doctor identified elevated levels of any of the following?",
    options: ["Blood sugar", "Cholesterol", "Triglycerides", NONE_OF_THESE],
    next: "wl_family",
  },
  {
    kind: "choice",
    id: "wl_family",
    field: "wl_family_weight",
    clinical: true,
    question: "Does any member of your family have weight issues?",
    options: ["Yes", "No"],
    next: { "*": "wl_childhood" },
  },
  {
    kind: "choice",
    id: "wl_childhood",
    field: "wl_childhood_weight",
    clinical: true,
    question:
      "Did you have difficulty maintaining a healthy weight during childhood?",
    options: ["Yes", "No"],
    next: { "*": "wl_life_events" },
  },
  {
    kind: "multi",
    id: "wl_life_events",
    field: "wl_life_events",
    clinical: true,
    question: "Have you recently experienced any of the following?",
    options: [
      "Moving out of home",
      "Starting new job",
      "Living with a partner",
      "Currently pregnant",
      "Ceasing sport",
      "Ceasing smoking",
      "Retirement",
      NONE_OF_THESE,
    ],
    optionNotes: {
      /* Advisory, as specified. Pregnancy also sets a red triage — see
         `triage` below for why it is both. */
      "Currently pregnant":
        "We advise you to consult your GP and follow the recommendations.",
    },
    other: { name: "wl_life_events_other", label: "Something else" },
    next: "wl_conditions",
  },
  {
    kind: "multi",
    id: "wl_conditions",
    field: "wl_conditions",
    clinical: true,
    question: "Do you have any ongoing health conditions?",
    note: "The presence of certain health conditions may require the involvement of specific specialists for more comprehensive care. Please answer this question accurately so our team can provide you with the best possible care.",
    options: [
      "Diabetes or pre-diabetes",
      "High blood pressure",
      "Allergy",
      "Metabolic syndrome",
      "Coronary heart disease and stroke",
      "Certain cancers",
      "Hypothyroidism",
      "Cushing syndrome",
      "Liver and biliary diseases",
      "Breathing conditions",
      "Osteoarthritis",
      "Infertility",
      "Cataracts",
      "Gastroesophageal reflux disease",
      "Polycystic ovary syndrome",
      "Urinary stress incontinence",
      "Depression and anxiety",
      "Eating disorders",
      NONE_OF_THESE,
    ],
    optionNotes: {
      "Diabetes or pre-diabetes":
        "Treatment for overweight and obesity in individuals with diabetes requires special consideration of their current diabetes management. We recommend discussing your concerns with the physician managing your diabetes care.",
    },
    other: { name: "wl_conditions_other", label: "Another condition" },
    next: "wl_medications",
  },
  {
    kind: "multi",
    id: "wl_medications",
    field: "wl_medications",
    clinical: true,
    question: "Do you take any of the medications below?",
    options: [
      "Corticosteroids",
      "Anti-psychotics",
      "Antidepressants (e.g. mirtazapine)",
      "Lithium",
      "Anti-seizure medications (e.g. valproate, carbamazepine, gabapentin)",
      "Certain diabetes medications",
      NONE_OF_THESE,
    ],
    other: { name: "wl_medications_other", label: "Another medication" },
    next: "wl_tried_methods",
  },
  {
    kind: "multi",
    id: "wl_tried_methods",
    field: "wl_tried_methods",
    clinical: true,
    question:
      "Have you previously tried any of the weight loss methods listed below?",
    options: [
      "Low calorie diet",
      "Fasting",
      "Exercise",
      "Weight loss medications",
      "Surgery",
      NONE_OF_THESE,
    ],
    other: { name: "wl_tried_methods_other", label: "Another method" },
    next: "wl_tried_meds",
  },
  {
    kind: "choice",
    id: "wl_tried_meds",
    field: "wl_tried_medications",
    clinical: true,
    question:
      "Have you previously tried any medications for weight loss treatment?",
    options: ["Yes", "No"],
    followUp: {
      when: "Yes",
      name: "wl_tried_medications_detail",
      label: "Please specify",
    },
    next: { "*": "wl_summary" },
  },
  {
    kind: "summary",
    id: "wl_summary",
    heading: "Your summary",
    body: "Please check these before you continue. Use Back if you need to change an answer.",
    next: "contact",
  },

  /* ---------- health optimisation ----------
     DECISION: this replaces the migrated "Complete Wellness" branch rather than
     sitting beside it. The Health Optimisation Screening covers the same ground
     — goals, conditions, medications — in more detail and adds the triage, so
     running both would ask everything twice.

     The 18+ and Australia questions in its Step 2 are not repeated: they are
     already the gates every branch passes through. */
  {
    kind: "choice",
    id: "ho_goal",
    field: "ho_primary_goal",
    question:
      "What is your primary reason for seeking a Health Optimisation Program?",
    options: [
      "Weight Management & Metabolic Health",
      "Healthy Ageing & Longevity",
      "Recovery & Physical Wellbeing",
      "Mental Clarity & Focus",
      "Energy, Vitality & Wellness",
      "Sexual Health & Wellbeing",
      "General Wellness Optimisation",
    ],
    next: { "*": "ho_prior_therapy" },
  },
  {
    kind: "choice",
    id: "ho_prior_therapy",
    field: "ho_prior_therapy",
    clinical: true,
    /*
     * DECISION (compliance remediation, 2026-09-04): the client's migrated
     * wording was "Have you previously used peptide therapy or prescription
     * weight management medications?". "Peptide" names a restricted prescription
     * class, and HHCPA_Remediation_Change_Spec.md §A6 bars it from all public
     * copy — the quiz is rendered to patients, so it is public copy. Only the
     * naming changed: the question still screens for prior use of prescription
     * weight-management therapy, the branch, the field and the triage flag are
     * untouched. The quiz as a whole still needs its own compliance review
     * under §B23; this edit does not constitute that review.
     */
    question:
      "Have you previously used prescription weight management medications or therapies?",
    options: ["Yes", "No"],
    followUp: {
      when: "Yes",
      name: "ho_prior_therapy_detail",
      label: "Please provide details",
    },
    next: { "*": "ho_specialist" },
  },
  {
    kind: "choice",
    id: "ho_specialist",
    field: "ho_under_specialist",
    clinical: true,
    question: "Are you currently under the care of a GP or Specialist?",
    options: ["Yes", "No"],
    next: { "*": "ho_pregnancy" },
  },
  {
    kind: "choice",
    id: "ho_pregnancy",
    field: "ho_pregnancy",
    clinical: true,
    question: "Are you pregnant, planning pregnancy or breastfeeding?",
    options: ["Yes", "No"],
    next: { "*": "ho_cancer" },
  },
  {
    kind: "choice",
    id: "ho_cancer",
    field: "ho_cancer",
    clinical: true,
    question: "Have you ever been diagnosed with cancer?",
    options: ["Yes", "No"],
    next: { Yes: "ho_cancer_active", No: "ho_organ" },
  },
  {
    /* DECISION: added. The red criterion is "active cancer treatment", but the
       question above asks whether the patient has *ever* been diagnosed. One
       cannot be derived from the other, so the distinction is asked rather than
       assumed — someone ten years clear should not be triaged the same as
       someone in treatment now. */
    kind: "choice",
    id: "ho_cancer_active",
    field: "ho_cancer_active",
    clinical: true,
    question: "Are you currently receiving treatment for cancer?",
    options: ["Yes", "No"],
    next: { "*": "ho_organ" },
  },
  {
    kind: "choice",
    id: "ho_organ",
    field: "ho_organ_condition",
    clinical: true,
    question: "Do you have a liver, kidney or heart condition?",
    options: ["Yes", "No"],
    next: { Yes: "ho_organ_control", No: "ho_medications" },
  },
  {
    /* DECISION: added, for the same reason as ho_cancer_active. The red
       criterion is "serious uncontrolled cardiac disease"; the question above
       cannot establish whether a condition is controlled. */
    kind: "choice",
    id: "ho_organ_control",
    field: "ho_organ_controlled",
    clinical: true,
    question:
      "Is that condition currently well controlled and monitored by a doctor?",
    options: ["Yes", "No"],
    followUp: {
      when: "No",
      name: "ho_organ_detail",
      label: "Please tell us more",
    },
    next: { "*": "ho_medications" },
  },
  {
    kind: "choice",
    id: "ho_medications",
    field: "ho_medications",
    clinical: true,
    question: "Are you currently taking any prescription medications?",
    options: ["Yes", "No"],
    followUp: {
      when: "Yes",
      name: "ho_medications_list",
      label: "Please list them",
    },
    next: { "*": "ho_allergies" },
  },
  {
    kind: "choice",
    id: "ho_allergies",
    field: "ho_injectable_allergies",
    clinical: true,
    question: "Do you have any allergies to injectable medications?",
    options: ["Yes", "No"],
    followUp: {
      when: "Yes",
      name: "ho_injectable_allergies_detail",
      label: "Please specify",
    },
    next: { "*": "contact" },
  },

  /* ---------- men's health (HHCPA-FRM-005) ----------
     New. Men's Health had no screening of its own — it ran whatever branch
     the four-way selector happened to send it to. These are the reason-for-
     consultation and health-background questions from her assessment form,
     which name conditions only and no medicine.

     §1.1 of the addendum sets the rule for the four services with a form but
     no separate screening set: the form's own tick-list drives the outcome,
     any contraindication produces amber, and nothing auto-excludes except the
     three gates. So there are no exits in this branch. */
  {
    kind: "choice",
    id: "mn_concern",
    field: "mn_concern",
    clinical: true,
    question: "What is your main concern?",
    options: [
      "General health check",
      "Sexual health",
      "Erectile concerns",
      "Low energy",
      "Hormonal concerns",
      "Urinary symptoms",
      "Fertility",
      "Weight management",
      "Mental wellbeing",
      "Other",
    ],
    next: { "*": "mn_background" },
  },
  {
    kind: "multi",
    id: "mn_background",
    field: "mn_background",
    clinical: true,
    question: "Please tick any that apply to your health background.",
    options: [
      "High blood pressure",
      "Heart disease",
      "Diabetes",
      "High cholesterol",
      "Prostate condition",
      "Sleep apnoea",
      "Mental health condition",
      "Liver or kidney disease",
      NONE_OF_THESE,
    ],
    next: "mn_medications",
  },
  {
    kind: "choice",
    id: "mn_medications",
    field: "mn_medications",
    clinical: true,
    question: "Are you currently taking any medications or supplements?",
    options: ["Yes", "No"],
    followUp: {
      when: "Yes",
      name: "mn_medications_detail",
      label: "Please list them",
    },
    next: { "*": "contact" },
  },

  /* ---------- women's health (HHCPA-FRM-006) ----------
     New, on the same basis as men's health above. */
  {
    kind: "choice",
    id: "wh_concern",
    field: "wh_concern",
    clinical: true,
    question: "What is your main concern?",
    options: [
      "Menstrual concerns",
      "Menopause or perimenopause",
      "PCOS",
      "Endometriosis",
      "Contraception",
      "Sexual health",
      "Fertility",
      "Weight management",
      "Breast health",
      "Other",
    ],
    next: { "*": "wh_stage" },
  },
  {
    kind: "choice",
    id: "wh_stage",
    field: "wh_reproductive_stage",
    clinical: true,
    question: "Which best describes your current reproductive stage?",
    options: [
      "Regular periods",
      "Irregular periods",
      "No periods",
      "Perimenopause",
      "Post-menopause",
      "Not applicable",
    ],
    next: { "*": "wh_history" },
  },
  {
    kind: "multi",
    id: "wh_history",
    field: "wh_history",
    clinical: true,
    question: "Please tick any that apply.",
    options: [
      "Pregnant",
      "Planning pregnancy",
      "Breastfeeding",
      "History of blood clots",
      "Migraine with aura",
      "Breast or ovarian cancer history",
      "PCOS",
      "Endometriosis",
      NONE_OF_THESE,
    ],
    next: "wh_medications",
  },
  {
    kind: "choice",
    id: "wh_medications",
    field: "wh_medications",
    clinical: true,
    question: "Are you currently taking any medications or supplements?",
    options: ["Yes", "No"],
    followUp: {
      when: "Yes",
      name: "wh_medications_detail",
      label: "Please list them",
    },
    next: { "*": "contact" },
  },

  /* ---------- holistic / alternative care (HHCPA-FRM-003) ----------
     ⚠️ THIS BRANCH WAS REPLACED. Read this before restoring anything from it.

     What was here was the migrated live-site flow, and it was a medicinal
     cannabis SAS-B eligibility gate under a wellness label: chronic condition
     lasting over three months, then conventional medication tried, then that
     medication unsuccessful or causing adverse effects, then a disqualifying
     conditions list, then psychiatric history. Five hard exits, and each one
     told the patient which answer had disqualified them — "our consultations
     require a diagnosed chronic condition", "you need to have tried
     conventional prescription medication". A patient who read that could go
     back and change the answer, and pass.

     That is the pattern AHPRA names when it warns about online questionnaires
     that coach patients to say the right thing, and it was flagged in this
     file's header from the day it was migrated. The v2.4 answer to Q34 settled
     it: exits must not name the disqualifying answer, and §1.1 settled the
     rest by removing the exits entirely — nothing auto-excludes except the
     three gates.

     What replaces it is her own HHCPA-FRM-003, which names conditions only and
     no medicine at all. Its contraindication tick-list feeds the triage as
     amber rather than as a door closing. Nobody is turned away; a practitioner
     reviews instead, which is where that judgement belonged. */
  {
    kind: "choice",
    id: "hl_concern",
    field: "hl_concern",
    clinical: true,
    question: "What would you like support with?",
    options: [
      "Chronic pain",
      "Sleep difficulties",
      "Anxiety or stress",
      "PTSD symptoms",
      "Fibromyalgia",
      "Arthritis",
      "Neuropathy",
      "Other",
    ],
    next: { "*": "hl_duration" },
  },
  {
    kind: "input",
    id: "hl_duration",
    clinical: true,
    question: "How long have your symptoms been present, and how severe are they?",
    fields: [
      {
        name: "hl_duration",
        label: "How long have symptoms been present?",
        type: "text",
        placeholder: "For example, eighteen months",
      },
      {
        name: "hl_severity",
        label: "Current severity",
        type: "number",
        min: 0,
        max: 10,
        unit: "out of 10",
      },
    ],
    next: "hl_previous_care",
  },
  {
    kind: "choice",
    id: "hl_previous_care",
    field: "hl_previous_care",
    clinical: true,
    question:
      "Have you tried any treatments or medicines for this before?",
    options: ["Yes", "No"],
    followUp: {
      when: "Yes",
      name: "hl_previous_care_detail",
      label: "What did you try, and what was the outcome?",
    },
    next: { "*": "hl_conditions" },
  },
  {
    kind: "multi",
    id: "hl_conditions",
    field: "hl_conditions",
    clinical: true,
    question: "Please tick any that apply.",
    options: [
      "Psychosis or schizophrenia",
      "Bipolar disorder",
      "Pregnant or breastfeeding",
      "Heart condition",
      "Liver disease",
      "Kidney disease",
      "Substance dependence",
      NONE_OF_THESE,
    ],
    next: "hl_medications",
  },
  {
    kind: "choice",
    id: "hl_medications",
    field: "hl_medications",
    clinical: true,
    question: "Are you currently taking any medications or supplements?",
    options: ["Yes", "No"],
    followUp: {
      when: "Yes",
      name: "hl_medications_detail",
      label: "Please list them",
    },
    next: { "*": "contact" },
  },

  /* ---------- closing ---------- */
  { kind: "contact", id: "contact" },
] as const;

/* -------------------------------------------------------------------------
   Triage
   ------------------------------------------------------------------------- */

/**
 * What the prescriptions branch costs, from the three answers.
 *
 * `null` when the patient is not on that branch, which is every other service.
 *
 * The rule is "any trigger lifts it": $19 covers one medication, no repeats,
 * already being taken. Anything else is $49. Her ladder assigns a price to
 * each answer independently, which says nothing about the six mixed
 * combinations; this is the reading the v2.2 answer to Q8 settled on, and it
 * is the conservative one — it never charges the lower fee for a request that
 * is more than the simple case.
 */
export function prescriptionFee(
  answers: Readonly<Record<string, string>>,
): number | null {
  if (answers.rx_count === undefined) return null;
  const simple =
    answers.rx_count === "One" &&
    answers.rx_repeats === "No" &&
    answers.rx_current === "Yes";
  return simple
    ? PRICES.prescriptions.amount
    : PRICES.prescriptionsComplex.amount;
}

export type TriageLevel = "green" | "amber" | "red";

export interface TriageResult {
  readonly level: TriageLevel;
  /** Why, for whoever works the queue. Never shown to the patient. */
  readonly reasons: readonly string[];
  /**
   * Set when the patient disclosed crisis or self-harm.
   *
   * Separate from `level` on purpose. Red covers several situations —
   * pregnancy, active cancer treatment, uncontrolled cardiac disease — and
   * only one of them needs somebody paged. A single boolean is something n8n
   * can branch on without parsing reasons.
   */
  readonly safetyFlag: boolean;
}

/**
 * The automatic triage.
 *
 *   green — proceed to booking
 *   amber — book, but a practitioner reviews first
 *   red   — do not auto-book; the team makes contact
 *
 * Two things this deliberately does NOT do.
 *
 * It does not block. Red still collects contact details and still submits: the
 * whole point of red is that a human calls the patient back, which is
 * impossible if the form discards them. That is the improvement red brings over
 * the migrated "Unable to Proceed" dead ends.
 *
 * It does not decide anything clinical. The level is a routing hint carried in
 * the payload. Nothing here is shown to the patient except the closing message,
 * and nothing here prescribes.
 *
 * DECISION: pregnancy appeared in the specification twice with two different
 * treatments — an advisory in the weight-loss questions, a red flag in the
 * health-optimisation ones. It is resolved as both: the patient sees the
 * advisory as written, and the submission is triaged red. Weight-management
 * medicines are contraindicated in pregnancy, so the cautious reading wins.
 */
export function triage(
  answers: Readonly<Record<string, string>>,
): TriageResult {
  const is = (field: string, value: string) => answers[field] === value;
  const has = (field: string, needle: string) =>
    (answers[field] ?? "").includes(needle);

  const red: string[] = [];
  const amber: string[] = [];

  /* --- red --- */
  if (is("ho_pregnancy", "Yes")) {
    red.push("Pregnant, planning pregnancy or breastfeeding");
  }
  if (has("wl_life_events", "Currently pregnant")) {
    red.push("Currently pregnant");
  }
  if (is("ho_cancer_active", "Yes")) red.push("Active cancer treatment");
  if (is("ho_organ_controlled", "No")) {
    red.push("Liver, kidney or heart condition that is not well controlled");
  }

  /* --- amber --- */
  if (is("ho_cancer", "Yes") && !is("ho_cancer_active", "Yes")) {
    amber.push("Previous cancer diagnosis, not in active treatment");
  }
  if (is("ho_organ_controlled", "Yes")) {
    amber.push("Controlled liver, kidney or heart condition");
  }
  /*
   * ho_under_specialist, not ho_specialist. The step's id is ho_specialist but
   * the field it writes is ho_under_specialist, and this read had the id — so
   * "under the care of a GP or specialist" never triaged amber. The field name
   * is the canonical one: it is what goes to n8n in the payload.
   */
  if (is("ho_under_specialist", "Yes")) {
    amber.push("Under GP or specialist care");
  }
  if (is("ho_medications", "Yes")) amber.push("On prescription medications");
  if (is("ho_injectable_allergies", "Yes")) {
    amber.push("Reported allergy to injectable medications");
  }
  if (is("ho_prior_therapy", "Yes")) {
    amber.push("Previous weight-management medication or therapy");
  }

  const weightLossMeds = answers.wl_medications ?? "";
  if (weightLossMeds !== "" && weightLossMeds !== NONE_OF_THESE) {
    amber.push("Taking medications that interact with weight management");
  }
  for (const condition of [
    "Diabetes or pre-diabetes",
    "Coronary heart disease and stroke",
    "Certain cancers",
    "Liver and biliary diseases",
    "Eating disorders",
    "Cushing syndrome",
  ]) {
    if (has("wl_conditions", condition)) amber.push(condition);
  }

  /* --- the four services whose form drives the outcome (addendum §1.1) ---
     Her men's, women's and holistic forms have no screening set of their own,
     so their contraindication tick-lists do the work. The rule is conservative
     until she signs off thresholds: any tick is amber, a practitioner reviews,
     and nothing here excludes anyone.

     Pregnancy is the one exception, and it is red rather than amber for the
     same reason it already is in the weight and health-optimisation branches:
     it changes what can safely be considered, so it should reach a human
     before a booking is confirmed rather than after. */
  for (const [field, label] of [
    ["mn_background", "Men's health background"],
    ["wh_history", "Women's health history"],
    ["hl_conditions", "Holistic care contraindication"],
  ] as const) {
    const ticked = answers[field] ?? "";
    if (ticked !== "" && ticked !== NONE_OF_THESE) {
      amber.push(`${label}: ${ticked}`);
    }
  }
  for (const field of ["wh_history", "hl_conditions"] as const) {
    if (has(field, "Pregnant") || has(field, "breastfeeding")) {
      red.push("Pregnant, planning pregnancy or breastfeeding");
    }
  }
  for (const [field, label] of [
    ["mn_medications", "On medications or supplements"],
    ["wh_medications", "On medications or supplements"],
    ["hl_medications", "On medications or supplements"],
  ] as const) {
    if (is(field, "Yes")) amber.push(label);
  }

  /*
   * A crisis disclosure is red and is flagged separately from the colour.
   * v2.4 Q31: "the submission carries a dedicated flag, not just the triage
   * colour", because a colour code someone has to notice is not a safety
   * mechanism. n8n branches on `safetyFlag` to raise the alert.
   */
  const safety = is("mh_severe_crisis", "Yes");
  if (safety) red.push("Disclosed severe symptoms or crisis");

  if (red.length > 0) return { level: "red", reasons: red, safetyFlag: safety };
  if (amber.length > 0) return { level: "amber", reasons: amber, safetyFlag: false };
  return { level: "green", reasons: [], safetyFlag: false };
}

/**
 * What the patient reads at the closing step.
 *
 * ⚠️ FLAGGED: the weight-loss green heading is the client's wording. A quiz
 * outcome that tells someone a program "might work for you" states a treatment
 * direction ahead of any assessment. Built as directed.
 */
export const TRIAGE_MESSAGES = {
  weightLoss: {
    green: {
      heading: "Well done! Our Weight Loss Program might work for you!",
      body: "Based on your answers we can create a treatment program that suits you the most. You are only a few steps away, so leave your details and we will be in touch to arrange your consultation.",
    },
    amber: {
      heading: "Thanks, your answers are with us",
      body: "There are a few things in your answers a practitioner will want to look at before recommending anything. Leave your details and we will arrange a consultation.",
    },
    red: {
      heading: "We need to review your answers first",
      body: "Based on your responses, your situation requires further review before booking. A member of our team will contact you.",
    },
  },
  general: {
    green: {
      heading: "Good news, it looks like we can help",
      body: "Leave your details and we will be in touch to arrange a consultation with an AHPRA-registered practitioner.",
    },
    amber: {
      heading: "Thanks, your answers are with us",
      body: "There are a few things in your answers a practitioner will want to look at first. Leave your details and we will arrange a consultation.",
    },
    red: {
      heading: "We need to review your answers first",
      body: "Based on your responses, your situation requires further review before booking. A member of our team will contact you.",
    },
  },
  /*
   * For the services that run no screening at all. They reach this step having
   * answered the three gates and nothing else, so "good news, it looks like we
   * can help" would be claiming an assessment that never happened. All three
   * levels read the same here because there is nothing to have triaged.
   */
  noScreening: {
    green: {
      heading: "Let's get you booked in",
      body: "Leave your details and we will be in touch to arrange a consultation with an AHPRA-registered practitioner.",
    },
    amber: {
      heading: "Let's get you booked in",
      body: "Leave your details and we will be in touch to arrange a consultation with an AHPRA-registered practitioner.",
    },
    red: {
      heading: "We need to review your answers first",
      body: "Based on your responses, your situation requires further review before booking. A member of our team will contact you.",
    },
  },
} as const;

/**
 * The services that reach the closing step without any screening behind them.
 *
 * Everyday GP work and chronic disease review: the consultation is the
 * screening, and neither has an assessment form (v2.4 answer to Q30). Kept
 * here rather than inferred from the step graph, because the closing message
 * has to know and the graph does not say.
 */
export const SERVICES_WITHOUT_SCREENING: readonly string[] = [
  "Online Doctor",
  "Continuity & Preventative Health",
] as const;

/** Which set of closing messages a service's outcome should be read from. */
export function triageMessagesFor(
  service: string,
): (typeof TRIAGE_MESSAGES)[keyof typeof TRIAGE_MESSAGES] {
  if (SERVICES_WITHOUT_SCREENING.includes(service)) {
    return TRIAGE_MESSAGES.noScreening;
  }
  /*
   * Her wording for the weight branch specifically. Matched on the service
   * name, which is why this is a function and not a ternary at the call site:
   * the name changed from "Weight Loss" to "Weight Management" when the menu
   * went to eight services, and the ternary went on silently returning the
   * general set for the one branch that has its own approved copy.
   */
  if (service === "Weight Management") return TRIAGE_MESSAGES.weightLoss;
  return TRIAGE_MESSAGES.general;
}

/* -------------------------------------------------------------------------
   Closing step
   ------------------------------------------------------------------------- */

export const QUIZ_CONTACT = {
  heading: "Get Your Results",
  body: "Please provide your contact details below so we can send you your results and connect you with the appropriate service.",
  important: {
    heading: "Important information",
    body: "Health Optimisation programs may include prescription-only treatments where clinically appropriate. All patients require assessment by a registered healthcare practitioner. Additional pathology testing may be required before treatment recommendations can be made.",
  },
  privacyNote:
    "Your privacy is important to us. The information you provide will be handled in accordance with our Privacy Policy and applicable Australian privacy legislation.",
  privacyLinks: [{ text: "Privacy Policy", href: "/privacy/" }],
} as const;

export interface ConsentField {
  readonly id: string;
  readonly field: string;
  readonly label: string;
  readonly required: boolean;
  readonly links?: readonly { readonly text: string; readonly href: string }[];
}

/**
 * The Step 5 acknowledgements, merged with the two the migrated form already
 * carried. The first two replace the single "subject to clinical assessment"
 * checkbox that was live: they say the same thing more plainly, and the client
 * asked for them separately.
 */
export const QUIZ_CONSENTS: readonly ConsentField[] = [
  {
    id: "terms",
    field: "terms_conditions_agree",
    label: "I have read and agree to the Terms & Conditions and Privacy Policy.",
    required: true,
    links: [
      { text: "Terms & Conditions", href: "/terms-and-conditions/" },
      { text: "Privacy Policy", href: "/privacy/" },
    ],
  },
  {
    id: "healthInfo",
    field: "terms_health_info_consent",
    label:
      "I consent to HHCPA collecting my health information for assessment purposes, as described in the Privacy Policy.",
    required: true,
    links: [{ text: "Privacy Policy", href: "/privacy/" }],
  },
  {
    id: "noGuarantee",
    field: "terms_no_guarantee",
    label:
      "I understand that completing this form does not guarantee treatment eligibility.",
    required: true,
  },
  {
    id: "practitionerDecision",
    field: "terms_practitioner_decision",
    label:
      "I understand that treatment decisions can only be made following consultation with a qualified practitioner.",
    required: true,
  },
  {
    id: "marketing",
    field: "terms_marketing_consent",
    label:
      "I consent to receive marketing communications and understand I can opt out at any time.",
    required: false,
  },
] as const;

/** The ids the API refuses a submission without. Derived, so the two agree. */
export const REQUIRED_CONSENT_IDS = QUIZ_CONSENTS.filter(
  (consent) => consent.required,
).map((consent) => consent.id);

/**
 * Bumped whenever any consent wording changes. It is recorded against each
 * submission, so a consent given today can be shown to be a consent to today's
 * words rather than to whatever the page says later.
 */
export const CONSENT_VERSION = "2026-09-03";

/**
 * What a patient reads on `/quiz-thank-you/` after submitting. Client copy,
 * supplied verbatim.
 *
 * One message for everyone. This replaced four, one per triage level, and the
 * variation is gone rather than dormant — nothing on the page reads the level
 * any more, so the sessionStorage hand-off the quiz used to do went with it.
 *
 * What the four were for is still covered. Green offered to help you book;
 * "your results and the next steps" says that without promising a booking to
 * someone who should not have one. Red carried the urgent-care line, and that
 * line now shows to everybody — the safer direction to have got it wrong in.
 *
 * The triage level is still calculated and still sent to n8n with the
 * submission. Only the on-page message stopped depending on it.
 */
export const QUIZ_SUCCESS = {
  heading: "Thanks, we’ve got your details",
  body: "Your pre-screening answers have been received. Our clinical team will review them and be in touch shortly with your results and the next steps.",
  note: "If your enquiry is urgent, please call 000 or contact your GP.",
} as const;

/* -------------------------------------------------------------------------
   Flow helpers
   ------------------------------------------------------------------------- */

export function findStep(id: string): QuizStep | undefined {
  return QUIZ_STEPS.find((step) => step.id === id);
}

/** Answer → next step id, honouring the `*` fallback. */
export function nextStepId(step: QuizStep, answer: string): string {
  switch (step.kind) {
    case "choice":
      return step.next[answer] ?? step.next["*"] ?? "";
    case "multi":
    case "input":
    case "bmi":
    case "summary":
      return step.next;
    case "exit":
    case "contact":
      return "";
  }
}

/** Whole years between a date of birth and today. */
export function ageFromDob(dob: string): number | null {
  const born = new Date(dob);
  if (Number.isNaN(born.getTime())) return null;
  const now = new Date();
  let years = now.getFullYear() - born.getFullYear();
  const months = now.getMonth() - born.getMonth();
  if (months < 0 || (months === 0 && now.getDate() < born.getDate())) {
    years -= 1;
  }
  return years >= 0 && years < 130 ? years : null;
}

export interface SummaryRow {
  readonly label: string;
  readonly value: string;
}

/** The review screen's rows, in the order the specification listed them. */
export function summaryRows(
  answers: Readonly<Record<string, string>>,
): readonly SummaryRow[] {
  const age = ageFromDob(answers.wl_dob ?? "");
  const weight = answers.wl_weight_kg;
  const height = answers.wl_height_cm;

  return [
    { label: "Age", value: age === null ? "" : String(age) },
    { label: "Sex at birth", value: answers.wl_sex_at_birth ?? "" },
    { label: "Weight", value: weight === undefined ? "" : weight + " kg" },
    { label: "Height", value: height === undefined ? "" : height + " cm" },
    { label: "BMI", value: answers.wl_bmi ?? "" },
    { label: "Ethnicity", value: answers.wl_ethnicity ?? "" },
  ].filter((row) => row.value !== "");
}
