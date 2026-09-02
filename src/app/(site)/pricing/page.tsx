import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { PRICING_PAGE } from "@/content/services/pricing-page";

export const metadata: Metadata = serviceMetadata(PRICING_PAGE);

export default function Page() {
  return <ServicePage data={PRICING_PAGE} />;
}
