import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FaqSection } from "./FaqSection";

const ITEMS = [
  { id: "referral", question: "Do I need a referral?", answer: "No referral is needed." },
  { id: "rebate", question: "Can I claim a rebate?", answer: "Some consults may attract one." },
];

describe("FaqSection", () => {
  it("renders the homepage set by default", () => {
    render(<FaqSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Your Questions Answered" }),
    ).toBeInTheDocument();
  });

  it("accepts a page-specific heading and item set", () => {
    render(<FaqSection heading="Common questions about peptides" items={ITEMS} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Common questions about peptides" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Do I need a referral?")).toBeInTheDocument();
  });

  it("generates FAQPage schema from the items it renders, so the two cannot drift", () => {
    const { container } = render(<FaqSection items={ITEMS} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent ?? "{}");
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0].name).toBe("Do I need a referral?");
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe("No referral is needed.");
  });

  it("links the CTA relatively, not at the live WordPress domain", () => {
    const { container } = render(<FaqSection />);
    const external = Array.from(container.querySelectorAll("a[href]")).filter((a) =>
      a.getAttribute("href")?.includes("horizonhealthcarepartners.com.au"),
    );
    expect(external).toHaveLength(0);
  });
});
