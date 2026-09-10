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
import { CALL_CTA, EMERGENCY_LINE } from "./clinic";
import { HEALTH_OPTIMISATION_CARD } from "./services/health-optimisation";
import { CONTINUITY_CARD } from "./services/continuity-preventative-health";
import { HOLISTIC_CARE_CARD } from "./services/holistic-alternative-care";

export const HOME_META = {
  /*
   * §4.1.1. The old title led on weight loss, which under-represents seven of
   * the eight service areas. Flagged to the client as a recommendation rather
   * than treated as approved — it is not one of her instructions.
   */
  title: "Online Telehealth Clinic Australia | AHPRA-Registered Practitioners",
  description:
    "AHPRA-registered telehealth clinic. Online consultations for weight management, men's and women's health, and everyday care. Free pre-screening, Australia-wide.",
} as const;

export const HOME_HERO = {
  heading:
    "Australia's practitioner-led telehealth clinic for everyday health, weight, hormones and health optimisation",
  body: "See an AHPRA-registered practitioner from home, anywhere in Australia. Start with a free pre-screening quiz, then book a real consultation by video or phone. Care is private, transparent, and centred on you.",
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
  /*
   * §4.1.2, Ranjeeta's own copy, verbatim, replacing the previous single
   * paragraph. It satisfies her instruction that the intro name every service
   * including GP and everyday care.
   *
   * One change to her wording, recorded by the spec and again here: her first
   * line used an em dash, which §9 bars from rendered copy, so it is a comma.
   * Nothing else was altered. The fourth paragraph is hers and is load-bearing
   * — it is the page's clearest statement that nothing is guaranteed.
   */
  text: [
    "Healthcare designed around you, wherever you are in Australia.",
    "Horizon Health Care Partners Australia makes it easier to access professional, personalised healthcare without the waiting room. Our AHPRA-registered practitioners provide Australia-wide telehealth care across everyday health, holistic and alternative care, mental health, weight and metabolic health, men's and women's health, hormone health, health optimisation, prescriptions, referrals and preventative care.",
    "Getting started is simple. Complete a short pre-screening questionnaire where applicable, choose a consultation time that suits you, and speak directly with a registered healthcare practitioner who will review your health history, listen to your concerns and discuss appropriate options for your individual needs.",
    "Every treatment decision is based on an appropriate clinical assessment. Prescriptions and specific treatments are not guaranteed and are only provided where clinically appropriate.",
  ],
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
  /*
   * Eight cards, per build spec v2.1 §4.1.4 and §2.5. The descriptions are that
   * section's own table, which is drawn from her live site.
   *
   * The badge on each card is that service's own floor price, not the
   * first-consultation fee. Every card used to read "From $59" because they all
   * rendered `firstConsult`; §5.2 raises that fee to $69, at which point "From
   * $59" would have matched nothing at all. They now read from the same
   * `PRICES` entries as the Other services table on /pricing, so the two cannot
   * disagree — which is what the v2.2 answer to Q6 asked for.
   */
  cards: [
    {
      title: "Weight Management",
      icon: `${ICON_BASE}weight-management.webp`,
      iconAlt: "Weight management",
      badge: `From $${PRICES.weightManagement.amount}`,
      body: "Medically supervised weight management programs tailored to your health goals.",
      cta: "Explore weight management",
      href: "/weight-management/",
    },
    {
      title: "Health Optimisation & Complete Wellness",
      icon: `${ICON_BASE}icon-health-optimisation.png`,
      iconAlt: "Health optimisation",
      badge: `Programs from $${PRICES.healthProgram.amount}`,
      body: HEALTH_OPTIMISATION_CARD,
      cta: "Explore health optimisation",
      href: "/health-optimisation/",
    },
    {
      title: "Men's Health",
      icon: `${ICON_BASE}mens-health.webp`,
      iconAlt: "Men's health",
      badge: `From $${PRICES.mensWomensHealth.amount}`,
      body: "Discreet online consultations for erectile dysfunction, low testosterone, hair loss and more.",
      cta: "Explore men's health",
      href: "/mens-health/",
    },
    {
      title: "Women's Health",
      icon: `${ICON_BASE}womens-health.webp`,
      iconAlt: "Women's health",
      badge: `From $${PRICES.mensWomensHealth.amount}`,
      body: "Menopause and perimenopause support, hormones, PCOS and contraception, on your schedule.",
      cta: "Explore women's health",
      href: "/womens-health/",
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
      title: "Continuity & Preventative Health",
      icon: `${ICON_BASE}icon-continuity-preventative.svg`,
      iconAlt: "Continuity and preventative health",
      badge: `From $${PRICES.continuityPreventative.amount}`,
      body: CONTINUITY_CARD,
      cta: "Explore continuity care",
      href: "/continuity-preventative-health/",
    },
    {
      title: "Holistic Care / Alternative Medicine",
      icon: `${ICON_BASE}icon-holistic-care.png`,
      iconAlt: "Holistic care",
      badge: `From $${PRICES.holisticCare.amount}`,
      body: HOLISTIC_CARE_CARD,
      cta: "Explore holistic care",
      href: "/holistic-alternative-care/",
    },
  ] as const satisfies readonly FocusCard[],
} as const;

export const HOME_PRICING = {
  /*
   * §4.1.5 retitles this block to name the service its three fees apply to.
   * The eight per-service floor prices are on the cards above, so the homepage
   * still shows what every service costs; these three are holistic care's.
   */
  eyebrow: "Our fees",
  heading: "Our Fees: Holistic Care / Alternative Medicine",
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
      /* §4.1.6: reverts to her live site's wording for this step. */
      pill: "Book a Consultation",
      title: "Schedule at Your Convenience",
      description:
        "Choose a time that suits you and book your telehealth appointment online.",
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
    /*
     * §4.1.7 (a) and (b): her live site's "compassionate, transparent and
     * convenient" paragraph is folded in here, and the service list widened
     * from five areas to the eight the site now offers.
     */
    "Horizon brings the common threads of everyday healthcare into one online clinic, so you can deal with weight and metabolic health, health optimisation, men's and women's health, mental health, holistic care, preventative health and routine scripts through the same trusted practitioners. We believe healthcare should be compassionate, transparent, and convenient. Our team is committed to providing medical guidance in a safe, stigma-free environment where every patient feels heard and respected.",
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
        `Telehealth is not for emergencies. ${EMERGENCY_LINE}`,
    },
  ],
} as const;

export const HOME_CLOSING = {
  heading: "Professional Healthcare, Wherever You Are",
  body: "Start with the free pre-screening quiz. It takes a few minutes, it is not a diagnosis, and there is no commitment until you choose to book.",
  primary: { label: "Start the free quiz", href: "/quiz/" },
} as const;
