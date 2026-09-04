import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { MENOPAUSE } from "@/content/services/menopause";

export const metadata: Metadata = serviceMetadata(MENOPAUSE);

export default function Page() {
  return <ServicePage data={MENOPAUSE} />;
}
