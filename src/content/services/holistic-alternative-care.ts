/**
 * PAGE: HOLISTIC CARE / ALTERNATIVE MEDICINE.  ⚠️ REGULATED, DRAFTED HERE.
 *
 * New hub, built to HHCPA_Build_Spec_v2.md §3.3. The spec supplies the URL, the
 * price, the schema name and one verbatim line from her live site; the rest was
 * drafted here under the v2.2 answer to Q12, so it needs Ranjeeta's express
 * written approval before publication.
 *
 * ─── READ THIS BEFORE EDITING A WORD OF IT ─────────────────────────────────
 *
 * The client has defined this service internally as the medicinal cannabis
 * service, in writing. The service area is legitimate and her own live-site
 * description of it is compliant. What must never happen is a public signal
 * connecting this page to that prescription. §3.3 is unambiguous:
 *
 *   - Never name cannabis, medicinal cannabis, THC, CBD, plant medicine or any
 *     equivalent, in copy, headings, URLs, metadata, alt text, schema, image
 *     filenames or the quiz. `restricted-terms.test.ts` fails the build on all
 *     of them.
 *   - Do not present the page as a route to obtaining any prescription.
 *   - Write it as genuine whole-person care across chronic conditions, pain,
 *     sleep and wellbeing, coordinating with medical care.
 *
 * The reasoning matters more than the word list, because a word list can be
 * evaded and the evasion is the offence. The TGA has enforced against
 * euphemisms used as product promotion. A euphemism is only a problem when the
 * page signals what it stands in for — through a narrow indication list, a
 * contraindication set that reads as a screening protocol, an eligibility
 * framing, or a call to action about getting approved. Keep the page genuinely
 * broad and it is fine, and that is what the copy below tries to be: it
 * describes assessment and coordination, and it never once implies that
 * something specific is waiting at the end.
 *
 * That is also why the call to action here is to book a consultation rather
 * than to "check your eligibility". Eligibility framing is the exact pattern
 * that made the old medicinal cannabis page the highest-risk page on the site
 * before it was removed.
 *
 * The pre-screening form for this service (HHCPA-FRM-003) names no medicine
 * and is compliant as supplied, but its indication and contraindication set is
 * recognisable to anyone who knows the field. That is a further reason this
 * page stays inside the description agreed in §3.3 and does not elaborate.
 */

import { PRICES } from "../pricing";
import type { ServicePageData } from "@/components/sections/ServicePage";
import {
  SCREENING_MINUTES,
  STANDARD_FOOTNOTE,
  STANDARD_FOOTNOTE_LINKS,
  howToBegin,
  sectionImage,
  standardClosing,
} from "./shared";
import { CALL_CTA } from "../clinic";

/** Verbatim from her live site (§3.3). Used on the homepage and services grids. */
export const HOLISTIC_CARE_CARD =
  "A personalised approach supporting chronic conditions, pain, sleep and overall wellbeing through evidence-based treatment options.";

export const HOLISTIC_ALTERNATIVE_CARE: ServicePageData = {
  meta: {
    title: "Holistic & Alternative Care Consultations Online | Australia",
    description:
      "Whole-person care for chronic conditions, pain, sleep and wellbeing, assessed online by AHPRA-registered practitioners. Australia-wide telehealth.",
    path: "/holistic-alternative-care/",
  },
  hero: {
    eyebrow: "Holistic & alternative care",
    heading: "Whole-person care, assessed by registered practitioners",
    primary: { label: "Book a consultation", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  serviceSchemaName: "Holistic and alternative care consultations",
  /*
   * §3.3 bars eligibility framing on this page, and `LeadParagraph` defaults
   * its call to action to "Check your eligibility" — which is how that exact
   * phrase reached a page whose header warns against it. Set explicitly.
   */
  introCta: { label: "Book a consultation", href: "/quiz/" },
  intro:
    "A personalised approach supporting chronic conditions, pain, sleep and overall wellbeing through evidence-based treatment options. Holistic care means your practitioner considers the whole picture rather than one complaint in isolation, and coordinates with the rest of your medical care rather than working around it.",
  modules: [
    {
      kind: "split",
      tinted: true,
      eyebrow: "What it means here",
      heading: "Whole-person, and still evidence-led",
      paragraphs: [
        "Holistic care is often used to mean care that sits outside conventional medicine. That is not what it means here. Every consultation is with an AHPRA-registered practitioner, every recommendation is made on the evidence available, and your practitioner will tell you plainly where the evidence is thin.",
        "What makes it holistic is scope. Pain, sleep, mood, stress and daily function affect each other, and treating any one of them without the others tends not to hold. Your practitioner assesses how they interact for you, agrees an approach, and reviews it over time.",
      ],
      cta: { label: "See how it works", href: "/how-it-works/" },
      image: sectionImage("holistic-alternative-care-whole-person"),
      imageAlt:
        "A woman sits by a window with a cup of tea during a phone consultation.",
    },
    {
      kind: "checklist",
      eyebrow: "Who it may suit",
      heading: "Who a holistic care consultation may suit",
      intro: "A consultation may be worth booking if you recognise some of the following:",
      items: [
        "You are living with a long-term condition that affects more than one part of your life.",
        "Persistent pain, poor sleep or low mood are feeding into each other and you have been treating them separately.",
        "You want your care coordinated by someone who has the whole history in front of them.",
        "You would rather have this conversation privately, from home.",
      ],
      caveat:
        "A consultation may not be the right step if your symptoms are new, severe or worsening quickly, or if you need an in-person examination. Your practitioner will tell you honestly if that is the case, and will refer you where a different pathway would serve you better.",
    },
    {
      kind: "steps",
      eyebrow: "How it works",
      heading: "How a holistic care consultation works",
      steps: [
        {
          pill: "Pre-screening",
          title: "Free pre-screening",
          description:
            "A short set of questions about your symptoms, your history and how things are affecting you. It is free, it is not a diagnosis, and nothing is decided from it alone.",
        },
        {
          pill: "Consultation",
          title: "A real consultation",
          description:
            "You speak with an AHPRA-registered practitioner by video or phone. They review your history, your current medications and what you have already tried.",
        },
        {
          pill: "A plan",
          title: "An agreed plan",
          description:
            "Together you agree an approach. What that involves is a clinical decision made in your consultation, based on your circumstances. Nothing is guaranteed, and your practitioner will say so where the evidence does not support something.",
        },
        {
          pill: "Review",
          title: "Ongoing review",
          description:
            "You are seen again on a schedule that suits you, so the plan can be adjusted rather than left to run.",
        },
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
    },
    {
      kind: "statement",
      eyebrow: "Working with your other care",
      heading: "We coordinate, we do not replace",
      paragraphs: [
        "Most people using this service already have a GP, a specialist, or both. Holistic care works alongside them. With your consent, your practitioner can share relevant information so everyone treating you is working from the same picture, and can refer you on where something needs a different kind of assessment.",
        "If you are moving your care across from another provider, a transfer consultation is the place to start.",
      ],
    },
    {
      kind: "related",
      tinted: true,
      eyebrow: "Related services",
      heading: "Explore your options",
      cards: [
        {
          title: "Transfer your care",
          body: "Moving across from another provider, with continuity and no disruption.",
          links: [{ label: "Transfer your care", href: "/discharge/" }],
        },
        {
          title: "Continuity and preventative health",
          body: "Chronic disease management and long-term care planning.",
          links: [
            {
              label: "Continuity & preventative health",
              href: "/continuity-preventative-health/",
            },
          ],
        },
        {
          title: "Mental health support",
          body: "Where mood, anxiety and sleep are the main concern.",
          links: [
            {
              label: "Mental health support",
              href: "/online-doctor/mental-health/",
            },
          ],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "pricingCue",
      eyebrow: "What it costs",
      heading: "What it costs",
      headline: `from $${PRICES.holisticCare.amount}`,
      headlineLabel: "Consultations",
      rows: [
        { label: "Pre-screening", value: "Free" },
        {
          label: "Transfer consultation",
          value: `$${PRICES.transferConsult.amount}`,
        },
      ],
      note: "Anything dispensed by a pharmacy is separate from the consultation fee. There is no commitment until you decide to book.",
      cta: { label: "See full pricing", href: "/pricing/" },
    },
    {
      kind: "inlineCta",
      ...howToBegin(
        "Start with the free pre-screening, then book a time that suits you. Fees are on our ",
      ),
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "what-it-is",
        question: "What does holistic care mean at Horizon?",
        answer:
          "Care that considers your whole situation rather than one symptom at a time, delivered by an AHPRA-registered practitioner and coordinated with the rest of your medical care. It is evidence-led, and your practitioner will tell you where the evidence is limited.",
      },
      {
        id: "conditions",
        question: "What can it help with?",
        answer:
          "Commonly chronic pain, sleep difficulties, stress and the way long-term conditions affect daily life. Your practitioner assesses what is going on for you and refers you on where a different pathway is more appropriate.",
      },
      {
        id: "gp",
        question: "Do I need to stop seeing my GP?",
        answer:
          "No. This works alongside your existing care, and with your consent your practitioner can share information so everyone is working from the same picture.",
      },
      {
        id: "treatment",
        question: "Will I be prescribed something?",
        answer:
          "Not necessarily. Any prescribing is a clinical decision made in your consultation, only where it is appropriate and safe for you, and it is never guaranteed. Many plans are managed without it.",
      },
      {
        id: "transfer",
        question: "Can I transfer my existing care to you?",
        answer:
          "Yes. A transfer consultation lets a Horizon practitioner review your current treatment and records so your care continues without disruption. See our transfer your care page.",
      },
    ],
  },
  closing: standardClosing(SCREENING_MINUTES.holisticCare),
};
