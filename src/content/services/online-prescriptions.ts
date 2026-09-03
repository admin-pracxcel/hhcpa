/**
 * PAGE 16: ONLINE PRESCRIPTIONS & REPEAT SCRIPTS.
 *
 * Module 4 is the other place the map's step cards and the copy agree: three
 * genuinely named steps. Modules 5 and 7 are prose, so they take the band and
 * the split row.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { STANDARD_CLOSING, STANDARD_FOOTNOTE, STANDARD_FOOTNOTE_LINKS, howToBegin, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const ONLINE_PRESCRIPTIONS: ServicePageData = {
  meta: {
    title: "Online Prescriptions Australia | Repeat Scripts | HHCPA",
    description:
      "Request an online prescription or repeat script from an AHPRA-registered practitioner, where appropriate. eScripts to your phone, Australia-wide.",
    path: "/online-doctor/online-prescriptions/",
  },
  hero: {
    eyebrow: "Online prescriptions",
    heading:
      "Online prescriptions and repeat scripts, where clinically appropriate",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Online Doctor", href: "/online-doctor/" },
  ],
  intro:
    "An online prescription in Australia is convenient, and it is still a medical decision. At Horizon Health Care Partners, an AHPRA-registered practitioner reviews your situation in a real consultation and issues a prescription or repeat script where it is clinically appropriate and safe. Approved prescriptions are sent to you as an eScript, ready to take to any pharmacy. No guessing, no vending-machine medicine, just a proper review done quickly.",
  modules: [
    {
      kind: "steps",
      eyebrow: "How it works",
      heading: "How online prescriptions work",
      steps: [
        {
          pill: "Tell us what you need",
          title: "Tell us what you need",
          description:
            "Start with the free pre-screening quiz so we understand your request.",
        },
        {
          pill: "Consult with a practitioner",
          title: "Consult with a practitioner",
          description:
            "Your practitioner reviews your history and current medications and confirms whether a prescription is appropriate.",
        },
        {
          pill: "Receive your eScript",
          title: "Receive your eScript",
          description:
            "If approved, your eScript is sent to your phone, ready for any Australian pharmacy.",
        },
        {
          pill: "Ongoing review",
          title: "Ongoing review",
          description:
            "Where treatment continues, your practitioner reviews it before renewing rather than repeating it automatically.",
        },
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
    },
    {
      kind: "statement",
      eyebrow: "What we can and cannot prescribe",
      heading: "An honest note on limits",
      paragraphs: [
        "Many everyday medications and renewals are well suited to telehealth. Some medications are restricted and cannot be prescribed at a first telehealth consultation, or at all by telehealth, for safety and regulatory reasons. If your request falls into that category, your practitioner will explain the safe alternative rather than leave you guessing.",
      ],
    },
    {
      kind: "related",
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Pathology and imaging referrals",
          body: "Need tests alongside a script?",
          links: [
            {
              label: "Pathology & imaging referrals",
              href: "/online-doctor/pathology-imaging-referrals/",
            },
          ],
        },
        {
          title: "Online doctor",
          body: "The full range of everyday telehealth care.",
          links: [{ label: "Online doctor", href: "/online-doctor/" }],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "What patients ask us about",
      heading: "What patients commonly need",
      paragraphs: [
        "Many requests are to continue treatment that is already working, where a review confirms it remains appropriate to renew. Others are for a new concern a practitioner can assess and, where suitable, treat. Common areas include ongoing conditions managed with regular medication, skin concerns, and everyday health issues. Some medications carry restrictions and are not suitable for a first telehealth consultation, and your practitioner will tell you when that applies and what the safe alternative is.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: sectionImage("online-prescriptions-what-patients-ask"),
      imageAlt:
        "A woman at a home desk gestures as she speaks during a video consultation.",
      imageSide: "left",
    },
    {
      kind: "inlineCta",
      ...howToBegin(
        "Take the free pre-screening quiz, then book a consultation. Fees are on our ",
      ),
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "repeat",
        question: "Can I get a repeat prescription online?",
        answer:
          "Yes, where continuing the medication remains clinically appropriate. Your practitioner reviews before renewing.",
      },
      {
        id: "escript",
        question: "How does an eScript work?",
        answer:
          "You receive a token by SMS or email that any Australian pharmacy can dispense from. You do not need a paper script.",
      },
      {
        id: "anything",
        question: "Will you prescribe anything I ask for?",
        answer:
          "No. Prescriptions follow clinical judgement, not requests. Your practitioner prescribes only what is appropriate and safe for you.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
