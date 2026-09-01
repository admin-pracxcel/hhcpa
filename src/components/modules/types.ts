/**
 * The module vocabulary.
 *
 * Analysis of all 31 written page module maps found 278 module instances across
 * 16 distinct types. That is the complete UI surface of the site — see the design
 * spec, §4.1.
 *
 * Four of the sixteen are frame modules used directly by page templates (Hero,
 * TrustBar, FaqAccordion, ClosingCta) rather than through this union. The twelve
 * below are the variable middle of a page.
 *
 * There is deliberately NO testimonial, review-count or star-rating member.
 * AHPRA treats those as advertising a regulated health service and Clause 2.6 of
 * the Service Agreement forbids them. Do not add one.
 */
import type { PriceKey } from "@/content/pricing";

export interface ImageRef {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface LinkRef {
  label: string;
  href: string;
  /** Optional supporting line, used by related-service cards. */
  body?: string;
}

export interface StepItem {
  title: string;
  body: string;
}

export interface TileItem {
  title: string;
  body: string;
}

export interface Practitioner {
  name: string;
  title: string;
  ahpraNumber: string;
  focusAreas: readonly string[];
  photo: ImageRef | null;
}

export type ModuleSpec =
  | { kind: "intro"; text: string }
  | {
      kind: "textImage";
      heading: string;
      body: readonly string[];
      image: ImageRef;
      /** Which side the image sits on at >991px. Alternating rows flip this. */
      imageSide?: "left" | "right";
    }
  | { kind: "steps"; heading: string; steps: readonly StepItem[] }
  | { kind: "featureTiles"; heading: string; tiles: readonly TileItem[] }
  | {
      kind: "checklist";
      heading: string;
      intro?: string;
      items: readonly string[];
      outro?: string;
    }
  | { kind: "relatedServices"; heading: string; links: readonly LinkRef[] }
  | { kind: "inlineCta"; heading?: string; body: string; links: readonly LinkRef[] }
  | {
      kind: "pricingCue";
      heading: string;
      body: string;
      priceKey: PriceKey;
      note?: string;
    }
  | { kind: "safetyCallout"; heading: string; body: string }
  | { kind: "disclosureCallout"; heading: string; body: string; link: LinkRef }
  | { kind: "practitionerCards"; heading: string; practitioners: readonly Practitioner[] }
  | { kind: "contactBlock"; heading: string };

export type ModuleKind = ModuleSpec["kind"];
