# PricingSection Specification

## Overview
- **Target file:** `src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/PricingSection.tsx`
- **Interaction model:** **static.** Three side-by-side plan cards. Only hover states on the CTAs.
- Measured section box: 1585 x 901px.

## DOM structure
```
section.pricing--section              padding 90px 60px
└─ div.hhcp-container                 flex column, gap 45px
   ├─ div.heading                     flex column, gap 20px, padding-bottom 45px, border-bottom
   │  ├─ div.subheading--wrap         flex row, align center, gap 12px  → dot + "Our Fees"
   │  └─ h2
   └─ div.grid--3                     grid, 3 cols, gap 30px
      └─ div.pricing--card × 3        flex column, gap 45px, padding 30px, radius 10px
         ├─ div  (flex column, gap 45px)
         │  ├─ div  (flex column, align-items flex-start, gap 20px)
         │  │  ├─ p.pricing--subheading       white pill label
         │  │  └─ div (flex column, gap 0)  → h3 price + p caption
         │  ├─ div.pricing--divider           1px rule
         │  └─ div (flex column, gap 32px)
         │     └─ ul.list--pricing            flex column, gap 20px
         │        └─ li > div.content         flex row, align center, gap 12px → icon + title
         └─ a  full-width CTA
```
Note the card is `justify-content: normal` but the CTA is the card's last child, and cards are
`self--stretch` inside the grid, so all three CTAs align at the bottom only because the cards are
equal height. Give the inner content wrapper `flex: 1` so the button pins to the bottom.

## Computed styles (exact)

### `section.pricing--section`
`padding: 90px 60px` — i.e. `padding-block: var(--hhcp-section-space-m); padding-inline: var(--hhcp-gutter)`
(use the tokens so it stays fluid).

### Container
`.hhcp-container` + `display: flex; flex-direction: column; gap: 45px; padding: 0`
(the container's own `padding-inline: 20px` is zeroed here — the section supplies the gutter).
**Override `.hhcp-container`'s padding to 0 for this section.**

### `.heading`
`display: flex; flex-direction: column; gap: 20px;`
**`padding-bottom: 45px; border-bottom: 1px solid #ececec`**

### `.subheading--wrap` (eyebrow row)
`display: flex; align-items: center; gap: 12px`
- Dot: 10px circle, `background: #58eda2` (same treatment as the marquee bullet)
- Label: **`font-family: Roboto Mono; font-size: 12px; font-weight: 500; text-transform: uppercase;
  letter-spacing: 0.36px; color: #013126`** — text `Our Fees`

### `h2`
**`font-size: 42px` (`var(--hhcp-h2)`); `line-height: 46.336px` (`var(--hhcp-heading-lh)`);
`font-weight: 400`; `letter-spacing: -0.42px`; `color: #013126`**
Text: `Our fees - Holistic Care/Alternative Therapy`

### `.grid--3`
`display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px`
- `@media (max-width: 1199px)` (`grid--l-2`): `repeat(2, 1fr)`
- `@media (max-width: 991px)` (`grid--m-1`): `1fr`

### `.pricing--card`
`display: flex; flex-direction: column; gap: 45px;`
**`padding: 30px; border-radius: 10px`**
- Card 1 & 3 background: **`#ddffeb`** (`var(--hhcp-light-green)`)
- Card 2 background: **`#f5fff9`** (`var(--hhcp-accent)`)
- `@media (max-width: 1199px)`: `padding: var(--hhcp-space-l) var(--hhcp-space-s)` (45px 20px)

### `.pricing--subheading` (the white pill label)
**`padding: 13.3px; border-radius: 8px; background-color: #ffffff;`
`font-family: Roboto Mono; font-size: 12px; font-weight: 500; text-transform: uppercase;
letter-spacing: 0.36px; color: rgba(1, 49, 38, 0.8)`**
Its parent is `align-items: flex-start`, so the pill hugs its text (measured 223 x 45px for the
longest label) — do **not** stretch it full width.

### Price `h3`
**`font-size: 64px` (`var(--hhcp-h1)`); `line-height: 68.512px`; `font-weight: 400;`
`letter-spacing: -0.6px; color: #013126`**

### Price caption `p`
**`font-size: 16px; line-height: 24px; color: rgba(1, 49, 38, 0.8)`**
(The price + caption sit in a `gap: 0` column.)

### `.pricing--divider`
`display: flex; align-items: center; width: 100%` containing a line:
**`border-top: 1px solid rgba(57, 68, 43, 0.2); height: 1px; width: 100%`**

### `ul.list--pricing`
`display: flex; flex-direction: column; gap: 20px; list-style: none; padding: 0; margin: 0`

### List row `.content`
`display: flex; justify-content: flex-start; align-items: center; gap: 12px`
- Icon: `CheckCircleIcon` from `../shared/icons` — **24 x 25px**, `color: rgba(1, 49, 38, 0.8)`
  (the icon uses `currentColor`), `flex: none`
- Title: **`font-size: 16px; line-height: 24px; font-weight: 400; color: rgba(1, 49, 38, 0.8)`**

### CTA buttons — two distinct variants

**Cards 1 & 3 — mint variant (`.price--btn`)**
```
width: 100%; padding: 12.132px 19.2px; border-radius: 800px;
background-color: #58eda2; border: 1px solid #58eda2; color: #013126;
font-family: Roboto Mono; font-size: 12px; font-weight: 500; line-height: 28px;
text-transform: uppercase; letter-spacing: normal;
display: flex; justify-content: center; align-items: center;
transition: all 0.4s ease;
```
**Hover:** `background: #013126; color: #ffffff; border-color: #013126`

**Card 2 — dark variant (`.btn--primary`)**
```
width: 100%; min-height: 52px; padding: 12.132px 19.2px; border-radius: 800px;
background-color: #013126; border: 1px solid #013126; color: #e6fef9;
font-family: Roboto Mono; font-size: 12px; font-weight: 500; line-height: 12px;
text-transform: uppercase; letter-spacing: normal;
display: flex; justify-content: center; align-items: center;
transition: all 0.3s linear;
```
**Hover:** `box-shadow: 5px 5px 25px 0 rgba(33, 33, 33, 0.1)`

Note `letter-spacing` computes to `normal` on these buttons (not 0.36px) — verified.

## Per-card content (verbatim)

### Card 1 — background `#ddffeb`
- Label: `First Medical Consultation`
- Price: `$69`
- Caption: `Start your health journey`
- List:
  1. `Consult with AHPRA-registered practitioner`
  2. `Review of your medical history and current treatments`
  3. `Discussion of suitable treatment options`
- CTA: `Get Started` → `https://www.horizonhealthcarepartners.com.au/quiz/` (mint variant)

### Card 2 — background `#f5fff9`
- Label: `Follow-Up Consultation`
- Price: `$59`
- Caption: `Continued medical guidance`
- List:
  1. `Ongoing care with your dedicated practitioner`
  2. `Progress review and plan adjustments`
  3. `Renewals and medication management`
- CTA: `Book Appointment` → `https://www.horizonhealthcarepartners.com.au/quiz/` (dark variant)

### Card 3 — background `#ddffeb`
- Label: `Transfer Consultation`
- Price: `$59`
- Caption: `Seamless care transition`
- List:
  1. `Quick onboarding`
  2. `Review of current treatment and medical records`
  3. `Continuity of care with no disruption`
- CTA: `Transfer Your Care` → `https://www.horizonhealthcarepartners.com.au/discharge/` (mint variant)

## Responsive behaviour
- **≥1200px:** 3 columns, card padding 30px
- **≤1199px:** 2 columns; card padding `45px 20px`
- **≤991px:** 1 column
- Section padding and type stay fluid via the clamp tokens.

## Assets
- No images. Icon: `CheckCircleIcon` from `../shared/icons`.
