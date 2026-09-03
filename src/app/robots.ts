import type { MetadataRoute } from "next";
import { gatedRoutes } from "@/content/routes";
import { SITE_INDEXABLE } from "@/lib/indexable";
import { SITE_URL } from "@/lib/schema";

export default function robots(): MetadataRoute.Robots {
  /*
   * Crawling stays allowed on a non-indexable deployment, and that is
   * deliberate. `Disallow: /` stops a crawler fetching the page, which also
   * stops it seeing the `noindex` the page carries — and a URL that is blocked
   * but linked from somewhere can still be indexed on its address alone. Letting
   * the crawler in to read the `noindex` is what actually keeps it out of the
   * results, and off a staging host every page carries one.
   *
   * No sitemap is offered either way it is not indexable: a sitemap is an
   * invitation to index, and this one lists the production URLs, which are not
   * what is being served here.
   */
  if (!SITE_INDEXABLE) {
    return { rules: { userAgent: "*", allow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Gated pages are built but not published — see the route registry.
      disallow: gatedRoutes().map((route) => route.path),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
