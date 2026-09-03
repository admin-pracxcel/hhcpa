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

## 6. The header is pinned, and the announcement strip furls away

**Requested:** make the header sticky. Asked which of three shapes was wanted; the
answer was the strip scrolling away with the white pill pinning on its own.

**Target behaviour:** `.header--container` is `position: absolute; top: 0` with
`z-index: 1`. The whole header — cream strip and white pill together — scrolls off
with the page and does not come back.

**Change** — `SiteHeader.tsx`:

| | Target | Here |
|---|---|---|
| container | `position: absolute` | `position: fixed` |
| announcement strip | scrolls away | furls to nothing over the first 46px of scroll |
| pill's top gap | `13.5px`, static | opens `13.5px` → `20px` over the same 46px |
| pill shadow | none | `0 4px 18px rgba(1,49,38,0.12)`, faded in over the same 46px |

`fixed`, not `sticky`. Sticky puts the element in flow, and every hero here is
`100dvh` starting at the top of the document — the page would grow by the header's own
height and gain a scrollbar it never had. Fixed keeps it out of flow exactly as the
absolute overlay did, so nothing below it moves.

The furl is `grid-template-rows: 1fr → 0fr` on a wrapper around the strip, not an
animated height or a translate on the container. The row measures the strip itself, so
the pill seats flush whatever the strip's content or wrapping does — nothing in the CSS
needs to know how tall the strip is. The `46px` range only sets the pace: it is the
strip's own height (11px padding, 24px line box, 11px padding), which makes the strip
rise at exactly scroll speed so it reads as scrolling away rather than folding shut. If
that height ever drifts, the furl finishes slightly early or late; the header does not
move.

The gap above the pill opens rather than closing, so the pill floats clear of the top
edge instead of being stuck against it. A first pass closed it — reasoning that a gap
left open is a letterbox with the page sliding through it — and that read as jammed
against the edge; opening it was requested after seeing that.

`--hhcp-space-xs` → `--hhcp-space-s`, both existing tokens, because the gap does two
different jobs at the two ends. At rest it separates two stacked bars, and `xs` is the
target's own value — leaving it alone is what keeps the clone at `/home-v2/` matching
pixel for pixel. Pinned, it is the pill's inset from the edge of the screen, and `s`
(18–20px) matches the 20px the container insets by on the sides, so the pill floats by
the same amount all the way round.

The accepted cost: an inset pill with a gap above it means page content passes through
that gap, and a card caught half out of the viewport shows there. The shadow is what
keeps that reading as the page continuing underneath rather than as a fault.

**No scroll listener and no IntersectionObserver.** All three are CSS scroll-driven
animations on `scroll(root block)`, the same mechanism `ScrollRevealParagraph` uses. The
AGENTS.md rule stands.

Two ways it degrades, both to a header that is pinned with the strip still showing:

- browsers without scroll-driven animation support (`@supports`)
- nothing else — deliberately **not** disabled under `prefers-reduced-motion`, unlike
  the two marquees. There is no autonomous motion to spare anyone here: the furl
  advances only as far as the reader scrolls and stops the moment they do.

`--hhcp-header-pinned-h` (110px, in `globals.css`) is the pinned footprint, and
`html { scroll-padding-top }` reads it so an anchor jump does not land its target under
the pill. Two links rely on it: `/services/#book` and `/quiz/#quiz`.

Measured on `/` at 1534×900, 900×800 and 390×844 — strip height and pill top, by scroll
position, at 1534×900:

| scrollY | strip height | pill top |
|---:|---:|---:|
| 0 | 46 | 60 |
| 12 | 34 | 49 |
| 23 | 23 | 40 |
| 34 | 12 | 30 |
| 46 | 0 | 20 |
| 80 | 0 | 20 |

The strip's height falls exactly in step with scroll. Hero heights are unchanged at all
three viewports (900 / 800 / 771, the last being 844 less the 73px CTA bar), so pinning
the header shifted no layout. `/services/#book` lands its target at 100px with the pill
ending at 83px.

## 7. The About dropdown's links match the Services mega panel

**Requested:** the items under About should have the same font style as the mega
panel's items, e.g. "Weight Loss Injections".

**Target behaviour:** the two panels are typeset differently. `.hhcp-hdr__submenu a`
is `font-weight: 600` in flat `#000000` at `line-height: 120%`; the mega panel's
`.hhcp-hdr__mega-list a` is regular weight in `--hhcp-base-80` at `1.4`. They hang off
adjacent items in the same bar, so opening About after Services looked like a menu from
a different site.

**Change** — `SiteHeader.tsx`, `.hhcp-hdr__submenu a`:

| | Target | Here |
|---|---|---|
| `font-weight` | `600` | inherited `400` |
| `color` | `#000000` | `var(--hhcp-base-80)` |
| `line-height` | `120%` | `1.4` |
| hover | row background only | row background **and** `--hhcp-action-dark`, as the mega panel does |

Family and size were already the same in both — DM Sans at `--hhcp-text-s`.

The row's hover background stays. It belongs to this panel rather than to the type, and
a dropdown of plain links with nothing marking the pointer's row is worse than an
inconsistency.

Measured — every computed property on a link in each panel, at 1534px:

| | family | size | weight | line-height | colour |
|---|---|---|---|---|---|
| mega ("Weight Loss Injections") | dmSans | 16px | 400 | 22.4px | rgba(1, 49, 38, 0.8) |
| About ("About Us") | dmSans | 16px | 400 | 22.4px | rgba(1, 49, 38, 0.8) |

## 8. The closing CTA band's heading is centred

**Requested:** the CTA section's title should be centre aligned. Spotted on
`/patient-safety/`, where "Questions about whether telehealth suits you?" set two
ragged-right lines in the middle of an otherwise centred band.

**Target behaviour:** the `h2` in `.cta--section` computes `text-align: start`; only the
paragraph below it carries `text--center`. The flex parent centres the *box*, so a
heading short enough to fit one line still reads centred — the target's own heading does,
which is why this never showed there.

**Change** — `FinalCtaSection.tsx`, on the `h2`:

| | Target | Here |
|---|---|---|
| `text-align` | `start` | `center` |
| `max-width` | none | `880px` |

The width cap comes with it. Centred but uncapped, a long heading sets across the full
1340px container in lines too long to read; 880px breaks it into balanced ones. The body
paragraph below is already capped at 536px for the same reason.

Every page uses this one component for its closing band, so all of them move together.

Measured — the last `h2` on eleven pages at 1534px, and on `/patient-safety/` down the
breakpoints:

| page | computed `text-align` |
|---|---|
| `/`, `/pricing/`, `/faqs/`, `/how-it-works/`, `/contact/`, `/discharge/`, `/about-us/`, `/complaints/` | center |
| `/quiz/`, `/weight-loss-peptides/`, `/patient-safety/` | center |

At 1200 / 991 / 767 / 390px the `/patient-safety/` heading is `center` at every width,
and its box caps at 880px on the two widest.

**Not changed, and why.** Three other sections carry a heading in a band and were checked
at the same time:

- `InlineCtaBand` — a row, text block left and button right. Centring its title would
  break the layout, and it is a mid-page prompt rather than the closing CTA.
- `StatementBand` — heading starts at x=485 in an indented column, not a centred block.
  It is a statement ("This quiz is not for emergencies"), not a call to action.
- `PricingCueBand` — left-aligned across the full container.

Those three are left as they are. If they should match, it is a separate decision about
the statement sections rather than about the CTA.
