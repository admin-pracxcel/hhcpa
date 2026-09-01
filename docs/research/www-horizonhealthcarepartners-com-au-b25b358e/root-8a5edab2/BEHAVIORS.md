# Behaviors — horizonhealthcarepartners.com.au (`/`)

## Scroll sweep

| Observation | Result |
|---|---|
| Header changes on scroll? | **No.** Computed styles identical at `scrollY` 0 and 600; no class toggles. It is `position: absolute`, so it simply scrolls out of view. |
| Scroll-snap? | None. No container has `scroll-snap-type`. |
| Smooth-scroll library? | None. No `.lenis`, no `[data-scroll-container]`. Native scrolling. |
| Scroll-driven tab/accordion switching? | None. |
| Entrance animations? | Bricks ships `bricks-lazy-hidden` for lazy media only — it is an image/video loading class, **not** an animation. No fade-up / stagger on scroll. |
| Parallax? | None. |

Net: the page is visually static on scroll. Do **not** add scroll-triggered behavior.

## Time-driven behavior

### 1. Feature marquee (`.feature-text-slider`, section 1)
Splide with the `auto-scroll` extension, mounted on `DOMContentLoaded`:

```js
new Splide('.feature-text-slider').mount(window.splide.Extensions);
```

Continuous horizontal marquee of 5 text items with a bullet separator between each. Edges are
masked by `::before` / `::after` gradient fades.

### 2. Care-areas carousel (`.care--areas`, section 6)
Splide slider with explicit **play/pause** transport buttons
(`.x-splide__toggle__play` / `.x-splide__toggle__pause`, the `PlayCircleIcon` / `PauseCircleIcon`
in the shared icon module). Autoplays; the visible button swaps to match state.

## Click-driven behavior

### 3. Booking wizard (`#hhp-booking-wrapper`, section 2)
Self-contained multi-step wizard with ~17.9KB of scoped CSS
(`css/booking-wizard-scoped.css`) under its own `--hhp-*` variable namespace:

```
--hhp-primary #013127   --hhp-primary-hover #024536   --hhp-bg #f4fffa
--hhp-white #ffffff     --hhp-text #013127            --hhp-text-light #526f68
--hhp-border #d6e8e1    --hhp-action #013127
```

Note this palette is *close to but not identical* with the page tokens (`#013127` vs the
page-wide `#013126`) — keep the wizard's own values.

Step 1 is a grid of 12 service cards, each an icon + label. Selecting a service advances the
wizard; the final state shows a "Redirecting you to booking..." panel.

### 4. FAQ accordion (`.faq-3__accordion`, section 10)
Standard Bricks accordion. The open row gets `.brx-open`, which rotates/re-styles
`.faq-3__answer-icon` (the filled circle plus → minus). Content wrapper animates open.

## Hover states (from the authored CSS)

| Element | Change |
|---|---|
| `.text-underline-link span` (announcement link) | Animated underline: a `linear-gradient` background sized `100% 0.14rem` wipes out to `0%` on hover, `transition: background-size 0.3s`. Direction flips left→right. |
| `.bricks-nav-menu > li:hover > a` | `color` → `var(--action-dark)` |
| `.bricks-button` / `.hhcp-btn` | `background` mint → primary, text primary → mint, `transition: all 0.3s linear` |
| `.price--btn:hover`, `.btn--hover:hover` | see `css/global-classes.css` |
| `.hiw--steps:hover` | Drives three children at once: `.hiw--steps-image`, `.hiw--steps-image-block`, `.hiw--content` |
| `.post--list-item:hover` | Blog row hover treatment |
| `.text--icon-link:hover` | Icon-link arrow shift |
| `.header-15__menu .bricks-nav-menu .sub-menu .menu-item:hover` | `background-color: var(--neutral-ultra-light)` |

All link transitions inherit the theme rule `transition: all 0.3s linear`.

## Responsive sweep

Derived from the source's own media queries (more precise than eyeballing at 3 widths):

- **≥1185px** — full desktop; nav gap `3.2rem` (32px)
- **991–1184px** — `.register-btn` hidden; nav gap tightens to `1.8rem` (18px)
- **≤991px** — desktop nav → hamburger; drawer is `position: fixed`, `width: 300px`, slides in
  from the left over a `--black-trans-40` overlay, drawer background `var(--primary)`, links
  `var(--action-light)` uppercase. Logo 30px → 28px. Header wrapper gains `--space-xs` inline padding.
- **≤767px** — multi-column card grids collapse to one column (`.post--list`, `.post--meta-info`,
  `.post--list-image`, `.button--container`)
- **≤478px** — announcement bar stacks (`flex-direction: column`, `align-items: flex-start`),
  link gets `margin-bottom: 1rem` and `max-width: 20rem`; logo 22px

## Reduced motion

The source ships no `prefers-reduced-motion` handling. The clone adds one rule stopping the
marquee, which is a safe, non-visual-fidelity improvement.
