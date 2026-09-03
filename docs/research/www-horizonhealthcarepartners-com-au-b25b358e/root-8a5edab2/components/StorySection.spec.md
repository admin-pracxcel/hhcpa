# StorySection Specification

## Overview
- **Target file:** `src/components/sites/.../root-8a5edab2/StorySection.tsx`
- **Interaction model:** **static.** Two-column text + photo. Only the CTA has a hover state.
- Measured section height: 853px.

## DOM structure
```
section                        padding: var(--hhcp-section-space-m) var(--hhcp-gutter)
└─ .hhcp-container
   └─ .grid--2                 grid, 2 equal cols, gap 0, align-items center
      ├─ div
      │  └─ .about--content    width 410px, flex column, gap 32px
      │     ├─ div             flex column, gap 20px, align-items flex-start
      │     │  ├─ eyebrow row  dot + "OUR STORY"
      │     │  └─ h2
      │     ├─ p               two paragraphs separated by a double <br>
      │     ├─ ul              flex column, gap 16px, padding 0, list-style none
      │     │  └─ li > .list--item   flex row, gap 13.3px → CheckCircleIcon + text
      │     └─ a               CTA, width 100%
      └─ img                   align-self stretch, object-fit cover
```

## Computed styles (exact)

### `.grid--2`
`display: grid; grid-template-columns: 1fr 1fr; gap: 0; align-items: center`
(measured 670px + 670px inside the 1340px container)
- `@media (max-width: 991px)` (`grid--m-1` + `gap--m-m`): `grid-template-columns: 1fr;`
  `gap: var(--hhcp-space-m)` (30px)

### `.about--content`
**`width: 410px`**; `display: flex; flex-direction: column; gap: 32px`
(On mobile let it go `width: 100%`.)

### Heading block
`display: flex; flex-direction: column; gap: 20px; align-items: flex-start`
- Eyebrow: 10px `#58eda2` dot + `OUR STORY` in Roboto Mono 12px/500 uppercase,
  `letter-spacing: 0.36px`, `color: #013126`, row `gap: 12px`, `align-items: center`
- `h2`: `font-size: var(--hhcp-h2)` (42px); `line-height: var(--hhcp-heading-lh)`;
  `font-weight: 400`; `letter-spacing: -0.42px`; `color: #013126`

### Body copy `p`
**`font-size: 16px; line-height: 24px; color: rgba(1, 49, 38, 0.8); max-width: 100%`**
It is a single `<p>` containing `<br><br>` between the two paragraphs — reproduce with two
`<br />` elements (or two `<p>`s with matching spacing; the double `<br>` is simplest and exact).

### `ul` and `.list--item`
`ul`: `display: flex; flex-direction: column; gap: 16px; padding: 0; margin: 0; list-style: none`
`.list--item`: `display: flex; flex-direction: row; gap: 13.3px; align-items: center`
- Icon: `<CheckCircleIcon />` at 24x25, `color: rgba(1, 49, 38, 0.8)`, `flex: none`
- Text: `font-size: 16px; line-height: 24px; color: rgba(1, 49, 38, 0.8)`

### CTA `a`
Classes on source: `.btn--hover .btn--action .btn--icon .width--full`
```
width: 100%; min-height: 52px;
padding: 12.132px 19.2px; border-radius: 800px;
background-color: #58eda2; border: 1px solid #58eda2; color: #013126;
font-family: Roboto Mono; font-size: 12px; font-weight: 500;
text-transform: uppercase; letter-spacing: normal;
display: flex; align-items: center; justify-content: center; gap: 8px;
transition: all 0.3s linear;
```
It contains a trailing 10px solid dot (source uses `fa-circle` at `font-size: 1rem`) —
render as a `<span>`: `width: 10px; height: 10px; border-radius: 50%; background: currentColor;
flex: none; transition: all 0.3s linear`.
**Hover (`.btn--hover:hover`):**
- button: `box-shadow: 5px 5px 25px 0 rgba(33, 33, 33, 0.1)`
- the dot: `box-shadow: 0 0 0 3px rgba(1, 49, 38, 0.25); border-radius: 100%`

### Right-hand image
`align-self: stretch; width: 100%; object-fit: cover`
`/images/our-story.jpg`
alt: `A person stands on a rocky outcrop overlooking a vast, sunlit landscape of green hills and distant forests under a hazy sky.`
Natural size 768x771.

## Content (verbatim)
- Eyebrow: `OUR STORY`
- H2: `Healthcare That Puts You in Control`
- Paragraph 1: `Horizon Health Care Partners is a telehealth clinic dedicated to providing accessible, practitioner-led medical consultations across Australia. Our AHPRA-registered practitioners offer professional healthcare consultations through our secure online platform.`
- Paragraph 2: `We believe healthcare should be compassionate, transparent, and convenient. Our team is committed to providing medical guidance in a safe, stigma-free environment where every patient feels heard and respected.`
- List: `Flexible appointment schedules` · `AHPRA-registered practitioners` · `Australia-wide support`
- CTA: `Learn more about us` → `https://www.horizonhealthcarepartners.com.au/about-us/`

## Responsive behaviour
- **≥992px:** 2 equal columns, gap 0, vertically centred; text column fixed 410px
- **≤991px:** single column, `gap: 30px`, text column `width: 100%`, image full-width
