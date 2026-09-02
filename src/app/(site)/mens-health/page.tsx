import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { MENS_HEALTH } from "@/content/services/mens-health";

export const metadata: Metadata = serviceMetadata(MENS_HEALTH);

export default function Page() {
  return <ServicePage data={MENS_HEALTH} />;
}
