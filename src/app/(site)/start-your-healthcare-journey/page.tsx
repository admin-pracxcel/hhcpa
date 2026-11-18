/**
 * `/start-your-healthcare-journey/` — paid-acquisition landing page A — the flagship acquisition page, destination for creatives A1, A2 and A3.
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
import { LANDING_JOURNEY } from "@/content/landing/start-your-healthcare-journey";

export const metadata: Metadata = {
  title: LANDING_JOURNEY.meta.title,
  description: LANDING_JOURNEY.meta.description,
  robots: { index: false, follow: false },
};

export default function LandingJourneyPage() {
  return <ServicePage data={LANDING_JOURNEY} />;
}
