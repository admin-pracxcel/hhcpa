/**
 * `/medicinal-cannabis/` — COMPLIANCE-SENSITIVE.
 *
 * Published on 2026-09-03 at the client's instruction, for their review. The
 * route gate in `routes.ts` and the per-page noindex that used to sit here were
 * lifted together, so the page is now in the nav, the footer, the sitemap and
 * the homepage focus grid, and is indexable wherever the site is.
 *
 * ⚠️ The copy still has to hold the TGA line it was written to: no product,
 * brand or ingredient names, no efficacy claims, and nothing that reads as
 * advertising a prescription-only substance. If the client does not proceed,
 * restore `gated: true` on the route — that alone withdraws it from every
 * channel at once.
 */

import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { MEDICINAL_CANNABIS } from "@/content/services/medicinal-cannabis";

export const metadata: Metadata = serviceMetadata(MEDICINAL_CANNABIS);

export default function Page() {
  return <ServicePage data={MEDICINAL_CANNABIS} />;
}
