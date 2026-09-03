/**
 * `/services/` — the service directory.
 *
 * Explicit JSX rather than the ServicePage template: this page's middle is the
 * homepage's FocusGrid, and its hero CTA jumps to an anchor rather than leaving
 * the page. The spec's hybrid model (D4) allows for exactly this — a template
 * for the nineteen service pages, explicit pages for the twelve that do not fit
 * it.
 *
 * ⚠️ This page used to host the BookingWizard, per spec decision D8. The grid
 * replaced it at request. Two consequences worth knowing:
 *
 *   1. The wizard now renders only on the archived clone at `/home-v2/`, which
 *      is noindex and absent from every nav and sitemap. So no page a patient
 *      can reach through the site books an appointment; rehome the wizard if
 *      live booking is wanted back.
 *   2. Nothing on this page can take a booking any more. The live Halaxy widget
 *      that could (CUSTOMISATIONS.md, deviation 2) sat in the wizard's final
 *      step.
 *
 * It captures nothing either way: `/quiz/` is the sole lead-capturing flow
 * (D3), and every card here is a link.
 *
 * No FAQPage schema: this page has no FAQ. MedicalWebPage and BreadcrumbList
 * only.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbList, buildMedicalWebPage } from "@/lib/schema";
import { CLINIC } from "@/content/clinic";
import { HOME_FOCUS } from "@/content/home";
import { SERVICES_META, SERVICES_PAGE } from "@/content/services-page";

import { FocusGrid } from "@/components/sections/FocusGrid";
import { RelatedCards } from "@/components/sections/RelatedCards";
import { ScrollRevealParagraph } from "@/components/sections/ScrollRevealParagraph";
import { ServiceHero } from "@/components/sections/ServiceHero";

import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";

export const metadata: Metadata = {
  title: SERVICES_META.title,
  description: SERVICES_META.description,
  alternates: { canonical: SERVICES_META.path },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildMedicalWebPage({
          name: SERVICES_META.title,
          description: SERVICES_META.description,
          path: SERVICES_META.path,
        })}
      />
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: SERVICES_PAGE.hero.eyebrow, path: SERVICES_META.path },
        ])}
      />

      <ServiceHero
        eyebrow={SERVICES_PAGE.hero.eyebrow}
        heading={SERVICES_PAGE.hero.heading}
        crumbs={SERVICES_PAGE.crumbs}
        primary={SERVICES_PAGE.hero.primary}
        secondary={SERVICES_PAGE.hero.secondary}
      />

      <ScrollRevealParagraph
        text={SERVICES_PAGE.intro}
        cta={{ label: "Check your eligibility", href: "/quiz/" }}
      />

      <FocusGrid
        className="bg-[color:var(--hhcp-accent)]"
        id="book"
        eyebrow={HOME_FOCUS.eyebrow}
        heading={HOME_FOCUS.heading}
        intro={HOME_FOCUS.intro}
        cards={HOME_FOCUS.cards}
      />

      <RelatedCards
        eyebrow={SERVICES_PAGE.related.eyebrow}
        heading={SERVICES_PAGE.related.heading}
        cards={SERVICES_PAGE.related.cards}
        footnote={SERVICES_PAGE.related.footnote}
        footnoteLinks={SERVICES_PAGE.related.footnoteLinks}
      />

      <FinalCtaSection
        heading={SERVICES_PAGE.closing.heading}
        body={SERVICES_PAGE.closing.body}
        actions={
          <div className="flex flex-row flex-wrap items-center justify-center gap-[16px]">
            <a className="hhcp-btn" href={SERVICES_PAGE.closing.primary.href}>
              {SERVICES_PAGE.closing.primary.label}
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
