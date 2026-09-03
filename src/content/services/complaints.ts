/**
 * PAGE 30: COMPLAINTS.
 *
 * ⚠️ The external-bodies section lists AHPRA and the OAIC, both national, but
 * the source flags that the state health complaints commissioner to name first
 * depends on the clinic's registered location and is still to be confirmed. It
 * names Queensland's Health Ombudsman and New South Wales' HCCC as examples,
 * which is how they are rendered here — as examples, not as the applicable
 * body. Confirm the primary one before publishing.
 */

import { CALL_CTA, CLINIC } from "../clinic";
import type { ServicePageData } from "@/components/sections/ServicePage";
import { sectionImage } from "./shared";

export const COMPLAINTS: ServicePageData = {
  meta: {
    title: "Complaints & Feedback | Horizon Health Care Partners",
    description:
      "How to raise a concern or complaint with Horizon Health Care Partners, how we handle it, and the external bodies you can contact. Australia-wide telehealth.",
    path: "/complaints/",
  },
  hero: {
    eyebrow: "Complaints",
    heading: "Complaints and feedback",
    primary: { label: "Contact our team", href: "/contact/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  trust: null,
  intro:
    "If something has not met your expectations, we want to know. Feedback is how we improve, and every patient has the right to raise a concern and have it handled fairly. This page explains how to reach us, what happens next, and the independent bodies you can contact if you would prefer, or if you are not satisfied with our response.",
  introCta: { label: "Contact our team", href: "/contact/" },
  modules: [
    {
      kind: "tiles",
      eyebrow: "How to raise a concern",
      heading: "How to raise a concern with us",
      tiles: [
        { title: "Phone", body: CLINIC.phone },
        { title: "Email", body: CLINIC.email },
        {
          title: "Contact form",
          body: "Or through our contact page, whichever is easiest.",
        },
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "What to include",
      heading: "What helps us look into it",
      paragraphs: [
        "Please include your name, the best way to reach you, and a short description of what happened. If your concern relates to a specific consultation, the date and practitioner help us look into it quickly.",
      ],
      cta: { label: "Contact our team", href: "/contact/" },
      image: sectionImage("complaints-what-to-include"),
      imageAlt:
        "A woman at a dining table types a message on a laptop, a cup of tea beside her.",
    },
    {
      kind: "tiles",
      eyebrow: "What happens next",
      heading: "How we handle it",
      columns: 2,
      tiles: [
        {
          title: "Acknowledgement",
          body: "We aim to acknowledge your complaint promptly.",
        },
        {
          title: "Review",
          body: "We look into what happened fairly and confidentially.",
        },
        {
          title: "Response",
          body: "We come back to you with our findings and any steps we are taking.",
        },
        {
          title: "Learning",
          body: "Where we can do better, we make the change.",
        },
      ],
    },
    {
      kind: "statement",
      eyebrow: "Your care is unaffected",
      heading: "Raising a concern changes nothing about your care",
      paragraphs: [
        "We handle complaints with respect and without any effect on your ongoing care.",
      ],
    },
    {
      kind: "split",
      tinted: true,
      eyebrow: "External options",
      heading: "Independent bodies you can contact",
      paragraphs: [
        "You are always free to contact an independent body, at any stage. AHPRA handles concerns about a registered practitioner, on 1300 419 495 or at ahpra.gov.au. Your state or territory health complaints commissioner handles service complaints — for example the Health Ombudsman in Queensland, or the Health Care Complaints Commission in New South Wales. The Office of the Australian Information Commissioner handles privacy concerns, at oaic.gov.au.",
      ],
      image: sectionImage("complaints-external-options"),
      imageAlt:
        "A man stands by a window with a phone to his ear.",
      imageSide: "left",
    },
  ],
  closing: {
    heading: "Your health, handled from home",
    body: "Start with the free pre-screening quiz. It takes about two minutes, it is not a diagnosis, and there is no commitment until you choose to book.",
    primary: { label: "Start the free quiz", href: "/quiz/" },
  },
};
