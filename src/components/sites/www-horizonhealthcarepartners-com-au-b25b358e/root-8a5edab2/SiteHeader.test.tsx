import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("uses relative paths, never the live WordPress domain", () => {
    const { container } = render(<SiteHeader />);
    const external = Array.from(container.querySelectorAll("a[href]")).filter((a) =>
      a.getAttribute("href")?.includes("horizonhealthcarepartners.com.au"),
    );
    expect(external).toHaveLength(0);
  });

  it("renders the four service silos", () => {
    render(<SiteHeader />);
    const nav = screen.getAllByRole("navigation")[0];
    for (const label of [
      "Weight Loss & Peptides",
      "Men's Health",
      "Women's Health",
      "Online Doctor",
    ]) {
      expect(within(nav).getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("omits gated destinations", () => {
    const { container } = render(<SiteHeader />);
    const hrefs = Array.from(container.querySelectorAll("a[href]")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).not.toContain("/medicinal-cannabis/");
    expect(hrefs).not.toContain("/our-practitioners/");
  });

  it("points the primary CTA at the quiz", () => {
    render(<SiteHeader />);
    expect(
      screen.getAllByRole("link", { name: /Book a consultation/i })[0],
    ).toHaveAttribute("href", "/quiz/");
  });
});
