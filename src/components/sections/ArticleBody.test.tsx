import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { ArticleBody } from "./ArticleBody";
import type { ArticleBlock } from "@/content/articles";

const BLOCKS: readonly ArticleBlock[] = [
  { kind: "p", text: "Opening paragraph." },
  {
    kind: "p",
    text: "A paragraph citing AIHW and linking to weight management.",
    links: [
      { text: "AIHW", href: "https://www.aihw.gov.au/reports/" },
      { text: "weight management", href: "/weight-management/" },
    ],
  },
  { kind: "h2", text: "A heading" },
  { kind: "ol", items: ["First step", "Second step"] },
  { kind: "callout", title: "Quick answer:", text: "A summary." },
  { kind: "image", src: "/images/x.webp", alt: "Alt text" },
  { kind: "table", head: ["A", "B"], rows: [["one", "two"]] },
  {
    kind: "faq",
    items: [{ q: "A question?", a: "An answer." }],
  },
];

function body() {
  return render(
    <ArticleBody
      blocks={BLOCKS}
      shareUrl="https://horizonhealthcarepartners.com.au/article/x/"
      shareTitle="X"
    />,
  );
}

describe("ArticleBody", () => {
  /*
   * ⚠️ The regression this file was written for.
   *
   * The accordion CSS was exported from FaqAccordion.tsx, which is
   * `"use client"`. Next replaces every export of a client module with a
   * client reference when a server component imports one, so the string
   * became a stub and
   * "Attempted to call FAQ_ACCORDION_STYLES() from the server" was
   * interpolated into the stylesheet.
   *
   * Nothing failed. The build passed, 370 tests passed, and the article
   * shipped with every FAQ panel open and no layout at all. A styles
   * constant that silently becomes an error message is invisible to every
   * check except looking at the page.
   */
  it("renders real CSS, not a client-reference stub", () => {
    const { container } = body();
    const css = container.querySelector("style")?.textContent ?? "";

    expect(css).toContain(".hhcp-fq-panel {");
    expect(css).toContain(".hhcp-fq-question {");
    expect(css).not.toContain("FAQ_ACCORDION_STYLES");
    expect(css).not.toContain("Attempted to call");
  });

  it("renders every block kind", () => {
    const { container } = body();
    expect(container.querySelector("ol")).not.toBeNull();
    expect(container.querySelector("table")).not.toBeNull();
    expect(container.querySelector("figure img")).not.toBeNull();
    expect(container.querySelector(".hhcp-ab-callout")).not.toBeNull();
    expect(container.querySelectorAll(".hhcp-fq-question")).toHaveLength(1);
  });

  it("opens external links in a new tab and leaves internal ones alone", () => {
    const { container } = body();
    const external = container.querySelector<HTMLAnchorElement>(
      'a[href^="https://www.aihw"]',
    );
    expect(external?.target).toBe("_blank");
    expect(external?.rel).toBe("noopener noreferrer");

    const internal = container.querySelector<HTMLAnchorElement>(
      'a[href="/weight-management/"]',
    );
    expect(internal?.target).toBe("");
    /* No nofollow on our own pages, and none on cited authorities either. */
    expect(internal?.rel).toBe("");
  });

  it("ships FAQ rows closed", () => {
    const { container } = body();
    for (const button of container.querySelectorAll(".hhcp-fq-question")) {
      expect(button.getAttribute("aria-expanded")).toBe("false");
    }
  });
});
