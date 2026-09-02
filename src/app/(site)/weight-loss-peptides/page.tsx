/**
 * `/weight-loss-peptides/` — the primary money page.
 *
 * Built to HHCPA_Website_Content_UPDATED.md "PAGE 2: WEIGHT LOSS & PEPTIDES",
 * following its eleven-module map top to bottom:
 *
 *    1. Hero                        ServiceHero            (new)
 *    2. Value-proposition strip     FeatureMarquee         (clone)
 *    3. Intro paragraph             ScrollRevealParagraph  (shared with /home-v2/)
 *    4. What are peptides           StorySection           (clone, text + image)
 *    5. Who it may suit             ChecklistSection       (new)
 *    6. How it works                StepsSection           (clone)
 *    7. Why supervision matters     StatementBand          (new)
 *    8. What to expect on cost      PricingCueBand         (new)
 *    9. Related services            RelatedCards           (new)
 *   10. Weight Loss FAQ             FaqSection             (clone)
 *   11. Closing CTA band            FinalCtaSection        (clone)
 *
 * Schema is the four types the BUILD BLOCK asks for. FAQPage is emitted by
 * FaqSection from the same items it renders, so the markup and the structured
 * data cannot drift; the other three are declared here.
 *
 * This page is indexable, unlike /home-v2/: it owns "peptides for weight loss"
 * and there is nothing for it to compete with.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import {
  buildBreadcrumbList,
  buildMedicalWebPage,
  buildService,
} from "@/lib/schema";
import { CLINIC } from "@/content/clinic";
import {
  WLP_CLOSING,
  WLP_EXPLAINER,
  WLP_FAQ,
  WLP_HERO,
  WLP_INTRO,
  WLP_META,
  WLP_PRICING,
  WLP_RELATED,
  WLP_STEPS,
  WLP_SUITS,
  WLP_SUPERVISION,
  WLP_TRUST,
} from "@/content/weight-loss-peptides";

import { ChecklistSection } from "@/components/sections/ChecklistSection";
import { PricingCueBand } from "@/components/sections/PricingCueBand";
import { RelatedCards } from "@/components/sections/RelatedCards";
import { ScrollRevealParagraph } from "@/components/sections/ScrollRevealParagraph";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { StatementBand } from "@/components/sections/StatementBand";

import { FaqSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FaqSection";
import { FeatureMarquee } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FeatureMarquee";
import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";
import { StepsSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/StepsSection";
import { StorySection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/StorySection";

export const metadata: Metadata = {
  title: WLP_META.title,
  description: WLP_META.description,
  alternates: { canonical: WLP_META.path },
};

export default function WeightLossPeptides() {
  return (
    <>
      <JsonLd
        data={buildMedicalWebPage({
          name: WLP_META.title,
          description: WLP_META.description,
          path: WLP_META.path,
        })}
      />
      <JsonLd
        data={buildService({
          name: "Medical weight loss and peptide consultations",
          description: WLP_META.description,
          path: WLP_META.path,
        })}
      />
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: WLP_HERO.eyebrow, path: WLP_META.path },
        ])}
      />

      <ServiceHero
        eyebrow={WLP_HERO.eyebrow}
        heading={WLP_HERO.heading}
        crumbs={[{ label: "Home", href: "/" }]}
        primary={WLP_HERO.primary}
        secondary={WLP_HERO.secondary}
      />

      <FeatureMarquee items={WLP_TRUST} />

      <ScrollRevealParagraph
        text={WLP_INTRO}
        cta={{ label: "Check your eligibility", href: "/quiz/" }}
      />

      <StorySection
        className="bg-[color:var(--hhcp-accent)]"
        eyebrow={WLP_EXPLAINER.eyebrow}
        heading={WLP_EXPLAINER.heading}
        paragraphs={WLP_EXPLAINER.paragraphs}
        points={[]}
        cta={null}
        image={WLP_EXPLAINER.image}
        imageAlt={WLP_EXPLAINER.imageAlt}
      />

      <ChecklistSection
        eyebrow={WLP_SUITS.eyebrow}
        heading={WLP_SUITS.heading}
        intro={WLP_SUITS.intro}
        items={WLP_SUITS.items}
        caveat={WLP_SUITS.caveat}
      />

      <StepsSection
        className="bg-[color:var(--hhcp-accent)]"
        eyebrow={WLP_STEPS.eyebrow}
        heading={WLP_STEPS.heading}
        steps={WLP_STEPS.steps}
        cta={WLP_STEPS.cta}
      />

      <StatementBand
        eyebrow={WLP_SUPERVISION.eyebrow}
        heading={WLP_SUPERVISION.heading}
        body={WLP_SUPERVISION.body}
      />

      <PricingCueBand
        eyebrow={WLP_PRICING.eyebrow}
        heading={WLP_PRICING.heading}
        headline={WLP_PRICING.headline}
        headlineLabel={WLP_PRICING.headlineLabel}
        rows={WLP_PRICING.secondary}
        note={WLP_PRICING.note}
        cta={WLP_PRICING.cta}
      />

      <RelatedCards
        className="bg-[color:var(--hhcp-accent)]"
        eyebrow={WLP_RELATED.eyebrow}
        heading={WLP_RELATED.heading}
        cards={WLP_RELATED.cards}
        footnote={WLP_RELATED.footnote}
        footnoteLinks={WLP_RELATED.footnoteLinks}
      />

      <FaqSection heading={WLP_FAQ.heading} items={WLP_FAQ.items} />

      <FinalCtaSection
        heading={WLP_CLOSING.heading}
        body={WLP_CLOSING.body}
        actions={
          <div className="flex flex-row flex-wrap items-center justify-center gap-[16px]">
            <a className="hhcp-btn" href={WLP_CLOSING.primary.href}>
              {WLP_CLOSING.primary.label}
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
