import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { PractitionerCards } from "./PractitionerCards";
import { PRACTITIONERS } from "@/content/practitioners";

/**
 * AHPRA's advertising guidelines require that a practitioner named in
 * advertising has verifiable registration. The content document calls this the
 * single most important compliance fix on the site, so the rule is asserted
 * here rather than left to review.
 */
describe("practitioner cards", () => {
  const props = {
    eyebrow: "Meet the team",
    heading: "Meet the team",
    emptyMessage: "Profiles are published as clinicians join.",
  };

  it("never renders a practitioner without an AHPRA number", () => {
    const { container } = render(
      <PractitionerCards
        {...props}
        practitioners={[
          { name: "A Person", title: "Nurse Practitioner", ahpraNumber: "", bio: "Bio." },
          { name: "B Person", title: "General Practitioner", ahpraNumber: "   ", bio: "Bio." },
        ]}
      />,
    );

    expect(container.querySelectorAll(".hhcp-pc-card")).toHaveLength(0);
    expect(container.textContent).not.toContain("A Person");
    expect(container.textContent).not.toContain("B Person");
  });

  it("renders one with a number, and shows it", () => {
    const { container } = render(
      <PractitionerCards
        {...props}
        practitioners={[
          { name: "C Person", title: "General Practitioner", ahpraNumber: "MED0001234567", bio: "Bio." },
        ]}
      />,
    );

    expect(container.querySelectorAll(".hhcp-pc-card")).toHaveLength(1);
    expect(container.textContent).toContain("AHPRA MED0001234567");
  });

  it("ships with an empty roster, so no card can be live today", () => {
    // Ranjeeta confirmed no practitioners are cleared for listing, and her own
    // title and registration are unconfirmed. A card appearing here without
    // that being resolved is the failure this guards.
    expect(PRACTITIONERS).toHaveLength(0);
  });
});
