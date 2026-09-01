# SiteFooter Specification

## Overview
- **Target file:** `src/components/sites/.../root-8a5edab2/SiteFooter.tsx`
- **Interaction model:** **static**, with link/icon hover colour changes. Measured 1585 x 680px.

## Computed styles (exact)

### `footer.footer-16`
**`background-color: #013126`** (`var(--hhcp-primary)`)
**`padding: 45px 30px`** (`var(--hhcp-space-l) var(--hhcp-space-m)`)

### Container
`width: 1340px; max-width: 100%; margin-inline: auto;`
`display: flex; flex-direction: column;` **`row-gap: 45px`**

### Top row `.footer-16__container-top`
`display: flex; flex-direction: row; align-items: center; justify-content: space-between;`
`gap: 45px`
- `@media (max-width: 767px)`: `flex-direction: column`
- Logo: `<img>` **`height: 45px; width: auto`**, src `images/logo-light-tagline.svg`, alt `HHCPA`,
  links to `https://www.horizonhealthcarepartners.com.au`
- Social row: `display: flex; flex-direction: row; align-items: center; gap: 30px`
  - Each icon **20 x 20px**, **`color: rgba(245, 255, 249, 0.6)`**, `transition: all 0.3s linear`
  - **Hover: `color: #f5fff9`**

### Divider (appears twice: after the top row and before the bottom row)
`width: 100%; height: 1px; border-top: 1px solid rgba(245, 255, 249, 0.1)`

### Middle row `.footer-16__container-mid` (a `<nav>`)
`display: flex; flex-direction: row; gap: 45px`
- `@media (max-width: 991px)`: `flex-wrap: wrap`
- `@media (max-width: 478px)`: `row-gap: 67.5px` (`var(--hhcp-space-xl)`)

#### Menu columns (2 of them)
`display: flex; flex-direction: column; align-items: flex-start;`
**`row-gap: 20px; max-width: 268px; flex-grow: 1; flex-shrink: 0; width: auto; padding: 0`**
- `@media (max-width: 478px)`: `max-width: 100%`
- Column heading (`h2` in source): **`font-family: Roboto Mono; font-size: 12px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.36px; color: #f5fff9`**
- Link list: `display: flex; flex-direction: column; gap: 20px; list-style: none; margin: 0; padding: 0`
- Links: **`font-family: DM Sans; font-size: 16px; line-height: 24px;
  color: rgba(245, 255, 249, 0.8)`**; **hover `color: #f5fff9`**; `transition: all 0.3s linear`

#### Newsletter column `.footer-16__form-container`
`display: flex; flex-direction: column; align-items: flex-start;`
**`width: 536px; max-width: 100%; flex-shrink: 0; margin-left: auto; gap: 30px`**
- `@media (max-width: 991px)`: `width: 100%`
- `@media (max-width: 767px)`: `width: 100%; max-width: 100%`

Inner block (`gap: 16px`):
- Heading: **`font-family: Roboto Mono; font-size: 12px; font-weight: 500; text-transform: uppercase;
  letter-spacing: 0; color: #f5fff9`** — text `Subscribe to our newsletter`
- Form row: `display: flex; align-items: flex-start;` **`gap: 15px`**; full width
  - Email input — measured 405 x 46px:
    ```
    flex: 1; padding: 13px;
    border: 1px solid rgba(245, 255, 249, 0.2);
    border-radius: 33.75px;
    background-color: #013126;
    color: #f5fff9;
    font-size: 16px;
    ```
    `placeholder="Enter your email"`, placeholder colour **`rgba(245, 255, 249, 0.2)`**.
    Note the input keeps the **system font stack**, not DM Sans — that is what the source computes.
    Add an `aria-label`.
  - Submit — measured 116 x 46px:
    ```
    padding: 12.8px 20px; border-radius: 800px;
    background-color: #58eda2; color: #013126; border: none;
    font-family: Roboto Mono; font-size: 12px; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.36px; white-space: nowrap;
    ```
    **Hover: `background-color: #0c7340; color: #baf8d9`**
    Label `Register`
  - `@media (max-width: 767px)`: the two fields stack (`margin-bottom: 20px` on the input group)
- Terms line: **`font-size: 10px; line-height: 15px; color: rgba(245, 255, 249, 0.8)`**
  Text: `By clicking Register, you acknowledge that you have read and accepted our ` +
  link `Terms and Conditions` (`color: #f5fff9; text-decoration: none`) + `.`
  Link href: `/terms-and-conditions/`
- Demo only: `onSubmit={(e) => e.preventDefault()}`

#### Contact list `.footer-16__container-contact`
`display: flex; flex-direction: row; gap: 30px; list-style: none; padding: 0; margin: 0`
Each item: `display: flex; flex-direction: column; gap: 0`
- Label (`h3`): **`font-family: Roboto Mono; font-size: 12px; text-transform: uppercase;
  letter-spacing: 0.36px; color: rgba(245, 255, 249, 0.8)`**
- Value (`a`): **`font-family: DM Sans; font-size: 16px; letter-spacing: -0.6px; color: #f5fff9`**

| Label | Value | href |
|---|---|---|
| `Email` | `hello@horizonhealthcarepartners.com.au` | `mailto:hello@horizonhealthcarepartners.com.au` |
| `Phone` | `1300 336 572` | `tel:1300336572` |

(The live site obfuscates the address via Cloudflare email-protection; the decoded value is above.)

### Bottom `.footer-16__container-bot`
`display: flex; flex-direction: column; justify-content: space-between; align-items: center;`
**`row-gap: 45px; column-gap: 30px`**
- Upper row `.footer-16__container-bot-01`:
  `display: flex; flex-direction: row; justify-content: space-between; align-items: center;`
  **`row-gap: 20px; column-gap: 30px`**; full width
  - Credit (`<small>`): **`font-size: 16px; color: rgba(245, 255, 249, 0.8)`**
    Text: `©  2026 by Horizon Health Care Partners. All Rights Reserved.`
    **(note the DOUBLE space after `©` — verbatim from source)**
  - Legal links: `display: flex; flex-direction: row;` **`gap: 13.5068px`**; list-style none
    Links: **`font-family: DM Sans; font-size: 16px; color: #f5fff9; letter-spacing: -0.6px`**
    - `Privacy Policy` → `https://www.horizonhealthcarepartners.com.au/privacy/`
    - `Terms and Conditions` → `https://www.horizonhealthcarepartners.com.au/terms-and-conditions/`
- Disclaimer (`<p>`): **`font-size: 16px; line-height: 24px; font-weight: 500;
  color: rgba(245, 255, 249, 0.8); max-width: 100%; text-align: start`**
  Text: `Disclaimer: Individual results may vary. No treatment outcomes are guaranteed. Prescriptions are provided only where clinically appropriate following a real-time consultation, and all clinical outcomes are at the treating practitioner's discretion. Always seek professional medical advice before commencing any treatment. If this is a medical emergency, call 000 immediately.`

## Menu content (verbatim)

### Column 1 — heading `Pages`
| Label | href |
|---|---|
| About Us | `https://www.horizonhealthcarepartners.com.au/about-us/` |
| Pricing | `https://www.horizonhealthcarepartners.com.au/pricing/` |
| How It Works | `https://www.horizonhealthcarepartners.com.au/how-it-works/` |
| FAQs | `https://www.horizonhealthcarepartners.com.au/faqs/` |
| Articles | `https://www.horizonhealthcarepartners.com.au/articles/` |

### Column 2 — heading `SUPPORT LINKS`
| Label | href |
|---|---|
| Check Eligibility | `https://www.horizonhealthcarepartners.com.au/quiz/` |
| Discharge Letter | `https://www.horizonhealthcarepartners.com.au/discharge/` |
| Patient Portal | `https://escript.link/` |
| Contact Us | `https://www.horizonhealthcarepartners.com.au/contact/` |

### Social
| Icon | href |
|---|---|
| `LinkedInIcon` | `https://www.linkedin.com/company/109897954/admin/dashboard/` |
| `FacebookSquareIcon` | `https://www.facebook.com/profile.php?id=61583057797612&sk=about` |
| `InstagramIcon` | `https://www.instagram.com/horizonhealthcarepartnersaus/` |

## Responsive behaviour
- **≥992px:** top row horizontal; middle row is 2 menu columns + newsletter pushed right by `margin-left: auto`
- **≤991px:** middle row wraps; newsletter column goes `width: 100%`
- **≤767px:** top row stacks to a column; newsletter fields stack
- **≤478px:** menu columns `max-width: 100%`; middle row `row-gap: 67.5px`
