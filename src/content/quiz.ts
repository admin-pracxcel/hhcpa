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

const NOT_ELIGIBLE_HOLISTIC =
  "Based on your response, you may not be eligible for holistic/alternative care treatment at this time. Please consult with your GP for appropriate care options.";

/** Offered on every multi-select, so "none" is answerable without skipping. */
export const NONE_OF_THESE = "None of these";

export const QUIZ_STEPS: readonly QuizStep[] = [
  /* ---------- gates ----------
     DECISION: the age gate stays a yes/no rather than becoming the weight-loss
     branch's date of birth. Nothing identifying is collected until the closing
     step, so abandoning the quiz early leaves no partial record of a person. A
     date of birth at question one would end that property. */
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

  /* ---------- branch selection ---------- */
  {
    kind: "choice",
    id: "service",
    field: "service_selection",
    question: "What service are you interested in?",
    options: [
      "Mental Health",
      "Weight Loss",
      "Complete Wellness",
      "Holistic / Alternative Care",
    ],
    next: {
      "Mental Health": "mh_diagnosed",
      "Weight Loss": "wl_dob",
      "Complete Wellness": "ho_goal",
      "Holistic / Alternative Care": "hl_emergency",
    },
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
    next: { Yes: "exit-crisis", No: "contact" },
  },
  {
    /* Stays a hard exit, not a triage outcome. Someone in crisis needs a phone
       number now, not a callback from an intake queue. */
    kind: "exit",
    id: "exit-crisis",
    variant: "crisis",
    heading: "Crisis Support",
    body: "If you are in crisis or experiencing thoughts of self-harm, please reach out immediately: Lifeline: 13 11 14 (24/7). Beyond Blue: 1300 22 4636. Emergency: 000. Our telehealth service is not suitable for crisis situations. Please contact the services above for immediate support.",
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
    question:
      "Have you previously used peptide therapy or prescription weight management medications?",
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

  /* ---------- holistic / alternative care (migrated, see the header) ------- */
  {
    kind: "choice",
    id: "hl_emergency",
    field: "hl_emergency",
    clinical: true,
    question: "Are you experiencing a medical emergency?",
    options: ["Yes", "No"],
    next: { Yes: "exit-emergency", No: "hl_chronic_condition" },
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
    id: "hl_chronic_condition",
    field: "hl_chronic_condition",
    clinical: true,
    question:
      "Do you have a chronic condition lasting more than 3 months that has been diagnosed by a doctor?",
    options: ["Yes", "No"],
    next: { Yes: "hl_conventional_meds", No: "exit-hl-chronic" },
  },
  {
    kind: "exit",
    id: "exit-hl-chronic",
    variant: "blocked",
    heading: "Unable to Proceed",
    body: "Based on your response, you may not meet the eligibility criteria for this service. Our Holistic / Alternative Care consultations require a diagnosed chronic condition. Please consider our other services.",
  },
  {
    kind: "choice",
    id: "hl_conventional_meds",
    field: "hl_conventional_meds",
    clinical: true,
    question:
      "Have you tried conventional prescription medication for your condition?",
    options: ["Yes", "No"],
    next: { Yes: "hl_meds_unsuccessful", No: "exit-hl-meds" },
  },
  {
    kind: "exit",
    id: "exit-hl-meds",
    variant: "blocked",
    heading: "Unable to Proceed",
    body: "Based on your response, you may not meet the eligibility criteria at this time. You need to have tried conventional prescription medication before accessing this service. Please consult with your regular doctor.",
  },
  {
    kind: "choice",
    id: "hl_meds_unsuccessful",
    field: "hl_meds_unsuccessful",
    clinical: true,
    question:
      "Has the medication been unsuccessful in fully treating your symptoms, or does it cause adverse side effects?",
    options: ["Yes", "No"],
    next: { Yes: "hl_disqualifying_conditions", No: "exit-hl-unsuccessful" },
  },
  {
    kind: "exit",
    id: "exit-hl-unsuccessful",
    variant: "blocked",
    heading: "Unable to Proceed",
    body: "Based on your response, you may not meet the eligibility criteria at this time. This service is designed for patients whose conventional medications have been unsuccessful or cause adverse side effects.",
  },
  {
    kind: "choice",
    id: "hl_disqualifying_conditions",
    field: "hl_disqualifying_conditions",
    clinical: true,
    question: "Do you have any of the following conditions?",
    options: [
      "Active psychosis",
      "Drug dependence or substance abuse",
      "Cardio pulmonary disease",
      "Pregnant or breastfeeding",
      "Liver disease",
      "None of the above",
    ],
    next: { "None of the above": "hl_psych_history", "*": "exit-hl-conditions" },
  },
  {
    kind: "exit",
    id: "exit-hl-conditions",
    variant: "blocked",
    heading: "Unable to Proceed",
    body: NOT_ELIGIBLE_HOLISTIC,
  },
  {
    kind: "choice",
    id: "hl_psych_history",
    field: "hl_psych_history",
    clinical: true,
    question:
      "Do you have a history of schizophrenia, bipolar type 1 and 2 disorder or have experienced psychosis?",
    options: ["Yes", "No"],
    next: { No: "contact", Yes: "exit-hl-psych" },
  },
  {
    kind: "exit",
    id: "exit-hl-psych",
    variant: "blocked",
    heading: "Unable to Proceed",
    body: "Based on your psychiatric history, holistic/alternative care treatment may not be suitable. Please speak with your treating psychiatrist or GP for guidance.",
  },

  /* ---------- closing ---------- */
  { kind: "contact", id: "contact" },
] as const;

/* -------------------------------------------------------------------------
   Triage
   ------------------------------------------------------------------------- */

export type TriageLevel = "green" | "amber" | "red";

export interface TriageResult {
  readonly level: TriageLevel;
  /** Why, for whoever works the queue. Never shown to the patient. */
  readonly reasons: readonly string[];
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
  if (is("ho_specialist", "Yes")) amber.push("Under GP or specialist care");
  if (is("ho_medications", "Yes")) amber.push("On prescription medications");
  if (is("ho_injectable_allergies", "Yes")) {
    amber.push("Reported allergy to injectable medications");
  }
  if (is("ho_prior_therapy", "Yes")) {
    amber.push("Previous peptide or weight-management medication");
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

  if (red.length > 0) return { level: "red", reasons: red };
  if (amber.length > 0) return { level: "amber", reasons: amber };
  return { level: "green", reasons: [] };
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
      body: "Based on your answers we can create a treatment program that suits you the most. You are only a few steps away — leave your details and we will be in touch to arrange your consultation.",
    },
    amber: {
      heading: "Thanks — your answers are with us",
      body: "There are a few things in your answers a practitioner will want to look at before recommending anything. Leave your details and we will arrange a consultation.",
    },
    red: {
      heading: "We need to review your answers first",
      body: "Based on your responses, your situation requires further review before booking. A member of our team will contact you.",
    },
  },
  general: {
    green: {
      heading: "Good news — it looks like we can help",
      body: "Leave your details and we will be in touch to arrange a consultation with an AHPRA-registered practitioner.",
    },
    amber: {
      heading: "Thanks — your answers are with us",
      body: "There are a few things in your answers a practitioner will want to look at first. Leave your details and we will arrange a consultation.",
    },
    red: {
      heading: "We need to review your answers first",
      body: "Based on your responses, your situation requires further review before booking. A member of our team will contact you.",
    },
  },
} as const;

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
  heading: "Thanks — we’ve got your details",
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
