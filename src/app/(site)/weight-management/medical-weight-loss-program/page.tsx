import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { MEDICAL_WEIGHT_LOSS_PROGRAM } from "@/content/services/medical-weight-loss-program";

export const metadata: Metadata = serviceMetadata(MEDICAL_WEIGHT_LOSS_PROGRAM);

export default function Page() {
  return <ServicePage data={MEDICAL_WEIGHT_LOSS_PROGRAM} />;
}
