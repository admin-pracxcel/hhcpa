/**
 * `/articles/` — the knowledge hub index.
 *
 * The content document supplies no copy for this page, so the hero and intro
 * wording here is written rather than approved, and is deliberately plain.
 * The articles themselves are the client's own, migrated from their live site.
 *
 * The launch cluster of twelve new titles lives in the Sitemap & SEO Blueprint
 * and is not built here; the index renders whatever `ARTICLES` holds, so adding
 * them is a content change, not a code change.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbList, buildMedicalWebPage } from "@/lib/schema";
import { CALL_CTA, CLINIC } from "@/content/clinic";
import { ARTICLES } from "@/content/articles";

import { RelatedCards } from "@/components/sections/RelatedCards";
import { ScrollRevealParagraph } from "@/components/sections/ScrollRevealParagraph";
import { ServiceHero } from "@/components/sections/ServiceHero";

import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";

const META = {
  title: "Knowledge Hub | Practical Health Guidance | HHCPA",
  description:
    "Practical articles from the Horizon Health Care Partners team on weight, sleep, hormones and chronic conditions. General information, not medical advice.",
  path: "/articles/",
};

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  alternates: { canonical: META.path },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildMedicalWebPage({
          name: META.title,
          description: META.description,
          path: META.path,
        })}
      />
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Knowledge hub", path: META.path },
        ])}
      />

      <ServiceHero
        eyebrow="Knowledge hub"
        heading="Guidance worth reading"
        crumbs={[{ label: "Home", href: "/" }]}
        primary={{ label: "Check your eligibility", href: "/quiz/" }}
        secondary={CALL_CTA}
      />

      <ScrollRevealParagraph
        text="Short, practical articles from our team on weight, sleep, hormones and chronic conditions. Everything here is general information rather than medical advice, and anything that applies to you personally is a conversation for a consultation."
        cta={{ label: "Check your eligibility", href: "/quiz/" }}
      />

      <RelatedCards
        className="bg-[color:var(--hhcp-accent)]"
        eyebrow="Articles"
        heading="Latest articles"
        cards={ARTICLES.map((article) => ({
          title: article.title,
          body: `${article.topic} · ${article.readTime}`,
          links: [
            { label: "Read the article", href: `/article/${article.slug}/` },
          ],
        }))}
        footnote="Looking for something specific? Try the"
        footnoteLinks={[
          { label: "FAQs", href: "/faqs/" },
          { label: "how it works", href: "/how-it-works/" },
        ]}
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
