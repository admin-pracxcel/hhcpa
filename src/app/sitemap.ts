import type { MetadataRoute } from "next";
import { publicRoutes } from "@/content/routes";
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

  return publicRoutes().map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: "monthly" as const,
    priority: route.path === "/" ? 1 : 0.7,
  }));
}
