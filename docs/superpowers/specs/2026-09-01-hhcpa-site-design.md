# HHCPA Website — Design Spec

**Date:** 2026-09-01
**Client:** Horizon Health Care Partners Pty Ltd (HHCPA) · ABN 92 689 872 811
**Agency:** Pracxcel Pty Ltd · PBP Launch Tier engagement
**Deliverable:** AHPRA-compliant, mobile-first website rebuild covering the three Focus Services

---

## 1. Context

This repository currently holds a pixel-accurate clone of the client's existing
WordPress homepage, produced with the `ai-website-cloner-template`. It is a
**design-language reference, not the deliverable**. The deliverable is a 35-route
production site that replaces the WordPress build at
`horizonhealthcarepartners.com.au`.

Three source documents drive the build:

| Document | What it fixes |
|---|---|
| `HHCPA_Website_Content_UPDATED.md` | Final copy for 31 pages, each with a build block (meta, keywords, schema) and a module map |
| `HHCPA_Sitemap_and_Navigation.pdf` | Page inventory, URL paths, header nav, five-column footer |
| `HHCPA_Service_Agreement_Final.pdf` | Contractual obligations that constrain the build (see §8) |
| `HHCPA_Onboarding_Sheet - Onboarding Checklist.csv` | Client-confirmed facts and outstanding gaps |

### 1.1 Contractual constraints that shape the architecture

These are not preferences. They come from the signed Service Agreement.

- **Clause 1.2 — "New Patient Booking"**: a consultation request submitted via the
  website form or screening quiz counts toward the 15/month Patient Quota *even if the
  patient never responds or attends*. A $1,000/month Risk-Share Bond is measured on this
  number. Every countable event must therefore produce a durable, attributable,
  server-side record.
- **Clause 5.2A — Onboarding Cap**: onboarding completes within 45 days of the Effective
  Date. Client-side delays extend it day-for-day.
- **Clause 5.2 — Guarantee applies only in months the website is live.**
- **Clause 6.2(b)**: regulated content requires Ranjeeta's express written approval
  before publication. No deemed approval. Approval outstanding >5 business days suspends
  the guarantee for two months.
- **Clause 2.6 / 6.5 — Regulatory framework**: AHPRA registration numbers on all
  practitioner-identifying content; compliant claims language with no outcome
  guarantees; **no testimonials about clinical care**; no advertising of unregistered
  therapeutic goods, S4/S8 medications, or compounded GLP-1 products by brand or
  product name.
- **Clause 7.5 — Website Handover**: on termination we owe a complete export hostable by
  any competent developer. A Git repository satisfies this by construction.

---

## 2. Decisions

Each of these was decided explicitly during design and is not open for silent revision.

| # | Decision |
|---|---|
| D1 | This Next.js app **is** the production site. It replaces WordPress; we host it. |
| D2 | Page copy lives as typed `readonly` consts in the repo. **Articles only** come from a headless CMS. |
| D3 | `/quiz/` is the **sole lead-capturing flow**. The services wizard submits nothing. |
| D4 | Hybrid composition: a `ServicePage` template drives 19 service pages from data; 12 pages are explicit JSX. |
| D5 | Submissions POST server-side to `https://n8n.pracxcel.com.au/webhook/hhcpa-quiz`, HMAC-signed. |
| D6 | Clinical answers are transmitted, segregated under a `clinical` key. |
| D7 | Deploy to Hostinger Cloud Startup via GitHub integration, running a real Node server. |
| D8 | `/services/` is retained as the wizard's home rather than redirected. |

---

## 3. Information architecture

### 3.1 Route inventory — 35 routes

**Service pages (19) — all use the `ServicePage` template:**

```
/weight-loss-peptides/                              ★ primary money page
/weight-loss-peptides/weight-loss-injections/
/weight-loss-peptides/medical-weight-loss-program/
/mens-health/
/mens-health/erectile-dysfunction-treatment/
/mens-health/testosterone-replacement-therapy/
/mens-health/premature-ejaculation-treatment/
/mens-health/hair-loss-treatment/
/womens-health/
/womens-health/menopause-treatment/
/womens-health/pcos-management/
/womens-health/contraception/
/medicinal-cannabis/                                ⚑ compliance-gated
/online-doctor/
/online-doctor/online-prescriptions/
/online-doctor/medical-certificates/
/online-doctor/pathology-imaging-referrals/
/online-doctor/specialist-referrals/
/online-doctor/mental-health/
```

**Bespoke pages (12) — explicit JSX:**

```
/                          home
/how-it-works/
/pricing/
/about-us/
/our-practitioners/        ⚑ compliance-gated, content near-empty
/contact/
/faqs/
/quiz/                     the funnel
/discharge/
/patient-safety/
/complaints/
/conflict-of-interest-disclosure/
```

**Remaining (4):**

```
/services/                 retained — hosts the booking wizard
/articles/  + /article/[slug]/    CMS-backed, phase 5
/privacy/                  ✗ no copy supplied
/terms-and-conditions/     ✗ no copy supplied
```

`escript.link` (Patient Portal) is an external link, not a route. Onboarding item 12
notes the client may migrate to getscripted — treat the portal as a single configurable
URL, not a hard-coded link.

### 3.2 Redirect map

Nine live URLs survive unchanged (`/about-us/`, `/pricing/`, `/faqs/`, `/contact/`,
`/quiz/`, `/discharge/`, `/how-it-works/`, `/privacy/`, `/terms-and-conditions/`), as do
all three `/article/<slug>/` posts and `/services/`. Only three need 301s:

| Old | New | Why |
|---|---|---|
| `/medical-certificate/` | `/online-doctor/medical-certificates/` | Folded into the Online Doctor silo |
| `/home/` | `/` | WordPress duplicate |
| `/book-consultation/` | `/quiz/` | Screening now precedes booking |

Preserving `/article/<slug>/` URLs exactly is deliberate — those three posts are the
site's only earned content equity.

### 3.3 Navigation

Header: four service dropdowns (Weight Loss & Peptides · Men's Health · Women's Health ·
Online Doctor), each opening with its own overview link, plus flat links for How It Works
and Pricing. Medicinal Cannabis is added to the nav only on compliance sign-off. A
persistent "Book a consultation" button (→ `/quiz/`), the phone number, and the
announcement strip appear on every page. About Us, Our Practitioners, Articles and
Contact sit under a secondary About menu.

Footer: five columns per the sitemap PDF (clinic/NAP · Our Services · Patients · About &
Trust · Newsletter), plus a bar carrying Privacy, Terms, Conflict-of-Interest and the
copyright line.

---

## 4. Composition model

### 4.1 The module vocabulary

Analysis of all 31 written page module maps: **278 module instances, 16 distinct types.**
Ten types account for 91% of instances. This is the entire UI surface of the site.

| Count | Module | Source |
|---:|---|---|
| 37 | Text + image block (incl. alternating and values-tile variants) | adapt `StorySection` |
| 31 | Hero | adapt `HeroSection` — needs a non-video inner-page variant |
| 31 | Intro paragraph | new, trivial |
| 29 | Closing CTA band | adapt `FinalCtaSection` |
| 26 | Numbered step cards | adapt `StepsSection` |
| 24 | Trust / value-prop strip (5 items) | adapt `FeatureMarquee` |
| 23 | FAQ accordion + FAQPage schema | adapt `FaqSection` |
| 19 | Checklist / icon list | new |
| 16 | Related-service cards | adapt `CareAreasSection` |
| 16 | Inline CTA + related links | new |
| 8 | Pricing cue card | adapt `PricingSection` |
| 8 | Feature tiles | new |
| 6 | Safety callout box | new |
| 2 | Contact block + form | new |
| 1 | Practitioner cards | new |
| 1 | Disclosure callout | new |

Eight modules already exist in the clone in adaptable form. Six of the eight new modules
are small. **There is no testimonial, review-count or star-rating module, and none may be
added** — this is how Clause 2.6 is enforced structurally rather than by vigilance.

Two items from the module maps are *not* page modules and belong to the layout:

- **Sticky mobile CTA bar** (appears on 29 pages) → `(site)/layout.tsx`
- **Site-wide disclaimer + NAP block** (every page) → footer

### 4.2 The service-page frame

All 19 service pages open with an identical three-module frame (hero → trust strip →
intro paragraph) and close with an identical two-module frame (FAQ accordion → closing
CTA band). Only the 4–6 middle modules vary, in both type and order.

`ServicePage` therefore hard-codes the frame and takes the middle as an ordered array:

```ts
type ServicePageData = {
  slug: string
  meta: { title: string; description: string; primaryKeyword: string; supporting: string[] }
  schema: SchemaType[]           // MedicalWebPage | Service | FAQPage | BreadcrumbList
  hero: { h1: string; intro: string }
  trustBar: readonly string[]
  introParagraph: string
  sections: readonly ModuleSpec[]   // the variable middle
  faq: readonly { q: string; a: string }[]
  closingCta: { heading: string; body: string }
  gated?: boolean
}
```

The 12 bespoke pages compose modules directly in JSX, because they genuinely differ in
structure and a shared template would be fought rather than used.

### 4.3 File layout

```
src/app/
  (site)/layout.tsx           header · footer · sticky mobile CTA · disclaimer
    page.tsx                  home — explicit JSX
    [service silos]/          19 routes via ServicePage
    [bespoke pages]/          12 routes, explicit JSX
    services/page.tsx         booking wizard host
    articles/                 CMS-backed (phase 5)
  api/submit/route.ts         the single webhook sender
src/components/
  modules/                    the 16 modules
  sites/…/root-8a5edab2/      the clone — mined for modules, then retired
src/content/
  pages/                      31 page data files
  pricing.ts                  single source for every price on the site
  nav.ts  footer.ts  clinic.ts
```

**`pricing.ts` is load-bearing.** Eight pricing-cue instances and the `/pricing/` table
all read from it. The 17 outstanding `[[WAITING ON RANJEETA]]` placeholders are almost
entirely price figures; centralising them makes their resolution a single edit rather
than a nine-page hunt.

---

## 5. The two funnels

The live WordPress site runs two overlapping flows. They are kept distinct, with one job
each.

### 5.1 `/quiz/` — screens and captures (the lead path)

Replaces FluentForms form #21. Structure preserved:

- Service selection: Mental Health · Weight Loss · Complete Wellness · Holistic/Alternative
- Per-branch question sets (`wl_` weight/height → BMI, goals, conditions, medications;
  `mh_` diagnosis, treatment, crisis; `hl_` chronic condition, prior treatments,
  disqualifying conditions; `cw_` goals, bloods, conditions, medications)
- Gates: age ≥18, located in Australia
- Safety exits: "Unable to Proceed", "Crisis Support", "Emergency"
- Closing step: first name, last name, email, phone
- Four consents: terms, privacy, marketing, clinical understanding

**This closing step is the countable New Patient Booking under Clause 1.2.** It POSTs
server-side before any handoff.

> **Compliance note.** The `hl_` branch ("chronic condition", "conventional medications
> unsuccessful", "psychiatric history", "disqualifying conditions") is a medicinal-cannabis
> SAS-B eligibility screen presented under a "Holistic / Alternative Care" label. The
> content doc's own spec for `/quiz/` requires that the quiz "must not coach answers or
> determine any prescribing decision". This branch must go to Ranjeeta for sign-off under
> Clause 6.2(b) before it is rebuilt as-is. Onboarding item 31 already assigns Pracxcel
> the remediation.

### 5.2 `/services/` — routes to a booking (no capture)

The ported `BookingWizard`: 12 service cards → per-service questions → booking widget.
No form, no submission, no consent step, no stored record. This keeps clinical answers
out of any system that doesn't need them.

**Known gap, not solved by this spec:** booking widgets are third-party cross-origin
iframes (currently Halaxy on the wizard, MedPrescribe on `/book-consultation/`, with
getscripted pending per onboarding item 35). We cannot observe whether a booking
completes. Since a booked consultation is the *primary* qualifying event under Clause
1.2, this needs solving on the platform side: a webhook, a post-booking redirect to a
thank-you page on our domain, or booking-reference passthrough reconciled against a
monthly export. **This should be a stated requirement of the booking-platform decision.**

A client-side event may fire when a user reaches the widget, as a retargeting signal
only. Reaching a booking widget is not a booking and must not be counted toward the quota.

---

## 6. Lead capture

### 6.1 Transport

A single Next.js route handler at `/api/submit`. Server-side only — the webhook URL and
signing secret never reach the client bundle, there is no CORS surface, and the server
attaches data the browser cannot be trusted with.

### 6.2 Payload contract

```jsonc
POST https://n8n.pracxcel.com.au/webhook/hhcpa-quiz
Content-Type: application/json
X-HHCPA-Signature: <HMAC-SHA256 of raw body, shared secret>

{
  "submissionId": "uuid",              // idempotency key across retries
  "formType": "quiz",                  // quiz | contact | discharge | medical-certificate
  "submittedAt": "2026-09-01T04:12:33Z",
  "contact":  { "firstName": "", "lastName": "", "email": "", "phone": "" },
  "service":  "weight-loss",           // weight-loss | mental-health | complete-wellness | holistic
  "outcome":  "eligible",              // eligible | not-eligible | crisis-exit | emergency-exit
  "consents": {
    "terms":                { "given": true, "version": "2026-09-01", "at": "…" },
    "privacy":              { "given": true, "version": "2026-09-01", "at": "…" },
    "marketing":            { "given": false, "version": "2026-09-01", "at": "…" },
    "clinicalUnderstanding":{ "given": true, "version": "2026-09-01", "at": "…" }
  },
  "attribution": {
    "gclid": "", "wbraid": "", "gbraid": "", "fbclid": "",
    "utm_source": "", "utm_medium": "", "utm_campaign": "",
    "utm_term": "", "utm_content": "",
    "landingPage": "", "referrer": ""
  },
  "page": { "path": "/quiz/", "title": "" },
  "clinical": { }                      // segregated — see §6.4
}
```

One endpoint; `formType` discriminates. The contact, discharge and medical-certificate
forms use the same contract with an empty `clinical` object.

### 6.3 Reliability

If n8n is unreachable the submission is otherwise lost, and under Clause 5.4 it is our
only evidence in a quota dispute. Therefore:

1. Retry 3× with exponential backoff.
2. On exhaustion, write a fallback record to MySQL and alert.
3. **The user always sees their success screen.** A patient's booking must never fail
   because our webhook did.

The fallback store must not be the local filesystem — Hostinger's app filesystem is
ephemeral across deploys, which would destroy exactly the records it exists to preserve.

### 6.4 Clinical data segregation

Clinical answers (BMI, conditions, medications, psychiatric history, crisis flags) are
sensitive information under APP 3 and APP 11. They are transmitted under a dedicated
`clinical` key so that n8n can route them to the clinical destination and **strip them
before any marketing-facing branch**.

Consequences to be handled on the n8n side, outside this repo's scope but stated here so
they are not lost:

- Health-inferred data must never reach ad platforms — Meta CAPI in particular.
- n8n retention for this workflow must be a deliberate setting, not a default.

---

## 7. Compliance layer

Four obligations are structural rather than editorial:

1. **Site-wide disclaimer** renders from `(site)/layout.tsx` on every page. It cannot be
   omitted per page because it is not per-page data.
2. **No testimonial/review module exists** in the vocabulary (§4.1).
3. **Schema is generated from page data**, so FAQ copy and `FAQPage` markup cannot drift.
4. **Gated pages** — `/medicinal-cannabis/` and `/our-practitioners/` build behind a flag
   and are excluded from the sitemap, the nav and `robots.txt` until Ranjeeta signs off
   per Clause 6.2(b).

Per-page schema types come from each page's build block: `MedicalClinic` and
`WebSite`/SiteSearch on the homepage; `MedicalWebPage`, `Service`, `FAQPage` and
`BreadcrumbList` on service pages.

**Practitioner content is effectively empty.** Onboarding items 26–30 strike every name
previously listed on the live site (Dr Bull, Dr Lavett, Dr Lee, the three nurse
practitioners, Dr Bay, Felicity Sewell) as not belonging to this practice. Only Ranjeeta
Roshan remains — with no AHPRA number, no headshot, and a title correction on file ("not
a Dr"). `/our-practitioners/` cannot ship until this is resolved.

---

## 8. Deployment

Hostinger Cloud Startup, Node.js app, GitHub integration with automatic builds on push.

| Setting | Value |
|---|---|
| Install | `npm ci` |
| Build | `npm run build` |
| Start | `npm run start -- -p $PORT` |
| Node | 20.9+ (see below) |

Three items to fix before first deploy:

1. **This directory is not yet a Git repository.** GitHub integration is the deployment
   mechanism and Clause 7.5's handover obligation is satisfied by the repo itself, so
   `git init` plus a first commit is a prerequisite, not a formality. A `.gitignore`
   covering `node_modules/`, `.next/`, `.env*` and `.DS_Store` is needed with it.
2. **`package.json` declares `"node": ">=24"`.** That came from the cloner template, not
   from a real requirement — Next.js 16 needs only `>=20.9.0`. Left as-is, `npm ci` fails
   the engines check on Hostinger's documented Node 20. Relax it.
3. **Confirm the bundled CDN/WAF does not cache `/api/submit`.**

Environment variables (set in hPanel, never committed): webhook URL, HMAC secret, MySQL
credentials, CMS token, booking-platform URLs, patient-portal URL.

---

## 9. Build phases

Each phase gets its own implementation plan.

| # | Phase | Contents | Blocks |
|---|---|---|---|
| 1 | **Module layer + shell** | 16 modules, header/footer restructure, sticky CTA bar, schema helpers, `pricing.ts`, layout, redirects | everything |
| 2 | **`/quiz/` + `/api/submit`** | The funnel, the webhook contract, retry + fallback, attribution capture | revenue + the guarantee |
| 3 | **Service pages** | `ServicePage` template + 19 data files | — |
| 4 | **Information & policy pages** | 12 bespoke pages | — |
| 5 | **Articles + CMS** | `/articles/`, `[slug]`, CMS wiring, migrate 3 existing posts | — |

Phase 2 is deliberately early. It is the path the $1,000/month bond is measured on, and
shipping it late means measuring a quota with no instrument.

`/services/` and the ported `BookingWizard` carry over in phase 1 largely as-is; the
wizard is the single largest existing asset (~3,100 lines) and needs only its terminal
booking-widget step made configurable.

---

## 10. Open items

### 10.1 Deferred by decision

- **CMS choice for articles** — deferred to phase 5. The client has three posts and no
  publishing cadence; picking a vendor now would be premature.

### 10.2 Blocked on the client

These do not block phases 1–4. Each has a defined landing place so resolution is a small,
local edit.

| Item | Lands in | Source |
|---|---|---|
| 17 pricing figures; whether all prices are "from" prices | `src/content/pricing.ts` | content doc, onboarding 21/25 |
| Business hours ("8-10am Monday to Sunday" is ambiguous) | `src/content/clinic.ts` | onboarding 6 |
| Practitioner names, titles, AHPRA numbers, headshots | `/our-practitioners/` (gated) | onboarding 26–30 |
| Medicinal Cannabis compliance sign-off | `/medicinal-cannabis/` (gated) | onboarding 22–23, Clause 6.2(b) |
| Booking platform: Halaxy vs MedPrescribe vs getscripted | wizard terminal step | onboarding 35 |
| Booking-completion attribution mechanism | §5.2 | this spec |
| Privacy Policy and Terms copy | two routes with no content | sitemap vs content doc |
| Keep or redirect the 3 existing articles | phase 5 | onboarding 11 |
| Complaints officer, pharmacy disclosure specifics | `/complaints/`, `/conflict-of-interest-disclosure/` | onboarding 33 |
| Logo master vector files | brand assets | onboarding 13 |

### 10.3 Flagged risks

- **`hl_` quiz branch** may constitute prescribing guidance — see §5.1.
- **Booking conversions are unobservable** — see §5.2.
- **Three booking systems are live simultaneously** on the client's current site (Halaxy,
  MedPrescribe, and the pending getscripted decision). Worth establishing which is
  actually taking bookings today.

---

## 11. Out of scope

Not part of this build: Google Ads and Meta campaign management, GBP re-verification,
Repuboost, intelliLens itself, call-tracking number provisioning, and the n8n workflows
downstream of the webhook. This spec covers the website and the boundary at which it
hands data to that stack.
