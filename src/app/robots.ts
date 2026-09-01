import type { MetadataRoute } from "next";
import { gatedRoutes } from "@/content/routes";
import { SITE_URL } from "@/lib/schema";

export default function robots(): MetadataRoute.Robots {
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
