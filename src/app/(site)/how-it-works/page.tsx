import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { HOW_IT_WORKS } from "@/content/services/how-it-works";

export const metadata: Metadata = serviceMetadata(HOW_IT_WORKS);

export default function Page() {
  return <ServicePage data={HOW_IT_WORKS} />;
}
