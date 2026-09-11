/**
 * PAGE: CONTINUITY & PREVENTATIVE HEALTH.  ⚠️ REGULATED, DRAFTED HERE.
 *
 * New hub, built to HHCPA_Build_Spec_v2.md §3.2. The spec supplies the URL, the
 * price, the schema name and one verbatim line from her live site; the rest was
 * drafted here under the v2.2 answer to Q12, so it needs Ranjeeta's express
 * written approval before publication like any other regulated page.
 *
 * The verbatim line is the card description and the first thing the intro says,
 * because it is hers and it is accurate: "Chronic disease management, long-term
 * care planning and preventative health support."
 *
 * This is the lowest-risk of the three new hubs. It names conditions and a
 * service and nothing else — there is no product behind it to euphemise, which
 * is what makes the other two need such careful handling. The only thing to
 * watch is the Medicare position: preventative care invites a rebate question,
 * and the answer is the same one the rest of the site gives, from
 * MEDICARE_ANSWER, rather than a friendlier version written for this page.
 *
 * ─── THE QUIZ, AND WHAT IT IS NOT ──────────────────────────────────────────
 *
 * The page starts the quiz, which asks one question — which of her five
 * categories of ongoing care the patient came for — and then takes their
 * details and books them.
 *
 * That is a sub-selection, not screening, and Q30 still stands: there is no
 * assessment form behind this service, nothing here gates eligibility, and
 * nothing feeds triage. The page still advertises no screening step and no
 * duration, and its call to action is to book rather than to be assessed.
 *
 * What changed on 2026-09-11 is where the button goes. It used to go to
 * /services/, which is a menu — it answered "book a consultation" by showing
 * the patient the list of services they had just navigated away from. The
 * five categories come from her own booking wizard, which asked exactly this
 * before sending people to Halaxy; routing through the quiz keeps that
 * question and adds the contact capture, so the enquiry is recorded rather
 * than left in an iframe.
 */

import { PRICES } from "../pricing";
import type { ServicePageData } from "@/components/sections/ServicePage";
import {
  MEDICARE_ANSWER,
  STANDARD_FOOTNOTE,
  STANDARD_FOOTNOTE_LINKS,
  sectionImage,
} from "./shared";
import { CALL_CTA } from "../clinic";

/** Verbatim from her live site (§3.2). Used on the homepage and services grids. */
export const CONTINUITY_CARD =
  "Chronic disease management, long-term care planning and preventative health support.";

export const CONTINUITY_PREVENTATIVE_HEALTH: ServicePageData = {
  meta: {
    title: "Chronic Disease Management & Preventative Health Online | Australia",
    description:
      "Chronic disease management, long-term care planning and preventative health review with AHPRA-registered practitioners. Australia-wide telehealth.",
    path: "/continuity-preventative-health/",
  },
  hero: {
    eyebrow: "Continuity & preventative health",
    heading: "Care that continues between appointments",
    primary: { label: "Start your booking", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  quizService: "Continuity & Preventative Health",
  crumbs: [{ label: "Home", href: "/" }],
  serviceSchemaName: "Continuity and preventative health consultations",
  intro:
    "Chronic disease management, long-term care planning and preventative health support, delivered by telehealth across Australia. Ongoing conditions need someone who knows your history and reviews it with you over time, not a fresh explanation at every appointment. That continuity is the service.",
  /* No quiz: there is no assessment form for this service yet. */
  introCta: { label: "Start your booking", href: "/quiz/" },
  modules: [
    {
      kind: "tiles",
      eyebrow: "What it covers",
      heading: "What this service covers",
      columns: 3,
      tiles: [
        {
          title: "Chronic disease management",
          body: "Ongoing review of long-term conditions, with your practitioner tracking how things are going and adjusting the plan as they change.",
        },
        {
          title: "Long-term care planning",
          body: "Agreeing what your care looks like over months and years rather than one appointment at a time, including when to review and what to watch for.",
        },
        {
          title: "Preventative health review",
          body: "The checks worth doing for your age, history and risk factors, arranged where appropriate and interpreted in the context of your health.",
        },
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "Why continuity matters",
      heading: "Being known is half the care",
      paragraphs: [
        "The hardest part of managing a long-term condition is usually not the condition. It is repeating your history to someone new, chasing results between providers, and losing the thread of what was tried and why. Continuity fixes that by keeping the same practitioner across your reviews, with your record in front of them.",
        "Where a test, an imaging referral or a specialist opinion is warranted, your practitioner arranges it and follows it through, rather than handing you a form and leaving you to it.",
      ],
      cta: { label: "See how it works", href: "/how-it-works/" },
      image: sectionImage("continuity-preventative-health-review"),
      imageAlt:
        "An older man sits at a dining table talking with his practitioner over a tablet.",
    },
    {
      kind: "related",
      eyebrow: "Related services",
      heading: "Explore your options",
      cards: [
        {
          title: "Pathology and imaging referrals",
          body: "Where the tests behind a preventative review are arranged.",
          links: [
            {
              label: "Pathology & imaging referrals",
              href: "/online-doctor/pathology-imaging-referrals/",
            },
          ],
        },
        {
          title: "Health optimisation",
          body: "A structured program for people looking at the wider picture.",
          links: [
            {
              label: "Health optimisation",
              href: "/health-optimisation/",
            },
          ],
        },
        {
          title: "Online doctor",
          body: "Scripts, certificates and referrals for everyday needs.",
          links: [{ label: "Online doctor", href: "/online-doctor/" }],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "pricingCue",
      tinted: true,
      eyebrow: "What it costs",
      heading: "What it costs",
      headline: `from $${PRICES.continuityPreventative.amount}`,
      headlineLabel: "Consultations",
      rows: [
        {
          label: "Standard consultation",
          value: `$${PRICES.firstConsult.amount}`,
        },
      ],
      note: "Pathology, imaging and anything dispensed by a pharmacy are separate from the consultation fee.",
      cta: { label: "See full pricing", href: "/pricing/" },
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "conditions",
        question: "Which conditions can you help manage?",
        answer:
          "Your practitioner can review most stable long-term conditions by telehealth, and will tell you plainly when something needs an in-person examination or a specialist instead.",
      },
      {
        id: "same-practitioner",
        question: "Will I see the same practitioner each time?",
        answer:
          "Continuity is the point of the service, so we aim to keep you with the same practitioner. Where that is not possible, whoever you see has your full record in front of them.",
      },
      {
        id: "gp",
        question: "Does this replace my GP?",
        answer:
          "It does not have to. Many patients use this alongside an existing GP, and your practitioner can share information with them where you consent to it.",
      },
      {
        id: "medicare",
        question: "Do you offer Medicare rebates?",
        answer: MEDICARE_ANSWER,
      },
    ],
  },
  closing: {
    heading: "Professional Healthcare, Wherever You Are",
    body: "Book a consultation with an AHPRA-registered practitioner and start with a proper review of where things stand.",
    primary: { label: "Start your booking", href: "/quiz/" },
  },
};
