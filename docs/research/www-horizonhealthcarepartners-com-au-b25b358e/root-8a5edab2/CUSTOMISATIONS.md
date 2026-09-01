# Deliberate deviations from the target

Everything else in this clone is a faithful reproduction. The items below are
requested changes, recorded here so a later reader does not "fix" them back.

## 1. Hero is capped at the viewport height

**Requested:** the hero section should not exceed the view height.

**Target behaviour:** `.hero--section` is a flat `height: 106rem` (1060px) at ≥992px,
with the content container pushed down by a fixed `margin-top: 39rem` (390px).
On a 727px-tall window the hero therefore ran 333px past the fold.

**Change** — `HeroSection.tsx`, two values:

| | Before (target) | After |
|---|---|---|
| section height | `h-[1060px]` | `h-[min(1060px,100dvh)] min-h-fit` |
| container offset | `mt-[390px]` | `mt-[min(390px,37dvh)]` |

The offset had to move too. The content block measures 382px tall, so at
`margin-top: 390px` it ends at 772px — capping the height alone would have left the
section `overflow: hidden` clipping the email form on any viewport under 772px.

`37dvh` crosses 390px at ~1054px of viewport height, so **any viewport tall enough to
hold the original design still gets the exact original 1060px / 390px values.** The
scaling only engages once the hero would otherwise overflow.

`min-h-fit` is the safety net: below roughly 610px of viewport height the content no
longer fits at all, and the section grows a few pixels past the fold rather than
clipping the headline or the form. Losing the CTA is worse than a short scroll.

Resolved behaviour:

| viewport height | hero | container offset | result |
|---:|---:|---:|---|
| 1200 | 1060 | 390 | original design, unchanged |
| 1060 | 1060 | 390 | original design, unchanged |
| 900 | 900 | 333 | fits |
| 727 | 727 | 269 | fits |
| 650 | 650 | 241 | fits |
| 600 | 604 | 222 | grows 4px rather than clipping |

The `≤991px` breakpoint is untouched — the hero there is still `height: auto` and
content-driven, exactly as the target has it, so mobile is unaffected.

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
