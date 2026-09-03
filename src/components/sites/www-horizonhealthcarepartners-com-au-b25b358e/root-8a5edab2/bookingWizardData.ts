/**
 * Config data for the Horizon Health Care Partners booking wizard.
 *
 * Ported verbatim from the target site's inline `<script>` (captured in
 * `docs/research/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/booking-wizard-source.js`):
 * `hhpSubMenus`, `hhpQuizzes`, `hhpHealthOptSteps`, `hhpGoalMap` and `hhpCertSteps`,
 * plus the 12 service cards that were hard-coded in the page markup.
 *
 * Every string and number here is the target's own copy — do not "improve" it.
 * Rendering lives in `BookingWizard.tsx`; this file only holds the data so the
 * component stays readable.
 */

/**
 * Redirect targets from the original.
 *
 * `BOOKING_REDIRECT_URL` is declared in the source but never actually used —
 * `hhpPerformRedirect()` is called with no argument on every path except the
 * one-day certificate flow, and the no-argument branch embeds the Halaxy widget
 * in place rather than navigating. It is kept here for parity with the source.
 */
export const BOOKING_REDIRECT_URL =
  "https://www.horizonhealthcarepartners.com.au/book-consultation/";
/**
 * Used only by the "1 Day" medical-certificate branch, which does navigate in
 * the source. It does not here: that branch renders its spinner panel and stops
 * (AGENTS.md).
 *
 * These two stay absolute while every other link in the cloned sections was made
 * relative. Neither is ever followed, and neither `/book-consultation/` nor
 * `/medical-certificate/` is a route on this site — made relative they would be
 * two 404s rather than two dead constants. If the certificate branch is ever
 * enabled, point it at a route that exists instead of at the source.
 */
export const CERT_REDIRECT_URL =
  "https://www.horizonhealthcarepartners.com.au/medical-certificate/";

/**
 * The live Halaxy booking widget the original embeds in-page on every
 * non-certificate path, copied verbatim from `HALAXY_BOOKING_EMBED`:
 *
 *   <iframe src="..." allow="payment" title="..."
 *           style="border:0;width:100%;height:1100px;max-height:90vh;"
 *           loading="lazy"></iframe>
 *
 * This is the real clinic's booking widget, so the embed takes real bookings.
 */
export const HALAXY_BOOKING_EMBED = {
  src: "https://www.halaxy.com/book/widget/horizon-health-care-partners-australia/location/1345231",
  title: "Book a consultation with Horizon Health Care Partners",
  heading: "Book your consultation",
  subheading: "Complete your booking securely below.",
} as const;

/** Icons downloaded from the target into `public/`. */
const ICON_BASE =
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/images/";

/* ------------------------------------------------------------------ *
 * Service keys                                                        *
 * ------------------------------------------------------------------ */

export type ServiceKey =
  | "general"
  | "after-hours"
  | "priority"
  | "prescriptions"
  | "pathology-radiology"
  | "certificates"
  | "mental-health"
  | "mens-womens-health"
  | "continuity-preventative"
  | "weight-management"
  | "holistic"
  | "metabolic-wellness";

/* ------------------------------------------------------------------ *
 * Step 1 — service cards                                              *
 * ------------------------------------------------------------------ */

export interface ServiceCard {
  key: ServiceKey;
  /** Absolute path under `public/`. */
  icon: string;
  /** Several alt values deliberately differ from the card title. */
  alt: string;
  title: string;
  desc: string;
  /** Priority Consult adds a `<br><strong>…</strong>` line inside the description. */
  descStrong?: string;
  /** `.hhp-service-includes` sub-line nested inside the description. */
  includes?: string;
  price: string;
}

export const SERVICE_CARDS: readonly ServiceCard[] = [
  {
    key: "general",
    icon: `${ICON_BASE}icon-general-referrals.svg`,
    alt: "General & Referrals",
    title: "General & Referrals",
    desc: "Standard consults, referrals, prescriptions, certificates and more.",
    price: "From $49",
  },
  {
    key: "after-hours",
    icon: `${ICON_BASE}icon-after-hours-consult.svg`,
    alt: "After-Hours Consult",
    title: "After-Hours Consult",
    desc: "Evenings and weekends consultations.",
    price: "From $69",
  },
  {
    key: "priority",
    icon: `${ICON_BASE}icon-priority-consult.svg`,
    alt: "Priority Consult",
    title: "Priority Consult",
    desc: "First available appointment, fast turnaround.",
    descStrong: "Limited spots available each day",
    price: "From $98",
  },
  {
    key: "prescriptions",
    icon: `${ICON_BASE}icon-prescriptions.svg`,
    alt: "Prescriptions",
    title: "Prescriptions",
    desc: "Repeat eScripts and new prescriptions.",
    price: "From $49",
  },
  {
    key: "certificates",
    icon: `${ICON_BASE}icon-medical-certificates.svg`,
    alt: "Medical Certificates",
    title: "Medical Certificates",
    desc: "Single day and multi-day certificates for work, study or carer.",
    price: "From $19.90",
  },
  {
    key: "pathology-radiology",
    icon: `${ICON_BASE}icon-pathology-imaging.svg`,
    alt: "Pathology & Imaging",
    title: "Pathology & Imaging",
    desc: "Referrals for blood tests, X-rays and ultrasounds.",
    price: "From $49",
  },
  {
    key: "mental-health",
    icon: `${ICON_BASE}icon-mental-health.svg`,
    alt: "Mental Health",
    title: "Mental Health",
    desc: "Personalised support for mental wellbeing and neurological conditions.",
    includes:
      "Includes: ADHD Support · Anxiety & PTSD · Smoking Cessation · Sleep Concerns",
    price: "From $59",
  },
  {
    key: "mens-womens-health",
    icon: `${ICON_BASE}icon-mens-womens-health.svg`,
    alt: "Men's & Women's Health",
    title: "Men's & Women's Health",
    desc: "Focused care supporting hormonal, reproductive and overall wellbeing.",
    includes:
      "Areas we support: Hormonal Support · Menopause Support · Sexual Health · Fertility Support",
    price: "From $89",
  },
  {
    key: "continuity-preventative",
    icon: `${ICON_BASE}icon-continuity-preventative.svg`,
    alt: "Continuity & Preventative Health",
    title: "Continuity & Preventative Health",
    desc: "Chronic disease management, long-term care planning and preventative health support.",
    price: "From $69",
  },
  {
    key: "holistic",
    icon: `${ICON_BASE}icon-holistic-care.png`,
    alt: "Holistic Care",
    title: "Holistic Care / Alternative Medicine",
    desc: "A personalised approach supporting chronic conditions, pain, sleep and overall wellbeing through evidence-based treatment options.",
    price: "From $49",
  },
  {
    key: "metabolic-wellness",
    icon: `${ICON_BASE}icon-health-optimisation.png`,
    alt: "Health Optimisation and Wellness",
    title: "Health Optimisation and Wellness",
    desc: "Comprehensive programs focused on weight, energy, recovery and long-term health.",
    price: "Programs from $299",
  },
  {
    key: "weight-management",
    icon: `${ICON_BASE}icon-weight-management.svg`,
    alt: "Weight Management",
    title: "Weight Management",
    desc: "Medically supervised weight management programs tailored to your health goals.",
    price: "From $99",
  },
];

/* ------------------------------------------------------------------ *
 * Step 2 — sub-menu configuration (`hhpSubMenus`)                     *
 * ------------------------------------------------------------------ */

export interface OptionItem {
  id: string;
  title: string;
  /** Rendered under the "Patients Get:" label. */
  what: string;
  /** Rendered under the "Delivery Note:" label. */
  note: string;
  price?: string;
  caveat?: string;
}

/** `general` / `after-hours` / `priority` / `prescriptions` / `pathology-radiology`. */
export interface TimingSubMenu {
  type: "timing";
  title: string;
  price?: string;
  caveat?: string;
  introEyebrow?: string;
  introHeading?: string;
  introText?: string;
}

/** Services that present a flat list of sub-services. */
export interface OptionsSubMenu {
  type: "options";
  title: string;
  price?: string;
  categoryNote?: string;
  items: readonly OptionItem[];
}

/** `certificates` — branches straight into the eligibility questionnaire. */
export interface CertificatesSubMenu {
  type: "certificates";
  title: string;
  price?: string;
}

export type SubMenu = TimingSubMenu | OptionsSubMenu | CertificatesSubMenu;

export const SUB_MENUS: Readonly<Record<ServiceKey, SubMenu>> = {
  general: {
    title: "General & Referrals",
    type: "timing",
    price: "From $49",
    caveat:
      "Prescriptions are at the treating practitioner's discretion after a real-time consultation only.",
  },
  "after-hours": {
    title: "After-Hours Consult",
    type: "timing",
    price: "From $69",
  },
  priority: { title: "Priority Consult", type: "timing", price: "From $98" },
  prescriptions: {
    title: "Prescriptions",
    type: "timing",
    price: "From $49",
    introEyebrow: "Online Prescription Consultation",
    introHeading:
      "Request a Prescription with an Australian Healthcare Practitioner",
    introText:
      "Whether you need a repeat prescription or would like to discuss a new medication, our experienced practitioners can assess your request during a secure telehealth consultation.",
    caveat:
      "Please note: A consultation does not guarantee that a prescription will be issued. All prescribing decisions are made solely at the discretion of your treating practitioner.",
  },
  "pathology-radiology": {
    title: "Pathology & Imaging",
    type: "timing",
    price: "From $49",
  },

  certificates: {
    title: "Medical Certificates",
    type: "certificates",
    price: "From $19.90",
  },

  "mental-health": {
    title: "Mental Health",
    type: "options",
    price: "From $59",
    categoryNote:
      "If you are in crisis, call Lifeline 13 11 14 (24/7) or Beyond Blue 1300 22 4636. In an emergency, call 000.",
    items: [
      {
        id: "mh-care",
        title: "Ongoing Mental Health Support",
        what: "Personalised support for mental wellbeing and ongoing care.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "mh-adhd",
        title: "ADHD Support",
        what: "Assessment guidance and ongoing management support for ADHD.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "mh-anxiety",
        title: "Anxiety & PTSD",
        what: "Support and management options for anxiety and PTSD.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "mh-smoking",
        title: "Smoking Cessation",
        what: "Support plan and prescription options to quit smoking.",
        note: "AHPRA-registered practitioner consultation",
        caveat:
          "Prescription medicines for smoking cessation are at the practitioner's discretion and suitability will be assessed during your consultation.",
      },
      {
        id: "mh-sleep",
        title: "Sleep Concerns",
        what: "Assessment and support for sleep-related concerns.",
        note: "AHPRA-registered practitioner consultation",
      },
    ],
  },

  "mens-womens-health": {
    title: "Men's & Women's Health",
    type: "options",
    price: "From $89",
    items: [
      {
        id: "mwh-hormonal",
        title: "Hormonal Support",
        what: "Assessment and management of hormonal health concerns.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "mwh-menopause",
        title: "Menopause Support",
        what: "Comprehensive menopause support plan and treatment options.",
        note: "AHPRA-registered practitioner consultation",
        caveat:
          "Our practitioners can discuss all aspects of menopause management including lifestyle, non-hormonal options, and hormonal therapies where clinically appropriate. Some situations may require referral to a specialist. Prescriptions are at the treating practitioner's discretion; recent pathology may be required.",
      },
      {
        id: "mwh-sexual",
        title: "Sexual Health",
        what: "Confidential sexual health assessment and support.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "mwh-fertility",
        title: "Fertility Support",
        what: "Fertility assessment guidance and referral support.",
        note: "AHPRA-registered practitioner consultation",
      },
    ],
  },

  "continuity-preventative": {
    title: "Continuity & Preventative Health",
    type: "options",
    price: "From $69",
    items: [
      {
        id: "cp-chronic",
        title: "Chronic Disease Management",
        what: "Ongoing management and monitoring of chronic health conditions.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "cp-preventative",
        title: "Preventative Health Programs",
        what: "Proactive health screening and preventative care programs.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "cp-care-plan",
        title: "Structured Care Plans",
        what: "Comprehensive structured care planning for long-term health needs.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "cp-monitoring",
        title: "Ongoing Monitoring",
        what: "Regular health monitoring and check-ins to track progress and outcomes.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "cp-lifestyle",
        title: "Lifestyle & Risk Assessment",
        what: "Assessment of lifestyle factors and health risks with personalised recommendations.",
        note: "AHPRA-registered practitioner consultation",
      },
    ],
  },

  "weight-management": {
    title: "Weight Management",
    type: "options",
    price: "From $99",
    categoryNote:
      "Weight management medications may be discussed where clinically appropriate. No prescription is guaranteed. Ongoing follow-up appointments are required. Compounded GLP-1 medications are not available. All medicines are TGA-approved.",
    items: [
      {
        id: "wm-initial",
        title: "Initial Consultation",
        what: "Comprehensive assessment and personalised weight management plan.",
        note: "BMI pre-screening required",
      },
      {
        id: "wm-followup",
        title: "Follow-up Consultation",
        what: "Review progress and adjust your weight management program.",
        note: "For existing patients",
      },
      {
        id: "wm-program",
        title: "Ongoing Program",
        what: "Structured ongoing support for sustained weight management.",
        note: "Regular check-ins included",
      },
    ],
  },

  holistic: {
    title: "Holistic Care / Alternative Medicine",
    type: "options",
    price: "From $49",
    items: [
      {
        id: "holistic-initial",
        title: "Initial Consultation",
        what: "First appointment to assess your needs and develop a personalised care plan.",
        note: "Full screening required",
      },
      {
        id: "holistic-followup",
        title: "Follow-up Consultation",
        what: "Review progress and adjust your treatment plan as needed.",
        note: "For existing patients",
      },
      {
        id: "holistic-transfer",
        title: "Transfer of Care",
        what: "Transferring your care from another provider with full clinical handover.",
        note: "Previous records required",
      },
    ],
  },

  "metabolic-wellness": {
    title: "Health Optimisation and Wellness",
    type: "options",
    price: "Programs from $299",
    items: [
      {
        id: "met-longevity",
        title: "Longevity / Complete Wellness",
        what: "Comprehensive longevity-focused program for optimal long-term health and vitality.",
        note: "Full health screening included",
      },
      {
        id: "met-ageing",
        title: "Healthy Ageing",
        what: "Proactive strategies to support healthy ageing and sustained quality of life.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "met-performance",
        title: "Performance & Recovery",
        what: "Support physical recovery, wellbeing and active lifestyle goals through tailored programs.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "met-injury",
        title: "Injury Recovery",
        what: "Structured support for injury rehabilitation and return to full function.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "met-mental",
        title: "Mental Clarity & Focus",
        what: "Support mental clarity, focus and overall wellbeing through personalised care.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "met-vitality",
        title: "Vitality & Immunity",
        what: "Support vitality, wellness and healthy lifestyle goals through personalised care.",
        note: "AHPRA-registered practitioner consultation",
      },
      {
        id: "met-sexual",
        title: "Sexual Health & Function",
        what: "Confidential support for sexual health and function within a holistic wellness approach.",
        note: "AHPRA-registered practitioner consultation",
      },
    ],
  },
};

/* ------------------------------------------------------------------ *
 * Weight-management BMI pre-screening quiz (`hhpQuizzes.bmi`)         *
 * ------------------------------------------------------------------ */

export type QuizQuestion =
  | { id: string; text: string; type: "single"; options: readonly string[] }
  | { id: string; text: string; type: "number" }
  | { id: string; text: string; type: "info" };

export interface Quiz {
  title: string;
  questions: readonly QuizQuestion[];
}

export const BMI_QUIZ: Quiz = {
  title: "Weight Loss Pre-Screening",
  questions: [
    { id: "age", text: "Are you over 18?", type: "single", options: ["Yes", "No"] },
    { id: "weight", text: "Current Weight (kg)", type: "number" },
    { id: "height", text: "Height (cm)", type: "number" },
    { id: "bmi_calc", text: "BMI Result", type: "info" },
  ],
};

/* ------------------------------------------------------------------ *
 * Shared question shapes (certificates + health optimisation)         *
 * ------------------------------------------------------------------ */

/** `showIf` gates a question on an earlier answer within the same step. */
export type ShowIf =
  | { q: string; includes: string }
  | { q: string; notEquals: string };

export interface WarningQuestion {
  id: string;
  type: "warning";
  title: string;
  text: string;
}

export interface InfoQuestion {
  id: string;
  type: "info";
  text?: string;
  /** The certificate intro renders its copy as a bullet list. */
  bullets?: readonly string[];
}

export interface CheckQuestion {
  id: string;
  type: "check";
  required: boolean;
  text: string;
}

export interface SingleQuestion {
  id: string;
  type: "single";
  label: string;
  required: boolean;
  options: readonly string[];
  note?: string;
  /** When the answer equals `detailIf`, reveal a free-text follow-up. */
  detailIf?: string;
  detailId?: string;
  detailLabel?: string;
  showIf?: ShowIf;
}

export interface MultiQuestion {
  id: string;
  type: "multi";
  label: string;
  required: boolean;
  options: readonly string[];
  /** Selecting this clears every other choice (and vice versa). */
  exclusiveOption?: string;
  detailIf?: string;
  detailId?: string;
  detailLabel?: string;
  showIf?: ShowIf;
}

export interface DateQuestion {
  id: string;
  type: "date";
  label: string;
  required: boolean;
  /** No date question uses this today; the renderer treats every field uniformly. */
  showIf?: ShowIf;
}

export interface TextareaQuestion {
  id: string;
  type: "textarea";
  label: string;
  required: boolean;
  maxLength?: number;
  showIf?: ShowIf;
}

export type CertQuestion =
  | WarningQuestion
  | InfoQuestion
  | CheckQuestion
  | SingleQuestion
  | MultiQuestion
  | DateQuestion
  | TextareaQuestion;

export interface CertStep {
  title: string;
  subtitle: string;
  /** Rendered as a `.hhp-cert-disclaimer` above the questions. */
  note?: string;
  questions: readonly CertQuestion[];
}

/** Answers are strings (single/date/textarea), string arrays (multi) or booleans (check). */
export type AnswerValue = string | string[] | boolean;
export type AnswerMap = Readonly<Record<string, AnswerValue | undefined>>;

/* ------------------------------------------------------------------ *
 * Medical certificate assessment (`hhpCertSteps`) — 12 steps          *
 * ------------------------------------------------------------------ */

export const CERT_STEPS: readonly CertStep[] = [
  {
    title: "HHCPA Medical Certificate Assessment",
    subtitle: "Single-Day & Multiple-Day Medical Certificates",
    questions: [
      {
        id: "certImportantNotice",
        type: "warning",
        title: "⚠️ Important Notice",
        text: "This service is intended for non-emergency medical certificate requests only. If you are experiencing chest pain, difficulty breathing, severe bleeding, loss of consciousness, suicidal thoughts, stroke symptoms, or any other medical emergency, call 000 immediately or attend your nearest Emergency Department. If your symptoms worsen or do not improve, please seek further medical attention from your GP or another appropriate healthcare provider.",
      },
      {
        id: "certIntro",
        type: "info",
        bullets: [
          "Medical certificates are issued only following assessment by a registered Australian healthcare practitioner.",
          "Medical certificates are not guaranteed and remain subject to clinical assessment.",
          "Medical certificates cannot be backdated.",
          "This service is not suitable for medical emergencies.",
          "Patients must be physically located in Australia at the time of consultation.",
        ],
      },
    ],
  },
  {
    title: "Purpose of Certificate",
    subtitle: "Tell us a little about what this certificate is for.",
    questions: [
      {
        id: "purpose",
        label: "What is the purpose of this certificate?",
        type: "single",
        required: true,
        options: ["Work", "Study", "Carer's Responsibilities", "Other"],
        detailIf: "Other",
        detailId: "purposeOther",
        detailLabel: "Please specify",
      },
      {
        id: "futureDate",
        label:
          "Are you requesting a certificate for today's date or future dates?",
        type: "single",
        required: true,
        options: ["Yes", "No"],
        note: "Please note: HHCPA practitioners do not provide backdated medical certificates.",
      },
      {
        id: "reason",
        label:
          "What is the primary reason for requesting a medical certificate today?",
        type: "single",
        required: true,
        options: [
          "Cold / Flu Symptoms",
          "COVID-19 or Respiratory Illness",
          "Gastrointestinal Illness (Vomiting, Diarrhoea)",
          "Migraine / Headache",
          "Mental Health Concerns (Stress, Anxiety, Low Mood)",
          "Back, Neck or Joint Pain",
          "Injury",
          "Medical Condition Flare-Up",
          "Other",
        ],
        detailIf: "Other",
        detailId: "reasonOther",
        detailLabel: "Please specify",
      },
    ],
  },
  {
    title: "Symptom Duration & Severity",
    subtitle: "Help us understand how you're feeling.",
    questions: [
      {
        id: "duration",
        label: "When did your symptoms begin?",
        type: "single",
        required: true,
        options: [
          "Today",
          "Yesterday",
          "2–3 Days Ago",
          "4–7 Days Ago",
          "More Than 1 Week Ago",
        ],
      },
      {
        id: "severity",
        label: "How severe are your symptoms currently?",
        type: "single",
        required: true,
        options: ["Mild", "Moderate", "Severe"],
      },
    ],
  },
  {
    title: "Current Symptoms",
    subtitle: "Select all that apply.",
    questions: [
      {
        id: "symptoms",
        label: "Are you currently experiencing any of the following?",
        type: "multi",
        required: true,
        options: [
          "Fever or High Temperature",
          "Cough",
          "Sore Throat",
          "Fatigue",
          "Headache or Migraine",
          "Nausea",
          "Vomiting",
          "Diarrhoea",
          "Pain",
          "Reduced Mobility",
          "Anxiety",
          "Stress",
          "Low Mood",
          "Poor Sleep",
          "Other",
        ],
        detailIf: "Other",
        detailId: "symptomsOther",
        detailLabel: "Please specify",
      },
      {
        id: "painLevel",
        label: "If experiencing pain, please rate your pain level.",
        type: "single",
        required: false,
        options: ["0–3 Mild", "4–6 Moderate", "7–10 Severe", "Not Applicable"],
        showIf: { q: "symptoms", includes: "Pain" },
      },
    ],
  },
  {
    title: "Functional Capacity Assessment",
    subtitle: "Tell us how this is affecting your daily activities.",
    questions: [
      {
        id: "functionalImpact",
        label:
          "How is your condition affecting your ability to work, study or perform your usual daily activities?",
        type: "multi",
        required: true,
        options: [
          "Unable to concentrate effectively",
          "Unable to perform usual duties",
          "Unable to safely drive",
          "Unable to undertake physical tasks",
          "Unable to attend work or study",
          "Require rest and recovery",
          "Symptoms may place myself or others at risk",
          "Other",
        ],
        detailIf: "Other",
        detailId: "functionalOther",
        detailLabel: "Please specify",
      },
      {
        id: "dutiesCapacity",
        label: "Are you currently able to perform any of your usual duties?",
        type: "single",
        required: true,
        options: [
          "Yes – Full Duties",
          "Yes – Modified Duties Only",
          "No – Unable to Perform Duties",
        ],
      },
    ],
  },
  {
    title: "Recovery & Treatment",
    subtitle: "Let us know what you've already tried.",
    questions: [
      {
        id: "treatmentSought",
        label: "Have you sought treatment or advice for this condition?",
        type: "single",
        required: true,
        options: [
          "No",
          "Yes – General Practitioner",
          "Yes – Hospital / Emergency Department",
          "Yes – Specialist",
          "Yes – Other Healthcare Practitioner",
        ],
      },
      {
        id: "measuresTaken",
        label: "What measures have you taken to manage your condition?",
        type: "multi",
        required: false,
        options: [
          "Rest",
          "Medication",
          "Physiotherapy",
          "Counselling / Psychology",
          "GP Review",
          "Hospital Review",
          "Other",
        ],
        detailIf: "Other",
        detailId: "measuresOther",
        detailLabel: "Please specify",
      },
    ],
  },
  {
    title: "Certificate Request",
    subtitle: "Tell us the dates you need covered.",
    note: "Medical certificates cannot be backdated. Pricing: Single-day certificate $19.90 · Multiple-day certificate (2+ days) $49.",
    questions: [
      { id: "firstDay", label: "First Day Required", type: "date", required: true },
      { id: "lastDay", label: "Last Day Required", type: "date", required: true },
      {
        id: "daysRequested",
        label: "How many days are you requesting?",
        type: "single",
        required: true,
        options: ["1 Day", "2–3 Days", "4–7 Days", "More Than 7 Days"],
      },
      {
        id: "extraDaysReason",
        label:
          "If requesting multiple days, why do you believe additional recovery time is required?",
        type: "textarea",
        required: false,
        showIf: { q: "daysRequested", notEquals: "1 Day" },
      },
    ],
  },
  {
    title: "Safety Screening",
    subtitle: "These questions help us keep you safe.",
    questions: [
      {
        id: "safety",
        label: "Are you currently experiencing any of the following?",
        type: "multi",
        required: false,
        options: [
          "Chest Pain",
          "Difficulty Breathing",
          "Severe Allergic Reaction",
          "Sudden Vision Changes",
          "Severe Dizziness",
          "Confusion",
          "Slurred Speech",
          "Facial Drooping",
          "New Weakness or Numbness",
          "Thoughts of Self-Harm",
          "None of the Above",
        ],
        exclusiveOption: "None of the Above",
      },
    ],
  },
  {
    title: "Work / Study Information",
    subtitle: "Tell us a little about your occupation or study.",
    questions: [
      {
        id: "occupation",
        label: "What best describes your occupation or study?",
        type: "single",
        required: true,
        options: [
          "Office / Administration",
          "Healthcare Worker",
          "Driver / Transport",
          "Construction / Trades",
          "Retail / Hospitality",
          "Student",
          "Other",
        ],
      },
    ],
  },
  {
    title: "Additional Information",
    subtitle: "Optional — anything else the practitioner should know.",
    questions: [
      {
        id: "additionalInfo",
        label:
          "Is there any other information you would like the practitioner to know? (Maximum 300 characters)",
        type: "textarea",
        required: false,
        maxLength: 300,
      },
    ],
  },
  {
    title: "Eligibility",
    subtitle: "A couple of quick checks before we continue.",
    questions: [
      {
        id: "inAustralia",
        label: "Are you currently located in Australia?",
        type: "single",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "understandsIndependently",
        label:
          "Do you understand the information provided and can complete this consultation independently?",
        type: "single",
        required: true,
        options: ["Yes", "No – I require assistance or an interpreter"],
      },
    ],
  },
  {
    title: "Telehealth Consent & Patient Declaration",
    subtitle: "Please review and acknowledge before continuing.",
    questions: [
      {
        id: "consent1",
        type: "check",
        required: true,
        text: "I confirm that all information I have provided is true, complete, and accurate to the best of my knowledge.",
      },
      {
        id: "consent2",
        type: "check",
        required: true,
        text: "I understand that this is a telehealth service and that the practitioner's assessment is based on the information I provide.",
      },
      {
        id: "consent3",
        type: "check",
        required: true,
        text: "I understand that medical certificates cannot be backdated.",
      },
      {
        id: "consent4",
        type: "check",
        required: true,
        text: "I understand that submission of this form does not guarantee that a medical certificate will be issued.",
      },
      {
        id: "consent5",
        type: "check",
        required: true,
        text: "I understand that this service is not suitable for medical emergencies.",
      },
      {
        id: "consent6",
        type: "check",
        required: true,
        text: "I agree to seek immediate medical attention by calling 000 or attending the nearest Emergency Department if I experience severe, worsening, or potentially life-threatening symptoms.",
      },
      {
        id: "consent7",
        type: "check",
        required: true,
        text: "I understand that if my symptoms do not improve, worsen, or persist, I should seek further assessment from my GP or another appropriate healthcare provider.",
      },
      {
        id: "consent8",
        type: "check",
        required: true,
        text: "I consent to HHCPA collecting, using, and storing my personal and health information in accordance with its Privacy Policy and applicable Australian privacy legislation.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Health optimisation screening (`hhpHealthOptSteps`) — 5 steps       *
 * ------------------------------------------------------------------ */

export type HealthOptQuestion = InfoQuestion | CheckQuestion | SingleQuestion;

export interface HealthOptStep {
  title: string;
  subtitle: string;
  questions: readonly HealthOptQuestion[];
}

export const HEALTH_OPT_STEPS: readonly HealthOptStep[] = [
  {
    title: "Health Optimisation Screening",
    subtitle: "Tell us your primary health goal.",
    questions: [
      {
        id: "goal",
        label:
          "What is your primary reason for seeking a Health Optimisation Program?",
        type: "single",
        required: true,
        options: [
          "Weight Management & Metabolic Health",
          "Healthy Ageing & Longevity",
          "Recovery & Physical Wellbeing",
          "Mental Clarity & Focus",
          "Energy, Vitality & Wellness",
          "Sexual Health & Wellbeing",
          "General Wellness Optimisation",
        ],
      },
    ],
  },
  {
    title: "Basic Eligibility",
    subtitle: "A couple of quick checks before we continue.",
    questions: [
      {
        id: "over18",
        label: "Are you 18 years or older?",
        type: "single",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "inAustralia",
        label: "Are you currently located in Australia?",
        type: "single",
        required: true,
        options: ["Yes", "No"],
      },
    ],
  },
  {
    title: "Medical Screening",
    subtitle: "Help us understand your medical background.",
    questions: [
      {
        id: "usedPeptide",
        label:
          "Have you previously used peptide therapy or prescription weight management medications?",
        type: "single",
        required: true,
        options: ["Yes", "No"],
        detailIf: "Yes",
        detailId: "peptideDetails",
        detailLabel: "If yes, please provide details.",
      },
      {
        id: "underCare",
        label: "Are you currently under the care of a GP or Specialist?",
        type: "single",
        required: true,
        options: ["Yes", "No"],
      },
    ],
  },
  {
    title: "Safety Questions",
    subtitle: "These questions help us keep you safe.",
    questions: [
      {
        id: "pregnant",
        label: "Are you pregnant, planning pregnancy or breastfeeding?",
        type: "single",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "cancer",
        label: "Have you ever been diagnosed with cancer?",
        type: "single",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "organCondition",
        label: "Do you have a liver, kidney or heart condition?",
        type: "single",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "onMeds",
        label: "Are you currently taking any prescription medications?",
        type: "single",
        required: true,
        options: ["Yes", "No"],
        detailIf: "Yes",
        detailId: "medsList",
        detailLabel: "If yes, please list.",
      },
      {
        id: "injectableAllergy",
        label: "Do you have any allergies to injectable medications?",
        type: "single",
        required: true,
        options: ["Yes", "No"],
      },
    ],
  },
  {
    title: "Consent",
    subtitle: "Please review and acknowledge before continuing.",
    questions: [
      {
        id: "consentInfo",
        type: "info",
        text: "Health Optimisation programs may include prescription-only treatments where clinically appropriate. All patients require assessment by a registered healthcare practitioner. Additional pathology testing may be required before treatment recommendations can be made.",
      },
      {
        id: "consent1",
        type: "check",
        required: true,
        text: "I understand that completing this form does not guarantee treatment eligibility.",
      },
      {
        id: "consent2",
        type: "check",
        required: true,
        text: "I understand that treatment decisions can only be made following consultation with a qualified practitioner.",
      },
      {
        id: "consent3",
        type: "check",
        required: true,
        text: "I consent to HHCPA collecting my health information for assessment purposes.",
      },
    ],
  },
];

/** Pre-fills the "primary goal" answer from the chosen metabolic-wellness item. */
export const HEALTH_OPT_GOAL_MAP: Readonly<Record<string, string>> = {
  "met-longevity": "Healthy Ageing & Longevity",
  "met-ageing": "Healthy Ageing & Longevity",
  "met-performance": "Recovery & Physical Wellbeing",
  "met-injury": "Recovery & Physical Wellbeing",
  "met-mental": "Mental Clarity & Focus",
  "met-vitality": "Energy, Vitality & Wellness",
  "met-sexual": "Sexual Health & Wellbeing",
};

/** Result levels produced by the health-optimisation triage. */
export type TriageLevel =
  | "green"
  | "amber"
  | "red"
  | "ineligible-age"
  | "ineligible-location";

/** Result levels produced by the medical-certificate screening. */
export type CertResultLevel = "safety-flag" | "ineligible-location";
