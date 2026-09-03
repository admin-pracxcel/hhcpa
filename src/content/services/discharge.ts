/**
 * PAGE 28: TRANSFER YOUR CARE / DISCHARGE.
 *
 * The shortest page in the document: four modules, no trust strip and no FAQ,
 * so the template omits both rather than padding the page out with sections its
 * map does not call for.
 *
 * Two things the BUILD BLOCK leaves out, and how they are handled:
 *
 *   - It lists no Schema line at all, unlike every other page. MedicalWebPage
 *     and BreadcrumbList are emitted anyway, on the basis that the omission
 *     reads as an oversight rather than an instruction to publish a page with
 *     no structured data. No FAQPage, since there is no FAQ.
 *   - It lists no closing band, but the copy ends with two buttons,
 *     [Start your transfer] and [Call 1300 336 572]. Those are exactly what the
 *     closing band renders, so it carries them.
 *
 * The $54 in the source's intro is read from pricing.ts instead of written out,
 * like every other price on the site.
 */

import { PRICES } from "../pricing";
import type { ServicePageData } from "@/components/sections/ServicePage";
import { IMAGE, IMAGE_ALT, STANDARD_CLOSING, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const DISCHARGE: ServicePageData = {
  meta: {
    title: "Transfer Your Care | Discharge & Continuity | HHCPA",
    description: `Moving your care to Horizon Health Care Partners is simple. Transfer consultations from $${PRICES.transferConsult.amount}, with continuity and no disruption. Australia-wide telehealth.`,
    path: "/discharge/",
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
