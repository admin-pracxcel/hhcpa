import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";

import { ApproachSection } from "./ApproachSection";
import { BlogSection } from "./BlogSection";
import { CareAreasSection } from "./CareAreasSection";
import { FaqSection } from "./FaqSection";
import { FeatureMarquee } from "./FeatureMarquee";
import { FinalCtaSection } from "./FinalCtaSection";
import { HeroSection } from "./HeroSection";
import { PricingSection } from "./PricingSection";
import { StepsSection } from "./StepsSection";
import { StorySection } from "./StorySection";
import { ARTICLES } from "@/content/articles";
import { ROUTES } from "@/content/routes";

/**
 * These sections were lifted from the WordPress build, so their defaults were
 * that build's absolute URLs. This site now *is* that domain, and every one of
 * those links walked the reader off it — the homepage's "Get Started Today"
 * button among them, because the page renders ApproachSection without passing a
 * CTA and so falls back to the default.
 *
 * Rendered rather than grepped. The defaults are what break, and the only way
 * to see a default is to render the component the way a page that passes
 * nothing would.
 */
const SECTIONS: readonly (readonly [string, ReactElement])[] = [
  ["ApproachSection", <ApproachSection key="a" />],
  ["BlogSection", <BlogSection key="b" />],
  ["CareAreasSection", <CareAreasSection key="c" />],
  ["FaqSection", <FaqSection key="d" />],
  ["FeatureMarquee", <FeatureMarquee key="e" />],
  ["FinalCtaSection", <FinalCtaSection key="f" />],
  ["HeroSection", <HeroSection key="g" />],
  ["PricingSection", <PricingSection key="h" />],
  ["StepsSection", <StepsSection key="i" />],
  ["StorySection", <StorySection key="j" />],
];

function hrefsOf(element: ReactElement): string[] {
  const { container } = render(element);
  return Array.from(container.querySelectorAll("a[href]")).map(
    (anchor) => anchor.getAttribute("href") ?? "",
  );
}

describe("cloned sections", () => {
  it("finds links to check", () => {
    /* Both assertions below iterate over hrefs. If rendering produced none they
       would pass without checking anything. */
    const total = SECTIONS.reduce(
      (count, [, element]) => count + hrefsOf(element).length,
      0,
    );
    expect(total).toBeGreaterThan(15);
  });

  it("never links out to the live WordPress domain", () => {
    for (const [name, element] of SECTIONS) {
      for (const href of hrefsOf(element)) {
        expect(href, `${name} → ${href}`).not.toContain(
          "horizonhealthcarepartners.com.au",
        );
      }
    }
  });

  it("links only at routes this site actually serves", () => {
    /* Article pages are generated per slug, so they are not in ROUTES. */
    const known = new Set<string>([
      ...ROUTES.map((route) => route.path),
      ...ARTICLES.map((article) => `/article/${article.slug}/`),
    ]);

    for (const [name, element] of SECTIONS) {
      for (const href of hrefsOf(element)) {
        /* Anchors, phone and mail links go nowhere this can check. */
        if (!href.startsWith("/")) continue;
        expect(known, `${name} → ${href}`).toContain(href);
      }
    }
  });
});
