/**
 * `/our-practitioners/` — COMPLIANCE-CRITICAL.
 *
 * Published on 2026-09-03 at the client's instruction, for their review. The
 * route gate and the per-page noindex were lifted together.
 *
 * ⚠️ The roster is still empty, and the page says so in its own words rather
 * than pretending otherwise — no practitioner may be listed until their name,
 * public title and AHPRA registration number are confirmed. PractitionerCards
 * refuses to render anyone without a registration number, so publishing the
 * page cannot by itself put a non-compliant card in front of anyone.
 *
 * The BUILD BLOCK asks for Physician/Person schema per practitioner with the
 * AHPRA number as `identifier`. None is emitted, because there is nobody to
 * describe — structured data naming an unverifiable practitioner would be the
 * exact failure the gate exists to prevent. Add it alongside the first card.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbList, buildMedicalWebPage } from "@/lib/schema";
import { CLINIC } from "@/content/clinic";
import {
  PRACTITIONERS,
  PRACTITIONERS_META,
  PRACTITIONERS_PAGE,
} from "@/content/practitioners";

import { PractitionerCards } from "@/components/sections/PractitionerCards";
import { ScrollRevealParagraph } from "@/components/sections/ScrollRevealParagraph";
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

      <ServiceHero
        eyebrow={PRACTITIONERS_PAGE.hero.eyebrow}
        heading={PRACTITIONERS_PAGE.hero.heading}
        crumbs={PRACTITIONERS_PAGE.crumbs}
        primary={PRACTITIONERS_PAGE.hero.primary}
        secondary={PRACTITIONERS_PAGE.hero.secondary}
      />

      <FeatureMarquee />

      <ScrollRevealParagraph
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
