import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("renders the NAP block with the legal entity and ABN", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/Horizon Health Care Partners Pty Ltd/)).toBeInTheDocument();
    expect(screen.getByText(/92 689 872 811/)).toBeInTheDocument();
  });

  it("renders the four link columns plus the newsletter", () => {
    render(<SiteFooter />);
    for (const title of ["Our Services", "Patients", "About & Trust", "Newsletter"]) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("renders the footer bar policy links", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy/",
    );
    expect(screen.getByRole("link", { name: /Conflict of Interest/ })).toHaveAttribute(
      "href",
      "/conflict-of-interest-disclosure/",
    );
  });

  it("omits gated destinations", () => {
    const { container } = render(<SiteFooter />);
    const hrefs = Array.from(container.querySelectorAll("a[href]")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).not.toContain("/medicinal-cannabis/");
    expect(hrefs).not.toContain("/our-practitioners/");
  });

  it("does not repeat the site-wide disclaimer, which the layout owns", () => {
    render(<SiteFooter />);
    expect(screen.queryByText(/call Lifeline on 13 11 14/)).toBeNull();
  });
});
