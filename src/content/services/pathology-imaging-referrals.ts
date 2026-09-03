/** PAGE 18: PATHOLOGY & IMAGING REFERRALS. */

import type { ServicePageData } from "@/components/sections/ServicePage";
import {
  IMAGE,
  IMAGE_ALT,
  STANDARD_CLOSING,
  STANDARD_FOOTNOTE,
  STANDARD_FOOTNOTE_LINKS,
  howToBegin,
} from "./shared";
import { CALL_CTA } from "../clinic";

export const PATHOLOGY_IMAGING: ServicePageData = {
  meta: {
    title: "Pathology & Imaging Referrals Online | Australia | HHCPA",
    description:
      "Request referrals for blood tests, X-rays and ultrasounds online, where clinically appropriate, from AHPRA-registered practitioners. Australia-wide.",
    path: "/online-doctor/pathology-imaging-referrals/",
  },
  hero: {
    eyebrow: "Pathology & imaging referrals",
    heading: "Pathology and imaging referrals, arranged online",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Online Doctor", href: "/online-doctor/" },
  ],
  intro:
    "A pathology referral online means you can get the tests you need without a separate clinic visit first. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses what is worth checking and issues referrals for blood tests, X-rays and ultrasounds where they are clinically indicated. Good decisions come from good data, and a quick consultation is often all it takes to get the right tests moving.",
  modules: [
    {
      kind: "tiles",
      eyebrow: "What we can refer for",
      heading: "What we can refer for",
      tiles: [
        {
          title: "Blood tests",
          body: "Blood tests for a wide range of everyday concerns.",
        },
        {
          title: "Imaging",
          body: "Imaging such as X-rays and ultrasounds, where indicated.",
        },
        {
          title: "Matched to your symptoms",
          body: "Referrals matched to your symptoms, not a generic panel.",
        },
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "How it works",
      heading: "How it works",
      paragraphs: [
        "Complete the free pre-screening quiz, book a consultation, and your practitioner discusses your concern and issues appropriate referrals. You take the referral to a collection centre or imaging provider. Where useful, your practitioner reviews the results with you in a follow-up.",
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
      image: IMAGE.consultation,
      imageAlt: IMAGE_ALT.consultation,
    },
    {
      kind: "related",
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Online prescriptions",
          body: "Reviewing results often leads to next steps.",
          links: [
            {
              label: "Online prescriptions",
              href: "/online-doctor/online-prescriptions/",
            },
          ],
        },
        {
          title: "Specialist referrals",
          body: "Referrals to specialists, where appropriate.",
          links: [
            {
              label: "Specialist referrals",
              href: "/online-doctor/specialist-referrals/",
            },
          ],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "statement",
      eyebrow: "Why testing supports better care",
      heading: "Why the right tests matter",
      paragraphs: [
        "Good treatment decisions rest on good information. Ordering the right tests, and only the tests that are useful, gives your practitioner a clear picture and helps you avoid guesswork. Where results point to something that needs attention, you have a head start. Where they are reassuring, you have peace of mind. Your practitioner matches the tests to your symptoms, explains what each one is for, and reviews the results with you so you know what they mean and what comes next.",
      ],
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
        id: "blood-test",
        question: "Can I get a blood test referral online?",
        answer:
          "Yes, where it is clinically appropriate. Your practitioner decides based on your consultation.",
      },
      {
        id: "medicare",
        question: "Will Medicare cover my tests?",
        answer:
          "Many pathology tests are covered by Medicare when referred appropriately. Some tests and imaging have out-of-pocket costs. Your practitioner and the provider can advise.",
      },
      {
        id: "interpret",
        question: "Can you interpret my results?",
        answer:
          "Yes. Book a follow-up and your practitioner will talk you through what the results mean and what to do next.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
