import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { DischargeLetterForm } from "@/components/sections/DischargeLetterForm";
import { DISCHARGE } from "@/content/services/discharge";

export const metadata: Metadata = serviceMetadata(DISCHARGE);

/**
 * `/discharge/` — Transfer Your Care, and the Discharge Letter page.
 *
 * One page, not two. Her live page is titled "Discharge Letter | Switch to
 * Horizon Health Care Partners" and is the same thing staging calls Transfer
 * Your Care; build spec v2.3 §8 established that after v2.2's Q11 assumed a
 * second page was wanted. The footer links to it under both names.
 *
 * The form sits after the page's own sections rather than inside the module
 * vocabulary: it posts, and nothing else the service template renders does.
 */
export default function Page() {
  return (
    <>
      <ServicePage data={DISCHARGE} />
      <DischargeLetterForm />
    </>
  );
}
