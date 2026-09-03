# BookingWizard Specification

## Overview
- **Target file:** `src/components/sites/.../root-8a5edab2/BookingWizard.tsx`
- **Interaction model:** **click-driven, 3-step wizard.** Self-contained mini-application embedded
  in the mint band. Measured 1465 x 1613px.
- This is by far the largest component on the page: the source ships **~17.9KB of scoped CSS** and
  **~70KB of JS** for it.

## Source artefacts (both saved in this repo — port from them, do not re-derive)
- `docs/research/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/css/booking-wizard-scoped.css`
  — the complete authored CSS, already scoped under `#hhp-booking-wrapper`.
- `docs/research/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/booking-wizard-source.js`
  — the complete original logic, including the `hhpSubMenus` config and every flow function.

## Its own design system
The wizard deliberately does **not** inherit the page's tokens. It declares its own namespace:
```
--hhp-primary: #013127        --hhp-primary-hover: #024536    --hhp-bg: #f4fffa
--hhp-white: #ffffff          --hhp-text: #013127             --hhp-text-light: #526f68
--hhp-border: #d6e8e1         --hhp-action: #013127
```
Note `#013127` ≠ the page-wide `#013126`, and the wrapper background `#f4fffa` ≠ the section's
`#f5fff9`. **Keep the wizard's own values** — do not "harmonise" them.

It also uses its **own font stack**, not the site fonts:
`"Segoe UI", Roboto, Helvetica, Arial, sans-serif` — verified via getComputedStyle.

### Wrapper
`#hhp-booking-wrapper`: `padding: 40px 20px; background-color: #f4fffa`
Inner `.hhp-container`: `max-width: 1100px; margin-inline: auto; padding: 0`

## Structure and flow

### Emergency note (always visible, above the progress bar)
`padding: 14px 18px; background-color: rgba(179, 38, 30, ~0.08); border-radius; font-size ~14px`
(exact values in the scoped CSS). Markup, verbatim:
```html
<strong>Medical emergency? Call 000 immediately.</strong> If you are in crisis, call Lifeline 13 11 14 (24/7) or Beyond Blue 1300 22 4636.
```

### Progress bar — 3 steps
| # | Label | Active when |
|---|---|---|
| 1 | `Select Service` | step 1 |
| 2 | `Service Options` | step 2 |
| 3 | `Book Appointment` | step 3 |
The current step's element gets `.active` (styling in the scoped CSS). On load, step 1 is active.

### STEP 1 — service selection (the default, visible-on-load state)
- `h1.hhp-section-title`: `Choose Your Service`
- `p.hhp-section-subtitle`: `Select a category below to view detailed options and pricing.`
- `.hhp-services-grid` containing **12** `.hhp-service-card`s, each `data-service="<key>"`,
  each an icon + title + description + optional inline list + price line.

Icon path base: `/images/`

| # | `data-service` | Icon file | Title | Description | Price line |
|---|---|---|---|---|---|
| 1 | `general` | `icon-general-referrals.svg` | `General & Referrals` | `Standard consults, referrals, prescriptions, certificates and more.` | `From $49` |
| 2 | `after-hours` | `icon-after-hours-consult.svg` | `After-Hours Consult` | `Evenings and weekends consultations.` | `From $69` |
| 3 | `priority` | `icon-priority-consult.svg` | `Priority Consult` | `First available appointment, fast turnaround.` + `Limited spots available each day` | `From $98` |
| 4 | `prescriptions` | `icon-prescriptions.svg` | `Prescriptions` | `Repeat eScripts and new prescriptions.` | `From $49` |
| 5 | `certificates` | `icon-medical-certificates.svg` | `Medical Certificates` | `Single day and multi-day certificates for work, study or carer.` | `From $19.90` |
| 6 | `pathology-radiology` | `icon-pathology-imaging.svg` | `Pathology & Imaging` | `Referrals for blood tests, X-rays and ultrasounds.` | `From $49` |
| 7 | `mental-health` | `icon-mental-health.svg` | `Mental Health` | `Personalised support for mental wellbeing and neurological conditions.` + `Includes: ADHD Support · Anxiety & PTSD · Smoking Cessation · Sleep Concerns` | `From $59` |
| 8 | `mens-womens-health` | `icon-mens-womens-health.svg` | `Men's & Women's Health` | `Focused care supporting hormonal, reproductive and overall wellbeing.` + `Areas we support: Hormonal Support · Menopause Support · Sexual Health · Fertility Support` | `From $89` |
| 9 | `continuity-preventative` | `icon-continuity-preventative.svg` | `Continuity & Preventative Health` | `Chronic disease management, long-term care planning and preventative health support.` | `From $69` |
| 10 | `holistic` | `icon-holistic-care.png` | `Holistic Care / Alternative Medicine` | `A personalised approach supporting chronic conditions, pain, sleep and overall wellbeing through evidence-based treatment options.` | `From $49` |
| 11 | `metabolic-wellness` | `icon-health-optimisation.png` | `Health Optimisation and Wellness` | `Comprehensive programs focused on weight, energy, recovery and long-term health.` | `Programs from $299` |
| 12 | `weight-management` | `icon-weight-management.svg` | `Weight Management` | `Medically supervised weight management programs tailored to your health goals.` | `From $99` |

Image `alt` values (verbatim, and note they differ from the titles):
`General & Referrals`, `After-Hours Consult`, `Priority Consult`, `Prescriptions`,
`Medical Certificates`, `Pathology & Imaging`, `Mental Health`, `Men's & Women's Health`,
`Continuity & Preventative Health`, `Holistic Care`, `Health Optimisation and Wellness`,
`Weight Management`

### STEP 2 — options
- `h2.hhp-section-title`: `Select Option`
- `p.hhp-section-subtitle`: `Please choose the specific service you require.`
- Body is driven by `hhpSubMenus[serviceKey]`, which has a `type` discriminator:
  - `type: "timing"` — a standard-vs-priority timing chooser (`general`, `after-hours`,
    `priority`, `prescriptions`, `pathology-radiology`)
  - `type: "options"` — a list of `items[]`, each `{ id, title, what, note }`
    (`mental-health`, `mens-womens-health`, …)
  - `type: "certificates"` — a branching eligibility questionnaire
  - plus the health-optimisation screening flow
- Optional per-service fields: `price`, `caveat`, `categoryNote`, `introEyebrow`, `introHeading`,
  `introText`
- Navigation row `.hhp-quiz-navigation` with two buttons:
  `← Back to Services` (`.hhp-btn-back`) and `Book Now` (`.hhp-btn-next`)

### STEP 3 — redirect
`.hhp-redirect-message` with `.hhp-spinner`, then:
- `h2`: `Redirecting you to booking...`
- `p`: `Please wait while we transfer you to our secure booking page.`

Redirect targets from the source:
```
BOOKING_REDIRECT_URL = "https://www.horizonhealthcarepartners.com.au/book-consultation/"
CERT_REDIRECT_URL    = "https://www.horizonhealthcarepartners.com.au/medical-certificate/"
```

## Deep-linking
The site's header "Services" submenu links to `/services/?service=<key>#hhp-booking-wrapper`,
so the wrapper element must keep `id="hhp-booking-wrapper"`.

## Responsive behaviour
All breakpoints live inside the scoped CSS file — port them as-authored rather than inventing new
ones. The services grid reflows from multi-column to fewer columns down the breakpoints.
