/**
 * PAGE 28: TRANSFER YOUR CARE.
 *
 * Restored 2026-09-14 on Bilal's instruction. This page is Ranjeeta's,
 * approved, and it was wrongly replaced on 2026-09-11 when /discharge/ was
 * rebuilt as a replica of her live Discharge Letter page — the two had been
 * treated as one page under build spec v2.3 §8, and they are not.
 *
 * They are now two pages with two jobs:
 *
 *   /transfer-your-care/  this page. Why and how to move your care across,
 *                         what a transfer consultation costs, what to bring.
 *   /discharge/           her Discharge Letter page, unchanged — the 15%
 *                         switch offer and the form that takes the letter.
 *
 * The content below is exactly what was here before the replacement, with
 * three changes and nothing else:
 *
 *   1. the path, which moved off /discharge/ so her page could keep it
 *   2. a third "Where to next" card pointing at /discharge/, so the two pages
 *      are joined rather than merely adjacent
 *   3. the DISCHARGE_FORM export is gone. The form lives on /discharge/ and
 *      has its own copy there; two files describing one form is how they
 *      drift apart.
 *
 * The shortest page in the document: four modules, no trust strip and no FAQ,
 * so the template omits both rather than padding the page out with sections
 * its map does not call for.
 *
 * Two things the BUILD BLOCK leaves out, and how they are handled:
 *
 *   - It lists no Schema line at all, unlike every other page. MedicalWebPage
 *     and BreadcrumbList are emitted anyway, on the basis that the omission
 *     reads as an oversight rather than an instruction to publish a page with
 *     no structured data. No FAQPage, since there is no FAQ.
 *   - It lists no closing band, but the copy ends with two buttons,
 *     [Start your transfer] and [Call 1300 336 572]. Those are exactly what
 *     the closing band renders, so it carries them.
 *
 * The transfer consultation fee is read from pricing.ts, like every other
 * price on the site, so it cannot drift from /pricing/.
 */

import { PRICES } from "../pricing";
import type { ServicePageData } from "@/components/sections/ServicePage";
import { STANDARD_CLOSING, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const TRANSFER_CARE: ServicePageData = {
  meta: {
    title: "Transfer Your Care | Discharge & Continuity | HHCPA",
    description: `Moving your care to Horizon Health Care Partners is simple. Transfer consultations from $${PRICES.transferConsult.amount}, with continuity and no disruption. Australia-wide telehealth.`,
    path: "/transfer-your-care/",
  },
  hero: {
    eyebrow: "Transfer your care",
    heading: "Transfer your care to Horizon Health Care Partners",
    primary: { label: "Start your transfer", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  trust: null,
  intro: `Changing where you receive care should be smooth, not stressful. A transfer consultation lets a Horizon practitioner review your current treatment and records so your care continues without disruption. Transfer consultations are $${PRICES.transferConsult.amount}.`,
  introCta: { label: "Start your transfer", href: "/quiz/" },
  modules: [
    {
      kind: "steps",
      eyebrow: "How a transfer works",
      heading: "How transferring works",
      steps: [
        {
          pill: "Quick onboarding",
          title: "Quick onboarding",
          description:
            "Share your details and current treatment so we can prepare.",
        },
        {
          pill: "A review consultation",
          title: "A review consultation",
          description:
            "Your practitioner reviews your history and current plan, and confirms how care continues.",
        },
        {
          pill: "Continuity",
          title: "Continuity",
          description:
            "You keep moving forward, with a practitioner who has the full picture.",
        },
        {
          pill: "Ongoing care",
          title: "Ongoing care",
          description:
            "From there your care runs as it would for any Horizon patient, with reviews and eligible prescriptions handled as needed.",
        },
      ],
      cta: { label: "Start your transfer", href: "/quiz/" },
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "What to bring",
      heading: "What helps us help you",
      paragraphs: [
        "Any current medication details, recent test results if you have them, and a short summary of your treatment so far. If you do not have everything, that is fine. Your practitioner will guide you.",
      ],
      cta: { label: "Start your transfer", href: "/quiz/" },
      image: sectionImage("discharge-what-to-bring"),
      imageAlt:
        "A woman gathers a few pages into a folder at a kitchen table.",
    },
    {
      /* §8: her four points, verbatim from the live page. */
      kind: "tiles",
      tinted: true,
      eyebrow: "Make the switch",
      heading: "Why patients choose Horizon Health Care Partners",
      columns: 2,
      tiles: [
        {
          title: "Care from home",
          body: "Speak with AHPRA-registered practitioners via video or phone, no travel required. Discuss your health concerns from the comfort of your home.",
        },
        {
          title: "A plan built around you",
          body: "Work with practitioners to develop care plans that may address your individual health needs, lifestyle, and wellness goals.",
        },
        {
          title: "Clear pricing, flexible booking",
          body: "Clear pricing and flexible online booking designed to fit healthcare around your schedule, not the other way around.",
        },
        {
          title: "Anywhere in Australia",
          body: "Access care from anywhere in Australia. Continue your consultations whether you are travelling, working remotely, or relocating.",
        },
      ],
    },
    {
      kind: "related",
      eyebrow: "Where to next",
      heading: "Explore your options",
      cards: [
        {
          title: "How it works",
          body: "The four steps from free quiz to ongoing review.",
          links: [{ label: "How it works", href: "/how-it-works/" }],
        },
        {
          title: "Pricing",
          body: "Every consultation fee, shown before you book.",
          links: [{ label: "See full pricing", href: "/pricing/" }],
        },
        {
          /* Added 2026-09-14. The two pages are the same journey: this one is
             why and how, that one is the letter and the 15% off. */
          title: "Discharge letter",
          body: "Bringing a discharge letter from your current prescribing doctor or clinic? Send it through and save 15% on your first consultation.",
          links: [{ label: "Discharge letter", href: "/discharge/" }],
        },
      ],
      footnote: "Still deciding? Read the",
      footnoteLinks: [
        { label: "FAQs", href: "/faqs/" },
        { label: "how it works", href: "/how-it-works/" },
      ],
    },
  ],
  closing: {
    ...STANDARD_CLOSING,
    /* The source's own button for this page, in place of the standard label. */
    primary: { label: "Start your transfer", href: "/quiz/" },
  },
};
