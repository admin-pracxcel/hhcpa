# HeroSection Specification

## Overview
- **Target file:** `src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/HeroSection.tsx`
- **Interaction model:** **static.** Autoplaying looped background video, no scroll behaviour, no
  entrance animation. The only interactive elements are the email form and two links.

## DOM structure
```
section.hero--section                 height 1060px, position relative, overflow hidden
├─ div.hero-bg-wrap                   absolute inset 0, z-index 0
│  ├─ div.gumlet--video > video       100% x 100%, object-fit cover
│  └─ div.section-bg-overlay          absolute inset 0, gradient scrim
└─ div.margin--hero-top               .hhcp-container, margin-top 390px, flex column, gap 45px
   └─ div  (flex column, gap 24px, justify+align center)
      ├─ div (flex column, gap 16px)
      │  ├─ h1   max-width 536px, white
      │  └─ p    max-width 536px, white
      ├─ div  (desktop only, ≤767px hidden) — email form + text link, gap 16px
      └─ div  (desktop hidden, ≤767px shown) — "Get Started Today" button
```

## Computed styles (exact)

### `section.hero--section`
```
height: 1060px            (106rem)     @media (max-width: 991px) { height: auto }
position: relative
overflow: hidden
background-image: url(<hero poster>)   /* poster doubles as the pre-video background */
background-size: cover
background-position: 50% 0%            (top center)
background-repeat: no-repeat
background-blend-mode: overlay
```
`@media (max-width: 478px)` adds a scrim pseudo-element:
```css
.hero--section::before {
  content: ""; position: absolute; inset: 0; width: 100%; height: 100%;
  background-color: var(--neutral-trans-30);   /* rgba(0, 0, 0, 0.3) */
}
```

### `div.hero-bg-wrap`
`position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0`

### `video` (inside `.gumlet--video`, which is `height: 100%; width: 100%`)
`autoplay loop muted playsInline`, `object-fit: cover`, full width/height.
- src: `/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/videos/hero-background.mp4`
- poster: `/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/videos/hero-background-poster.png`
- The source also wires `onclick="this.paused ? this.play() : this.pause()"` — click-to-toggle playback.

### `div.section-bg-overlay`
```
position: absolute; top: 0; left: 0; width: 100%; height: 100%;
background-image: linear-gradient(rgba(0, 0, 0, 0) 0%, #000000 100%);
```
(Transparent at the top, solid black at the bottom — it sits *above* the video.)

### `div.margin--hero-top` (content container)
`.hhcp-container` (max-width 1340px, padding-inline 20px, margin-inline auto)
`position: relative` (so it stacks above the video), `display: flex; flex-direction: column; gap: 45px`
**`margin-top: 390px`** (39rem)
- `@media (max-width: 767px)`: `margin-top: 290px`
- `@media (max-width: 478px)`: `margin-top: 240px`

### Inner blocks
- Outer inner block: `display: flex; flex-direction: column; gap: 24px; justify-content: center; align-items: center`
  — note that despite `align-items: center` the text itself is left-aligned; the children are
  full-width blocks, so headline/copy read left-aligned. Keep the declarations as-is.
- Heading block: `display: flex; flex-direction: column; gap: 16px`

### `h1`
**`font-size: 64px` (fluid `var(--hhcp-h1)`); `line-height: 68.512px` (`calc(4px + 2ex)`);
`font-weight: 400`; `letter-spacing: -0.6px`; `color: #ffffff`; `max-width: 536px`;
`font-family: DM Sans`**

### `p`
**`font-size: 16px` (`var(--hhcp-text-s)`); `line-height: 24px`; `font-weight: 400`;
`color: #ffffff`; `max-width: 536px`**

### Email form — `.book--consultation-form`
Outer: `min-width: 404px; max-width: 500px`
- `@media (max-width: 767px)`: `width: 100%; max-width: 400px; min-width: auto`

Pill container (`.ff-t-container`) — measured **404 x 48px**:
```
display: flex; align-items: center; justify-content: space-between;
border: none; border-radius: 40px;            /* 4rem */
padding: 2px 2px 2px 25px;                    /* 0.2rem 0.2rem 0.2rem 2.5rem */
background-color: #f5fff9;                    /* var(--hhcp-accent) */
position: relative;
```
`:focus-within { outline: 1px solid var(--action-trans-50); }`  /* rgba(88, 237, 162, 0.5) */

Email input:
```
background: transparent; border: none; outline: none; padding: 0;
font-family: "Roboto Mono"; font-size: 12px; font-weight: 500; letter-spacing: 0.36px;
```
`type="email"`, `name="email"`, **`placeholder="E-MAIL"`**

Submit button:
```
padding: 12.3px 20px;                         /* 1.23rem 2rem */
background-color: #58eda2; color: #013126; border: none;
border-radius: 33px;                          /* 3.3rem */
font-family: "Roboto Mono"; font-weight: 500; font-size: 12px;
text-transform: uppercase; letter-spacing: 0.36px; line-height: 1.625;
transition: 0.4s;
```
**Hover / focus:** `background-color: #0c7340` (`--hhcp-action-dark`),
`color: #baf8d9` (`--hhcp-action-light`).
Label: **`Book Consultation`**

This is a demo clone — the form has no backend. Wire `onSubmit` to `preventDefault()`.

### Text link below the form
`Or take your pre-screening quiz here` → `https://www.horizonhealthcarepartners.com.au/quiz/`
`color: #ffffff`, underlined-on-hover behaviour, `transition: all 0.3s linear`.

### Mobile-only button (`@media (max-width: 767px)`)
The form + link block is hidden and replaced by a single `.hhcp-btn`:
label **`Get Started Today`** → `https://www.horizonhealthcarepartners.com.au/quiz/`

## States & behaviours
- **Video:** autoplay, loop, muted, playsInline. Click toggles play/pause (source behaviour).
- **Form focus:** `:focus-within` outline on the pill.
- **Submit hover:** background `#58eda2` → `#0c7340`, colour `#013126` → `#baf8d9`, over `0.4s`.
- **No scroll-triggered anything.**

## Text content (verbatim)
- H1: `Professional Healthcare at Your Fingertips`
- P: `Access registered healthcare professionals from the comfort of your home. Complete our pre-screening and schedule your consultation in minutes.`
- Input placeholder: `E-MAIL`
- Submit: `Book Consultation`
- Link: `Or take your pre-screening quiz here`
- Mobile button: `Get Started Today`

## Responsive behaviour
- **≥992px:** fixed 1060px tall, content pushed down 390px, form visible
- **≤991px:** `height: auto` (section grows with content)
- **≤767px:** `margin-top: 290px`; form block hidden, `Get Started Today` button shown;
  form (if shown) `width: 100%; max-width: 400px`
- **≤478px:** `margin-top: 240px`; extra `rgba(0,0,0,0.3)` scrim over the whole section

## Assets
- `videos/hero-background.mp4`, `videos/hero-background-poster.png`
- No icons.
