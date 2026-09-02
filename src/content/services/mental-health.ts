/**
 * PAGE 20: MENTAL HEALTH SUPPORT.
 *
 * Module 6 is the crisis callout, and it is the one section on the site whose
 * placement genuinely matters: Lifeline, Beyond Blue and 000 have to be
 * findable by someone scanning in distress. It renders as the dark band, the
 * only inverted section on the page, and the numbers also appear in the
 * site-wide disclaimer that the layout puts on every page.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import {
  IMAGE,
  IMAGE_ALT,
  STANDARD_CLOSING,
  STANDARD_FOOTNOTE,
  STANDARD_FOOTNOTE_LINKS,
} from "./shared";

export const MENTAL_HEALTH: ServicePageData = {
  meta: {
    title: "Mental Health Support Online | ADHD, Anxiety & Sleep",
    description:
      "Practitioner-led mental health support online: ADHD, anxiety, sleep and smoking cessation. AHPRA-registered practitioners, Australia-wide telehealth.",
    path: "/online-doctor/mental-health/",
  },
  hero: {
    eyebrow: "Mental health support",
    heading: "Mental health support, without the waiting room",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: { label: "Book a consultation", href: "/quiz/" },
  },
  crumbs: [
    { label: "Home", href: "/" },
    { label: "Online Doctor", href: "/online-doctor/" },
  ],
  trust: [
    "AHPRA-registered practitioners",
    "Confidential",
    "Australia-wide",
    "Judgement-free",
  ],
  intro:
    "Online mental health support in Australia should meet you where you are, on a hard day and a good one. At Horizon Health Care Partners, AHPRA-registered practitioners consult on ADHD, anxiety, sleep concerns and smoking cessation, in private, from home. Reaching out is the difficult part. Doing it from a space where you feel safe makes it a little easier.",
  modules: [
    {
      kind: "tiles",
      eyebrow: "What we help with",
      heading: "Areas we consult on",
      columns: 2,
      tiles: [
        {
          title: "ADHD support",
          body: "Assessment and ongoing support, and referral where formal assessment is needed.",
        },
        {
          title: "Anxiety",
          body: "Practical support for anxiety that is affecting your daily life.",
        },
        {
          title: "Sleep concerns",
          body: "Assessment of persistent sleep problems, which often connect to mood, pain and general health.",
        },
        {
          title: "Smoking cessation",
          body: "Support and, where appropriate, treatment to help you stop.",
        },
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "How we approach it",
      heading: "A supportive, practical approach",
      paragraphs: [
        "Your practitioner listens first, then works with you on a plan. That might involve advice and strategies, treatment where appropriate, referral to a psychologist or specialist service, or a combination. Mental health is health, and it responds to the same careful, individualised approach we bring to everything else.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: IMAGE.mentalWellbeing,
      imageAlt: IMAGE_ALT.mentalWellbeing,
    },
    {
      kind: "statement",
      eyebrow: "If you need urgent help",
      heading: "If you need help right now",
      paragraphs: [
        "Telehealth is not a crisis service. If you are in crisis or thinking about harming yourself, please reach out now. Call Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636, both available 24 hours a day. If life is in danger, call 000.",
      ],
    },
    {
      kind: "related",
      eyebrow: "Interlinking",
      heading: "Explore your options",
      cards: [
        {
          title: "Women's health",
          body: "Sleep, pain and mood often overlap.",
          links: [{ label: "Women's health", href: "/womens-health/" }],
        },
        {
          title: "Men's health",
          body: "Discreet consultations across men's health.",
          links: [{ label: "Men's health", href: "/mens-health/" }],
        },
        {
          title: "Online doctor",
          body: "Our wider online doctor services.",
          links: [{ label: "Online doctor", href: "/online-doctor/" }],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "How support is tailored to you",
      heading: "How we tailor support",
      paragraphs: [
        "No two people arrive with the same story, so support starts with listening. Your practitioner asks what you are experiencing, how long it has been going on, and how it is affecting your daily life. From there, a plan takes shape. That can mean practical strategies, treatment where it is appropriate, a referral to a psychologist or specialist service, or a combination that changes over time. The aim is steady, practical support that meets you where you are.",
      ],
      image: IMAGE.painManagement,
      imageAlt: IMAGE_ALT.painManagement,
      imageSide: "left",
    },
    {
      kind: "inlineCta",
      heading: "How to begin",
      lead: "Take the free pre-screening quiz, then book a consultation. Fees are on our ",
      mid: ", and the process is on ",
      tail: ". If you need urgent help, call Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636.",
      links: [
        { label: "pricing page", href: "/pricing/" },
        { label: "how it works", href: "/how-it-works/" },
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "adhd",
        question: "Can I get ADHD support online?",
        answer:
          "Yes. Practitioners can provide support and arrange referral where a formal assessment is required.",
      },
      {
        id: "psychologist",
        question: "Is this the same as seeing a psychologist?",
        answer:
          "Our practitioners provide medical support and can refer you to a psychologist or specialist service where that is the right step. The two work well together.",
      },
      {
        id: "confidential",
        question: "Is it confidential?",
        answer: "Yes. Consultations are private and confidential.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
