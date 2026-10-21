import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrustBar } from "./TrustBar";
import { PageHero } from "./PageHero";
import { ClosingCta } from "./ClosingCta";
import { CLINIC } from "@/content/clinic";

describe("TrustBar", () => {
  it("renders the five default items when none are given", () => {
    render(<TrustBar />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("renders page-specific items when supplied", () => {
    render(<TrustBar items={["One", "Two"]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});

describe("PageHero", () => {
  it("renders the page h1", () => {
    render(<PageHero h1="Peptides for weight loss" intro="Guided by practitioners." />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Peptides for weight loss" }),
    ).toBeInTheDocument();
  });

  it("links the primary CTA to the quiz and offers tap-to-call", () => {
    render(<PageHero h1="H" intro="i" />);
    expect(screen.getByRole("link", { name: /Book a consultation/i })).toHaveAttribute(
      "href",
      "/quiz/",
    );
    expect(screen.getByRole("link", {
      /* A contains match, not a RegExp built from data: the number
         now starts with "+", which is a quantifier. */
      name: (accessibleName: string) => accessibleName.includes(CLINIC.phone),
    })).toHaveAttribute(
      "href",
      CLINIC.phoneHref,
    );
  });
});

describe("ClosingCta", () => {
  it("drives to the quiz and the phone number", () => {
    render(
      <ClosingCta
        heading="Ready to talk to a practitioner?"
        body="Start with the free pre-screening quiz."
      />,
    );
    expect(screen.getByRole("link", { name: /Start the free quiz/i })).toHaveAttribute(
      "href",
      "/quiz/",
    );
    expect(screen.getByRole("link", {
      /* A contains match, not a RegExp built from data: the number
         now starts with "+", which is a quantifier. */
      name: (accessibleName: string) => accessibleName.includes(CLINIC.phone),
    })).toBeInTheDocument();
  });
});
