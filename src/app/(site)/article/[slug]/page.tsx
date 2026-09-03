/**
 * `/article/[slug]/`
 *
 * Statically generated from `ARTICLES`, so an unknown slug 404s rather than
 * rendering an empty shell.
 *
 * Article schema carries `datePublished`, which is a placeholder — see the note
 * in `articles.ts`. Publishing health content under a wrong date is worse than
 * publishing it under none, so confirm the real dates before this goes live.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { buildArticle, buildBreadcrumbList } from "@/lib/schema";
import { CALL_CTA, CLINIC } from "@/content/clinic";
import { ARTICLES, findArticle } from "@/content/articles";

import { ArticleBody } from "@/components/sections/ArticleBody";
import { RelatedCards } from "@/components/sections/RelatedCards";
import { ServiceHero } from "@/components/sections/ServiceHero";

import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  if (article === undefined) return {};
  return {
    title: `${article.title} | HHCPA`,
    description: article.description,
    alternates: { canonical: `/article/${article.slug}/` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (article === undefined) notFound();

  const others = ARTICLES.filter((other) => other.slug !== article.slug);

  return (
    <>
      <JsonLd
        data={buildArticle({
          headline: article.title,
          description: article.description,
          path: `/article/${article.slug}/`,
          datePublished: article.date,
          image: article.image,
        })}
      />
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Knowledge hub", path: "/articles/" },
          { name: article.title, path: `/article/${article.slug}/` },
        ])}
      />

      <ServiceHero
        eyebrow={article.topic}
        heading={article.title}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Knowledge hub", href: "/articles/" },
        ]}
        primary={{ label: "Check your eligibility", href: "/quiz/" }}
        secondary={CALL_CTA}
      />

      <ArticleBody blocks={article.blocks} moneyPage={article.moneyPage} />

      {others.length > 0 && (
        <RelatedCards
          className="bg-[color:var(--hhcp-accent)]"
          eyebrow="Keep reading"
          heading="More from the knowledge hub"
          cards={others.map((other) => ({
            title: other.title,
            body: `${other.topic} · ${other.readTime}`,
            links: [
              { label: "Read the article", href: `/article/${other.slug}/` },
            ],
          }))}
          footnote="Back to the full"
          footnoteLinks={[
            { label: "knowledge hub", href: "/articles/" },
            { label: "FAQs", href: "/faqs/" },
          ]}
        />
      )}

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
