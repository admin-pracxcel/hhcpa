/**
 * The three consultation plans, as cards.
 *
 * Shared because two pages show the same three consultations: the homepage's
 * pricing section, and the canonical price list at `/pricing/`. They live here
 * rather than in either page's content file so the wording, the CTAs and the
 * amounts cannot come apart between them.
 *
 * Copy transcribed from HHCPA_Website_Content_UPDATED.md, "PAGE 1: HOME".
 *
 * Each plan carries the `PriceKey` it charges rather than an amount, and reads
 * the figure back through `formatPrice`. That is what lets `/pricing/` prove it
 * lists every price in the record: a plan rendered as a card still says which
 * entry in `pricing.ts` it is, so a fee cannot end up chargeable but unlisted.
 * All three are still `provisional: true` pending Ranjeeta's written
 * confirmation.
 */

import type { PricingPlan } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/PricingSection";

import { formatPrice } from "./pricing";
import type { PriceKey } from "./pricing";

/** A card that also declares which price in the record it is showing. */
export type ConsultationPlan = PricingPlan & { readonly key: PriceKey };

export const CONSULTATION_PLANS = [
  {
    label: "First consultation",
    key: "firstConsult",
    price: formatPrice("firstConsult"),
    caption: "Start your care with a practitioner",
    features: [
      "Consult with an AHPRA-registered practitioner",
      "Review of your history and current treatments",
      "A clear discussion of suitable options",
    ],
    cta: { text: "Get started", href: "/quiz/" },
    variant: "mint",
  },
  {
    label: "Follow-up consultation",
    key: "followUpConsult",
    price: formatPrice("followUpConsult"),
    caption: "Continued medical guidance",
    features: [
      "Ongoing care with your practitioner",
      "Progress review and plan adjustments",
      "Renewals and medication management, where appropriate",
    ],
    cta: { text: "Book a follow-up", href: "/quiz/" },
    variant: "dark",
  },
  {
    label: "Transfer consultation",
    key: "transferConsult",
    price: formatPrice("transferConsult"),
    caption: "Move your care across without a gap",
    features: [
      "Quick onboarding from another provider",
      "Review of your current treatment and records",
      "Continuity of care with no disruption",
    ],
    cta: { text: "Transfer your care", href: "/discharge/" },
    variant: "mint",
  },
] as const satisfies readonly ConsultationPlan[];
