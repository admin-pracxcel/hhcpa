import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { BookingPanel } from "./BookingPanel";
import { CLINIC } from "@/content/clinic";

/**
 * What a finished quiz sees. The branching lives in lib/checkout-products.ts
 * and is tested there; this is the page deciding whether to use it at all —
 * green against amber, a handoff against none — and rendering the result.
 */
describe("BookingPanel", () => {
  const write = (value: Record<string, unknown>) =>
    window.sessionStorage.setItem(
      "hhcpa:booking",
      JSON.stringify({ at: Date.now(), ...value }),
    );

  beforeEach(() => window.sessionStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  const links = () =>
    screen
      .queryAllByRole("link")
      .map((a) => a.getAttribute("href") ?? "")
      .filter((href) => href.includes("portal.horizonhealthcarepartners"));

  const phoneShown = () =>
    screen.queryByText(/match you with the right practitioner/i) !== null;

  it("offers the phone when there is no handoff at all", () => {
    render(<BookingPanel />);
    expect(links()).toHaveLength(0);
    expect(phoneShown()).toBe(true);
    expect(screen.getByText(CLINIC.phone)).toBeTruthy();
  });

  it("offers the phone when the record is unreadable", () => {
    window.sessionStorage.setItem("hhcpa:booking", "{not json");
    render(<BookingPanel />);
    expect(links()).toHaveLength(0);
    expect(phoneShown()).toBe(true);
  });

  it("offers checkout on green", () => {
    write({ service: "Weight Management", level: "green" });
    render(<BookingPanel />);
    expect(links()).toHaveLength(4);
    expect(phoneShown()).toBe(false);
    expect(screen.getByText("$99")).toBeTruthy();
    expect(screen.getByText("$119")).toBeTruthy();
  });

  it("offers the phone on amber, whatever the service", () => {
    /*
     * Amber means the patient flagged conditions or current medications. A
     * practitioner decides what they book, not a checkout.
     */
    write({ service: "Weight Management", level: "amber" });
    render(<BookingPanel />);
    expect(links()).toHaveLength(0);
    expect(phoneShown()).toBe(true);
  });

  it("offers the phone for a service with no connected calendar", () => {
    write({ service: "Men's Health", level: "green" });
    render(<BookingPanel />);
    expect(links()).toHaveLength(0);
    expect(phoneShown()).toBe(true);
  });

  it("sends a simple repeat script to the $29 product", () => {
    write({
      service: "Online Doctor",
      level: "green",
      onlineDoctorKind: "A prescription or repeat script",
      prescriptionFee: 29,
    });
    render(<BookingPanel />);
    expect(links()).toEqual([
      "https://portal.horizonhealthcarepartners.com.au/book/consult?ref=prescriptions-referrals-repeat-prescription-simple",
    ]);
    expect(screen.getByText("$29")).toBeTruthy();
  });

  it("renders the cents on the single-day certificate", () => {
    write({
      service: "Online Doctor",
      level: "green",
      onlineDoctorKind: "A medical certificate",
    });
    render(<BookingPanel />);
    expect(screen.getByText("$24.90")).toBeTruthy();
    expect(screen.getByText("$49")).toBeTruthy();
  });

  it("says payment comes before the appointment time", () => {
    /* Her portal reverses the usual order. Someone who thinks they are
       picking a time and is asked for a card has been surprised. */
    write({ service: "Weight Management", level: "green" });
    render(<BookingPanel />);
    expect(screen.getByText(/Payment is taken first/i)).toBeTruthy();
  });

  it("keeps the checkout in the same tab", () => {
    write({ service: "Weight Management", level: "green" });
    const { container } = render(<BookingPanel />);
    for (const a of container.querySelectorAll<HTMLAnchorElement>(
      ".hhcp-bk-product",
    )) {
      expect(a.getAttribute("target")).toBeNull();
      expect(a.getAttribute("rel")).toBe("noopener");
    }
  });

  it("gives every product its note, under the label", () => {
    /*
     * Four tiers of the same consultation with nothing but a price is how a
     * patient picks the cheapest one and turns up to the wrong appointment.
     */
    write({ service: "Weight Management", level: "green" });
    const { container } = render(<BookingPanel />);
    const rows = container.querySelectorAll(".hhcp-bk-product");
    expect(rows).toHaveLength(4);
    for (const row of rows) {
      const note = row.querySelector(".hhcp-bk-product-note");
      expect(note?.textContent ?? "", row.textContent ?? "").not.toBe("");
    }
    expect(
      screen.getByText("To go through pathology results with your practitioner"),
    ).toBeTruthy();
  });

  it("offers the phone to a patient who cannot choose between them", () => {
    /* The phone block covers having no products; this covers having too many. */
    write({ service: "Weight Management", level: "green" });
    const { container } = render(<BookingPanel />);
    const unsure = container.querySelector(".hhcp-bk-unsure");
    expect(unsure?.textContent).toBe(
      `Not sure which one? Call ${CLINIC.phone} and we will help you choose.`,
    );
    expect(unsure?.querySelector("a")?.getAttribute("href")).toBe(
      CLINIC.phoneHref,
    );
  });

  it("does not repeat that line when the phone block is already showing", () => {
    render(<BookingPanel />);
    expect(document.querySelector(".hhcp-bk-unsure")).toBeNull();
  });

  it("fires one dataLayer event, carrying no clinical detail", () => {
    const layer: unknown[] = [];
    vi.stubGlobal("dataLayer", layer);
    (window as unknown as { dataLayer: unknown[] }).dataLayer = layer;

    write({ service: "Weight Management", level: "green" });
    const { container } = render(<BookingPanel />);
    const first = container.querySelector<HTMLAnchorElement>(
      ".hhcp-bk-product",
    );
    first?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(layer).toHaveLength(1);
    const event = layer[0] as Record<string, unknown>;
    expect(event.event).toBe("checkout_start");
    expect(event.service).toBe("Weight Management");
    expect(event.ref).toBe("weight-metabolic-health-initial");
    expect(event.price).toBe(99);
    /* The triage level is the thing that must never reach a tag manager. */
    expect(JSON.stringify(event)).not.toMatch(/green|amber|red/i);
  });
});
