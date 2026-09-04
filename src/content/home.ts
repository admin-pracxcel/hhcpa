/**
 * Copy for the homepage (`/`).
 *
 * Every string here is transcribed from HHCPA_Website_Content_UPDATED.md,
 * "PAGE 1: HOME" (the BUILD BLOCK plus its twelve-module map). The WordPress
 * copy it replaced is still readable on the archived clone at `/home-v2/`.
 *
 * Prices are read from `pricing.ts` rather than written out, so the badges and
 * the pricing cards cannot drift from the single source. Thirteen of the
 * fourteen figures there are still `provisional: true` pending Ranjeeta's
 * written confirmation — the content document flags the same thing in three
 * places on this page alone.
 *
 * The Medicinal Cannabis focus card is gone, not gated: advertising medicinal
 * cannabis to the public is prohibited outright, so the page and every route to
 * it were removed in the compliance remediation. The grid is five cards.
 */

import { CONSULTATION_PLANS } from "./consultation-plans";
import { PRICES } from "./pricing";
import { CALL_CTA } from "./clinic";

export const HOME_META = {
  title: "Online Telehealth Clinic Australia | Weight Loss & More",
  description:
    "AHPRA-registered telehealth clinic. Online consultations for weight management, men's and women's health, and everyday care. Free pre-screening, Australia-wide.",
} as const;

export const HOME_HERO = {
  heading:
    "Australia's practitioner-led telehealth clinic for weight loss, hormones and everyday care",
  body: "See an AHPRA-registered practitioner from home, anywhere in Australia. Start with a free two-minute pre-screening quiz, then book a real consultation by video or phone. Care is private, transparent, and centred on you.",
  primary: { label: "Check your eligibility", href: "/quiz/" },
  secondary: CALL_CTA,
} as const;

/** Value-proposition strip, full width directly under the hero. */
export const HOME_VALUE_STRIP: readonly string[] = [
  "Streamlined online process",
  "Clear, upfront pricing",
  "Care centred on you",
  "AHPRA-registered practitioners",
  "Private and judgement-free",
] as const;

/**
 * First on-page text under the hero. "Medical weight loss" is the site's primary
 * money keyword and belongs to the Weight Management page; the homepage supports
 * it in the first paragraph without taking it as an H1, so the two pages do not
 * compete.
 *
 * `text` is verbatim from the content document. The eyebrow and the link are
 * not in it — they were added because the paragraph was a 136-character-wide
 * slab on its own, and because About Us was the one major page nothing on this
 * homepage linked to.
 */
export const HOME_INTRO = {
  eyebrow: "Who we are",
  text: "Horizon Health Care Partners helps Australians get practical medical support without the waiting room. Our practitioners consult on weight management, men's and women's health, and a wide range of everyday health needs. You tell us what is going on through a short pre-screening quiz, you book a time that suits you, and you speak with a registered practitioner who reviews your history and talks through your options. A prescription is never guaranteed. Any treatment comes from a real consultation, where it is clinically appropriate.",
  cta: { label: "More about Horizon", href: "/about-us/" },
} as const;

const ICON_BASE =
  "/images/";

export interface FocusCard {
  readonly title: string;
  /** Square 500px icons supplied for this page. */
  readonly icon: string;
  readonly iconAlt: string;
  readonly badge: string;
  readonly body: string;
  readonly cta: string;
  readonly href: string;
}

export const HOME_FOCUS = {
  eyebrow: "Choose your focus",
  heading: "What we help with",
  intro:
    "Pick a starting point. Each service is delivered online by AHPRA-registered practitioners, Australia-wide.",
  cards: [
    {
      title: "Weight Management",
      icon: `${ICON_BASE}weight-management.webp`,
      iconAlt: "Weight management",
      badge: `From $${PRICES.firstConsult.amount} · programs from $${PRICES.healthProgram.amount}`,
      body: "Medically supervised weight-loss consultations and programs, assessed by a practitioner and reviewed over time.",
      cta: "Explore weight management",
      href: "/weight-management/",
    },
    {
      title: "Men's Health",
      icon: `${ICON_BASE}mens-health.webp`,
      iconAlt: "Men's health",
      badge: `From $${PRICES.firstConsult.amount}`,
      body: "Discreet online consultations for erectile dysfunction, low testosterone, hair loss and more.",
      cta: "Explore men's health",
      href: "/mens-health/",
    },
    {
      title: "Women's Health",
      icon: `${ICON_BASE}womens-health.webp`,
      iconAlt: "Women's health",
      badge: `From $${PRICES.firstConsult.amount}`,
      body: "Menopause and perimenopause support, hormones, PCOS and contraception, on your schedule.",
      cta: "Explore women's health",
      href: "/womens-health/",
    },
    {
      title: "Online Doctor",
      icon: `${ICON_BASE}doctor.webp`,
      iconAlt: "Prescriptions",
      badge: `From $${PRICES.generalConsult.amount}`,
      body: "Prescriptions, repeat scripts, medical certificates, and pathology or specialist referrals, where clinically appropriate.",
      cta: "See an online doctor",
      href: "/online-doctor/",
    },
    {
      title: "Mental Health Support",
      icon: `${ICON_BASE}mental-health.webp`,
      iconAlt: "Mental health",
      badge: `From $${PRICES.mentalHealth.amount}`,
      body: "Practitioner-led support for ADHD, anxiety, sleep and smoking cessation.",
      cta: "Explore mental health",
      href: "/online-doctor/mental-health/",
    },
  ] as const satisfies readonly FocusCard[],
} as const;

export const HOME_PRICING = {
  eyebrow: "Consultation pricing at a glance",
  heading: "Simple, upfront consultation pricing",
  plans: CONSULTATION_PLANS,
  footnote:
    "The pre-screening quiz is always free. Any medicine dispensed by a pharmacy is a separate cost.",
  footnoteCta: { label: "See full pricing", href: "/pricing/" },
} as const;

export const HOME_STEPS = {
  eyebrow: "How it works",
  heading: "Four simple steps to care",
  steps: [
    {
      pill: "Pre-screening quiz",
      title: "Take the pre-screening quiz",
      description:
        "Answer a few questions so we can see whether we are likely to help. The quiz is free and it is not a diagnosis.",
    },
    {
      pill: "Book a consultation",
      title: "Book your consultation",
      description:
        "Choose a time that suits you and book online, by video or phone.",
    },
    {
      pill: "Attend your appointment",
      title: "Speak with a practitioner",
      description:
        "Your AHPRA-registered practitioner reviews your history and discusses your options with you.",
    },
    {
      pill: "Ongoing support",
      title: "Ongoing support",
      description:
        "Where care continues, we handle follow-ups, reviews and eligible prescriptions.",
    },
  ],
  cta: { label: "See how it works in detail", href: "/how-it-works/" },
} as const;

export const HOME_WHY = {
  eyebrow: "Why patients choose Horizon",
  heading: "Care that respects your time and your privacy",
  tiles: [
    {
      title: "Registered practitioners",
      body: "Every consultation is with an AHPRA-registered practitioner. Registration details are shown on our practitioner profiles.",
    },
    {
      title: "Australia-wide, from home",
      body: "Regional, remote or metro, you get the same access. Geography is not a barrier to good care.",
    },
    {
      title: "Clear pricing",
      body: "The pre-screening quiz is free. Consultation fees are shown upfront, with no hidden costs.",
    },
    {
      title: "Judgement-free",
      body: "Sensitive concerns are handled with discretion and respect, in a private setting.",
    },
    {
      title: "Real consultations, real decisions",
      body: "We do not prescribe from a questionnaire. Treatment follows a proper consultation, where it is appropriate for you.",
    },
  ],
} as const;

export const HOME_APPROACH = {
  eyebrow: "Our approach to care",
  heading: "How we support you",
  items: [
    {
      id: "medical-guidance",
      title: "Medical guidance",
      body: "Our AHPRA-registered practitioners support you through each step, helping you understand your options and the pathway that fits your circumstances.",
    },
    {
      id: "judgement-free",
      title: "Judgement-free care",
      body: "Your concerns deserve a confidential, supportive setting. We listen without judgement and respect your individual situation.",
    },
    {
      id: "clinical-standards",
      title: "Clinical standards",
      body: "Every consultation follows established medical protocols, delivered by practitioners who maintain rigorous, current clinical standards.",
    },
    {
      id: "informed-decisions",
      title: "Informed decisions",
      body: "Your practitioner reviews your history and discusses your concerns before recommending the most appropriate next step for you.",
    },
  ],
} as const;

export const HOME_SEARCH = {
  eyebrow: "Built for the way Australians search for care",
  heading: "Everything in one place",
  paragraphs: [
    "Booking a specialist can take weeks. Repeat scripts run out at the worst time. Sensitive issues are hard to raise face to face.",
    "Horizon brings the common threads of everyday healthcare into one online clinic, so you can deal with weight, hormones, sexual health, mental health and routine scripts through the same trusted practitioners.",
  ],
  points: [
    "One clinic for weight, hormones and everyday care",
    "The same practitioners across your concerns",
    "No waiting room, no referral chase",
  ],
  cta: { label: "Book a consultation", href: "/quiz/" },
} as const;

export const HOME_KNOWLEDGE = {
  eyebrow: "Knowledge hub",
  heading: "Guidance worth reading",
  cta: { label: "Read the knowledge hub", href: "/articles/" },
} as const;

export const HOME_FAQ = {
  heading: "Your questions, answered",
  items: [
    {
      id: "how-it-works",
      question: "How does Horizon Health Care Partners work?",
      answer:
        "You start with a free online pre-screening quiz. If it looks like we can help, you book a consultation by video or phone with an AHPRA-registered practitioner. The practitioner reviews your health and talks through your options. Any care plan comes from that consultation, not from the quiz.",
    },
    {
      id: "prescription",
      question: "Will I be given a prescription?",
      answer:
        "A prescription is not guaranteed. Our practitioners prescribe only where it is clinically appropriate, after a real-time consultation. Depending on your situation, the outcome might be advice, a referral, monitoring, lifestyle guidance, or no treatment.",
    },
    {
      id: "cost",
      question: "How much does it cost?",
      answer: `The pre-screening quiz is free. Consultation fees are shown on our pricing page and start from $${PRICES.firstConsult.amount}. You only pay when you choose to book.`,
    },
    {
      id: "coverage",
      question: "Where in Australia do you operate?",
      answer:
        "Everywhere. We are a national telehealth clinic, so you can consult with us from any state or territory.",
    },
    {
      id: "emergency",
      question: "What if it is an emergency?",
      answer:
        "Telehealth is not for emergencies. If this is a medical emergency, call 000. If you are in crisis, call Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636.",
    },
  ],
} as const;

export const HOME_CLOSING = {
  heading: "Your health, handled from home",
  body: "Start with the free pre-screening quiz. It takes about two minutes, it is not a diagnosis, and there is no commitment until you choose to book.",
  primary: { label: "Start the free quiz", href: "/quiz/" },
} as const;
