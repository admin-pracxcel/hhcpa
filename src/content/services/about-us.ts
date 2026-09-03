/**
 * PAGE 23: ABOUT US.
 *
 * Schema is AboutPage rather than MedicalWebPage, per this page's BUILD BLOCK.
 * It also asks for MedicalOrganization; the layout already emits MedicalClinic
 * on every page, which is a subtype of MedicalOrganization, so it is covered.
 *
 * ⚠️ Module 6, "Meet the team", is the one place on the site where approved
 * copy points at a gated page. Its closing sentence and CTA send the reader to
 * `/our-practitioners/`, which `routes.ts` gates pending Ranjeeta's
 * confirmation and the AHPRA registration numbers — the content document calls
 * that "the single most important compliance fix on the site".
 *
 * So the section renders in two states, driven by the gate itself:
 *   - gated (now): the first sentence only, which is true today and says
 *     registration details are published on practitioner profiles. No link.
 *   - ungated: the full copy and the "Meet our practitioners" button.
 *
 * Linking to it while gated would 404; keeping the sentence that describes a
 * page nobody can open would be worse than omitting it. Ungating the route
 * restores both automatically.
 *
 * ⚠️ Separately: this page names Ranjeeta Roshan as founder. AHPRA's advertising
 * guidelines require a verifiable registration number wherever a *practitioner*
 * is named in advertising. If she is a registered practitioner and will consult
 * under the clinic's name, this mention likely needs her AHPRA number too, not
 * only the practitioners page. Worth confirming before publication.
 */

import { isGated } from "../routes";
import type { ServicePageData } from "@/components/sections/ServicePage";
import { CALL_CTA, CLINIC } from "../clinic";
import {
  IMAGE,
  IMAGE_ALT,
  STANDARD_CLOSING,
  STANDARD_FOOTNOTE,
  STANDARD_FOOTNOTE_LINKS,
} from "./shared";

const PRACTITIONERS = "/our-practitioners/";
const PRACTITIONERS_PUBLISHED = !isGated(PRACTITIONERS);

const TEAM_PARAGRAPHS = [
  "Our care is delivered by AHPRA-registered practitioners whose registration details are published on their profiles.",
  ...(PRACTITIONERS_PUBLISHED
    ? [
        "You can read about them and the services they support on our practitioners page.",
      ]
    : []),
];

export const ABOUT_US: ServicePageData = {
  meta: {
    title: "About Us | Horizon Health Care Partners Australia",
    description:
      "Founded by Ranjeeta Roshan, Horizon Health Care Partners is an Australian telehealth clinic delivering practitioner-led care nationwide. Learn our story.",
    path: "/about-us/",
  },
  pageSchema: "AboutPage",
  hero: {
    eyebrow: "About us",
    heading: "About Horizon Health Care Partners",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  intro: `Horizon Health Care Partners is an Australian telehealth clinic, based in ${CLINIC.addressRegion}, serving patients across the country. We were founded on a straightforward belief: every Australian deserves accessible, practitioner-led healthcare, wherever they live. We are an Australian entity focused on Australian patients, and everything we do runs through AHPRA-registered practitioners.`,
  modules: [
    {
      kind: "split",
      tinted: true,
      eyebrow: "Our story",
      heading: "Our story",
      paragraphs: [
        "Horizon Health Care Partners was founded by Ranjeeta Roshan, who saw the same gap again and again. Patients with ongoing or complex needs struggled to get consistent, unhurried care, especially in regional and remote areas, and especially for the concerns people find hardest to raise. Many felt rushed, dismissed, or lost in a fragmented system.",
        "We built Horizon to change that. Through a secure telehealth platform, patients connect with qualified, AHPRA-registered practitioners from home. The mission is simple to say and demanding to deliver: accessible, professional consultations that help people take control of their health with confidence and dignity.",
      ],
      image: IMAGE.ourStory,
      imageAlt: IMAGE_ALT.ourStory,
    },
    {
      kind: "statement",
      eyebrow: "Clinical standards",
      heading: "Every consultation, by a registered practitioner",
      paragraphs: [
        "Every consultation at Horizon Health Care Partners is delivered by an AHPRA-registered practitioner, and every recommendation is made in line with Australian medical regulation. As the practice brings additional practitioners on board across weight management, men's and women's health, and everyday medical needs, each clinician's registration will be published on their profile before they begin consulting under our name.",
      ],
    },
    {
      kind: "tiles",
      eyebrow: "What we stand for",
      heading: "What we stand for",
      columns: 2,
      tiles: [
        {
          title: "Access",
          body: "Geography should never decide the quality of your care. We serve metro, regional and remote Australia equally.",
        },
        {
          title: "Transparency",
          body: "Clear pricing, honest advice, and a straight answer when telehealth is not the right path.",
        },
        {
          title: "Respect",
          body: "Sensitive concerns handled without judgement, in private.",
        },
        {
          title: "Clinical standards",
          body: "Registered practitioners, real consultations, and full compliance with Australian regulation.",
        },
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "Meet the team",
      heading: "The people behind the care",
      paragraphs: TEAM_PARAGRAPHS,
      ...(PRACTITIONERS_PUBLISHED
        ? { cta: { label: "Meet our practitioners", href: PRACTITIONERS } }
        : {}),
      image: IMAGE.approach,
      imageAlt: IMAGE_ALT.approach,
      imageSide: "left",
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
          title: "Our practitioners",
          body: "Registration details for every practitioner who consults with us.",
          links: [{ label: "Our practitioners", href: PRACTITIONERS }],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "founder",
        question: "Who founded Horizon Health Care Partners?",
        answer:
          "The clinic was founded by Ranjeeta Roshan to improve access to quality, practitioner-led healthcare for Australians who face barriers to traditional services.",
      },
      {
        id: "based",
        question: "Where are you based?",
        answer: `We are an Australian telehealth clinic based in ${CLINIC.addressRegion}, serving patients nationwide.`,
      },
      {
        id: "registered",
        question: "Are your practitioners registered?",
        answer:
          "Yes. Every practitioner is AHPRA-registered, and registration details are shown on their profiles.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
