import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { ABOUT_US } from "@/content/services/about-us";

export const metadata: Metadata = serviceMetadata(ABOUT_US);

export default function Page() {
  return <ServicePage data={ABOUT_US} />;
}
