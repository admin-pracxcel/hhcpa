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
  /*
   * One place, read by every phone number on the site: the header, the
   * footer, the sticky call bar, the contact page, the booking page's
   * fallback, the reCAPTCHA refusal and the JSON-LD `telephone`.
   *
   * It was temporarily +61 7 4518 2007 between 2026-10-21 and 2026-10-23, at
   * Bilal's instruction, and came back here. Changing it is these two lines
   * and nothing else — the tests derive from them rather than pinning digits,
   * which is what that diversion established.
   */
  phone: "1300 336 572",
  phoneHref: "tel:1300336572",
  email: "hello@horizonhealthcarepartners.com.au",
  emailHref: "mailto:hello@horizonhealthcarepartners.com.au",
  addressRegion: "West End, Queensland",
  serviceArea: "Australia-wide telehealth",
  /**
   * Onboarding item 6 answered "8-10am - Monday to Sunday", which was ambiguous.
   * The client confirmed 8am to 10pm on 2026-09-03, matching the live site, so
   * the reading below is no longer provisional.
   */
  hours: "Monday to Sunday, 8am to 10pm AEST",
  /**
   * The same hours, set as a standalone line rather than as prose.
   *
   * Two forms because there are two jobs. `hours` is read inside a sentence —
   * NotFoundPanel and ThankYouPanel both splice it into one, where a middot
   * would land mid-clause. `hoursDisplay` stands on its own line in the
   * footer. Neither reads well in the other's place, which is why this is a
   * second field and not a reformat of the first.
   *
   * clinic.test.ts asserts the two carry the same times, so they cannot
   * drift apart silently.
   */
  hoursDisplay: "Monday – Sunday · 8:00am – 10:00pm AEST",
  hoursProvisional: false,
  /*
   * The same hours again, in the 24-hour form `openingHoursSpecification`
   * takes. A third rendering of one fact is a thing to be suspicious of, so
   * clinic.test.ts asserts all three agree — the prose, the footer line and
   * these. Changing the hours means changing all three, and the test says so
   * rather than letting the structured data quietly keep the old times.
   */
  opensAt: "08:00",
  closesAt: "22:00",
} as const;

/**
 * Where this clinic is the same organisation somewhere else.
 *
 * Read by two things that must not disagree: the footer's social icons and
 * the `sameAs` array in the JSON-LD graph. They were separate until
 * 2026-10-29 — the footer had the three social URLs and the schema had none,
 * which is the shape that lets a profile get renamed in one place and go
 * stale in the other.
 *
 * `sameAs` is how a search engine is told that this website, that Business
 * Profile and those social accounts are one entity rather than several with
 * similar names. That is the whole fix for the "Horizon Health Clinic"
 * confusion Ranjeeta raised: not a disclaimer on the page, a statement that
 * these identifiers belong together.
 *
 * The Business Profile URL is the CID form. It is the stable identifier for
 * the listing — a /maps/place/ URL carries coordinates and a session token
 * and is not durable.
 */
export const SOCIAL_PROFILES = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/horizon-health-care-partners-australia/",
  },
  {
    /* Canonical profile URL. The footer's old value carried `&sk=about`,
       which names a tab rather than the profile. */
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61583057797612",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/horizonhealthcarepartnersaus/",
  },
] as const;

/** The Google Business Profile listing, by CID. */
export const GOOGLE_BUSINESS_PROFILE =
  "https://maps.google.com/?cid=15133496855973582523";

/**
 * The secondary CTA every page hero carries, beside the quiz.
 *
 * It is a phone call rather than a second link into the quiz, which is what it
 * used to be — two buttons side by side that both opened the same page. Two
 * CTAs should offer two different things to do: the quiz screens you yourself,
 * this puts you through to a person. The contact form was the other candidate
 * and is the same act as the quiz in different clothes — fill something in and
 * wait for a reply.
 *
 * The label names the number rather than saying "Book a consultation", because
 * a call is what happens when it is pressed. Nothing on the public site takes a
 * booking directly: the Halaxy widget that does is in the BookingWizard, which
 * renders only on the archived clone at `/home-v2/` (CUSTOMISATIONS.md
 * deviation 2). Until it is rehomed, "book" is a promise no button here can
 * keep, and the phone is the honest version of it.
 *
 * FinalCtaSection and the mobile CTA bar already pair the quiz with this call,
 * so the heroes now match the rest of the page rather than being a third
 * pattern.
 */
export const CALL_CTA = {
  label: `Call ${CLINIC.phone}`,
  href: CLINIC.phoneHref,
} as const;

/**
 * The emergency line, in Ranjeeta's own words.
 *
 * Build spec v2.1 §2.3 marks this compulsory on every page and supplies the
 * exact text; her instruction reads "Every page needs the following:
 * Compulsory". It replaced a differently-worded equivalent that had been
 * deployed site-wide — hers is more direct and carries the 24/7 detail, and two
 * near-identical crisis lines on one domain is worse than one.
 *
 * Split out from SITE_DISCLAIMER because /quiz sits outside the (site) layout
 * and so never rendered the disclaimer. §2.3 records /quiz as the one page
 * missing the line; it can now carry this constant on its own.
 */
export const EMERGENCY_LINE =
  "Medical emergency? Call 000 immediately. If you are in crisis, call " +
  "Lifeline 13 11 14 (24/7) or Beyond Blue 1300 22 4636.";

export const SITE_DISCLAIMER =
  "Individual results may vary and no treatment outcomes are guaranteed. " +
  "Prescriptions are provided only where clinically appropriate following a " +
  "real-time consultation, at the treating practitioner's discretion. " +
  "Information on this site is general and is not a substitute for personal " +
  "medical advice. " +
  EMERGENCY_LINE;

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
