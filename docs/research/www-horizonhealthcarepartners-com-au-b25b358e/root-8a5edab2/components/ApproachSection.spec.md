# ApproachSection Specification

## Overview
- **Target file:** `src/components/sites/.../root-8a5edab2/ApproachSection.tsx`
- **Interaction model:** **click-driven accordion** on a dark band. Item 1 is open on load.
- Section box 1585 x 984px. This is the page's one dark section.

## Computed styles (exact)

### `section.cta--02`
**`background-color: #01221b`** (`var(--hhcp-dark)` — note this is NOT the `#013126` primary)
**`padding: 32px 60px`** (`3.2rem var(--hhcp-gutter)`)
**`margin: 90px 0`** (`var(--hhcp-section-space-m) 0`)
- `@media (max-width: 991px)`: `padding-block: var(--hhcp-section-space-m)`

### Layout `.grid--2`
`display: grid; grid-template-columns: 1fr 1fr; gap: 0`
- `@media (max-width: 991px)`: `1fr`, `gap: var(--hhcp-space-m)` (30px)
Left column is `align-self: stretch; justify-content: center` (vertically centres the content).
Right column is `align-self: stretch`.

### `.cta--content-block` (left)
`display: flex; flex-direction: column; gap: 32px;`
**`width: 100%; max-width: 522px; padding-right: 30px`**
- `@media (max-width: 991px)`: `max-width: 100%`

### Heading block (`gap: 20px`)
- Eyebrow: 10px `#58eda2` dot + `Our Approach to Care` — Roboto Mono 12px/500 uppercase,
  `letter-spacing: 0.36px`, **`color: #ffffff`** (white here, not primary)
- `h2`: `font-size: var(--hhcp-h2)` (42px); `line-height: var(--hhcp-heading-lh)`;
  `font-weight: 400`; `letter-spacing: -0.42px`; **`color: #ffffff`**

### `.cta--content-paragraph`
**`max-width: 390px`; `font-size: 16px; line-height: 24px; color: #ffffff`**
- `@media (max-width: 991px)`: `max-width: 100%`

### Accordion `.wchhcp--accordion`
**`width: 100%; max-width: 480px`**; `display: block`
- `@media (max-width: 991px)`: `max-width: 100%`

#### Item `.wchhcp--item`
**`border-bottom: 1.5px solid #ffffff`**
**Open (`.brx-open`): `border-bottom: 1.5px solid #58eda2`**

#### Title `.accordion-title-wrapper`
```
display: flex; align-items: center; justify-content: space-between;
gap: 30px; padding: 0; cursor: pointer;
min-height: 76.8px;                     /* 7.68rem */
font-family: DM Sans; font-size: var(--hhcp-h4) (20px); font-weight: 400;
color: #ffffff;
```
**Open: `color: #58eda2`**
`role="button"`, `tabindex="0"`, `aria-expanded` toggled.
Trailing icon: `<ArrowRightLongIcon />` (14x15, `currentColor`) — inherits the title colour, so it
turns mint when the row opens.

#### Content `.accordion-content-wrapper`
```
padding: 0 0 20px 20px;
font-size: 16px; line-height: 24px; color: #ffffff;
```
**Closed rows are `display: none`** (verified — not a height animation). Open rows are `display: block`.

#### DEFAULT STATE — **item 1 (`Medical Guidance`) is open on load**, all others closed.
Verified at runtime: item 0 has `.brx-open`, `aria-expanded="true"`, content `display: block`;
items 1–3 have `aria-expanded="false"` and content `display: none`.
Behaves as a single-open accordion (opening one closes the others).

### CTA `a`
Same mint button as StorySection:
```
min-height: 52px; padding: 12.132px 19.2px; border-radius: 800px;
background-color: #58eda2; border: 1px solid #58eda2; color: #013126;
font-family: Roboto Mono; font-size: 12px; font-weight: 500;
text-transform: uppercase; letter-spacing: normal;
display: inline-flex; align-items: center; justify-content: center; gap: 8px;
transition: all 0.3s linear;
```
Trailing 10px dot `<span>` (`background: currentColor; border-radius: 50%`).
**Hover:** button `box-shadow: 5px 5px 25px 0 rgba(33, 33, 33, 0.1)`;
dot `box-shadow: 0 0 0 3px rgba(1, 49, 38, 0.25)`.
Note this button is **not** `width: 100%` here (unlike StorySection).

### Right-hand image
`align-self: stretch; width: 100%; height: 100%; object-fit: cover`
`images/approach-to-care.jpg` (natural 746x1024)
alt: `Two older adults with gray hair, wearing sweaters and jeans, embrace and smile at each other outdoors in a green, natural setting.`

## Content (verbatim)
- Eyebrow: `Our Approach to Care`
- H2: `How We Support You`
- Paragraph: `Access practitioner-led consultations from anywhere in Australia. Our AHPRA-registered practitioners provide confidential telehealth appointments, guiding you through every step with professional support and transparent processes.`
- CTA: `Start pre-screening quiz` → `https://www.horizonhealthcarepartners.com.au/quiz/`

### Accordion items
1. **`Medical Guidance`** *(open by default)* — `Navigate your healthcare journey with confidence. Our AHPRA-registered medical practitioners provide ongoing support throughout your consultations, helping you understand your options and ensuring you receive the professional guidance you need at every stage of your care.`
2. **`Judgement-Free Care`** — `Your health concerns deserve a supportive, confidential environment. We create a safe space where you can openly discuss your healthcare needs with qualified medical professionals who listen without judgement and respect your individual circumstances throughout the process.`
3. **`Clinical Standards`** — `All consultations are conducted by AHPRA-registered medical practitioners who maintain rigorous clinical standards. Our practitioners bring extensive medical experience and stay current with healthcare guidelines to provide informed, professional consultations.`
4. **`Informed Approach`** — `Our consultation process follows established medical protocols and professional healthcare standards. Our AHPRA-registered practitioners will review your medical history and discuss your health concerns to determine the most appropriate pathway for your individual circumstances.`

## Responsive behaviour
- **≥992px:** two equal columns, text column max 522px with 30px right padding
- **≤991px:** single column, `gap: 30px`; text/paragraph/accordion all `max-width: 100%`;
  section padding-block becomes `var(--hhcp-section-space-m)`
