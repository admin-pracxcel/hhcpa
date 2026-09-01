import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InlineCta } from "./InlineCta";
import { PricingCue } from "./PricingCue";
import { SafetyCallout } from "./SafetyCallout";
import { DisclosureCallout } from "./DisclosureCallout";

describe("InlineCta", () => {
  it("renders every link", () => {
    render(
      <InlineCta
        body="New here?"
        links={[
          { label: "How it works", href: "/how-it-works/" },
          { label: "Pricing", href: "/pricing/" },
        ]}
      />,
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});

describe("PricingCue", () => {
  it("renders the formatted price for its key", () => {
    render(
      <PricingCue
        heading="Straightforward pricing"
        body="The pre-screening quiz is free."
        priceKey="firstConsult"
      />,
    );
    expect(screen.getByText("$59")).toBeInTheDocument();
  });

  it("marks provisional prices so unconfirmed figures cannot ship silently", () => {
    const { container } = render(
      <PricingCue heading="H" body="b" priceKey="weightManagement" />,
    );
    expect(container.querySelector("[data-provisional='true']")).not.toBeNull();
  });

  it("links through to the full pricing page", () => {
    render(<PricingCue heading="H" body="b" priceKey="firstConsult" />);
    expect(screen.getByRole("link", { name: /full pricing/i })).toHaveAttribute(
      "href",
      "/pricing/",
    );
  });
});

describe("SafetyCallout", () => {
  it("renders every emergency contact as a dialable link", () => {
    render(
      <SafetyCallout
        heading="If this is an emergency"
        body="Telehealth is not for emergencies."
      />,
    );
    expect(screen.getByRole("link", { name: /000/ })).toHaveAttribute(
      "href",
      "tel:000",
    );
    expect(screen.getByRole("link", { name: /13 11 14/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /1300 22 4636/ })).toBeInTheDocument();
  });
});

describe("DisclosureCallout", () => {
  it("renders the link through to the disclosure page", () => {
    render(
      <DisclosureCallout
        heading="How we work with pharmacies"
        body="We disclose our arrangements."
        link={{ label: "Read the disclosure", href: "/conflict-of-interest-disclosure/" }}
      />,
    );
    expect(
      screen.getByRole("link", { name: "Read the disclosure" }),
    ).toHaveAttribute("href", "/conflict-of-interest-disclosure/");
  });
});
