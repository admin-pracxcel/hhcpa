/**
 * `/contact/`
 *
 * Explicit JSX rather than the ServicePage template: the page's middle is a
 * two-column details-and-form block, which is not a content module and is used
 * nowhere else.
 *
 * The form submits to `/api/contact`, which forwards to n8n. See ContactSection
 * for what it sends beyond the visible fields.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbList, buildContactPage } from "@/lib/schema";
import { CLINIC } from "@/content/clinic";
import { CONTACT_META, CONTACT_PAGE } from "@/content/contact";

import { ContactSection } from "@/components/sections/ContactSection";
import { ScrollRevealParagraph } from "@/components/sections/ScrollRevealParagraph";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { StatementBand } from "@/components/sections/StatementBand";

import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";

export const metadata: Metadata = {
  title: CONTACT_META.title,
  description: CONTACT_META.description,
  alternates: { canonical: CONTACT_META.path },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildContactPage({
          name: CONTACT_META.title,
          description: CONTACT_META.description,
          path: CONTACT_META.path,
        })}
      />
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: CONTACT_PAGE.hero.eyebrow, path: CONTACT_META.path },
        ])}
      />

      <ServiceHero
        eyebrow={CONTACT_PAGE.hero.eyebrow}
        heading={CONTACT_PAGE.hero.heading}
        crumbs={CONTACT_PAGE.crumbs}
        primary={CONTACT_PAGE.hero.primary}
        secondary={CONTACT_PAGE.hero.secondary}
      />

      <ScrollRevealParagraph
        text={CONTACT_PAGE.intro}
        cta={{ label: "Take the free quiz", href: "/quiz/" }}
      />

      <ContactSection
        detailsEyebrow={CONTACT_PAGE.details.eyebrow}
        detailsHeading={CONTACT_PAGE.details.heading}
        hours={CONTACT_PAGE.details.hours}
        formEyebrow={CONTACT_PAGE.form.eyebrow}
        formHeading={CONTACT_PAGE.form.heading}
        formNote={CONTACT_PAGE.form.note}
      />

      <StatementBand
        eyebrow={CONTACT_PAGE.emergency.eyebrow}
        heading={CONTACT_PAGE.emergency.heading}
        paragraphs={[CONTACT_PAGE.emergency.body]}
      />

      <FinalCtaSection
        heading={CONTACT_PAGE.closing.heading}
        body={CONTACT_PAGE.closing.body}
        actions={
          <div className="flex flex-row flex-wrap items-center justify-center gap-[16px]">
            <a className="hhcp-btn" href={CONTACT_PAGE.closing.primary.href}>
              {CONTACT_PAGE.closing.primary.label}
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
