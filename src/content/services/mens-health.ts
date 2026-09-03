/**
 * PAGE 5: MEN'S HEALTH (HUB).
 *
 * A silo entry page, so it declares Service schema — the treatment pages
 * beneath it do not, following each page's own BUILD BLOCK.
 *
 * Module 4, "What we help with", is four areas each with its own destination,
 * so it renders as link cards rather than the map's icon tiles: tiles have
 * nowhere to put a link, and the links are the point of a hub page.
 */

import { PRICES } from "../pricing";
import type { ServicePageData } from "@/components/sections/ServicePage";
import { STANDARD_CLOSING, STANDARD_FOOTNOTE, STANDARD_FOOTNOTE_LINKS, howToBegin, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const MENS_HEALTH: ServicePageData = {
  meta: {
    title: "Men's Health Clinic Online | ED, TRT & More | AU",
    description:
      "Discreet men's health consultations online. Talk to an AHPRA-registered practitioner about ED, low testosterone, hair loss and more. Australia-wide telehealth.",
    path: "/mens-health/",
  },
  hero: {
    eyebrow: "Men's health",
    heading: "Men's health, handled discreetly and online",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  trust: [
    "AHPRA-registered practitioners",
    "Private and discreet",
    "Australia-wide",
    "Real consultations, not questionnaires",
  ],
  intro:
    "A men's health clinic online removes the two things that stop men getting help: the waiting room and the awkward conversation. At Horizon Health Care Partners, you speak with an AHPRA-registered practitioner in private, from home, about the things that are genuinely affecting you. Erections. Energy. Testosterone. Hair. Performance. These are common, they are treatable in many cases, and they deserve a proper assessment rather than a guess from an internet forum.",
  serviceSchemaName: "Men's health consultations",
  modules: [
    {
      kind: "related",
      eyebrow: "What we help with",
      heading: "Men's health areas we consult on",
      cards: [
        {
          title: "Erectile dysfunction",
          body: "Assessment and, where appropriate, treatment for difficulty getting or keeping an erection.",
          links: [
            {
              label: "Erectile dysfunction",
              href: "/mens-health/erectile-dysfunction-treatment/",
            },
          ],
        },
        {
          title: "Low testosterone and TRT",
          body: "Symptoms like low energy, low mood, poor recovery and reduced libido, assessed properly with pathology where needed.",
          links: [
            {
              label: "Testosterone replacement",
              href: "/mens-health/testosterone-replacement-therapy/",
            },
          ],
        },
        {
          title: "Premature ejaculation",
          body: "Discreet assessment and management options.",
          links: [
            {
              label: "Premature ejaculation",
              href: "/mens-health/premature-ejaculation-treatment/",
            },
          ],
        },
        {
          title: "Hair loss",
          body: "Options for male pattern hair loss, discussed honestly.",
          links: [
            { label: "Hair loss", href: "/mens-health/hair-loss-treatment/" },
          ],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "statement",
      eyebrow: "Why men delay",
      heading: "Getting it looked at is the hard part",
      paragraphs: [
        "Most men wait far too long with symptoms that are common and manageable. Part of that is stigma. Part of it is the hassle of booking and sitting in a clinic to discuss something private. Telehealth solves the second problem completely. You have the conversation from wherever you are comfortable, with a registered practitioner who has had it many times before. What feels like a big deal to raise is often a routine consult for them.",
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "How it works",
      heading: "How a men's health consultation works",
      paragraphs: [
        "Take the free pre-screening quiz, book a time that suits you, and speak with an AHPRA-registered practitioner by video or phone. They review your history, discuss your options, and arrange tests or eligible prescriptions where appropriate. Follow-up is part of the service.",
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
      image: sectionImage("mens-health-how-it-works"),
      imageAlt:
        "A man at a kitchen bench speaks with a practitioner over a laptop video call.",
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
        id: "private",
        question: "Is it really private?",
        answer:
          "Yes. Consultations are one to one with a registered practitioner, and your information is kept confidential. Nothing is shared without your consent.",
      },
      {
        id: "first-consult",
        question: "Will I get treatment on the first consult?",
        answer:
          "Sometimes, where it is clinically appropriate and safe. Sometimes your practitioner will arrange tests first. Treatment is never automatic.",
      },
      {
        id: "medicare",
        question: "Do you bulk bill or offer Medicare rebates?",
        answer:
          "Some telehealth consultations may attract a Medicare rebate in certain circumstances. Check with Medicare, and we can provide documentation to support a claim.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
