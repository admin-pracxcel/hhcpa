/**
 * `/terms-and-conditions/`
 *
 * The document is the client's own, migrated from their live site. See
 * `content/legal.ts` for what was corrected in migration and the three
 * inconsistencies that need their decision.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbList, buildMedicalWebPage } from "@/lib/schema";
import { CLINIC } from "@/content/clinic";
import { TERMS_AND_CONDITIONS } from "@/content/legal";

import { LegalBody } from "@/components/sections/LegalBody";
import { ServiceHero } from "@/components/sections/ServiceHero";

import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";

export const metadata: Metadata = {
  title: TERMS_AND_CONDITIONS.meta.title,
  description: TERMS_AND_CONDITIONS.meta.description,
  alternates: { canonical: TERMS_AND_CONDITIONS.meta.path },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildMedicalWebPage({
          name: TERMS_AND_CONDITIONS.meta.title,
          description: TERMS_AND_CONDITIONS.meta.description,
          path: TERMS_AND_CONDITIONS.meta.path,
        })}
      />
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: TERMS_AND_CONDITIONS.heading, path: TERMS_AND_CONDITIONS.meta.path },
        ])}
      />

      <ServiceHero
        eyebrow={TERMS_AND_CONDITIONS.heading}
        heading={TERMS_AND_CONDITIONS.heading}
        crumbs={[{ label: "Home", href: "/" }]}
        primary={{ label: "Check your eligibility", href: "/quiz/" }}
        secondary={{ label: "Contact our team", href: "/contact/" }}
      />

      <LegalBody
        lastUpdated={TERMS_AND_CONDITIONS.lastUpdated}
        blocks={TERMS_AND_CONDITIONS.blocks}
      />

      <FinalCtaSection
        heading="Your health, handled from home"
        body="Start with the free pre-screening quiz. It takes about two minutes, it is not a diagnosis, and there is no commitment until you choose to book."
        actions={
          <div className="flex flex-row flex-wrap items-center justify-center gap-[16px]">
            <a className="hhcp-btn" href="/quiz/">
              Start the free quiz
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
