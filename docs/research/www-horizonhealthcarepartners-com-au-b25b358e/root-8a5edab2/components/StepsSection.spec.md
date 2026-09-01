# StepsSection Specification

## Overview
- **Target file:** `src/components/sites/.../root-8a5edab2/StepsSection.tsx`
- **Interaction model:** **hover-driven reveal.** Each card is a fixed 444px-tall window showing
  only a photo; on hover the photo shrinks to 319px and the text content fades in underneath.
  No scroll or click behaviour. Measured section height: 799px.

## DOM structure
```
section                              padding: var(--hhcp-section-space-m) var(--hhcp-gutter)
└─ .hhcp-container                   flex column, gap 45px
   ├─ .heading                       flex column, gap 20px  (NO border-bottom here)
   │  ├─ eyebrow row                 dot + "GET STARTED"
   │  └─ h2
   └─ .grid--4                       grid, 4 cols, gap 13.5068px
      └─ .hiw--steps × 4             position relative, height 444px, overflow hidden,
         │                           flex column, gap 30px
         ├─ .hiw--steps-image-block  min-height 444px, overflow hidden, radius 10px
         │  └─ img                   height 444px, transform scale(1.05), object-fit cover
         ├─ h3.step--heading         ABSOLUTE white pill, top 20px left 20px
         └─ .hiw--content            visibility hidden, opacity 0
            └─ .step--icon-box       flex row, gap 16px
               ├─ .icon              StepNumberIcon (31x31)
               └─ .content           h4 + p
```

## Computed styles (exact)

### Heading block
Same eyebrow pattern as PricingSection (10px `#58eda2` dot + Roboto Mono 12px/500 uppercase
`letter-spacing: 0.36px` `color: #013126`), then `h2`:
`font-size: var(--hhcp-h2)` (42px); `line-height: var(--hhcp-heading-lh)`; `font-weight: 400`;
`letter-spacing: -0.42px`; `color: #013126`.
**This heading has no bottom border** (unlike Pricing).

### `.grid--4`
`display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--hhcp-space-xs)` (13.5068px)
- `@media (max-width: 1199px)` (`grid--l-2`): `repeat(2, 1fr)`
- `@media (max-width: 767px)` (`grid--s-1`): `1fr`, and `gap--s-l` → `gap: var(--hhcp-space-l)` (45px)

### `.hiw--steps` (card)
`position: relative; height: 444px; overflow: hidden; display: flex; flex-direction: column; gap: 30px`
- `@media (max-width: 478px)`: `height: auto; overflow: visible`

### `.hiw--steps-image-block`
`overflow: hidden; min-height: 444px; border-radius: 10px; transition: all 0.3s linear`
- `@media (max-width: 478px)`: `min-height: 360px`

### `img.hiw--steps-image`
`height: 444px; width: 100%; object-fit: cover; border-radius: 10px;`
**`transform: scaleX(1.05) scaleY(1.05)`**; `transition: all 0.3s linear`
- `@media (max-width: 478px)`: `height: 360px`

### `h3.step--heading` (white pill over the photo)
`position: absolute; top: 20px; left: 20px;`
**`padding: 3px 12px; border-radius: 22.5px` (`var(--hhcp-radius-xl)`);**
`font-size: 16px; font-weight: 400; background-color: #ffffff; color: #013126`

### `.hiw--content`
`visibility: hidden; opacity: 0; transition: all 0.3s linear`
- `@media (max-width: 478px)`: `visibility: visible; opacity: 1`

### HOVER — `.hiw--steps:hover`
| Target | Property | Before | After |
|---|---|---|---|
| `.hiw--steps-image` | `height` | `444px` | **`319px`** |
| `.hiw--steps-image` | `transform` | `scale(1.05)` | **`scale(1)`** |
| `.hiw--steps-image-block` | `min-height` | `444px` | **`319px`** |
| `.hiw--content` | `visibility` / `opacity` | `hidden` / `0` | `visible` / `1` |

All four transition with `all 0.3s linear`. This is what reveals the text: the card height is
fixed at 444px, so shrinking the photo by 125px opens exactly enough room for the content.

### `.step--icon-box`
`display: flex; flex-direction: row; gap: 16px`
- `.icon`: `min-width: 30px; height: 30px; line-height: 30px` → render `<StepNumberIcon step={n} />` (31x31)
- `h4`: **`font-size: var(--hhcp-h4)` (20px); `line-height: 24.16px`; `font-weight: 500`;
  `color: #013126`; `margin-bottom: 16px`**
- `p`: **`font-size: 16px; line-height: 24px; color: rgba(1, 49, 38, 0.8)`**

## Content (verbatim, in order)

| # | Pill (`h3`) | `h4` | `p` | Image |
|---|---|---|---|---|
| 1 | `Pre-Screening Quiz` | `Take Our Pre-Screening Quiz` | `Complete a simple questionnaire to determine if we can support you.` | `steps-01-prescreening.jpg` |
| 2 | `Book a Consultation` | `Schedule at Your Convenience` | `Choose a time that suits you and book your telehealth appointment online.` | `steps-02-book-consultation.webp` |
| 3 | `Attend Your Appointment` | `Speak with an AHPRA-registered practitioner` | `Join your video consultation with one of our AHPRA-registered practitioners.` | `steps-03-attend-appointment.jpg` |
| 4 | `Ongoing Support` | `Receive Care & Follow-Up` | `We provide ongoing support, follow-up consultations, and are here to guide you.` | `steps-04-ongoing-support.jpg` |

Eyebrow: `GET STARTED` · H2: `Access Healthcare Support In Four Simple Steps`

### Image alt text (verbatim)
1. `A woman with short light brown hair in a denim shirt is lying on a couch, smiling while looking at her smartphone.`
2. `A male doctor in a white coat with a stethoscope talks on the phone.`
3. `A person sits at a desk having a video call with another person.`
4. `Older man with gray hair and beard smiling, holding his chest.`

Image base path: `/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/images/`

## Responsive behaviour
- **≥1200px:** 4 columns, gap 13.5px, hover reveal active
- **≤1199px:** 2 columns
- **≤767px:** 1 column, gap 45px
- **≤478px:** cards `height: auto; overflow: visible`; photo 360px; **content always visible**
  (the hover reveal is disabled on small phones)
