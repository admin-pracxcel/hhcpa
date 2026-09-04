import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { ERECTILE_DYSFUNCTION } from "@/content/services/erectile-dysfunction";

export const metadata: Metadata = serviceMetadata(ERECTILE_DYSFUNCTION);

export default function Page() {
  return <ServicePage data={ERECTILE_DYSFUNCTION} />;
}
