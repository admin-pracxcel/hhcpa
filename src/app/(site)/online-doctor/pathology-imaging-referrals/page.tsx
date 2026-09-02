import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { PATHOLOGY_IMAGING } from "@/content/services/pathology-imaging-referrals";

export const metadata: Metadata = serviceMetadata(PATHOLOGY_IMAGING);

export default function Page() {
  return <ServicePage data={PATHOLOGY_IMAGING} />;
}
