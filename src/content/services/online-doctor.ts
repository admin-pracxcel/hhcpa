/**
 * PAGE 15: ONLINE DOCTOR (GENERAL TELEHEALTH).
 *
 * A silo entry page, so it declares Service schema.
 *
 * Module 4 is six areas, five of which carry a destination, so it renders as
 * link cards. The sixth, "Everyday health concerns", has no URL in the source
 * and points at the quiz rather than inventing one.
 *
 * Module 5 is the emergency passage. It takes the dark band so "Telehealth is
 * not for emergencies. If this is a medical emergency, call 000." cannot be
 * skimmed past — the same reasoning as the contraception page's safety note.
 */

import { PRICES } from "../pricing";
import type { ServicePageData } from "@/components/sections/ServicePage";
import { IMAGE, IMAGE_ALT, STANDARD_CLOSING, STANDARD_FOOTNOTE, STANDARD_FOOTNOTE_LINKS, howToBegin, sectionImage } from "./shared";
import { CALL_CTA } from "../clinic";

export const ONLINE_DOCTOR: ServicePageData = {
  meta: {
    title: "Online Doctor Australia | Telehealth Consultations | HHCPA",
    description:
      "See an online doctor in Australia. AHPRA-registered practitioners for prescriptions, medical certificates, referrals and everyday care. Book Australia-wide.",
    path: "/online-doctor/",
  },
  hero: {
    eyebrow: "Online doctor",
    heading: "Online doctor consultations across Australia",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  trust: [
    "AHPRA-registered practitioners",
    "Australia-wide",
    "Same-day options",
    "Clear, upfront pricing",
  ],
  intro:
    "An online doctor in Australia should be there when real life gets in the way of a clinic visit. At Horizon Health Care Partners, AHPRA-registered practitioners consult by video or phone for the everyday things: prescriptions and repeat scripts, medical certificates, pathology and imaging referrals, specialist referrals, and general health concerns. You book a time that suits you, you have a proper consultation, and you get a clear outcome, all without leaving home.",
  serviceSchemaName: "Online doctor consultations",
  modules: [
    {
      kind: "related",
      eyebrow: "What an online doctor can help with",
      heading: "What we can help with",
      cards: [
        {
          title: "Prescriptions and repeat scripts",
          body: "New prescriptions and renewals, where clinically appropriate, with eScripts sent to your phone.",
          links: [
            {
              label: "Online prescriptions",
              href: "/online-doctor/online-prescriptions/",
            },
          ],
        },
        {
          title: "Medical certificates",
          body: "Certificates for work, study or carer's leave, where appropriate.",
          links: [
            {
              label: "Medical certificates",
              href: "/online-doctor/medical-certificates/",
            },
          ],
        },
        {
          title: "Pathology and imaging referrals",
          body: "Referrals for blood tests, X-rays and ultrasounds, where clinically indicated.",
          links: [
            {
              label: "Pathology & imaging referrals",
              href: "/online-doctor/pathology-imaging-referrals/",
            },
          ],
        },
        {
          title: "Specialist referrals",
          body: "Referrals to specialists, where appropriate.",
          links: [
            {
              label: "Specialist referrals",
              href: "/online-doctor/specialist-referrals/",
            },
          ],
        },
        {
          title: "Mental health support",
          body: "ADHD, anxiety, sleep and smoking cessation.",
          links: [
            {
              label: "Mental health support",
              href: "/online-doctor/mental-health/",
            },
          ],
        },
        {
          title: "Everyday health concerns",
          body: "General consultations for the many things that do not fit a neat category.",
          links: [{ label: "Check your eligibility", href: "/quiz/" }],
        },
      ],
      footnote: STANDARD_FOOTNOTE,
      footnoteLinks: STANDARD_FOOTNOTE_LINKS,
    },
    {
      kind: "statement",
      eyebrow: "When telehealth fits",
      heading: "When telehealth is the right choice",
      paragraphs: [
        "Telehealth handles a large share of everyday care well: scripts, certificates, referrals, reviews and advice. Some situations need a physical examination, hands-on testing, or emergency care, and your practitioner will always tell you when that is the case. Telehealth is not for emergencies. If this is a medical emergency, call 000.",
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "How it works",
      heading: "How it works",
      paragraphs: [
        "Take the free pre-screening quiz, book a consultation by video or phone, and speak with an AHPRA-registered practitioner who reviews your situation and provides a clear outcome. Follow-up is available where care continues.",
      ],
      cta: { label: "Start the free quiz", href: "/quiz/" },
      image: sectionImage("online-doctor-how-it-works"),
      imageAlt:
        "A person stands at a kitchen bench speaking with a practitioner on a propped tablet.",
    },
    {
      kind: "inlineCta",
      ...howToBegin(
        "Start with the free pre-screening quiz, then book a consultation. See fees on our ",
      ),
    },
    {
      kind: "pricingCue",
      eyebrow: "What it costs",
      heading: "What it costs",
      headline: `from $${PRICES.generalConsult.amount}`,
      headlineLabel: "Everyday consultations",
      rows: [
        { label: "Pre-screening quiz", value: "Free" },
        {
          label: "Medical certificates",
          value: `from $${PRICES.medicalCertificate.amount.toFixed(2)}`,
        },
      ],
      note: "See the full list on our pricing page.",
      cta: { label: "See full pricing", href: "/pricing/" },
    },
  ],
  faq: {
    heading: "Common questions",
    items: [
      {
        id: "speed",
        question: "How quickly can I see an online doctor?",
        answer:
          "Often on the same day. After-hours and priority options are available. Availability is shown when you book.",
      },
      {
        id: "prescribe",
        question: "Can an online doctor prescribe medication?",
        answer:
          "Where it is clinically appropriate and safe, yes, after a real consultation. Certain medications cannot be prescribed by telehealth, and your practitioner will explain if that applies.",
      },
      {
        id: "as-good",
        question: "Is an online consultation as good as in person?",
        answer:
          "For many everyday needs, it is just as effective and far more convenient. Your practitioner will recommend an in-person option when your situation calls for it.",
      },
    ],
  },
  closing: STANDARD_CLOSING,
};
