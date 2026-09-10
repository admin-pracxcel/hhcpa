import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { HOLISTIC_ALTERNATIVE_CARE } from "@/content/services/holistic-alternative-care";

export const metadata: Metadata = serviceMetadata(HOLISTIC_ALTERNATIVE_CARE);

export default function Page() {
  return <ServicePage data={HOLISTIC_ALTERNATIVE_CARE} />;
}
