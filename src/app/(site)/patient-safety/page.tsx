import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { PATIENT_SAFETY } from "@/content/services/patient-safety";

export const metadata: Metadata = serviceMetadata(PATIENT_SAFETY);

export default function Page() {
  return <ServicePage data={PATIENT_SAFETY} />;
}
