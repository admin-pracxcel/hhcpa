/**
 * PAGE 31: CONFLICT OF INTEREST & PHARMACY DISCLOSURE.
 *
 * ⚠️ THIS PAGE IS INCOMPLETE AND MUST NOT BE PUBLISHED AS IT STANDS.
 *
 * Its central section — "Our relationship with dispensing pharmacies" — is the
 * reason the page exists. AHPRA's medicinal cannabis guidance of 9 July 2025
 * expects transparency about any relationship between a clinic and the
 * pharmacies that dispense what it prescribes. The content document supplies
 * two draft options and instructs that the wording "must match the facts and be
 * approved by the compliance reviewer before publishing".
 *
 * Nobody here knows the facts. Option (a) — that the clinic owns no pharmacy
 * and has no financial interest in one — would be a statement about Ranjeeta's
 * commercial arrangements, published under her name, and it is either true or
 * it is a false disclosure on the one page whose whole purpose is disclosure.
 * So the section is omitted rather than guessed, and this page ships with the
 * three sections that can be stated truthfully.
 *
 * To complete: confirm the arrangement, add the module below back with the
 * approved wording, and remove this notice.
 */

import type { ServicePageData } from "@/components/sections/ServicePage";
import { IMAGE, IMAGE_ALT } from "./shared";

export const CONFLICT_OF_INTEREST: ServicePageData = {
  meta: {
    title: "Conflict of Interest & Pharmacy Disclosure | HHCPA",
    description:
      "How Horizon Health Care Partners manages conflicts of interest and our relationships with dispensing pharmacies. Transparency for our patients.",
    path: "/conflict-of-interest-disclosure/",
  },
  hero: {
    eyebrow: "Conflict of interest",
    heading: "Conflict of interest and pharmacy disclosure",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: { label: "Book a consultation", href: "/quiz/" },
  },
  crumbs: [{ label: "Home", href: "/" }],
  trust: null,
  intro:
    "We believe you should understand how our clinic is set up before you rely on our advice. This page explains how our practitioners make prescribing decisions, and it discloses any commercial relationships that could be relevant to your care. Transparency is not a legal box to tick. It is how trust is earned.",
  modules: [
    {
      kind: "statement",
      eyebrow: "How prescribing decisions are made",
      heading: "Independent clinical judgement",
      paragraphs: [
        "Our practitioners make prescribing decisions based on your health and clinical need. A prescription is provided only where it is clinically appropriate and safe for you. Your practitioner's judgement is not directed by any commercial interest.",
      ],
    },
    /*
     * ⚠️ MISSING: "Our relationship with dispensing pharmacies".
     * See the file header. Do not publish this page without it.
     */
    {
      kind: "split",
      tinted: true,
      eyebrow: "Your choices",
      heading: "Your choices as a patient",
      paragraphs: [
        "You have the right to ask questions about any recommendation, to seek a second opinion, and to choose where an eligible prescription is dispensed. If anything on this page is unclear, ask us, and we will explain it.",
      ],
      cta: { label: "Contact our team", href: "/contact/" },
      image: IMAGE.approach,
      imageAlt: IMAGE_ALT.approach,
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "Keeping this current",
      heading: "Keeping our disclosures current",
      paragraphs: [
        "If our arrangements change, we update this page. It is reviewed as part of our ongoing compliance process.",
      ],
      image: IMAGE.ourStory,
      imageAlt: IMAGE_ALT.ourStory,
      imageSide: "left",
    },
  ],
  closing: {
    heading: "Your health, handled from home",
    body: "Start with the free pre-screening quiz. It takes about two minutes, it is not a diagnosis, and there is no commitment until you choose to book.",
    primary: { label: "Start the free quiz", href: "/quiz/" },
  },
};
