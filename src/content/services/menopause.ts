/**
 * PAGE 11: MENOPAUSE TREATMENT.
 *
 * Module 5 is prose in the source, not a checklist, so it takes the dark band.
 * Module 6 is prose too, so it takes the second split row rather than step
 * cards: there are no discrete steps in the copy to number.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { STANDARD_CLOSING, STANDARD_FOOTNOTE, STANDARD_FOOTNOTE_LINKS, howToBegin, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const MENOPAUSE: ServicePageData = {
  meta: {
    title: "Menopause Treatment Online | Perimenopause & MHT | Australia",
    description:
      "Menopause and perimenopause treatment assessed online by AHPRA-registered practitioners. Discuss menopausal hormone therapy (MHT) options. Australia-wide.",
    path: "/womens-health/menopause-treatment/",
  },
  hero: {
    eyebrow: "Menopause treatment",
    heading: "Menopause treatment, assessed online by practitioners who listen",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Women's Health", href: "/womens-health/" },
  ],
  intro:
    "Menopause treatment should begin with someone actually hearing what you are going through. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses your symptoms, explains what is happening, and discusses options, including menopausal hormone therapy where it is appropriate for you. Menopause and perimenopause can affect sleep, mood, temperature, energy, memory and much more, and you do not have to simply endure it.",
  modules: [
    {
      kind: "split",
      tinted: true,
      eyebrow: "Perimenopause vs menopause",
      heading: "Perimenopause and menopause, explained",
      paragraphs: [
        "Perimenopause is the transition that can start years before periods stop, when hormone levels fluctuate and symptoms often begin. Menopause is confirmed once you have gone twelve months without a period. The symptoms overlap, and many women are surprised to learn that the difficult years are often the perimenopausal ones. Knowing which stage you are in shapes what support makes sense, which is part of what your practitioner works out with you.",
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
      image: sectionImage("menopause-perimenopause-explained"),
      imageAlt:
        "A woman stands in a garden in morning light, holding a mug.",
    },
    {
      kind: "statement",
      eyebrow: "Symptoms",
      heading: "Symptoms worth raising",
      paragraphs: [
        "Hot flushes and night sweats are the well-known ones, and there are many more: disrupted sleep, mood changes, anxiety, brain fog, joint aches, low libido, vaginal dryness, and changes to your cycle. Any of these is worth raising. Symptoms that are dismissed as stress or ageing are frequently hormonal, and they respond to the right support.",
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "How treatment is assessed",
      heading: "How your practitioner approaches it",
      paragraphs: [
        "Your practitioner discusses your symptoms and history, considers your personal and family health, and where useful arranges tests. They explain the range of options, from lifestyle and non-hormonal approaches to menopausal hormone therapy, and help you weigh what suits you. The goal is a plan that fits your body, your history and your preferences, reviewed over time.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: sectionImage("menopause-how-treatment-is-assessed"),
      imageAlt:
        "A practitioner and a patient sit across a table, discussing options together.",
      imageSide: "left",
    },
    {
      kind: "related",
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Women's health",
          body: "The wider women's health range.",
          links: [{ label: "Women's health", href: "/womens-health/" }],
        },
        {
          title: "PCOS management",
          body: "Symptom management and ongoing support for polycystic ovary syndrome.",
          links: [
            {
              label: "PCOS management",
              href: "/womens-health/pcos-management/",
            },
          ],
        },
        {
          title: "Contraception and sexual health",
          body: "Advice and eligible prescriptions, handled privately.",
          links: [
            {
              label: "Contraception & sexual health",
              href: "/womens-health/contraception/",
            },
          ],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "inlineCta",
      ...howToBegin(
        "Begin with the free pre-screening quiz, then book a consultation at a time that suits you. Fees are on our ",
      ),
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "telehealth",
        question: "Can menopause be treated through telehealth?",
        answer:
          "Yes. Assessment, discussion of options, and menopausal hormone therapy where appropriate can all be handled through telehealth, with tests arranged as needed.",
      },
      {
        id: "mht",
        question: "Is menopausal hormone therapy right for me?",
        answer:
          "That depends on your symptoms, your health history and your preferences. Your practitioner will discuss the benefits and risks for you specifically. It is not one-size-fits-all.",
      },
      {
        id: "blood-test",
        question: "Do I need a blood test to diagnose menopause?",
        answer:
          "Often menopause is diagnosed from your symptoms and cycle history rather than a blood test, though tests are sometimes useful. Your practitioner will advise.",
      },
      {
        id: "cost",
        question: "What does it cost?",
        answer:
          "The pre-screening quiz is free and consultations start from $59. Any tests or medication may involve separate costs.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
