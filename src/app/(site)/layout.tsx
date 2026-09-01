/**
 * The shell every public page renders inside.
 *
 * The `(site)` route group does not appear in URLs, so each page keeps its path
 * while inheriting the header, footer, disclaimer and sticky CTA. Pages must not
 * import those individually.
 *
 * Ordering is load-bearing: SiteHeader is an absolutely-positioned overlay with
 * z-index 1 and must render before <main>, and must not be wrapped in anything
 * that establishes a new stacking or positioning context. See PAGE_TOPOLOGY.md.
 */
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader";
import { SiteFooter } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter";
import { SiteDisclaimer } from "@/components/layout/SiteDisclaimer";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { JsonLd } from "@/components/JsonLd";
import { buildMedicalClinic } from "@/lib/schema";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={buildMedicalClinic()} />
      <SiteHeader />
      <main id="brx-content">{children}</main>
      <SiteFooter />
      <SiteDisclaimer />
      <StickyMobileCta />
    </>
  );
}
