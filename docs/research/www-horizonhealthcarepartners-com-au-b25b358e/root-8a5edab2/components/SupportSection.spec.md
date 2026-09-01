# SupportSection Specification

## Overview
- **Target file:** `src/components/sites/.../root-8a5edab2/SupportSection.tsx`
- **Interaction model:** **static.** This is only the mint band's heading; the `BookingWizard`
  component renders inside it as `children`.
- The whole band (heading + wizard) measures 1585 x 1991px.

## Computed styles (exact)

### `section`
**`background-color: #f5fff9`** (`var(--hhcp-accent)`)
**`padding: 90px 60px`** (`var(--hhcp-section-space-m) var(--hhcp-gutter)`)

### Heading container
`width: 1340px; max-width: 100%; margin-inline: auto; padding: 0;`
`display: flex; flex-direction: column;` **`gap: 30px`**

### Heading block
`display: flex; flex-direction: column; align-items: center;` **`gap: 20px`**
- Eyebrow row: `display: flex; align-items: center; gap: 12px`
  - dot: 10px circle, `background: #58eda2`
  - label `How We Support You`: Roboto Mono 12px/500 uppercase, `letter-spacing: 0.36px`,
    `color: #013126`
- `h2`: **`font-size: var(--hhcp-h2)` (42px); `line-height: var(--hhcp-heading-lh)` (46.336px);
  `font-weight: 400`; `letter-spacing: -0.42px`; `color: #013126`; `text-align: center`;
  `max-width: 804px`** (the source's `width--l` = 60% of the 1340px content width)
  Text: `Your health at your fingertips - anytime, anywhere`

## Composition
Render `{children}` immediately after the heading container — the page passes `<BookingWizard />`.
The wizard supplies its own outer padding (`40px 20px`) and its own background (`#f4fffa`), which
is *very slightly* different from this section's `#f5fff9`. Keep both; do not unify them.

## Responsive behaviour
No breakpoint-specific overrides. Padding and type stay fluid via the clamp tokens; the heading is
centred and `max-width: 100%`.
