/**
 * PAGE 22: PRICING — the canonical price list.
 *
 * Every figure is a `PriceKey`, never a literal. Nineteen service pages quote
 * prices in their pricing cues and FAQ answers, and all of them read the same
 * record, so this table and those pages cannot disagree.
 *
 * The module map asks for "text block with supporting image" three times here,
 * which does not fit a price list. The source reproduced its two tables as two
 * tables; both are now cards at request — the three consultations in the
 * homepage's pricing columns, the ten other services as tiles. The pairing a
 * table carried in its columns is kept in the markup: the tiles are a
 * description list, so a price is never read adrift from its service.
 *
 * Thirteen of the fourteen prices are still `provisional: true` in pricing.ts.
 * The content document carries two WAITING ON RANJEETA blocks against this
 * page, one of them flagging that her weight-loss answer ("Wants to change -
 * from $99 but holistic from $59") is ambiguous, and that she may want every
 * figure shown as a "from" price. Nothing here can resolve that; it is a
 * one-file change in pricing.ts once she confirms.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { PRICES } from "../pricing";
import { CONSULTATION_PLANS } from "../consultation-plans";
import { MEDICARE_ANSWER, STANDARD_CLOSING } from "./shared";
import { CALL_CTA } from "../clinic";

export const PRICING_PAGE: ServicePageData = {
  meta: {
    title: "Pricing | Transparent Telehealth Consultation Fees | HHCPA",
    description:
      `Clear, upfront telehealth pricing. Free pre-screening quiz. Consultations from $${PRICES.generalConsult.amount} with AHPRA-registered practitioners. No commitment until you book.`,
    path: "/pricing/",
  },
  hero: {
    /*
     * Hers, restored. Her 9 September annotation said "keep this hero page
     * with its wording", which round 3 traced to the H1 on her live pricing
     * page — staging's "Transparent pricing, no surprises" was a rewrite of
     * her line, so "keep" meant hers, not ours.
     */
    eyebrow: "Transparent, Straightforward Pricing",
    heading: "Pre-screening is free. No commitment until you're ready.",
    /*
     * §2.4 asks for her hero media on inner pages. Most of the pages it means
     * do not exist on her site — she has eight pages and no service pages —
     * but /pricing/ is one that does, and it carries a video hero like About.
     * Same treatment, her footage.
     */
    media: {
      src: "/videos/pricing-hero.mp4",
      poster: "/images/pricing-hero-poster.webp",
      alt: "A woman walks a gravel track past autumn grass, forest behind her.",
    },
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  intro:
    "Pricing at Horizon Health Care Partners is clear and upfront. The pre-screening quiz is free, consultation fees are shown before you book, and there are no hidden costs. You only pay when you decide to go ahead. The prices below are consultation fees. Any medicine dispensed by a pharmacy is separate.",
  modules: [
    {
      kind: "priceTiles",
      eyebrow: "All services and fees",
      heading: "All services and fees",
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
        /* §5.1 adds these two and renames the third; twelve rows in total. */
        "continuityPreventative",
        "holisticCare",
        "healthProgram",
      ],
      labels: { priorityConsult: "Priority consult (limited daily)" },
      /*
       * The prescriptions row reads "from $19", which is the floor of the
       * ladder in §4.8, not the only price. A fee a patient can be charged
       * has to be one they can look up, so the ceiling is stated here rather
       * than discovered at the end of the flow.
       */
      note: `Prescription requests are $${PRICES.prescriptions.amount} for a single medication you are already taking with no repeats, and $${PRICES.prescriptionsComplex.amount} otherwise. Any medicine dispensed by a pharmacy is a separate cost and is not part of the consultation fee.`,
    },
    {
      kind: "priceCards",
      tinted: true,
      /*
       * §5.2 retitles this block. It is her own instruction, ticked, and it
       * matches her live site, which carries the identical heading above the
       * same three boxes: these three fees are the holistic and alternative
       * medicine fees, not the site-wide ones. The per-service floor prices
       * sit in the table above, so the page no longer prices one service and
       * ignores seven.
       */
      eyebrow: "Our fees",
      heading: "Our Fees: Holistic Care / Alternative Medicine",
      /* The quiz is on this list and costs nothing, but it is not a
         consultation — a fourth column beside the three would say it was. */
      feature: {
        key: "quiz",
        title: "Start with the free pre-screening quiz",
        body: "A few minutes, no diagnosis, and no commitment. It tells you whether we are likely to be able to help before you pay for anything.",
        cta: { label: "Start the free quiz", href: "/quiz/" },
      },
      plans: CONSULTATION_PLANS,
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
          body: "A few minutes, no diagnosis, no commitment.",
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
        answer: MEDICARE_ANSWER,
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
