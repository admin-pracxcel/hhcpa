/**
 * PAGE 7: TESTOSTERONE REPLACEMENT THERAPY.
 *
 * Module 5 is the one place on these pages where the map's "numbered step
 * cards" and the copy agree: the source really does give four named steps.
 * Module 4 is prose, so it takes the dark band rather than the map's checklist.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { STANDARD_CLOSING, STANDARD_FOOTNOTE, STANDARD_FOOTNOTE_LINKS, howToBegin, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const TESTOSTERONE_REPLACEMENT: ServicePageData = {
  meta: {
    title: "TRT Australia | Low Testosterone Treatment Online | HHCPA",
    description:
      "Low testosterone assessed online. Ask an AHPRA-registered practitioner about testosterone replacement therapy (TRT) in Australia. Pathology where needed.",
    path: "/mens-health/testosterone-replacement-therapy/",
  },
  hero: {
    eyebrow: "Testosterone replacement",
    heading: "TRT in Australia: low testosterone, assessed properly online",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Men's Health", href: "/mens-health/" },
  ],
  intro:
    "TRT in Australia is a genuine medical treatment, and it deserves a genuine medical assessment. At Horizon Health Care Partners, an AHPRA-registered practitioner reviews your symptoms, arranges the right blood tests, and discusses whether testosterone replacement therapy is appropriate for you. Low testosterone is often missed and sometimes over-treated. A careful, evidence-led approach protects you from both.",
  modules: [
    {
      kind: "statement",
      eyebrow: "Symptoms of low testosterone",
      heading: "Signs worth getting checked",
      paragraphs: [
        "Low testosterone can show up as persistent tiredness, low mood, poor concentration, reduced sex drive, difficulty building or keeping muscle, slow recovery, and low motivation. These symptoms are non-specific, which is the problem. They overlap with sleep issues, stress, thyroid problems and depression. A blood test is the only way to know whether testosterone is actually low, and a single result is rarely enough on its own.",
      ],
    },
    {
      kind: "steps",
      eyebrow: "How TRT is assessed",
      heading: "How assessment works, step by step",
      steps: [
        {
          pill: "Symptom review",
          title: "Symptom review",
          description:
            "Your practitioner discusses what you are experiencing and how long it has been going on.",
        },
        {
          pill: "Pathology",
          title: "Pathology",
          description:
            "They arrange the appropriate blood tests, usually including morning testosterone and related markers, and often repeated for accuracy.",
        },
        {
          pill: "Interpretation",
          title: "Interpretation",
          description:
            "Results are reviewed in the context of your symptoms and overall health, not in isolation.",
        },
        {
          pill: "A plan",
          title: "A plan",
          description:
            "If testosterone replacement therapy is appropriate, your practitioner explains how it works, the monitoring involved, and the benefits and risks. If it is not, they help you find the real cause of your symptoms.",
        },
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "Monitoring matters",
      heading: "Why monitoring is part of TRT",
      paragraphs: [
        "Testosterone therapy is not something to start and forget. It needs ongoing review to keep it safe and effective, including periodic blood tests and check-ins. Our service builds that monitoring in, so you are supported rather than left to manage it alone.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: sectionImage("testosterone-replacement-monitoring"),
      imageAlt:
        "A man talks with a nurse in a pathology collection centre before a routine blood test.",
      imageSide: "left",
    },
    {
      kind: "related",
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Erectile dysfunction",
          body: "Low testosterone and erectile dysfunction often travel together.",
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
      kind: "inlineCta",
      ...howToBegin(
        "Start with the free pre-screening quiz, then book a consultation, and your practitioner arranges the right blood tests. Fees are on our ",
      ),
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "telehealth",
        question: "Can I get TRT in Australia through telehealth?",
        answer:
          "You can be assessed for it through telehealth, including the blood tests, and where it is clinically appropriate, treatment and monitoring can be arranged. Testosterone is prescription-only and requires proper assessment.",
      },
      {
        id: "blood-test",
        question: "Do I need a blood test?",
        answer:
          "Yes. Testosterone replacement therapy should not be started without appropriate pathology. Your practitioner will arrange it.",
      },
      {
        id: "safe",
        question: "Is TRT safe?",
        answer:
          "For the right patient, with proper monitoring, it is an established treatment. Suitability and safety depend on your individual health, which is why assessment and follow-up are essential.",
      },
      {
        id: "cost",
        question: "What does it cost?",
        answer:
          "The pre-screening quiz is free and consultations start from $59. Pathology and any medication may involve separate costs.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
