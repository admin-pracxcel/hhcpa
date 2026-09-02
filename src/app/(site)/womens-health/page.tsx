import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { WOMENS_HEALTH } from "@/content/services/womens-health";

export const metadata: Metadata = serviceMetadata(WOMENS_HEALTH);

export default function Page() {
  return <ServicePage data={WOMENS_HEALTH} />;
}
