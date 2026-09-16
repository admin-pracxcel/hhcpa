import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StickyMobileCta } from "./StickyMobileCta";
import { SiteDisclaimer } from "./SiteDisclaimer";
import { EMERGENCY_CONTACTS, SITE_DISCLAIMER } from "@/content/clinic";

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

describe("emergency numbers in the disclaimer", () => {
  /*
   * The disclaimer tells someone to call 000, Lifeline or Beyond Blue. On a
   * phone each has to be pressable, and each has to dial what it says.
   */
  it("links every emergency number to its own tel: href", () => {
    render(<SiteDisclaimer />);
    for (const contact of EMERGENCY_CONTACTS) {
      const link = screen.getByRole("link", { name: contact.number });
      expect(link.getAttribute("href")).toBe(contact.href);
    }
  });

  it("leaves the wording untouched", () => {
    /* The copy is compliance-reviewed. Linkifying must not edit a character. */
    const { container } = render(<SiteDisclaimer />);
    expect(container.textContent).toBe(SITE_DISCLAIMER);
  });
});
