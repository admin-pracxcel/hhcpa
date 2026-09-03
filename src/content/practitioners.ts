/**
 * PAGE 24: OUR PRACTITIONERS — COMPLIANCE-CRITICAL.
 *
 * ⚠️ THE ROSTER IS DELIBERATELY EMPTY, and that is the correct state today.
 *
 * The content document records what Ranjeeta confirmed on 28 August 2026:
 *   - No additional practitioners are confirmed. Dr Bull, Dr James Lavett,
 *     Dr Lee and the historically listed nurse practitioners and incoming GPs
 *     are NOT from her clinic and must not be listed.
 *   - Her own entry is unresolved: her exact professional title for public
 *     display is unconfirmed, and so is whether she holds AHPRA registration.
 *     The live site calls her "Healthcare Practitioner Ranjeeta Roshan"; the
 *     "Dr Ranjeeta Roshan" in the old site metadata is wrong — she is not a
 *     medical doctor — and has been corrected throughout the document.
 *
 * A practitioner may be added here only with a full name, a public title, an
 * AHPRA registration number, focus areas, a bio and a headshot. PractitionerCards
 * refuses to render anyone without a registration number, so adding a record
 * and forgetting the number cannot publish a non-compliant card.
 *
 * The page itself was published on 2026-09-03 at the client's instruction. That
 * changes nothing here: the roster stays empty until each person's registration
 * number is confirmed, and the page renders its empty state rather than a claim
 * it cannot support.
 */

import type { Practitioner } from "@/components/sections/PractitionerCards";
import { CALL_CTA } from "./clinic";

export const PRACTITIONERS_META = {
  title: "Our Practitioners | AHPRA-Registered Team | HHCPA",
  description:
    "Meet the AHPRA-registered practitioners at Horizon Health Care Partners. Registered, experienced clinicians delivering telehealth care across Australia.",
  path: "/our-practitioners/",
} as const;

/** Empty until each person's AHPRA number is confirmed. See the header. */
export const PRACTITIONERS: readonly Practitioner[] = [];

export const PRACTITIONERS_PAGE = {
  hero: {
    eyebrow: "Our practitioners",
    heading: "Our AHPRA-registered practitioners",
    primary: { label: "Check your eligibility", href: "/quiz/" },
    secondary: CALL_CTA,
  },
  crumbs: [{ label: "Home", href: "/" }],
  intro:
    "Every consultation at Horizon Health Care Partners is with an AHPRA-registered practitioner. We publish each practitioner's registration details because you deserve to know exactly who you are speaking with. Below are the practitioners who care for our patients, and the areas they focus on.",
  roster: {
    eyebrow: "Meet the team",
    heading: "Meet the team",
    empty:
      "Practitioner profiles are published here as clinicians join the practice, each with their name, title and AHPRA registration number so you can verify their registration before you book. In the meantime, every consultation is with an AHPRA-registered practitioner.",
  },
  standards: {
    eyebrow: "Our standards",
    heading: "What every practitioner shares",
    tiles: [
      {
        title: "Registration with AHPRA",
        body: "Every practitioner is registered, and their registration details are published on their profile.",
      },
      {
        title: "Real consultations",
        body: "A commitment to real consultations, not questionnaire prescribing.",
      },
      {
        title: "Honest communication",
        body: "Compliant, honest communication with patients.",
      },
      {
        title: "Time for your situation",
        body: "A focus on giving each person the time their situation needs.",
      },
    ],
  },
  closing: {
    heading: "Your health, handled from home",
    body: "Start with the free pre-screening quiz. It takes about two minutes, it is not a diagnosis, and there is no commitment until you choose to book.",
    primary: { label: "Start the free quiz", href: "/quiz/" },
  },
} as const;
