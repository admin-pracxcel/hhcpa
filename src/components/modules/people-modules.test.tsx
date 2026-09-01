import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PractitionerCards } from "./PractitionerCards";
import { ContactBlock } from "./ContactBlock";

const PRACTITIONER = {
  name: "Ranjeeta Roshan",
  title: "Founder",
  ahpraNumber: "NMW0001234567",
  focusAreas: ["Weight management", "General telehealth"],
  photo: null,
};

describe("PractitionerCards", () => {
  it("renders the AHPRA registration number", () => {
    render(<PractitionerCards heading="Our practitioners" practitioners={[PRACTITIONER]} />);
    expect(screen.getByText(/NMW0001234567/)).toBeInTheDocument();
  });

  it("marks a missing AHPRA number as a defect rather than hiding it", () => {
    const { container } = render(
      <PractitionerCards
        heading="Our practitioners"
        practitioners={[{ ...PRACTITIONER, ahpraNumber: "" }]}
      />,
    );
    expect(container.querySelector("[data-ahpra-missing='true']")).not.toBeNull();
  });

  it("renders each focus area", () => {
    render(<PractitionerCards heading="Our practitioners" practitioners={[PRACTITIONER]} />);
    expect(screen.getByText("Weight management")).toBeInTheDocument();
  });
});

describe("ContactBlock", () => {
  it("renders a tap-to-call link and a mailto link", () => {
    render(<ContactBlock heading="Get in touch" />);
    expect(screen.getByRole("link", { name: /1300 336 572/ })).toHaveAttribute(
      "href",
      "tel:1300336572",
    );
    expect(
      screen.getByRole("link", { name: /hello@horizonhealthcarepartners\.com\.au/ }),
    ).toHaveAttribute("href", "mailto:hello@horizonhealthcarepartners.com.au");
  });

  it("renders the enquiry form fields", () => {
    render(<ContactBlock heading="Get in touch" />);
    expect(screen.getByLabelText("First name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });
});
