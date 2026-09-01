/**
 * Clone of https://www.horizonhealthcarepartners.com.au/
 *
 * Assembly order and layering follow
 * `docs/research/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/PAGE_TOPOLOGY.md`.
 *
 * The header, footer, disclaimer and sticky mobile CTA come from
 * `(site)/layout.tsx` — this file renders page sections only.
 *
 * One thing about this page is load-bearing: there is no smooth-scroll library,
 * no scroll-snap, and no scroll-driven animation anywhere on it. Scrolling is
 * native. Do not add any.
 *
 * Note this is still the cloned homepage. The content specification replaces it
 * with a different 12-module map (spec section 3.1); that is Phase 2 work.
 */
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

export default function Home() {
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
