/**
 * The homepage — the content document's copy in the cloned homepage's design
 * language.
 *
 * Built to HHCPA_Website_Content_UPDATED.md "PAGE 1: HOME". It was previewed at
 * `/home-v2/` and promoted here; the WordPress clone it replaced now sits at
 * `/home-v2/`, noindex, as the reference build.
 *
 * Section order is the content document's twelve-module map, top to bottom:
 *
 *    1. Hero                          HeroSection      (clone, new copy + CTAs)
 *    2. Value-proposition strip       FeatureMarquee   (clone, new items)
 *    3. Intro paragraph               ScrollRevealParagraph (new)
 *    4. Choose your focus             FocusGrid        (new)
 *    5. Consultation pricing          PricingSection   (clone, new plans)
 *    6. How it works                  StepsSection     (clone, new copy)
 *    7. Why patients choose Horizon   ValueTiles       (new)
 *    8. Our approach to care          ApproachSection  (clone, new items)
 *    9. Built for the way …            StorySection     (clone, new copy)
 *   10. Knowledge hub teaser          BlogSection      (clone, new headings)
 *   11. Home FAQ                      FaqSection       (clone, new items)
 *   12. Closing CTA band              FinalCtaSection  (clone, new copy + CTAs)
 *
 * Two things are deliberately absent, because the content document does not
 * include them on this page: the care-areas carousel, and the BookingWizard.
 *
 * ⚠️ The wizard is the consequence worth knowing about. It was the site's only
 * live booking path — its final step embeds the Halaxy widget, which takes real
 * bookings (CUSTOMISATIONS.md, deviation 2). It rendered only on the clone, so
 * with the clone off `/` nothing on the public site books an appointment; every
 * CTA now routes to `/quiz/`, which captures a lead for follow-up instead. If
 * live booking is wanted back, the wizard has to be rehomed onto a public page
 * — it is not lost, just unrouted.
 *
 * There is no smooth-scroll library, no scroll-snap and no scroll listener on
 * this page. `ScrollRevealParagraph` animates from CSS `animation-timeline`.
 * Do not add any.
 */

import type { Metadata } from "next";

import { CLINIC } from "@/content/clinic";
import { articleCards } from "@/content/articles";
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
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <HeroSection
        heading={HOME_HERO.heading}
        body={HOME_HERO.body}
        /* Half the container rather than the clone's fixed 536px, so the
           longer headline sets in fewer lines, and full width once the
           columns collapse.

           The step down at 991 and 767 is not only taste: the hero is
           100dvh (less the CTA bar) with its content bottom-anchored, so an
           over-large headline eats the space from the top. At 44px the block
           ran 517-734px tall on phones and pushed itself under the header at
           360x780, then clipped 287px off at 320x568. */
        headingClassName="max-w-[50%] text-[52px] max-[991px]:max-w-full max-[991px]:text-[36px] max-[767px]:text-[28px] max-[478px]:text-[24px]"
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

      {/* The newest three, from the same source /articles/ lists in full. The
          clone's own hardcoded copies of these three disagreed with the article
          pages about every one of topic, read time and date. */}
      <BlogSection
        className="bg-[color:var(--hhcp-accent)]"
        eyebrow={HOME_KNOWLEDGE.eyebrow}
        heading={HOME_KNOWLEDGE.heading}
        posts={articleCards(3)}
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
