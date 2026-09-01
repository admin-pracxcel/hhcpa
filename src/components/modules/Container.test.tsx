import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./Container";

describe("Container", () => {
  it("renders its children", () => {
    render(<Container><p>inside</p></Container>);
    expect(screen.getByText("inside")).toBeInTheDocument();
  });

  it("applies the shared 1340px wrapper class", () => {
    const { container } = render(<Container>x</Container>);
    expect(container.firstChild).toHaveClass("hhcp-container");
  });

  it("merges an extra className", () => {
    const { container } = render(<Container className="extra">x</Container>);
    expect(container.firstChild).toHaveClass("extra");
  });
});
