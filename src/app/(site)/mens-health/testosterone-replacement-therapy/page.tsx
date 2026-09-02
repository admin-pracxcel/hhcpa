import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { TESTOSTERONE_REPLACEMENT } from "@/content/services/testosterone-replacement";

export const metadata: Metadata = serviceMetadata(TESTOSTERONE_REPLACEMENT);

export default function Page() {
  return <ServicePage data={TESTOSTERONE_REPLACEMENT} />;
}
