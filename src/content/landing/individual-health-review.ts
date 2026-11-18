/**
 * LANDING PAGE B — individual health review.
 *
 * Section 4 of "New HHCPA landing pages and ads.md". Destination for creatives
 * B1 and B2.
 *
 * ⚠️ BUILT, NOT CLEARED. The source document holds this page back twice, and
 * both conditions are outstanding:
 *
 *   "This page should only be used if Horizon genuinely provides a standalone,
 *    clinically appropriate individual health-review service that can lawfully
 *    be promoted. It must not function as a disguised advertisement for
 *    prescription-only peptide or CBD treatments."
 *
 *   "This page should not be launched until the clinic confirms that the
 *    described service exists independently of restricted medicine promotion
 *    and its advertising adviser approves the entire journey."
 *
 * Nobody has confirmed the service exists. Its own deployment table says
 * "Hold for specific service review", and creatives B1 and B2 "Hold for
 * approval".
 *
 * It is built so it is ready the day those answers arrive, and it is noindex
 * like its siblings, so building it changes nothing in public. Do not point an
 * advertisement at this URL until Ranjeeta has confirmed the service in
 * writing — a page describing a service that is not offered is a false or
 * misleading representation under the AHPRA advertising provisions, and the
 * "individual health review" framing is the exact shape a regulator reads as a
 * front for a restricted medicine.
 *
 * Copy is the document's, unchanged. See ./shared.ts.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import {
  ASSESSMENT_CTA,
  SECONDARY_CTA,
  landingImage,
} from "./shared";

export const LANDING_REVIEW: ServicePageData = {
  meta: {
    title: "Your health deserves an individual approach | Horizon Health Care Partners",
    description:
      "Practitioner-led consultation services with Horizon Health Care Partners. Start with a free pre-screening assessment and understand your next steps.",
    path: "/individual-health-review/",
  },
  hero: {
    eyebrow: "Horizon Health Care Partners",
    heading: "Your health deserves an individual approach.",
    subheading: "Start with understanding your circumstances.",
    media: {
      src: "/videos/lp-review-hero.webm",
      poster: "/images/lp-review-hero-poster.webp",
      /* White room, bright at the top of the frame. See `hhcp-sv-scrim-strong`. */
      scrim: "strong" as const,
      alt: "A woman at a laptop in a soft pink room, mid-conversation with someone off screen.",
    },
    primary: ASSESSMENT_CTA,
    secondary: SECONDARY_CTA,
  },
  crumbs: [],
  intro: [
    "Healthcare decisions should consider the individual, not just a general checklist.",
    "Horizon Health Care Partners offers practitioner-led consultation services designed to provide an opportunity to discuss your health history, circumstances and relevant healthcare questions.",
    "Begin with a free pre-screening assessment.",
  ],
  modules: [
    {
      kind: "split",
      tinted: true,
      eyebrow: "The principle",
      heading: "Because healthcare isn't one-size-fits-all.",
      paragraphs: [
        "Every individual has different circumstances, priorities and healthcare needs.",
        "A considered consultation provides an opportunity to discuss relevant information with an appropriately qualified practitioner.",
        "Rather than making assumptions, the focus is on understanding your circumstances and identifying appropriate next steps.",
      ],
      image: landingImage("lp-review-approach"),
      imageAlt:
        "A man in headphones listens, chin resting on his hand, at a laptop in a bright room.",
      imageSide: "right",
    },
    {
      kind: "tiles",
      eyebrow: "What it involves",
      heading: "An individual approach, from the beginning.",
      columns: 2,
      tiles: [
        {
          title: "Understand your circumstances",
          body: "Start by providing the relevant information requested through the initial pre-screening process.",
        },
        {
          title: "Discuss relevant health information",
          body: "Where appropriate, your practitioner may review your health history, existing information and relevant investigations.",
        },
        {
          title: "Explore appropriate options",
          body: "Your practitioner will discuss suitable consultation and care options based on individual clinical judgement.",
        },
        {
          title: "Understand your next steps",
          body: "Receive information about any further assessment, consultation or follow-up requirements.",
        },
      ],
    },
    {
      kind: "steps",
      tinted: true,
      eyebrow: "The process",
      heading: "A straightforward way to begin.",
      steps: [
        {
          pill: "01",
          title: "Complete the initial assessment",
          description:
            "Provide the information requested through our free pre-screening process.",
        },
        {
          pill: "02",
          title: "Review your consultation options",
          description: "Understand the next steps and any applicable requirements.",
        },
        {
          pill: "03",
          title: "Speak with a practitioner",
          description:
            "Where appropriate, arrange a consultation with an appropriately registered practitioner.",
        },
        {
          pill: "04",
          title: "Discuss your individual circumstances",
          description:
            "Receive professional guidance based on your individual clinical assessment.",
        },
      ],
      cta: ASSESSMENT_CTA,
    },
    {
      kind: "split",
      eyebrow: "Our approach",
      heading: "A considered approach to healthcare.",
      paragraphs: [
        "At Horizon, the starting point is understanding your circumstances.",
        "Our aim is to make accessing appropriate practitioner-led consultations more straightforward, with clear information about the process and what comes next.",
      ],
      cta: ASSESSMENT_CTA,
      image: landingImage("lp-review-considered"),
      imageAlt:
        "A close view of a hand writing notes in a spiral notebook on a wooden table.",
      imageSide: "left",
    },
  ],
  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        id: "what-is-it",
        question: "What is an individual health review?",
        answer:
          "It is a consultation pathway in which relevant health information and individual circumstances may be discussed with an appropriately qualified practitioner.",
      },
      {
        id: "existing-records",
        question: "Do I need existing health records?",
        answer:
          "This depends on the consultation and your circumstances. Any relevant information or investigations required will be explained.",
      },
      {
        id: "assessment-free",
        question: "Is the initial assessment free?",
        answer:
          "Yes. The initial pre-screening assessment is free. Applicable consultation fees are communicated separately.",
      },
      {
        id: "no-eligibility-guarantee",
        question: "Does the assessment guarantee eligibility for a service?",
        answer:
          "No. Clinical suitability and any subsequent recommendations are determined independently by the practitioner.",
      },
      {
        id: "must-proceed",
        question: "Do I have to proceed after the assessment?",
        answer:
          "No. You can review the next steps before deciding whether to arrange a consultation.",
      },
    ],
  },
  closing: {
    heading: "Start with a better understanding of your healthcare options.",
    body: "The initial assessment does not constitute a diagnosis, treatment recommendation or guarantee of a particular clinical outcome.",
    primary: ASSESSMENT_CTA,
  },
};
