# BlogSection Specification

## Overview
- **Target file:** `src/components/sites/.../root-8a5edab2/BlogSection.tsx`
- **Interaction model:** **static**, with a row hover tint. Three post rows.

## Computed styles (exact)

### `section`
`padding: var(--hhcp-section-space-m) var(--hhcp-gutter)`

### Heading row (`.heading` — here it is a ROW, not a column)
`display: flex; flex-direction: row; justify-content: space-between; gap: 20px`
- Left: eyebrow (10px `#58eda2` dot + `Our Health & Wellness Blogs`, Roboto Mono 12px/500
  uppercase, `letter-spacing: 0.36px`, `color: #013126`) above `h2`
- `h2` `Our Knowledge Hub`: `font-size: var(--hhcp-h2)` (42px);
  `line-height: var(--hhcp-heading-lh)`; `font-weight: 400`; `letter-spacing: -0.42px`;
  `color: #013126`
- Right: `.button--container` `min-width: 164px` holding the mint CTA
- `@media (max-width: 767px)`: the row stacks (`flex-direction: column`)

### CTA (same mint button as ApproachSection, not full width)
```
min-height: 52px; padding: 12.132px 19.2px; border-radius: 800px;
background-color: #58eda2; border: 1px solid #58eda2; color: #013126;
font-family: Roboto Mono; font-size: 12px; font-weight: 500;
text-transform: uppercase; letter-spacing: normal;
display: inline-flex; align-items: center; justify-content: center; gap: 8px;
transition: all 0.3s linear;
```
plus a trailing 10px `currentColor` dot.
Hover: button `box-shadow: 5px 5px 25px 0 rgba(33, 33, 33, 0.1)`;
dot `box-shadow: 0 0 0 3px rgba(1, 49, 38, 0.25)`.
Label `Read All Blogs` → `https://www.horizonhealthcarepartners.com.au/articles/`

### `.post--list`
`display: flex; flex-direction: column; gap: 30px`

### `.post--list-item` (each row) — measured 1340 x 265px
```
display: flex; flex-direction: row; align-items: flex-start;
gap: var(--hhcp-space-m) (30px);
padding: 32px 16px;
border-top: 1px solid rgba(236, 236, 236, 0.3);
border-radius: 4px;
transition: all 0.3s linear;
```
**Hover: `background-color: #f5fff9`** (`var(--hhcp-accent)`)
- `@media (max-width: 767px)`: `flex-direction: column`; `gap: var(--hhcp-space-xs)`

Row children, in DOM order:
1. `.post--meta-info` — `width: 100%; max-width: 368px; display: flex; flex-direction: row;`
   **`gap: 67.5px`** (`var(--hhcp-space-xl)`)
   - topic link: Roboto Mono 12px/500 uppercase, `letter-spacing: 0.36px`,
     `color: rgba(1, 49, 38, 0.8)`
   - `.post--meta`: `display: flex; flex-direction: column; gap: 4px; align-items: flex-start`
     — two lines, same type treatment as the topic link
   - `@media (max-width: 767px)`: `justify-content: space-between`; `.post--meta` aligns to the end
2. Title block — `width: 580px` (`flex: 0 1 auto`)
   - `h3`: **`font-size: var(--hhcp-h4)` (20px); `line-height: 24.16px`; `font-weight: 500;`
     `color: #013126`**; wraps a link to the article
3. `.post--list-image` — an `<a>` wrapping the `<img>`
   **`width: 300px; max-width: 300px; min-height: 200px; border-radius: 4px;`
   `transition: all 0.3s linear`**
   - `img`: `width: 100%; height: 200px; object-fit: cover; border-radius: 4px`
   - `@media (max-width: 767px)`: `max-width: 100%`, and the image moves to **first** in the
     visual order (`order--first-m` → `order: -1`)
   - `@media (max-width: 478px)`: image `max-width: 100%`

## Content (verbatim)
Eyebrow: `Our Health & Wellness Blogs` · H2: `Our Knowledge Hub` · CTA: `Read All Blogs`

Image base path: `/images/`

| # | Topic | Read time | Date | Title | href | Image | Alt |
|---|---|---|---|---|---|---|---|
| 1 | `General` | `3 minutes` | `May 05, 2026` | `Why Weight Loss is Difficult to Maintain, and What Actually Works Long-Term` | `/article/why-weight-loss-is-difficult-to-maintain-and-what-actually-works-long-term/` | `blog-weight-loss.jpeg` | `Two women exercising outdoors in activewear, representing a healthy active lifestyle for sustainable long-term weight management` |
| 2 | `General` | `3 minutes` | `May 05, 2026` | `Why Sleep is Essential for Chronic Pain, Weight, and Overall Health` | `/article/why-sleep-is-essential-for-chronic-pain-weight-and-overall-health/` | `blog-sleep-health.jpg` | `Woman sitting on bed stretching in the morning, representing the connection between healthy sleep and overall wellbeing` |
| 3 | `General` | `2 minutes` | `May 05, 2026` | `Why Sleep Matters in Chronic Pain` | `/article/why-sleep-matters-in-chronic-pain/` | `blog-sleep-pain.jpg` | `Young woman sleeping peacefully in white sheets, representing the importance of quality sleep for chronic pain relief` |

All article hrefs are absolute on `https://www.horizonhealthcarepartners.com.au`.
Topic links all point to `https://www.horizonhealthcarepartners.com.au/topic/general/`.

## Responsive behaviour
- **≥768px:** rows are `meta | title | image` left-to-right
- **≤767px:** rows stack to a column, image first, meta row spreads `space-between`
