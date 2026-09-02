/**
 * PAGE 14: MEDICINAL CANNABIS — COMPLIANCE-GATED.
 *
 * ⚠️ DO NOT PUBLISH OR INDEX WITHOUT EXPRESS WRITTEN APPROVAL from Ranjeeta
 * Roshan and a compliance reviewer. The page advertises a service connected to
 * prescription-only and largely unregistered therapeutic goods, inside the most
 * heavily enforced area of Australian health advertising: Therapeutic Goods Act
 * 1989 ss.42DL and 42DLB, the Therapeutic Goods Advertising Code, AHPRA's
 * medicinal cannabis guidance of 9 July 2025, and National Law s.133.
 *
 * The route is gated in `routes.ts`, which keeps it out of the navigation, the
 * footer, the sitemap and the homepage's focus grid, and the page sets
 * `noindex` on top of that.
 *
 * The copy is the document's, written to the safe side of the line. Every edit
 * must keep it there: no product or brand names, no strains, no THC or CBD
 * promotion, no therapeutic-outcome or symptom-relief claims, no "number of
 * conditions" breadth claims, no testimonials.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import {
  IMAGE,
  IMAGE_ALT,
  STANDARD_FOOTNOTE,
  STANDARD_FOOTNOTE_LINKS,
} from "./shared";

export const MEDICINAL_CANNABIS: ServicePageData = {
  meta: {
    title: "Medicinal Cannabis Prescription | Eligibility Check",
    description:
      "See if you may be eligible for a medicinal cannabis prescription. Assessed by AHPRA-registered practitioners under TGA pathways, Australia-wide.",
    path: "/medicinal-cannabis/",
  },
  hero: {
    eyebrow: "Medicinal cannabis",
    heading:
      "Medicinal cannabis prescription: eligibility assessed by registered practitioners",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: { label: "Book a consultation", href: "/quiz/" },
  },
  crumbs: [{ label: "Home", href: "/" }],
  intro:
    "A medicinal cannabis prescription in Australia is a clinical decision, made by a registered practitioner, for patients who meet specific criteria after a proper assessment. At Horizon Health Care Partners, an AHPRA-registered practitioner reviews your history and current situation to determine whether medicinal cannabis is a clinically appropriate option for you, and if so, which lawful access pathway applies. This page explains how eligibility is assessed and what the process involves. It is general information, and it is not an advertisement for any product.",
  modules: [
    {
      kind: "statement",
      eyebrow: "How access works in Australia",
      heading: "How medicinal cannabis is accessed in Australia",
      paragraphs: [
        "Most medicinal cannabis products are not on the Australian Register of Therapeutic Goods, which means they are accessed through pathways the Therapeutic Goods Administration sets for unapproved medicines. In practice, an appropriately authorised doctor assesses the patient and, where clinically justified, applies through the Special Access Scheme or as an Authorised Prescriber. There is a legal framework behind every prescription, and a registered practitioner is at the centre of it. Nobody is simply handed a product. The assessment is the point.",
      ],
    },
    {
      kind: "steps",
      eyebrow: "How eligibility is assessed",
      heading: "How your eligibility is assessed",
      steps: [
        {
          pill: "Your history",
          title: "Your history",
          description:
            "They review your relevant medical history and the treatments you have already tried.",
        },
        {
          pill: "Clinical judgement",
          title: "Clinical judgement",
          description:
            "They consider whether medicinal cannabis is a reasonable option for your circumstances, and whether it is safe alongside your other medications and conditions.",
        },
        {
          pill: "A real consultation",
          title: "A real consultation",
          description:
            "Assessment happens in a real-time consultation, not through a questionnaire. A quiz can help decide whether a consultation is worthwhile, and it never determines the clinical outcome.",
        },
        {
          pill: "An honest answer",
          title: "An honest answer",
          description:
            "If you are not a suitable candidate, your practitioner tells you, and points you toward more appropriate care.",
        },
      ],
      cta: { label: "Check your eligibility", href: "/quiz/" },
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "A considered, safety-led approach",
      heading: "A considered approach, start to finish",
      paragraphs: [
        "Good prescribing includes planning for the whole course of treatment, not just the first script. Your practitioner discusses expected review points, how progress will be monitored, and the circumstances in which treatment would be changed or stopped. This kind of exit and review planning is part of responsible care, and it is built into how we work.",
      ],
      image: IMAGE.approach,
      imageAlt: IMAGE_ALT.approach,
    },
    {
      kind: "related",
      eyebrow: "Transparency",
      heading: "Transparency about how we operate",
      cards: [
        {
          title: "Conflict of interest and pharmacy disclosure",
          body: "Our disclosures, including any relationship between the clinic and the pharmacies that dispense medicines, so you can make an informed choice.",
          links: [
            {
              label: "Read our disclosure",
              href: "/conflict-of-interest-disclosure/",
            },
          ],
        },
        {
          title: "Patient safety and emergencies",
          body: "If telehealth is not the right setting for your needs, or a different treatment path is more appropriate, your practitioner will say so.",
          links: [{ label: "Patient safety", href: "/patient-safety/" }],
        },
        {
          title: "Mental health support",
          body: "Patients exploring this option often have questions about related care.",
          links: [
            {
              label: "Mental health support",
              href: "/online-doctor/mental-health/",
            },
          ],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "pricingCue",
      eyebrow: "What it costs",
      heading: "What it costs",
      headline: "Free",
      headlineLabel: "Pre-screening quiz",
      rows: [
        {
          label: "Eligibility consultation",
          value: "Standard consultation fee",
        },
      ],
      note: "Eligibility consultations are charged at the standard consultation fee, shown on our pricing page. Any medicine dispensed by a pharmacy is a separate cost, and you are free to choose your pharmacy.",
      cta: { label: "See full pricing", href: "/pricing/" },
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "eligible",
        question:
          "How do I know if I am eligible for a medicinal cannabis prescription?",
        answer:
          "Eligibility is decided by a registered practitioner after assessing your history and circumstances against the relevant clinical criteria. The free pre-screening quiz is a first step to see whether a consultation is worthwhile. It is not a diagnosis and it does not determine the outcome.",
      },
      {
        id: "legal",
        question: "Is medicinal cannabis legal in Australia?",
        answer:
          "Access is lawful when it is prescribed by an appropriately authorised doctor through the pathways the Therapeutic Goods Administration sets for these medicines. Your practitioner manages that process.",
      },
      {
        id: "guaranteed",
        question: "Will I definitely receive a prescription?",
        answer:
          "No. A prescription is only ever provided where it is clinically appropriate and safe, after a real consultation. Many enquiries do not lead to a prescription, and that is a sign the assessment is doing its job.",
      },
      {
        id: "products",
        question: "Do you provide information about specific products?",
        answer:
          "This page does not. Any discussion of specific treatment happens privately within your consultation, with your practitioner, based on your individual assessment.",
      },
      {
        id: "cost",
        question: "What does the consultation cost?",
        answer:
          "The pre-screening quiz is free. Consultation fees are shown on our pricing page. Any medicine dispensed by a pharmacy is a separate cost.",
      },
    ],
  },
  closing: {
    heading: "Find out where you stand",
    body: "The free pre-screening quiz is the simplest way to see whether a consultation is worthwhile. It takes about two minutes, it is not a diagnosis, and there is no obligation.",
    primary: { label: "Start the free quiz", href: "/quiz/" },
  },
};
