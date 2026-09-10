/**
 * The six clinical intake forms, HHCPA-FRM-002 to 007, Version 1.1.
 *
 * These are Step 6 of the quiz flow (HHCPA_Build_Spec_v2.3_Addendum §1): they
 * run after triage, for green and amber outcomes only, once a patient has been
 * offered a booking. Step 4's screening decides whether someone can proceed;
 * this is the clinical detail the practitioner reads before the consultation.
 *
 * ─── WHAT IS AND IS NOT REPRODUCED ─────────────────────────────────────────
 *
 * Her forms, section by section, with three departures. Each is recorded at
 * the field it affects; collected here so they can be reviewed in one place:
 *
 *   1. NO RESIDENTIAL ADDRESS, NO EMERGENCY CONTACT. Her patient-details block
 *      asks for both. The v2.2 answer to Q24 moves them to post-booking
 *      intake: they are not needed to triage and not needed to book, they are
 *      the highest-sensitivity fields on the form, and deferring them cuts the
 *      exposure the privacy review in Q18 is still open on. This restages her
 *      form, so it needs her confirmation.
 *
 *   2. NAME, EMAIL AND PHONE ARE NOT ASKED AGAIN. Step 5.5 already took them.
 *      Asking a second time reads as a broken form.
 *
 *   3. FRM-007's PEPTIDE WORDING IS HERS, UNCHANGED. See the note on that form
 *      below. This is the one departure that goes the other way — the spec
 *      asked for it reworded and the client directed otherwise.
 *
 * Everything else — every question, every option, every declaration — is her
 * wording. The declarations especially: those are what the patient signs, and
 * paraphrasing a signed declaration would make the record worthless.
 *
 * `id` and `version` travel with every submission alongside the signature and
 * its timestamp (v2.2 answer to Q26). "Version 1.1" identifies her PDF; the
 * `renderedAt` snapshot the form component sends identifies what was actually
 * on screen, which is the thing a signature is a signature of.
 */

export type IntakeFieldKind =
  | "text"
  | "textarea"
  | "date"
  | "number"
  | "single"
  | "multi";

export interface IntakeField {
  readonly name: string;
  readonly label: string;
  readonly kind: IntakeFieldKind;
  readonly options?: readonly string[];
  readonly required?: boolean;
  readonly placeholder?: string;
  readonly unit?: string;
  /** Free-text box revealed by one answer, as "if yes, provide details". */
  readonly detailIf?: string;
  readonly detailLabel?: string;
}

export interface IntakeSection {
  readonly title: string;
  readonly fields: readonly IntakeField[];
}

export interface IntakeForm {
  /** HHCPA-FRM-00X, stored with the signature. */
  readonly id: string;
  readonly version: string;
  readonly title: string;
  /** Minutes, as printed on her form. Shown so the estimate matches. */
  readonly minutes: number;
  readonly sections: readonly IntakeSection[];
  /** Her declaration wording, verbatim. This is what is signed. */
  readonly declaration: string;
}

/** Her patient-details block, less the fields Q24 defers and Step 5.5 has. */
const PATIENT_DETAILS: IntakeSection = {
  title: "Patient details",
  fields: [
    {
      name: "full_legal_name",
      label: "Full legal name",
      kind: "text",
      required: true,
    },
    { name: "date_of_birth", label: "Date of birth", kind: "date", required: true },
  ],
};

/** Both confirmations are mandatory before submit, on every form. */
export const INTAKE_CONFIRMATIONS = [
  {
    id: "read",
    label: "I have read and understood the declaration above.",
  },
  {
    id: "true",
    label: "The information I have provided is true and complete.",
  },
] as const;

const WEIGHT_MANAGEMENT: IntakeForm = {
  id: "HHCPA-FRM-002",
  version: "1.1",
  title: "Weight Management Assessment",
  minutes: 7,
  declaration:
    "I understand that completing this form does not guarantee a prescription or a particular treatment. A practitioner will assess my suitability during a real-time consultation. Medication, pharmacy, pathology and imaging costs are separate from HHCPA consultation fees unless expressly stated.",
  sections: [
    PATIENT_DETAILS,
    {
      title: "Measurements and goals",
      fields: [
        { name: "current_weight_kg", label: "Current weight", kind: "number", unit: "kg", required: true },
        { name: "height_cm", label: "Height", kind: "number", unit: "cm", required: true },
        { name: "waist_cm", label: "Waist circumference (if known)", kind: "number", unit: "cm" },
        { name: "goal", label: "Goal weight or health goal", kind: "text" },
        { name: "achieve", label: "What would you most like to achieve?", kind: "textarea" },
      ],
    },
    {
      title: "Weight history",
      fields: [
        {
          name: "tried_before",
          label: "What have you tried previously?",
          kind: "multi",
          options: [
            "Meal plans / diets",
            "Exercise program",
            "Dietitian",
            "Meal replacements",
            "Weight-loss medication",
            "Surgery",
            "Nothing formal",
            "Other",
          ],
        },
        {
          name: "tried_outcome",
          label: "Briefly describe what worked or did not work",
          kind: "textarea",
        },
        {
          name: "prior_prescription",
          label: "Have you previously used prescription weight-management treatment?",
          kind: "single",
          options: ["Yes", "No"],
          required: true,
          detailIf: "Yes",
          detailLabel: "If yes, provide details",
        },
      ],
    },
    {
      title: "Health and safety screening",
      fields: [
        {
          name: "conditions",
          label: "Please tick any that apply",
          kind: "multi",
          options: [
            "Type 2 diabetes",
            "High blood pressure",
            "High cholesterol",
            "Heart condition",
            "Sleep apnoea",
            "PCOS",
            "Gallbladder problems",
            "Pancreatitis",
            "Kidney disease",
            "Liver disease",
            "Eating disorder history",
            "Pregnant / breastfeeding",
          ],
        },
        { name: "medications", label: "Current medications and supplements", kind: "textarea" },
        { name: "allergies", label: "Allergies or medication reactions", kind: "textarea" },
      ],
    },
    {
      title: "Daily habits",
      fields: [
        {
          name: "activity",
          label: "Physical activity",
          kind: "single",
          options: ["Rarely", "1-2 days/week", "3-4 days/week", "5+ days/week"],
        },
        { name: "sleep_hours", label: "Average sleep per night", kind: "text" },
        { name: "meals_per_day", label: "Typical meals per day", kind: "text" },
        { name: "typical_day", label: "Describe a typical day of eating and drinking", kind: "textarea" },
        { name: "biggest_challenge", label: "What is your biggest challenge?", kind: "textarea" },
      ],
    },
  ],
};

const HOLISTIC_CARE: IntakeForm = {
  id: "HHCPA-FRM-003",
  version: "1.1",
  title: "Holistic Care Assessment",
  minutes: 6,
  declaration:
    "I understand that holistic or alternative treatment is not guaranteed and will only be discussed or prescribed where clinically appropriate following assessment. I will provide complete and accurate information and seek urgent medical attention for severe or life-threatening symptoms.",
  sections: [
    PATIENT_DETAILS,
    {
      title: "Main concern",
      fields: [
        {
          name: "concern",
          label: "What would you like support with?",
          kind: "multi",
          options: [
            "Chronic pain",
            "Sleep difficulties",
            "Anxiety / stress",
            "PTSD symptoms",
            "Fibromyalgia",
            "Arthritis",
            "Neuropathy",
            "Other",
          ],
        },
        { name: "duration", label: "How long have symptoms been present?", kind: "text" },
        { name: "severity", label: "Current severity", kind: "number", unit: "0-10" },
        { name: "impact", label: "Describe your symptoms and how they affect daily life", kind: "textarea" },
      ],
    },
    {
      title: "Previous and current care",
      fields: [
        { name: "previous_treatments", label: "Treatments or medicines previously tried and the outcome", kind: "textarea" },
        { name: "medications", label: "Current medications and supplements", kind: "textarea" },
        { name: "allergies", label: "Allergies or medication reactions", kind: "textarea" },
        {
          name: "conditions",
          label: "Please tick any that apply",
          kind: "multi",
          options: [
            "Psychosis / schizophrenia",
            "Bipolar disorder",
            "Pregnant / breastfeeding",
            "Heart condition",
            "Liver disease",
            "Kidney disease",
            "Substance dependence",
            "None of these",
          ],
        },
      ],
    },
    {
      title: "Your goals",
      fields: [
        { name: "meaningful_improvement", label: "What improvements would be meaningful to you?", kind: "textarea" },
        {
          name: "areas_affected",
          label: "Areas affected",
          kind: "multi",
          options: ["Sleep", "Work", "Mobility", "Mood", "Relationships", "Exercise", "Daily activities", "Other"],
        },
      ],
    },
  ],
};

const MENTAL_HEALTH: IntakeForm = {
  id: "HHCPA-FRM-004",
  version: "1.1",
  title: "Mental Health Assessment",
  minutes: 6,
  declaration:
    "I understand this form supports but does not replace a clinician's mental health assessment. HHCPA telehealth is not an emergency or crisis service. If I or another person is in immediate danger, I will call 000 or attend the nearest emergency department.",
  sections: [
    PATIENT_DETAILS,
    {
      title: "Presenting concern",
      fields: [
        {
          name: "concern",
          label: "What would you like help with?",
          kind: "multi",
          options: [
            "Anxiety",
            "Low mood",
            "Stress",
            "Sleep",
            "Trauma / PTSD",
            "Attention / concentration",
            "Work or relationship concerns",
            "Other",
          ],
        },
        { name: "duration", label: "How long has this been present?", kind: "text" },
        { name: "distress", label: "Current distress", kind: "number", unit: "0-10" },
        { name: "description", label: "Briefly describe what has been happening", kind: "textarea" },
      ],
    },
    {
      title: "Current and previous support",
      fields: [
        {
          name: "current_support",
          label: "Are you currently seeing a psychologist, counsellor or psychiatrist?",
          kind: "single",
          options: ["Yes", "No"],
        },
        { name: "previous_treatment", label: "Previous mental health treatment or hospital care", kind: "textarea" },
        { name: "medications", label: "Current medications and supplements", kind: "textarea" },
        { name: "allergies", label: "Allergies or medication reactions", kind: "textarea" },
        {
          name: "affecting",
          label: "How is this affecting you?",
          kind: "multi",
          options: [
            "Sleep",
            "Work / study",
            "Relationships",
            "Daily activities",
            "Appetite",
            "Motivation",
            "Concentration",
            "Other",
          ],
        },
      ],
    },
    {
      /*
       * ⚠️ SAFETY. A "Yes" here must surface crisis resources on screen before
       * anything else, must not block the person from continuing or leaving,
       * and must set `safetyFlag` on the submission so a human is told
       * (v2.1 §4.7.2, v2.4 Q31). The form component enforces all three.
       *
       * Her form says only "For immediate danger call 000". Lifeline and
       * Beyond Blue are added so it matches the compulsory site-wide line —
       * §4.7.2 asks for exactly that.
       */
      title: "Safety",
      fields: [
        {
          name: "self_harm",
          label: "Have you recently had thoughts of harming yourself or someone else?",
          kind: "single",
          options: ["Yes", "No"],
          required: true,
          detailIf: "Yes",
          detailLabel: "If yes, provide brief details",
        },
      ],
    },
  ],
};

const MENS_HEALTH: IntakeForm = {
  id: "HHCPA-FRM-005",
  version: "1.1",
  title: "Men's Health Assessment",
  minutes: 5,
  declaration:
    "I confirm that the information provided is accurate. I understand that examination, pathology, imaging or in-person assessment may be recommended and that prescriptions are issued only where clinically appropriate.",
  sections: [
    PATIENT_DETAILS,
    {
      title: "Reason for consultation",
      fields: [
        {
          name: "concern",
          label: "Main concern",
          kind: "multi",
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
        },
        { name: "concern_detail", label: "Describe your concern and when it began", kind: "textarea" },
      ],
    },
    {
      title: "Health background",
      fields: [
        {
          name: "background",
          label: "Please tick any that apply",
          kind: "multi",
          options: [
            "High blood pressure",
            "Heart disease",
            "Diabetes",
            "High cholesterol",
            "Prostate condition",
            "Sleep apnoea",
            "Mental health condition",
            "Liver / kidney disease",
            "None known",
            "Other",
          ],
        },
        { name: "medications", label: "Current medications and supplements", kind: "textarea" },
        { name: "allergies", label: "Allergies or medication reactions", kind: "textarea" },
        {
          name: "lifestyle",
          label: "Lifestyle",
          kind: "multi",
          options: [
            "Current smoker",
            "Alcohol weekly",
            "Exercise 3+ days/week",
            "Poor sleep",
            "High stress",
          ],
        },
      ],
    },
    {
      title: "Your goal",
      fields: [
        { name: "goal", label: "What outcome would you like from the consultation?", kind: "textarea" },
      ],
    },
  ],
};

const WOMENS_HEALTH: IntakeForm = {
  id: "HHCPA-FRM-006",
  version: "1.1",
  title: "Women's Health Assessment",
  minutes: 6,
  declaration:
    "I confirm that the information provided is accurate. I understand that examination, pathology, imaging or in-person care may be recommended and treatment will only be provided where clinically appropriate.",
  sections: [
    PATIENT_DETAILS,
    {
      title: "Reason for consultation",
      fields: [
        {
          name: "concern",
          label: "Main concern",
          kind: "multi",
          options: [
            "Menstrual concerns",
            "Menopause / perimenopause",
            "PCOS",
            "Endometriosis",
            "Contraception",
            "Sexual health",
            "Fertility",
            "Weight management",
            "Breast health",
            "Other",
          ],
        },
        { name: "concern_detail", label: "Describe your concern and when it began", kind: "textarea" },
      ],
    },
    {
      title: "Relevant history",
      fields: [
        {
          name: "reproductive_stage",
          label: "Current reproductive stage",
          kind: "single",
          options: [
            "Regular periods",
            "Irregular periods",
            "No periods",
            "Perimenopause",
            "Post-menopause",
            "Not applicable",
          ],
        },
        { name: "last_period", label: "Date of last menstrual period (if relevant)", kind: "date" },
        { name: "pregnancies", label: "Number of pregnancies (optional)", kind: "text" },
        {
          name: "history",
          label: "Please tick any that apply",
          kind: "multi",
          options: [
            "Pregnant",
            "Planning pregnancy",
            "Breastfeeding",
            "History of blood clots",
            "Migraine with aura",
            "Breast / ovarian cancer history",
            "PCOS",
            "Endometriosis",
            "None of these",
          ],
        },
        { name: "medications", label: "Current medications and supplements", kind: "textarea" },
        { name: "allergies", label: "Allergies or medication reactions", kind: "textarea" },
      ],
    },
    {
      title: "Your goal",
      fields: [
        { name: "goal", label: "What outcome would you like from the consultation?", kind: "textarea" },
      ],
    },
  ],
};

const HEALTH_OPTIMISATION: IntakeForm = {
  id: "HHCPA-FRM-007",
  version: "1.1",
  title: "Health Optimisation Assessment",
  minutes: 7,
  /*
   * ⚠️ HER WORDING, UNCHANGED, AND THAT IS A DECISION RATHER THAN AN OVERSIGHT.
   *
   * This declaration and the prior-therapy question below both name peptides.
   * v2.1 §4.7.1 said they must not ship as written and supplied replacements;
   * v2.3 §7 then reversed that and preferred her wording placed where the
   * public cannot reach it; v2.4 Q29 reversed again to the neutral wording.
   *
   * Bilal's instruction on 2026-09-10 overrode all three: her exact wording
   * ships, and the risk is flagged to her at review rather than designed
   * around. Recorded here because the flag she receives must say Pracxcel
   * chose to keep her wording — the "use her exact wording" instruction came
   * from Pracxcel internally, not from her, which v2.4 Q29(a) established.
   *
   * The consequence: `restricted-terms.test.ts` carries one explicit,
   * dated exemption for this file, scoped to the single word. Nothing else in
   * the prohibited-terms register is relaxed.
   */
  declaration:
    "I understand that health optimisation or peptide treatment is not guaranteed. The practitioner will assess the available evidence, potential benefits, risks, contraindications and monitoring requirements. Treatment will only be recommended or prescribed where legally permitted and clinically appropriate.",
  sections: [
    PATIENT_DETAILS,
    {
      title: "Health goals",
      fields: [
        {
          name: "goals",
          label: "What are your main goals?",
          kind: "multi",
          options: [
            "Healthy ageing",
            "Energy / vitality",
            "Recovery",
            "Body composition",
            "Sleep",
            "Mental clarity",
            "Performance",
            "Sexual health",
            "Injury recovery",
            "Other",
          ],
        },
        { name: "goals_detail", label: "Describe your main goals and desired outcomes", kind: "textarea" },
      ],
    },
    {
      title: "Current health",
      fields: [
        {
          name: "conditions",
          label: "Please tick any that apply",
          kind: "multi",
          options: [
            "Heart disease",
            "Cancer history",
            "Diabetes",
            "High blood pressure",
            "Liver disease",
            "Kidney disease",
            "Autoimmune condition",
            "Mental health condition",
            "Pregnant / breastfeeding",
            "None known",
          ],
        },
        { name: "medications", label: "Current medications and supplements", kind: "textarea" },
        { name: "allergies", label: "Allergies or medication reactions", kind: "textarea" },
        {
          /* Her wording. See the note on the declaration above. */
          name: "prior_therapy",
          label: "Have you previously used peptide therapy or other health optimisation treatment?",
          kind: "single",
          options: ["Yes", "No"],
          required: true,
          detailIf: "Yes",
          detailLabel: "If yes, provide details",
        },
      ],
    },
    {
      title: "Lifestyle and investigations",
      fields: [
        {
          name: "exercise",
          label: "Exercise frequency",
          kind: "single",
          options: ["Rarely", "1-2 days/week", "3-4 days/week", "5+ days/week"],
        },
        { name: "sleep_hours", label: "Average sleep per night", kind: "text" },
        { name: "alcohol", label: "Usual alcohol intake", kind: "text" },
        {
          name: "recent_bloods",
          label: "Have you had blood tests within the past 6 months?",
          kind: "single",
          options: ["Yes", "No"],
        },
        { name: "recent_results", label: "Relevant recent results or concerns (optional)", kind: "textarea" },
      ],
    },
  ],
};

/**
 * Which form a service uses.
 *
 * Online Doctor and Continuity & Preventative Health are absent: neither has a
 * form, and neither runs screening either (v2.4 Q30). A service with no entry
 * here goes straight from the closing step to booking.
 */
export const INTAKE_FORM_BY_SERVICE: Readonly<Record<string, IntakeForm>> = {
  "Weight Management": WEIGHT_MANAGEMENT,
  "Health Optimisation & Complete Wellness": HEALTH_OPTIMISATION,
  "Men's Health": MENS_HEALTH,
  "Women's Health": WOMENS_HEALTH,
  "Mental Health Support": MENTAL_HEALTH,
  "Holistic Care / Alternative Medicine": HOLISTIC_CARE,
};

export const INTAKE_FORMS: readonly IntakeForm[] = [
  WEIGHT_MANAGEMENT,
  HOLISTIC_CARE,
  MENTAL_HEALTH,
  MENS_HEALTH,
  WOMENS_HEALTH,
  HEALTH_OPTIMISATION,
];

export function intakeFormFor(service: string): IntakeForm | undefined {
  return INTAKE_FORM_BY_SERVICE[service];
}
