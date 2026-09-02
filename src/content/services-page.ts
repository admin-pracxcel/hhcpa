/**
 * Copy for `/services/` — the booking wizard's home.
 *
 * ⚠️ THIS IS THE ONLY PAGE ON THE SITE WHOSE COPY IS NOT FROM THE CONTENT
 * DOCUMENT. HHCPA_Website_Content_UPDATED.md has no PAGE entry for `/services/`;
 * the design spec retains the route (decision D8) purely to host the ported
 * BookingWizard, and supplies no wording for it.
 *
 * So everything below was written here, and needs Ranjeeta's approval before
 * publication like any other page (clause 6.2(b)). It is deliberately kept
 * administrative — which services exist, what happens next — with no
 * clinical claim, no symptom, no treatment and no outcome anywhere in it, so
 * that the approval is a short read rather than a clinical review.
 *
 * The page captures nothing: `/quiz/` is the sole lead-capturing flow (D3),
 * and every card here is a link to a service page.
 *
 * ⚠️ The BookingWizard used to live on this page, per spec decision D8. It was
 * replaced at request with the homepage's service grid. The wizard now renders
 * only on the cloned homepage at `/` — and `/home-v2/`, which is slated to
 * replace `/`, does not include it. Promoting home-v2 without rehoming the
 * wizard would remove it from the site entirely.
 */

export const SERVICES_META = {
  title: "Book a Consultation | Services | Horizon Health Care Partners",
  description:
    "Choose the service you need and book a telehealth consultation with an AHPRA-registered practitioner. Australia-wide, by video or phone.",
  path: "/services/",
} as const;

export const SERVICES_PAGE = {
  hero: {
    eyebrow: "Services",
    heading: "Choose a service and book your consultation",
    /* Jumps down to the service grid rather than leaving the page. */
    primary: { label: "Choose a service", href: "#book" },
    secondary: { label: "Check your eligibility", href: "/quiz/" },
  },
  crumbs: [{ label: "Home", href: "/" }],
  intro:
    "Pick the service that matches what you need and read what a consultation covers before you book. Every consultation is with an AHPRA-registered practitioner, by video or phone, anywhere in Australia. If you are not sure which service fits, start with the free pre-screening quiz instead and we will point you in the right direction.",
  related: {
    eyebrow: "Before you book",
    heading: "Worth knowing first",
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
        title: "Not sure what you need?",
        body: "The free pre-screening quiz takes about two minutes.",
        links: [{ label: "Start the free quiz", href: "/quiz/" }],
      },
    ],
    footnote: "Moving across from another provider? See",
    footnoteLinks: [
      { label: "transfer your care", href: "/discharge/" },
      { label: "FAQs", href: "/faqs/" },
    ],
  },
  closing: {
    heading: "Your health, handled from home",
    body: "Choose a service above, or start with the free pre-screening quiz if you would rather we helped you work out where to begin.",
    primary: { label: "Start the free quiz", href: "/quiz/" },
  },
} as const;
