/**
 * LANDING PAGE A — the flagship acquisition page.
 *
 * Section 3 of "New HHCPA landing pages and ads.md". First page the document
 * would build, and the destination for creatives A1, A2 and A3.
 *
 * Copy is that document's "Complete landing-page copy", unchanged. See
 * ./shared.ts for why it must stay unchanged, why the page is noindex, and why
 * its images are placeholders.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import {
  ASSESSMENT_CTA,
  LANDING_FOOTNOTE,
  PLACEHOLDER_ALT,
  SECONDARY_CTA,
  landingImage,
} from "./shared";

export const LANDING_JOURNEY: ServicePageData = {
  meta: {
    title: "A more personal approach to healthcare | Horizon Health Care Partners",
    description:
      "Explore practitioner-led online consultations with Horizon Health Care Partners. Start with a free pre-screening assessment. No obligation to book.",
    path: "/start-your-healthcare-journey/",
  },
  hero: {
    eyebrow: "Horizon Health Care Partners",
    heading: "A more personal approach to healthcare starts here.",
    subheading: "Healthcare that begins with understanding you.",
    primary: ASSESSMENT_CTA,
    secondary: SECONDARY_CTA,
  },
  /*
   * No breadcrumbs. A landing page is entered from an advertisement, not from
   * the site, and a trail back to a hub it does not belong to is an exit.
   */
  crumbs: [],
  intro: [
    "Explore practitioner-led healthcare with Horizon Health Care Partners.",
    "Our online consultation process makes it easier to understand the services available, explore your options and take the next step from wherever you are in Australia.",
    "Start with our free pre-screening assessment. There is no obligation to book. Any subsequent consultation or treatment is subject to individual clinical assessment.",
  ],
  modules: [
    {
      kind: "split",
      tinted: true,
      eyebrow: "Why Horizon",
      heading: "Healthcare should feel straightforward.",
      paragraphs: [
        "Finding the right healthcare pathway can sometimes feel more complicated than it needs to be.",
        "Horizon Health Care Partners offers an accessible way to explore available consultation services and connect with appropriately registered healthcare practitioners.",
        "Our approach starts with understanding your individual circumstances.",
      ],
      image: landingImage("lp-journey-approach"),
      imageAlt: PLACEHOLDER_ALT,
      imageSide: "right",
    },
    {
      kind: "tiles",
      eyebrow: "What to expect",
      heading: "A healthcare experience designed around you.",
      columns: 3,
      tiles: [
        {
          title: "Accessible online consultations",
          body: "Explore available telehealth services without the need to travel to a physical clinic, where online care is clinically appropriate.",
        },
        {
          title: "Practitioner-led care",
          body: "Your circumstances and healthcare needs are considered by appropriately qualified practitioners.",
        },
        {
          title: "A clear starting point",
          body: "Begin with a free pre-screening assessment to understand the next steps.",
        },
        {
          title: "Transparent consultation information",
          body: "Understand applicable consultation fees and requirements before deciding to proceed.",
        },
        {
          title: "An individual approach",
          body: "Clinical decisions are made independently, taking your circumstances and relevant health information into account.",
        },
      ],
    },
    {
      kind: "steps",
      tinted: true,
      eyebrow: "The process",
      heading: "Getting started is simple.",
      steps: [
        {
          pill: "01",
          title: "Begin with your assessment",
          description:
            "Complete our free pre-screening questionnaire. It helps establish the appropriate next steps for your enquiry.",
        },
        {
          pill: "02",
          title: "Understand your options",
          description:
            "Review the information provided about available consultation services and any applicable requirements.",
        },
        {
          pill: "03",
          title: "Arrange a consultation",
          description:
            "Where appropriate, you can proceed to an available appointment with a practitioner.",
        },
        {
          pill: "04",
          title: "Discuss your circumstances",
          description:
            "Your practitioner will assess your individual situation and discuss appropriate next steps.",
        },
      ],
      cta: ASSESSMENT_CTA,
    },
    {
      kind: "checklist",
      eyebrow: "Why start with Horizon?",
      heading: "Why start with Horizon?",
      intro:
        "Healthcare is personal. The right starting point is an opportunity to understand your circumstances, ask questions and receive guidance from an appropriately qualified practitioner. At Horizon, we aim to make that first step more accessible.",
      items: [
        "Online consultation options across Australia.",
        "Appropriately registered healthcare practitioners.",
        "A straightforward initial assessment.",
        "Clear consultation information.",
        "Individual clinical decision-making.",
      ],
      caveat: LANDING_FOOTNOTE,
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "Your first step",
      heading: "Your first step doesn't need to be complicated.",
      paragraphs: [
        "You don't need to have everything figured out before getting started.",
        "Begin with our free pre-screening assessment and understand the next steps available through Horizon Health Care Partners.",
      ],
      cta: ASSESSMENT_CTA,
      image: landingImage("lp-journey-why"),
      imageAlt: PLACEHOLDER_ALT,
      imageSide: "left",
    },
  ],
  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        id: "assessment-free",
        question: "Is the initial assessment free?",
        answer:
          "Yes. Horizon's initial pre-screening assessment is free. Any subsequent consultation or service fees will be explained before you decide to proceed.",
      },
      {
        id: "after-submission",
        question: "What happens after I submit the assessment?",
        answer:
          "Your submission will be reviewed according to the relevant assessment process. Where appropriate, you'll be provided with information about the next steps and consultation requirements.",
      },
      {
        id: "must-book",
        question: "Do I have to book an appointment?",
        answer:
          "No. Completing the initial assessment does not oblige you to book a consultation.",
      },
      {
        id: "australia-wide",
        question: "Are consultations available throughout Australia?",
        answer:
          "Horizon provides telehealth services across Australia, subject to practitioner availability and the suitability of the requested service.",
      },
      {
        id: "video-or-phone",
        question: "Are consultations conducted by video or phone?",
        answer:
          "Available consultation formats depend on the service and clinical requirements.",
      },
      {
        id: "no-guarantee",
        question:
          "Will completing the assessment guarantee a particular treatment or prescription?",
        answer:
          "No. An assessment submission does not guarantee eligibility, a prescription or a particular treatment. All clinical decisions are made independently by an appropriately qualified practitioner.",
      },
      {
        id: "cost",
        question: "How much does a consultation cost?",
        answer:
          "Fees depend on the consultation service. Applicable costs will be communicated before you proceed.",
      },
      {
        id: "privacy",
        question: "How is my information handled?",
        answer:
          "Your information is handled in accordance with Horizon's privacy policy and applicable Australian privacy requirements.",
      },
    ],
  },
  closing: {
    heading: "Start with a better understanding of your options.",
    body: "A straightforward first step towards accessing appropriate healthcare. Australia-wide telehealth services.",
    primary: ASSESSMENT_CTA,
  },
};
