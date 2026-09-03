import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { PriceCards } from "./PriceCards";
import { PriceTiles } from "./PriceTiles";
import { CONSULTATION_PLANS } from "@/content/consultation-plans";
import { PRICES } from "@/content/pricing";

/**
 * These two replaced the price tables, and the tables were doing two things
 * worth keeping. They paired a service with its fee in a way a screen reader
 * could follow, and every figure came from `pricing.ts` rather than from a
 * literal — nineteen service pages quote the same record.
 */
describe("price tiles", () => {
  const render10 = () =>
    render(
      <PriceTiles
        eyebrow="Other services"
        heading="Other services"
        rows={["generalConsult", "medicalCertificate", "healthProgram"]}
        labels={{ priorityConsult: "Priority consult (limited daily)" }}
        note="Any medicine dispensed by a pharmacy is a separate cost."
      />,
    );

  it("pairs each service with its fee as a term and its definition", () => {
    const { container } = render10();
    const tiles = container.querySelectorAll(".hhcp-ptl-tile");
    expect(tiles).toHaveLength(3);

    for (const tile of tiles) {
      /* One dt and one dd per tile: the pairing the table's columns carried. */
      expect(tile.querySelectorAll("dt")).toHaveLength(1);
      expect(tile.querySelectorAll("dd")).toHaveLength(1);
    }

    const first = tiles[0] as HTMLElement;
    expect(within(first).getByText(PRICES.generalConsult.label)).toBeTruthy();
  });

  it("keeps the word 'from' on the fee, since no column header carries it now", () => {
    render10();
    expect(screen.getByText("from $49")).toBeTruthy();
    /* Cents survive the formatting. */
    render(
      <PriceTiles
        eyebrow="x"
        heading="x"
        rows={["medicalCertificate"]}
      />,
    );
    expect(screen.getAllByText("from $19.90").length).toBeGreaterThan(0);
  });

  it("prefers a supplied label over the canonical one", () => {
    render(
      <PriceTiles
        eyebrow="x"
        heading="x"
        rows={["priorityConsult"]}
        labels={{ priorityConsult: "Priority consult (limited daily)" }}
      />,
    );
    expect(screen.getByText("Priority consult (limited daily)")).toBeTruthy();
    expect(screen.queryByText(PRICES.priorityConsult.label)).toBeNull();
  });
});

describe("price cards", () => {
  const renderCards = () =>
    render(
      <PriceCards
        eyebrow="Core consultation fees"
        heading="Consultation fees"
        feature={{
          key: "quiz",
          title: "Start with the free pre-screening quiz",
          body: "Two minutes, no diagnosis.",
          cta: { label: "Start the free quiz", href: "/quiz/" },
        }}
        plans={CONSULTATION_PLANS}
      />,
    );

  it("bands the free item above the three columns rather than beside them", () => {
    const { container } = renderCards();
    expect(container.querySelectorAll(".hhcp-pc-feature")).toHaveLength(1);
    /* Three cards, not four — the quiz is not a consultation. */
    expect(container.querySelectorAll(".hhcp-pr-card")).toHaveLength(3);
  });

  it("says Free in words rather than showing a zero", () => {
    renderCards();
    expect(screen.getByText("Free")).toBeTruthy();
    expect(screen.queryByText("$0")).toBeNull();
  });

  it("reads every amount back from the price record", () => {
    const { container } = renderCards();
    const cards = container.querySelectorAll(".hhcp-pr-card");

    /* Scoped per card: two of the three currently cost the same $59, so a
       document-wide text query cannot tell which card showed which. */
    CONSULTATION_PLANS.forEach((plan, index) => {
      const card = cards[index] as HTMLElement;
      expect(
        within(card).getByText(`$${PRICES[plan.key].amount}`),
        plan.key,
      ).toBeTruthy();
    });
  });
});
