/**
 * `/medicinal-cannabis/` — COMPLIANCE-GATED.
 *
 * ⚠️ noindex until Ranjeeta Roshan and a compliance reviewer approve the page
 * in writing. `routes.ts` gates the route, which keeps it out of the nav, the
 * footer, the sitemap and the homepage focus grid; this adds the robots
 * directive so a crawler that finds the URL another way still does not index
 * it. Remove both together, not one of them.
 */

import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { MEDICINAL_CANNABIS } from "@/content/services/medicinal-cannabis";

export const metadata: Metadata = {
  ...serviceMetadata(MEDICINAL_CANNABIS),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ServicePage data={MEDICINAL_CANNABIS} />;
}
