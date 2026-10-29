import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SiteLayout from "./layout";

describe("SiteLayout", () => {
  it("renders its children inside the main landmark", () => {
    render(<SiteLayout><p>page content</p></SiteLayout>);
    expect(screen.getByRole("main")).toHaveTextContent("page content");
  });

  it("always renders the site-wide disclaimer", () => {
    render(<SiteLayout><p>x</p></SiteLayout>);
    expect(screen.getByText(/no treatment outcomes are guaranteed/)).toBeInTheDocument();
  });

  it("renders the sticky mobile CTA once", () => {
    const { container } = render(<SiteLayout><p>x</p></SiteLayout>);
    expect(container.querySelectorAll(".min-\\[768px\\]\\:hidden")).toHaveLength(1);
  });

  /*
   * This layout emitted the organisation's JSON-LD until 2026-10-29, as a
   * standalone MedicalClinic with no @id. It moved to the root layout as part
   * of the site-wide @graph, which also covers /quiz/ — that route sits
   * outside this group and carried no organisation markup at all.
   *
   * Asserting its absence here rather than deleting the test: re-adding it
   * would put a second, unconnected description of the same clinic on every
   * page, which is the fault the graph was built to remove, and nothing else
   * would notice.
   */
  it("does not repeat the organisation, which the root layout owns", () => {
    const { container } = render(<SiteLayout><p>x</p></SiteLayout>);
    for (const script of container.querySelectorAll(
      'script[type="application/ld+json"]',
    )) {
      expect(script.textContent).not.toContain('"MedicalClinic"');
      expect(script.textContent).not.toContain('"@graph"');
    }
  });
});
