import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { PCOS } from "@/content/services/pcos";

export const metadata: Metadata = serviceMetadata(PCOS);

export default function Page() {
  return <ServicePage data={PCOS} />;
}
