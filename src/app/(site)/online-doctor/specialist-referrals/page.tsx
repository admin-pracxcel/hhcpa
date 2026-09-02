import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { SPECIALIST_REFERRALS } from "@/content/services/specialist-referrals";

export const metadata: Metadata = serviceMetadata(SPECIALIST_REFERRALS);

export default function Page() {
  return <ServicePage data={SPECIALIST_REFERRALS} />;
}
