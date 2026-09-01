import { describe, it, expect } from "vitest";
import {
  buildMedicalClinic,
  buildMedicalWebPage,
  buildService,
  buildFaqPage,
  buildBreadcrumbList,
  SITE_URL,
} from "./schema";

describe("buildMedicalClinic", () => {
  it("emits the clinic identity with ABN and phone", () => {
    const schema = buildMedicalClinic();
    expect(schema["@type"]).toBe("MedicalClinic");
    expect(schema.legalName).toBe("Horizon Health Care Partners Pty Ltd");
    expect(schema.telephone).toBe("1300 336 572");
    expect(schema.areaServed).toEqual({ "@type": "Country", name: "Australia" });
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
      path: "/weight-loss-peptides/",
    });
    expect(schema["@type"]).toBe("Service");
    expect(schema.provider["@type"]).toBe("MedicalClinic");
    expect(schema.areaServed).toEqual({ "@type": "Country", name: "Australia" });
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
