/** PAGE 19: SPECIALIST REFERRALS. */

import type { ServicePageData } from "@/components/sections/ServicePage";
import {
  IMAGE,
  IMAGE_ALT,
  STANDARD_CLOSING,
  STANDARD_FOOTNOTE,
  STANDARD_FOOTNOTE_LINKS,
  howToBegin,
} from "./shared";

export const SPECIALIST_REFERRALS: ServicePageData = {
  meta: {
    title: "Specialist Referrals Online | Telehealth Australia | HHCPA",
    description:
      "Request a specialist referral online, where clinically appropriate, from an AHPRA-registered practitioner. Australia-wide telehealth.",
    path: "/online-doctor/specialist-referrals/",
  },
  hero: {
    eyebrow: "Specialist referrals",
    heading: "Specialist referrals, assessed and issued online",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: { label: "Book a consultation", href: "/quiz/" },
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Online Doctor", href: "/online-doctor/" },
  ],
  intro:
    "A specialist referral online removes a frustrating step from getting the care you need. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses whether a specialist referral is appropriate and issues one where it is clinically justified. You avoid an extra appointment just to be pointed onward, and you keep your care moving.",
  modules: [
    {
      kind: "split",
      tinted: true,
      eyebrow: "How it works",
      heading: "How referrals work",
      paragraphs: [
        "Complete the free pre-screening quiz, book a consultation, and discuss your situation with a practitioner. Where a referral is appropriate, they issue it so you can arrange to see the relevant specialist. Your practitioner will also tell you if your situation needs an in-person assessment first.",
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
      image: IMAGE.consultation,
      imageAlt: IMAGE_ALT.consultation,
    },
    {
      kind: "statement",
      eyebrow: "An honest note",
      heading: "Referrals follow assessment",
      paragraphs: [
        "A referral is a clinical judgement, not a formality. Your practitioner issues one where it genuinely helps your care. If a referral is not the right next step, they will explain what is.",
      ],
    },
    {
      kind: "related",
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Pathology and imaging referrals",
          body: "Referrals often follow tests.",
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
      eyebrow: "Why start with a telehealth consult",
      heading: "Why start online",
      paragraphs: [
        "Getting a referral often means booking a separate appointment just to be pointed onward, which wastes time when you already know you need specialist input. A telehealth consultation removes that step. Your practitioner reviews your situation, confirms that a referral is the right move, and issues it, all in one visit. They also make sure a referral is genuinely the best next step, and flag when an in-person assessment should come first.",
      ],
      image: IMAGE.approach,
      imageAlt: IMAGE_ALT.approach,
      imageSide: "left",
    },
    {
      kind: "tiles",
      eyebrow: "What your referral includes",
      heading: "What your referral covers",
      tiles: [
        {
          title: "The relevant background",
          body: "Your practitioner prepares a referral with the relevant background so the specialist has what they need.",
        },
        {
          title: "The right type of specialist",
          body: "They can point you toward the appropriate type of specialist for your concern and answer questions about what to expect.",
        },
        {
          title: "Your existing results",
          body: "If you already have test results, bring them, because they help your practitioner make the referral count.",
        },
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
        id: "telehealth",
        question: "Can I get a specialist referral through telehealth?",
        answer:
          "Yes, where it is clinically appropriate. Your practitioner assesses this during your consultation.",
      },
      {
        id: "validity",
        question: "How long is a referral valid?",
        answer:
          "Referral validity depends on the type and the specialist. Your practitioner will advise for your situation.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
