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

  it("emits MedicalClinic JSON-LD", () => {
    const { container } = render(<SiteLayout><p>x</p></SiteLayout>);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script?.textContent).toContain('"MedicalClinic"');
  });
});
