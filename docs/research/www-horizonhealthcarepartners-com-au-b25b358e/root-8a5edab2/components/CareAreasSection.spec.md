# CareAreasSection Specification

## Overview
- **Target file:** `src/components/sites/.../root-8a5edab2/CareAreasSection.tsx`
- **Interaction model:** **time-driven carousel with a play/pause toggle.** Continuous
  auto-scroll, NOT slide-by-slide stepping. Section box 1585 x 1056px.

## Source slider config (`data-x-slider`, Splide + auto-scroll)
```json
{ "type":"loop", "gap":"0px", "perPage":"2", "perMove":1, "speed":400, "interval":3000,
  "arrows":false, "pagination":false, "drag":true, "snap":false,
  "easing":"cubic-bezier(0.25, 1, 0.5, 1)", "mediaQuery":"max",
  "autoScroll": { "speed":1.5, "rewind":false, "pauseOnHover":false, "pauseOnFocus":false },
  "breakpoints": { "1279": { "perPage":"2" }, "478": { "perPage":"1" } } }
```
Because the **auto-scroll** extension is active, `interval`/`speed:400` do not apply — the track
glides continuously at **1.5px per frame ≈ 90px/second**, right→left, looping. `pauseOnHover` and
`pauseOnFocus` are both **false**, so hovering must NOT pause it. The only thing that pauses it is
the explicit play/pause button.

**Implementation:** do not install Splide. Use the same duplicated-track CSS marquee as
`FeatureMarquee`, but make it a client component holding one boolean of state that flips
`animation-play-state` between `running` and `paused`. At 2-per-page each slide is ~670px, so one
copy of 5 slides is ~3350px → at 90px/s that is **~37s** for the animation duration.

## Computed styles (exact)

### `section.cta-40`
`padding: 90px 60px` (`var(--hhcp-section-space-m) var(--hhcp-gutter)`); `overflow: hidden`; `gap: 0`

### Container
`.hhcp-container` (padding-inline 0 here) + `display: flex; flex-direction: column;`
**`gap: var(--hhcp-space-xl)`** (67.5px desktop)

### `.cta-40__container-info` (heading block)
`display: flex; flex-direction: column; align-items: center;`
**`gap: var(--hhcp-content-gap)` (30px); `padding-inline: var(--hhcp-space-xl)` (67.5px)**
- `@media (max-width: 991px)`: `padding-inline: var(--hhcp-space-m)` (30px)
- Eyebrow: 10px `#58eda2` dot + `How We Support You`, Roboto Mono 12px/500 uppercase,
  `letter-spacing: 0.36px`, `color: #013126`
- `h2`: `font-size: var(--hhcp-h2)` (42px); `line-height: var(--hhcp-heading-lh)` (46.336px);
  `font-weight: 400`; `letter-spacing: -0.42px`; `color: #013126`; **`text-align: start`**
  (the block is `align-items: center` so the h2 box is centred, but its text is left-aligned)

### Slider viewport
The track container is `overflow: visible` in the source (slides bleed past the container edge).
Wrap it so the section's `overflow: hidden` does the clipping — that reproduces the same result.

### Slide `.care--areas-slide` — measured 670 x 654px
`position: relative; width: auto; min-width: 0;` **`padding: 0 8px`** (`0.8rem`)
At `perPage: 2` inside the 1340px container each slide is **670px** wide.
- `@media (max-width: 478px)`: 1 per page → slide width = 100% of the container

### `img.care--areas-slide-image` — measured 654 x 654px
`width: 100%; max-width: 700px;` **`aspect-ratio: 1 / 1`**; `border-radius: 10px`;
`object-fit: cover` (source computes `fill` because the intrinsic image is already square —
use `cover` so it stays correct at any width)

### `h3.care--areas-slide-heading`
**`position: absolute; bottom: 40px; left: 56px;`
`font-size: 24px; line-height: 28.192px; font-weight: 400; color: #ffffff; max-width: 238px`**
- Mobile variant (`@media (max-width: 478px)`):
  **`font-size: 20px; max-width: 180px; left: 30px; bottom: 20px`**
The heading sits over the photo — the photo has no scrim, the text just overlays it.

### `.play--pause-btns` and the toggle
`display: flex; align-items: flex-end` (right-aligned under the carousel).
Button: `background-color: transparent; padding: 0; border: none; cursor: pointer;`
`font-size: 30px`; icon colour `#013126`.
Swap `<PlayCircleIcon />` ⇄ `<PauseCircleIcon />` (both 30px, `currentColor`) to match state:
show **Pause** while running, **Play** while paused.
Give it `aria-label` "Pause carousel" / "Play carousel" and `aria-pressed`.

The outer block wrapping slider + controls has `gap: 32px`.

## Content (verbatim, in order)
Eyebrow: `How We Support You` · H2: `Professional Medical Consultations`

Image base path: `/images/`

| # | Heading | Image | Alt |
|---|---|---|---|
| 1 | `Pain Management Support` | `care-pain-management.jpg` | `Two people sit facing each other indoors, holding hands and smiling, engaged in a warm and friendly conversation.` |
| 2 | `Physical Wellbeing` | `care-physical-wellbeing.jpg` | `A smiling person with a bald head, wearing a striped shirt, sits indoors.` |
| 3 | `Mental Wellbeing` | `care-mental-wellbeing.jpg` | `A man and a woman sit indoors, looking at a laptop together.` |
| 4 | `Complex Health Concerns` | `care-complex-health.jpg` | `A woman in athletic wear performs a side lunge stretch on a path outdoors.` |
| 5 | `General Health` | `care-general-health.jpg` | `A woman and man are sitting close together on a bed or couch.` |

## Responsive behaviour
- **≥1280px:** 2 slides visible
- **1280–479px:** still 2 per page
- **≤478px:** 1 per page; heading 20px / left 30px / bottom 20px
- Heading block padding-inline drops from 67.5px to 30px at ≤991px
