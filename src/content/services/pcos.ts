/**
 * PAGE 12: PCOS MANAGEMENT.
 *
 * Modules 4 and 7 are both prose, so they take the two split rows with the
 * image alternating sides; module 5 is prose too and takes the dark band. The
 * map asks for step cards at 5 and an icon list at 7, and neither passage has
 * discrete items to render as such.
 */

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

export const PCOS: ServicePageData = {
  meta: {
    title: "PCOS Treatment Online | Polycystic Ovary Support | Australia",
    description:
      "Online consultations for PCOS with AHPRA-registered practitioners. Symptom management, referrals and ongoing support, Australia-wide.",
    path: "/womens-health/pcos-management/",
  },
  hero: {
    eyebrow: "PCOS management",
    heading: "PCOS management, coordinated online",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Women's Health", href: "/womens-health/" },
  ],
  intro:
    "PCOS treatment online gives you a practitioner who can help you make sense of a condition that touches a lot of moving parts. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses your symptoms, helps coordinate the right tests, and supports ongoing management of polycystic ovary syndrome. PCOS affects cycles, skin, hair, weight and fertility for many women, and joined-up care makes a real difference.",
  modules: [
    {
      kind: "split",
      tinted: true,
      eyebrow: "Understanding PCOS",
      heading: "What PCOS involves",
      paragraphs: [
        "Polycystic ovary syndrome is a common hormonal condition that can cause irregular periods, acne, excess hair growth, difficulty with weight, and challenges with fertility. It also has links to insulin and long-term metabolic health, which is why management looks at more than one symptom at a time. There is no single fix, and there is a lot that can be done to manage it well.",
      ],
      image: IMAGE.complexHealth,
      imageAlt: IMAGE_ALT.complexHealth,
    },
    {
      kind: "statement",
      eyebrow: "How we support you",
      heading: "How management works",
      paragraphs: [
        "Your practitioner reviews your symptoms and history, arranges or coordinates appropriate pathology, and helps you build a management plan. That may involve lifestyle support, symptom-specific treatment where appropriate, referrals to relevant specialists, and regular review. Because PCOS is long-term, continuity matters, and telehealth makes that continuity easy to maintain.",
      ],
    },
    {
      kind: "related",
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Weight loss & peptides",
          body: "Weight and hormones often overlap with PCOS.",
          links: [
            { label: "Weight loss & peptides", href: "/weight-loss-peptides/" },
          ],
        },
        {
          title: "Women's health",
          body: "The wider women's health range.",
          links: [{ label: "Women's health", href: "/womens-health/" }],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "Symptoms we help you manage",
      heading: "Symptoms we help you manage",
      paragraphs: [
        "PCOS shows up differently for different women, and your plan reflects that. Common concerns patients bring to us include irregular or missing periods, acne and skin changes, unwanted hair growth, difficulty managing weight, and questions about fertility. Mood and energy often come into it too. Because PCOS connects to insulin and longer-term metabolic health, your practitioner looks beyond any single symptom and helps you manage the whole picture over time.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: IMAGE.physicalWellbeing,
      imageAlt: IMAGE_ALT.physicalWellbeing,
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
        id: "telehealth",
        question: "Can PCOS be managed through telehealth?",
        answer:
          "Yes. Much of PCOS management is well suited to telehealth, with tests and specialist referrals arranged where needed.",
      },
      {
        id: "tests",
        question: "Will I need tests?",
        answer:
          "Often, yes. Your practitioner will coordinate the appropriate pathology and imaging where relevant.",
      },
      {
        id: "weight",
        question: "Can you help with PCOS and weight?",
        answer:
          "Weight can be harder to manage with PCOS, and your practitioner can help you approach it as part of your overall plan.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
