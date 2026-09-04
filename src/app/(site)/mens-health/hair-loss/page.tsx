import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { HAIR_LOSS } from "@/content/services/hair-loss";

export const metadata: Metadata = serviceMetadata(HAIR_LOSS);

export default function Page() {
  return <ServicePage data={HAIR_LOSS} />;
}
