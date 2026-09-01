import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Intro } from "./Intro";
import { TextImage } from "./TextImage";
import { Checklist } from "./Checklist";

const IMAGE = {
  src: "/img/example.jpg",
  alt: "A practitioner at a desk",
  width: 640,
  height: 480,
};

describe("Intro", () => {
  it("renders the lead paragraph", () => {
    render(<Intro text="Peptides for weight loss have become common." />);
    expect(
      screen.getByText("Peptides for weight loss have become common."),
    ).toBeInTheDocument();
  });
});

describe("TextImage", () => {
  it("renders an h2 heading and every body paragraph", () => {
    render(
      <TextImage
        heading="What peptides actually means"
        body={["First paragraph.", "Second paragraph."]}
        image={IMAGE}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "What peptides actually means" }),
    ).toBeInTheDocument();
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
  });

  it("renders the image with its alt text", () => {
    render(<TextImage heading="H" body={["b"]} image={IMAGE} />);
    expect(screen.getByAltText("A practitioner at a desk")).toBeInTheDocument();
  });

  it("puts the image first in DOM order when imageSide is left", () => {
    const { container } = render(
      <TextImage heading="H" body={["b"]} image={IMAGE} imageSide="left" />,
    );
    const grid = container.querySelector("[data-image-side]");
    expect(grid).toHaveAttribute("data-image-side", "left");
  });
});

describe("Checklist", () => {
  it("renders every item as a list entry", () => {
    render(
      <Checklist
        heading="Who it may suit"
        items={["You have tried diet and exercise.", "You want supervision."]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders optional intro and outro copy", () => {
    render(
      <Checklist
        heading="Who it may suit"
        intro="A consultation may be worth booking if:"
        items={["One."]}
        outro="It may not be right if you are pregnant."
      />,
    );
    expect(
      screen.getByText("A consultation may be worth booking if:"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("It may not be right if you are pregnant."),
    ).toBeInTheDocument();
  });
});
