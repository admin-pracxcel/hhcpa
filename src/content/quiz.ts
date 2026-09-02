/**
 * The pre-screening quiz, migrated from FluentForms form #21.
 *
 * Every question, option and exit message below is the wording already live on
 * the client's site. The flow is data, not code: `next` maps an answer to the
 * next step, so the branch logic is inspectable in one place rather than spread
 * through a component.
 *
 * ⚠️ COMPLIANCE — the `hl_` branch.
 *
 * The Holistic / Alternative Care branch is a medicinal-cannabis SAS-B
 * eligibility screen presented under a wellness label. The design spec (§5.1)
 * records that it "must go to Ranjeeta for sign-off under Clause 6.2(b) before
 * it is rebuilt as-is", and the content document's own rule for this page is
 * that the quiz "must not coach answers or determine any prescribing decision".
 *
 * It has been rebuilt as-is at the client's explicit direction, so parity with
 * the live form is preserved and nothing here is newly invented. The sign-off
 * is still outstanding, and two things about the branch are worth naming when
 * it is reviewed:
 *
 *   1. The four "Unable to Proceed" exits tell a patient which answer
 *      disqualified them, which is close to coaching: a second run-through with
 *      different answers passes the screen.
 *   2. The questions establish SAS-B criteria — diagnosed chronic condition,
 *      conventional medication tried and unsuccessful, no disqualifying
 *      conditions or psychiatric history — which is assessment, not screening
 *      for whether a consultation is worthwhile.
 *
 * Neither is a code defect. Both are decisions for the compliance reviewer.
 */

export type QuizStep =
  | {
      readonly kind: "choice";
      readonly id: string;
      /** Posted field name, kept identical to the live form. */
      readonly field: string;
      readonly question: string;
      readonly options: readonly string[];
      /** Answer → next step id. `*` is the fallback for any other answer. */
      readonly next: Readonly<Record<string, string>>;
      /** Clinical answers travel under the segregated `clinical` key. */
      readonly clinical?: boolean;
    }
  | {
      readonly kind: "bmi";
      readonly id: string;
      readonly question: string;
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

export const QUIZ_META = {
  title: "Free Pre-Screening Quiz | Check Your Eligibility | HHCPA",
  description:
    "Take the free pre-screening quiz to see if online telehealth care may suit you. Not a diagnosis. Takes two minutes. No obligation.",
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
    "This short quiz helps us understand your situation and see whether we are likely to be able to help. It takes about two minutes. It is free, there is no obligation, and it is not a diagnosis. Whatever your answers, nothing is prescribed from this quiz. If it looks like we can help, the next step is a real consultation with an AHPRA-registered practitioner, who makes any clinical decisions.",
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

const NOT_ELIGIBLE_HOLISTIC =
  "Based on your response, you may not be eligible for holistic/alternative care treatment at this time. Please consult with your GP for appropriate care options.";

export const QUIZ_STEPS: readonly QuizStep[] = [
  /* ---------- gates ---------- */
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
      "Weight Loss": "wl_primary_goal",
      "Complete Wellness": "cw_primary_goal",
      "Holistic / Alternative Care": "hl_emergency",
    },
  },

  /* ---------- mental health ---------- */
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
    kind: "exit",
    id: "exit-crisis",
    variant: "crisis",
    heading: "Crisis Support",
    body: "If you are in crisis or experiencing thoughts of self-harm, please reach out immediately: Lifeline: 13 11 14 (24/7). Beyond Blue: 1300 22 4636. Emergency: 000. Our telehealth service is not suitable for crisis situations. Please contact the services above for immediate support.",
  },

  /* ---------- weight loss ---------- */
  {
    kind: "choice",
    id: "wl_primary_goal",
    field: "wl_primary_goal",
    question: "What is your primary goal?",
    options: ["Weight loss", "Metabolic health"],
    next: { "*": "wl_bmi" },
  },
  {
    kind: "bmi",
    id: "wl_bmi",
    question: "Your height and weight",
    next: "wl_health_conditions",
  },
  {
    kind: "choice",
    id: "wl_health_conditions",
    field: "wl_health_conditions",
    clinical: true,
    question: "Do you have any of the following conditions?",
    options: ["Diabetes", "Thyroid issues", "PCOS", "None of the above"],
    next: { "*": "wl_current_medications" },
  },
  {
    kind: "choice",
    id: "wl_current_medications",
    field: "wl_current_medications",
    clinical: true,
    question: "Are you currently taking any medications?",
    options: ["Yes", "No"],
    next: { "*": "contact" },
  },

  /* ---------- complete wellness ---------- */
  {
    kind: "choice",
    id: "cw_primary_goal",
    field: "cw_primary_goal",
    question: "What is your primary goal right now?",
    options: [
      "Longevity / healthy ageing",
      "Improve Energy",
      "Preventative health",
      "General health optimisation",
      "Weight management",
      "Not sure",
    ],
    next: { "*": "cw_medical_conditions" },
  },
  {
    kind: "choice",
    id: "cw_medical_conditions",
    field: "cw_medical_conditions",
    clinical: true,
    question: "Do you have any ongoing medical conditions?",
    options: ["Yes", "No"],
    next: { "*": "cw_medications" },
  },
  {
    kind: "choice",
    id: "cw_medications",
    field: "cw_medications",
    clinical: true,
    question: "Are you currently on any medications?",
    options: ["Yes", "No"],
    next: { "*": "cw_blood_tests" },
  },
  {
    kind: "choice",
    id: "cw_blood_tests",
    field: "cw_blood_tests",
    clinical: true,
    question: "Have you had recent blood tests?",
    options: ["Yes", "No"],
    next: { "*": "contact" },
  },

  /* ---------- holistic / alternative care (see the header) ---------- */
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

export const QUIZ_CONTACT = {
  heading: "Get Your Results",
  body: "Please provide your contact details below so we can send you your results and connect you with the appropriate service.",
  privacyNote:
    "Your privacy is important to us. The information you provide will be handled in accordance with our Privacy Policy and applicable Australian privacy legislation.",
  privacyLinks: [{ text: "Privacy Policy", href: "/privacy/" }],
} as const;

export interface ConsentField {
  readonly id: string;
  readonly field: string;
  readonly label: string;
  readonly required: boolean;
  /**
   * Phrases inside `label` to render as links. A consent to terms someone
   * cannot read from the checkbox is not a meaningful consent, and both
   * documents are on this site.
   */
  readonly links?: readonly { readonly text: string; readonly href: string }[];
}

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
    id: "privacy",
    field: "terms_privacy_consent",
    label:
      "I consent to the collection and use of my personal information in accordance with the Privacy Policy.",
    required: true,
    links: [{ text: "Privacy Policy", href: "/privacy/" }],
  },
  {
    id: "clinicalUnderstanding",
    field: "terms_clinical_understanding",
    label:
      "I understand that all treatments and prescriptions are subject to clinical assessment and will only be provided where appropriate. No treatment outcomes are guaranteed.",
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

/**
 * Bumped whenever any consent wording changes. It is recorded against each
 * submission, so a consent given today can be shown to be a consent to today's
 * words rather than to whatever the page says later.
 */
export const CONSENT_VERSION = "2026-09-02";

export const QUIZ_SUCCESS = {
  heading: "Thank you — we have your answers",
  body: "A member of our team will be in touch to help you book a consultation with an AHPRA-registered practitioner. Nothing has been prescribed from this quiz, and any care plan comes from that consultation.",
} as const;

export function findStep(id: string): QuizStep | undefined {
  return QUIZ_STEPS.find((step) => step.id === id);
}

/** Answer → next step id, honouring the `*` fallback. */
export function nextStepId(step: QuizStep, answer: string): string {
  if (step.kind === "bmi") return step.next;
  if (step.kind !== "choice") return "";
  return step.next[answer] ?? step.next["*"] ?? "";
}
