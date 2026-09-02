# Deliberate deviations from the target

Everything else in this clone is a faithful reproduction. The items below are
requested changes, recorded here so a later reader does not "fix" them back.

## 1. Hero fills exactly one screen, content bottom-left

**Requested:** the hero fills the screen at every viewport — no overflow, no underflow —
with its content at the bottom-left, one standard section space clear of the bottom.

**Target behaviour:** `.hero--section` is a flat `height: 106rem` (1060px) at ≥992px
and `height: auto` below, with the content pushed down by `margin-top: 39rem` (390px).

**Change** — `HeroSection.tsx`:

| | Target | Here |
|---|---|---|
| section height | `1060px` / auto | `h-[100dvh]` |
| ≤767px height | auto | `calc(100dvh - var(--hhcp-sticky-cta-h))` |
| content position | `margin-top: 390px` | `flex flex-col justify-end` on the section |
| bottom spacing | none (content sits flush) | `pb-[var(--hhcp-section-space-m)]` — 90px desktop |

`dvh` rather than `vh`: a mobile browser collapsing its toolbar changes `vh` only on
reload, which leaves the section taller than the visible area.

Below 767px the fixed CTA bar owns the bottom of the screen, so the hero takes the
screen minus that bar and the two together fill it exactly. The bar's height is pinned
to the same `--hhcp-sticky-cta-h` token (73px) instead of being left to its own padding,
so the subtraction cannot drift out of step with it.

`--hhcp-section-space-m` is the token every other section pads with, so the gap under
the hero content matches the gaps between everything below it, and scales the same way
(90px → 48px).

Measured — section height against viewport height:

| viewport | section | sticky bar | total |
|---|---:|---:|---:|
| 1534×1200 | 1200 | — | 1200 |
| 1534×900 | 900 | — | 900 |
| 900×800 | 800 | — | 800 |
| 375×800 | 727 | 73 | 800 |
| 375×667 | 594 | 73 | 667 |

## 2. Halaxy booking widget

Ported at explicit request; see `VISUAL_QA.md` → Known gaps. The embed is the real
clinic's live widget, so the page can take real bookings.

## 3. Announcement bar is centred

**Requested:** the strip above the header should have its text in the centre.

**Target behaviour:** `.banner-7` lays its inner row out with
`justify-content: flex-start`, so "Take our Pre-Screening Quiz" sits hard against
the left edge of the 1340px container.

**Change** — `SiteHeader.tsx`, one value:

| | Before (target) | After |
|---|---|---|
| `.hhcp-hdr__banner-inner` | `justify-content: flex-start` | `justify-content: center` |

Nothing else moves. `.hhcp-hdr__banner-info` already carries `align-items: center`,
which is what centres the stacked link horizontally once that row flips to a
column at ≤478px, so the single change holds at every breakpoint.

## 4. Four service silos live in one Services mega-menu

**Problem:** `HHCPA_Sitemap_and_Navigation.pdf` §3 proposes four separate top-level
service dropdowns. Built that way, the header overflowed the document and produced
a horizontal scrollbar.

Roboto Mono is monospace, so the nav width is exact rather than estimated
(12px advance = 7.2px, plus 0.36px letter-spacing):

| Element | Width |
|---|---:|
| Logo | 145 |
| Nav — 7 items (links 643 + chevrons 100 + gaps 192) | **935** |
| Phone | 84 |
| CTA button | 175 |
| Bar padding + three 67.5px gaps | 250 |
| **Total** | **1589** |
| Available (1340 container − 40 padding) | **1300** |

289px over. `WEIGHT LOSS & PEPTIDES` alone is 166px. Tightening the nav gap from
32px to 18px recovers only ~40px of it, so this was not solvable in CSS.

**Change** — the four silos become columns of a single Services mega-menu:

| | Before | After |
|---|---:|---:|
| top-level items | 7 | 4 |
| nav width | 935 | **378** |
| header total | 1589 | **1032** |

Top row is now `SERVICES · HOW IT WORKS · PRICING · ABOUT`, with 268px of slack.
Every page in the sitemap is still one hover and one click away, and this is what
the original site did — it also had a single Services dropdown.

Two structural details:

- The panel is anchored to `.hhcp-hdr__nav` (`position: relative`) rather than the
  Services `<li>` (`position: static` via `[data-mega]`). Anchored to the `<li>`,
  its right edge would spill past the container at 1340px viewport.
- A gated silo takes its whole column with it, so the sub-pages of a withheld
  service are unreachable from the menu — not just its hub link. Medicinal
  Cannabis is the fifth column and appears on compliance sign-off.

`src/content/nav.test.ts` carries a width budget asserting the rendered top row
stays under the available row, so this regression cannot return silently.

## 5. The care-areas rail is full-bleed and draggable

**Requested:** the "How We Support You" slider spans the full page width, the play/pause
button stays where it was, and the rail can be dragged.

**Target behaviour:** the rail sits inside the 1340px container like everything else, and
Splide's auto-scroll is not draggable (`drag` is not enabled alongside `autoScroll`).

**Change** — `CareAreasSection.tsx`:

- `.hhcp-ca-viewport` breaks out with `width: 100vw; margin-inline: calc(50% - 50vw)`.
  Only the rail escapes; the heading and the control stay in the container, so the
  button is still flush with the container's right edge, 32px under the rail.
  The section's own `overflow: hidden` absorbs the scrollbar's width, so this cannot
  produce a horizontal scrollbar.
- The transport moved from a CSS keyframe animation to a `requestAnimationFrame` loop
  at the same 90px/second. A drag has to take over mid-flight and hand back a new offset
  for the loop to continue from, which a keyframe animation cannot do. This is a rAF
  loop, not a scroll listener — the AGENTS.md rule stands.
- Pointer drag on the viewport, 1:1 with the pointer, wrapping at one copy's width.
  `touch-action: pan-y` keeps vertical page scrolling working on touch.
- `prefers-reduced-motion` stops the auto-advance; dragging still works, since that is
  the user moving it themselves.

Measured at 1534 / 1280 / 768 / 390px: rail width equals the window width at all four,
`documentElement.scrollWidth` equals `clientWidth` (no horizontal scrollbar), the button's
right edge equals the container's right edge, the gap under the rail stays 32px, and a
200px drag moves the track exactly 200px.
