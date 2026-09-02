/**
 * PAGE 22: PRICING — the canonical price list.
 *
 * Every figure is a `PriceKey`, never a literal. Nineteen service pages quote
 * prices in their pricing cues and FAQ answers, and all of them read the same
 * record, so this table and those pages cannot disagree.
 *
 * The source's two tables are reproduced as two tables. The module map asks for
 * "text block with supporting image" three times here, which does not fit a
 * price list: the copy is tabular, and a table is what a reader scanning for a
 * number needs.
 *
 * Thirteen of the fourteen prices are still `provisional: true` in pricing.ts.
 * The content document carries two WAITING ON RANJEETA blocks against this
 * page, one of them flagging that her weight-loss answer ("Wants to change -
 * from $99 but holistic from $59") is ambiguous, and that she may want every
 * figure shown as a "from" price. Nothing here can resolve that; it is a
 * one-file change in pricing.ts once she confirms.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { STANDARD_CLOSING } from "./shared";

export const PRICING_PAGE: ServicePageData = {
  meta: {
    title: "Pricing | Transparent Telehealth Consultation Fees | HHCPA",
    description:
      "Clear, upfront telehealth pricing. Free pre-screening quiz. Consultations from $59 with AHPRA-registered practitioners. No commitment until you book.",
    path: "/pricing/",
  },
  hero: {
    eyebrow: "Pricing",
    heading: "Transparent pricing, no surprises",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: { label: "Book a consultation", href: "/quiz/" },
  },
  crumbs: [{ label: "Home", href: "/" }],
  intro:
    "Pricing at Horizon Health Care Partners is clear and upfront. The pre-screening quiz is free, consultation fees are shown before you book, and there are no hidden costs. You only pay when you decide to go ahead. The prices below are consultation fees. Any medicine dispensed by a pharmacy is separate.",
  modules: [
    {
      kind: "priceTable",
      eyebrow: "Core consultation fees",
      heading: "Consultation fees",
      valueHeading: "Fee",
      rows: ["quiz", "firstConsult", "followUpConsult", "transferConsult"],
    },
    {
      kind: "priceTable",
      tinted: true,
      eyebrow: "Other services",
      heading: "Other services",
      valueHeading: "From",
      rows: [
        "generalConsult",
        "afterHoursConsult",
        "priorityConsult",
        "medicalCertificate",
        "prescriptions",
        "pathologyReferral",
        "mentalHealth",
        "mensWomensHealth",
        "weightManagement",
        "healthProgram",
      ],
      labels: { priorityConsult: "Priority consult (limited daily)" },
      stripFrom: true,
      note: "Any medicine dispensed by a pharmacy is a separate cost and is not part of the consultation fee.",
    },
    {
      kind: "statement",
      eyebrow: "What is included",
      heading: "What your fee includes",
      paragraphs: [
        "Your consultation fee covers the consultation with an AHPRA-registered practitioner, review of your history, professional medical advice, and management of eligible prescriptions where clinically appropriate. Medicines dispensed by a pharmacy are a separate cost.",
      ],
    },
    {
      kind: "related",
      eyebrow: "Where to next",
      heading: "Explore your options",
      cards: [
        {
          title: "How it works",
          body: "The four steps from free quiz to ongoing review.",
          links: [{ label: "How it works", href: "/how-it-works/" }],
        },
        {
          title: "Free pre-screening quiz",
          body: "Two minutes, no diagnosis, no commitment.",
          links: [{ label: "Start the free quiz", href: "/quiz/" }],
        },
        {
          title: "Transfer your care",
          body: "Moving across from another provider.",
          links: [{ label: "Transfer your care", href: "/discharge/" }],
        },
      ],
      footnote: "Still deciding? Read the",
      footnoteLinks: [
        { label: "FAQs", href: "/faqs/" },
        { label: "how it works", href: "/how-it-works/" },
      ],
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "hidden",
        question: "Are there any hidden costs?",
        answer:
          "No. The fee you see is the fee you pay. Pharmacy costs for any medication are separate and are not part of the consultation fee.",
      },
      {
        id: "medicare",
        question: "Can I claim a Medicare rebate?",
        answer:
          "Some telehealth consultations may attract a Medicare rebate in certain circumstances. Check with Medicare, and we can provide documentation to support a claim.",
      },
      {
        id: "payment-plans",
        question: "Do you offer payment plans?",
        answer:
          "Payment is taken at the time of booking. If cost is a concern, contact our team.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
