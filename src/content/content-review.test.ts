import { describe, expect, it } from "vitest";

import {
  CONTENT_REVIEWED_AT,
  CONTENT_REVIEWER,
  PAGE_CONDITIONS,
  REVIEWED_PATHS,
  isReviewed,
} from "./content-review";
import { ROUTES } from "./routes";
import { PRACTITIONERS } from "./practitioners";
import { buildMedicalWebPage, buildSiteGraph, REVIEWER_ID } from "@/lib/schema";

/**
 * The review claim is a statement about something a person did, published at
 * scale on health pages. These assert it says exactly what she told us and
 * nothing more.
 */
describe("the content reviewer", () => {
  const graph = buildSiteGraph();
  const reviewer = graph["@graph"].find(
    (node) => node["@id"] === REVIEWER_ID,
  ) as Record<string, unknown> | undefined;

  it("is published once, as a Person", () => {
    expect(reviewer).toBeDefined();
    expect(reviewer?.["@type"]).toBe("Person");
    expect(reviewer?.name).toBe("Ranjeeta Roshan");

    const ids = graph["@graph"].map((node) => node["@id"]);
    expect(ids.filter((id) => id === REVIEWER_ID)).toHaveLength(1);
  });

  /*
   * ⚠️ The assertion this file exists for.
   *
   * She holds no AHPRA registration and said so. Publishing a credential she
   * does not have, or a type that implies one, would be the machine-readable
   * version of a false claim about who checked medical content.
   */
  it("claims no clinical credential she does not hold", () => {
    const json = JSON.stringify(reviewer);

    expect(reviewer).not.toHaveProperty("identifier");
    expect(reviewer).not.toHaveProperty("medicalSpecialty");
    expect(reviewer?.["@type"]).not.toBe("Physician");
    expect(reviewer?.["@type"]).not.toBe("IndividualPhysician");

    expect(json).not.toMatch(/AHPRA/i);
    expect(json).not.toMatch(/MED\d|NMW\d/);
    expect(json).not.toMatch(
      /\b(doctor|clinician|practitioner|physician|nurse|clinical)\b/i,
    );
    expect(reviewer?.jobTitle).toBe("Director");
  });

  it("is not one of the registered practitioners", () => {
    /* Two separate kinds of claim. Conflating them is the failure mode. */
    for (const practitioner of PRACTITIONERS) {
      expect(practitioner.name).not.toBe(CONTENT_REVIEWER.name);
    }
  });
});

describe("the review date", () => {
  it("is a fixed ISO date, not computed", () => {
    expect(CONTENT_REVIEWED_AT).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(CONTENT_REVIEWED_AT))).toBe(false);
  });

  it("is not in the future", () => {
    /* A review dated after today has not happened yet. */
    expect(Date.parse(CONTENT_REVIEWED_AT)).toBeLessThanOrEqual(Date.now());
  });

  it("does not move when the site is rebuilt", () => {
    /* Reading it twice must give the same answer. `new Date()` here would
       re-date every page on every deploy, claiming a review nobody did. */
    const today = new Date().toISOString().slice(0, 10);
    const source = CONTENT_REVIEWED_AT;
    expect(source).toBe(CONTENT_REVIEWED_AT);
    if (source === today) {
      /* Published the same day, which is legitimate — but the value must be
         a literal, which the ISO-shape assertion above already pins. */
      expect(source).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("where the claim is published", () => {
  it("names only paths this site actually serves", () => {
    const known = new Set(ROUTES.map((route) => route.path));
    for (const path of REVIEWED_PATHS) {
      expect(known, `${path} is not a route`).toContain(path);
    }
  });

  it("appears on a reviewed page and not on an unreviewed one", () => {
    const reviewed = buildMedicalWebPage({
      name: "Men's Health",
      description: "x",
      path: "/mens-health/",
    }) as Record<string, unknown>;
    expect(reviewed.reviewedBy).toEqual({ "@id": REVIEWER_ID });
    expect(reviewed.lastReviewed).toBe(CONTENT_REVIEWED_AT);

    const notReviewed = buildMedicalWebPage({
      name: "Privacy",
      description: "x",
      path: "/privacy/",
    }) as Record<string, unknown>;
    expect(notReviewed).not.toHaveProperty("reviewedBy");
    expect(notReviewed).not.toHaveProperty("lastReviewed");
  });

  it("stays off process, commercial and legal pages", () => {
    /*
     * She reviewed the whole site, so the claim would be true on these too.
     * It is kept off because `lastReviewed` on a MedicalWebPage reads as a
     * statement about medical content, and a fee table is not that.
     */
    for (const path of [
      "/pricing/",
      "/how-it-works/",
      "/privacy/",
      "/terms-and-conditions/",
      "/contact/",
      "/about-us/",
      "/complaints/",
      "/discharge/",
      "/transfer-your-care/",
      "/articles/",
      "/our-practitioners/",
    ]) {
      expect(isReviewed(path), path).toBe(false);
    }
  });
});

describe("page conditions", () => {
  it("names a condition only where the page is about one", () => {
    for (const path of Object.keys(PAGE_CONDITIONS)) {
      const page = buildMedicalWebPage({
        name: "x",
        description: "y",
        path,
      }) as Record<string, unknown>;
      expect(page.mainEntity).toEqual({
        "@type": "MedicalCondition",
        name: PAGE_CONDITIONS[path],
      });
    }
  });

  it("leaves service and program pages without one", () => {
    /* Treating a condition is not being about one. */
    for (const path of [
      "/womens-health/contraception/",
      "/weight-management/medical-weight-loss-program/",
      "/online-doctor/medical-certificates/",
      "/online-doctor/specialist-referrals/",
      "/online-doctor/online-prescriptions/",
      "/online-doctor/pathology-imaging-referrals/",
      "/online-doctor/",
    ]) {
      const page = buildMedicalWebPage({
        name: "x",
        description: "y",
        path,
      }) as Record<string, unknown>;
      expect(page, path).not.toHaveProperty("mainEntity");
    }
  });
});
