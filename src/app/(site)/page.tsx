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
 *    3. Intro paragraph               LeadParagraph (new)
 *    4. Choose your service           ServiceBoxes     (new)
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
 * this page. `LeadParagraph` animates from CSS `animation-timeline`.
 * Do not add any.
 */

import type { Metadata } from "next";

import { CLINIC } from "@/content/clinic";
import { articleCards } from "@/content/articles";
import {
  HOME_APPROACH,
  HOME_CLOSING,
  HOME_FAQ,
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

import { ServiceBoxes } from "@/components/sections/ServiceBoxes";
import { SERVICE_BOXES, SERVICE_BOXES_HEADING } from "@/content/service-boxes";
import { LeadParagraph } from "@/components/sections/LeadParagraph";
import { ValueTiles } from "@/components/sections/ValueTiles";

import { ApproachSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/ApproachSection";
import { CareAreasSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/CareAreasSection";
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

      <LeadParagraph text={HOME_INTRO.text} cta={HOME_INTRO.cta} />

      {/* --hhcp-accent is #f5fff9. Tinting these three breaks the page into
          bands instead of one continuous white scroll. */}
      {/*
        Her "Choose Your Service" boxes, replacing the eight-card focus grid.
        Her 9 September instruction and the 11 September audit; see
        content/service-boxes.ts for the three agreed departures.
      */}
      <ServiceBoxes
        id="book"
        eyebrow={SERVICE_BOXES_HEADING.eyebrow}
        heading={SERVICE_BOXES_HEADING.heading}
        intro={SERVICE_BOXES_HEADING.intro}
        boxes={SERVICE_BOXES}
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

      {/*
        §4.1.8: her "How we support you" slider, back on the homepage. It was
        already built — CareAreasSection is a faithful port of her Splide
        auto-scroll carousel, complete with its five slides and their images —
        but it only ever rendered on the archived clone. Nothing new to write;
        it just needed putting back.

        Note the spec's §10.1 lists six slider categories, the first being
        "Professional Medical Consultations". Checked against her live DOM:
        that string is the section's own h2, not a slide. There are five.
      */}
      <CareAreasSection />

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

      {/*
        §4.1.11: the FAQ closes the homepage, with "Easy Access, Professional
        Care" above it rather than below. Every other page still ends on the
        closing band; this one ends on her questions.
      */}
      <FaqSection heading={HOME_FAQ.heading} items={HOME_FAQ.items} />
    </>
  );
}
