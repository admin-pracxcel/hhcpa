/**
 * `/individual-health-review/` — paid-acquisition landing page B — HELD. The service it describes is unconfirmed; see the content file.
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
import { LANDING_REVIEW } from "@/content/landing/individual-health-review";

export const metadata: Metadata = {
  title: LANDING_REVIEW.meta.title,
  description: LANDING_REVIEW.meta.description,
  robots: { index: false, follow: false },
};

export default function LandingReviewPage() {
  return <ServicePage data={LANDING_REVIEW} />;
}
