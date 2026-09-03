/**
 * Copy for `/weight-loss-peptides/weight-loss-injections/`.
 *
 * Transcribed from HHCPA_Website_Content_UPDATED.md, "PAGE 3: WEIGHT LOSS
 * INJECTIONS", including its ten-module map.
 *
 * Exact-match keyword is "weight loss injections australia", which opens the
 * H1 and the first paragraph. This page sits under the Weight Loss & Peptides
 * silo, so the breadcrumb runs Home / Weight Loss & Peptides / here.
 *
 * The no-brand-names rule is stated twice in the source copy — once in the
 * intro and once in the FAQ — and both are kept. Nothing on this page names a
 * product, an active ingredient or a manufacturer (clause 2.6).
 */

import { CALL_CTA } from "./clinic";
import { sectionImage } from "./services/shared";

export const WLI_META = {
  title: "Weight Loss Injections Australia | Online Medical Assessment",
  description:
    "Ask an AHPRA-registered practitioner whether prescription weight-loss injections are clinically appropriate for you. Online consultations Australia-wide.",
  path: "/weight-loss-peptides/weight-loss-injections/",
} as const;

export const WLI_HERO = {
  eyebrow: "Weight loss injections",
  heading:
    "Weight loss injections in Australia, assessed online by a practitioner",
  primary: { label: "Check your eligibility", href: "/quiz/" },
  secondary: CALL_CTA,
} as const;

export const WLI_INTRO =
  "Weight loss injections in Australia are prescription treatments, and they are not a shortcut you buy off a shelf. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses whether an injectable weight-loss option is clinically appropriate for you, explains what it involves, and reviews your progress if treatment begins. This page explains how that assessment works and what to expect. We do not name brands or products, because the right choice depends on you.";

export const WLI_DECISION = {
  eyebrow: "How injectable treatment is decided",
  heading: "How a practitioner decides if injections suit you",
  paragraphs: [
    "Injectable weight-loss treatments work mainly by acting on appetite and fullness signals, which can make it easier to eat less without feeling constantly hungry. That mechanism is powerful, and it is also why these treatments need proper medical assessment. Your practitioner looks at your weight and health history, your current medications, any relevant conditions, and your goals. They weigh the likely benefit against the risks for you specifically. Where it helps, they may arrange blood tests first.",
    "If an injectable option is appropriate, your practitioner explains how it is used, what side effects to watch for, and how you will be reviewed. If it is not appropriate, they tell you plainly and discuss alternatives.",
  ],
} as const;

export const WLI_EXPECT = {
  eyebrow: "What to expect",
  heading: "What treatment involves",
  tiles: [
    {
      title: "A real consultation first",
      body: "Nothing is prescribed from the quiz alone.",
    },
    {
      title: "Clear guidance",
      body: "If treatment starts, you will understand how to use it and what to monitor.",
    },
    {
      title: "Follow-up built in",
      body: "Your practitioner reviews how you are responding and adjusts the plan.",
    },
    {
      title: "Honest limits",
      body: "These treatments support weight loss alongside changes to eating and activity. They are not a standalone fix, and your practitioner will be direct about that.",
    },
  ],
} as const;

export const WLI_SAFETY = {
  eyebrow: "Safety and suitability",
  heading: "Safety comes first",
  paragraphs: [
    "Injectable weight-loss treatments are not suitable for everyone. They are generally not used in pregnancy or breastfeeding, and certain medical histories change what is safe. This is why the consultation matters, and why ongoing review is part of the service rather than an optional extra. If a side effect appears or your circumstances change, your practitioner adjusts the plan.",
  ],
  cta: { label: "Check your eligibility", href: "/quiz/" },
  image: sectionImage("weight-loss-injections-safety"),
  imageAlt:
    "A general practitioner leans forward at her desk, listening during a video consultation.",
  /* Left, so the page alternates against the split rows on the parent page. */
  imageSide: "left",
} as const;

export const WLI_RELATED = {
  eyebrow: "Interlinking",
  heading: "Explore your options",
  cards: [
    {
      title: "Weight loss & peptides",
      body: "The full overview of medical weight-loss care at Horizon.",
      links: [
        { label: "Weight loss & peptides", href: "/weight-loss-peptides/" },
      ],
    },
    {
      title: "Medical weight loss program",
      body: "The supervised, review-based path.",
      links: [
        {
          label: "Medical weight loss program",
          href: "/weight-loss-peptides/medical-weight-loss-program/",
        },
      ],
    },
  ],
  footnote: "New here? See the full patient journey on",
  footnoteLinks: [
    { label: "how it works", href: "/how-it-works/" },
    { label: "pricing", href: "/pricing/" },
  ],
} as const;

export const WLI_BEGIN = {
  heading: "How to begin",
  lead: "Begin with the free pre-screening quiz, then choose a consultation time that suits you. Fees are set out on our ",
  mid: ", and the full four-step process is explained on ",
  tail: ".",
  links: [
    { label: "pricing page", href: "/pricing/" },
    { label: "how it works", href: "/how-it-works/" },
  ],
  cta: { label: "Start the free quiz", href: "/quiz/" },
} as const;

export const WLI_FAQ = {
  heading: "Common questions",
  items: [
    {
      id: "online",
      question: "Can I get weight loss injections online in Australia?",
      answer:
        "You can book an online consultation to be assessed for them. Whether they are prescribed depends on your practitioner's clinical judgement after that consultation.",
    },
    {
      id: "which",
      question: "Which injection will I be prescribed?",
      answer:
        "We do not name products online. Your practitioner discusses suitable options with you privately, based on your health.",
    },
    {
      id: "safe",
      question: "Are weight loss injections safe?",
      answer:
        "They are prescription treatments with real benefits and real risks. Safety depends on your individual health, which is why assessment and follow-up are required.",
    },
    {
      id: "diet",
      question: "Do injections replace diet and exercise?",
      answer:
        "No. They are used alongside changes to eating and activity, with practitioner support.",
    },
  ],
} as const;

/**
 * The source says "use standard closing CTA band" rather than giving copy, so
 * this is the homepage's closing band wording, which is the standard one.
 */
export const WLI_CLOSING = {
  heading: "Your health, handled from home",
  body: "Start with the free pre-screening quiz. It takes about two minutes, it is not a diagnosis, and there is no commitment until you choose to book.",
  primary: { label: "Start the free quiz", href: "/quiz/" },
} as const;
