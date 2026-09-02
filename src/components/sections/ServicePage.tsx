/**
 * The template every service page renders through.
 *
 * The design spec (§4) called for one template driving the service pages from
 * data, and the section vocabulary is now settled enough to build it. Without
 * it, sixteen pages means sixteen near-identical files: the same hero, trust
 * bar, intro, FAQ and closing band retyped each time, with only the middle
 * differing. A change to any of the shared parts would then be a sixteen-file
 * edit.
 *
 * The middle is a `ServiceModule[]` — a discriminated union with an exhaustive
 * switch below. Adding a member without adding a case is a type error, thanks
 * to the `never` assignment in the default branch. That guard is not
 * decorative: React's types allow a component to return `undefined`, so
 * without it a missing case compiles cleanly and renders nothing at all.
 *
 * `tinted` on a module paints it `--hhcp-accent`. It is set per module rather
 * than striped automatically, because the dark statement bands and the
 * inherently-tinted cards break any automatic alternation.
 */

import { CLINIC, TRUST_BAR_DEFAULT } from "@/content/clinic";
import { JsonLd } from "@/components/JsonLd";
import {
  buildBreadcrumbList,
  buildMedicalWebPage,
  buildService,
} from "@/lib/schema";
import { cn } from "@/lib/utils";
import type { PriceKey } from "@/content/pricing";

import { ChecklistSection } from "./ChecklistSection";
import { InlineCtaBand } from "./InlineCtaBand";
import { PriceTable } from "./PriceTable";
import { PricingCueBand } from "./PricingCueBand";
import { RelatedCards } from "./RelatedCards";
import { ScrollRevealParagraph } from "./ScrollRevealParagraph";
import { ServiceHero } from "./ServiceHero";
import type { Crumb } from "./ServiceHero";
import { SplitFeature } from "./SplitFeature";
import { StatementBand } from "./StatementBand";
import { ValueTiles } from "./ValueTiles";
import type { RelatedCard } from "./RelatedCards";

import { FaqSection } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FaqSection";
import { FeatureMarquee } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FeatureMarquee";
import { FinalCtaSection } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";
import { StepsSection } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/StepsSection";

interface LinkRef {
  readonly label: string;
  readonly href: string;
}

export type ServiceModule =
  | {
      readonly kind: "split";
      readonly tinted?: boolean;
      readonly eyebrow: string;
      readonly heading: string;
      readonly paragraphs: readonly string[];
      readonly cta?: LinkRef;
      readonly image: string;
      readonly imageAlt: string;
      readonly imageSide?: "left" | "right";
    }
  | {
      readonly kind: "tiles";
      readonly tinted?: boolean;
      readonly eyebrow: string;
      readonly heading: string;
      readonly tiles: readonly { readonly title: string; readonly body: string }[];
      readonly columns?: 2 | 3;
    }
  | {
      readonly kind: "statement";
      readonly eyebrow: string;
      readonly heading: string;
      readonly paragraphs: readonly string[];
    }
  | {
      readonly kind: "checklist";
      readonly tinted?: boolean;
      readonly eyebrow: string;
      readonly heading: string;
      readonly intro: string;
      readonly items: readonly string[];
      readonly caveat: string;
    }
  | {
      readonly kind: "steps";
      readonly tinted?: boolean;
      readonly eyebrow: string;
      readonly heading: string;
      readonly steps: readonly {
        readonly pill: string;
        readonly title: string;
        readonly description: string;
      }[];
      readonly cta?: LinkRef;
    }
  | {
      readonly kind: "pricingCue";
      readonly tinted?: boolean;
      readonly eyebrow: string;
      readonly heading: string;
      readonly headline: string;
      readonly headlineLabel: string;
      readonly rows: readonly { readonly label: string; readonly value: string }[];
      readonly note: string;
      readonly cta: LinkRef;
    }
  | {
      readonly kind: "related";
      readonly tinted?: boolean;
      readonly eyebrow: string;
      readonly heading: string;
      readonly cards: readonly RelatedCard[];
      readonly footnote: string;
      readonly footnoteLinks: readonly LinkRef[];
    }
  | {
      readonly kind: "priceTable";
      readonly tinted?: boolean;
      readonly eyebrow: string;
      readonly heading: string;
      readonly valueHeading: string;
      readonly rows: readonly PriceKey[];
      readonly labels?: Partial<Record<PriceKey, string>>;
      readonly stripFrom?: boolean;
      readonly note?: string;
    }
  | {
      readonly kind: "inlineCta";
      readonly heading: string;
      readonly lead: string;
      readonly mid: string;
      readonly tail: string;
      readonly links: readonly [LinkRef, LinkRef];
      readonly cta: LinkRef;
    };

export interface ServicePageData {
  readonly meta: {
    readonly title: string;
    readonly description: string;
    readonly path: string;
  };
  readonly hero: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly primary: LinkRef;
    readonly secondary: LinkRef;
  };
  readonly crumbs: readonly Crumb[];
  /**
   * Defaults to the site-wide trust bar. `null` omits the strip: the transfer
   * page's module map does not include one, and the shorter pages read better
   * without it.
   */
  readonly trust?: readonly string[] | null;
  readonly intro: string;
  readonly introCta?: LinkRef;
  readonly modules: readonly ServiceModule[];
  /** Omit on pages whose module map has no FAQ; no FAQPage schema is emitted. */
  readonly faq?: {
    readonly heading: string;
    readonly items: readonly {
      readonly id: string;
      readonly question: string;
      readonly answer: string;
    }[];
  };
  readonly closing: {
    readonly heading: string;
    readonly body: string;
    readonly primary: LinkRef;
  };
  /**
   * Only the silo entry pages declare Service; the treatment-detail pages
   * beneath them do not, following each page's own BUILD BLOCK.
   */
  readonly serviceSchemaName?: string;
}

const TINT = "bg-[color:var(--hhcp-accent)]";

export function ServicePage({ data }: { data: ServicePageData }) {
  return (
    <>
      <JsonLd
        data={buildMedicalWebPage({
          name: data.meta.title,
          description: data.meta.description,
          path: data.meta.path,
        })}
      />
      {data.serviceSchemaName !== undefined && (
        <JsonLd
          data={buildService({
            name: data.serviceSchemaName,
            description: data.meta.description,
            path: data.meta.path,
          })}
        />
      )}
      <JsonLd
        data={buildBreadcrumbList([
          ...data.crumbs.map((crumb) => ({
            name: crumb.label,
            path: crumb.href,
          })),
          { name: data.hero.eyebrow, path: data.meta.path },
        ])}
      />

      <ServiceHero
        eyebrow={data.hero.eyebrow}
        heading={data.hero.heading}
        crumbs={data.crumbs}
        primary={data.hero.primary}
        secondary={data.hero.secondary}
      />

      {data.trust !== null && (
        <FeatureMarquee items={data.trust ?? TRUST_BAR_DEFAULT} />
      )}

      <ScrollRevealParagraph
        text={data.intro}
        cta={data.introCta ?? { label: "Check your eligibility", href: "/quiz/" }}
      />

      {data.modules.map((module, index) => (
        <Module key={`${module.kind}-${index}`} module={module} />
      ))}

      {data.faq !== undefined && (
        <FaqSection heading={data.faq.heading} items={data.faq.items} />
      )}

      <FinalCtaSection
        heading={data.closing.heading}
        body={data.closing.body}
        actions={
          <div className="flex flex-row flex-wrap items-center justify-center gap-[16px]">
            <a className="hhcp-btn" href={data.closing.primary.href}>
              {data.closing.primary.label}
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

function Module({ module }: { module: ServiceModule }) {
  switch (module.kind) {
    case "split":
      return (
        <SplitFeature
          className={cn(module.tinted === true && TINT)}
          eyebrow={module.eyebrow}
          heading={module.heading}
          paragraphs={module.paragraphs}
          cta={module.cta}
          image={module.image}
          imageAlt={module.imageAlt}
          imageSide={module.imageSide}
        />
      );
    case "tiles":
      return (
        <ValueTiles
          className={cn(module.tinted === true && TINT)}
          eyebrow={module.eyebrow}
          heading={module.heading}
          tiles={module.tiles}
          columns={module.columns}
        />
      );
    case "statement":
      return (
        <StatementBand
          eyebrow={module.eyebrow}
          heading={module.heading}
          paragraphs={module.paragraphs}
        />
      );
    case "checklist":
      return (
        <ChecklistSection
          className={cn(module.tinted === true && TINT)}
          eyebrow={module.eyebrow}
          heading={module.heading}
          intro={module.intro}
          items={module.items}
          caveat={module.caveat}
        />
      );
    case "steps":
      return (
        <StepsSection
          className={cn(module.tinted === true && TINT)}
          eyebrow={module.eyebrow}
          heading={module.heading}
          steps={module.steps}
          cta={module.cta}
        />
      );
    case "pricingCue":
      return (
        <PricingCueBand
          className={cn(module.tinted === true && TINT)}
          eyebrow={module.eyebrow}
          heading={module.heading}
          headline={module.headline}
          headlineLabel={module.headlineLabel}
          rows={module.rows}
          note={module.note}
          cta={module.cta}
        />
      );
    case "related":
      return (
        <RelatedCards
          className={cn(module.tinted === true && TINT)}
          eyebrow={module.eyebrow}
          heading={module.heading}
          cards={module.cards}
          footnote={module.footnote}
          footnoteLinks={module.footnoteLinks}
        />
      );
    case "priceTable":
      return (
        <PriceTable
          className={cn(module.tinted === true && TINT)}
          eyebrow={module.eyebrow}
          heading={module.heading}
          valueHeading={module.valueHeading}
          rows={module.rows}
          labels={module.labels}
          stripFrom={module.stripFrom}
          note={module.note}
        />
      );
    case "inlineCta":
      return (
        <InlineCtaBand
          heading={module.heading}
          lead={module.lead}
          mid={module.mid}
          tail={module.tail}
          links={module.links}
          cta={module.cta}
        />
      );
    default: {
      /**
       * Exhaustiveness guard. Adding a member to ServiceModule without a case
       * above makes this assignment a type error.
       *
       * Not redundant with the switch: React's types accept `undefined` as a
       * component return, so a missing case would otherwise compile silently
       * and render nothing.
       */
      const exhaustive: never = module;
      return exhaustive;
    }
  }
}

/** Every service page's metadata is built the same way. */
export function serviceMetadata(data: ServicePageData) {
  return {
    title: data.meta.title,
    description: data.meta.description,
    alternates: { canonical: data.meta.path },
  };
}
