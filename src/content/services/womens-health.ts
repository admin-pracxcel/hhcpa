/**
 * PAGE 10: WOMEN'S HEALTH (HUB).
 *
 * A silo entry page, so it declares Service schema. Module 4 renders as link
 * cards rather than the map's icon tiles for the same reason as the men's hub:
 * three of its four items carry a destination, and tiles have nowhere to put
 * one. The fourth, "Hormonal and general health", has no link in the source, so
 * its card points at the quiz rather than inventing a URL.
 */

import { PRICES } from "../pricing";
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

export const WOMENS_HEALTH: ServicePageData = {
  meta: {
    title: "Women's Health Telehealth | Menopause, Hormones & More | AU",
    description:
      "Women's health consultations online with AHPRA-registered practitioners. Menopause, hormones, contraception and more. Australia-wide, judgement-free care.",
    path: "/womens-health/",
  },
  hero: {
    eyebrow: "Women's health",
    heading: "Women's health, on your schedule and online",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  trust: [
    "AHPRA-registered practitioners",
    "Judgement-free",
    "Australia-wide",
    "Real consultations, real plans",
  ],
  intro:
    "Women's health telehealth means you can raise the things that matter without rearranging your week around a waiting room. At Horizon Health Care Partners, AHPRA-registered practitioners consult on menopause, hormones, PCOS, contraception and sexual health, in private, from anywhere in Australia. Too many women are told their symptoms are just part of life. A practitioner who listens and assesses properly can offer something better than being brushed off.",
  serviceSchemaName: "Women's health consultations",
  modules: [
    {
      kind: "related",
      eyebrow: "What we help with",
      heading: "Women's health areas we consult on",
      cards: [
        {
          title: "Menopause and perimenopause",
          body: "Symptom assessment and options, including menopausal hormone therapy where appropriate.",
          links: [
            {
              label: "Menopause treatment",
              href: "/womens-health/menopause-treatment/",
            },
          ],
        },
        {
          title: "PCOS",
          body: "Symptom management, referrals and ongoing support for polycystic ovary syndrome.",
          links: [
            {
              label: "PCOS management",
              href: "/womens-health/pcos-management/",
            },
          ],
        },
        {
          title: "Contraception and sexual health",
          body: "Advice and eligible prescriptions, handled privately.",
          links: [
            {
              label: "Contraception & sexual health",
              href: "/womens-health/contraception/",
            },
          ],
        },
        {
          title: "Hormonal and general health",
          body: "From cycle concerns to fatigue, assessed by a practitioner who takes it seriously.",
          links: [{ label: "Check your eligibility", href: "/quiz/" }],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "Being heard",
      heading: "Care that takes your symptoms seriously",
      paragraphs: [
        "Women often describe having to push to be taken seriously about fatigue, mood, cycles and menopause. We build our consultations around listening first. Your practitioner asks about what you are actually experiencing, connects the dots, arranges tests where they help, and gives you a plan you understand. You should leave feeling assessed, not dismissed.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: IMAGE.painManagement,
      imageAlt: IMAGE_ALT.painManagement,
    },
    {
      kind: "split",
      eyebrow: "How it works",
      heading: "How a women's health consultation works",
      paragraphs: [
        "Start with the free pre-screening quiz, book a time that suits you, and speak with an AHPRA-registered practitioner by video or phone. They review your history, discuss your options, and arrange tests or eligible prescriptions where appropriate. Follow-up is part of the service.",
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
      image: IMAGE.consultation,
      imageAlt: IMAGE_ALT.consultation,
      imageSide: "left",
    },
    {
      kind: "statement",
      eyebrow: "Why telehealth works",
      heading: "Why telehealth suits women's health",
      paragraphs: [
        "A great deal of women's health care is well suited to a private video or phone consultation. You can raise symptoms you might hesitate to bring up in a busy clinic, from a space where you feel comfortable. You avoid travel and waiting rooms, which matters when you are also managing work, family and everything else. Where an in-person examination or test is needed, your practitioner arranges it and tells you clearly. The result is care that fits your life and still holds to proper clinical standards.",
      ],
    },
    {
      kind: "inlineCta",
      ...howToBegin(
        "Take the free pre-screening quiz, then book a time that suits you. Fees are on our ",
      ),
    },
    {
      kind: "pricingCue",
      eyebrow: "What it costs",
      heading: "What it costs",
      headline: `from $${PRICES.firstConsult.amount}`,
      headlineLabel: "Consultations",
      rows: [{ label: "Pre-screening quiz", value: "Free" }],
      note: "Every fee is on our pricing page. Any medicine dispensed by a pharmacy is a separate cost.",
      cta: { label: "See full pricing", href: "/pricing/" },
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "menopause",
        question: "Can I discuss menopause through telehealth?",
        answer:
          "Yes. Menopause and perimenopause are well suited to telehealth assessment, including discussion of hormone therapy where appropriate.",
      },
      {
        id: "contraception",
        question: "Can I get a contraceptive prescription online?",
        answer:
          "Where it is clinically appropriate and safe, yes, after a consultation. Some situations need in-person checks, and your practitioner will tell you.",
      },
      {
        id: "private",
        question: "Is my consultation private?",
        answer: "Yes. Consultations are confidential and one to one.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
