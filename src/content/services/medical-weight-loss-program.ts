/**
 * PAGE 4: MEDICAL WEIGHT LOSS PROGRAM.
 *
 * Modules 4 and 5 swap the map's suggested components. The map asks for a
 * text-and-image block at 4 and feature tiles at 5, but the copy at 4 is five
 * labelled points and the copy at 5 is a single continuous argument. Each
 * module follows the shape of the words it carries, so the tiles are at 4 and
 * the image lands at 5.
 *
 * Module 7, "Who the program suits", is a statement band rather than the map's
 * checklist: its copy is two paragraphs, and breaking prose into ticks would
 * mean writing list items that are not in the approved copy.
 */

import { PRICES } from "../pricing";
import type { ServicePageData } from "@/components/sections/ServicePage";
import { IMAGE, IMAGE_ALT, STANDARD_CLOSING, STANDARD_FOOTNOTE, STANDARD_FOOTNOTE_LINKS, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const MEDICAL_WEIGHT_LOSS_PROGRAM: ServicePageData = {
  meta: {
    title: "Medical Weight Loss Program | Practitioner-Led Online",
    description:
      "A medically supervised weight-loss program with ongoing practitioner review. Assessment, plan and follow-up, delivered by telehealth across Australia.",
    path: "/weight-loss-peptides/medical-weight-loss-program/",
  },
  hero: {
    eyebrow: "Medical weight loss program",
    heading: "A medical weight loss program built around review, not quick fixes",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Weight Loss & Peptides", href: "/weight-loss-peptides/" },
  ],
  intro:
    "Medical weight loss works because someone is watching the whole picture with you. Our program pairs you with an AHPRA-registered practitioner who assesses your health, agrees a plan, and reviews it as your body responds. This is the difference between a one-off script and a supervised program. It is designed for people who want structure, accountability and a practitioner in their corner, delivered entirely online.",
  modules: [
    {
      kind: "tiles",
      eyebrow: "What the program includes",
      heading: "What a supervised program looks like",
      tiles: [
        {
          title: "Assessment",
          body: "Your practitioner reviews your history, your goals and any current treatments.",
        },
        {
          title: "Diagnostic testing where useful",
          body: "Depending on your circumstances, your practitioner may arrange pathology (for example blood tests looking at metabolic, hormonal or nutrient markers) so the plan is built on real data rather than assumptions.",
        },
        {
          title: "A personalised plan",
          body: "Together you agree an approach that fits your health and your life. Where medication is appropriate, it is part of the plan, not the whole plan.",
        },
        {
          title: "Regular review",
          body: "You are seen again on a schedule that suits your treatment, so progress is tracked and the plan is adjusted.",
        },
        {
          title: "Support between reviews",
          body: "Questions come up. Your practitioner and our team are reachable when they do.",
        },
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "Why review-based care holds",
      heading: "Why this approach lasts",
      paragraphs: [
        "Most weight returns because the underlying drivers were never addressed, and because support stopped the moment the number moved. A supervised program keeps the plan alive. Your practitioner can respond to plateaus, manage side effects, and keep you focused on the habits that protect the result. Weight management is a long game, and this program is built for the long game.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: sectionImage("medical-weight-loss-program-ongoing-review"),
      imageAlt:
        "A man walks along a suburban footpath in early morning light.",
    },
    {
      kind: "related",
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Weight loss & peptides",
          body: "How peptides for weight loss fit into a supervised program.",
          links: [
            { label: "Weight loss & peptides", href: "/weight-loss-peptides/" },
          ],
        },
        {
          title: "Weight loss injections",
          body: "How injectable options are assessed.",
          links: [
            {
              label: "Weight loss injections",
              href: "/weight-loss-peptides/weight-loss-injections/",
            },
          ],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "statement",
      eyebrow: "Who the program suits",
      heading: "Who a supervised program suits",
      paragraphs: [
        "The program fits people who have tried to manage weight on their own and want structure behind them. It suits anyone whose weight is affecting energy, sleep, mood or long-term health. It suits anyone who wants a practitioner guiding both the plan and the follow-up, with regular reviews as the body adapts. If that describes where you are, the assessment is the place to start.",
        "It may not be the right step during pregnancy or breastfeeding, or where another pathway would serve you better. Your practitioner will say so plainly.",
      ],
    },
    {
      kind: "pricingCue",
      eyebrow: "Cost and how to begin",
      heading: "Cost and how to begin",
      headline: `from $${PRICES.healthProgram.amount}`,
      headlineLabel: "Structured programs",
      rows: [
        { label: "Pre-screening quiz", value: "Free" },
        {
          label: "Standard consultation",
          value: `$${PRICES.firstConsult.amount}`,
        },
      ],
      note: "See the full breakdown on our pricing page, and read the journey from first quiz to ongoing review on how it works.",
      cta: { label: "See full pricing", href: "/pricing/" },
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "length",
        question: "How long is the program?",
        answer:
          "It is ongoing and paced to your needs. Your practitioner agrees a review schedule with you.",
      },
      {
        id: "medication",
        question: "Is medication included?",
        answer:
          "Medication is included where it is clinically appropriate. Some patients are supported through lifestyle-focused plans without it. Pharmacy costs for any medication are separate.",
      },
      {
        id: "cost",
        question: "What does it cost?",
        answer: `Programs are available from $${PRICES.healthProgram.amount}, with standard consultations at $${PRICES.firstConsult.amount}.`,
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
