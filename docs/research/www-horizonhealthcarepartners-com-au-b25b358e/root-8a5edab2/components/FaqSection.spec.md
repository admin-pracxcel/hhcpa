# FaqSection Specification

## Overview
- **Target file:** `src/components/sites/.../root-8a5edab2/FaqSection.tsx`
- **Interaction model:** **click-driven accordion.** Measured 1585 x 746px.
- **ALL rows are CLOSED on load** (verified: every `aria-expanded="false"`, every panel
  `display: none`) — unlike the ApproachSection accordion, which opens its first row.

## Computed styles (exact)

### `section.faq-3`
**`margin: 90px 0`** (`var(--hhcp-section-space-m) 0`);
**`padding: 90px 60px`** (`var(--hhcp-section-space-m) var(--hhcp-gutter)`)

### `.faq-3__container`
**`width: 1072px; max-width: 100%; margin-inline: auto;`**
`display: flex; flex-direction: column; align-items: center;`
**`row-gap: 67.5px; column-gap: 30px`**
(1072px is `--width-xl` = 80% of the 1340px content width.)

### `.faq-3__container-info` (heading block)
`display: flex; flex-direction: column; align-items: center;`
**`row-gap: 13.5068px`** (`var(--hhcp-space-xs)`)
- `h2.faq-3__heading`: **`text-align: center; font-size: var(--hhcp-h2)` (42px);
  `line-height: var(--hhcp-heading-lh)` (46.336px); `font-weight: 400`;
  `letter-spacing: -0.42px`; `color: #013126`**
  Text: `Your Questions Answered`
- There is **no eyebrow row** in this section.

### `.faq-3__accordion`
**`display: flex; flex-direction: column; width: 100%; max-width: 662px;`
`border-bottom: 1px solid #ececec`**

### `.faq-3__question` (the clickable row)
```
display: flex; flex-direction: row; flex-wrap: nowrap;
justify-content: space-between; align-items: center;
gap: 30px; cursor: pointer; width: 100%;
padding: 20px 0;                        /* var(--hhcp-space-s) 0 */
border-top: 1px solid #ececec;
background-color: transparent; border-left: none; border-right: none; text-align: left;
```
Measured 662 x 72px.

### `.faq-3__answer-heading` (the question text)
**`font-size: var(--hhcp-h4)` (20px); `line-height: 24.16px`; `font-weight: 500;`
`color: #013126`; `text-align: start`**

### `.faq-3__answer-icon`
`<FaqTogglePlusIcon />` — 30 x 31px, a filled `#013126` circle with an `#EBEBEB` plus.
**`transition: all 0.2s ease`**
**Open state: `transform: rotate(45deg)`** — the plus becomes a cross. The source does NOT swap
the glyph; it rotates the whole icon. (The shared icon component no longer takes an `open` prop —
apply the rotation from this component.)

### `.accordion-content-wrapper` (the answer panel)
```
padding: 0 0 30px;                      /* 0 0 var(--hhcp-space-m) */
font-size: var(--hhcp-text-s) (16px); line-height: 24px;
color: rgba(1, 49, 38, 0.8);
```
Closed → `display: none`. Open → `display: block`.

### Footer CTA
Same mint button as the other sections (not full width), trailing 10px `currentColor` dot:
```
min-height: 52px; padding: 12.132px 19.2px; border-radius: 800px;
background-color: #58eda2; border: 1px solid #58eda2; color: #013126;
font-family: Roboto Mono; font-size: 12px; font-weight: 500;
text-transform: uppercase; letter-spacing: normal;
display: inline-flex; align-items: center; justify-content: center; gap: 8px;
transition: all 0.3s linear;
```
Hover: `box-shadow: 5px 5px 25px 0 rgba(33, 33, 33, 0.1)`; dot `box-shadow: 0 0 0 3px rgba(1, 49, 38, 0.25)`.
Label `Explore All FAQs` → `https://www.horizonhealthcarepartners.com.au/faqs/`

## Content (verbatim — copy exactly, including the price figures)

H2: `Your Questions Answered`

1. **`How does Horizon Health Care Partners work?`**
   `You start with a free online pre-screening quiz. The quiz is not a diagnosis. If you look suitable, you book a real-time consultation with one of our practitioners by video or phone. The practitioner reviews your health and talks through your options with you. Any care plan comes from that consultation, not the quiz on its own.`
2. **`Will I be given a prescription?`**
   `A prescription is not guaranteed. Our practitioners only prescribe where it is clinically appropriate, following a real-time consultation. Depending on your situation, the outcome may be advice, lifestyle guidance, a referral, monitoring, or no treatment. We do not prescribe based on a questionnaire alone.`
3. **`How much does it cost?`**
   `The online pre-screening quiz is free. Your first medical consultation is $59. Follow-up consultations are $59. Transfer consultations are $54. There is no commitment until you are ready to book a consultation.`
   *(Note: these figures disagree with the pricing cards ($69/$59/$59). That inconsistency exists
   on the live site — reproduce it verbatim, do not "fix" it.)*
4. **`What can I speak to a practitioner about?`**
   `Our practitioners consult on a range of everyday health concerns. These include weight management, mental health support, menopause support, smoking cessation, and ongoing support for chronic conditions. Each consultation is tailored to you. Individual results vary, and assessment findings do not guarantee a particular outcome.`
5. **`Is telehealth right for me, and what if it is an emergency?`**
   `Telehealth suits many common health needs, but not all of them. Your practitioner may recommend an in-person assessment, a GP review, a specialist referral, further tests, or no treatment, depending on your circumstances. If this is a medical emergency, call 000 immediately. If you are in crisis, call Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636.`

## Responsive behaviour
The container is already `max-width: 100%` and the accordion `max-width: 662px` centred, so this
section needs no breakpoint overrides. Section padding stays fluid via the clamp tokens.
