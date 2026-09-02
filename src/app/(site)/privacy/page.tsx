/**
 * `/privacy/`
 *
 * The document is the client's own, migrated from their live site. See
 * `content/legal.ts` for what was corrected in migration and the three
 * inconsistencies that need their decision.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbList, buildMedicalWebPage } from "@/lib/schema";
import { CLINIC } from "@/content/clinic";
import { PRIVACY_POLICY } from "@/content/legal";

import { LegalBody } from "@/components/sections/LegalBody";
import { ServiceHero } from "@/components/sections/ServiceHero";

import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";

export const metadata: Metadata = {
  title: PRIVACY_POLICY.meta.title,
  description: PRIVACY_POLICY.meta.description,
  alternates: { canonical: PRIVACY_POLICY.meta.path },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildMedicalWebPage({
          name: PRIVACY_POLICY.meta.title,
          description: PRIVACY_POLICY.meta.description,
          path: PRIVACY_POLICY.meta.path,
        })}
      />
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: PRIVACY_POLICY.heading, path: PRIVACY_POLICY.meta.path },
        ])}
      />

      <ServiceHero
        eyebrow={PRIVACY_POLICY.heading}
        heading={PRIVACY_POLICY.heading}
        crumbs={[{ label: "Home", href: "/" }]}
        primary={{ label: "Check your eligibility", href: "/quiz/" }}
        secondary={{ label: "Contact our team", href: "/contact/" }}
      />

      <LegalBody
        lastUpdated={PRIVACY_POLICY.lastUpdated}
        blocks={PRIVACY_POLICY.blocks}
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
