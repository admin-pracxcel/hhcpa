/**
 * `/our-practitioners/` — COMPLIANCE-CRITICAL.
 *
 * Published on 2026-09-03 at the client's instruction, for their review. The
 * route gate and the per-page noindex were lifted together.
 *
 * ⚠️ No practitioner may be listed until their name, public title and AHPRA
 * registration number are confirmed. PractitionerCards refuses to render
 * anyone without a registration number, so publishing the page cannot by
 * itself put a non-compliant card in front of anyone.
 *
 * The roster was empty when this page shipped on 2026-09-03 and the schema
 * the BUILD BLOCK asks for was deliberately withheld: structured data naming
 * an unverifiable practitioner is the exact failure the gate exists to
 * prevent. Eight are confirmed now, so it is emitted — `buildPractitionerList`
 * derives each node's type from the AHPRA prefix, and refuses to call a nurse
 * practitioner a Physician on the same grounds the page copy does.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import {
  buildBreadcrumbList,
  buildMedicalWebPage,
  buildPractitionerList,
} from "@/lib/schema";
import { CLINIC } from "@/content/clinic";
import {
  PRACTITIONERS,
  PRACTITIONERS_META,
  PRACTITIONERS_PAGE,
} from "@/content/practitioners";

import { PractitionerCards } from "@/components/sections/PractitionerCards";
import { LeadParagraph } from "@/components/sections/LeadParagraph";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ValueTiles } from "@/components/sections/ValueTiles";

import { FeatureMarquee } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FeatureMarquee";
import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";

export const metadata: Metadata = {
  title: PRACTITIONERS_META.title,
  description: PRACTITIONERS_META.description,
  alternates: { canonical: PRACTITIONERS_META.path },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildMedicalWebPage({
          name: PRACTITIONERS_META.title,
          description: PRACTITIONERS_META.description,
          path: PRACTITIONERS_META.path,
        })}
      />
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: PRACTITIONERS_PAGE.hero.eyebrow, path: PRACTITIONERS_META.path },
        ])}
      />
      {/*
        One node per practitioner, each carrying their AHPRA registration as a
        verifiable identifier, wrapped in an ItemList. The site-wide graph
        references these same @ids from its `employee` array, so the
        organisation and the people are one connected entity rather than two
        unrelated descriptions.
      */}
      <JsonLd
        data={buildPractitionerList(PRACTITIONERS, PRACTITIONERS_META.path)}
      />

      <ServiceHero
        eyebrow={PRACTITIONERS_PAGE.hero.eyebrow}
        heading={PRACTITIONERS_PAGE.hero.heading}
        media={PRACTITIONERS_PAGE.hero.media}
        crumbs={PRACTITIONERS_PAGE.crumbs}
        primary={PRACTITIONERS_PAGE.hero.primary}
        secondary={PRACTITIONERS_PAGE.hero.secondary}
      />

      <FeatureMarquee />

      <LeadParagraph
        text={PRACTITIONERS_PAGE.intro}
        cta={{ label: "Check your eligibility", href: "/quiz/" }}
      />

      <PractitionerCards
        eyebrow={PRACTITIONERS_PAGE.roster.eyebrow}
        heading={PRACTITIONERS_PAGE.roster.heading}
        practitioners={PRACTITIONERS}
        emptyMessage={PRACTITIONERS_PAGE.roster.empty}
      />

      <ValueTiles
        className="bg-[color:var(--hhcp-accent)]"
        eyebrow={PRACTITIONERS_PAGE.standards.eyebrow}
        heading={PRACTITIONERS_PAGE.standards.heading}
        tiles={PRACTITIONERS_PAGE.standards.tiles}
        columns={2}
      />

      <FinalCtaSection
        heading={PRACTITIONERS_PAGE.closing.heading}
        body={PRACTITIONERS_PAGE.closing.body}
        actions={
          <div className="flex flex-row flex-wrap items-center justify-center gap-[16px]">
            <a className="hhcp-btn" href={PRACTITIONERS_PAGE.closing.primary.href}>
              {PRACTITIONERS_PAGE.closing.primary.label}
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
