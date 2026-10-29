import type { MetadataRoute } from "next";
import { publicRoutes } from "@/content/routes";
import { ARTICLES } from "@/content/articles";
import { SITE_INDEXABLE } from "@/lib/indexable";
import { SITE_URL } from "@/lib/schema";

export default function sitemap(): MetadataRoute.Sitemap {
  /*
   * Empty on a non-indexable deployment. The entries below are production URLs,
   * so a staging host serving them would be pointing crawlers at a site it is
   * not — and offering a sitemap at all contradicts the noindex every page
   * carries there.
   */
  if (!SITE_INDEXABLE) return [];

  const pages = publicRoutes().map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: "monthly" as const,
    priority: route.path === "/" ? 1 : 0.7,
  }));

  /*
   * Articles are not in `ROUTES` — they are one dynamic segment, so the only
   * list of them is ARTICLES itself. Derived from that array rather than
   * written out, because the blog programme adds 48 of these and a sitemap
   * maintained by hand falls behind within a month of it starting.
   *
   * `/article/<slug>/` is singular. The programme originally specified the
   * plural and every slug 404'd; the decision recorded in the technical
   * audit was to keep the singular route and rewrite the programme.
   */
  const articles = ARTICLES.map((article) => ({
    url: `${SITE_URL}/article/${article.slug}/`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...pages, ...articles];
}
