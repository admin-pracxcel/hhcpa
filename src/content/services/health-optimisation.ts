/**
 * PAGE: HEALTH OPTIMISATION & COMPLETE WELLNESS.  ⚠️ REGULATED, DRAFTED HERE.
 *
 * New hub, built to HHCPA_Build_Spec_v2.md §3.1. Unlike every other page on the
 * site, the body copy below was **not** supplied by the client — the spec gives
 * the title, H1, price, schema, the seven sub-area names and a set of content
 * rules, and instructs the build team to draft the rest (v2.2 answer to Q12).
 * It is therefore regulated copy awaiting Ranjeeta's express written approval
 * under clause 6.2(b), and nothing here is approved by silence.
 *
 * ─── WHY THIS PAGE IS WRITTEN THE WAY IT IS ────────────────────────────────
 *
 * This is the highest-risk page on the site, and the risk is specific. The
 * client offered pepticlinic.com.au as a compliance model. That site presents
 * as a wellness clinic on the page while its metadata advertises prescription
 * peptide therapy, and its "choose your health goal" tiles map almost exactly
 * onto the seven sub-areas below. §7.1 rules it out as a model precisely
 * because the resemblance is the trap: the same seven headings can be an
 * honest description of what a practitioner assesses, or a product menu with
 * the product's name removed. The difference is in what each section says.
 *
 * So each sub-area answers three questions and no others: what the concern is,
 * what the assessment looks at, and what ongoing review involves. None of them
 * says what is prescribed, implies that something is, or promises an outcome.
 * That is §3.1's "do not build the seven sub-areas as a product or indication
 * menu", and it is the whole design of this file.
 *
 * Three further rules from §3.1, all load-bearing:
 *   - No medicine, class, compound or brand anywhere, including metadata, alt
 *     text and schema. `restricted-terms.test.ts` enforces it.
 *   - No longevity, anti-ageing or performance outcome claims. "Healthy ageing"
 *     names a concern; "slow ageing" would be a claim. The copy stays on the
 *     first side of that line throughout.
 *   - Sexual Health & Wellbeing is deliberately three sentences and two links.
 *     The conditions belong to /mens-health and /womens-health, which already
 *     cover them properly; duplicating them here would split the ranking signal
 *     and give this page a symptom list it does not need.
 *
 * Sub-area 1 is "Metabolic Health", not her diagram's "Weight Management &
 * Metabolic Health". §3.1 makes the rename a build decision pending her
 * confirmation, on the grounds that this page and /weight-management would
 * otherwise compete for the same queries and the separation she asked for would
 * not happen. If she declines the rename, the label reverts and the copy still
 * stays weight-neutral.
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

/** The card description used on the homepage and services grids (§3.1). */
export const HEALTH_OPTIMISATION_CARD =
  "Comprehensive programs focused on energy, recovery, healthy ageing and long-term health.";

export const HEALTH_OPTIMISATION: ServicePageData = {
  meta: {
    title: "Health Optimisation & Wellness Programs Online | Australia",
    description:
      "Practitioner-led health optimisation and wellness programs, assessed online by AHPRA-registered practitioners. Australia-wide telehealth, with ongoing review.",
    path: "/health-optimisation/",
  },
  hero: {
    eyebrow: "Health optimisation",
    heading:
      "Health optimisation and complete wellness, guided by AHPRA-registered practitioners",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  serviceSchemaName: "Health optimisation and wellness programs",
  intro:
    "Health optimisation is what happens when someone looks at your whole picture rather than one symptom at a time. At Horizon Health Care Partners, an AHPRA-registered practitioner reviews your health history, your goals and, where useful, your pathology, and agrees a plan with you that is reviewed as your circumstances change. It is a structured program rather than a one-off appointment, and it starts with an assessment, not with a product.",
  modules: [
    {
      kind: "split",
      tinted: true,
      eyebrow: "How it works",
      heading: "What a health optimisation program involves",
      paragraphs: [
        "Your practitioner starts by understanding where you are: your history, your current medications, how you sleep, how you recover, and what you are actually trying to change. Where it would inform the plan, they arrange pathology so decisions rest on your own results rather than on assumptions.",
        "From there you agree an approach together and review it over time. What that approach involves is a clinical decision made in your consultation, based on your individual circumstances. We do not name or promote specific treatments on this page, and we do not sell them. Your practitioner discusses suitable options with you directly, in private.",
      ],
      cta: { label: "Book a consultation", href: "/quiz/" },
      image: sectionImage("health-optimisation-how-it-works"),
      imageAlt:
        "A woman reviews her pathology results with a practitioner during a video consultation at home.",
    },
    {
      kind: "tiles",
      eyebrow: "What we look at",
      heading: "The areas a program can cover",
      columns: 2,
      tiles: [
        {
          title: "Metabolic health",
          body: "How your body handles energy, and what your markers say about it. Your practitioner reviews the relevant pathology, considers your history and other conditions, and agrees what is worth tracking over time.",
        },
        {
          title: "Healthy ageing and longevity",
          body: "The concerns that tend to arrive with age, and which of them are worth investigating in your case. Assessment looks at your history, your family history and your current markers, and review keeps that picture current rather than fixed at one point in time.",
        },
        {
          title: "Recovery and physical wellbeing",
          body: "Slow recovery, persistent soreness and reduced capacity have many causes, and several of them are checkable. Your practitioner assesses what is contributing in your case, and reviews whether it is shifting.",
        },
        {
          title: "Mental clarity and focus",
          body: "Difficulty concentrating overlaps with sleep, stress, mood, thyroid function and nutrient status. Assessment looks for what is driving it rather than treating it as a single thing, and may involve pathology or a referral.",
        },
        {
          title: "Energy, vitality and wellness",
          body: "Persistent tiredness is one of the most common reasons people book, and one of the least specific. Your practitioner works through the possibilities properly, which is the part that a symptom-led approach usually skips.",
        },
        {
          /*
           * The seventh area, inside the list rather than beside it.
           *
           * It was a section of its own headed "Sexual health is handled on
           * its own pages", which satisfied §3.1's no-duplication rule but
           * left her list of seven reading as six. The 11 September audit
           * caught that. It is three sentences and two links: the conditions
           * belong to the men's and women's health pages, which cover them
           * properly, so nothing is duplicated and nothing cannibalises.
           */
          title: "Sexual health and wellbeing",
          body: "Sexual health sits within health optimisation for many people, and it is assessed properly rather than in passing. The conditions involved have their own assessment pathways, so they are covered on our men's health and women's health pages rather than repeated here. If that is your main concern, start there; if it is one part of a wider picture, your practitioner covers it within your program.",
        },
        {
          title: "General wellness optimisation",
          body: "For people who want structure and a practitioner in their corner rather than a particular problem solved. Assessment establishes a baseline, and review keeps the plan honest as things change.",
        },
      ],
    },
    {
      kind: "statement",
      eyebrow: "Why review matters",
      heading: "A program is the review, not the plan",
      paragraphs: [
        "Anyone can write a plan. What changes the result is someone looking at it again with you: checking whether it is working, whether anything has shifted, and whether the original reasoning still holds. That is what makes this a program rather than an appointment, and it is why your practitioner agrees a review schedule with you rather than leaving you to it.",
        "Outcomes vary between people, and nothing here is guaranteed. Your practitioner will tell you honestly if a different pathway would serve you better, or if the evidence for something does not support it in your case.",
      ],
    },
    {
      kind: "related",
      tinted: true,
      eyebrow: "Related services",
      heading: "Explore your options",
      cards: [
        {
          title: "Weight management",
          body: "Medically supervised weight management, assessed and reviewed on its own pathway.",
          links: [{ label: "Weight management", href: "/weight-management/" }],
        },
        {
          title: "Men's and women's health",
          body: "Where the hormone and sexual health conditions are assessed properly.",
          links: [
            { label: "Men's health", href: "/mens-health/" },
            { label: "Women's health", href: "/womens-health/" },
          ],
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
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "pricingCue",
      eyebrow: "What it costs",
      heading: "What a program costs",
      headline: `from $${PRICES.healthProgram.amount}`,
      headlineLabel: "Programs",
      rows: [
        { label: "Pre-screening quiz", value: "Free" },
        {
          label: "Standard consultation",
          value: `$${PRICES.firstConsult.amount}`,
        },
      ],
      note: "Pathology, imaging and anything dispensed by a pharmacy are separate from the consultation fee. There is no commitment until you decide to book.",
      cta: { label: "See full pricing", href: "/pricing/" },
    },
    {
      kind: "inlineCta",
      ...howToBegin(
        "Start with the free pre-screening quiz, then book a time that suits you. Fees are on our ",
      ),
    },
  ],
  faq: {
    heading: "Common questions about health optimisation",
    items: [
      {
        id: "what-it-is",
        question: "What is health optimisation?",
        answer:
          "It is a structured, practitioner-led program that looks at your health as a whole rather than one symptom at a time. Your practitioner assesses your history and, where useful, your pathology, agrees a plan with you, and reviews it over time.",
      },
      {
        id: "assessment",
        question: "Will I need blood tests?",
        answer:
          "Sometimes. Your practitioner arranges pathology where it would genuinely inform the plan, and explains what the results mean in the context of your symptoms and history rather than in isolation.",
      },
      {
        id: "prescription",
        question: "Will I be prescribed something?",
        answer:
          "Not necessarily. Any prescribing is a clinical decision made in your consultation, only where it is appropriate and safe for you. Many programs are managed without it, and a prescription is never guaranteed.",
      },
      {
        id: "difference",
        question: "How is this different from weight management?",
        answer:
          "Weight management is its own pathway, with its own assessment and its own program. Health optimisation is broader. If weight is your main concern, start on the weight management page.",
      },
      {
        id: "how-long",
        question: "How long does a program run?",
        answer:
          "It is ongoing and paced to you. Your practitioner agrees a review schedule with you at the outset and adjusts it as your circumstances change.",
      },
    ],
  },
  closing: standardClosing(SCREENING_MINUTES.healthOptimisation),
};
