import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ModuleRenderer } from "./ModuleRenderer";
import type { ModuleSpec } from "./types";

describe("ModuleRenderer", () => {
  it("renders modules in the order given", () => {
    const modules: ModuleSpec[] = [
      { kind: "intro", text: "Lead paragraph." },
      { kind: "checklist", heading: "Who it may suit", items: ["Item one."] },
    ];
    const { container } = render(<ModuleRenderer modules={modules} />);
    const sections = container.querySelectorAll("section");
    expect(sections).toHaveLength(2);
    expect(sections[0].textContent).toContain("Lead paragraph.");
    expect(sections[1].textContent).toContain("Who it may suit");
  });

  it("dispatches each kind to its component", () => {
    const modules: ModuleSpec[] = [
      { kind: "steps", heading: "How it works", steps: [{ title: "Step one", body: "b" }] },
      { kind: "pricingCue", heading: "Cost", body: "b", priceKey: "firstConsult" },
    ];
    render(<ModuleRenderer modules={modules} />);
    expect(screen.getByRole("heading", { level: 3, name: "Step one" })).toBeInTheDocument();
    expect(screen.getByText("$59")).toBeInTheDocument();
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<ModuleRenderer modules={[]} />);
    expect(container.querySelectorAll("section")).toHaveLength(0);
  });
});
