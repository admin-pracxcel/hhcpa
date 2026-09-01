/**
 * Clone of https://www.horizonhealthcarepartners.com.au/
 *
 * Assembly order and layering follow
 * `docs/research/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/PAGE_TOPOLOGY.md`.
 *
 * Two things about the page-level layout are load-bearing:
 *  - The header is NOT sticky. It is an absolutely-positioned overlay (z-index 1) that scrolls
 *    away with the page, so it must render before <main> and must not be wrapped in anything
 *    that establishes a new stacking or positioning context.
 *  - There is no smooth-scroll library, no scroll-snap, and no scroll-driven animation anywhere
 *    on this page. Scrolling is native. Do not add any.
 */
import { SiteHeader } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader";
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
import { SiteFooter } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="brx-content">
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
      </main>
      <SiteFooter />
    </>
  );
}
