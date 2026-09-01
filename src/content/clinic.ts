/**
 * Clinic facts that appear site-wide.
 *
 * Sources: HHCPA_Service_Agreement_Final.pdf (legal entity, ABN),
 * HHCPA_Website_Content_UPDATED.md (NAP block, disclaimer, trust bar),
 * HHCPA_Onboarding_Sheet (confirmed phone, email, hours).
 */

export interface EmergencyContact {
  label: string;
  number: string;
  href: string;
}

export const CLINIC = {
  name: "Horizon Health Care Partners",
  shortName: "HHCPA",
  legalName: "Horizon Health Care Partners Pty Ltd",
  abn: "92 689 872 811",
  phone: "1300 336 572",
  phoneHref: "tel:1300336572",
  email: "hello@horizonhealthcarepartners.com.au",
  emailHref: "mailto:hello@horizonhealthcarepartners.com.au",
  addressRegion: "West End, Queensland",
  serviceArea: "Australia-wide telehealth",
  /**
   * Onboarding item 6 answered "8-10am - Monday to Sunday", which is ambiguous —
   * most likely a typo for 8am to 10pm, matching the current live site. Awaiting
   * written confirmation; `hoursProvisional` keeps that visible to reviewers.
   */
  hours: "Monday to Sunday, 8am to 10pm AEST",
  hoursProvisional: true,
} as const;

export const SITE_DISCLAIMER =
  "Individual results may vary and no treatment outcomes are guaranteed. " +
  "Prescriptions are provided only where clinically appropriate following a " +
  "real-time consultation, at the treating practitioner's discretion. " +
  "Information on this site is general and is not a substitute for personal " +
  "medical advice. If this is a medical emergency, call 000. If you are in " +
  "crisis, call Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636.";

export const EMERGENCY_CONTACTS: readonly EmergencyContact[] = [
  { label: "Emergency", number: "000", href: "tel:000" },
  { label: "Lifeline", number: "13 11 14", href: "tel:131114" },
  { label: "Beyond Blue", number: "1300 22 4636", href: "tel:1300224636" },
] as const;

export const TRUST_BAR_DEFAULT: readonly string[] = [
  "AHPRA-registered practitioners",
  "Australia-wide telehealth",
  "Clear, upfront pricing",
  "Private and judgement-free",
  "Care centred on you",
] as const;
