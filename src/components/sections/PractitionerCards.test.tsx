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

  /*
   * The roster was empty until 2026-09-15 and this asserted that. It now
   * asserts the rule the emptiness was standing in for: every person listed
   * is verifiable, and nobody reaches the page without a number.
   */
  it("gives every listed practitioner a well-formed AHPRA number", () => {
    expect(PRACTITIONERS.length).toBeGreaterThan(0);
    for (const person of PRACTITIONERS) {
      /* MED for a medical practitioner, NMW for a nurse practitioner, then
         ten digits. A typo in an email is the likely failure here, and a
         number that does not resolve is worse than no number at all. */
      expect(person.ahpraNumber, person.name).toMatch(/^(MED|NMW)\d{10}$/);
      expect(person.name.trim(), "name").not.toBe("");
      expect(person.title.trim(), person.name).not.toBe("");
    }
  });

  it("registers nurse practitioners under NMW and doctors under MED", () => {
    /* The prefix is what the title is taken from, so they cannot disagree. */
    for (const person of PRACTITIONERS) {
      const expected = person.ahpraNumber.startsWith("NMW")
        ? "Nurse Practitioner"
        : "Medical Practitioner";
      expect(person.title, person.name).toBe(expected);
    }
  });

  it("claims no bio for anyone, since none was supplied", () => {
    /* A bio invented for a named clinician is a claim about a real person
       made by whoever typed it. If one appears, it came from them. */
    for (const person of PRACTITIONERS) {
      expect(person.bio, person.name).toBeUndefined();
    }
  });
});
