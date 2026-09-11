/**
 * "Choose Your Service" — her own service boxes, restored.
 *
 * Her 9 September instruction, ticked: "The service boxes will be replaced
 * with the original versions from your website." The rebuild had an eight-card
 * grid instead, one per service area, because build spec §4.1.4 mapped her
 * boxes onto the eight-service architecture and gave a table of eight. The
 * 11 September audit records that mapping as the spec author's own error: six
 * of her boxes had disappeared, and she would notice.
 *
 * The titles, descriptions, icons and prices below are hers, lifted from the
 * cards ported verbatim in `bookingWizardData.ts` rather than retyped, so the
 * two cannot drift.
 *
 * ─── THREE DELIBERATE DEPARTURES, EACH ALREADY AGREED ──────────────────────
 *
 *   1. Her single "Men's & Women's Health" box is split in two. They are
 *      separate services in the agreed structure with separate pages, and one
 *      box cannot link to both. Her combined "areas we support" line is split
 *      along the same seam.
 *
 *   2. Prescriptions is $19, not her site's $49. Her own instruction of
 *      9 September, and the floor of the ladder on the prescriptions page.
 *
 *   3. Health Optimisation's description drops "weight". Hers reads
 *      "weight, energy, recovery and long-term health"; the whole point of
 *      that service's separation from Weight Management is that it does not
 *      compete for the same queries.
 *
 * So thirteen boxes, not her twelve — the split accounts for the difference.
 *
 * ─── BEHAVIOUR ─────────────────────────────────────────────────────────────
 *
 * Her boxes open a booking wizard. These link to the service page, which
 * prompts pre-screening before booking — her answer to question 1, verbatim:
 * "Keep the current build where it takes to the services page and then it asks
 * them to do the pre-screening questions before booking."
 *
 * After-Hours and Priority have no page of their own. Both point at
 * `/online-doctor/`, confirmed by Bilal on 2026-09-11 rather than guessed.
 */

import { PRICES, formatPrice, type PriceKey } from "./pricing";

const ICON_BASE = "/images/";

export interface ServiceBox {
  readonly key: string;
  readonly title: string;
  readonly icon: string;
  readonly iconAlt: string;
  readonly description: string;
  /** Her "Includes:" or "Areas we support:" line, where she has one. */
  readonly includes?: string;
  /** Her emphasised caveat, where she has one. */
  readonly strong?: string;
  readonly priceKey: PriceKey;
  /** Overrides "from $299" where her label reads "Programs from $299". */
  readonly priceLabel?: string;
  readonly href: string;
}

export const SERVICE_BOXES: readonly ServiceBox[] = [
  {
    key: "general",
    title: "General & Referrals",
    icon: `${ICON_BASE}icon-general-referrals.svg`,
    iconAlt: "General and referrals",
    description:
      "Standard consults, referrals, prescriptions, certificates and more.",
    priceKey: "generalConsult",
    href: "/online-doctor/",
  },
  {
    key: "after-hours",
    title: "After-Hours Consult",
    icon: `${ICON_BASE}icon-after-hours-consult.svg`,
    iconAlt: "After-hours consult",
    description: "Evenings and weekends consultations.",
    priceKey: "afterHoursConsult",
    /* No page of its own; Bilal confirmed Online Doctor on 2026-09-11. */
    href: "/online-doctor/",
  },
  {
    key: "priority",
    title: "Priority Consult",
    icon: `${ICON_BASE}icon-priority-consult.svg`,
    iconAlt: "Priority consult",
    description: "First available appointment, fast turnaround.",
    strong: "Limited spots available each day",
    priceKey: "priorityConsult",
    href: "/online-doctor/",
  },
  {
    key: "prescriptions",
    title: "Prescriptions",
    icon: `${ICON_BASE}icon-prescriptions.svg`,
    iconAlt: "Prescriptions",
    description: "Repeat eScripts and new prescriptions.",
    priceKey: "prescriptions",
    href: "/online-doctor/online-prescriptions/",
  },
  {
    key: "certificates",
    title: "Medical Certificates",
    icon: `${ICON_BASE}icon-medical-certificates.svg`,
    iconAlt: "Medical certificates",
    description:
      "Single day and multi-day certificates for work, study or carer.",
    priceKey: "medicalCertificate",
    href: "/online-doctor/medical-certificates/",
  },
  {
    key: "pathology",
    title: "Pathology & Imaging",
    icon: `${ICON_BASE}icon-pathology-imaging.svg`,
    iconAlt: "Pathology and imaging",
    description: "Referrals for blood tests, X-rays and ultrasounds.",
    priceKey: "pathologyReferral",
    href: "/online-doctor/pathology-imaging-referrals/",
  },
  {
    key: "mental-health",
    title: "Mental Health",
    icon: `${ICON_BASE}icon-mental-health.svg`,
    iconAlt: "Mental health",
    description:
      "Personalised support for mental wellbeing and neurological conditions.",
    includes:
      "Includes: ADHD Support, Anxiety & PTSD, Smoking Cessation, Sleep Concerns",
    priceKey: "mentalHealth",
    href: "/online-doctor/mental-health/",
  },
  {
    key: "mens-health",
    title: "Men's Health",
    icon: `${ICON_BASE}icon-mens-womens-health.svg`,
    iconAlt: "Men's health",
    description:
      "Discreet online consultations for erectile dysfunction, low testosterone, hair loss and more.",
    priceKey: "mensWomensHealth",
    href: "/mens-health/",
  },
  {
    key: "womens-health",
    title: "Women's Health",
    icon: `${ICON_BASE}icon-mens-womens-health.svg`,
    iconAlt: "Women's health",
    description:
      "Menopause and perimenopause support, hormones, PCOS and contraception.",
    priceKey: "mensWomensHealth",
    href: "/womens-health/",
  },
  {
    key: "continuity",
    title: "Continuity & Preventative Health",
    icon: `${ICON_BASE}icon-continuity-preventative.svg`,
    iconAlt: "Continuity and preventative health",
    description:
      "Chronic disease management, long-term care planning and preventative health support.",
    priceKey: "continuityPreventative",
    href: "/continuity-preventative-health/",
  },
  {
    key: "holistic",
    title: "Holistic Care / Alternative Medicine",
    icon: `${ICON_BASE}icon-holistic-care.png`,
    iconAlt: "Holistic care",
    description:
      "A personalised approach supporting chronic conditions, pain, sleep and overall wellbeing through evidence-based treatment options.",
    priceKey: "holisticCare",
    href: "/holistic-alternative-care/",
  },
  {
    key: "health-optimisation",
    title: "Health Optimisation & Complete Wellness",
    icon: `${ICON_BASE}icon-health-optimisation.png`,
    iconAlt: "Health optimisation",
    /* Hers, less the word "weight". See the header. */
    description:
      "Comprehensive programs focused on energy, recovery, healthy ageing and long-term health.",
    priceKey: "healthProgram",
    priceLabel: `Programs from $${PRICES.healthProgram.amount}`,
    href: "/health-optimisation/",
  },
  {
    key: "weight-management",
    title: "Weight Management",
    icon: `${ICON_BASE}icon-weight-management.svg`,
    iconAlt: "Weight management",
    description:
      "Medically supervised weight management programs tailored to your health goals.",
    priceKey: "weightManagement",
    href: "/weight-management/",
  },
] as const;

export const SERVICE_BOXES_HEADING = {
  /* Not the heading repeated: the eyebrow sits directly above it. */
  eyebrow: "Our services",
  heading: "Choose Your Service",
  intro: "Select a category below to view detailed options and pricing.",
} as const;

/** Her price label, or the standard "from $X" the rest of the site uses. */
export function boxPrice(box: ServiceBox): string {
  return box.priceLabel ?? formatPrice(box.priceKey);
}
