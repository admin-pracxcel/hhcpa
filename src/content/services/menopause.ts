/**
 * PAGE 11: MENOPAUSE & PERIMENOPAUSE.
 *
 * Reframed from the therapy to the condition by
 * HHCPA_Remediation_Change_Spec.md §B13, and moved off
 * `/womens-health/menopause-treatment/` with a 301. Menopausal hormone therapy
 * is an S4 therapy, so naming it — as "MHT", as "menopausal hormone therapy", or
 * as the thing on offer — advertises a prescription medicine to the public. The
 * symptoms, the assessment and the "not one-size-fits-all" honesty all stay; the
 * therapy is now "options your practitioner discusses with you", which is what it
 * actually is.
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
    title: "Menopause & Perimenopause, Assessed Online | Australia",
    description:
      "Menopause and perimenopause assessed online by AHPRA-registered practitioners. Symptom review and options discussed in your consultation. Australia-wide.",
    path: "/womens-health/menopause/",
  },
  hero: {
    eyebrow: "Menopause & perimenopause",
    heading: "Menopause and perimenopause, assessed online by practitioners who listen",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Women's Health", href: "/womens-health/" },
  ],
  intro:
    "Menopause care should begin with someone actually hearing what you are going through. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses your symptoms, explains what is happening, and discusses the options your practitioner considers appropriate for you. Menopause and perimenopause can affect sleep, mood, temperature, energy, memory and much more, and you do not have to simply endure it.",
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
        "Your practitioner discusses your symptoms and history, considers your personal and family health, and where useful arranges tests. They explain the range of options open to you, from lifestyle approaches through to prescribed treatment where it is clinically appropriate, and help you weigh what suits you. The goal is a plan that fits your body, your history and your preferences, reviewed over time.",
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
        question: "Can menopause be assessed through telehealth?",
        answer:
          "Yes. Assessment, discussion of your options and any prescribing that is clinically appropriate can all be handled through telehealth, with tests arranged as needed.",
      },
      {
        id: "options",
        question: "What treatment options are there?",
        answer:
          "That depends on your symptoms, your health history and your preferences. Your practitioner discusses the options open to you and the benefits and risks of each for you specifically. It is not one-size-fits-all, and we do not name or promote specific medicines here.",
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
