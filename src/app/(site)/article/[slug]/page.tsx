/**
 * `/article/[slug]/`
 *
 * Statically generated from `ARTICLES`, so an unknown slug 404s rather than
 * rendering an empty shell.
 *
 * Built to the live single-post template rather than to this site's own page
 * furniture, at request. The reference is
 * `https://www.horizonhealthcarepartners.com.au/article/why-weight-loss-is-difficult-to-maintain-and-what-actually-works-long-term/`;
 * the measurements are in `docs/research/.../SINGLE_POST_SPEC.md`. Two swaps:
 *
 *   - `ServiceHero` -> `ArticleHeader`. The live template has no dark band and
 *     no breadcrumbs; the title sits centred on white under the header, over a
 *     byline and a 3:2 image. `BreadcrumbList` JSON-LD still ships below, so the
 *     trail survives where search engines read it even though the page no longer
 *     draws it.
 *   - `RelatedCards` -> `BlogSection`. The live "Related Posts" block is the
 *     same row — meta, title, image — that the homepage and `/articles/` use,
 *     down to its 32px 16px padding and 300px image. Reusing the component is
 *     what makes them identical rather than approximately alike.
 *
 * Article schema carries `datePublished`, which is a placeholder — see the note
 * in `articles.ts`. Publishing health content under a wrong date is worse than
 * publishing it under none, so confirm the real dates before this goes live.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { buildArticle, buildBreadcrumbList } from "@/lib/schema";
import { CLINIC } from "@/content/clinic";
import { ARTICLES, articleCards, findArticle } from "@/content/articles";
import { SITE_URL } from "@/lib/schema";

import { ArticleBody } from "@/components/sections/ArticleBody";
import { ArticleHeader } from "@/components/sections/ArticleHeader";

import { BlogSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/BlogSection";
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

  const path = `/article/${article.slug}/`;
  const others = articleCards().filter((card) => card.href !== path);

  return (
    <>
      <JsonLd
        data={buildArticle({
          headline: article.title,
          description: article.description,
          path,
          datePublished: article.date,
          image: article.image,
        })}
      />
      {/* The page no longer draws a trail; this is where it still exists. */}
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Knowledge hub", path: "/articles/" },
          { name: article.title, path },
        ])}
      />

      <ArticleHeader
        title={article.title}
        author={CLINIC.name + " Team"}
        date={article.date}
        image={article.image}
        imageAlt={article.imageAlt}
      />

      <ArticleBody
        blocks={article.blocks}
        moneyPage={article.moneyPage}
        shareUrl={`${SITE_URL}${path}`}
        shareTitle={article.title}
      />

      {others.length > 0 && (
        <BlogSection
          heading="Related Posts"
          posts={others}
          showEyebrow={false}
          showCta={false}
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
