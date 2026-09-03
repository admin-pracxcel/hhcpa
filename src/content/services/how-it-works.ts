/**
 * PAGE 21: HOW IT WORKS.
 *
 * The one page where the map's step cards and the copy agree completely: four
 * genuinely numbered steps. Everything the nineteen service pages link to as
 * "the full process" is here.
 *
 * Two notes on fidelity to the source:
 *
 *   - The source marks each of the four steps as its own H2. They render as
 *     card headings under a single section H2 instead. Four H2s that all read
 *     "Step N: ..." would flatten the page's outline for anyone navigating by
 *     heading, and the step cards already convey the sequence.
 *   - The source gives no section-level heading above the steps, so "The four
 *     steps" is the map's own name for the module rather than invented copy.
 *
 * Module 6 is the emergency callout. It takes the dark band, the only inverted
 * section on the page, so 000, Lifeline and Beyond Blue cannot be skimmed past.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { STANDARD_CLOSING } from "./shared";
import { CALL_CTA } from "../clinic";

export const HOW_IT_WORKS: ServicePageData = {
  meta: {
    title: "How It Works | Online Telehealth Consultations | HHCPA",
    description:
      "Four simple steps: free pre-screening quiz, book, consult with an AHPRA-registered practitioner, and ongoing support. See how HHCPA telehealth works.",
    path: "/how-it-works/",
  },
  hero: {
    eyebrow: "How it works",
    heading: "How it works: from pre-screening to ongoing care in four steps",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  intro:
    "Getting care with Horizon Health Care Partners is deliberately simple. You start with a free quiz, you book when it suits you, you speak with a registered practitioner, and you get ongoing support where your care continues. Here is exactly what happens at each step, so there are no surprises.",
  modules: [
    {
      kind: "steps",
      eyebrow: "How it works",
      heading: "The four steps",
      steps: [
        {
          pill: "Step 1",
          title: "Take the free pre-screening quiz",
          description:
            "Answer a few short questions about what is going on. This helps us understand your situation and see whether we are likely to be able to help. The quiz takes about two minutes, it is free, and it is not a diagnosis. Nothing is decided from the quiz alone.",
        },
        {
          pill: "Step 2",
          title: "Book your consultation",
          description:
            "Choose a time that suits you and book online. Consultations happen by video or phone, so you can attend from anywhere in Australia. Same-day, after-hours and priority options are available.",
        },
        {
          pill: "Step 3",
          title: "Speak with an AHPRA-registered practitioner",
          description:
            "Your practitioner reviews your history, asks about your symptoms and goals, and discusses your options. Where it helps, they arrange pathology or imaging. Where treatment is appropriate, they explain it clearly. A prescription is never guaranteed, and any prescription follows this real consultation.",
        },
        {
          pill: "Step 4",
          title: "Ongoing support and follow-up",
          description:
            "Where your care continues, we handle reviews, follow-up consultations, and eligible prescriptions. You are not left to manage things alone after the first appointment.",
        },
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
    },
    {
      kind: "tiles",
      tinted: true,
      eyebrow: "What you need",
      heading: "What you need to get started",
      tiles: [
        {
          title: "A device",
          body: "A phone, tablet or computer with a camera or phone line.",
        },
        {
          title: "A private space",
          body: "A quiet, private space for your consultation.",
        },
        {
          title: "A few minutes",
          body: "A few minutes to complete the free pre-screening quiz.",
        },
      ],
    },
    {
      kind: "statement",
      eyebrow: "Safety",
      heading: "When telehealth is not the right option",
      paragraphs: [
        "Telehealth suits many everyday needs. Some situations need an in-person examination or emergency care, and your practitioner will tell you clearly when that applies. If this is a medical emergency, call 000. If you are in crisis, call Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636.",
      ],
    },
    {
      kind: "related",
      eyebrow: "Where to next",
      heading: "Explore your options",
      cards: [
        {
          title: "Free pre-screening quiz",
          body: "Two minutes, no diagnosis, no commitment.",
          links: [{ label: "Start the free quiz", href: "/quiz/" }],
        },
        {
          title: "Pricing",
          body: "Every consultation fee, shown before you book.",
          links: [{ label: "See full pricing", href: "/pricing/" }],
        },
        {
          title: "Transfer your care",
          body: "Moving across from another provider.",
          links: [{ label: "Transfer your care", href: "/discharge/" }],
        },
      ],
      footnote: "Still deciding? Read the",
      footnoteLinks: [
        { label: "FAQs", href: "/faqs/" },
        { label: "pricing", href: "/pricing/" },
      ],
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "referral",
        question: "Do I need a referral to book?",
        answer:
          "No. You can start straight away with the free pre-screening quiz.",
      },
      {
        id: "not-suitable",
        question: "What happens if I am not suitable for telehealth?",
        answer:
          "Your practitioner will explain the right pathway for you, whether that is in-person care, a referral, or a different service.",
      },
      {
        id: "duration",
        question: "How long does a consultation take?",
        answer:
          "It depends on your needs. Your practitioner gives your situation the time it requires.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
