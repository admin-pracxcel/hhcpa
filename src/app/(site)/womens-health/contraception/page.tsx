import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { CONTRACEPTION } from "@/content/services/contraception";

export const metadata: Metadata = serviceMetadata(CONTRACEPTION);

export default function Page() {
  return <ServicePage data={CONTRACEPTION} />;
}
