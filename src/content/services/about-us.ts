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
import { CALL_CTA } from "../clinic";
import { STANDARD_CLOSING, STANDARD_FOOTNOTE, STANDARD_FOOTNOTE_LINKS, sectionImage } from "./shared";

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
    /*
     * §4.4.1. The eyebrow is also the final breadcrumb and the last name in
     * this page's BreadcrumbList schema, so the descriptor she asked for under
     * the title is a `subheading`, not an eyebrow.
     */
    eyebrow: "About us",
    heading: "Your Health Journey Begins",
    subheading: "Medical Consultations with Registered Healthcare Professionals",
    /*
     * §2.4 protects this hero by name: "the hero showing the river and trees".
     * It is a video on her live site, so it is one here. Retrieved from her
     * site under the v2.2 authorisation in Q9.
     */
    media: {
      src: "/videos/about-hero.mp4",
      poster: "/images/about-hero-poster.webp",
      alt: "An aerial view at dawn over forest and still water, low mist across the trees.",
    },
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  /*
   * §4.4.2, her copy, verbatim. It replaces the whole paragraph and supersedes
   * the individual edits she had asked for about West End, "across the
   * country" and "wherever they live" — she asked for the lot replaced rather
   * than patched. Neither "West End" nor "across the country" survives
   * anywhere on the page, which §9 checks.
   */
  intro: [
    "Horizon Health Care Partners Australia is an Australian telehealth clinic providing professional healthcare to patients across Australia.",
    "We were founded on a simple belief: every Australian should have access to quality, practitioner-led healthcare, wherever they live.",
    "Our care is delivered by AHPRA-registered healthcare practitioners, with a focus on accessibility, professionalism, personalised care and genuine patient support. Through convenient telehealth consultations, we make it easier for Australians to access the healthcare they need from the comfort and privacy of home.",
    "Australian healthcare. Australian practitioners. Care centred around you.",
  ],
  modules: [
    {
      kind: "split",
      tinted: true,
      eyebrow: "Our story",
      heading: "Our story",
      /*
       * §4.4.3, her original, verbatim. The staging version was a rewrite and
       * she asked for hers back.
       *
       * "Healthcare Practitioner Ranjeeta Roshan" is her own title and stays
       * exactly as written. Do not upgrade it to "Dr" anywhere on this site:
       * her separate live site does, and that is a live-site problem, not a
       * licence to repeat it here.
       */
      paragraphs: [
        "Horizon Health Care Partners was founded by Healthcare Practitioner Ranjeeta Roshan on a simple but powerful belief: every Australian deserves access to compassionate, evidence-based healthcare, no matter where they live. She recognised a significant gap in our healthcare system. Patients with complex, chronic conditions often struggle to access good practitioners, particularly those in regional areas or with limited mobility. Many felt unheard, dismissed, or overwhelmed by a fragmented system.",
        "We established Horizon Health Care Partners to change that narrative. Through our secure telehealth platform, patients can now connect with qualified AHPRA-registered practitioners from the comfort of their own homes. Our mission is clear: provide accessible, professional medical consultations that empower patients to take control of their health journey with confidence and dignity.",
        "At Horizon Health Care Partners, we understand that seeking medical support can feel daunting. That's why we've built our practice on transparency, education, and compassion. Every consultation is conducted with care and respect, ensuring you feel heard, supported, and fully informed. Our experienced practitioners take time to understand your unique medical history, current symptoms, and personal goals.",
        "We work collaboratively with you to develop a personalised care plan that aligns with your needs. We believe in caring for the whole person, not just the condition. Whether you're exploring care options for the first time or seeking continuity of care, we're here to guide you every step of the way without judgment.",
        "What sets us apart is our unwavering commitment to clinical excellence and patient-centred care. We operate with full compliance to Australian medical regulations, ensuring every consultation and recommendation meets the highest standards of safety and professionalism. Our telehealth platform makes accessing quality healthcare simple and convenient, with flexible appointment times including after-hours and same-day consultations.",
        "We serve patients across Australia, from metropolitan cities to remote regional communities, because geography should never be a barrier to expert medical care. At Horizon Health Care Partners, you're not just a patient number. You're a valued individual deserving of respect, compassion, and the very best healthcare Australia has to offer.",
      ],
      image: sectionImage("about-us-our-story"),
      imageAlt:
        "A woman on a verandah in regional Australia has a video consultation on a laptop.",
    },
    {
      kind: "statement",
      eyebrow: "Clinical standards",
      heading: "Every consultation, by a registered practitioner",
      paragraphs: [
        /* §4.4.5: the service list widened from three areas to the eight. */
        "Every consultation at Horizon Health Care Partners is delivered by an AHPRA-registered practitioner, and every recommendation is made in line with Australian medical regulation. As the practice brings additional practitioners on board across weight management, health optimisation, men's and women's health, mental health, everyday medical needs, continuity and preventative health, and holistic care, each clinician's registration will be published on their profile before they begin consulting under our name.",
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
      image: sectionImage("about-us-meet-the-team"),
      imageAlt:
        "Two health practitioners stand talking together in a bright workspace.",
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
        /*
         * §4.4.2 and §9: "West End" must not survive anywhere on this page.
         * Her replacement copy drops the locality entirely and says the clinic
         * is Australian and serves Australia, so this answer says the same.
         * CLINIC.addressRegion is still the registered address and is kept in
         * clinic.ts for the entity record; it is simply not advertised.
         */
        answer:
          "We are an Australian telehealth clinic serving patients nationwide, from metropolitan cities to remote regional communities.",
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
