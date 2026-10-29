import { describe, it, expect } from "vitest";
import { CLINIC } from "@/content/clinic";
import {
  buildSiteGraph,
  buildMedicalWebPage,
  buildService,
  buildFaqPage,
  buildBreadcrumbList,
  practitionerId,
  ORGANISATION_ID,
  WEBSITE_ID,
  SITE_URL,
} from "./schema";
import { PRACTITIONERS, practitionerSlug } from "@/content/practitioners";
import { GOOGLE_BUSINESS_PROFILE, SOCIAL_PROFILES } from "@/content/clinic";

describe("buildSiteGraph", () => {
  const graph = buildSiteGraph();
  const org = graph["@graph"][0];

  it("emits the clinic identity with ABN and phone", () => {
    expect(org["@type"]).toContain("MedicalClinic");
    expect(org.legalName).toBe("Horizon Health Care Partners Pty Ltd");
    expect(org.telephone).toBe(CLINIC.phone);
    expect(org.identifier[0].value).toBe(CLINIC.abn);
  });

  /*
   * The point of the whole graph. Without @id a search engine sees one
   * organisation described once per page and no statement that the
   * descriptions are the same thing.
   */
  it("gives every node a stable @id", () => {
    expect(org["@id"]).toBe(ORGANISATION_ID);
    expect(graph["@graph"][1]["@id"]).toBe(WEBSITE_ID);
    expect(graph["@graph"][1].publisher).toEqual({ "@id": ORGANISATION_ID });
  });

  it("reads the phone and hours from CLINIC rather than repeating them", () => {
    /* The number moved twice in October. Pinning digits here is what made
       that a seven-file change the first time. */
    expect(org.telephone).toBe(CLINIC.phone);
    expect(org.contactPoint[0].telephone).toBe(CLINIC.phone);
    expect(org.openingHoursSpecification[0].opens).toBe(CLINIC.opensAt);
    expect(org.openingHoursSpecification[0].closes).toBe(CLINIC.closesAt);
  });

  /*
   * sameAs is the statement that this site, that Business Profile and those
   * social accounts are one entity. It is the actual remedy for being
   * confused with a similarly named clinic.
   */
  it("claims every profile this clinic owns, with no placeholders", () => {
    expect(org.sameAs).toContain(GOOGLE_BUSINESS_PROFILE);
    for (const profile of SOCIAL_PROFILES) {
      expect(org.sameAs).toContain(profile.href);
    }
    for (const url of org.sameAs) {
      expect(url).toMatch(/^https:\/\//);
      expect(url).not.toMatch(/REPLACE|TODO|example\.com/i);
    }
  });

  it("links every practitioner by @id", () => {
    expect(org.employee).toHaveLength(PRACTITIONERS.length);
    for (const practitioner of PRACTITIONERS) {
      expect(org.employee).toContainEqual({
        "@id": practitionerId(practitionerSlug(practitioner)),
      });
    }
  });
});

describe("buildMedicalWebPage", () => {
  it("builds an absolute canonical url from a route path", () => {
    const schema = buildMedicalWebPage({
      name: "Pricing",
      description: "Fees",
      path: "/pricing/",
    });
    expect(schema["@type"]).toBe("MedicalWebPage");
    expect(schema.url).toBe(`${SITE_URL}/pricing/`);
  });
});

describe("buildService", () => {
  it("names the provider and the service type", () => {
    const schema = buildService({
      name: "Medical weight loss",
      description: "Practitioner-led weight management",
      path: "/weight-management/",
    });
    expect(schema["@type"]).toBe("Service");
    /* A reference, not a copy. Repeating the organisation inline is what
       produced unconnected duplicates of it across the site. */
    expect(schema.provider).toEqual({ "@id": ORGANISATION_ID });
    expect(schema.areaServed).toEqual({ "@type": "Country", name: "Australia" });
  });
});

/*
 * Every page-level builder must point at the graph rather than restate it.
 * This is the regression that matters: an inline organisation block added to
 * one builder later would reintroduce exactly the duplication the graph
 * removed, and nothing else would fail.
 */
describe("page builders reference the graph", () => {
  const page = buildMedicalWebPage({
    name: "Pricing",
    description: "Fees",
    path: "/pricing/",
  });

  it("uses @id references instead of inline organisation copies", () => {
    expect(page.isPartOf).toEqual({ "@id": WEBSITE_ID });
    const json = JSON.stringify(page);
    expect(json).not.toContain('"@type":"MedicalClinic"');
    expect(json).not.toContain('"@type":"Organization"');
  });
});

describe("buildFaqPage", () => {
  it("maps each question to an accepted answer", () => {
    const schema = buildFaqPage([
      { q: "Do I need a referral?", a: "No referral is needed." },
    ]);
    expect(schema).not.toBeNull();
    expect(schema!["@type"]).toBe("FAQPage");
    expect(schema!.mainEntity).toHaveLength(1);
    expect(schema!.mainEntity[0].name).toBe("Do I need a referral?");
    expect(schema!.mainEntity[0].acceptedAnswer.text).toBe("No referral is needed.");
  });

  it("returns null for an empty list so pages without FAQs emit no markup", () => {
    expect(buildFaqPage([])).toBeNull();
  });
});

describe("buildBreadcrumbList", () => {
  it("numbers positions from 1 and absolutises each path", () => {
    const schema = buildBreadcrumbList([
      { name: "Home", path: "/" },
      { name: "Men's Health", path: "/mens-health/" },
    ]);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].item).toBe(`${SITE_URL}/mens-health/`);
  });
});
