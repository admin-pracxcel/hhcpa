/**
 * PAGE 17: ONLINE MEDICAL CERTIFICATES.
 *
 * Modules 6 and 7 make substantially the same point in the source — that a
 * certificate rests on clinical judgement — so they run as the dark band and a
 * split row rather than two near-identical text-and-image blocks.
 */

import { PRICES } from "../pricing";
import type { ServicePageData } from "@/components/sections/ServicePage";
import { IMAGE, IMAGE_ALT, STANDARD_CLOSING, STANDARD_FOOTNOTE, STANDARD_FOOTNOTE_LINKS, howToBegin, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const MEDICAL_CERTIFICATES: ServicePageData = {
  meta: {
    title: "Online Medical Certificate Australia | From $19.90 | HHCPA",
    description:
      "Get an online medical certificate for work, study or carer's leave from an AHPRA-registered practitioner, where appropriate. Fast, Australia-wide telehealth.",
    path: "/online-doctor/medical-certificates/",
  },
  hero: {
    eyebrow: "Medical certificates",
    heading: "Online medical certificates for work, study and carer's leave",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Online Doctor", href: "/online-doctor/" },
  ],
  intro: `An online medical certificate saves you a trip to the clinic when you are least up to it. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses your situation in a short consultation and issues a certificate where it is appropriate, for work, study or carer's leave. Certificates start from $${PRICES.medicalCertificate.amount.toFixed(2)}. They are issued on clinical judgement, so they are genuine and defensible, not rubber-stamped.`,
  modules: [
    {
      kind: "tiles",
      eyebrow: "What we can certify",
      heading: "What certificates cover",
      tiles: [
        {
          title: "Work and study",
          body: "Single-day and multi-day certificates for work or study.",
        },
        {
          title: "Carer's leave",
          body: "Carer's leave certificates where you are caring for someone.",
        },
        {
          title: "Clinically appropriate only",
          body: "Certificates issued only where the practitioner is satisfied it is clinically appropriate.",
        },
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "How it works",
      heading: "How it works",
      paragraphs: [
        "Complete the free pre-screening quiz, book a short consultation, and speak with a practitioner who assesses your situation. Where appropriate, your certificate is issued promptly and sent to you.",
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
      image: sectionImage("medical-certificates-how-it-works"),
      imageAlt:
        "A person wrapped in a blanket on the couch speaks with a practitioner on a laptop.",
    },
    {
      kind: "statement",
      eyebrow: "An honest note",
      heading: "Issued on clinical judgement",
      paragraphs: [
        "A medical certificate is a clinical document. Our practitioners issue certificates only where the assessment supports it. That protects you and your employer or institution, because a genuine certificate holds up. If a certificate is not appropriate, your practitioner will explain why.",
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "When a certificate is appropriate",
      heading: "When a certificate is appropriate",
      paragraphs: [
        "A medical certificate makes sense when illness or injury genuinely affects your ability to work, study or care for someone, and you need documentation for your employer or institution. Your practitioner assesses your situation in a short consultation and issues a certificate where the assessment supports it. Because the certificate rests on a real consultation with a registered practitioner, it is a genuine document that holds up. If a certificate is not appropriate, your practitioner explains why and what you can do instead.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: sectionImage("medical-certificates-when-appropriate"),
      imageAlt:
        "A general practitioner listens and asks a follow-up question during a consultation.",
      imageSide: "left",
    },
    {
      kind: "related",
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Online doctor",
          body: "The full range of everyday telehealth care.",
          links: [{ label: "Online doctor", href: "/online-doctor/" }],
        },
        {
          title: "Online prescriptions",
          body: "New prescriptions and renewals, where clinically appropriate.",
          links: [
            {
              label: "Online prescriptions",
              href: "/online-doctor/online-prescriptions/",
            },
          ],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "inlineCta",
      ...howToBegin(
        "Take the free pre-screening quiz, then book a short consultation. Fees are on our ",
      ),
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "cost",
        question: "How much is an online medical certificate?",
        answer: `Certificates start from $${PRICES.medicalCertificate.amount.toFixed(2)}. The pre-screening quiz is free.`,
      },
      {
        id: "accepted",
        question: "Are your certificates accepted by employers?",
        answer:
          "They are issued by AHPRA-registered practitioners following a consultation, which is what makes a certificate valid.",
      },
      {
        id: "backdated",
        question: "Can I get a backdated certificate?",
        answer:
          "Practitioners assess each situation on its merits and follow professional standards. Backdating is not automatic.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
