/**
 * PAGE 21: HOW IT WORKS.
 *
 * The one page where the map's step cards and the copy agree completely: four
 * genuinely numbered steps. Everything the nineteen service pages link to as
 * "the full process" is here.
 *
 * Two notes on fidelity to the source:
 *
 *   - The source marks each of the four steps as its own H2. They render as
 *     card headings under a single section H2 instead. Four H2s that all read
 *     "Step N: ..." would flatten the page's outline for anyone navigating by
 *     heading, and the step cards already convey the sequence.
 *   - The source gives no section-level heading above the steps, so "The four
 *     steps" is the map's own name for the module rather than invented copy.
 *
 * Module 6 is the emergency callout. It takes the dark band, the only inverted
 * section on the page, so 000, Lifeline and Beyond Blue cannot be skimmed past.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { STANDARD_CLOSING } from "./shared";
import { CALL_CTA, EMERGENCY_LINE } from "../clinic";

export const HOW_IT_WORKS: ServicePageData = {
  meta: {
    title: "How It Works | Online Telehealth Consultations | HHCPA",
    description:
      "Four simple steps: free pre-screening quiz, book, consult with an AHPRA-registered practitioner, and ongoing support. See how HHCPA telehealth works.",
    path: "/how-it-works/",
  },
  hero: {
    eyebrow: "How it works",
    heading: "How it works: from pre-screening to ongoing care in four steps",
    /* Same treatment as /about-us/ and /pricing/: her footage, a poster cut
       from its first frame so the band is never empty while the video loads. */
    media: {
      src: "/videos/how-it-works-hero.mp4",
      poster: "/images/how-it-works-hero-poster.webp",
      alt: "A woman stands by a curtained window, looking down at the phone in her hand.",
    },
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  intro:
    "Getting care with Horizon Health Care Partners is deliberately simple. You start with a free quiz, you book when it suits you, you speak with a registered practitioner, and you get ongoing support where your care continues. Here is exactly what happens at each step, so there are no surprises.",
  modules: [
    {
      kind: "steps",
      eyebrow: "How it works",
      heading: "The four steps",
      steps: [
        {
          pill: "Step 1",
          title: "Take the free pre-screening quiz",
          description:
            "Answer a few short questions about what is going on. This helps us understand your situation and see whether we are likely to be able to help. The quiz takes a few minutes, it is free, and it is not a diagnosis. Nothing is decided from the quiz alone.",
        },
        {
          pill: "Step 2",
          title: "Book your consultation",
          description:
            "Choose a time that suits you and book online. Consultations happen by video or phone, so you can attend from anywhere in Australia. Same-day, after-hours and priority options are available.",
        },
        {
          pill: "Step 3",
          title: "Speak with an AHPRA-registered practitioner",
          description:
            "Your practitioner reviews your history, asks about your symptoms and goals, and discusses your options. Where it helps, they arrange pathology or imaging. Where treatment is appropriate, they explain it clearly. A prescription is never guaranteed, and any prescription follows this real consultation.",
        },
        {
          pill: "Step 4",
          title: "Ongoing support and follow-up",
          description:
            "Where your care continues, we handle reviews, follow-up consultations, and eligible prescriptions. You are not left to manage things alone after the first appointment.",
        },
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
    },
    {
      kind: "tiles",
      tinted: true,
      eyebrow: "What you need",
      heading: "What you need to get started",
      tiles: [
        {
          title: "A device",
          body: "A phone, tablet or computer with a camera or phone line.",
        },
        {
          title: "A private space",
          body: "A quiet, private space for your consultation.",
        },
        {
          title: "A few minutes",
          body: "A few minutes to complete the free pre-screening quiz.",
        },
      ],
    },
    /*
     * §4.2 items 2 and 3, her two sections from the live how-it-works page,
     * in her order and her design.
     *
     * They were read as one section and rebuilt as a two-column tile grid,
     * on the reasoning that "Our Approach to Care" and "How We Support You"
     * were the same four items under two names. They are not. Checked
     * against her live DOM at 1534px, sections 3 and 4 of that page:
     *
     *   3. eyebrow "Our Approach to Care", h2 "How We Support You", a lead
     *      paragraph, four accordion items and a quiz CTA, on the dark fill
     *      with a photograph filling the right half.
     *   4. eyebrow "How We Support You", h2 "Professional Medical
     *      Consultations", then the five-card marquee.
     *
     * "How We Support You" appears in both — as the heading of one and the
     * eyebrow of the next — which is what made them look like one section.
     * The tile grid lost the accordion, the image, the lead paragraph, the
     * CTA and the whole second section with it.
     *
     * Both are the same components the homepage uses, with the same
     * defaults, so the two pages cannot drift.
     */
    { kind: "approach" },
    { kind: "careAreas" },
    {
      kind: "statement",
      /* §4.2 item 5: solid background, no image. Her explicit answer. Leave it. */
      eyebrow: "Safety",
      heading: "When telehealth is not the right option",
      paragraphs: [
        `Telehealth suits many everyday needs. Some situations need an in-person examination or emergency care, and your practitioner will tell you clearly when that applies. ${EMERGENCY_LINE}`,
      ],
    },
    {
      kind: "related",
      eyebrow: "Where to next",
      heading: "Explore your options",
      cards: [
        {
          title: "Free pre-screening quiz",
          body: "A few minutes, no diagnosis, no commitment.",
          links: [{ label: "Start the free quiz", href: "/quiz/" }],
        },
        {
          title: "Pricing",
          body: "Every consultation fee, shown before you book.",
          links: [{ label: "See full pricing", href: "/pricing/" }],
        },
        {
          title: "Transfer your care",
          body: "Moving across from another provider.",
          links: [{ label: "Transfer your care", href: "/discharge/" }],
        },
      ],
      footnote: "Still deciding? Read the",
      footnoteLinks: [
        { label: "FAQs", href: "/faqs/" },
        { label: "pricing", href: "/pricing/" },
      ],
    },
  ],
  /*
   * §4.2 item 4: her live wording, verbatim. She named the first two as
   * required; the other two are the rest of her set on the same page. Ours
   * were three different questions and are replaced.
   */
  faq: {
    heading: "Your Questions Answered",
    items: [
      {
        id: "duration",
        question: "How long does a consultation take?",
        answer:
          "Initial consultations typically take 30 minutes, allowing our practitioners time to thoroughly review your medical history and discuss your healthcare needs. Follow-up consultations are usually shorter, around 20 minutes.",
      },
      {
        id: "first-consultation",
        question: "What happens during my first consultation?",
        answer:
          "Your practitioner will review your medical history, current health concerns, and any previous medical care. They will conduct a professional assessment and discuss appropriate next steps based on your individual circumstances. You will have plenty of time to ask questions.",
      },
      {
        id: "prepare",
        question: "What do I need to prepare for my appointment?",
        answer:
          "Have your medical records, current medication list, and any relevant test results ready. Make sure you are in a private, quiet space with good internet connection. Having details about your medical history prepared helps make the consultation more efficient.",
      },
      {
        id: "availability",
        question: "How quickly can I get an appointment?",
        answer:
          "We offer same-day and after-hours appointments depending on availability. Many patients can book within 24 to 48 hours. Check our booking system for current appointment availability.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
