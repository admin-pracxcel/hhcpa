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
import { Suspense } from "react";
import type { ReactNode } from "react";
import { AttributionCapture } from "@/components/AttributionCapture";
import { SiteHeader } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader";
import { SiteFooter } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";

/*
 * The organisation's JSON-LD used to be emitted here, as a standalone
 * `MedicalClinic` with no `@id`. It moved to the root layout on 2026-10-29 as
 * part of the site-wide `@graph` — see `buildSiteGraph` in lib/schema.ts.
 *
 * Moving it up one level also covers `/quiz/`, which sits outside this route
 * group and was the only page on the site carrying no organisation markup.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* useSearchParams needs a Suspense boundary so the rest of the page
          can still be statically rendered around it. */}
      <Suspense fallback={null}>
        <AttributionCapture />
      </Suspense>
      <SiteHeader />
      <main id="brx-content">{children}</main>
      {/* The disclaimer renders inside SiteFooter, not beside it. */}
      <SiteFooter />
      <StickyMobileCta />
    </>
  );
}
