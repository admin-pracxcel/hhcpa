/**
 * The rebuilt homepage — the content document's copy in the cloned homepage's
 * design language.
 *
 * `/` still serves the WordPress clone. This route is the replacement built to
 * HHCPA_Website_Content_UPDATED.md "PAGE 1: HOME", so the two can be compared
 * side by side before one is promoted.
 *
 * Section order is the content document's twelve-module map, top to bottom:
 *
 *    1. Hero                          HeroSection      (clone, new copy + CTAs)
 *    2. Value-proposition strip       FeatureMarquee   (clone, new items)
 *    3. Intro paragraph               LeadParagraph    (new)
 *    4. Choose your focus             FocusGrid        (new)
 *    5. Consultation pricing          PricingSection   (clone, new plans)
 *    6. How it works                  StepsSection     (clone, new copy)
 *    7. Why patients choose Horizon   ValueTiles       (new)
 *    8. Our approach to care          ApproachSection  (clone, new items)
 *    9. Built for the way …           StorySection     (clone, new copy)
 *   10. Knowledge hub teaser          BlogSection      (clone, new headings)
 *   11. Home FAQ                      FaqSection       (clone, new items)
 *   12. Closing CTA band              FinalCtaSection  (clone, new copy + CTAs)
 *
 * Two things are deliberately absent, because the content document does not
 * include them on this page: the BookingWizard (booking lives at `/quiz/` and
 * `/services/`) and the care-areas carousel.
 *
 * `noindex` while this is a preview: it is a near-duplicate of `/`, and two
 * indexable copies of the homepage would split the ranking signal for the terms
 * this page is built to win. Drop the robots block when it is promoted.
 */

import type { Metadata } from "next";

import { CLINIC } from "@/content/clinic";
import {
  HOME_APPROACH,
  HOME_CLOSING,
  HOME_FAQ,
  HOME_FOCUS,
  HOME_HERO,
  HOME_INTRO,
  HOME_KNOWLEDGE,
  HOME_META,
  HOME_PRICING,
  HOME_SEARCH,
  HOME_STEPS,
  HOME_VALUE_STRIP,
  HOME_WHY,
} from "@/content/home";

import { FocusGrid } from "@/components/sections/FocusGrid";
import { LeadParagraph } from "@/components/sections/LeadParagraph";
import { ScrollRevealParagraph } from "@/components/sections/ScrollRevealParagraph";
import { ValueTiles } from "@/components/sections/ValueTiles";

import { ApproachSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/ApproachSection";
import { BlogSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/BlogSection";
import { FaqSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FaqSection";
import { FeatureMarquee } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FeatureMarquee";
import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";
import { HeroSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/HeroSection";
import { PricingSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/PricingSection";
import { StepsSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/StepsSection";
import { StorySection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/StorySection";

export const metadata: Metadata = {
  title: HOME_META.title,
  description: HOME_META.description,
  robots: { index: false, follow: false },
};

export default function HomeV2() {
  return (
    <>
      <HeroSection
        heading={HOME_HERO.heading}
        body={HOME_HERO.body}
        /* 44px over the clone's fluid 64px, across half the container
           rather than a fixed 536px, so the longer headline sets in
           fewer lines. Full width once the columns collapse. */
        headingClassName="max-w-[50%] text-[44px] max-[991px]:max-w-full"
        actions={
          <div className="flex flex-row flex-wrap items-center gap-[16px]">
            <a className="hhcp-btn" href={HOME_HERO.primary.href}>
              {HOME_HERO.primary.label}
            </a>
            {/* Outlined in white rather than the shared --outline variant,
                whose dark border and text vanish against the hero video. */}
            <a
              className="font-roboto-mono rounded-[var(--hhcp-radius-pill)] border border-white px-[19.2px] py-[12.132px] text-[12px] leading-none font-medium uppercase text-white transition-all duration-300 hover:bg-white hover:text-[color:var(--hhcp-primary)]"
              href={HOME_HERO.secondary.href}
            >
              {HOME_HERO.secondary.label}
            </a>
          </div>
        }
      />

      <FeatureMarquee items={HOME_VALUE_STRIP} />

      <LeadParagraph
        eyebrow={HOME_INTRO.eyebrow}
        text={HOME_INTRO.text}
        cta={HOME_INTRO.cta}
      />

      {/* Under trial alongside the plain version above, not replacing it. */}
      <ScrollRevealParagraph text={HOME_INTRO.text} cta={HOME_INTRO.cta} />

      {/* --hhcp-accent is #f5fff9. Tinting these three breaks the page into
          bands instead of one continuous white scroll. */}
      <FocusGrid
        className="bg-[color:var(--hhcp-accent)]"
        eyebrow={HOME_FOCUS.eyebrow}
        heading={HOME_FOCUS.heading}
        intro={HOME_FOCUS.intro}
        cards={HOME_FOCUS.cards}
      />

      <PricingSection
        eyebrow={HOME_PRICING.eyebrow}
        heading={HOME_PRICING.heading}
        plans={HOME_PRICING.plans}
        footnote={HOME_PRICING.footnote}
        footnoteCta={HOME_PRICING.footnoteCta}
      />

      <StepsSection
        className="bg-[color:var(--hhcp-accent)]"
        eyebrow={HOME_STEPS.eyebrow}
        heading={HOME_STEPS.heading}
        steps={HOME_STEPS.steps}
        cta={HOME_STEPS.cta}
      />

      <ValueTiles
        eyebrow={HOME_WHY.eyebrow}
        heading={HOME_WHY.heading}
        tiles={HOME_WHY.tiles}
      />

      <ApproachSection
        eyebrow={HOME_APPROACH.eyebrow}
        heading={HOME_APPROACH.heading}
        paragraph=""
        items={HOME_APPROACH.items}
      />

      <StorySection
        eyebrow={HOME_SEARCH.eyebrow}
        heading={HOME_SEARCH.heading}
        paragraphs={HOME_SEARCH.paragraphs}
        points={HOME_SEARCH.points}
        cta={HOME_SEARCH.cta}
      />

      <BlogSection
        className="bg-[color:var(--hhcp-accent)]"
        eyebrow={HOME_KNOWLEDGE.eyebrow}
        heading={HOME_KNOWLEDGE.heading}
        cta={HOME_KNOWLEDGE.cta}
      />

      <FaqSection heading={HOME_FAQ.heading} items={HOME_FAQ.items} />

      <FinalCtaSection
        heading={HOME_CLOSING.heading}
        body={HOME_CLOSING.body}
        actions={
          <div className="flex flex-row flex-wrap items-center justify-center gap-[16px]">
            <a className="hhcp-btn" href={HOME_CLOSING.primary.href}>
              {HOME_CLOSING.primary.label}
            </a>
            <a
              className="font-roboto-mono rounded-[var(--hhcp-radius-pill)] border border-white px-[19.2px] py-[12.132px] text-[12px] leading-none font-medium uppercase text-white transition-all duration-300 hover:bg-white hover:text-[color:var(--hhcp-primary)]"
              href={CLINIC.phoneHref}
            >
              {`Call ${CLINIC.phone}`}
            </a>
          </div>
        }
      />
    </>
  );
}
