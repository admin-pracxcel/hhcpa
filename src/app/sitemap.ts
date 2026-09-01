import type { MetadataRoute } from "next";
import { publicRoutes } from "@/content/routes";
import { SITE_URL } from "@/lib/schema";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes().map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: "monthly" as const,
    priority: route.path === "/" ? 1 : 0.7,
  }));
}
