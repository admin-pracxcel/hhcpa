/**
 * `/weight-loss-peptides/weight-loss-injections/`
 *
 * Built to HHCPA_Website_Content_UPDATED.md "PAGE 3: WEIGHT LOSS INJECTIONS",
 * following its ten-module map:
 *
 *    1. Hero                        ServiceHero
 *    2. Value-proposition strip     FeatureMarquee
 *    3. Intro paragraph             ScrollRevealParagraph
 *    4. How treatment is decided    StatementBand
 *    5. What to expect              ValueTiles
 *    6. Safety and suitability      SplitFeature
 *    7. Interlinking                RelatedCards
 *    8. How to begin                InlineCtaBand    (new)
 *    9. FAQ                         FaqSection
 *   10. Closing CTA band            FinalCtaSection
 *
 * Modules 4, 5 and 6 depart from the map's suggested components, because the
 * map and the copy disagree about their shape. The map asks for numbered step
 * cards at 4 and a text-and-image split at 5, but the copy at 4 is two
 * paragraphs of continuous argument with no steps in it, and the copy at 5 is
 * four labelled points. Writing steps that are not in the approved copy is not
 * a free choice on a regulated page (clause 6.2(b)), so each module follows the
 * shape of the words it has to carry: a prose band, then tiles, then the split
 * with the image at 6.
 *
 * Schema is the three types the BUILD BLOCK asks for. Note it does not list
 * Service here, unlike the parent page — this is a treatment-detail page under
 * the silo, not the service entry itself.
 *
 * The trust bar is `TRUST_BAR_DEFAULT` from `clinic.ts`: the source gives no
 * list for this page, and the site-wide default is what that constant is for.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbList, buildMedicalWebPage } from "@/lib/schema";
import { CLINIC, TRUST_BAR_DEFAULT } from "@/content/clinic";
import {
  WLI_BEGIN,
  WLI_CLOSING,
  WLI_DECISION,
  WLI_EXPECT,
  WLI_FAQ,
  WLI_HERO,
  WLI_INTRO,
  WLI_META,
  WLI_RELATED,
  WLI_SAFETY,
} from "@/content/weight-loss-injections";

import { InlineCtaBand } from "@/components/sections/InlineCtaBand";
import { RelatedCards } from "@/components/sections/RelatedCards";
import { ScrollRevealParagraph } from "@/components/sections/ScrollRevealParagraph";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SplitFeature } from "@/components/sections/SplitFeature";
import { StatementBand } from "@/components/sections/StatementBand";
import { ValueTiles } from "@/components/sections/ValueTiles";

import { FaqSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FaqSection";
import { FeatureMarquee } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FeatureMarquee";
import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";

export const metadata: Metadata = {
  title: WLI_META.title,
  description: WLI_META.description,
  alternates: { canonical: WLI_META.path },
};

export default function WeightLossInjections() {
  return (
    <>
      <JsonLd
        data={buildMedicalWebPage({
          name: WLI_META.title,
          description: WLI_META.description,
          path: WLI_META.path,
        })}
      />
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Weight Loss & Peptides", path: "/weight-loss-peptides/" },
          { name: WLI_HERO.eyebrow, path: WLI_META.path },
        ])}
      />

      <ServiceHero
        eyebrow={WLI_HERO.eyebrow}
        heading={WLI_HERO.heading}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Weight Loss & Peptides", href: "/weight-loss-peptides/" },
        ]}
        primary={WLI_HERO.primary}
        secondary={WLI_HERO.secondary}
      />

      <FeatureMarquee items={TRUST_BAR_DEFAULT} />

      <ScrollRevealParagraph
        text={WLI_INTRO}
        cta={{ label: "Check your eligibility", href: "/quiz/" }}
      />

      <StatementBand
        eyebrow={WLI_DECISION.eyebrow}
        heading={WLI_DECISION.heading}
        paragraphs={WLI_DECISION.paragraphs}
      />

      <ValueTiles
        eyebrow={WLI_EXPECT.eyebrow}
        heading={WLI_EXPECT.heading}
        tiles={WLI_EXPECT.tiles}
        columns={2}
      />

      <SplitFeature
        className="bg-[color:var(--hhcp-accent)]"
        eyebrow={WLI_SAFETY.eyebrow}
        heading={WLI_SAFETY.heading}
        paragraphs={WLI_SAFETY.paragraphs}
        cta={WLI_SAFETY.cta}
        image={WLI_SAFETY.image}
        imageAlt={WLI_SAFETY.imageAlt}
        imageSide={WLI_SAFETY.imageSide}
      />

      <RelatedCards
        eyebrow={WLI_RELATED.eyebrow}
        heading={WLI_RELATED.heading}
        cards={WLI_RELATED.cards}
        footnote={WLI_RELATED.footnote}
        footnoteLinks={WLI_RELATED.footnoteLinks}
      />

      <InlineCtaBand
        heading={WLI_BEGIN.heading}
        lead={WLI_BEGIN.lead}
        mid={WLI_BEGIN.mid}
        tail={WLI_BEGIN.tail}
        links={WLI_BEGIN.links}
        cta={WLI_BEGIN.cta}
      />

      <FaqSection heading={WLI_FAQ.heading} items={WLI_FAQ.items} />

      <FinalCtaSection
        heading={WLI_CLOSING.heading}
        body={WLI_CLOSING.body}
        actions={
          <div className="flex flex-row flex-wrap items-center justify-center gap-[16px]">
            <a className="hhcp-btn" href={WLI_CLOSING.primary.href}>
              {WLI_CLOSING.primary.label}
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
