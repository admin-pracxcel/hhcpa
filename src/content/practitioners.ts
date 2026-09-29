/**
 * PAGE 24: OUR PRACTITIONERS — COMPLIANCE-CRITICAL.
 *
 * The roster was empty until 2026-09-15, when the client supplied seven
 * practitioners with their AHPRA numbers. The note below is kept because it
 * records who must NOT be listed, which is still live guidance.
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

/**
 * The roster. Seven supplied by the client on 2026-09-15 with AHPRA numbers,
 * and Dr Arpita Ray added on 2026-09-29. Five medical practitioners and three
 * nurse practitioners, doctors first — the array order is the page order.
 *
 * Every number is published as given. Nothing here is inferred: the titles
 * come from the registration prefix — MED is a medical practitioner, NMW a
 * nurse practitioner, which the client stated for each — and the focus
 * areas are each person's own list. Nobody has a bio, so nobody has one
 * rendered; writing one would be inventing a claim about a real person.
 *
 * ⚠️ TWO THINGS TO VERIFY BEFORE THIS GOES PUBLIC.
 *
 * 1. Every number should be checked against the AHPRA public register at
 *    ahpra.gov.au/registration/registers-of-practitioners. Publishing a
 *    number that does not resolve is worse than publishing none, and the
 *    numbers here have been typed from an email, not looked up.
 *
 * 2. Four of these lists say "General GP" or "General GP Consultations".
 *    "General practitioner" is a protected specialist title: only a medical
 *    practitioner holding specialist registration in general practice
 *    (FRACGP or FACRRM) may be described as one, and AHPRA treats an implied
 *    claim the same as an explicit one. A doctor with general registration
 *    who is not fellowed is not a GP. The register shows this per person.
 *    Until it is checked, these read "General consultations" — the service,
 *    not the title — which is accurate whatever their registration and needs
 *    no correction if they are all fellowed. Raised with Bilal 2026-09-15.
 *
 * Names are exactly as the client supplied them, honorifics included —
 * restored 2026-09-15 after being dropped for consistency with the doctors.
 * How a clinician is styled on their own listing is theirs, not a house rule.
 *
 * Miss Paidamoyo Mildred Hatendi is last in the array, which is the order on
 * the page. She was moved there while her card had no headshot; hers arrived
 * on 2026-09-28 and the position was left alone, since the order is nobody's
 * ranking and moving her again would only churn the page.
 *
 * Typos in the supplied lists were corrected where they were plainly typos
 * ("Managment", "Womens", "Mens") and the wording was matched to the service
 * names used everywhere else on the site. No list gained or lost an item.
 */
export const PRACTITIONERS: readonly Practitioner[] = [
  {
    name: "Dr Ines Fernandes",
    title: "Medical Practitioner",
    ahpraNumber: "MED0002215252",
    photo: "/images/dr-ines-fernandes.webp",
    focusAreas: [
      "General consultations",
      "Weight management",
      "Prescriptions",
      "Medical certificates",
      "Pathology and imaging referrals",
      "After-hours and priority consultations",
    ],
  },
  {
    name: "Dr Yulia Indrawirawan",
    title: "Medical Practitioner",
    ahpraNumber: "MED0001220271",
    photo: "/images/dr-yulia-indrawirawan.webp",
    focusAreas: [
      "General consultations",
      "Weight management",
      "Women's health",
      "Men's health",
      "Mental health",
      "Chronic disease management",
      "Continuity and preventative health",
      "Prescriptions",
      "Medical certificates",
      "Pathology and imaging referrals",
      "Health optimisation and complete wellness",
    ],
  },
  {
    name: "Dr Harman Sharma",
    title: "Medical Practitioner",
    ahpraNumber: "MED0002679885",
    photo: "/images/dr-harman-sharma.webp",
    focusAreas: [
      "Mental health support for sleep, stress and anxiety",
      "General consultations",
      "Weight and metabolic health",
      "Prescriptions",
      "Medical certificates",
      "Pathology and imaging referrals",
      "After-hours consultations",
      "Priority consultations",
    ],
  },
  {
    name: "Dr Ghazal Panahi",
    title: "Medical Practitioner",
    ahpraNumber: "MED0001857124",
    photo: "/images/dr-ghazal-panahi.webp",
    focusAreas: [
      "General consultations",
      "Weight and metabolic health",
      "Women's health",
      "Men's health",
      "Mental health",
      "Chronic disease management",
      "Continuity and preventative health",
      "Prescriptions",
      "Medical certificates",
      "Pathology and imaging referrals",
      "After-hours consultations",
      "Priority consultations",
    ],
  },
  {
    /*
     * Added 2026-09-29. Her list came as "General GP: Yes" and so on; the
     * yes/no framing is dropped because a list of services is already a list
     * of what she offers, and "General GP" reads as "General consultations"
     * for the same reason it does on the other four doctors' cards.
     */
    name: "Dr Arpita Ray",
    title: "Medical Practitioner",
    ahpraNumber: "MED0001204770",
    photo: "/images/dr-arpita-ray.webp",
    focusAreas: [
      "General consultations",
      "Weight management",
      "Women's health",
      "Mental health",
      "Prescriptions",
      "Medical certificates",
      "Pathology and imaging referrals",
      "After-hours and priority consultations",
    ],
  },
  {
    name: "Jamie Lee Swales",
    title: "Nurse Practitioner",
    ahpraNumber: "NMW0002708120",
    photo: "/images/jamie-lee-swales.webp",
    focusAreas: [
      "Holistic and alternative care",
      "Weight management",
      "Health optimisation and complete wellness",
    ],
  },
  {
    /* No focus areas supplied. */
    name: "Miss Nattallee Jane Allan",
    title: "Nurse Practitioner",
    ahpraNumber: "NMW0001298808",
    photo: "/images/miss-nattallee-jane-allan.webp",
  },
  {
    /*
     * Her real headshot replaced the silhouette placeholder on 2026-09-28,
     * and her focus areas arrived with it. Every card on this page now
     * carries a photograph of the person it names.
     */
    name: "Miss Paidamoyo Mildred Hatendi",
    title: "Nurse Practitioner",
    ahpraNumber: "NMW0001913861",
    photo: "/images/miss-paidamoyo-mildred-hatendi.webp",
    focusAreas: [
      "General consultations",
      "Weight management",
      "Women's health",
      "Men's health",
      "Mental health",
      "Chronic disease management",
      "Continuity and preventative health",
      "Prescriptions",
      "Medical certificates",
      "Pathology and imaging referrals",
      "Holistic and alternative care",
    ],
  },
];

export const PRACTITIONERS_PAGE = {
  hero: {
    eyebrow: "Our practitioners",
    heading: "Our AHPRA-registered practitioners",
    media: {
      src: "/videos/our-practitioners-hero.webm",
      poster: "/images/our-practitioners-hero-poster.webp",
      alt: "The sun sets over the sea beyond a rocky foreshore, the tide running back over wet stones.",
    },
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
    heading: "Professional Healthcare, Wherever You Are",
    body: "Start with the free pre-screening quiz. It takes a few minutes, it is not a diagnosis, and there is no commitment until you choose to book.",
    primary: { label: "Start the free quiz", href: "/quiz/" },
  },
} as const;
