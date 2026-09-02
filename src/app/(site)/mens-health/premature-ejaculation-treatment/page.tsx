import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { PREMATURE_EJACULATION } from "@/content/services/premature-ejaculation";

export const metadata: Metadata = serviceMetadata(PREMATURE_EJACULATION);

export default function Page() {
  return <ServicePage data={PREMATURE_EJACULATION} />;
}
