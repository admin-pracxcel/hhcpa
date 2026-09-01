import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Steps } from "./Steps";
import { FeatureTiles } from "./FeatureTiles";
import { RelatedServices } from "./RelatedServices";

describe("Steps", () => {
  const STEPS = [
    { title: "Free pre-screening quiz", body: "A few short questions." },
    { title: "Book your consultation", body: "Choose a time that suits you." },
  ];

  it("numbers each step from 1", () => {
    render(<Steps heading="How it works" steps={STEPS} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders each step title as an h3", () => {
    render(<Steps heading="How it works" steps={STEPS} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Book your consultation" }),
    ).toBeInTheDocument();
  });
});

describe("FeatureTiles", () => {
  it("renders one tile per entry", () => {
    render(
      <FeatureTiles
        heading="Why patients choose Horizon"
        tiles={[
          { title: "Practitioner-led", body: "Real consultations." },
          { title: "Transparent", body: "Fees shown upfront." },
          { title: "Private", body: "Judgement-free care." },
        ]}
      />,
    );
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });
});

describe("RelatedServices", () => {
  it("renders each link with its href", () => {
    render(
      <RelatedServices
        heading="Explore your options"
        links={[
          { label: "Weight loss injections", href: "/weight-loss-peptides/weight-loss-injections/", body: "How injectables are assessed." },
        ]}
      />,
    );
    const link = screen.getByRole("link", { name: /Weight loss injections/ });
    expect(link).toHaveAttribute(
      "href",
      "/weight-loss-peptides/weight-loss-injections/",
    );
  });

  it("renders the optional supporting line", () => {
    render(
      <RelatedServices
        heading="Explore"
        links={[{ label: "Pricing", href: "/pricing/", body: "See full pricing." }]}
      />,
    );
    expect(screen.getByText("See full pricing.")).toBeInTheDocument();
  });
});
