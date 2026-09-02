import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { DISCHARGE } from "@/content/services/discharge";

export const metadata: Metadata = serviceMetadata(DISCHARGE);

export default function Page() {
  return <ServicePage data={DISCHARGE} />;
}
