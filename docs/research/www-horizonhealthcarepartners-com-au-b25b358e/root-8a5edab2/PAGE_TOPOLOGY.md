# Page Topology — horizonhealthcarepartners.com.au (`/`)

- **app-root:** `.`
- **site-key:** `www-horizonhealthcarepartners-com-au-b25b358e`
- **page-key:** `root-8a5edab2`
- **Destination route:** `src/app/page.tsx` (first clone into an untouched template scaffold)
- **Source stack:** WordPress 7.1 + Bricks Builder + Automatic.css + Splide + FluentForms
- **Document height @1534px viewport:** 11697px

## Layout model

`<body>` has exactly three children: `<header id="brx-header">`, `<main id="brx-content">`,
`<footer id="brx-footer">`.

The header is **not sticky**. `.header--container` is `position: absolute; top:0; left:0; right:0;
z-index:1`, so the announcement bar + nav overlay the top of the hero video and scroll away with
the page. Verified by diffing computed styles at `scrollY = 0` and `scrollY = 600` — **zero**
properties change, and no class is added.

There is no smooth-scroll library (no Lenis, no Locomotive), no scroll-snap, and no
`animation-timeline`. Scrolling is native.

Single content container: `width: 1340px; max-width: 100%; padding-inline: 20px; margin-inline: auto`.

## Sections, in visual order

| # | Component | Class hook | Height | Background | Interaction model |
|---|-----------|-----------|--------|------------|-------------------|
| — | `SiteHeader` | `.header--container` | 124px | transparent / cream bar + white pill | static (absolute overlay) |
| 0 | `HeroSection` | `#hero-section-04-video` | 1060px | autoplay video + overlay | static |
| 1 | `FeatureMarquee` | `.feature-slider--section` | 81px | transparent | **time-driven** (Splide auto-scroll) |
| 2 | `SupportSection` + `BookingWizard` | `.bg--accent` | 1991px | `#f5fff9` | **click-driven** multi-step wizard |
| 3 | `PricingSection` | `.pricing--section` | 901px | transparent | static (hover on cards) |
| 4 | `StepsSection` | — | 799px | transparent | static (hover on step cards) |
| 5 | `StorySection` | — | 853px | transparent | static |
| 6 | `CareAreasSection` | `.cta-40` | 1056px | transparent | **time-driven** (Splide carousel + play/pause) |
| 7 | `ApproachSection` | `.cta--02` | 984px | `#01221b` (dark) | static |
| 8 | `BlogSection` | — | 1243px | transparent | static (hover on post rows) |
| 9 | `FinalCtaSection` | `.cta--section` | — | autoplay video + overlay | static |
| 10 | `FaqSection` | `.faq-3` | — | transparent | **click-driven** accordion |
| — | `SiteFooter` | `.footer-16` | — | `#013126` (dark) | static |

## Z-index layers

1. `.header--container` — `z-index: 1` (overlays hero)
2. Hero/CTA video wrap — `z-index: -1` behind content, with a gradient overlay above it
3. Mobile menu overlay — `z-index: 998`, drawer `z-index: 999`

## Breakpoints (from the source's own media queries)

- `991px` — desktop nav collapses to the hamburger drawer; most 2-column grids stack
- `767px` — card grids drop to one column
- `478px` — small-phone adjustments (announcement bar stacks, logo shrinks to 22px)

Type and spacing are **fluid** between these via `clamp()`, so most sizing needs no media query
at all.
