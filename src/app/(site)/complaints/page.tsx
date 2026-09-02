import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { COMPLAINTS } from "@/content/services/complaints";

export const metadata: Metadata = serviceMetadata(COMPLAINTS);

export default function Page() {
  return <ServicePage data={COMPLAINTS} />;
}
