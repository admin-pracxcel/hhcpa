/**
 * LANDING PAGE C — online consultation access.
 *
 * Section 5 of "New HHCPA landing pages and ads.md". Second launch candidate,
 * destination for creative C1.
 *
 * ⚠️ THIS PAGE IS WHY THE NOINDEX MATTERS. It covers the same ground as
 * `/online-doctor/`, which is an indexed silo entry with five children beneath
 * it. Let both into the index and they compete for the same queries, and the
 * one with the backlinks and the breadcrumbs loses ground to a page built for
 * paid traffic. The document itself files this page as "subject to destination
 * review" for the same reason.
 *
 * Copy is the document's, unchanged. See ./shared.ts.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import {
  ASSESSMENT_CTA,
  PLACEHOLDER_ALT,
  SECONDARY_CTA,
  landingImage,
} from "./shared";

export const LANDING_ONLINE: ServicePageData = {
  meta: {
    title: "A simpler way to access healthcare online | Horizon Health Care Partners",
    description:
      "Online healthcare consultations across Australia with Horizon Health Care Partners. Start with a free pre-screening assessment from home.",
    path: "/online-consultations/",
  },
  hero: {
    eyebrow: "Horizon Health Care Partners",
    heading: "A simpler way to access healthcare online.",
    subheading:
      "Professional consultations, with a more straightforward starting point.",
    primary: ASSESSMENT_CTA,
    secondary: SECONDARY_CTA,
  },
  crumbs: [],
  intro: [
    "Horizon Health Care Partners provides online healthcare consultation services across Australia.",
    "Explore available services, understand the process and take your first step from home.",
  ],
  modules: [
    {
      kind: "split",
      tinted: true,
      eyebrow: "The idea",
      heading: "Healthcare access, made more straightforward.",
      paragraphs: [
        "Life is busy. Organising healthcare shouldn't need to add unnecessary complexity.",
        "Horizon provides an online starting point for people exploring available consultation services.",
        "Our process is designed to help you understand the next steps before deciding whether to proceed.",
      ],
      image: landingImage("lp-online-expect"),
      imageAlt: PLACEHOLDER_ALT,
      imageSide: "right",
    },
    {
      kind: "tiles",
      eyebrow: "What you can expect",
      heading: "What you can expect",
      columns: 2,
      tiles: [
        {
          title: "Convenient access",
          body: "Explore available online consultations from home, subject to clinical suitability.",
        },
        {
          title: "Clear information",
          body: "Understand the consultation process and applicable fees.",
        },
        {
          title: "Practitioner involvement",
          body: "Discuss your individual circumstances with an appropriately registered practitioner.",
        },
        {
          title: "A straightforward first step",
          body: "Begin with a free pre-screening assessment.",
        },
      ],
    },
    {
      kind: "steps",
      tinted: true,
      eyebrow: "The process",
      heading: "How the process works.",
      steps: [
        {
          pill: "01",
          title: "Complete the assessment",
          description: "Start with our free online pre-screening questionnaire.",
        },
        {
          pill: "02",
          title: "Understand the next steps",
          description:
            "Review the available consultation pathway and any relevant requirements.",
        },
        {
          pill: "03",
          title: "Arrange your consultation",
          description: "Where appropriate, select an available appointment.",
        },
        {
          pill: "04",
          title: "Speak with your practitioner",
          description: "Discuss your circumstances and appropriate next steps.",
        },
      ],
      cta: ASSESSMENT_CTA,
    },
    {
      kind: "split",
      eyebrow: "Your time matters",
      heading: "Your time matters.",
      paragraphs: [
        "Accessing healthcare should be straightforward, transparent and centred on individual circumstances.",
        "Horizon Health Care Partners provides an accessible starting point for exploring appropriate online consultation services.",
      ],
      /*
       * The document labels this button "GET STARTED WITH HORIZON" rather than
       * the assessment wording it uses everywhere else. Kept as written: it is
       * the one deliberate variation in the page and reads as a second, softer
       * entry point rather than a repeat of the same button.
       */
      cta: { label: "Get started with Horizon", href: "/quiz/" },
      image: landingImage("lp-online-time"),
      imageAlt: PLACEHOLDER_ALT,
      imageSide: "left",
    },
  ],
  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        id: "on-phone",
        question: "Can I complete the assessment on my phone?",
        answer:
          "Yes. The assessment is designed to be accessible through compatible mobile devices and desktop browsers.",
      },
      {
        id: "assessment-free",
        question: "Is the initial assessment free?",
        answer: "Yes. There is no charge for the initial pre-screening assessment.",
      },
      {
        id: "suitable-for-everyone",
        question: "Are online consultations suitable for everyone?",
        answer:
          "Not necessarily. Telehealth suitability depends on the service, individual circumstances and clinical requirements.",
      },
      {
        id: "book-immediately",
        question: "Can I book immediately?",
        answer:
          "The pre-screening process helps establish the appropriate next steps. Where appropriate, you can proceed to an available consultation.",
      },
      {
        id: "prescription",
        question: "Will I receive a prescription?",
        answer:
          "A prescription is never guaranteed. Any prescribing decision is made independently by an appropriately qualified practitioner following an appropriate clinical assessment.",
      },
      {
        id: "not-suitable",
        question: "What happens if an online consultation isn't suitable?",
        answer:
          "Your practitioner may recommend an alternative form of assessment or care where clinically appropriate.",
      },
    ],
  },
  closing: {
    heading: "Get started with a clearer understanding of your options.",
    body: "Australia-wide telehealth services. The pre-screening assessment is not a substitute for a medical consultation. All clinical decisions are made independently by appropriately qualified practitioners.",
    primary: ASSESSMENT_CTA,
  },
};
