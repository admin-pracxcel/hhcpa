# FinalCtaSection Specification

## Overview
- **Target file:** `src/components/sites/.../root-8a5edab2/FinalCtaSection.tsx`
- **Interaction model:** **static.** Second autoplay video band, centred content, same email form
  as the hero. Measured 1585 x 854px.

## Computed styles (exact)

### `section.cta--section`
```
height: 854px;                     /* 85.4rem */   @media (max-width: 991px) { height: auto }
position: relative; overflow: hidden;
display: flex; flex-direction: column; justify-content: center;
padding: var(--hhcp-section-space-m) var(--hhcp-gutter);   /* 90px 60px */
margin: var(--hhcp-section-space-m) 0 var(--hhcp-space-m); /* 90px 0 30px */
background-image: url(<cta poster>);
background-size: cover; background-position: top center; background-repeat: no-repeat;
background-blend-mode: overlay;
```
Plus a full-bleed scrim pseudo-element:
```css
.cta--section::before {
  content: ""; position: absolute; inset: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.3);      /* var(--neutral-trans-30) */
}
```

### `.cta--bg-wrap`
`position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0`
Contains the `<video>` (100% x 100%, `object-fit: cover`) and:

### `.cta--bg-overlay`
`position: absolute; top: 0; left: 0; width: 100%; height: 100%;`
**`background-color: rgba(0, 0, 0, 0.2)`** (`var(--black-trans-20)`)
Note this differs from the hero, which uses a vertical **gradient**; here it is a flat 20% black.

### Video
`autoPlay loop muted playsInline`, click toggles play/pause (source behaviour).
- src: `/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/videos/cta-background.mp4`
- poster: `/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/videos/cta-background-poster.png`

### Content container
`.hhcp-container` with `position: relative` (stacks above the video) and
`display: flex; flex-direction: column; gap: var(--hhcp-space-l)` (45px)
Inner block: `display: flex; flex-direction: column; align-items: center; gap: 32px`

### `h2` — styled as an h1
**`font-size: var(--hhcp-h1)` (64px); `line-height: var(--hhcp-heading-lh)` (68.512px);
`font-weight: 400`; `letter-spacing: -0.6px`; `color: #ffffff`; `text-align: center`**
Text: `Easy Access, Professional Care`

### `p`
**`font-size: 16px; line-height: 24px; color: #ffffff; text-align: center; max-width: 536px`**
(`width--m` = 536px, same token as the hero copy)
Text: `Book online consultations with AHPRA-registered medical practitioners. Our streamlined telehealth process is simple and confidential.`

### Form block
`display: flex; flex-direction: column; align-items: center; gap: 16px`

The email form is **identical** to the one in `HeroSection` — reuse the same markup and values:
- Wrapper: `min-width: 404px; max-width: 500px`; `@media (max-width: 767px)`:
  `width: 100%; max-width: 400px; min-width: auto`
- Pill: `display: flex; align-items: center; justify-content: space-between; border: none;`
  `border-radius: 40px; padding: 2px 2px 2px 25px; background-color: #f5fff9; position: relative`
  `:focus-within { outline: 1px solid rgba(88, 237, 162, 0.5) }`
- Input: `background: transparent; border: none; outline: none; padding: 0; flex: 1;`
  `font-family: Roboto Mono; font-size: 12px; font-weight: 500; letter-spacing: 0.36px;`
  `color: #013126`; `type="email"`, `name="email"`, `placeholder="E-MAIL"`, plus an `aria-label`
- Submit: `padding: 12.3px 20px; background-color: #58eda2; color: #013126; border: none;`
  `border-radius: 33px; font-family: Roboto Mono; font-weight: 500; font-size: 12px;`
  `text-transform: uppercase; letter-spacing: 0.36px; line-height: 1.625; transition: 0.4s;`
  `white-space: nowrap`. Hover/focus → `background-color: #0c7340; color: #baf8d9`.
  Label `Book Consultation`.
- Demo only: `onSubmit={(e) => e.preventDefault()}`

### Text link below the form
`Or take your pre-screening quiz here` → `https://www.horizonhealthcarepartners.com.au/quiz/`
`color: #ffffff`; `transition: all 0.3s linear`; underline on hover.

## Responsive behaviour
- **≥992px:** fixed 854px tall, content vertically centred
- **≤991px:** `height: auto`
- **≤767px:** form goes `width: 100%; max-width: 400px`
