/**
 * JSON-LD builders.
 *
 * Every page's schema is derived from the same data that renders its copy, so
 * markup and visible content cannot drift apart. Schema types per page come from
 * the build blocks in HHCPA_Website_Content_UPDATED.md.
 */
import { CLINIC } from "@/content/clinic";

export const SITE_URL = "https://www.horizonhealthcarepartners.com.au";

const AREA_SERVED = { "@type": "Country", name: "Australia" } as const;

function absolute(path: string): string {
  return `${SITE_URL}${path}`;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Crumb {
  name: string;
  path: string;
}

export function buildMedicalClinic() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: CLINIC.name,
    legalName: CLINIC.legalName,
    url: SITE_URL,
    telephone: CLINIC.phone,
    email: CLINIC.email,
    areaServed: AREA_SERVED,
    availableService: { "@type": "MedicalTherapy", name: "Telehealth consultation" },
  } as const;
}

export function buildMedicalWebPage(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: input.name,
    description: input.description,
    url: absolute(input.path),
    isPartOf: { "@type": "WebSite", name: CLINIC.name, url: SITE_URL },
  } as const;
}

/**
 * The About page's BUILD BLOCK asks for AboutPage rather than MedicalWebPage.
 * It also asks for MedicalOrganization; the layout already emits MedicalClinic
 * on every page, which is a subtype of it, so this does not repeat the
 * organisation on one page.
 */
export function buildAboutPage(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: input.name,
    description: input.description,
    url: absolute(input.path),
    isPartOf: { "@type": "WebSite", name: CLINIC.name, url: SITE_URL },
    about: { "@type": "MedicalClinic", name: CLINIC.name, url: SITE_URL },
  } as const;
}

/** The Contact page's BUILD BLOCK asks for ContactPage. */
export function buildContactPage(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: input.name,
    description: input.description,
    url: absolute(input.path),
    isPartOf: { "@type": "WebSite", name: CLINIC.name, url: SITE_URL },
  } as const;
}

/** Knowledge hub articles. */
export function buildArticle(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: absolute(input.path),
    image: absolute(input.image),
    datePublished: input.datePublished,
    author: { "@type": "Organization", name: CLINIC.name, url: SITE_URL },
    publisher: {
      "@type": "MedicalClinic",
      name: CLINIC.name,
      url: SITE_URL,
    },
  } as const;
}

export function buildService(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absolute(input.path),
    provider: {
      "@type": "MedicalClinic",
      name: CLINIC.name,
      url: SITE_URL,
    },
    areaServed: AREA_SERVED,
  } as const;
}

export function buildFaqPage(faqs: readonly Faq[]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  } as const;
}

export function buildBreadcrumbList(crumbs: readonly Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  } as const;
}
