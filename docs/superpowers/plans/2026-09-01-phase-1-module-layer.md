# HHCPA Phase 1 — Module Layer & Layout Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 16-module component vocabulary, the site layout shell, and the content/schema infrastructure that all 35 routes of the HHCPA rebuild depend on.

**Architecture:** Content lives as typed `readonly` consts in `src/content/`; presentation lives as pure, mostly-server components in `src/components/modules/`. A discriminated-union `ModuleSpec` type lets a page declare its middle sections as data, which the `ModuleRenderer` dispatches. Compliance obligations (disclaimer, no-testimonials, gated pages) are enforced structurally by the layout and the route registry rather than by per-page vigilance.

**Tech Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS v4 · Vitest + React Testing Library

**Spec:** `docs/superpowers/specs/2026-09-01-hhcpa-site-design.md`

## Global Constraints

- **Node:** `>=20.9.0`. The current `package.json` declares `">=24"`, which fails `npm ci` on Hostinger's Node 20. Relax it in Task 1 (spec §8).
- **Breakpoints:** the target's own — **991 / 767 / 478px**. Not Tailwind defaults. Use arbitrary variants (`max-[991px]:`). (AGENTS.md)
- **rem conversion:** the target ships `html { font-size: 62.5% }`. Any value lifted from its CSS must be multiplied by 10 to become px. (AGENTS.md)
- **Never put a backtick inside a scoped `<style>` template literal.** It terminates the string. Three separate agents have hit this. (AGENTS.md)
- **New modules use Tailwind arbitrary values** referencing the `--hhcp-*` custom properties (e.g. `text-[color:var(--hhcp-primary)]`), *not* scoped `<style>` blocks. The ported clone sections keep their existing scoped blocks. This is a deliberate split: it sidesteps the backtick footgun for the 16 files being written fresh.
- **`globals.css` base typography must stay inside `@layer base`.** Unlayered CSS outranks every Tailwind utility. (AGENTS.md)
- **The header is not sticky.** It is `position: absolute` and scrolls away. No scroll listeners, no IntersectionObservers anywhere in this codebase. (AGENTS.md)
- **No testimonial, review-count, star-rating or patient-quote module may be created.** AHPRA treats them as advertising a regulated health service; Clause 2.6 of the Service Agreement forbids them. (spec §4.1, §7)
- **No outcome claims, no product or brand names** for S4/S8 medications or compounded GLP-1 products. (spec §1.1)
- **Every page renders the site-wide disclaimer.** It lives in the layout, not in page data. (spec §7)
- **Content is modelled as typed `readonly` const arrays and mapped once.** (AGENTS.md)

---

## File Structure

**Created in this phase:**

| File | Responsibility |
|---|---|
| `vitest.config.ts` | Test runner config — jsdom, React plugin, path alias |
| `vitest.setup.ts` | Registers `@testing-library/jest-dom` matchers |
| `src/content/clinic.ts` | NAP, ABN, phone, email, hours, disclaimer, trust-bar items, emergency contacts |
| `src/content/pricing.ts` | Single source for every price on the site + provisional flags |
| `src/content/routes.ts` | Route registry with gating flags — feeds nav, footer, sitemap, robots |
| `src/content/nav.ts` | Header navigation tree |
| `src/content/footer.ts` | Five-column footer structure |
| `src/lib/schema.ts` | JSON-LD builders: MedicalClinic, MedicalWebPage, Service, FAQPage, BreadcrumbList |
| `src/components/JsonLd.tsx` | Renders a schema object into a `<script type="application/ld+json">` |
| `src/components/modules/types.ts` | The `ModuleSpec` discriminated union and shared prop types |
| `src/components/modules/Container.tsx` | The 1340px content wrapper |
| `src/components/modules/*.tsx` | The 16 modules |
| `src/components/modules/ModuleRenderer.tsx` | Dispatches a `ModuleSpec[]` to components |
| `src/components/layout/StickyMobileCta.tsx` | Book + tap-to-call bar, ≤767px only |
| `src/components/layout/SiteDisclaimer.tsx` | The mandatory footer disclaimer |
| `src/app/(site)/layout.tsx` | Header · children · footer · disclaimer · sticky CTA |
| `src/app/sitemap.ts` | Generated from the route registry, gated routes excluded |
| `src/app/robots.ts` | Disallows gated routes |

**Modified:**

| File | Change |
|---|---|
| `package.json` | Relax `engines.node`; add test deps and scripts |
| `next.config.ts` | Add the three 301 redirects |
| `src/app/page.tsx` | Move to `src/app/(site)/page.tsx`, drop header/footer (layout owns them) |
| `src/components/sites/…/SiteHeader.tsx` | Restructure to four service dropdowns + About menu |
| `src/components/sites/…/SiteFooter.tsx` | Restructure to five columns |

---

## Task 1: Test infrastructure and Node engine fix

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Test: `src/lib/utils.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `npm test` (watch) and `npm run test:run` (single pass) commands; `npm run check` gains a test step. All later tasks depend on these.

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest@^3 @vitejs/plugin-react@^5 jsdom@^27 \
  @testing-library/react@^16 @testing-library/dom@^10 @testing-library/jest-dom@^6
```

- [ ] **Step 2: Create the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 3: Create the setup file**

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Update package.json**

Change the `engines` block and add scripts. The `engines.node` change is required — Hostinger's documented Node is 20, Next.js 16 needs only `>=20.9.0`, and `">=24"` fails `npm ci` there.

```jsonc
{
  "engines": {
    "node": ">=20.9.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "check": "npm run lint && npm run typecheck && npm run test:run && npm run build"
  }
}
```

- [ ] **Step 5: Write the failing test**

Create `src/lib/utils.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("lets a later Tailwind class win over an earlier conflicting one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });
});
```

- [ ] **Step 6: Run the test**

Run: `npm run test:run`
Expected: 3 tests PASS. (`cn` already exists — this test proves the harness works, not new behaviour.)

- [ ] **Step 7: Verify the full check passes**

Run: `npm run check`
Expected: lint, typecheck, tests and build all succeed.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts src/lib/utils.test.ts
git commit -m "chore: add Vitest + Testing Library, relax Node engine to >=20.9.0

Hostinger's documented Node is 20; Next.js 16 needs only >=20.9.0. The
previous >=24 came from the cloner template and fails npm ci on deploy."
```

---

## Task 2: Clinic constants

**Files:**
- Create: `src/content/clinic.ts`
- Test: `src/content/clinic.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `CLINIC` (name, legalName, abn, phone, phoneHref, email, hours, hoursProvisional, addressRegion), `SITE_DISCLAIMER: string`, `EMERGENCY_CONTACTS: readonly EmergencyContact[]`, `TRUST_BAR_DEFAULT: readonly string[]`, `type EmergencyContact = { label: string; number: string; href: string }`.

**Why this exists:** the NAP block, the disclaimer and the emergency numbers appear on every page. Centralising them means the "hours" ambiguity from onboarding item 6 resolves in one edit (spec §10.2).

- [ ] **Step 1: Write the failing test**

Create `src/content/clinic.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { CLINIC, SITE_DISCLAIMER, EMERGENCY_CONTACTS, TRUST_BAR_DEFAULT } from "./clinic";

describe("CLINIC", () => {
  it("carries the registered legal entity and ABN from the Service Agreement", () => {
    expect(CLINIC.legalName).toBe("Horizon Health Care Partners Pty Ltd");
    expect(CLINIC.abn).toBe("92 689 872 811");
  });

  it("exposes a dialable tel: href alongside the display number", () => {
    expect(CLINIC.phone).toBe("1300 336 572");
    expect(CLINIC.phoneHref).toBe("tel:1300336572");
  });

  it("flags the business hours as unconfirmed", () => {
    // Onboarding item 6: "8-10am - Monday to Sunday" is ambiguous and awaiting
    // confirmation. The flag keeps it visible rather than silently shipping a guess.
    expect(CLINIC.hoursProvisional).toBe(true);
  });
});

describe("SITE_DISCLAIMER", () => {
  it("carries every mandated element", () => {
    expect(SITE_DISCLAIMER).toContain("no treatment outcomes are guaranteed");
    expect(SITE_DISCLAIMER).toContain("real-time consultation");
    expect(SITE_DISCLAIMER).toContain("000");
    expect(SITE_DISCLAIMER).toContain("13 11 14");
    expect(SITE_DISCLAIMER).toContain("1300 22 4636");
  });
});

describe("EMERGENCY_CONTACTS", () => {
  it("lists emergency, Lifeline and Beyond Blue with dialable hrefs", () => {
    expect(EMERGENCY_CONTACTS).toHaveLength(3);
    expect(EMERGENCY_CONTACTS.map((c) => c.number)).toEqual([
      "000",
      "13 11 14",
      "1300 22 4636",
    ]);
    for (const contact of EMERGENCY_CONTACTS) {
      expect(contact.href.startsWith("tel:")).toBe(true);
      expect(contact.href).not.toContain(" ");
    }
  });
});

describe("TRUST_BAR_DEFAULT", () => {
  it("has the five items the content doc specifies", () => {
    expect(TRUST_BAR_DEFAULT).toHaveLength(5);
    expect(TRUST_BAR_DEFAULT[0]).toBe("AHPRA-registered practitioners");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/content/clinic.test.ts`
Expected: FAIL — `Failed to resolve import "./clinic"`.

- [ ] **Step 3: Write the implementation**

Create `src/content/clinic.ts`:

```ts
/**
 * Clinic facts that appear site-wide.
 *
 * Sources: HHCPA_Service_Agreement_Final.pdf (legal entity, ABN),
 * HHCPA_Website_Content_UPDATED.md (NAP block, disclaimer, trust bar),
 * HHCPA_Onboarding_Sheet (confirmed phone, email, hours).
 */

export interface EmergencyContact {
  label: string;
  number: string;
  href: string;
}

export const CLINIC = {
  name: "Horizon Health Care Partners",
  shortName: "HHCPA",
  legalName: "Horizon Health Care Partners Pty Ltd",
  abn: "92 689 872 811",
  phone: "1300 336 572",
  phoneHref: "tel:1300336572",
  email: "hello@horizonhealthcarepartners.com.au",
  emailHref: "mailto:hello@horizonhealthcarepartners.com.au",
  addressRegion: "West End, Queensland",
  serviceArea: "Australia-wide telehealth",
  /**
   * Onboarding item 6 answered "8-10am - Monday to Sunday", which is ambiguous —
   * most likely a typo for 8am to 10pm, matching the current live site. Awaiting
   * written confirmation; `hoursProvisional` keeps that visible to reviewers.
   */
  hours: "Monday to Sunday, 8am to 10pm AEST",
  hoursProvisional: true,
} as const;

export const SITE_DISCLAIMER =
  "Individual results may vary and no treatment outcomes are guaranteed. " +
  "Prescriptions are provided only where clinically appropriate following a " +
  "real-time consultation, at the treating practitioner's discretion. " +
  "Information on this site is general and is not a substitute for personal " +
  "medical advice. If this is a medical emergency, call 000. If you are in " +
  "crisis, call Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636.";

export const EMERGENCY_CONTACTS: readonly EmergencyContact[] = [
  { label: "Emergency", number: "000", href: "tel:000" },
  { label: "Lifeline", number: "13 11 14", href: "tel:131114" },
  { label: "Beyond Blue", number: "1300 22 4636", href: "tel:1300224636" },
] as const;

export const TRUST_BAR_DEFAULT: readonly string[] = [
  "AHPRA-registered practitioners",
  "Australia-wide telehealth",
  "Clear, upfront pricing",
  "Private and judgement-free",
  "Care centred on you",
] as const;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:run src/content/clinic.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/content/clinic.ts src/content/clinic.test.ts
git commit -m "feat: add clinic constants, site disclaimer and emergency contacts"
```

---

## Task 3: Pricing single source

**Files:**
- Create: `src/content/pricing.ts`
- Test: `src/content/pricing.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `type PriceKey`, `PRICES: Record<PriceKey, Price>`, `type Price = { label: string; amount: number | null; from: boolean; provisional: boolean }`, `formatPrice(key: PriceKey): string`, `PROVISIONAL_PRICE_KEYS: readonly PriceKey[]`.

**Why this exists:** spec §4.3. Eight pricing-cue module instances plus the `/pricing/` table read from here. Seventeen `[[WAITING ON RANJEETA]]` placeholders are almost all prices; this makes their resolution one edit instead of a nine-page hunt.

- [ ] **Step 1: Write the failing test**

Create `src/content/pricing.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { PRICES, formatPrice, PROVISIONAL_PRICE_KEYS } from "./pricing";

describe("formatPrice", () => {
  it("renders a plain fee without a 'from' prefix", () => {
    expect(formatPrice("firstConsult")).toBe("$59");
  });

  it("prefixes 'from' where the fee is a starting price", () => {
    expect(formatPrice("weightManagement")).toBe("from $99");
  });

  it("renders cents only when the amount has them", () => {
    expect(formatPrice("medicalCertificate")).toBe("from $19.90");
  });

  it("renders Free for a zero amount", () => {
    expect(formatPrice("quiz")).toBe("Free");
  });
});

describe("PRICES", () => {
  it("covers every fee the content doc displays", () => {
    const required = [
      "quiz", "firstConsult", "followUpConsult", "transferConsult",
      "generalConsult", "afterHoursConsult", "priorityConsult",
      "medicalCertificate", "prescriptions", "pathologyReferral",
      "mentalHealth", "mensWomensHealth", "weightManagement", "healthProgram",
    ] as const;
    for (const key of required) {
      expect(PRICES[key]).toBeDefined();
    }
  });
});

describe("PROVISIONAL_PRICE_KEYS", () => {
  it("lists every price still awaiting written confirmation", () => {
    // Onboarding items 21 and 25 leave these unresolved. Nothing may publish
    // as final until Ranjeeta confirms; the flag is the audit trail.
    expect(PROVISIONAL_PRICE_KEYS).toContain("weightManagement");
    expect(PROVISIONAL_PRICE_KEYS).toContain("healthProgram");
  });

  it("is derived from the table rather than hand-maintained", () => {
    const derived = Object.entries(PRICES)
      .filter(([, price]) => price.provisional)
      .map(([key]) => key)
      .sort();
    expect([...PROVISIONAL_PRICE_KEYS].sort()).toEqual(derived);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/content/pricing.test.ts`
Expected: FAIL — `Failed to resolve import "./pricing"`.

- [ ] **Step 3: Write the implementation**

Create `src/content/pricing.ts`:

```ts
/**
 * The single source for every price displayed on the site.
 *
 * Figures come from HHCPA_Website_Content_UPDATED.md (page 22, Pricing) and the
 * current live site. Anything marked `provisional` is awaiting Ranjeeta's written
 * confirmation per onboarding items 21 and 25, and must not be presented as final
 * until confirmed — see the design spec, §10.2.
 *
 * Onboarding item 25 also asks whether *every* figure should read as a "from"
 * price. If that is confirmed, set `from: true` across the board here; no other
 * file changes.
 */

export interface Price {
  label: string;
  /** In AUD. `0` renders as "Free". */
  amount: number;
  /** Renders a "from" prefix. */
  from: boolean;
  /** Awaiting written client confirmation. */
  provisional: boolean;
}

export type PriceKey =
  | "quiz"
  | "firstConsult"
  | "followUpConsult"
  | "transferConsult"
  | "generalConsult"
  | "afterHoursConsult"
  | "priorityConsult"
  | "medicalCertificate"
  | "prescriptions"
  | "pathologyReferral"
  | "mentalHealth"
  | "mensWomensHealth"
  | "weightManagement"
  | "healthProgram";

export const PRICES: Record<PriceKey, Price> = {
  quiz:               { label: "Pre-screening quiz",              amount: 0,     from: false, provisional: false },
  firstConsult:       { label: "First medical consultation",      amount: 59,    from: false, provisional: true },
  followUpConsult:    { label: "Follow-up consultation",          amount: 59,    from: false, provisional: true },
  transferConsult:    { label: "Transfer consultation",           amount: 54,    from: false, provisional: true },
  generalConsult:     { label: "General consult and referrals",   amount: 49,    from: true,  provisional: true },
  afterHoursConsult:  { label: "After-hours consult",             amount: 69,    from: true,  provisional: true },
  priorityConsult:    { label: "Priority consult",                amount: 98,    from: true,  provisional: true },
  medicalCertificate: { label: "Medical certificates",            amount: 19.9,  from: true,  provisional: true },
  prescriptions:      { label: "Prescriptions and repeat scripts", amount: 49,   from: true,  provisional: true },
  pathologyReferral:  { label: "Pathology and imaging referrals", amount: 49,    from: true,  provisional: true },
  mentalHealth:       { label: "Mental health support",           amount: 59,    from: true,  provisional: true },
  mensWomensHealth:   { label: "Men's and women's health",        amount: 89,    from: true,  provisional: true },
  weightManagement:   { label: "Weight management",               amount: 99,    from: true,  provisional: true },
  healthProgram:      { label: "Structured health programs",      amount: 299,   from: true,  provisional: true },
};

export const PROVISIONAL_PRICE_KEYS: readonly PriceKey[] = (
  Object.keys(PRICES) as PriceKey[]
).filter((key) => PRICES[key].provisional);

export function formatPrice(key: PriceKey): string {
  const price = PRICES[key];
  if (price.amount === 0) return "Free";
  const hasCents = !Number.isInteger(price.amount);
  const amount = hasCents ? price.amount.toFixed(2) : String(price.amount);
  return `${price.from ? "from " : ""}$${amount}`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:run src/content/pricing.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/content/pricing.ts src/content/pricing.test.ts
git commit -m "feat: add pricing as a single source with provisional flags"
```

---

## Task 4: JSON-LD schema builders

**Files:**
- Create: `src/lib/schema.ts`
- Create: `src/components/JsonLd.tsx`
- Test: `src/lib/schema.test.ts`

**Interfaces:**
- Consumes: `CLINIC` from `@/content/clinic`
- Produces: `buildMedicalClinic()`, `buildMedicalWebPage(input)`, `buildService(input)`, `buildFaqPage(faqs)`, `buildBreadcrumbList(crumbs)`, `SITE_URL`, and `<JsonLd data={…} />`.

**Why this exists:** spec §7 — schema is generated *from* page data so FAQ copy and `FAQPage` markup cannot drift apart.

- [ ] **Step 1: Write the failing test**

Create `src/lib/schema.test.ts`:

```ts
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
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0].name).toBe("Do I need a referral?");
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe("No referral is needed.");
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/lib/schema.test.ts`
Expected: FAIL — `Failed to resolve import "./schema"`.

- [ ] **Step 3: Write the schema builders**

Create `src/lib/schema.ts`:

```ts
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
```

- [ ] **Step 4: Create the JsonLd component**

Create `src/components/JsonLd.tsx`:

```tsx
/**
 * Renders a schema object as JSON-LD.
 *
 * `data` is built by the helpers in `@/lib/schema` from the page's own content
 * consts — never hand-authored — so the markup cannot diverge from what renders.
 * Accepts `null` so a page with no FAQs can pass `buildFaqPage([])` directly.
 */
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:run src/lib/schema.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/schema.ts src/lib/schema.test.ts src/components/JsonLd.tsx
git commit -m "feat: add JSON-LD schema builders and JsonLd component"
```

---

## Task 5: Route registry with compliance gating

**Files:**
- Create: `src/content/routes.ts`
- Test: `src/content/routes.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `type RouteEntry = { path: string; title: string; gated?: boolean }`, `ROUTES: readonly RouteEntry[]`, `publicRoutes(): RouteEntry[]`, `gatedRoutes(): RouteEntry[]`, `isGated(path: string): boolean`.

**Why this exists:** spec §7 — `/medicinal-cannabis/` and `/our-practitioners/` must stay out of the sitemap, nav and robots until Ranjeeta signs off under Clause 6.2(b). One registry drives all three, so a page cannot leak through one channel while being hidden in another.

- [ ] **Step 1: Write the failing test**

Create `src/content/routes.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { ROUTES, publicRoutes, gatedRoutes, isGated } from "./routes";

describe("ROUTES", () => {
  it("covers all 35 routes in the design spec", () => {
    expect(ROUTES).toHaveLength(35);
  });

  it("uses trailing-slash paths throughout, matching the live site", () => {
    for (const route of ROUTES) {
      if (route.path === "/") continue;
      expect(route.path.endsWith("/")).toBe(true);
    }
  });

  it("has no duplicate paths", () => {
    const paths = ROUTES.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe("gating", () => {
  it("gates exactly the two compliance-blocked pages", () => {
    expect(gatedRoutes().map((r) => r.path).sort()).toEqual([
      "/medicinal-cannabis/",
      "/our-practitioners/",
    ]);
  });

  it("excludes gated routes from the public set", () => {
    const publicPaths = publicRoutes().map((r) => r.path);
    expect(publicPaths).not.toContain("/medicinal-cannabis/");
    expect(publicPaths).not.toContain("/our-practitioners/");
  });

  it("reports gating by path", () => {
    expect(isGated("/medicinal-cannabis/")).toBe(true);
    expect(isGated("/pricing/")).toBe(false);
    expect(isGated("/not-a-route/")).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/content/routes.test.ts`
Expected: FAIL — `Failed to resolve import "./routes"`.

- [ ] **Step 3: Write the implementation**

Create `src/content/routes.ts`:

```ts
/**
 * The canonical route registry.
 *
 * Drives the sitemap, robots.txt, navigation and breadcrumbs from one place, so a
 * gated page cannot leak through one channel while being hidden in another.
 *
 * `gated: true` means the page is built but withheld from publication pending the
 * client's express written approval under Clause 6.2(b) of the Service Agreement.
 * Removing the flag is the act of publishing — do not remove one without the
 * written sign-off on file.
 */

export interface RouteEntry {
  path: string;
  title: string;
  gated?: boolean;
}

export const ROUTES: readonly RouteEntry[] = [
  { path: "/", title: "Home" },

  // Weight Loss & Peptides
  { path: "/weight-loss-peptides/", title: "Weight Loss & Peptides" },
  { path: "/weight-loss-peptides/weight-loss-injections/", title: "Weight Loss Injections" },
  { path: "/weight-loss-peptides/medical-weight-loss-program/", title: "Medical Weight Loss Program" },

  // Men's Health
  { path: "/mens-health/", title: "Men's Health" },
  { path: "/mens-health/erectile-dysfunction-treatment/", title: "Erectile Dysfunction Treatment" },
  { path: "/mens-health/testosterone-replacement-therapy/", title: "Testosterone Replacement Therapy" },
  { path: "/mens-health/premature-ejaculation-treatment/", title: "Premature Ejaculation Treatment" },
  { path: "/mens-health/hair-loss-treatment/", title: "Hair Loss Treatment" },

  // Women's Health
  { path: "/womens-health/", title: "Women's Health" },
  { path: "/womens-health/menopause-treatment/", title: "Menopause Treatment" },
  { path: "/womens-health/pcos-management/", title: "PCOS Management" },
  { path: "/womens-health/contraception/", title: "Contraception & Sexual Health" },

  // Medicinal Cannabis — withheld pending compliance sign-off
  { path: "/medicinal-cannabis/", title: "Medicinal Cannabis", gated: true },

  // Online Doctor
  { path: "/online-doctor/", title: "Online Doctor" },
  { path: "/online-doctor/online-prescriptions/", title: "Online Prescriptions & Repeat Scripts" },
  { path: "/online-doctor/medical-certificates/", title: "Online Medical Certificates" },
  { path: "/online-doctor/pathology-imaging-referrals/", title: "Pathology & Imaging Referrals" },
  { path: "/online-doctor/specialist-referrals/", title: "Specialist Referrals" },
  { path: "/online-doctor/mental-health/", title: "Mental Health Support" },

  // Information & Trust
  { path: "/how-it-works/", title: "How It Works" },
  { path: "/pricing/", title: "Pricing" },
  { path: "/about-us/", title: "About Us" },
  // Withheld: only one named practitioner, no AHPRA number, no headshot on file.
  { path: "/our-practitioners/", title: "Our Practitioners", gated: true },
  { path: "/contact/", title: "Contact" },
  { path: "/faqs/", title: "FAQs" },

  // Patient actions
  { path: "/quiz/", title: "Free Pre-Screening Quiz" },
  { path: "/discharge/", title: "Transfer Your Care" },
  { path: "/services/", title: "Services" },

  // Policies & safety
  { path: "/patient-safety/", title: "Patient Safety & Emergencies" },
  { path: "/complaints/", title: "Complaints" },
  { path: "/conflict-of-interest-disclosure/", title: "Conflict of Interest & Pharmacy Disclosure" },
  { path: "/privacy/", title: "Privacy Policy" },
  { path: "/terms-and-conditions/", title: "Terms & Conditions" },

  // Content
  { path: "/articles/", title: "Knowledge Hub" },
] as const;

export function publicRoutes(): RouteEntry[] {
  return ROUTES.filter((route) => !route.gated);
}

export function gatedRoutes(): RouteEntry[] {
  return ROUTES.filter((route) => route.gated === true);
}

export function isGated(path: string): boolean {
  return ROUTES.find((route) => route.path === path)?.gated === true;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:run src/content/routes.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/content/routes.ts src/content/routes.test.ts
git commit -m "feat: add route registry with compliance gating"
```

---

## Task 6: Sitemap, robots and redirects

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `next.config.ts`
- Test: `src/app/sitemap.test.ts`

**Interfaces:**
- Consumes: `publicRoutes`, `gatedRoutes` from `@/content/routes`; `SITE_URL` from `@/lib/schema`
- Produces: `/sitemap.xml` and `/robots.txt` at runtime; three 301 redirects.

- [ ] **Step 1: Write the failing test**

Create `src/app/sitemap.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { SITE_URL } from "@/lib/schema";

describe("sitemap", () => {
  it("lists every public route as an absolute url", () => {
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(30);
    for (const entry of entries) {
      expect(entry.url.startsWith(SITE_URL)).toBe(true);
    }
  });

  it("excludes compliance-gated routes", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).not.toContain(`${SITE_URL}/medicinal-cannabis/`);
    expect(urls).not.toContain(`${SITE_URL}/our-practitioners/`);
  });

  it("gives the homepage the highest priority", () => {
    const home = sitemap().find((entry) => entry.url === `${SITE_URL}/`);
    expect(home?.priority).toBe(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/app/sitemap.test.ts`
Expected: FAIL — `Failed to resolve import "./sitemap"`.

- [ ] **Step 3: Write the sitemap**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { publicRoutes } from "@/content/routes";
import { SITE_URL } from "@/lib/schema";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes().map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: "monthly" as const,
    priority: route.path === "/" ? 1 : 0.7,
  }));
}
```

- [ ] **Step 4: Write robots.ts**

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { gatedRoutes } from "@/content/routes";
import { SITE_URL } from "@/lib/schema";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Gated pages are built but not published — see the route registry.
      disallow: gatedRoutes().map((route) => route.path),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 5: Add the redirects**

Replace `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The WordPress site folded these into the new information architecture.
      // See the design spec, §3.2. All three are permanent.
      {
        source: "/medical-certificate",
        destination: "/online-doctor/medical-certificates/",
        permanent: true,
      },
      { source: "/home", destination: "/", permanent: true },
      // Screening now precedes booking.
      { source: "/book-consultation", destination: "/quiz/", permanent: true },
    ];
  },
};

export default nextConfig;
```

Note: if the existing `next.config.ts` already carries settings, merge rather than replace — read it first and keep what is there.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test:run src/app/sitemap.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 7: Verify the redirects build**

Run: `npm run build`
Expected: build succeeds; no redirect warnings.

- [ ] **Step 8: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/sitemap.test.ts next.config.ts
git commit -m "feat: add sitemap, robots and the three legacy 301 redirects

Gated routes are excluded from both the sitemap and robots via the route
registry, so a withheld page cannot leak through one channel."
```

---

## Task 7: Module types and the shared container

**Files:**
- Create: `src/components/modules/types.ts`
- Create: `src/components/modules/Container.tsx`
- Test: `src/components/modules/Container.test.tsx`

**Interfaces:**
- Consumes: `PriceKey` from `@/content/pricing`
- Produces: `type ModuleSpec` (the discriminated union every later module implements), `type ImageRef`, `type LinkRef`, and `<Container>`.

**Every later task's component props derive from this union.** Names here are load-bearing; do not rename without updating `ModuleRenderer` and every page data file.

- [ ] **Step 1: Write the failing test**

Create `src/components/modules/Container.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./Container";

describe("Container", () => {
  it("renders its children", () => {
    render(<Container><p>inside</p></Container>);
    expect(screen.getByText("inside")).toBeInTheDocument();
  });

  it("applies the shared 1340px wrapper class", () => {
    const { container } = render(<Container>x</Container>);
    expect(container.firstChild).toHaveClass("hhcp-container");
  });

  it("merges an extra className", () => {
    const { container } = render(<Container className="extra">x</Container>);
    expect(container.firstChild).toHaveClass("extra");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/components/modules/Container.test.tsx`
Expected: FAIL — `Failed to resolve import "./Container"`.

- [ ] **Step 3: Write the types**

Create `src/components/modules/types.ts`:

```ts
/**
 * The module vocabulary.
 *
 * Analysis of all 31 written page module maps found 278 module instances across
 * 16 distinct types. That is the complete UI surface of the site — see the design
 * spec, §4.1.
 *
 * Four of the sixteen are frame modules used directly by page templates (Hero,
 * TrustBar, FaqAccordion, ClosingCtaBand) rather than through this union. The
 * twelve below are the variable middle of a page.
 *
 * There is deliberately NO testimonial, review-count or star-rating member.
 * AHPRA treats those as advertising a regulated health service and Clause 2.6 of
 * the Service Agreement forbids them. Do not add one.
 */
import type { PriceKey } from "@/content/pricing";

export interface ImageRef {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface LinkRef {
  label: string;
  href: string;
  /** Optional supporting line, used by related-service cards. */
  body?: string;
}

export interface StepItem {
  title: string;
  body: string;
}

export interface TileItem {
  title: string;
  body: string;
}

export interface Practitioner {
  name: string;
  title: string;
  ahpraNumber: string;
  focusAreas: readonly string[];
  photo: ImageRef | null;
}

export type ModuleSpec =
  | { kind: "intro"; text: string }
  | {
      kind: "textImage";
      heading: string;
      body: readonly string[];
      image: ImageRef;
      /** Which side the image sits on at >991px. Alternating rows flip this. */
      imageSide?: "left" | "right";
    }
  | { kind: "steps"; heading: string; steps: readonly StepItem[] }
  | { kind: "featureTiles"; heading: string; tiles: readonly TileItem[] }
  | {
      kind: "checklist";
      heading: string;
      intro?: string;
      items: readonly string[];
      outro?: string;
    }
  | { kind: "relatedServices"; heading: string; links: readonly LinkRef[] }
  | { kind: "inlineCta"; heading?: string; body: string; links: readonly LinkRef[] }
  | {
      kind: "pricingCue";
      heading: string;
      body: string;
      priceKey: PriceKey;
      note?: string;
    }
  | {
      kind: "safetyCallout";
      heading: string;
      body: string;
    }
  | {
      kind: "disclosureCallout";
      heading: string;
      body: string;
      link: LinkRef;
    }
  | { kind: "practitionerCards"; heading: string; practitioners: readonly Practitioner[] }
  | { kind: "contactBlock"; heading: string };

export type ModuleKind = ModuleSpec["kind"];
```

- [ ] **Step 4: Write the Container**

Create `src/components/modules/Container.tsx`:

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The site's single content wrapper: 1340px, max-width 100%, 20px inline
 * padding, centred. `.hhcp-container` is defined in globals.css and is the same
 * wrapper the cloned sections use — see PAGE_TOPOLOGY.md, "Layout model".
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("hhcp-container", className)}>{children}</div>;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:run src/components/modules/Container.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Verify `.hhcp-container` exists in globals.css**

Run: `grep -n "hhcp-container" src/app/globals.css`
Expected: a rule setting `width: 1340px; max-width: 100%; padding-inline: 20px; margin-inline: auto`. If it is missing, add it inside `@layer base`.

- [ ] **Step 7: Commit**

```bash
git add src/components/modules/types.ts src/components/modules/Container.tsx src/components/modules/Container.test.tsx
git commit -m "feat: add ModuleSpec union and shared content container"
```

---

## Task 8: Text modules — Intro, TextImage, Checklist

**Files:**
- Create: `src/components/modules/Intro.tsx`
- Create: `src/components/modules/TextImage.tsx`
- Create: `src/components/modules/Checklist.tsx`
- Test: `src/components/modules/text-modules.test.tsx`

**Interfaces:**
- Consumes: `ModuleSpec` members `intro`, `textImage`, `checklist` from `./types`; `Container` from `./Container`
- Produces: `<Intro text>`, `<TextImage heading body image imageSide>`, `<Checklist heading intro items outro>`

These three account for 87 of the 278 module instances — the largest block of the vocabulary.

- [ ] **Step 1: Write the failing test**

Create `src/components/modules/text-modules.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Intro } from "./Intro";
import { TextImage } from "./TextImage";
import { Checklist } from "./Checklist";

const IMAGE = {
  src: "/img/example.jpg",
  alt: "A practitioner at a desk",
  width: 640,
  height: 480,
};

describe("Intro", () => {
  it("renders the lead paragraph", () => {
    render(<Intro text="Peptides for weight loss have become common." />);
    expect(
      screen.getByText("Peptides for weight loss have become common."),
    ).toBeInTheDocument();
  });
});

describe("TextImage", () => {
  it("renders an h2 heading and every body paragraph", () => {
    render(
      <TextImage
        heading="What peptides actually means"
        body={["First paragraph.", "Second paragraph."]}
        image={IMAGE}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "What peptides actually means" }),
    ).toBeInTheDocument();
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
  });

  it("renders the image with its alt text", () => {
    render(<TextImage heading="H" body={["b"]} image={IMAGE} />);
    expect(screen.getByAltText("A practitioner at a desk")).toBeInTheDocument();
  });

  it("puts the image first in DOM order when imageSide is left", () => {
    const { container } = render(
      <TextImage heading="H" body={["b"]} image={IMAGE} imageSide="left" />,
    );
    const grid = container.querySelector("[data-image-side]");
    expect(grid).toHaveAttribute("data-image-side", "left");
  });
});

describe("Checklist", () => {
  it("renders every item as a list entry", () => {
    render(
      <Checklist
        heading="Who it may suit"
        items={["You have tried diet and exercise.", "You want supervision."]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders optional intro and outro copy", () => {
    render(
      <Checklist
        heading="Who it may suit"
        intro="A consultation may be worth booking if:"
        items={["One."]}
        outro="It may not be right if you are pregnant."
      />,
    );
    expect(
      screen.getByText("A consultation may be worth booking if:"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("It may not be right if you are pregnant."),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/components/modules/text-modules.test.tsx`
Expected: FAIL — `Failed to resolve import "./Intro"`.

- [ ] **Step 3: Write Intro**

Create `src/components/modules/Intro.tsx`:

```tsx
import { Container } from "./Container";

/**
 * The lead paragraph. 31 instances — one per page, always directly under the
 * trust bar, always carrying the page's primary keyword in its first sentence.
 */
export function Intro({ text }: { text: string }) {
  return (
    <section className="py-[var(--hhcp-section-space-s)] px-[var(--hhcp-gutter)]">
      <Container>
        <p className="max-w-[880px] font-dm-sans text-[length:var(--hhcp-text-l)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
          {text}
        </p>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Write TextImage**

Create `src/components/modules/TextImage.tsx`:

```tsx
import Image from "next/image";
import { Container } from "./Container";
import type { ImageRef } from "./types";

/**
 * Split text + supporting image. 37 instances, the most-used module on the site.
 *
 * `imageSide` drives an order swap at >991px; below that the stack is always
 * text-then-image so reading order stays sensible on a phone.
 */
export function TextImage({
  heading,
  body,
  image,
  imageSide = "right",
}: {
  heading: string;
  body: readonly string[];
  image: ImageRef;
  imageSide?: "left" | "right";
}) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <div
          data-image-side={imageSide}
          className="grid grid-cols-2 items-center gap-[var(--hhcp-space-xl)] max-[991px]:grid-cols-1"
        >
          <div
            className={
              imageSide === "left"
                ? "order-2 max-[991px]:order-1"
                : "order-1"
            }
          >
            <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
              {heading}
            </h2>
            <div className="mt-[var(--hhcp-space-m)] flex flex-col gap-[var(--hhcp-space-s)]">
              {body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div
            className={
              imageSide === "left"
                ? "order-1 max-[991px]:order-2"
                : "order-2"
            }
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="h-auto w-full rounded-[var(--hhcp-radius-l)] object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Write Checklist**

Create `src/components/modules/Checklist.tsx`:

```tsx
import { Container } from "./Container";
import { CheckCircleIcon } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

/**
 * Eligibility checklist / icon list — "this may suit you if…". 19 instances.
 *
 * `outro` carries the counterweight the content doc always pairs with these
 * lists ("A consultation may not be the right step if…"), which is a compliance
 * requirement as much as a copy one: eligibility lists must not read as
 * qualification promises.
 */
export function Checklist({
  heading,
  intro,
  items,
  outro,
}: {
  heading: string;
  intro?: string;
  items: readonly string[];
  outro?: string;
}) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
          {heading}
        </h2>
        {intro ? (
          <p className="mt-[var(--hhcp-space-s)] font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
            {intro}
          </p>
        ) : null}
        <ul className="mt-[var(--hhcp-space-m)] flex flex-col gap-[var(--hhcp-space-s)]">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircleIcon className="mt-1 h-5 w-5 shrink-0 text-[color:var(--hhcp-action-dark)]" />
              <span className="font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
                {item}
              </span>
            </li>
          ))}
        </ul>
        {outro ? (
          <p className="mt-[var(--hhcp-space-m)] font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-60)]">
            {outro}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test:run src/components/modules/text-modules.test.tsx`
Expected: PASS, 6 tests.

- [ ] **Step 7: Commit**

```bash
git add src/components/modules/Intro.tsx src/components/modules/TextImage.tsx src/components/modules/Checklist.tsx src/components/modules/text-modules.test.tsx
git commit -m "feat: add Intro, TextImage and Checklist modules"
```

---

## Task 9: Card modules — Steps, FeatureTiles, RelatedServices

**Files:**
- Create: `src/components/modules/Steps.tsx`
- Create: `src/components/modules/FeatureTiles.tsx`
- Create: `src/components/modules/RelatedServices.tsx`
- Test: `src/components/modules/card-modules.test.tsx`

**Interfaces:**
- Consumes: `StepItem`, `TileItem`, `LinkRef` from `./types`; `Container`
- Produces: `<Steps heading steps>`, `<FeatureTiles heading tiles>`, `<RelatedServices heading links>`

- [ ] **Step 1: Write the failing test**

Create `src/components/modules/card-modules.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Steps } from "./Steps";
import { FeatureTiles } from "./FeatureTiles";
import { RelatedServices } from "./RelatedServices";

describe("Steps", () => {
  const STEPS = [
    { title: "Free pre-screening quiz", body: "A few short questions." },
    { title: "Book your consultation", body: "Choose a time that suits you." },
  ];

  it("numbers each step from 1", () => {
    render(<Steps heading="How it works" steps={STEPS} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders each step title as an h3", () => {
    render(<Steps heading="How it works" steps={STEPS} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Book your consultation" }),
    ).toBeInTheDocument();
  });
});

describe("FeatureTiles", () => {
  it("renders one tile per entry", () => {
    render(
      <FeatureTiles
        heading="Why patients choose Horizon"
        tiles={[
          { title: "Practitioner-led", body: "Real consultations." },
          { title: "Transparent", body: "Fees shown upfront." },
          { title: "Private", body: "Judgement-free care." },
        ]}
      />,
    );
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });
});

describe("RelatedServices", () => {
  it("renders each link with its href", () => {
    render(
      <RelatedServices
        heading="Explore your options"
        links={[
          { label: "Weight loss injections", href: "/weight-loss-peptides/weight-loss-injections/", body: "How injectables are assessed." },
        ]}
      />,
    );
    const link = screen.getByRole("link", { name: /Weight loss injections/ });
    expect(link).toHaveAttribute(
      "href",
      "/weight-loss-peptides/weight-loss-injections/",
    );
  });

  it("renders the optional supporting line", () => {
    render(
      <RelatedServices
        heading="Explore"
        links={[{ label: "Pricing", href: "/pricing/", body: "See full pricing." }]}
      />,
    );
    expect(screen.getByText("See full pricing.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/components/modules/card-modules.test.tsx`
Expected: FAIL — `Failed to resolve import "./Steps"`.

- [ ] **Step 3: Write Steps**

Create `src/components/modules/Steps.tsx`:

```tsx
import { Container } from "./Container";
import type { StepItem } from "./types";

/**
 * Numbered step cards. 26 instances. Horizontal on desktop, stacked at ≤767px,
 * per the content doc's module annotation.
 */
export function Steps({
  heading,
  steps,
}: {
  heading: string;
  steps: readonly StepItem[];
}) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
          {heading}
        </h2>
        <ol className="mt-[var(--hhcp-space-l)] grid grid-cols-4 gap-[var(--hhcp-content-gap)] max-[991px]:grid-cols-2 max-[767px]:grid-cols-1">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-[var(--hhcp-space-s)] rounded-[var(--hhcp-radius-l)] bg-[color:var(--hhcp-accent)] p-[var(--hhcp-space-m)]"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--hhcp-action)] font-roboto-mono text-[length:var(--hhcp-text-s)] font-medium text-[color:var(--hhcp-primary)]"
              >
                {index + 1}
              </span>
              <h3 className="font-dm-sans text-[length:var(--hhcp-h4)] leading-[var(--hhcp-heading-lh)] font-medium text-[color:var(--hhcp-primary)]">
                {step.title}
              </h3>
              <p className="font-dm-sans text-[length:var(--hhcp-text-s)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Write FeatureTiles**

Create `src/components/modules/FeatureTiles.tsx`:

```tsx
import { Container } from "./Container";
import type { TileItem } from "./types";

/**
 * Feature tiles, 3 to 4 across. 8 instances. Icon + heading + line in the
 * content doc; the icon slot is a decorative dot until per-tile icons are
 * supplied with the imagery pack (onboarding item 15).
 */
export function FeatureTiles({
  heading,
  tiles,
}: {
  heading: string;
  tiles: readonly TileItem[];
}) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
          {heading}
        </h2>
        <div className="mt-[var(--hhcp-space-l)] grid grid-cols-3 gap-[var(--hhcp-content-gap)] max-[991px]:grid-cols-2 max-[767px]:grid-cols-1">
          {tiles.map((tile) => (
            <div
              key={tile.title}
              className="flex flex-col gap-[var(--hhcp-space-xs)] rounded-[var(--hhcp-radius-l)] border border-[color:var(--hhcp-base-10)] p-[var(--hhcp-space-m)]"
            >
              <span
                aria-hidden="true"
                className="h-[10px] w-[10px] rounded-full bg-[color:var(--hhcp-action)]"
              />
              <h3 className="font-dm-sans text-[length:var(--hhcp-h4)] leading-[var(--hhcp-heading-lh)] font-medium text-[color:var(--hhcp-primary)]">
                {tile.title}
              </h3>
              <p className="font-dm-sans text-[length:var(--hhcp-text-s)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
                {tile.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Write RelatedServices**

Create `src/components/modules/RelatedServices.tsx`:

```tsx
import { Container } from "./Container";
import { ArrowRightIcon } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";
import type { LinkRef } from "./types";

/**
 * Related-service link cards, 2 to 3 across. 16 instances. This is the site's
 * internal-linking workhorse — the SEO silo structure depends on it.
 */
export function RelatedServices({
  heading,
  links,
}: {
  heading: string;
  links: readonly LinkRef[];
}) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
          {heading}
        </h2>
        <div className="mt-[var(--hhcp-space-l)] grid grid-cols-3 gap-[var(--hhcp-content-gap)] max-[991px]:grid-cols-2 max-[767px]:grid-cols-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-[var(--hhcp-space-xs)] rounded-[var(--hhcp-radius-l)] border border-[color:var(--hhcp-base-10)] p-[var(--hhcp-space-m)] transition-all duration-300 hover:border-[color:var(--hhcp-action-dark)]"
            >
              <span className="flex items-center gap-2 font-dm-sans text-[length:var(--hhcp-h4)] font-medium text-[color:var(--hhcp-primary)]">
                {link.label}
                <ArrowRightIcon className="h-4 w-4" />
              </span>
              {link.body ? (
                <span className="font-dm-sans text-[length:var(--hhcp-text-s)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
                  {link.body}
                </span>
              ) : null}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test:run src/components/modules/card-modules.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 7: Commit**

```bash
git add src/components/modules/Steps.tsx src/components/modules/FeatureTiles.tsx src/components/modules/RelatedServices.tsx src/components/modules/card-modules.test.tsx
git commit -m "feat: add Steps, FeatureTiles and RelatedServices modules"
```

---

## Task 10: Conversion and callout modules

**Files:**
- Create: `src/components/modules/InlineCta.tsx`
- Create: `src/components/modules/PricingCue.tsx`
- Create: `src/components/modules/SafetyCallout.tsx`
- Create: `src/components/modules/DisclosureCallout.tsx`
- Test: `src/components/modules/callout-modules.test.tsx`

**Interfaces:**
- Consumes: `LinkRef` from `./types`; `formatPrice`, `PRICES` from `@/content/pricing`; `EMERGENCY_CONTACTS` from `@/content/clinic`
- Produces: `<InlineCta heading body links>`, `<PricingCue heading body priceKey note>`, `<SafetyCallout heading body>`, `<DisclosureCallout heading body link>`

- [ ] **Step 1: Write the failing test**

Create `src/components/modules/callout-modules.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InlineCta } from "./InlineCta";
import { PricingCue } from "./PricingCue";
import { SafetyCallout } from "./SafetyCallout";
import { DisclosureCallout } from "./DisclosureCallout";

describe("InlineCta", () => {
  it("renders every link", () => {
    render(
      <InlineCta
        body="New here?"
        links={[
          { label: "How it works", href: "/how-it-works/" },
          { label: "Pricing", href: "/pricing/" },
        ]}
      />,
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});

describe("PricingCue", () => {
  it("renders the formatted price for its key", () => {
    render(
      <PricingCue
        heading="Straightforward pricing"
        body="The pre-screening quiz is free."
        priceKey="firstConsult"
      />,
    );
    expect(screen.getByText("$59")).toBeInTheDocument();
  });

  it("marks provisional prices so unconfirmed figures cannot ship silently", () => {
    const { container } = render(
      <PricingCue heading="H" body="b" priceKey="weightManagement" />,
    );
    expect(container.querySelector("[data-provisional='true']")).not.toBeNull();
  });

  it("links through to the full pricing page", () => {
    render(<PricingCue heading="H" body="b" priceKey="firstConsult" />);
    expect(screen.getByRole("link", { name: /full pricing/i })).toHaveAttribute(
      "href",
      "/pricing/",
    );
  });
});

describe("SafetyCallout", () => {
  it("renders every emergency contact as a dialable link", () => {
    render(
      <SafetyCallout
        heading="If this is an emergency"
        body="Telehealth is not for emergencies."
      />,
    );
    expect(screen.getByRole("link", { name: /000/ })).toHaveAttribute(
      "href",
      "tel:000",
    );
    expect(screen.getByRole("link", { name: /13 11 14/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /1300 22 4636/ })).toBeInTheDocument();
  });
});

describe("DisclosureCallout", () => {
  it("renders the link through to the disclosure page", () => {
    render(
      <DisclosureCallout
        heading="How we work with pharmacies"
        body="We disclose our arrangements."
        link={{ label: "Read the disclosure", href: "/conflict-of-interest-disclosure/" }}
      />,
    );
    expect(
      screen.getByRole("link", { name: "Read the disclosure" }),
    ).toHaveAttribute("href", "/conflict-of-interest-disclosure/");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/components/modules/callout-modules.test.tsx`
Expected: FAIL — `Failed to resolve import "./InlineCta"`.

- [ ] **Step 3: Write InlineCta**

Create `src/components/modules/InlineCta.tsx`:

```tsx
import { Container } from "./Container";
import type { LinkRef } from "./types";

/** Inline CTA + related links. 16 instances — the mid-page nudge. */
export function InlineCta({
  heading,
  body,
  links,
}: {
  heading?: string;
  body: string;
  links: readonly LinkRef[];
}) {
  return (
    <section className="py-[var(--hhcp-section-space-s)] px-[var(--hhcp-gutter)]">
      <Container>
        <div className="flex flex-col gap-[var(--hhcp-space-s)] rounded-[var(--hhcp-radius-l)] bg-[color:var(--hhcp-accent)] p-[var(--hhcp-space-l)]">
          {heading ? (
            <h2 className="font-dm-sans text-[length:var(--hhcp-h3)] leading-[var(--hhcp-heading-lh)] font-normal text-[color:var(--hhcp-primary)]">
              {heading}
            </h2>
          ) : null}
          <p className="font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
            {body}
          </p>
          <div className="flex flex-wrap gap-[var(--hhcp-space-s)]">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="hhcp-btn">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Write PricingCue**

Create `src/components/modules/PricingCue.tsx`:

```tsx
import { Container } from "./Container";
import { PRICES, formatPrice, type PriceKey } from "@/content/pricing";

/**
 * Pricing cue card. 8 instances.
 *
 * Reads from the single pricing source rather than carrying its own figure, so
 * the outstanding client confirmations resolve in one edit. `data-provisional`
 * marks any figure not yet confirmed in writing — a review hook, not a visual.
 */
export function PricingCue({
  heading,
  body,
  priceKey,
  note,
}: {
  heading: string;
  body: string;
  priceKey: PriceKey;
  note?: string;
}) {
  const price = PRICES[priceKey];
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <div
          data-provisional={price.provisional}
          className="flex flex-col gap-[var(--hhcp-space-s)] rounded-[var(--hhcp-radius-l)] border border-[color:var(--hhcp-base-20)] p-[var(--hhcp-space-l)]"
        >
          <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
            {heading}
          </h2>
          <p className="font-roboto-mono text-[length:var(--hhcp-h1)] leading-[var(--hhcp-heading-lh)] font-medium text-[color:var(--hhcp-primary)]">
            {formatPrice(priceKey)}
          </p>
          <p className="font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
            {body}
          </p>
          {note ? (
            <p className="font-dm-sans text-[length:var(--hhcp-text-xs)] text-[color:var(--hhcp-base-60)]">
              {note}
            </p>
          ) : null}
          <a href="/pricing/" className="hhcp-btn self-start">
            See full pricing
          </a>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Write SafetyCallout**

Create `src/components/modules/SafetyCallout.tsx`:

```tsx
import { Container } from "./Container";
import { EMERGENCY_CONTACTS } from "@/content/clinic";

/**
 * Highlighted safety callout. 6 instances.
 *
 * The emergency numbers come from the shared constant rather than page copy:
 * these must be identical everywhere they appear and must never be edited by
 * accident on one page.
 */
export function SafetyCallout({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <section className="py-[var(--hhcp-section-space-s)] px-[var(--hhcp-gutter)]">
      <Container>
        <div
          role="note"
          className="flex flex-col gap-[var(--hhcp-space-s)] rounded-[var(--hhcp-radius-l)] border-2 border-[color:var(--hhcp-action-dark)] bg-[color:var(--hhcp-light-green)] p-[var(--hhcp-space-l)]"
        >
          <h2 className="font-dm-sans text-[length:var(--hhcp-h3)] leading-[var(--hhcp-heading-lh)] font-medium text-[color:var(--hhcp-primary)]">
            {heading}
          </h2>
          <p className="font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-primary)]">
            {body}
          </p>
          <ul className="flex flex-wrap gap-[var(--hhcp-space-m)]">
            {EMERGENCY_CONTACTS.map((contact) => (
              <li key={contact.number}>
                <a
                  href={contact.href}
                  className="font-dm-sans text-[length:var(--hhcp-text-m)] font-medium text-[color:var(--hhcp-primary)] underline"
                >
                  {contact.label}: {contact.number}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 6: Write DisclosureCallout**

Create `src/components/modules/DisclosureCallout.tsx`:

```tsx
import { Container } from "./Container";
import type { LinkRef } from "./types";

/**
 * Callout box linking to the conflict-of-interest / pharmacy disclosure page.
 * One instance, on the Medicinal Cannabis page, where the disclosure is a
 * regulatory expectation rather than a nicety.
 */
export function DisclosureCallout({
  heading,
  body,
  link,
}: {
  heading: string;
  body: string;
  link: LinkRef;
}) {
  return (
    <section className="py-[var(--hhcp-section-space-s)] px-[var(--hhcp-gutter)]">
      <Container>
        <div className="flex flex-col gap-[var(--hhcp-space-xs)] rounded-[var(--hhcp-radius-m)] bg-[color:var(--hhcp-neutral-ultra-light)] p-[var(--hhcp-space-m)]">
          <h2 className="font-dm-sans text-[length:var(--hhcp-h4)] font-medium text-[color:var(--hhcp-primary)]">
            {heading}
          </h2>
          <p className="font-dm-sans text-[length:var(--hhcp-text-s)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
            {body}
          </p>
          <a
            href={link.href}
            className="font-dm-sans text-[length:var(--hhcp-text-s)] font-medium text-[color:var(--hhcp-action-dark)] underline"
          >
            {link.label}
          </a>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npm run test:run src/components/modules/callout-modules.test.tsx`
Expected: PASS, 6 tests.

- [ ] **Step 8: Commit**

```bash
git add src/components/modules/InlineCta.tsx src/components/modules/PricingCue.tsx src/components/modules/SafetyCallout.tsx src/components/modules/DisclosureCallout.tsx src/components/modules/callout-modules.test.tsx
git commit -m "feat: add InlineCta, PricingCue, SafetyCallout and DisclosureCallout modules"
```

---

## Task 11: Practitioner and contact modules

**Files:**
- Create: `src/components/modules/PractitionerCards.tsx`
- Create: `src/components/modules/ContactBlock.tsx`
- Test: `src/components/modules/people-modules.test.tsx`

**Interfaces:**
- Consumes: `Practitioner` from `./types`; `CLINIC` from `@/content/clinic`
- Produces: `<PractitionerCards heading practitioners>`, `<ContactBlock heading>`

**Compliance note:** `PractitionerCards` renders the AHPRA registration number for every practitioner. Clause 6.5 requires it on all practitioner-identifying content. The component therefore treats a missing number as a visible defect rather than rendering silently.

`ContactBlock` renders the contact details and a form *shell*. The submit handler is wired in Phase 2 with the rest of the webhook work; in this phase the form calls `preventDefault()`, matching how every form in the cloned homepage currently behaves.

- [ ] **Step 1: Write the failing test**

Create `src/components/modules/people-modules.test.tsx`:

```tsx
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
    // Clause 6.5 requires the number on all practitioner-identifying content.
    // Silence here would let a non-compliant page ship unnoticed.
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/components/modules/people-modules.test.tsx`
Expected: FAIL — `Failed to resolve import "./PractitionerCards"`.

- [ ] **Step 3: Write PractitionerCards**

Create `src/components/modules/PractitionerCards.tsx`:

```tsx
import Image from "next/image";
import { Container } from "./Container";
import type { Practitioner } from "./types";

/**
 * Practitioner profile cards.
 *
 * Clause 6.5 of the Service Agreement requires the AHPRA registration number on
 * all practitioner-identifying content. A missing number renders a visible
 * placeholder and sets `data-ahpra-missing`, so an incomplete profile cannot
 * ship quietly.
 */
export function PractitionerCards({
  heading,
  practitioners,
}: {
  heading: string;
  practitioners: readonly Practitioner[];
}) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
          {heading}
        </h2>
        <div className="mt-[var(--hhcp-space-l)] grid grid-cols-3 gap-[var(--hhcp-content-gap)] max-[991px]:grid-cols-2 max-[767px]:grid-cols-1">
          {practitioners.map((person) => {
            const missing = person.ahpraNumber.trim() === "";
            return (
              <article
                key={person.name}
                data-ahpra-missing={missing}
                className="flex flex-col gap-[var(--hhcp-space-xs)] rounded-[var(--hhcp-radius-l)] border border-[color:var(--hhcp-base-10)] p-[var(--hhcp-space-m)]"
              >
                {person.photo ? (
                  <Image
                    src={person.photo.src}
                    alt={person.photo.alt}
                    width={person.photo.width}
                    height={person.photo.height}
                    className="h-auto w-full rounded-[var(--hhcp-radius-m)] object-cover"
                  />
                ) : null}
                <h3 className="font-dm-sans text-[length:var(--hhcp-h4)] font-medium text-[color:var(--hhcp-primary)]">
                  {person.name}
                </h3>
                <p className="font-dm-sans text-[length:var(--hhcp-text-s)] text-[color:var(--hhcp-base-80)]">
                  {person.title}
                </p>
                <p className="font-roboto-mono text-[length:var(--hhcp-text-xs)] text-[color:var(--hhcp-base-60)]">
                  {missing
                    ? "AHPRA registration number required before publication"
                    : `AHPRA: ${person.ahpraNumber}`}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {person.focusAreas.map((area) => (
                    <li
                      key={area}
                      className="rounded-[var(--hhcp-radius-pill)] bg-[color:var(--hhcp-accent)] px-3 py-1 font-dm-sans text-[length:var(--hhcp-text-xs)] text-[color:var(--hhcp-primary)]"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Write ContactBlock**

Create `src/components/modules/ContactBlock.tsx`:

```tsx
"use client";

import { Container } from "./Container";
import { CLINIC } from "@/content/clinic";

/**
 * Contact details beside an enquiry form.
 *
 * The form does not submit in this phase. Wiring it to `/api/submit` is Phase 2
 * work — under Clause 1.2 a consultation request via a website form counts
 * toward the Patient Quota, so this form becomes a countable event and must post
 * server-side before it can be considered done.
 */
export function ContactBlock({ heading }: { heading: string }) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <div className="grid grid-cols-2 gap-[var(--hhcp-space-xl)] max-[991px]:grid-cols-1">
          <div className="flex flex-col gap-[var(--hhcp-space-s)]">
            <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
              {heading}
            </h2>
            <a
              href={CLINIC.phoneHref}
              className="font-dm-sans text-[length:var(--hhcp-text-l)] font-medium text-[color:var(--hhcp-primary)]"
            >
              {CLINIC.phone}
            </a>
            <a
              href={CLINIC.emailHref}
              className="font-dm-sans text-[length:var(--hhcp-text-m)] text-[color:var(--hhcp-base-80)]"
            >
              {CLINIC.email}
            </a>
            <p className="font-dm-sans text-[length:var(--hhcp-text-s)] text-[color:var(--hhcp-base-60)]">
              {CLINIC.serviceArea} · {CLINIC.hours}
            </p>
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="flex flex-col gap-[var(--hhcp-space-s)]"
          >
            <Field id="firstName" label="First name" />
            <Field id="lastName" label="Last name" />
            <Field id="email" label="Email" type="email" />
            <Field id="phone" label="Phone" type="tel" />
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="font-dm-sans text-[length:var(--hhcp-text-s)] text-[color:var(--hhcp-primary)]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="rounded-[var(--hhcp-radius-s)] border border-[color:var(--hhcp-base-20)] p-3 font-dm-sans text-[length:var(--hhcp-text-s)]"
              />
            </div>
            <button type="submit" className="hhcp-btn self-start">
              Send enquiry
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
}: {
  id: string;
  label: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-dm-sans text-[length:var(--hhcp-text-s)] text-[color:var(--hhcp-primary)]"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="rounded-[var(--hhcp-radius-s)] border border-[color:var(--hhcp-base-20)] p-3 font-dm-sans text-[length:var(--hhcp-text-s)]"
      />
    </div>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:run src/components/modules/people-modules.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/modules/PractitionerCards.tsx src/components/modules/ContactBlock.tsx src/components/modules/people-modules.test.tsx
git commit -m "feat: add PractitionerCards and ContactBlock modules

PractitionerCards surfaces a missing AHPRA number rather than rendering
silently — Clause 6.5 requires it on all practitioner-identifying content."
```

---

## Task 12: ModuleRenderer

**Files:**
- Create: `src/components/modules/ModuleRenderer.tsx`
- Test: `src/components/modules/ModuleRenderer.test.tsx`

**Interfaces:**
- Consumes: every module component from Tasks 8–11; `ModuleSpec` from `./types`
- Produces: `<ModuleRenderer modules={ModuleSpec[]} />` — the single dispatch point the `ServicePage` template (Phase 3) will use.

- [ ] **Step 1: Write the failing test**

Create `src/components/modules/ModuleRenderer.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ModuleRenderer } from "./ModuleRenderer";
import type { ModuleSpec } from "./types";

describe("ModuleRenderer", () => {
  it("renders modules in the order given", () => {
    const modules: ModuleSpec[] = [
      { kind: "intro", text: "Lead paragraph." },
      {
        kind: "checklist",
        heading: "Who it may suit",
        items: ["Item one."],
      },
    ];
    const { container } = render(<ModuleRenderer modules={modules} />);
    const sections = container.querySelectorAll("section");
    expect(sections).toHaveLength(2);
    expect(sections[0].textContent).toContain("Lead paragraph.");
    expect(sections[1].textContent).toContain("Who it may suit");
  });

  it("dispatches each kind to its component", () => {
    const modules: ModuleSpec[] = [
      { kind: "steps", heading: "How it works", steps: [{ title: "Step one", body: "b" }] },
      { kind: "pricingCue", heading: "Cost", body: "b", priceKey: "firstConsult" },
    ];
    render(<ModuleRenderer modules={modules} />);
    expect(screen.getByRole("heading", { level: 3, name: "Step one" })).toBeInTheDocument();
    expect(screen.getByText("$59")).toBeInTheDocument();
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<ModuleRenderer modules={[]} />);
    expect(container.querySelectorAll("section")).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/components/modules/ModuleRenderer.test.tsx`
Expected: FAIL — `Failed to resolve import "./ModuleRenderer"`.

- [ ] **Step 3: Write the renderer**

Create `src/components/modules/ModuleRenderer.tsx`:

```tsx
import { Intro } from "./Intro";
import { TextImage } from "./TextImage";
import { Checklist } from "./Checklist";
import { Steps } from "./Steps";
import { FeatureTiles } from "./FeatureTiles";
import { RelatedServices } from "./RelatedServices";
import { InlineCta } from "./InlineCta";
import { PricingCue } from "./PricingCue";
import { SafetyCallout } from "./SafetyCallout";
import { DisclosureCallout } from "./DisclosureCallout";
import { PractitionerCards } from "./PractitionerCards";
import { ContactBlock } from "./ContactBlock";
import type { ModuleSpec } from "./types";

/**
 * Dispatches a page's ordered middle sections to their components.
 *
 * The switch is exhaustive over `ModuleSpec`. Adding a member to the union
 * without adding a case here is a type error, which is the point: the vocabulary
 * and the renderer cannot drift.
 */
export function ModuleRenderer({ modules }: { modules: readonly ModuleSpec[] }) {
  return (
    <>
      {modules.map((module, index) => (
        <Module key={`${module.kind}-${index}`} module={module} />
      ))}
    </>
  );
}

function Module({ module }: { module: ModuleSpec }) {
  switch (module.kind) {
    case "intro":
      return <Intro text={module.text} />;
    case "textImage":
      return (
        <TextImage
          heading={module.heading}
          body={module.body}
          image={module.image}
          imageSide={module.imageSide}
        />
      );
    case "checklist":
      return (
        <Checklist
          heading={module.heading}
          intro={module.intro}
          items={module.items}
          outro={module.outro}
        />
      );
    case "steps":
      return <Steps heading={module.heading} steps={module.steps} />;
    case "featureTiles":
      return <FeatureTiles heading={module.heading} tiles={module.tiles} />;
    case "relatedServices":
      return <RelatedServices heading={module.heading} links={module.links} />;
    case "inlineCta":
      return (
        <InlineCta heading={module.heading} body={module.body} links={module.links} />
      );
    case "pricingCue":
      return (
        <PricingCue
          heading={module.heading}
          body={module.body}
          priceKey={module.priceKey}
          note={module.note}
        />
      );
    case "safetyCallout":
      return <SafetyCallout heading={module.heading} body={module.body} />;
    case "disclosureCallout":
      return (
        <DisclosureCallout
          heading={module.heading}
          body={module.body}
          link={module.link}
        />
      );
    case "practitionerCards":
      return (
        <PractitionerCards
          heading={module.heading}
          practitioners={module.practitioners}
        />
      );
    case "contactBlock":
      return <ContactBlock heading={module.heading} />;
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:run src/components/modules/ModuleRenderer.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 5: Verify the switch is exhaustive**

Run: `npm run typecheck`
Expected: no errors. If a union member has no case, TypeScript reports the missing return path here.

- [ ] **Step 6: Commit**

```bash
git add src/components/modules/ModuleRenderer.tsx src/components/modules/ModuleRenderer.test.tsx
git commit -m "feat: add ModuleRenderer with exhaustive ModuleSpec dispatch"
```

---

## Task 13: Frame modules — TrustBar, PageHero, ClosingCta

**Files:**
- Create: `src/components/modules/TrustBar.tsx`
- Create: `src/components/modules/PageHero.tsx`
- Create: `src/components/modules/ClosingCta.tsx`
- Test: `src/components/modules/frame-modules.test.tsx`

**Interfaces:**
- Consumes: `CLINIC`, `TRUST_BAR_DEFAULT` from `@/content/clinic`; `Container`
- Produces: `<TrustBar items?>`, `<PageHero h1 intro>`, `<ClosingCta heading body>`

These three plus the existing `FaqSection` are the fixed frame every service page opens and closes with (spec §4.2). `PageHero` is the inner-page hero — the video hero on the homepage stays as `HeroSection` in the cloned components.

- [ ] **Step 1: Write the failing test**

Create `src/components/modules/frame-modules.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrustBar } from "./TrustBar";
import { PageHero } from "./PageHero";
import { ClosingCta } from "./ClosingCta";

describe("TrustBar", () => {
  it("renders the five default items when none are given", () => {
    render(<TrustBar />);
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("renders page-specific items when supplied", () => {
    render(<TrustBar items={["One", "Two"]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});

describe("PageHero", () => {
  it("renders the page h1", () => {
    render(<PageHero h1="Peptides for weight loss" intro="Guided by practitioners." />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Peptides for weight loss" }),
    ).toBeInTheDocument();
  });

  it("links the primary CTA to the quiz and offers tap-to-call", () => {
    render(<PageHero h1="H" intro="i" />);
    expect(screen.getByRole("link", { name: /Book a consultation/i })).toHaveAttribute(
      "href",
      "/quiz/",
    );
    expect(screen.getByRole("link", { name: /1300 336 572/ })).toHaveAttribute(
      "href",
      "tel:1300336572",
    );
  });
});

describe("ClosingCta", () => {
  it("drives to the quiz and the phone number", () => {
    render(
      <ClosingCta
        heading="Ready to talk to a practitioner?"
        body="Start with the free pre-screening quiz."
      />,
    );
    expect(screen.getByRole("link", { name: /Start the free quiz/i })).toHaveAttribute(
      "href",
      "/quiz/",
    );
    expect(screen.getByRole("link", { name: /1300 336 572/ })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/components/modules/frame-modules.test.tsx`
Expected: FAIL — `Failed to resolve import "./TrustBar"`.

- [ ] **Step 3: Write TrustBar**

Create `src/components/modules/TrustBar.tsx`:

```tsx
import { Container } from "./Container";
import { TRUST_BAR_DEFAULT } from "@/content/clinic";

/**
 * The five-item trust strip that repeats under most hero sections. 24 instances.
 * Pages override the items where the content doc gives them a service-specific
 * variant (e.g. the weight-loss page swaps in "Ongoing review, not one-off scripts").
 */
export function TrustBar({ items = TRUST_BAR_DEFAULT }: { items?: readonly string[] }) {
  return (
    <section className="bg-[color:var(--hhcp-accent)] py-[var(--hhcp-space-s)] px-[var(--hhcp-gutter)]">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-[var(--hhcp-space-m)] gap-y-2">
          {items.map((item) => (
            <li
              key={item}
              className="font-dm-sans text-[length:var(--hhcp-text-xs)] text-[color:var(--hhcp-primary)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Write PageHero**

Create `src/components/modules/PageHero.tsx`:

```tsx
import { Container } from "./Container";
import { CLINIC } from "@/content/clinic";

/**
 * Inner-page hero: H1 + intro line + primary CTA + quiz link + tap-to-call.
 * 31 instances — one per page. The homepage keeps its video hero (`HeroSection`
 * in the cloned components); this is the flat variant every other page uses.
 */
export function PageHero({ h1, intro }: { h1: string; intro: string }) {
  return (
    <section className="bg-[color:var(--hhcp-primary)] pt-[calc(124px+var(--hhcp-section-space-m))] pb-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <div className="flex max-w-[880px] flex-col gap-[var(--hhcp-space-m)]">
          <h1 className="font-dm-sans text-[length:var(--hhcp-h1)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.64px] text-[color:var(--hhcp-white)]">
            {h1}
          </h1>
          <p className="font-dm-sans text-[length:var(--hhcp-text-l)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-action-light)]">
            {intro}
          </p>
          <div className="flex flex-wrap items-center gap-[var(--hhcp-space-s)]">
            <a href="/quiz/" className="hhcp-btn">
              Book a consultation
            </a>
            <a
              href="/quiz/"
              className="font-dm-sans text-[length:var(--hhcp-text-s)] text-[color:var(--hhcp-action)] underline"
            >
              Take the free pre-screening quiz
            </a>
            <a
              href={CLINIC.phoneHref}
              className="font-dm-sans text-[length:var(--hhcp-text-s)] text-[color:var(--hhcp-white)]"
            >
              {CLINIC.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

Note the `pt-[calc(124px+…)]`: the header is an absolutely-positioned overlay 124px tall (PAGE_TOPOLOGY.md), so inner pages must reserve that space themselves. The homepage does not, because its video hero sits under the overlay by design.

- [ ] **Step 5: Write ClosingCta**

Create `src/components/modules/ClosingCta.tsx`:

```tsx
import { Container } from "./Container";
import { CLINIC } from "@/content/clinic";

/**
 * The standard closing CTA band. 29 instances — every page but the quiz itself.
 * The sticky mobile CTA bar that the content doc pairs with this lives in the
 * layout, not here, so it renders once per page rather than once per band.
 */
export function ClosingCta({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <section className="bg-[color:var(--hhcp-dark)] py-[var(--hhcp-section-space-l)] px-[var(--hhcp-gutter)]">
      <Container>
        <div className="flex max-w-[720px] flex-col gap-[var(--hhcp-space-m)]">
          <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-white)]">
            {heading}
          </h2>
          <p className="font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-action-light)]">
            {body}
          </p>
          <div className="flex flex-wrap gap-[var(--hhcp-space-s)]">
            <a href="/quiz/" className="hhcp-btn">
              Start the free quiz
            </a>
            <a
              href={CLINIC.phoneHref}
              className="font-dm-sans text-[length:var(--hhcp-text-s)] font-medium text-[color:var(--hhcp-action)] underline"
            >
              Call {CLINIC.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm run test:run src/components/modules/frame-modules.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 7: Commit**

```bash
git add src/components/modules/TrustBar.tsx src/components/modules/PageHero.tsx src/components/modules/ClosingCta.tsx src/components/modules/frame-modules.test.tsx
git commit -m "feat: add TrustBar, PageHero and ClosingCta frame modules"
```

---

## Task 14: Navigation and footer data

**Files:**
- Create: `src/content/nav.ts`
- Create: `src/content/footer.ts`
- Test: `src/content/nav.test.ts`

**Interfaces:**
- Consumes: `isGated` from `@/content/routes`; `CLINIC` from `@/content/clinic`
- Produces: `NAV_ITEMS: readonly NavItem[]`, `visibleNavItems(): NavItem[]`, `type NavItem = { label: string; href: string; children?: readonly NavChild[] }`, `FOOTER_COLUMNS: readonly FooterColumn[]`, `visibleFooterColumns(): FooterColumn[]`.

**Why the `visible*` helpers:** gated routes must not appear in navigation (spec §7). Filtering happens here, once, rather than in the header and footer components separately.

- [ ] **Step 1: Write the failing test**

Create `src/content/nav.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { NAV_ITEMS, visibleNavItems } from "./nav";
import { FOOTER_COLUMNS, visibleFooterColumns } from "./footer";

describe("NAV_ITEMS", () => {
  it("leads with the four service silos", () => {
    expect(NAV_ITEMS.slice(0, 4).map((item) => item.label)).toEqual([
      "Weight Loss & Peptides",
      "Men's Health",
      "Women's Health",
      "Online Doctor",
    ]);
  });

  it("gives every service dropdown an overview link to its own hub", () => {
    for (const item of NAV_ITEMS.slice(0, 4)) {
      expect(item.children?.[0].href).toBe(item.href);
    }
  });
});

describe("visibleNavItems", () => {
  it("omits gated destinations", () => {
    const hrefs = visibleNavItems().flatMap((item) => [
      item.href,
      ...(item.children ?? []).map((child) => child.href),
    ]);
    expect(hrefs).not.toContain("/medicinal-cannabis/");
    expect(hrefs).not.toContain("/our-practitioners/");
  });
});

describe("FOOTER_COLUMNS", () => {
  it("has the five columns from the sitemap document", () => {
    expect(FOOTER_COLUMNS).toHaveLength(5);
    expect(FOOTER_COLUMNS.map((column) => column.title)).toEqual([
      "Horizon Health Care Partners",
      "Our Services",
      "Patients",
      "About & Trust",
      "Newsletter",
    ]);
  });
});

describe("visibleFooterColumns", () => {
  it("omits gated links but keeps every column", () => {
    const columns = visibleFooterColumns();
    expect(columns).toHaveLength(5);
    const hrefs = columns.flatMap((column) =>
      column.links.map((link) => link.href),
    );
    expect(hrefs).not.toContain("/medicinal-cannabis/");
    expect(hrefs).not.toContain("/our-practitioners/");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/content/nav.test.ts`
Expected: FAIL — `Failed to resolve import "./nav"`.

- [ ] **Step 3: Write nav.ts**

Create `src/content/nav.ts`:

```ts
/**
 * Header navigation, per HHCPA_Sitemap_and_Navigation.pdf §3.
 *
 * The menu leads with the service areas because that is what most patients are
 * looking for. Gated destinations are filtered out by `visibleNavItems()` rather
 * than being commented out here, so publishing is a single flag flip in the
 * route registry.
 */
import { isGated } from "./routes";

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: readonly NavChild[];
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "Weight Loss & Peptides",
    href: "/weight-loss-peptides/",
    children: [
      { label: "Weight Loss & Peptides", href: "/weight-loss-peptides/" },
      { label: "Weight Loss Injections", href: "/weight-loss-peptides/weight-loss-injections/" },
      { label: "Medical Weight Loss Program", href: "/weight-loss-peptides/medical-weight-loss-program/" },
    ],
  },
  {
    label: "Men's Health",
    href: "/mens-health/",
    children: [
      { label: "Men's Health", href: "/mens-health/" },
      { label: "Erectile Dysfunction Treatment", href: "/mens-health/erectile-dysfunction-treatment/" },
      { label: "Testosterone Replacement Therapy", href: "/mens-health/testosterone-replacement-therapy/" },
      { label: "Premature Ejaculation Treatment", href: "/mens-health/premature-ejaculation-treatment/" },
      { label: "Hair Loss Treatment", href: "/mens-health/hair-loss-treatment/" },
    ],
  },
  {
    label: "Women's Health",
    href: "/womens-health/",
    children: [
      { label: "Women's Health", href: "/womens-health/" },
      { label: "Menopause Treatment", href: "/womens-health/menopause-treatment/" },
      { label: "PCOS Management", href: "/womens-health/pcos-management/" },
      { label: "Contraception & Sexual Health", href: "/womens-health/contraception/" },
    ],
  },
  {
    label: "Online Doctor",
    href: "/online-doctor/",
    children: [
      { label: "Online Doctor", href: "/online-doctor/" },
      { label: "Online Prescriptions", href: "/online-doctor/online-prescriptions/" },
      { label: "Medical Certificates", href: "/online-doctor/medical-certificates/" },
      { label: "Pathology & Imaging Referrals", href: "/online-doctor/pathology-imaging-referrals/" },
      { label: "Specialist Referrals", href: "/online-doctor/specialist-referrals/" },
      { label: "Mental Health Support", href: "/online-doctor/mental-health/" },
    ],
  },
  // Added to the nav on compliance sign-off; filtered out until then.
  { label: "Medicinal Cannabis", href: "/medicinal-cannabis/" },
  { label: "How It Works", href: "/how-it-works/" },
  { label: "Pricing", href: "/pricing/" },
  {
    label: "About",
    href: "/about-us/",
    children: [
      { label: "About Us", href: "/about-us/" },
      { label: "Our Practitioners", href: "/our-practitioners/" },
      { label: "Knowledge Hub", href: "/articles/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
] as const;

export function visibleNavItems(): NavItem[] {
  return NAV_ITEMS.filter((item) => !isGated(item.href)).map((item) => ({
    ...item,
    children: item.children?.filter((child) => !isGated(child.href)),
  }));
}
```

- [ ] **Step 4: Write footer.ts**

Create `src/content/footer.ts`:

```ts
/**
 * Footer structure, per HHCPA_Sitemap_and_Navigation.pdf §4.
 *
 * Column 1 is rendered from CLINIC rather than declared here, since it is the
 * NAP block. Column 5 is the newsletter form, which has no links.
 */
import { isGated } from "./routes";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: readonly FooterLink[];
}

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  { title: "Horizon Health Care Partners", links: [] },
  {
    title: "Our Services",
    links: [
      { label: "Weight Loss & Peptides", href: "/weight-loss-peptides/" },
      { label: "Men's Health", href: "/mens-health/" },
      { label: "Women's Health", href: "/womens-health/" },
      { label: "Medicinal Cannabis", href: "/medicinal-cannabis/" },
      { label: "Online Doctor", href: "/online-doctor/" },
      { label: "Mental Health Support", href: "/online-doctor/mental-health/" },
    ],
  },
  {
    title: "Patients",
    links: [
      { label: "How It Works", href: "/how-it-works/" },
      { label: "Pricing", href: "/pricing/" },
      { label: "Pre-Screening Quiz", href: "/quiz/" },
      { label: "Transfer Your Care", href: "/discharge/" },
      { label: "Patient Portal", href: "https://escript.link/" },
      { label: "FAQs", href: "/faqs/" },
    ],
  },
  {
    title: "About & Trust",
    links: [
      { label: "About Us", href: "/about-us/" },
      { label: "Our Practitioners", href: "/our-practitioners/" },
      { label: "Contact", href: "/contact/" },
      { label: "Knowledge Hub", href: "/articles/" },
      { label: "Patient Safety & Emergencies", href: "/patient-safety/" },
      { label: "Complaints", href: "/complaints/" },
    ],
  },
  { title: "Newsletter", links: [] },
] as const;

export const FOOTER_BAR_LINKS: readonly FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy/" },
  { label: "Terms & Conditions", href: "/terms-and-conditions/" },
  {
    label: "Conflict of Interest & Pharmacy Disclosure",
    href: "/conflict-of-interest-disclosure/",
  },
] as const;

export function visibleFooterColumns(): FooterColumn[] {
  return FOOTER_COLUMNS.map((column) => ({
    ...column,
    links: column.links.filter((link) => !isGated(link.href)),
  }));
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:run src/content/nav.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add src/content/nav.ts src/content/footer.ts src/content/nav.test.ts
git commit -m "feat: add nav and footer structures with gated-route filtering"
```

---

## Task 15: Sticky mobile CTA bar and site disclaimer

**Files:**
- Create: `src/components/layout/StickyMobileCta.tsx`
- Create: `src/components/layout/SiteDisclaimer.tsx`
- Test: `src/components/layout/layout-parts.test.tsx`

**Interfaces:**
- Consumes: `CLINIC`, `SITE_DISCLAIMER` from `@/content/clinic`
- Produces: `<StickyMobileCta />`, `<SiteDisclaimer />`

The sticky bar pairs with the closing CTA band on 29 pages. Rendering it from the layout means one instance per page regardless of how many CTA bands a page carries.

**Note:** this is `position: fixed` on the viewport, not a scroll listener. AGENTS.md forbids scroll listeners and IntersectionObservers; this component adds neither.

- [ ] **Step 1: Write the failing test**

Create `src/components/layout/layout-parts.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StickyMobileCta } from "./StickyMobileCta";
import { SiteDisclaimer } from "./SiteDisclaimer";

describe("StickyMobileCta", () => {
  it("offers book and tap-to-call actions", () => {
    render(<StickyMobileCta />);
    expect(screen.getByRole("link", { name: /Book/i })).toHaveAttribute(
      "href",
      "/quiz/",
    );
    expect(screen.getByRole("link", { name: /Call/i })).toHaveAttribute(
      "href",
      "tel:1300336572",
    );
  });

  it("is hidden above the 767px breakpoint", () => {
    const { container } = render(<StickyMobileCta />);
    expect(container.firstChild).toHaveClass("min-[768px]:hidden");
  });
});

describe("SiteDisclaimer", () => {
  it("renders the mandated disclaimer text", () => {
    render(<SiteDisclaimer />);
    expect(
      screen.getByText(/no treatment outcomes are guaranteed/),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/components/layout/layout-parts.test.tsx`
Expected: FAIL — `Failed to resolve import "./StickyMobileCta"`.

- [ ] **Step 3: Write StickyMobileCta**

Create `src/components/layout/StickyMobileCta.tsx`:

```tsx
import { CLINIC } from "@/content/clinic";

/**
 * Book + tap-to-call bar, fixed to the bottom of the viewport at ≤767px.
 *
 * The content doc pairs this with every closing CTA band (29 pages). Rendering
 * it from the layout gives one instance per page regardless of how many bands
 * the page carries.
 *
 * This is `position: fixed` only — no scroll listener, no IntersectionObserver.
 * See AGENTS.md.
 */
export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-[color:var(--hhcp-base-20)] bg-[color:var(--hhcp-white)] p-3 min-[768px]:hidden">
      <a href="/quiz/" className="hhcp-btn flex-1 text-center">
        Book a consultation
      </a>
      <a
        href={CLINIC.phoneHref}
        className="flex-1 rounded-[var(--hhcp-radius-pill)] border border-[color:var(--hhcp-primary)] py-3 text-center font-dm-sans text-[length:var(--hhcp-text-s)] font-medium text-[color:var(--hhcp-primary)]"
      >
        Call us
      </a>
    </div>
  );
}
```

- [ ] **Step 4: Write SiteDisclaimer**

Create `src/components/layout/SiteDisclaimer.tsx`:

```tsx
import { SITE_DISCLAIMER } from "@/content/clinic";

/**
 * The site-wide disclaimer.
 *
 * Required on every page by the content specification and by the Service
 * Agreement's compliant-claims obligations. It renders from the layout, not from
 * page data, so no page can omit it.
 */
export function SiteDisclaimer() {
  return (
    <div className="bg-[color:var(--hhcp-dark)] px-[var(--hhcp-gutter)] py-[var(--hhcp-space-m)]">
      <p className="hhcp-container font-dm-sans text-[length:var(--hhcp-text-xs)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-20)]">
        {SITE_DISCLAIMER}
      </p>
    </div>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:run src/components/layout/layout-parts.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/StickyMobileCta.tsx src/components/layout/SiteDisclaimer.tsx src/components/layout/layout-parts.test.tsx
git commit -m "feat: add sticky mobile CTA bar and site-wide disclaimer"
```

---

## Task 16: Restructure the header navigation

**Files:**
- Modify: `src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader.tsx`
- Test: `src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader.test.tsx`

**Interfaces:**
- Consumes: `visibleNavItems` from `@/content/nav`; `CLINIC` from `@/content/clinic`
- Produces: `<SiteHeader />` with the new five-silo structure

**What changes:** the existing header hard-codes `SERVICES_SUBMENU` and `NAV_ITEMS` pointing at absolute `https://www.horizonhealthcarepartners.com.au/...` URLs on the live WordPress site. Replace both with `visibleNavItems()` and relative paths. **Keep everything else** — the scoped `HEADER_CSS`, the drawer, the announcement bar, the absolute-overlay positioning. This is a data swap, not a redesign.

- [ ] **Step 1: Write the failing test**

Create `src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("uses relative paths, never the live WordPress domain", () => {
    const { container } = render(<SiteHeader />);
    const external = Array.from(container.querySelectorAll("a[href]")).filter((a) =>
      a.getAttribute("href")?.includes("horizonhealthcarepartners.com.au"),
    );
    expect(external).toHaveLength(0);
  });

  it("renders the four service silos", () => {
    render(<SiteHeader />);
    const nav = screen.getAllByRole("navigation")[0];
    for (const label of [
      "Weight Loss & Peptides",
      "Men's Health",
      "Women's Health",
      "Online Doctor",
    ]) {
      expect(within(nav).getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("omits gated destinations", () => {
    const { container } = render(<SiteHeader />);
    const hrefs = Array.from(container.querySelectorAll("a[href]")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).not.toContain("/medicinal-cannabis/");
    expect(hrefs).not.toContain("/our-practitioners/");
  });

  it("points the primary CTA at the quiz", () => {
    render(<SiteHeader />);
    expect(
      screen.getAllByRole("link", { name: /Book a consultation/i })[0],
    ).toHaveAttribute("href", "/quiz/");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader.test.tsx`
Expected: FAIL — the header still emits absolute `horizonhealthcarepartners.com.au` URLs.

- [ ] **Step 3: Replace the nav data in SiteHeader.tsx**

Delete the `SERVICES_SUBMENU` const, the `NAV_ITEMS` const, the local `NavItem` type and the `SITE` const. Replace them with:

```tsx
import { visibleNavItems, type NavItem } from "@/content/nav";
import { CLINIC } from "@/content/clinic";

const NAV_ITEMS: readonly NavItem[] = visibleNavItems();
const CTA = { label: "Book a consultation", href: "/quiz/" } as const;
```

Then update the three places `SITE` was used in the JSX:
- the announcement-bar link: `href={`${SITE}/quiz/`}` → `href="/quiz/"`
- the logo link: `href={SITE}` → `href="/"`
- add the phone number beside the CTA: `<a href={CLINIC.phoneHref}>{CLINIC.phone}</a>`

The dropdown-rendering JSX already handles `item.children`, so the four service silos render with no structural change. `servicesOpen` / `drawerServicesOpen` currently track a single dropdown by name; generalise them to hold the open item's `label` (`useState<string | null>(null)`) so all four dropdowns work independently.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:run src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 5: Verify the header still renders correctly**

Run: `npm run dev`, open `http://localhost:3000`, and check at 1534px and 375px that the header still overlays the hero, the pill nav is intact, and the drawer opens at ≤991px.

- [ ] **Step 6: Commit**

```bash
git add src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader.tsx src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader.test.tsx
git commit -m "refactor: drive header nav from the route registry

Four service dropdowns plus an About menu, relative paths instead of the live
WordPress domain, and gated destinations filtered out."
```

---

## Task 17: Restructure the footer

**Files:**
- Modify: `src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter.tsx`
- Test: `src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter.test.tsx`

**Interfaces:**
- Consumes: `visibleFooterColumns`, `FOOTER_BAR_LINKS` from `@/content/footer`; `CLINIC` from `@/content/clinic`
- Produces: `<SiteFooter />` with five columns and the NAP block

**What changes:** swap the hard-coded link lists for `visibleFooterColumns()`, render column 1 from `CLINIC` as the NAP block, and add the footer bar. Keep the existing scoped styles, the newsletter form (still `preventDefault()` — Phase 2 wires it) and the dark `#013126` ground.

- [ ] **Step 1: Write the failing test**

Create `src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("renders the NAP block with the legal entity and ABN", () => {
    render(<SiteFooter />);
    expect(
      screen.getByText(/Horizon Health Care Partners Pty Ltd/),
    ).toBeInTheDocument();
    expect(screen.getByText(/92 689 872 811/)).toBeInTheDocument();
  });

  it("renders the four link columns plus the newsletter", () => {
    render(<SiteFooter />);
    for (const title of ["Our Services", "Patients", "About & Trust", "Newsletter"]) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("renders the footer bar policy links", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy/",
    );
    expect(
      screen.getByRole("link", { name: /Conflict of Interest/ }),
    ).toHaveAttribute("href", "/conflict-of-interest-disclosure/");
  });

  it("omits gated destinations", () => {
    const { container } = render(<SiteFooter />);
    const hrefs = Array.from(container.querySelectorAll("a[href]")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).not.toContain("/medicinal-cannabis/");
    expect(hrefs).not.toContain("/our-practitioners/");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter.test.tsx`
Expected: FAIL — the footer has no NAP block and no policy bar.

- [ ] **Step 3: Rewrite the footer's content section**

Replace the hard-coded link data with:

```tsx
import { visibleFooterColumns, FOOTER_BAR_LINKS } from "@/content/footer";
import { CLINIC } from "@/content/clinic";

const COLUMNS = visibleFooterColumns();
```

Render column 1 (`"Horizon Health Care Partners"`, which has no links) as the NAP block:

```tsx
<div className="hhcp-ft__col">
  <h3 className="hhcp-ft__col-title">{CLINIC.name}</h3>
  <p>AHPRA-registered telehealth care, Australia-wide.</p>
  <p>{CLINIC.legalName} · ABN {CLINIC.abn}</p>
  <p>
    <a href={CLINIC.phoneHref}>{CLINIC.phone}</a> ·{" "}
    <a href={CLINIC.emailHref}>{CLINIC.email}</a>
  </p>
  <p>{CLINIC.serviceArea} · Hours: {CLINIC.hours}</p>
</div>
```

Map columns 2–4 over their `links`, keep the existing newsletter form for column 5, and add the bar below:

```tsx
<div className="hhcp-ft__bar">
  <ul>
    {FOOTER_BAR_LINKS.map((link) => (
      <li key={link.href}>
        <a href={link.href}>{link.label}</a>
      </li>
    ))}
  </ul>
  <p>© 2026 {CLINIC.name}. All rights reserved.</p>
</div>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:run src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter.tsx src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter.test.tsx
git commit -m "refactor: five-column footer with NAP block and policy bar"
```

---

## Task 18: The site layout shell

**Files:**
- Create: `src/app/(site)/layout.tsx`
- Move: `src/app/page.tsx` → `src/app/(site)/page.tsx`
- Test: `src/app/(site)/layout.test.tsx`

**Interfaces:**
- Consumes: `SiteHeader`, `SiteFooter`, `SiteDisclaimer`, `StickyMobileCta`, `JsonLd`, `buildMedicalClinic`
- Produces: the shell every route in the `(site)` group renders inside.

**Why a route group:** `(site)` does not appear in URLs, so every page keeps its path while inheriting the header, footer, disclaimer and sticky CTA. Pages stop importing them individually.

- [ ] **Step 1: Write the failing test**

Create `src/app/(site)/layout.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SiteLayout from "./layout";

describe("SiteLayout", () => {
  it("renders its children inside the main landmark", () => {
    render(<SiteLayout><p>page content</p></SiteLayout>);
    expect(screen.getByRole("main")).toHaveTextContent("page content");
  });

  it("always renders the site-wide disclaimer", () => {
    render(<SiteLayout><p>x</p></SiteLayout>);
    expect(
      screen.getByText(/no treatment outcomes are guaranteed/),
    ).toBeInTheDocument();
  });

  it("renders the sticky mobile CTA once", () => {
    const { container } = render(<SiteLayout><p>x</p></SiteLayout>);
    expect(container.querySelectorAll(".min-\\[768px\\]\\:hidden")).toHaveLength(1);
  });

  it("emits MedicalClinic JSON-LD", () => {
    const { container } = render(<SiteLayout><p>x</p></SiteLayout>);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script?.textContent).toContain('"MedicalClinic"');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:run "src/app/(site)/layout.test.tsx"`
Expected: FAIL — `Failed to resolve import "./layout"`.

- [ ] **Step 3: Write the layout**

Create `src/app/(site)/layout.tsx`:

```tsx
/**
 * The shell every public page renders inside.
 *
 * The `(site)` route group does not appear in URLs, so each page keeps its path
 * while inheriting the header, footer, disclaimer and sticky CTA. Pages must not
 * import those individually.
 *
 * Ordering is load-bearing: SiteHeader is an absolutely-positioned overlay with
 * z-index 1 and must render before <main>, and must not be wrapped in anything
 * that establishes a new stacking or positioning context. See PAGE_TOPOLOGY.md.
 */
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader";
import { SiteFooter } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter";
import { SiteDisclaimer } from "@/components/layout/SiteDisclaimer";
import { StickyMobileCta } from "@/components/layout/StickyMobileCta";
import { JsonLd } from "@/components/JsonLd";
import { buildMedicalClinic } from "@/lib/schema";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={buildMedicalClinic()} />
      <SiteHeader />
      <main id="brx-content">{children}</main>
      <SiteFooter />
      <SiteDisclaimer />
      <StickyMobileCta />
    </>
  );
}
```

- [ ] **Step 4: Move the homepage into the group**

```bash
mkdir -p "src/app/(site)"
git mv src/app/page.tsx "src/app/(site)/page.tsx"
```

Then edit `src/app/(site)/page.tsx`: remove the `SiteHeader` and `SiteFooter` imports, remove `<SiteHeader />`, `<SiteFooter />` and the `<main id="brx-content">` wrapper — the layout owns all four now. The default export returns just the section fragment.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:run "src/app/(site)/layout.test.tsx"`
Expected: PASS, 4 tests.

- [ ] **Step 6: Verify the homepage still renders**

Run: `npm run dev` and open `http://localhost:3000`.
Expected: the homepage renders exactly as before, plus the sticky mobile CTA at ≤767px and the disclaimer above the fold of the footer. The header must still overlay the hero video, not sit above it.

- [ ] **Step 7: Run the full check**

Run: `npm run check`
Expected: lint, typecheck, all tests, and build succeed.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add (site) layout shell with header, footer, disclaimer and sticky CTA

Moves the homepage into the route group. The disclaimer and sticky CTA render
from the layout so no page can omit them."
```

---

## Task 19: Phase 1 verification

**Files:**
- Create: `src/components/modules/vocabulary.test.tsx`

**Interfaces:**
- Consumes: everything built in Tasks 1–18
- Produces: a regression guard on the compliance constraints

**Why this exists:** two of the design spec's compliance mechanisms are architectural claims — "no testimonial module exists" and "gated pages leak through no channel". A claim with no test is a comment. These assertions make them real.

- [ ] **Step 1: Write the test**

Create `src/components/modules/vocabulary.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { publicRoutes, gatedRoutes } from "@/content/routes";
import { visibleNavItems } from "@/content/nav";
import { visibleFooterColumns } from "@/content/footer";
import sitemap from "@/app/sitemap";

const MODULE_DIR = join(process.cwd(), "src/components/modules");

describe("module vocabulary", () => {
  it("contains no testimonial, review or rating module", () => {
    // AHPRA treats testimonials about clinical care as advertising a regulated
    // health service; Clause 2.6 forbids them. This asserts the constraint is
    // structural rather than a matter of remembering.
    const forbidden = /testimonial|review|rating|star/i;
    const offenders = readdirSync(MODULE_DIR).filter((file) => forbidden.test(file));
    expect(offenders).toEqual([]);
  });
});

describe("gated routes", () => {
  const gatedPaths = gatedRoutes().map((route) => route.path);

  it("appear in no public channel", () => {
    const navHrefs = visibleNavItems().flatMap((item) => [
      item.href,
      ...(item.children ?? []).map((child) => child.href),
    ]);
    const footerHrefs = visibleFooterColumns().flatMap((column) =>
      column.links.map((link) => link.href),
    );
    const sitemapPaths = sitemap().map((entry) => new URL(entry.url).pathname);
    const publicPaths = publicRoutes().map((route) => route.path);

    for (const path of gatedPaths) {
      expect(navHrefs).not.toContain(path);
      expect(footerHrefs).not.toContain(path);
      expect(sitemapPaths).not.toContain(path);
      expect(publicPaths).not.toContain(path);
    }
  });

  it("is a non-empty set, so the test cannot pass vacuously", () => {
    expect(gatedPaths.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the test**

Run: `npm run test:run src/components/modules/vocabulary.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 3: Run the complete suite**

Run: `npm run check`
Expected: lint clean, typecheck clean, all tests pass, build succeeds.

- [ ] **Step 4: Confirm the phase is complete**

Verify each is true before declaring Phase 1 done:

- [ ] All 16 modules exist in `src/components/modules/` and are exported
- [ ] `ModuleRenderer` handles every `ModuleSpec` member (typecheck proves it)
- [ ] `npm run check` passes
- [ ] The homepage renders unchanged at 1534px against `docs/design-references/…/clone-hero-desktop-1534.jpg`
- [ ] The header still overlays the hero and is not sticky
- [ ] The sticky mobile CTA appears at ≤767px and not above
- [ ] `/medical-certificate`, `/home` and `/book-consultation` all 301 correctly
- [ ] `/sitemap.xml` lists 33 routes and excludes both gated pages
- [ ] `/robots.txt` disallows both gated pages

- [ ] **Step 5: Commit**

```bash
git add src/components/modules/vocabulary.test.tsx
git commit -m "test: add compliance regression guards for Phase 1

Asserts no testimonial module can exist and gated routes leak through no
public channel — nav, footer, sitemap or route list."
```

---

## Self-Review

**Spec coverage.** Every Phase 1 item in spec §9 maps to a task: the 16 modules (Tasks 7–13), header/footer restructure (16, 17), sticky CTA bar (15), schema helpers (4), `pricing.ts` (3), layout (18), redirects (6). Spec §7's four compliance mechanisms map to Tasks 5, 15, 18 and 19. Spec §8's three pre-deploy fixes: the Node engine is Task 1; `git init` was completed before this plan was written; the CDN cache check is an operational step at deploy time, noted in the spec and not codeable here.

**Deferred by design, not omitted.** `ServicePage` (spec §4.2) is Phase 3 — Task 7 defines the `ModuleSpec` union it will consume. `/api/submit` and the quiz (spec §5.1, §6) are Phase 2; `ContactBlock` and the newsletter form ship as `preventDefault()` shells until then, which Tasks 11 and 17 state explicitly.

**Placeholder scan.** No TBDs, no "add error handling", no "similar to Task N". Every code step carries the actual code.

**Type consistency.** `ModuleSpec` member names in Task 7 match every component prop signature in Tasks 8–11 and every case in Task 12's switch. `PriceKey` is defined in Task 3 and consumed in Tasks 7 and 10. `RouteEntry`/`isGated` from Task 5 are consumed in Tasks 6, 14 and 19. `CLINIC` field names from Task 2 are used verbatim in Tasks 10, 11, 13, 15 and 17.

**One known gap.** Task 16's step 3 describes the `SiteHeader` edit in prose rather than as a full file replacement, because the file is 607 lines of which only ~40 change and the scoped `HEADER_CSS` must be preserved byte-for-byte. The implementer should read the file first and make a surgical edit. This is a deliberate exception to the no-prose rule; the surrounding steps pin the outcome with tests.
