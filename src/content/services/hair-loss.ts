/**
 * PAGE 9: HAIR LOSS TREATMENT.
 *
 * Modules 4 and 7 are both prose about the same subject from different angles,
 * so one takes the dark band and the other a split row. The map asks for tiles
 * at 4 and an icon list at 7; neither passage is a list.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { STANDARD_CLOSING, STANDARD_FOOTNOTE, STANDARD_FOOTNOTE_LINKS, howToBegin, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const HAIR_LOSS: ServicePageData = {
  meta: {
    title: "Hair Loss Treatment for Men | Online | Australia",
    description:
      "Talk to an AHPRA-registered practitioner about male hair loss treatment options online. Australia-wide telehealth. Free pre-screening.",
    path: "/mens-health/hair-loss-treatment/",
  },
  hero: {
    eyebrow: "Hair loss treatment",
    heading: "Hair loss treatment for men, assessed online",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Men's Health", href: "/mens-health/" },
  ],
  intro:
    "Hair loss treatment for men works best when it starts early, and starting is easier when you can do it from your phone. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses the pattern of your hair loss and discusses evidence-based options with you. Male pattern hair loss is progressive, which means the sooner it is assessed, the more options tend to be on the table.",
  modules: [
    {
      kind: "statement",
      eyebrow: "Why timing matters",
      heading: "Why early assessment helps",
      paragraphs: [
        "Most male hair loss follows a familiar pattern driven by genetics and hormones. Because it advances gradually, the hair you still have is easier to keep than the hair you have already lost is to regain. That is the practical case for getting it assessed sooner rather than waiting. A practitioner can confirm what type of hair loss you have and set realistic expectations about what different options can and cannot do.",
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "How it works",
      heading: "How your consultation works",
      paragraphs: [
        "Take the free pre-screening quiz, book a consultation, and speak with a practitioner who reviews your hair loss, your health and your goals. Where treatment is appropriate, they explain the options honestly, including how long they take to show effect and what maintenance involves.",
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
      image: sectionImage("hair-loss-how-it-works"),
      imageAlt:
        "A man at a home desk speaks with a practitioner during a video consultation.",
    },
    {
      kind: "related",
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Men's health",
          body: "Explore the full men's health range.",
          links: [{ label: "Men's health", href: "/mens-health/" }],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "What causes male hair loss",
      heading: "What is behind male hair loss",
      paragraphs: [
        "Most male hair loss is driven by a mix of genetics and hormones, and it follows a recognisable pattern that tends to progress over time. Age, family history and individual sensitivity all shape how quickly it happens. Less commonly, hair loss can point to another health factor worth checking, which is one reason a practitioner assessment helps before starting anything. Your practitioner confirms the type of hair loss you have and sets realistic expectations about what each option can do.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: sectionImage("hair-loss-what-causes-it"),
      imageAlt:
        "A father and his adult son stand talking in a backyard in afternoon light.",
      imageSide: "left",
    },
    {
      kind: "inlineCta",
      ...howToBegin(
        "Begin with the free pre-screening quiz, then book a consultation. See fees on our ",
      ),
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "online",
        question: "Can hair loss be treated online?",
        answer:
          "It can be assessed online, and where appropriate, treatment can be arranged. Your practitioner will explain what is realistic for your situation.",
      },
      {
        id: "work",
        question: "Do treatments work?",
        answer:
          "Evidence-based options can slow hair loss and, in some cases, improve it, but results vary and take time. Your practitioner will be honest about expectations.",
      },
      {
        id: "when",
        question: "When should I start?",
        answer:
          "Earlier is generally better, because keeping existing hair is more achievable than regrowing lost hair.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
