/**
 * PAGE 7: LOW TESTOSTERONE.
 *
 * Reframed from the therapy to the condition by
 * HHCPA_Remediation_Change_Spec.md §B9, and moved off
 * `/mens-health/testosterone-replacement-therapy/` with a 301. Naming the
 * therapy — "TRT", "testosterone replacement therapy", or testosterone itself
 * as the medicine — advertises a prescription medicine to the public. Naming the
 * condition does not, so the symptoms, the pathology, the interpretation and the
 * monitoring all stay; only the medicine's name goes.
 *
 * The spec lists the title, meta, H1, intro, the "A plan" step and the
 * monitoring section. The FAQ carried four more instances that the spec's
 * page-source scan did not reach, because FaqSection renders them client-side
 * and re-emits them as FAQPage schema; §F1 is the governing gate, so they are
 * reframed here on the same principle.
 *
 * Module 5 is the one place on these pages where the map's "numbered step
 * cards" and the copy agree: the source really does give four named steps.
 * Module 4 is prose, so it takes the dark band rather than the map's checklist.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { STANDARD_CLOSING, STANDARD_FOOTNOTE, STANDARD_FOOTNOTE_LINKS, howToBegin, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const LOW_TESTOSTERONE: ServicePageData = {
  meta: {
    title: "Low Testosterone, Assessed Online | Australia | HHCPA",
    description:
      "Low testosterone assessed online by AHPRA-registered practitioners. Symptom review and pathology where needed. Australia-wide telehealth.",
    path: "/mens-health/low-testosterone/",
  },
  hero: {
    eyebrow: "Low testosterone",
    heading: "Low testosterone, assessed properly online",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Men's Health", href: "/mens-health/" },
  ],
  intro:
    "Low testosterone is a genuine medical issue, and it deserves a genuine medical assessment. At Horizon Health Care Partners, an AHPRA-registered practitioner reviews your symptoms, arranges the right blood tests, and discusses whether treatment is appropriate for you. Low testosterone is often missed and sometimes over-treated. A careful, evidence-led approach protects you from both.",
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
      eyebrow: "How low testosterone is assessed",
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
            "If treatment is appropriate, your practitioner explains how it works, the monitoring involved, and the benefits and risks. If it is not, they help you find the real cause of your symptoms.",
        },
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "Ongoing review",
      heading: "Why monitoring matters",
      paragraphs: [
        "Treatment for low testosterone is not something to start and forget. It needs ongoing review to keep it safe and effective, including periodic blood tests and check-ins. Our service builds that monitoring in, so you are supported rather than left to manage it alone.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: sectionImage("low-testosterone-monitoring"),
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
              href: "/mens-health/erectile-dysfunction/",
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
        question: "Can low testosterone be assessed through telehealth?",
        answer:
          "Yes, including the blood tests, and where it is clinically appropriate, treatment and monitoring can be arranged. Any treatment is prescription-only and requires proper assessment.",
      },
      {
        id: "blood-test",
        question: "Do I need a blood test?",
        answer:
          "Yes. Treatment for low testosterone should not be started without appropriate pathology. Your practitioner will arrange it.",
      },
      {
        id: "safe",
        question: "Is treatment for low testosterone safe?",
        answer:
          "For the right patient, with proper monitoring, it is well established. Suitability and safety depend on your individual health, which is why assessment and follow-up are essential.",
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
