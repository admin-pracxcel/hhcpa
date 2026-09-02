# Deliberate deviations from the target

Everything else in this clone is a faithful reproduction. The items below are
requested changes, recorded here so a later reader does not "fix" them back.

## 1. Hero is capped at the viewport height, and its content is bottom-anchored

**Requested:** the hero section should not exceed the view height. The content should
be positioned from the bottom of the section, not pushed down from the top.

**Target behaviour:** `.hero--section` is a flat `height: 106rem` (1060px) at ≥992px,
with the content container pushed down by a fixed `margin-top: 39rem` (390px).
On a 727px-tall window the hero therefore ran 333px past the fold.

**Change** — `HeroSection.tsx`:

| | Before (target) | After |
|---|---|---|
| section height | `h-[1060px]` | `h-[min(1060px,100dvh)] min-h-fit` |
| content position | `mt-[390px]` on the container | `flex flex-col justify-end` + `pb-[288.36px]` on the section |
| top clearance | — | `pt-[142px]` on the section |
| ≤991px offset | `margin-top` 390 / 290 / 240 | `pt-[390px]` / `pt-[290px]` / `pt-[240px]` on the section |

Capping the height is what forces the second row. A top offset measures the content
from an edge that is no longer fixed: cap the section to a 700px viewport and the
390px offset walks the email form straight out of the `overflow: hidden` box. Anchoring
to the bottom inverts the dependency — the form's distance from the bottom edge is the
constant, and the slack that a shorter viewport removes comes off the top, above the
headline, where there is nothing to lose.

`288.36px` is measured, not chosen. At the target's own 1060px height and 390px top
margin, that is exactly what is left below the 381.64px content block, so **any viewport
tall enough to hold the original design renders identically to the target.**

`pt-[142px]` is a floor rather than spacing. The header is `position: absolute` over the
hero and measures 122.25px, so on a viewport too short to hold the whole stack the
content stops there instead of sliding under the logo; `min-h-fit` then grows the
section a little past the fold. Losing the CTA is worse than a short scroll.

Resolved behaviour, measured at 1534px wide:

| viewport height | hero | content top | gap below content |
|---:|---:|---:|---:|
| 1200 | 1060 | 390 | 288.36 |
| 1060 | 1060 | 390 | 288.36 |
| 900 | 900 | 230 | 288.36 |
| 700 | 812 | 142 | 288.36 |

**One consequence worth knowing.** The content block's height varies with viewport
*width*, because the headline rewraps: 381.64px at 1534px wide, 366.13px at 1200px.
With the bottom fixed, that variance now lands on the top offset (390px at 1534px wide,
405.52px at 1200px) rather than on the gap below. The target holds the top constant and
lets the bottom vary. Section heights are unchanged either way, so the `VISUAL_QA.md`
comparison still holds.

Below 991px the section is `height: auto`, so there is no bottom to anchor to and the
top offset is the mechanism again — carried as padding on the section, the same box the
height belongs to. Those are the target's own 390 / 290 / 240 values; the viewport-scaled
offset that used to stand in for them at 768–991px is gone, so that band now matches the
target exactly where it previously ran ~57px short.

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
