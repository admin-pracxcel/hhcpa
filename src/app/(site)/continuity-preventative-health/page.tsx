import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { CONTINUITY_PREVENTATIVE_HEALTH } from "@/content/services/continuity-preventative-health";

export const metadata: Metadata = serviceMetadata(CONTINUITY_PREVENTATIVE_HEALTH);

export default function Page() {
  return <ServicePage data={CONTINUITY_PREVENTATIVE_HEALTH} />;
}
