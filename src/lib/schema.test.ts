import { describe, it, expect } from "vitest";
import { CLINIC } from "@/content/clinic";
import {
  buildSiteGraph,
  buildMedicalWebPage,
  buildService,
  buildPractitionerList,
  buildBlog,
  buildPricedServices,
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

/*
 * The protected-title rule, enforced rather than reviewed.
 *
 * Describing a nurse practitioner as a Physician in structured data is the
 * machine-readable form of what s113 of the National Law prohibits in page
 * copy. It is also the single easiest thing to get wrong here, because the
 * eight records look alike and only the registration prefix separates them.
 */
describe("buildPractitionerList", () => {
  const list = buildPractitionerList(PRACTITIONERS, "/our-practitioners/");
  const nodes = list.itemListElement.map((entry) => entry.item);

  it("never calls a nurse practitioner a physician", () => {
    for (const node of nodes) {
      const ahpra = node.identifier.value;
      if (ahpra.startsWith("NMW")) {
        expect(node["@type"], node.name).toBe("Person");
      }
      if (ahpra.startsWith("MED")) {
        expect(node["@type"], node.name).toBe("IndividualPhysician");
      }
    }
  });

  it("publishes a verifiable registration number for every practitioner", () => {
    expect(nodes).toHaveLength(PRACTITIONERS.length);
    for (const node of nodes) {
      expect(node.identifier.propertyID).toBe("AHPRA");
      expect(node.identifier.value).toMatch(/^(MED|NMW)\d+$/);
    }
  });

  it("gives every node the @id the site graph references", () => {
    /* The join between the organisation and the people. A mismatch here does
       not error — it produces eight dangling references and eight orphan
       nodes, and nothing says so. */
    for (const practitioner of PRACTITIONERS) {
      const id = practitionerId(practitionerSlug(practitioner));
      expect(nodes.map((node) => node["@id"])).toContain(id);
    }
  });

  it("keeps jobTitle and worksFor off the physician type", () => {
    /* Not valid on IndividualPhysician; it takes occupationalCategory and
       memberOf instead. */
    for (const node of nodes) {
      if (node["@type"] !== "IndividualPhysician") continue;
      const physician = node as Record<string, unknown>;
      expect(physician).not.toHaveProperty("jobTitle");
      expect(physician).not.toHaveProperty("worksFor");
      expect(physician.memberOf).toEqual({ "@id": ORGANISATION_ID });
    }
  });
});

describe("buildBlog", () => {
  const blog = buildBlog(
    [
      { slug: "a-post", title: "A post" },
      { slug: "another-post", title: "Another post" },
    ],
    { name: "Knowledge Hub", description: "Guidance", path: "/articles/" },
  );

  it("lists each post by the @id its own page publishes", () => {
    expect(blog["@type"]).toBe("Blog");
    expect(blog.blogPost).toHaveLength(2);
    expect(blog.blogPost[0]["@id"]).toBe(
      `${SITE_URL}/article/a-post/#article`,
    );
    expect(blog.blogPost[0].url).toBe(`${SITE_URL}/article/a-post/`);
  });

  it("is published by the organisation in the graph", () => {
    expect(blog.publisher).toEqual({ "@id": ORGANISATION_ID });
    expect(blog.isPartOf).toEqual({ "@id": WEBSITE_ID });
  });
});

/*
 * The TGA line, enforced here as well as in page copy.
 *
 * Advertising a price against a prescription-only medicine is prohibited.
 * restricted-terms.test.ts already stops the words reaching the site; this
 * stops a price being attached to one in JSON-LD, which the term guard would
 * not catch on its own because an Offer can name a medicine without using a
 * restricted word — "the injection", "the treatment".
 */
describe("buildPricedServices", () => {
  const services = buildPricedServices(
    [
      { name: "General consult and referrals", description: "x", price: 59 },
      { name: "Medical certificates", description: "y", price: 24.9 },
    ],
    "/pricing/",
  );

  it("prices in AUD with the cents a patient is charged", () => {
    expect(services[0].offers.price).toBe("59.00");
    expect(services[1].offers.price).toBe("24.90");
    expect(services[0].offers.priceCurrency).toBe("AUD");
  });

  it("prices a consultation, never a product", () => {
    for (const service of services) {
      expect(service.offers.category).toBe("Consultation");
      expect(service["@type"]).toBe("Service");
      /* An Offer on a Product type is how a medicine price gets published. */
      expect(service["@type"]).not.toBe("Product");
      expect(service["@type"]).not.toBe("Drug");
    }
  });

  it("names the provider by reference", () => {
    expect(services[0].provider).toEqual({ "@id": ORGANISATION_ID });
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
