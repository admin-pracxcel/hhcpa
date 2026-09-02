/**
 * `/services/` — the booking wizard's home.
 *
 * Explicit JSX rather than the ServicePage template: the wizard is a client
 * component with its own layout and state, not a content module, and this is
 * the only page that hosts it. The spec's hybrid model (D4) allows for exactly
 * this — a template for the nineteen service pages, explicit pages for the
 * twelve that do not fit it.
 *
 * ⚠️ Two properties of this page are load-bearing and easy to break:
 *
 *   1. It captures nothing. `/quiz/` is the sole lead-capturing flow (D3). The
 *      wizard routes to a booking and submits no form of its own, which keeps
 *      clinical answers out of any system that does not need them.
 *   2. Reaching the booking widget is NOT a booking and must not be counted
 *      toward the Clause 1.2 patient quota (spec §5.2). Do not add an
 *      analytics event here that treats arrival at the widget as a conversion.
 *
 * The wizard's final step embeds the clinic's live Halaxy widget, so this page
 * can take real bookings — see CUSTOMISATIONS.md, deviation 2.
 *
 * No FAQPage schema: this page has no FAQ. MedicalWebPage and BreadcrumbList
 * only.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbList, buildMedicalWebPage } from "@/lib/schema";
import { CLINIC } from "@/content/clinic";
import { SERVICES_META, SERVICES_PAGE } from "@/content/services-page";

import { RelatedCards } from "@/components/sections/RelatedCards";
import { ScrollRevealParagraph } from "@/components/sections/ScrollRevealParagraph";
import { ServiceHero } from "@/components/sections/ServiceHero";

import { BookingWizard } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/BookingWizard";
import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";
import { SupportSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SupportSection";

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

      <SupportSection
        id="book"
        eyebrow={SERVICES_PAGE.wizard.eyebrow}
        heading={SERVICES_PAGE.wizard.heading}
      >
        <BookingWizard />
      </SupportSection>

      <RelatedCards
        className="bg-[color:var(--hhcp-accent)]"
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
