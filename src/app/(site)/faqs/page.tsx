/**
 * `/faqs/`
 *
 * Explicit JSX: the page is four accordions sharing one FAQPage, which the
 * ServicePage template's single `faq` slot cannot express.
 */

import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbList, buildFaqPage } from "@/lib/schema";
import { CLINIC } from "@/content/clinic";
import { FAQS_META, FAQS_PAGE } from "@/content/faqs";

import { RelatedCards } from "@/components/sections/RelatedCards";
import { ScrollRevealParagraph } from "@/components/sections/ScrollRevealParagraph";
import { ServiceHero } from "@/components/sections/ServiceHero";

import { FaqSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FaqSection";
import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";

export const metadata: Metadata = {
  title: FAQS_META.title,
  description: FAQS_META.description,
  alternates: { canonical: FAQS_META.path },
};

/* One FAQPage for the page, built from every group's questions. */
const ALL_QUESTIONS = FAQS_PAGE.groups.flatMap((group) =>
  group.items.map((item) => ({ q: item.question, a: item.answer })),
);

export default function Page() {
  return (
    <>
      <JsonLd data={buildFaqPage(ALL_QUESTIONS)} />
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: FAQS_PAGE.hero.eyebrow, path: FAQS_META.path },
        ])}
      />

      <ServiceHero
        eyebrow={FAQS_PAGE.hero.eyebrow}
        heading={FAQS_PAGE.hero.heading}
        crumbs={FAQS_PAGE.crumbs}
        primary={FAQS_PAGE.hero.primary}
        secondary={FAQS_PAGE.hero.secondary}
      />

      <ScrollRevealParagraph
        text={FAQS_PAGE.intro}
        cta={{ label: "Contact our team", href: "/contact/" }}
      />

      {FAQS_PAGE.groups.map((group, index) => (
        <FaqSection
          key={group.heading}
          className={index % 2 === 1 ? "bg-[color:var(--hhcp-accent)]" : undefined}
          heading={group.heading}
          items={group.items}
          emitSchema={false}
        />
      ))}

      <RelatedCards
        eyebrow="Where to next"
        heading="Explore your options"
        cards={[
          {
            title: "How it works",
            body: "The four steps from free quiz to ongoing review.",
            links: [{ label: "How it works", href: "/how-it-works/" }],
          },
          {
            title: "Pricing",
            body: "Every consultation fee, shown before you book.",
            links: [{ label: "See full pricing", href: "/pricing/" }],
          },
          {
            title: "Contact us",
            body: "Phone, email, or a message to our team.",
            links: [{ label: "Contact us", href: "/contact/" }],
          },
        ]}
        footnote="Still deciding? Read about"
        footnoteLinks={[
          { label: "patient safety", href: "/patient-safety/" },
          { label: "how it works", href: "/how-it-works/" },
        ]}
      />

      <FinalCtaSection
        heading={FAQS_PAGE.closing.heading}
        body={FAQS_PAGE.closing.body}
        actions={
          <div className="flex flex-row flex-wrap items-center justify-center gap-[16px]">
            <a className="hhcp-btn" href={FAQS_PAGE.closing.primary.href}>
              {FAQS_PAGE.closing.primary.label}
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
