# Deliberate deviations from the target

Everything else in this clone is a faithful reproduction. The items below are
requested changes, recorded here so a later reader does not "fix" them back.

## 1. Hero is capped at the viewport, content sits bottom-left

**Requested:** the hero must not exceed the view height; its content sits at the
bottom-left, one standard section space clear of the bottom edge.

**Target behaviour:** `.hero--section` is a flat `height: 106rem` (1060px) at ≥992px,
with the content container pushed down by a fixed `margin-top: 39rem` (390px) and
left-aligned.

**Change** — `HeroSection.tsx`:

| | Target | Here |
|---|---|---|
| section height | `1060px` | `h-[min(1060px,100dvh)] min-h-fit` |
| content position | `margin-top: 390px` | `flex flex-col justify-end` on the section |
| bottom spacing | none (content sits flush) | `pb-[var(--hhcp-section-space-m)]` — 90px desktop |
| ≤991px offset | `margin-top` 390 / 290 / 240 | same values as section `pt` |

`--hhcp-section-space-m` is the token every other section pads with, so the gap under
the hero matches the gaps between everything below it, and scales the same way
(90px → 48px).

`pt-[142px]` is a floor, not spacing: the header is `position: absolute` over the hero
at 122.25px tall, so on a viewport too short for the whole stack the content stops clear
of the logo and `min-h-fit` grows the section rather than clipping the form.

Measured at 1534px wide: 1200px viewport → hero 1060, content bottom gap 90; 900px
viewport → hero 900, gap 90. Headline and form sit flush to the container's left
edge, as in the target.

Below 991px the section is `height: auto`, so top padding is what gives it height.

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
