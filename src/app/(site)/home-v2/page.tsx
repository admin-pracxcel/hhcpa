/**
 * `/home-v2/` — the WordPress clone of https://www.horizonhealthcarepartners.com.au/,
 * kept as the design reference after the rebuilt homepage was promoted to `/`.
 *
 * The route name is a leftover: `/home-v2/` was where the rebuild was previewed,
 * and the two swapped places rather than the archive taking a new URL. So the
 * page here is the *older* build, despite the "v2".
 *
 * Assembly order and layering follow
 * `docs/research/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/PAGE_TOPOLOGY.md`.
 * It is the pixel-accuracy benchmark AGENTS.md measures against — 10 of 11
 * sections exact at 1534px — so changing anything in it invalidates that claim.
 *
 * The header, footer, disclaimer and sticky mobile CTA come from
 * `(site)/layout.tsx` — this file renders page sections only.
 *
 * ⚠️ This is the only page that renders the BookingWizard, whose final step
 * embeds the live Halaxy widget. It takes real bookings from anyone who reaches
 * this URL, and `noindex` does not stop that — it only keeps the page out of
 * search. Rehome the wizard or remove this route if that matters.
 *
 * One thing about this page is load-bearing: there is no smooth-scroll library,
 * no scroll-snap, and no scroll-driven animation anywhere on it. Scrolling is
 * native. Do not add any.
 *
 * `noindex`: it is a near-duplicate of `/`, and two indexable copies of the
 * homepage would split the ranking signal. It is absent from `ROUTES` too, so
 * it appears in no sitemap, nav or breadcrumb.
 */
import type { Metadata } from "next";

import { HeroSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/HeroSection";
import { FeatureMarquee } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FeatureMarquee";
import { SupportSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SupportSection";
import { BookingWizard } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/BookingWizard";
import { PricingSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/PricingSection";
import { StepsSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/StepsSection";
import { StorySection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/StorySection";
import { CareAreasSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/CareAreasSection";
import { ApproachSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/ApproachSection";
import { BlogSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/BlogSection";
import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";
import { FaqSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FaqSection";

export const metadata: Metadata = {
  title: "Reference build | Horizon Health Care Partners",
  robots: { index: false, follow: false },
};

export default function CloneHome() {
  return (
    <>
      <HeroSection />
      <FeatureMarquee />
      <SupportSection>
        <BookingWizard />
      </SupportSection>
      <PricingSection />
      <StepsSection />
      <StorySection />
      <CareAreasSection />
      <ApproachSection />
      <BlogSection />
      <FinalCtaSection />
      <FaqSection />
    </>
  );
}
