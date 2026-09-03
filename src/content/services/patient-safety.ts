/**
 * PAGE 29: PATIENT SAFETY & EMERGENCIES.
 *
 * No value-proposition strip and no FAQ in this page's map, so both are
 * omitted. Schema is MedicalWebPage and BreadcrumbList only.
 *
 * Module 3 is the emergency callout and carries three crisis lines, including
 * 13YARN for Aboriginal and Torres Strait Islander people. It takes the dark
 * band — the only inverted section — so it cannot be skimmed past, and it sits
 * directly under the intro rather than at the foot of the page.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const PATIENT_SAFETY: ServicePageData = {
  meta: {
    title: "Patient Safety & Emergencies | Horizon Health Care Partners",
    description:
      "How Horizon Health Care Partners keeps care safe, when telehealth is not appropriate, and where to get urgent help. Emergency and crisis contacts inside.",
    path: "/patient-safety/",
  },
  hero: {
    eyebrow: "Patient safety",
    heading: "Your safety comes first",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  trust: null,
  intro:
    "Telehealth is a genuinely good way to deliver a lot of care. It is not right for everything, and being honest about that is part of keeping you safe. This page explains how we protect patients, when we will recommend a different setting, and where to turn if you need help urgently.",
  modules: [
    {
      kind: "statement",
      eyebrow: "In an emergency",
      heading: "If this is an emergency",
      paragraphs: [
        "Telehealth is not an emergency service. If you or someone else is in danger, or you have symptoms like chest pain, difficulty breathing, severe bleeding, or signs of a stroke, call 000 now or go to your nearest emergency department.",
        "If you are in crisis or thinking about harming yourself, please reach out right away. Lifeline: 13 11 14 (24 hours). Beyond Blue: 1300 22 4636 (24 hours). 13YARN, for Aboriginal and Torres Strait Islander people: 13 92 76.",
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "When telehealth is not appropriate",
      heading: "When we will recommend in-person care",
      paragraphs: [
        "Your practitioner will recommend an in-person option when your situation calls for it, for example when a physical examination is needed, when symptoms are serious or worsening, or when a hands-on test is required to be safe. Recommending the right setting is part of good care, and we would always rather do that than stretch telehealth past where it belongs.",
      ],
      image: sectionImage("patient-safety-in-person-care"),
      imageAlt:
        "A general practitioner examines a seated patient with a stethoscope in a consulting room.",
    },
    {
      kind: "tiles",
      eyebrow: "How we keep care safe",
      heading: "How we protect patients",
      tiles: [
        {
          title: "Real consultations",
          body: "We assess and prescribe through real-time consultations, not questionnaires.",
        },
        {
          title: "Registered practitioners",
          body: "Every practitioner is AHPRA-registered, with details published on their profile.",
        },
        {
          title: "Appropriate prescribing",
          body: "Prescriptions are provided only where they are clinically appropriate and safe.",
        },
        {
          title: "Follow-up and monitoring",
          body: "Where treatment continues, review and monitoring are built in.",
        },
        {
          title: "Clear limits",
          body: "We tell you plainly when something is outside what telehealth can safely offer.",
        },
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "Your part",
      heading: "Helping us keep you safe",
      paragraphs: [
        "Give your practitioner accurate information about your health, your medications and your history. Tell them if something changes or gets worse. Follow the plan you agree together, and come back for review when asked. Safe care is a partnership.",
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
      image: sectionImage("patient-safety-your-part"),
      imageAlt:
        "A patient and a practitioner sit side by side at a desk, looking at a page together.",
      imageSide: "left",
    },
  ],
  closing: {
    heading: "Questions about whether telehealth suits you?",
    body: "The free pre-screening quiz is a good first step, and a practitioner will always tell you honestly if another path is safer.",
    primary: { label: "Start the free quiz", href: "/quiz/" },
  },
};
