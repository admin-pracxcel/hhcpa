import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { ONLINE_DOCTOR } from "@/content/services/online-doctor";

export const metadata: Metadata = serviceMetadata(ONLINE_DOCTOR);

export default function Page() {
  return <ServicePage data={ONLINE_DOCTOR} />;
}
