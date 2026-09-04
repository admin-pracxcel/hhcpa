/**
 * Copy for `/weight-management/`.
 *
 * Transcribed from HHCPA_Website_Content_UPDATED.md, "PAGE 2: WEIGHT LOSS &
 * PEPTIDES ★ PRIMARY MONEY PAGE", including its eleven-module map, then
 * reframed by HHCPA_Remediation_Change_Spec.md §B3.
 *
 * The source copy targeted "peptides for weight loss" as the site's primary
 * money keyword, exact-matched in the meta title, the H1, the first paragraph
 * and the URL. That keyword cannot be used: peptides are a restricted
 * prescription class under the TGA advertising restrictions, so naming them is
 * advertising a prescription medicine to the public. The page now targets the
 * compliant cluster instead — "medical weight loss", "weight loss clinic
 * online" — and the URL moved from `/weight-loss-peptides/` with a 301.
 *
 * Compliance notes carried over from the source copy, which are load-bearing
 * rather than stylistic — Service Agreement clauses 2.6 and 6.5:
 *   - No product, brand or class names anywhere on the page, and the copy says
 *     so out loud ("We do not name or promote specific medicines on this page,
 *     and we do not sell them").
 *   - No outcome guarantees. The prescription answer says no explicitly.
 *   - Pregnancy and breastfeeding are addressed rather than left out.
 *
 * Prices come from `pricing.ts`. The source marks the weight-loss and program
 * figures as still awaiting Ranjeeta's confirmation, which is the same
 * provisional flag those entries already carry.
 */

import { PRICES } from "./pricing";
import { CALL_CTA } from "./clinic";
import { sectionImage } from "./services/shared";

export const WLP_META = {
  title: "Medical Weight Loss Clinic Online | Australia",
  description:
    "Medically supervised weight loss with AHPRA-registered practitioners. Online weight-loss consultations, Australia-wide. Free pre-screening, no obligation.",
  path: "/weight-management/",
} as const;

export const WLP_HERO = {
  eyebrow: "Weight management",
  heading: "Medical weight loss, guided by AHPRA-registered practitioners",
  primary: { label: "Check your eligibility", href: "/quiz/" },
  secondary: CALL_CTA,
} as const;

/** Trust bar, verbatim from the source. Four items on this page, not five. */
export const WLP_TRUST: readonly string[] = [
  "AHPRA-registered practitioners",
  "Australia-wide telehealth",
  "Ongoing review, not one-off scripts",
  "Private and judgement-free",
] as const;

/** First on-page text. The exact-match keyword opens the first sentence. */
export const WLP_INTRO =
  "Medical weight loss has become one of the most sought-after areas of care in Australia, and one of the most misunderstood. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses whether a medically supervised weight-loss approach is clinically appropriate for you, then supports you through it with proper review. This is medical weight loss, delivered online. It starts with understanding your health, not with handing out a product.";

export const WLP_EXPLAINER = {
  eyebrow: "How it works",
  heading: "How medically supervised weight loss works",
  paragraphs: [
    "Medically supervised weight loss means a registered practitioner assesses your health, agrees a plan with you, and reviews it over time, rather than you buying something without advice. Where a prescription is clinically appropriate, that decision is made in your consultation, based on your history, your other medications, your goals and your safety. We do not name or promote specific medicines on this page, and we do not sell them. Your practitioner discusses suitable options with you directly, in private.",
  ],
  cta: { label: "Book a consultation", href: "/quiz/" },
  image: sectionImage("weight-management-how-it-works"),
  imageAlt:
    "A woman at a kitchen table listens during a video consultation, a notebook open beside her.",
} as const;

export const WLP_SUITS = {
  eyebrow: "Who it may suit",
  heading: "Who a medical weight-loss consultation may suit",
  intro: "A consultation may be worth booking if you recognise some of the following:",
  items: [
    "You have tried to lose weight through diet and exercise, and it has not held.",
    "Your weight is affecting your health, your energy, your sleep or your confidence.",
    "You want a plan that is supervised by a practitioner, with follow-up, rather than a product bought without advice.",
    "You would prefer to have this conversation privately, from home.",
  ],
  /* Rendered as a callout, not a bullet: it is the counterweight to the list. */
  caveat:
    "A consultation may not be the right step if you are pregnant or breastfeeding, if you have certain medical conditions, or if a different pathway would serve you better. Your practitioner will tell you honestly if that is the case.",
} as const;

export const WLP_STEPS = {
  eyebrow: "How it works",
  heading: "How weight-loss care works at Horizon",
  steps: [
    {
      pill: "Free pre-screening quiz",
      title: "Free pre-screening quiz",
      description:
        "A few short questions help us understand your situation and whether we are likely to be able to help. It takes about two minutes and it is not a diagnosis.",
    },
    {
      pill: "Book your consultation",
      title: "Book your consultation",
      description:
        "Choose a time that suits you. Consultations happen by video or phone, Australia-wide.",
    },
    {
      pill: "Talk it through",
      title: "Talk it through with a practitioner",
      description:
        "Your practitioner reviews your history, your goals and any current medications, and discusses whether a medically supervised weight-loss option is appropriate. Where useful, they may arrange pathology so decisions are based on real data.",
    },
    {
      pill: "Ongoing review",
      title: "Ongoing review",
      description:
        "Weight management is not a single appointment. If treatment begins, your practitioner reviews how you are going, adjusts the plan, and manages eligible prescriptions over time.",
    },
  ],
  cta: { label: "Start the free quiz", href: "/quiz/" },
} as const;

export const WLP_SUPERVISION = {
  eyebrow: "Why supervision matters",
  heading: "Why practitioner review changes the outcome",
  paragraphs: ["Weight is regulated by biology, not just willpower. Appetite, metabolism and hormones all push back when you lose weight, which is a large part of why weight returns after a diet ends. Medical weight-loss care works with that biology instead of ignoring it. A practitioner can assess your whole picture, monitor your progress, watch for side effects, and adjust the approach as your body adapts. That ongoing relationship is where results are protected over the long term."],
} as const;

export const WLP_PRICING = {
  eyebrow: "What to expect on cost",
  heading: "Straightforward pricing",
  headline: `$${PRICES.firstConsult.amount}`,
  headlineLabel: "First consultation",
  secondary: [
    { label: "Pre-screening quiz", value: "Free" },
    {
      label: "Follow-up consultation",
      value: `$${PRICES.followUpConsult.amount}`,
    },
    {
      label: "Structured weight-management programs",
      value: `from $${PRICES.healthProgram.amount}`,
    },
  ],
  note: "Any medication supplied by a pharmacy is separate from the consultation fee. There is no commitment until you decide to book.",
  cta: { label: "See full pricing", href: "/pricing/" },
} as const;

export const WLP_RELATED = {
  eyebrow: "Related services",
  heading: "Explore your options",
  cards: [
    {
      title: "Medical weight loss program",
      body: "The supervised, review-based path.",
      links: [
        {
          label: "Medical weight loss program",
          href: "/weight-management/medical-weight-loss-program/",
        },
      ],
    },
    {
      title: "Men's and women's health",
      body: "Because weight, hormones and energy are often connected.",
      links: [
        { label: "Men's health", href: "/mens-health/" },
        { label: "Women's health", href: "/womens-health/" },
      ],
    },
  ],
  footnote: "New here? See the full patient journey on",
  footnoteLinks: [
    { label: "how it works", href: "/how-it-works/" },
    { label: "pricing", href: "/pricing/" },
  ],
} as const;

export const WLP_FAQ = {
  heading: "Common questions about medical weight loss",
  items: [
    {
      id: "availability",
      question: "Is medical weight loss available online in Australia?",
      answer:
        "Yes. An AHPRA-registered practitioner can assess you by video or phone anywhere in Australia, review your health history and goals, agree a plan with you and review it over time. What that plan involves is a clinical decision made in your consultation. We do not supply or promote specific medicines.",
    },
    {
      id: "prescription",
      question: "Will I definitely get a prescription?",
      answer:
        "No. Your practitioner prescribes only where it is clinically appropriate and safe for you. The consultation may lead to a prescription, a different plan, further tests, or a recommendation that this is not the right option.",
    },
    {
      id: "referral",
      question: "Do I need a referral?",
      answer:
        "No referral is needed to book a consultation. Start with the free pre-screening quiz.",
    },
    {
      id: "wait",
      question: "How quickly can I be seen?",
      answer:
        "You can usually book a consultation within a short time of completing the quiz. Availability is shown when you book.",
    },
    {
      id: "pregnancy",
      question: "Is this suitable during pregnancy?",
      answer:
        "Medical weight-loss care is generally not appropriate during pregnancy or breastfeeding. Tell your practitioner, and they will advise a safe path.",
    },
  ],
} as const;

export const WLP_CLOSING = {
  heading: "Ready to see whether this suits you?",
  body: "Start with the free pre-screening quiz. Two minutes, no diagnosis, no commitment. If a medical weight-loss approach is right for you, your practitioner will guide it from there.",
  primary: { label: "Start the free quiz", href: "/quiz/" },
} as const;
