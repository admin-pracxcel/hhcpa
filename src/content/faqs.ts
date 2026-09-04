/**
 * PAGE 26: FAQs.
 *
 * Four topic groups, each its own accordion. The module map names different
 * components for them — link cards, a text block, a pricing cue, a safety
 * callout — but every one of the four is a set of questions and answers, so
 * they all render as accordions and the page reads as one FAQ rather than four
 * unrelated blocks.
 *
 * One FAQPage covers all four groups. Emitting four would put four FAQPage
 * entities on one URL, which is not what the type describes.
 */

import { PRICES } from "./pricing";
import { CALL_CTA } from "./clinic";
import { MEDICARE_ANSWER } from "./services/shared";

export const FAQS_META = {
  title: "FAQs | Telehealth, Prescriptions & Consultations | HHCPA",
  description:
    "Answers to common questions about HHCPA telehealth: how it works, prescriptions, pricing, eligibility, privacy and emergencies.",
  path: "/faqs/",
} as const;

export const FAQS_PAGE = {
  hero: {
    eyebrow: "FAQs",
    heading: "Your questions, answered",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  intro:
    "The questions patients ask most, grouped by topic. If you cannot find what you need, contact our team or start the free pre-screening quiz.",
  groups: [
    {
      heading: "Getting started",
      items: [
        {
          id: "how-it-works",
          question: "How does Horizon Health Care Partners work?",
          answer:
            "You start with a free online pre-screening quiz. If it looks like we can help, you book a consultation by video or phone with an AHPRA-registered practitioner, who reviews your health and talks through your options. Any care plan comes from that consultation, not the quiz.",
        },
        {
          id: "referral",
          question: "Do I need a referral?",
          answer: "No. You can begin with the free pre-screening quiz.",
        },
        {
          id: "coverage",
          question: "Where in Australia do you operate?",
          answer: "Everywhere. We are a national telehealth clinic.",
        },
      ],
    },
    {
      heading: "Prescriptions and treatment",
      items: [
        {
          id: "prescription",
          question: "Will I be given a prescription?",
          answer:
            "Not automatically. Our practitioners prescribe only where it is clinically appropriate, after a real consultation. The outcome might be advice, a referral, monitoring, lifestyle guidance, or no treatment.",
        },
        {
          id: "anything",
          question: "Can you prescribe anything?",
          answer:
            "No. Some medications cannot be prescribed by telehealth, or at a first consultation, for safety and regulatory reasons. Your practitioner will explain if that applies to you.",
        },
        {
          id: "escripts",
          question: "How do eScripts work?",
          answer:
            "If a prescription is approved, you receive a token by SMS or email that any Australian pharmacy can dispense from.",
        },
      ],
    },
    {
      heading: "Cost and Medicare",
      items: [
        {
          id: "cost",
          question: "How much does it cost?",
          answer: `The pre-screening quiz is free. Consultations start from $${PRICES.firstConsult.amount}. Fees are shown before you book.`,
        },
        {
          id: "medicare",
          question: "Can I claim a Medicare rebate?",
          answer: MEDICARE_ANSWER,
        },
      ],
    },
    {
      heading: "Privacy and safety",
      items: [
        {
          id: "private",
          question: "Is my consultation private?",
          answer:
            "Yes. Consultations are confidential and one to one, and your information is handled in line with Australian privacy law.",
        },
        {
          id: "emergency",
          question: "What if it is an emergency?",
          answer:
            "Telehealth is not for emergencies. Call 000 in an emergency. For crisis support, call Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636.",
        },
        {
          id: "not-right",
          question: "What if telehealth is not right for my situation?",
          answer:
            "Your practitioner will tell you honestly and point you to the right pathway, whether that is in-person care, a referral, or a different service.",
        },
      ],
    },
  ],
  closing: {
    heading: "Your health, handled from home",
    body: "Start with the free pre-screening quiz. It takes about two minutes, it is not a diagnosis, and there is no commitment until you choose to book.",
    primary: { label: "Start the free quiz", href: "/quiz/" },
  },
} as const;
