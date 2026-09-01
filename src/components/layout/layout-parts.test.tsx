import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StickyMobileCta } from "./StickyMobileCta";
import { SiteDisclaimer } from "./SiteDisclaimer";

describe("StickyMobileCta", () => {
  it("offers book and tap-to-call actions", () => {
    render(<StickyMobileCta />);
    expect(screen.getByRole("link", { name: /Book/i })).toHaveAttribute("href", "/quiz/");
    expect(screen.getByRole("link", { name: /Call/i })).toHaveAttribute(
      "href",
      "tel:1300336572",
    );
  });

  it("is hidden above the 767px breakpoint", () => {
    const { container } = render(<StickyMobileCta />);
    expect(container.firstChild).toHaveClass("min-[768px]:hidden");
  });
});

describe("SiteDisclaimer", () => {
  it("renders the mandated disclaimer text", () => {
    render(<SiteDisclaimer />);
    expect(screen.getByText(/no treatment outcomes are guaranteed/)).toBeInTheDocument();
  });
});
