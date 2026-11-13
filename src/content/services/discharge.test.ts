import { describe, expect, it } from "vitest";

import { DISCHARGE_META, DISCHARGE_PAGE } from "./discharge";

/*
 * The clinic identification notice, and the page title that led people here.
 *
 * Ranjeeta's wording, approved 2026-11-13. It names another business and
 * states that two healthcare providers are unaffiliated, so it is pinned
 * character for character — a tidy-up here would edit a legal claim.
 */
describe("the clinic identification notice", () => {
  it("is her wording, exactly", () => {
    expect(DISCHARGE_PAGE.notice).toBe(
      "Important: Horizon Health Care Partners Australia (HHCPA) is an independent telehealth provider and is not affiliated with Horizon Health Clinic. If you are trying to contact Horizon Health Clinic regarding your existing appointments, prescriptions or discharge arrangements, please contact that clinic directly.",
    );
  });

  it("names both businesses and denies the affiliation", () => {
    /* The three things that make it do its job. */
    expect(DISCHARGE_PAGE.notice).toContain(
      "Horizon Health Care Partners Australia (HHCPA)",
    );
    expect(DISCHARGE_PAGE.notice).toContain("Horizon Health Clinic");
    expect(DISCHARGE_PAGE.notice).toContain("is not affiliated with");
  });
});

describe("the discharge page title", () => {
  /*
   * It read "Discharge Letter | Switch to Horizon Health Care Partners"
   * until 2026-11-13. That is the line Google shows, and leading with
   * "Discharge Letter" is what brought the other clinic's patients here.
   */
  it("leads with the practice name, not with Discharge Letter", () => {
    expect(DISCHARGE_META.title.startsWith("Horizon Health Care Partners")).toBe(
      true,
    );
    expect(DISCHARGE_META.title.startsWith("Discharge Letter")).toBe(false);
  });

  it("carries Australia, which is what separates the two clinics", () => {
    expect(DISCHARGE_META.title).toContain("Australia");
  });

  it("does not take the transfer page's heading", () => {
    /* Two of her own pages competing for one query helps nobody. */
    expect(DISCHARGE_META.title).not.toContain("Transfer Your Care");
  });

  it("stays inside what a search result shows", () => {
    expect(DISCHARGE_META.title.length).toBeLessThanOrEqual(60);
  });
});
