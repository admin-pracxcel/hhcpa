# SiteHeader Specification

## Overview
- **Target file:** `src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader.tsx`
- **Interaction model:** static overlay + click-driven mobile drawer + hover-driven "Services" dropdown.
  It is **NOT sticky** and has **no scroll behaviour** — verified by diffing computed styles at
  `scrollY` 0 vs 600 (zero properties change, no classes toggle).

## DOM structure
```
header
└─ div.header--container            position:absolute; inset 0 0 auto; z-index:1
   ├─ div.banner-7                  cream announcement bar
   │  └─ div.banner-7__description  (container 1340px)
   │     └─ div.banner-7__container-info
   │        └─ a.text-underline-link  "Take our " <span>Pre-Screening Quiz</span>
   └─ div.header-15                 margin-top: var(--hhcp-space-xs)
      └─ div.header-15__wrapper     (container 1340px)
         └─ div.header-15__container   the white pill bar
            ├─ a.header-15__logo  > img
            ├─ div.header-15__menu > nav > ul.bricks-nav-menu
            └─ div.header-15__btn-container > a.header-15__btn
```

## Computed styles (exact)

### `.header--container`
`position: absolute; top: 0; right: 0; left: 0; width: 100%; z-index: 1`

### `.banner-7` (announcement bar) — measured height 46px
`background-color: #ede9e3` (`var(--hhcp-cream)`); `display: flex; flex-direction: column; align-items: center`

### `.banner-7__description`
Content container: `width: 1340px; max-width: 100%; margin-inline: auto`
`display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; justify-content: flex-start`
`column-gap: var(--hhcp-content-gap)`
`padding: 1.1rem var(--hhcp-space-s)` → **`padding: 11px 20px`** at desktop
- `@media (max-width: 478px)`: `align-items: flex-start; padding-block: var(--hhcp-space-s)`

### `.banner-7__container-info`
`display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; justify-content: center; gap: var(--hhcp-content-gap)`
- `@media (max-width: 478px)`: `flex-direction: column`

### Announcement link `a.text-underline-link`
Inherits body type: `font-family: DM Sans; font-size: 16px; line-height: 24px; letter-spacing: -0.6px`
`color: var(--hhcp-primary)`; `text-align: center`; `text-decoration: none`
- `@media (max-width: 478px)`: `margin-bottom: 1rem` (10px); `max-width: 20rem` (200px)

**Animated underline on the inner `<span>` — reproduce exactly:**
```css
.text-underline-link span {
  --bg-h: 1.4px;
  background: linear-gradient(0deg, var(--hhcp-primary), var(--hhcp-primary)) no-repeat;
  background-size: 100% var(--bg-h);
  background-position-x: left;
  background-position-y: 95%;
  transition: background-size 0.3s;
  padding-bottom: 2.8px;
}
.text-underline-link:hover span {
  background-size: 0% var(--bg-h);
  background-position-x: right;
}
```
(The underline **wipes away** left→right on hover — it does not appear.)

### `.header-15`
`margin-top: var(--hhcp-space-xs)` (≈13.5px)

### `.header-15__wrapper`
Content container (1340px / `padding-inline: 20px`)
- `@media (max-width: 991px)`: `padding-inline: var(--hhcp-space-xs)`

### `.header-15__container` — the white pill
`display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: space-between; align-items: center`
`column-gap: var(--hhcp-space-xl)`
**`padding: 13.25px 24px`**  ·  **`background-color: #ffffff`**  ·  **`border-radius: 6px`**
- `@media (max-width: 991px)`: `column-gap: var(--hhcp-space-m)`

### Logo
`.header-15__logo` and its `img`: `height: 30px`; `img { border-radius: 0 }`; width auto.
- `@media (max-width: 991px)`: `height: 28px`, and `order: 1`
- `@media (max-width: 478px)`: `height: 22px`
Asset: `/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/images/logo-colour.svg`, alt `"HHCPA"`

### Nav list `ul.bricks-nav-menu`
`display: flex; flex-direction: row; gap: 32px; list-style: none; margin: 0; padding: 0`
`li { margin: auto 0 auto 0; position: relative }`
- `@media (min-width: 991px) and (max-width: 1184px)`: `gap: 18px`

### Nav link `> li > a`
**`font-family: "Roboto Mono"; font-size: 12px; font-weight: 500; letter-spacing: 0.36px; text-transform: uppercase; color: var(--hhcp-primary)`**
`transition: all 0.3s linear`
**Hover:** `color: #0c7340` (`var(--hhcp-action-dark)`)

### "Services" submenu (hover-opened)
`background-color: #ffffff; border: 1px solid #f2f2f2; border-radius: 4.444px;`
`box-shadow: 4px 4px 12px 0 rgba(0, 0, 0, 0.1);`
`position: absolute; top: 100%; transform: translateY(var(--hhcp-space-xs)); min-width: 150px; white-space: nowrap; z-index: 998`
Closed: `opacity: 0; visibility: hidden`. Open: `opacity: 1; visibility: visible`. `transition: all 0.3s linear`.
Submenu links: `color: #000; font-size: var(--hhcp-text-s); font-weight: 600; line-height: 120%;`
`padding: var(--hhcp-space-xs) var(--hhcp-space-s)` (≈13.5px 20px)
`li:hover { background-color: #f2f2f2 }`
Caret icon after the label: `ChevronDownIcon`, `margin-left: 8px`.

### CTA button `.header-15__btn`
Use the global `.hhcp-btn` primitive — it already encodes:
`font-family: "Roboto Mono"; font-size: 12px; font-weight: 500; line-height: 1; text-transform: uppercase; letter-spacing: 0.36px; padding: 12.132px 19.2px; border-radius: 960px; background: #58eda2; color: #013126; transition: all 0.3s linear`
**Hover:** background → `#013126`, color → `#58eda2`.

## Mobile drawer (`@media (max-width: 991px)`)
Desktop `ul` hides; hamburger button shows.
- Toggle button: `width: 20px; height: 16px; position: relative; background: transparent; cursor: pointer`.
  Three `span` bars: `height: 2px; background: currentColor; position: absolute; right: 0; width: 20px`,
  at `top: 0`, `top: 7px`, `top: 14px`. `transition: all 0.2s`.
- Open state: top bar → `top: 50%; transform: rotate(45deg)`, centre → `opacity: 0`,
  bottom → `top: 50%; transform: rotate(-45deg)`. Toggle colour becomes `#ffffff`.
- Drawer: `position: fixed; top: 0; bottom: 0; left: 0; width: 300px; height: 100vh;`
  `background-color: var(--hhcp-primary); z-index: 999; display: flex; flex-direction: column;`
  closed `transform: translateX(-100%); visibility: hidden`, open `transform: translateX(0); visibility: visible`.
  `transition-duration: 0.2s; transition-property: background-color, opacity, transform, visibility`.
- Drawer links: `color: #baf8d9; font-size: var(--hhcp-text-s); text-transform: uppercase;`
  `line-height: 60px; padding-inline: var(--hhcp-space-m); display: block; width: 100%`.
  `:hover { color: #58eda2 }`. Sub-menu links `color: #ffffff; line-height: 40px; padding-inline: var(--hhcp-space-l)`.
- Overlay: `position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.4); z-index: 998;`
  closed `opacity: 0; visibility: hidden`, open `opacity: 1; visibility: visible`. `transition: all 0.2s`.

## Text content (verbatim)
- Announcement: `Take our ` + `Pre-Screening Quiz` → `https://www.horizonhealthcarepartners.com.au/quiz/`
- Primary menu:
  | Label | href |
  |---|---|
  | About Us | `https://www.horizonhealthcarepartners.com.au/about-us/` |
  | Services | `https://www.horizonhealthcarepartners.com.au/services/` |
  | Pricing | `https://www.horizonhealthcarepartners.com.au/pricing/` |
  | How It Works | `https://www.horizonhealthcarepartners.com.au/how-it-works/` |
  | Articles | `https://www.horizonhealthcarepartners.com.au/articles/` |
  | Patient Portal | `https://escript.link/` |
  | Contact | `https://www.horizonhealthcarepartners.com.au/contact/` |
- Services submenu (order matters):
  | Label | href |
  |---|---|
  | General Telehealth | `/services/?service=general#hhp-booking-wrapper` |
  | Mental Health | `/services/?service=mental-health#hhp-booking-wrapper` |
  | Holistic Care | `/services/?service=holistic#hhp-booking-wrapper` |
  | Men’s and Women’s Health | `/services?service=menopause#hhp-booking-wrapper` |
  | Continuity & Preventative Health | `/services/?service=covid#hhp-booking-wrapper` |
  | Health Optimisation | `/services/?service=health-optimisation#hhp-booking-wrapper` |
  | Weight Management | `/services/?service=weight-management#hhp-booking-wrapper` |
  (Note the curly apostrophe in “Men’s” and the missing trailing slash on the menopause link —
  both verbatim from source.)
- CTA button: `Book Consultation` → `https://www.horizonhealthcarepartners.com.au/quiz/`

## Responsive behaviour
- **Desktop ≥1185px:** full horizontal nav, `gap: 32px`
- **991–1184px:** nav `gap: 18px`
- **≤991px:** hamburger + left drawer; logo 28px; wrapper padding `var(--hhcp-space-xs)`
- **≤478px:** announcement bar stacks to a column, link `max-width: 200px`; logo 22px

## Assets
- `logo-colour.svg` (above)
- Icons: `ChevronDownIcon` from `../shared/icons`
