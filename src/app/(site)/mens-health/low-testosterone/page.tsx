import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { LOW_TESTOSTERONE } from "@/content/services/low-testosterone";

export const metadata: Metadata = serviceMetadata(LOW_TESTOSTERONE);

export default function Page() {
  return <ServicePage data={LOW_TESTOSTERONE} />;
}
