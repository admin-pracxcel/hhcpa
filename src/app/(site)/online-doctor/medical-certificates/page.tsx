import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { MEDICAL_CERTIFICATES } from "@/content/services/medical-certificates";

export const metadata: Metadata = serviceMetadata(MEDICAL_CERTIFICATES);

export default function Page() {
  return <ServicePage data={MEDICAL_CERTIFICATES} />;
}
