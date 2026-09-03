/**
 * PAGE 6: ERECTILE DYSFUNCTION TREATMENT.
 *
 * Modules 4 and 5 are both continuous prose in the source, so one takes the
 * image and the other the dark band rather than repeating a layout. Module 6
 * is four labelled points, which is what the tiles are for.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { IMAGE, IMAGE_ALT, STANDARD_CLOSING, STANDARD_FOOTNOTE, STANDARD_FOOTNOTE_LINKS, howToBegin, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const ERECTILE_DYSFUNCTION: ServicePageData = {
  meta: {
    title: "Erectile Dysfunction Treatment Online | Australia",
    description:
      "Erectile dysfunction treatment assessed online by AHPRA-registered practitioners. Private, judgement-free consultations Australia-wide. Free pre-screening.",
    path: "/mens-health/erectile-dysfunction-treatment/",
  },
  hero: {
    eyebrow: "Erectile dysfunction",
    heading: "Erectile dysfunction treatment, assessed privately online",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Men's Health", href: "/mens-health/" },
  ],
  intro:
    "Erectile dysfunction treatment starts with a conversation you can have from home. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses what might be behind the problem and, where it is clinically appropriate, discusses treatment options with you in private. Erectile dysfunction is common, it becomes more common with age, and it is often very treatable. It can also be an early signal of something worth checking, which is exactly why a proper assessment beats guessing.",
  modules: [
    {
      kind: "split",
      tinted: true,
      eyebrow: "What causes ED",
      heading: "Understanding what is going on",
      paragraphs: [
        "Erections depend on blood flow, nerves, hormones and mood all working together, so erectile dysfunction can have physical causes, psychological causes, or both. Common contributors include stress, tiredness, alcohol, relationship pressure, blood pressure and cholesterol issues, diabetes, low testosterone, and some medications. Because ED can sit alongside heart and metabolic health, a practitioner does not just reach for a script. They look at the bigger picture, which is better for your health overall.",
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
      image: sectionImage("erectile-dysfunction-what-causes-it"),
      imageAlt:
        "A man sits on the arm of a sofa in afternoon light, looking out in thought.",
    },
    {
      kind: "statement",
      eyebrow: "How treatment is assessed",
      heading: "How your practitioner approaches it",
      paragraphs: [
        "Your practitioner reviews your history, your general health and any medications you take, and asks about the pattern of symptoms. Where useful, they arrange simple tests. If treatment is appropriate, they explain the options, how they are used, and what to be aware of. If something else is driving the problem, they help you deal with that too. You leave the consultation with a clear plan rather than a vague suggestion.",
      ],
    },
    {
      kind: "tiles",
      eyebrow: "What to expect",
      heading: "What to expect",
      columns: 2,
      tiles: [
        {
          title: "A discreet consultation",
          body: "A judgement-free consultation with a registered practitioner.",
        },
        {
          title: "An honest assessment",
          body: "An honest assessment of causes, not just symptoms.",
        },
        {
          title: "Options explained clearly",
          body: "Treatment options explained clearly, where clinically appropriate.",
        },
        {
          title: "Follow-up",
          body: "Follow-up so the plan can be adjusted.",
        },
      ],
    },
    {
      kind: "related",
      tinted: true,
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Testosterone replacement therapy",
          body: "Low energy and low libido can overlap with hormones.",
          links: [
            {
              label: "Testosterone replacement",
              href: "/mens-health/testosterone-replacement-therapy/",
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
      kind: "inlineCta",
      ...howToBegin(
        "The first step is the free pre-screening quiz, followed by a private consultation at a time that suits you. See fees on our ",
      ),
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "online",
        question: "Can I get erectile dysfunction treatment online?",
        answer:
          "You can be assessed online, and where it is clinically appropriate, treatment can be arranged. Prescriptions follow a real consultation, not a form.",
      },
      {
        id: "embarrassing",
        question: "Is ED treatment embarrassing to ask about?",
        answer:
          "It is one of the most common reasons men book with us. Your practitioner has these conversations constantly, and the telehealth format makes it easier to raise.",
      },
      {
        id: "serious",
        question: "Could ED be a sign of something serious?",
        answer:
          "It can be linked to blood pressure, cholesterol, diabetes and hormones, which is why a proper assessment is worthwhile. Your practitioner will check for the things that matter.",
      },
      {
        id: "cost",
        question: "What will it cost?",
        answer:
          "The pre-screening quiz is free and consultations start from $59. Any medication from a pharmacy is separate.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
