/**
 * PAGE 8: PREMATURE EJACULATION TREATMENT.
 *
 * Two split rows with the image on opposite sides, a dark band between them.
 * Modules 4 and 7 are both prose in the source; alternating the image side is
 * what keeps them from reading as the same block twice.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import {
  IMAGE,
  IMAGE_ALT,
  STANDARD_CLOSING,
  STANDARD_FOOTNOTE,
  STANDARD_FOOTNOTE_LINKS,
  howToBegin,
} from "./shared";
import { CALL_CTA } from "../clinic";

export const PREMATURE_EJACULATION: ServicePageData = {
  meta: {
    title: "Premature Ejaculation Treatment Online | Australia | HHCPA",
    description:
      "Discreet online consultations for premature ejaculation with AHPRA-registered practitioners. Australia-wide telehealth. Free pre-screening quiz.",
    path: "/mens-health/premature-ejaculation-treatment/",
  },
  hero: {
    eyebrow: "Premature ejaculation",
    heading: "Premature ejaculation treatment, assessed discreetly online",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Men's Health", href: "/mens-health/" },
  ],
  intro:
    "Premature ejaculation treatment is one of those things men rarely raise face to face, and often carry for years without needing to. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses what is going on and discusses options with you privately. Premature ejaculation is very common, it has recognised management approaches, and a short online consultation is usually all it takes to get moving.",
  modules: [
    {
      kind: "split",
      tinted: true,
      eyebrow: "Understanding it",
      heading: "What premature ejaculation is, and is not",
      paragraphs: [
        "Premature ejaculation means reaching climax sooner than you or your partner would like, often enough to cause frustration or distress. It can be lifelong or something that appears later, and it can be tied to anxiety, sensitivity, relationship stress, or other health factors. It is a medical topic, not a character flaw, and framing it that way is the first step to dealing with it.",
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
      image: IMAGE.mentalWellbeing,
      imageAlt: IMAGE_ALT.mentalWellbeing,
    },
    {
      kind: "statement",
      eyebrow: "How it is managed",
      heading: "How your practitioner approaches it",
      paragraphs: [
        "Your practitioner asks about the pattern and any contributing factors, checks your general health, and talks through management options. These can include behavioural techniques, addressing underlying stress or anxiety, and, where clinically appropriate, medical options. The plan is tailored to you and reviewed as needed.",
      ],
    },
    {
      kind: "related",
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Erectile dysfunction",
          body: "Sometimes premature ejaculation overlaps with erectile concerns.",
          links: [
            {
              label: "Erectile dysfunction",
              href: "/mens-health/erectile-dysfunction-treatment/",
            },
          ],
        },
        {
          title: "Men's health",
          body: "The full range of what we consult on for men.",
          links: [{ label: "Men's health", href: "/mens-health/" }],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "What can contribute",
      heading: "What can contribute to it",
      paragraphs: [
        "Premature ejaculation can have several contributors, and often more than one is involved at once. Anxiety and stress play a large part for many men, particularly performance-related worry that becomes self-reinforcing. Sensitivity, relationship dynamics and general health can all feed in. In some cases it appears alongside erectile difficulty, which is worth assessing together. Understanding the drivers is what makes a management plan work, and that is the first thing your practitioner explores with you.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: IMAGE.painManagement,
      imageAlt: IMAGE_ALT.painManagement,
      imageSide: "left",
    },
    {
      kind: "inlineCta",
      ...howToBegin(
        "Take the free pre-screening quiz, then book a private consultation. Fees are on our ",
      ),
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "treatable",
        question: "Is premature ejaculation treatable?",
        answer:
          "In many cases it is manageable with the right approach. Your practitioner will discuss what suits your situation.",
      },
      {
        id: "discreet",
        question: "Is the consultation discreet?",
        answer:
          "Completely. It is a private, one-to-one telehealth consultation.",
      },
      {
        id: "in-person",
        question: "Do I need to attend in person?",
        answer: "No. The assessment is done online, Australia-wide.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
