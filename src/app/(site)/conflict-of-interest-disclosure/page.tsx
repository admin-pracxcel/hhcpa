import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { CONFLICT_OF_INTEREST } from "@/content/services/conflict-of-interest";

export const metadata: Metadata = serviceMetadata(CONFLICT_OF_INTEREST);

export default function Page() {
  return <ServicePage data={CONFLICT_OF_INTEREST} />;
}
