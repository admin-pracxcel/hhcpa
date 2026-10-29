import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { PRICE_ROWS, PRICING_PAGE } from "@/content/services/pricing-page";
import { PRICES } from "@/content/pricing";
import { buildPricedServices } from "@/lib/schema";

export const metadata: Metadata = serviceMetadata(PRICING_PAGE);

/**
 * `/pricing/` — the fee table, and the only page that publishes it in full.
 *
 * The page carried MedicalWebPage and a breadcrumb but no Offer or
 * PriceSpecification, so a complete published fee table from $24.90 to $299
 * was legible to a reader and invisible to a machine. Fee transparency is a
 * genuine differentiator in Australian telehealth, where most clinics publish
 * nothing; leaving it unmarked wasted it.
 *
 * ⚠️ The consultation is priced, never a medicine. Advertising a price
 * against a prescription-only medicine breaches the Therapeutic Goods
 * Advertising Code, and structured data is not exempt from a rule that binds
 * page copy. Every row below is a consultation fee; anything a pharmacy
 * dispenses afterwards is separate and is not described here.
 *
 * The rows come from `PRICE_ROWS`, the same list the visible table renders,
 * so the markup cannot describe a table the page does not have.
 */
export default function Page() {
  const services = PRICE_ROWS.map((key) => ({
    name: PRICES[key].label,
    description: PRICES[key].from
      ? `${PRICES[key].label} consultation, from $${PRICES[key].amount}.`
      : `${PRICES[key].label} consultation.`,
    price: PRICES[key].amount,
  }));

  return (
    <>
      {buildPricedServices(services, PRICING_PAGE.meta.path).map((service) => (
        <JsonLd key={service.name} data={service} />
      ))}
      <ServicePage data={PRICING_PAGE} />
    </>
  );
}
