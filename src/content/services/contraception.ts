/**
 * PAGE 13: CONTRACEPTION & SEXUAL HEALTH.
 *
 * Module 5, "Safety first", is asked for as a highlighted callout in a distinct
 * colour. The dark statement band is that: it is the only section on the page
 * that inverts, so the passage about when telehealth is not the safe choice
 * cannot be skimmed past. The source gives no emergency numbers for this box —
 * those live in the site-wide disclaimer the layout renders on every page.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { STANDARD_CLOSING, STANDARD_FOOTNOTE, STANDARD_FOOTNOTE_LINKS, howToBegin, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const CONTRACEPTION: ServicePageData = {
  meta: {
    title: "Contraception Online Australia | Pill Scripts & Advice",
    description:
      "Contraception consultations and eligible prescriptions online with AHPRA-registered practitioners. Australia-wide telehealth, private and convenient.",
    path: "/womens-health/contraception/",
  },
  hero: {
    eyebrow: "Contraception & sexual health",
    heading: "Contraception and sexual health, handled privately online",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Women's Health", href: "/womens-health/" },
  ],
  intro:
    "Contraception online in Australia should be simple, private and safe, and that is how we run it. At Horizon Health Care Partners, an AHPRA-registered practitioner discusses your contraceptive needs, checks that a given option is appropriate for you, and provides eligible prescriptions where it is clinically safe to do so. Sexual health is health, and it is easier to look after when you can talk about it without an audience.",
  modules: [
    {
      kind: "tiles",
      eyebrow: "What we help with",
      heading: "What we can help with",
      columns: 2,
      tiles: [
        {
          title: "Discussing your options",
          body: "Discussing contraceptive options and what might suit your health and lifestyle.",
        },
        {
          title: "Continuing a prescription",
          body: "Continuing an existing contraceptive prescription, where it remains appropriate.",
        },
        {
          title: "Sexual health advice",
          body: "General sexual health advice and, where needed, referrals for testing.",
        },
        {
          title: "Honest guidance",
          body: "Honest guidance on when an in-person check is the safer path.",
        },
      ],
    },
    {
      kind: "statement",
      eyebrow: "Safety first",
      heading: "Why some things still need an in-person check",
      paragraphs: [
        "Telehealth handles a great deal of contraceptive and sexual health care well. Some situations need a physical examination or in-person testing to be safe, and your practitioner will tell you clearly when that applies. Good care sometimes means recommending the right setting, and we would rather be straight with you than cut a corner.",
      ],
    },
    {
      kind: "related",
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Women's health",
          body: "The wider women's health range.",
          links: [{ label: "Women's health", href: "/womens-health/" }],
        },
        {
          title: "Menopause & perimenopause",
          body: "Symptom assessment, and the options your practitioner discusses with you.",
          links: [
            {
              label: "Menopause & perimenopause",
              href: "/womens-health/menopause/",
            },
          ],
        },
        {
          title: "PCOS management",
          body: "Symptom management and ongoing support for polycystic ovary syndrome.",
          links: [
            {
              label: "PCOS management",
              href: "/womens-health/pcos-management/",
            },
          ],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "What we can discuss",
      heading: "Options we can talk through",
      paragraphs: [
        "Contraception is personal, and the right choice depends on your health, your preferences and your stage of life. In a consultation, your practitioner talks through the options that may suit you, explains how they work, and checks that a given option is appropriate and safe for you. They can continue an existing prescription where it remains suitable, and arrange testing or an in-person review when that is the safer path. You leave with a clear understanding and a plan you are comfortable with.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: sectionImage("contraception-options"),
      imageAlt:
        "A woman and a general practitioner talk in a private consulting room.",
      imageSide: "left",
    },
    {
      kind: "inlineCta",
      ...howToBegin(
        "Take the free pre-screening quiz, then book a private consultation. Fees are on our ",
      ),
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "pill-online",
        question: "Can I get the contraceptive pill online in Australia?",
        answer:
          "Where it is clinically appropriate and safe for you, a practitioner can prescribe it after a consultation. Some circumstances require an in-person review first.",
      },
      {
        id: "confidential",
        question: "Is the consultation confidential?",
        answer:
          "Yes, entirely. It is a private, one-to-one telehealth consultation.",
      },
      {
        id: "existing",
        question: "Can you help with an existing prescription?",
        answer:
          "Yes, where continuing it remains appropriate for your health. Your practitioner will review before renewing.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
