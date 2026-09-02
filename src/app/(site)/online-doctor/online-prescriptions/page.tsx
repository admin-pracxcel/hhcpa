import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { ONLINE_PRESCRIPTIONS } from "@/content/services/online-prescriptions";

export const metadata: Metadata = serviceMetadata(ONLINE_PRESCRIPTIONS);

export default function Page() {
  return <ServicePage data={ONLINE_PRESCRIPTIONS} />;
}
