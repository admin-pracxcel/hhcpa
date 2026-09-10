import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { HEALTH_OPTIMISATION } from "@/content/services/health-optimisation";

export const metadata: Metadata = serviceMetadata(HEALTH_OPTIMISATION);

export default function Page() {
  return <ServicePage data={HEALTH_OPTIMISATION} />;
}
