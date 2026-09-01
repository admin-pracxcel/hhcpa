# FeatureMarquee Specification

## Overview
- **Target file:** `src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FeatureMarquee.tsx`
- **Interaction model:** **time-driven** — a continuous, never-stopping horizontal marquee.
  Not a click carousel, not scroll-driven. Measured section height: 81px.

## Source mechanism
Splide + the `auto-scroll` extension, configured entirely via `data-splide` on the track:
```json
{
  "type": "loop", "drag": "free", "focus": "center", "autoWidth": true,
  "pagination": false, "arrows": false, "lazyLoad": false,
  "gap": "var(--space-xl)",
  "autoScroll": { "speed": 0.5 },
  "breakpoints": { "766": { "gap": "2.8rem" } }
}
```
`speed: 0.5` is **0.5px per animation frame ≈ 30px/second**, scrolling right→left, seamless loop.

**Implementation:** do NOT pull in Splide. Reproduce with a pure CSS marquee — render the 5 items
twice back-to-back inside a flex track and translate the track by `-50%` over a duration derived
from the content width, `animation-timing-function: linear`, `animation-iteration-count: infinite`.
Duplicating the list is what makes the wrap seamless. Mark the duplicate `aria-hidden="true"`.

## Computed styles (exact)

### `section.feature-slider--section`
`padding: 30px 0` (`3rem 0`); `row-gap: 0; column-gap: 0`

### Slider viewport `.feature-text-slider`
`position: relative; overflow: hidden` — plus edge fade masks:
```css
.feature-text-slider::before {
  content: ""; width: 150px; height: 100%;
  position: absolute; top: 0; bottom: 0; left: 0; z-index: 1;
  background-image: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
}
.feature-text-slider::after {
  content: ""; width: 150px; height: 100%;
  position: absolute; top: 0; right: 0; z-index: 1;
  background-image: linear-gradient(-90deg, #ffffff, rgba(255, 255, 255, 0));
}
```
The viewport sits inside the standard `.hhcp-container`.

### Track
`display: flex; align-items: center; width: max-content`
**`gap: var(--hhcp-space-xl)`** (42.645px → 67.5px fluid)
- `@media (max-width: 766px)`: `gap: 28px`

### Slide `.feature-text-slide`
`min-width: 0; width: auto; flex: none`

### Item row `.feature-text-slider-bullet`
`position: relative; display: flex; justify-content: center; align-items: center;`
`flex-wrap: nowrap;` **`gap: 36px`** (`3.6rem` — the last of three cascading rules wins)

### Bullet icon
A solid dot: `10px` diameter, colour **`#58eda2`** (`var(--hhcp-action)`).
Source uses Font Awesome `fa-circle` at `icon--10` / `icon--secondary`. Render it as a plain
`<span>` with `width: 10px; height: 10px; border-radius: 50%; background: #58eda2; flex: none`
— visually identical, no icon font needed.

### Label `.feature--text`
**`font-family: DM Sans; font-size: 14px` (`var(--hhcp-h5)`); `font-weight: 500`;
`font-style: italic`; `color: rgba(1, 49, 38, 0.76)`; `white-space: nowrap`**

## Text content (verbatim, in order)
1. `Streamlined Digital Experience`
2. `Clear, Upfront Costs`
3. `Care Centred on You`
4. `AHPRA-Registered Practitioners`
5. `Clinical Care, Human Touch`

## States & behaviours
- Marquee runs continuously; there is no pause-on-hover in the source.
- No hover, click, or focus states on the items (they are not links).
- `globals.css` already ships a `prefers-reduced-motion` rule that stops `.hhcp-marquee-track`
  — put that class on the animated track so it is honoured.

## Responsive behaviour
- **Desktop:** track gap fluid 42.6 → 67.5px
- **≤766px:** track gap `28px`
- Edge fades stay 150px at all sizes.
- Section padding `30px 0` at all sizes.
