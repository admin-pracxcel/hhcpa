/**
 * JSON-LD builders.
 *
 * Every page's schema is derived from the same data that renders its copy, so
 * markup and visible content cannot drift apart. Schema types per page come from
 * the build blocks in HHCPA_Website_Content_UPDATED.md.
 */
import {
  CLINIC,
  GOOGLE_BUSINESS_PROFILE,
  SOCIAL_PROFILES,
} from "@/content/clinic";
import {
  PRACTITIONERS,
  practitionerSchemaType,
  practitionerSlug,
} from "@/content/practitioners";
import type { Practitioner } from "@/components/sections/PractitionerCards";

/**
 * The canonical origin — apex, no `www`.
 *
 * One spelling of the site, everywhere: canonicals, the sitemap, robots.txt
 * and every JSON-LD `url` are built from this, so they cannot disagree with
 * each other or with what the server actually serves. `www.` 308s here, from
 * the rule in next.config.ts.
 *
 * Paths are written with a trailing slash and `trailingSlash: true` serves
 * them that way, so `${SITE_URL}${path}` is the final URL and never one that
 * redirects.
 */
export const SITE_URL = "https://horizonhealthcarepartners.com.au";

const AREA_SERVED = { "@type": "Country", name: "Australia" } as const;

function absolute(path: string): string {
  return `${SITE_URL}${path}`;
}

/* -------------------------------------------------------------------------
   Node identifiers

   Every node the rest of the site points at is named here rather than spelled
   out at each use. A typo in an `@id` does not fail anything — it silently
   produces a second, unconnected entity, which is the exact fault this whole
   graph exists to fix.
   ------------------------------------------------------------------------- */

export const ORGANISATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;

/** A reference to a node defined elsewhere in the graph. */
const ref = (id: string) => ({ "@id": id }) as const;

/** The practitioner node for one person, by slug. */
export const practitionerId = (slug: string): string =>
  `${SITE_URL}/our-practitioners/#${slug}`;

/**
 * The site-wide graph, emitted once in the root layout.
 *
 * ─── WHY ONE GRAPH ─────────────────────────────────────────────────────────
 *
 * Before 2026-10-29 the organisation was described by a standalone
 * `MedicalClinic` block with no `@id`, rendered by the `(site)` layout. Every
 * page carried a copy, nothing said the copies were the same thing, and the
 * block was thin — no logo, no ABN, no hours, no contact point, no sameAs, no
 * practitioners. A search engine saw the same clinic described many times and
 * had no statement that it was one organisation.
 *
 * `@id` is what turns those copies into one entity described many times, and
 * that is what consolidates a knowledge panel.
 *
 * It moved from the `(site)` layout to the root layout at the same time, so
 * `/quiz/` is covered too. It sits outside the `(site)` group and was the only
 * page on the site with no organisation markup at all.
 *
 * Every value is read from `content/clinic.ts` and `content/practitioners.ts`
 * rather than written out here. The audit's own block hard-coded the phone
 * number; this site moved its number twice in October, and the only reason
 * that cost two lines instead of a search was that one file owns it.
 */
export function buildSiteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "MedicalClinic"],
        "@id": ORGANISATION_ID,
        name: CLINIC.name,
        alternateName: CLINIC.shortName,
        legalName: CLINIC.legalName,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          "@id": LOGO_ID,
          url: absolute("/images/logo-colour.svg"),
          contentUrl: absolute("/images/logo-colour.svg"),
          caption: CLINIC.name,
        },
        image: ref(LOGO_ID),
        telephone: CLINIC.phone,
        email: CLINIC.email,
        identifier: [
          {
            "@type": "PropertyValue",
            propertyID: "ABN",
            name: "Australian Business Number",
            value: CLINIC.abn,
          },
        ],
        areaServed: AREA_SERVED,
        knowsLanguage: "en-AU",
        currenciesAccepted: "AUD",
        /*
         * The four specialties the published services actually cover. Not a
         * wish list: every one of them maps to a service pillar with a page.
         */
        medicalSpecialty: [
          "https://schema.org/PrimaryCare",
          "https://schema.org/Endocrine",
          "https://schema.org/Gynecologic",
          "https://schema.org/Psychiatric",
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: CLINIC.opensAt,
            closes: CLINIC.closesAt,
          },
        ],
        availableChannel: {
          "@type": "ServiceChannel",
          name: "Telehealth consultation",
          serviceUrl: absolute("/quiz/"),
          availableLanguage: { "@type": "Language", name: "English" },
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: CLINIC.phone,
            email: CLINIC.email,
            availableLanguage: "en-AU",
          },
        ],
        sameAs: [
          GOOGLE_BUSINESS_PROFILE,
          ...SOCIAL_PROFILES.map((profile) => profile.href),
        ],
        /*
         * Eight references, resolved on /our-practitioners/ where the nodes
         * themselves are defined with their AHPRA numbers. Published
         * registration numbers for every practitioner is the strongest trust
         * signal on this site and almost no competitor publishes them; it was
         * absent from the structured data entirely.
         */
        employee: PRACTITIONERS.map((practitioner) =>
          ref(practitionerId(practitionerSlug(practitioner))),
        ),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: CLINIC.name,
        inLanguage: "en-AU",
        publisher: ref(ORGANISATION_ID),
      },
    ],
  } as const;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Crumb {
  name: string;
  path: string;
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
    isPartOf: ref(WEBSITE_ID),
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
    isPartOf: ref(WEBSITE_ID),
    about: ref(ORGANISATION_ID),
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
    isPartOf: ref(WEBSITE_ID),
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
    author: ref(ORGANISATION_ID),
    publisher: ref(ORGANISATION_ID),
    isPartOf: ref(WEBSITE_ID),
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
    provider: ref(ORGANISATION_ID),
    areaServed: AREA_SERVED,
  } as const;
}

/**
 * The practitioner roster, as an ItemList of one node per person.
 *
 * ─── THE TYPE IS NOT A STYLE CHOICE ────────────────────────────────────────
 *
 * `practitionerSchemaType` reads it off the AHPRA prefix: MED is a medical
 * practitioner and takes `IndividualPhysician`, NMW is a nurse or midwife and
 * takes `Person`. Describing a nurse practitioner as a Physician here is the
 * machine-readable form of the protected-title breach s113 of the National
 * Law prohibits in page copy, and JSON-LD is no more exempt than a heading.
 *
 * The two shapes differ accordingly. A physician gets `occupationalCategory`
 * and `memberOf`; `jobTitle` and `worksFor` are not valid on that type, so
 * the Person branch is the only one that carries them. Focus areas become
 * `availableService` procedures for a physician and `knowsAbout` for a
 * Person, which is the difference between performing a procedure and having
 * expertise in a subject.
 *
 * Every node carries the AHPRA number as a PropertyValue identifier. That is
 * the point of the whole block: published, verifiable registration for all
 * eight, which almost no competitor publishes and which was absent from the
 * structured data entirely until 2026-10-29.
 */
export function buildPractitionerList(
  practitioners: readonly Practitioner[],
  path: string,
) {
  const url = absolute(path);

  const node = (practitioner: Practitioner) => {
    const identifier = {
      "@type": "PropertyValue",
      propertyID: "AHPRA",
      name: "AHPRA registration number",
      value: practitioner.ahpraNumber,
    } as const;

    const base = {
      "@id": practitionerId(practitionerSlug(practitioner)),
      name: practitioner.name,
      url,
      identifier,
    } as const;

    if (practitionerSchemaType(practitioner) === "IndividualPhysician") {
      return {
        ...base,
        "@type": "IndividualPhysician",
        occupationalCategory: practitioner.title,
        practicesAt: ref(ORGANISATION_ID),
        memberOf: ref(ORGANISATION_ID),
        areaServed: AREA_SERVED,
        availableService: (practitioner.focusAreas ?? []).map((area) => ({
          "@type": "MedicalProcedure",
          name: area,
        })),
      };
    }

    return {
      ...base,
      "@type": "Person",
      jobTitle: practitioner.title,
      worksFor: ref(ORGANISATION_ID),
      knowsAbout: [...(practitioner.focusAreas ?? [])],
    };
  };

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#practitioner-list`,
    name: `AHPRA-registered practitioners at ${CLINIC.name}`,
    numberOfItems: practitioners.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: practitioners.map((practitioner, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: node(practitioner),
    })),
  } as const;
}

/**
 * The knowledge hub, as a Blog listing its posts.
 *
 * `/articles/` carried only MedicalWebPage and a breadcrumb, and the three
 * article cards were the only internal links to the articles at all. A Blog
 * node with `blogPost` references states the relationship the cards imply.
 *
 * References by `@id` rather than restating each article: the full Article
 * node is published on the article's own page, and describing it twice with
 * different detail is how the two drift.
 */
export function buildBlog(
  posts: readonly { slug: string; title: string }[],
  input: { name: string; description: string; path: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${absolute(input.path)}#blog`,
    name: input.name,
    description: input.description,
    url: absolute(input.path),
    inLanguage: "en-AU",
    publisher: ref(ORGANISATION_ID),
    isPartOf: ref(WEBSITE_ID),
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${absolute(`/article/${post.slug}/`)}#article`,
      headline: post.title,
      url: absolute(`/article/${post.slug}/`),
    })),
  } as const;
}

/**
 * The published fee table, as Service nodes with an Offer each.
 *
 * ⚠️ The consultation is priced. Never a medicine.
 *
 * That is not a style note. Advertising a price against a prescription-only
 * medicine is prohibited under the Therapeutic Goods Advertising Code, and it
 * is prohibited in structured data for the same reason it is prohibited in
 * page copy — `restricted-terms.test.ts` already enforces the wording, and
 * this is the same rule wearing JSON-LD. Every `name` here is a consultation.
 *
 * The fees are already published on the page in words. This makes them
 * readable by a machine, which is the whole differentiator: a telehealth
 * clinic that publishes its prices, in a market where most do not.
 */
export function buildPricedServices(
  services: readonly {
    name: string;
    description: string;
    price: number;
  }[],
  path: string,
) {
  return services.map(
    (service) =>
      ({
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.name,
        description: service.description,
        url: absolute(path),
        provider: ref(ORGANISATION_ID),
        areaServed: AREA_SERVED,
        offers: {
          "@type": "Offer",
          price: service.price.toFixed(2),
          priceCurrency: "AUD",
          url: absolute(path),
          availability: "https://schema.org/InStock",
          /* The fee buys a consultation. Anything dispensed afterwards is a
             separate cost and is not described here. */
          category: "Consultation",
        },
      }) as const,
  );
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
