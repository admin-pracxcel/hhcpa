/**
 * PAGE 25: CONTACT.
 *
 * Schema is ContactPage per the BUILD BLOCK. It also asks for
 * MedicalOrganization, which the layout's site-wide MedicalClinic satisfies as
 * a subtype.
 *
 * ⚠️ Hours are unconfirmed. The content document flags Ranjeeta's onboarding
 * answer, "8-10am - Monday to Sunday", as ambiguous and probably a typo for
 * 8am to 10pm, matching the live site. `clinic.ts` already carries that reading
 * behind `hoursProvisional`, and this page shows it. Confirm before publishing:
 * published opening hours that are wrong are worse than none.
 */

import { CALL_CTA, CLINIC } from "./clinic";

export const CONTACT_META = {
  title: "Contact Us | Horizon Health Care Partners Australia",
  description: `Contact Horizon Health Care Partners. Call ${CLINIC.phone} or send a message. AHPRA-registered telehealth care, Australia-wide.`,
  path: "/contact/",
} as const;

export const CONTACT_PAGE = {
  hero: {
    eyebrow: "Contact",
    heading: "Contact our team",
    primary: { label: "Book a consultation", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  intro:
    "Have a question before you book? Our team is here to help. For anything clinical, the fastest path is the free pre-screening quiz, which leads to a consultation with a practitioner. For everything else, reach us by phone, email or the form below.",
  details: {
    eyebrow: "Contact details",
    heading: "How to reach us",
    hours: CLINIC.hours,
  },
  form: {
    eyebrow: "Contact form",
    heading: "Send us a message",
    note: "We aim to respond promptly during business hours. Please do not include sensitive clinical details in the form. For medical concerns, book a consultation so a practitioner can help you properly.",
  },
  emergency: {
    eyebrow: "Emergencies",
    heading: "In an emergency",
    body: "This form and inbox are not monitored around the clock and are not for emergencies. If this is a medical emergency, call 000. If you are in crisis, call Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636.",
  },
  closing: {
    heading: "Your health, handled from home",
    body: "Start with the free pre-screening quiz. It takes about two minutes, it is not a diagnosis, and there is no commitment until you choose to book.",
    primary: { label: "Start the free quiz", href: "/quiz/" },
  },
} as const;
