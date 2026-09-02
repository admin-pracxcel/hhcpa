import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { MENTAL_HEALTH } from "@/content/services/mental-health";

export const metadata: Metadata = serviceMetadata(MENTAL_HEALTH);

export default function Page() {
  return <ServicePage data={MENTAL_HEALTH} />;
}
