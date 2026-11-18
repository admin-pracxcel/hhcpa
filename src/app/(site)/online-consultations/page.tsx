/**
 * `/online-consultations/` — paid-acquisition landing page C — online consultation access, destination for creative C1.
 *
 * `noindex, nofollow`, and absent from `ROUTES` so it reaches no sitemap, no
 * navigation and no breadcrumb. Both are deliberate: these pages are
 * advertising destinations, and indexing them would set them competing with
 * the organic pages covering the same ground.
 *
 * Copy, provenance and the outstanding approvals live in
 * `src/content/landing/shared.ts`. Read it before changing anything here.
 */
import type { Metadata } from "next";

import { ServicePage } from "@/components/sections/ServicePage";
import { LANDING_ONLINE } from "@/content/landing/online-consultations";

export const metadata: Metadata = {
  title: LANDING_ONLINE.meta.title,
  description: LANDING_ONLINE.meta.description,
  robots: { index: false, follow: false },
};

export default function LandingOnlinePage() {
  return <ServicePage data={LANDING_ONLINE} />;
}
