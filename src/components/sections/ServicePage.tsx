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
  buildAboutPage,
  buildBreadcrumbList,
  buildMedicalWebPage,
  buildService,
} from "@/lib/schema";
import { cn } from "@/lib/utils";
import type { PriceKey } from "@/content/pricing";
import { QUIZ_META, quizHrefFor } from "@/content/quiz";

import { ApproachSection } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/ApproachSection";
import { CareAreasSection } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/CareAreasSection";
import { ChecklistSection } from "./ChecklistSection";
import { InlineCtaBand } from "./InlineCtaBand";
import { PriceCards } from "./PriceCards";
import type { PriceFeature } from "./PriceCards";
import { PriceTiles } from "./PriceTiles";
import type { ConsultationPlan } from "@/content/consultation-plans";
import { PricingCueBand } from "./PricingCueBand";
import { RelatedCards } from "./RelatedCards";
import { LeadParagraph } from "./LeadParagraph";
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
      /** Three consultation cards, with one free item banded above them. */
      readonly kind: "priceCards";
      readonly tinted?: boolean;
      readonly eyebrow: string;
      readonly heading: string;
      readonly feature: PriceFeature;
      readonly plans: readonly ConsultationPlan[];
      readonly footnote?: string;
    }
  | {
      /** A longer price list, as tiles rather than columns. */
      readonly kind: "priceTiles";
      readonly tinted?: boolean;
      readonly eyebrow: string;
      readonly heading: string;
      readonly rows: readonly PriceKey[];
      readonly labels?: Partial<Record<PriceKey, string>>;
      readonly note?: string;
    }
  /*
   * Her two original sections, carried across whole rather than re-expressed
   * as tiles. Both take no content: the components hold her copy as their
   * defaults, and those defaults are the clone's, so they are already hers.
   * That is the point of using them — a `tiles` approximation is what got
   * the design wrong here in the first place.
   */
  | { readonly kind: "approach" }
  | { readonly kind: "careAreas" }
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
    /** Smaller line under the H1. About Us is the only page using one. */
    readonly subheading?: string;
    /** Muted looping background video. About Us is the only page using one. */
    readonly media?: {
      readonly src: string;
      readonly poster: string;
      readonly alt: string;
    };
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
  /**
   * One paragraph on most pages; an array where the approved copy is several,
   * as on About Us. `LeadParagraph` renders either.
   */
  readonly intro: string | readonly string[];
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
  /**
   * The quiz service this page belongs to, so its CTAs deep-link.
   *
   * Every `/quiz/` link on the page becomes `/quiz/?service=…`, which lands
   * the visitor past the branch-selection step with this service already
   * chosen. A child page names its parent hub's service; the quiz has no key
   * of its own for, say, erectile dysfunction.
   *
   * Omit it and every link stays `/quiz/`, which is the correct behaviour for
   * the pages that are not a service — /pricing/, /about-us/ and the rest.
   * An unrecognised value is also ignored rather than producing a dead link.
   */
  readonly quizService?: string;
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
  /**
   * Defaults to MedicalWebPage, which is what every service page's BUILD BLOCK
   * asks for. About Us asks for AboutPage instead.
   */
  readonly pageSchema?: "MedicalWebPage" | "AboutPage";
}

const TINT = "bg-[color:var(--hhcp-accent)]";

/**
 * Rewrites every `href: "/quiz/"` in the page data to the service's deep link.
 *
 * Done here, once, rather than at each of the sixty-odd call sites across the
 * content files. Those sites are hero buttons, lead-paragraph links, module
 * CTAs and the closing band, and most of them are not rendered by this file —
 * they are handed to ServiceHero, LeadParagraph and the modules. Transforming
 * the data on the way in reaches all of them and leaves one place to read.
 *
 * Only keys named `href` whose value is exactly the quiz path are touched, so
 * body copy that happens to mention the path is left alone.
 */
function rewriteQuizHrefs<T>(value: T, href: string): T {
  if (Array.isArray(value)) {
    return value.map((item) => rewriteQuizHrefs(item, href)) as T;
  }
  if (typeof value === "object" && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] =
        key === "href" && item === QUIZ_META.path
          ? href
          : rewriteQuizHrefs(item, href);
    }
    return out as T;
  }
  return value;
}

function withQuizService(data: ServicePageData): ServicePageData {
  if (data.quizService === undefined) return data;
  const href = quizHrefFor(data.quizService);
  /* quizHrefFor returns the plain path for a service the quiz does not know,
     so an unrecognised value costs nothing and changes nothing. */
  if (href === QUIZ_META.path) return data;
  return rewriteQuizHrefs(data, href);
}

export function ServicePage({ data: raw }: { data: ServicePageData }) {
  const data = withQuizService(raw);
  return (
    <>
      <JsonLd
        data={(data.pageSchema === "AboutPage"
          ? buildAboutPage
          : buildMedicalWebPage)({
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
        subheading={data.hero.subheading}
        media={data.hero.media}
        crumbs={data.crumbs}
        primary={data.hero.primary}
        secondary={data.hero.secondary}
      />

      {data.trust !== null && (
        <FeatureMarquee items={data.trust ?? TRUST_BAR_DEFAULT} />
      )}

      <LeadParagraph
        text={data.intro}
        /*
         * The fallback goes through the same rewrite as everything else.
         * It is not part of `data`, so the transform above never sees it —
         * which left the one quiz link most pages rely on pointing at the
         * generic quiz while the rest of the page deep-linked.
         */
        cta={
          data.introCta ?? {
            label: "Check your eligibility",
            href:
              raw.quizService === undefined
                ? QUIZ_META.path
                : quizHrefFor(raw.quizService),
          }
        }
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
    case "approach":
      return <ApproachSection />;
    case "careAreas":
      return <CareAreasSection />;
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
    case "priceCards":
      return (
        <PriceCards
          className={cn(module.tinted === true && TINT)}
          eyebrow={module.eyebrow}
          heading={module.heading}
          feature={module.feature}
          plans={module.plans}
          footnote={module.footnote}
        />
      );
    case "priceTiles":
      return (
        <PriceTiles
          className={cn(module.tinted === true && TINT)}
          eyebrow={module.eyebrow}
          heading={module.heading}
          rows={module.rows}
          labels={module.labels}
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
