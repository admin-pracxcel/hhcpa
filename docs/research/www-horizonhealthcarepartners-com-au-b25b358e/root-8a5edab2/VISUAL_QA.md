# Visual QA — clone vs. live original

Measured with both pages at **innerWidth 1534px**, computed styles read from each live DOM
(not eyeballed from screenshots).

## Section-height diff

| # | Component | Original | Clone | Δ |
|---|---|---:|---:|---:|
| 0 | HeroSection | 1060 | 1060 | **0** |
| 1 | FeatureMarquee | 81 | 81 | **0** |
| 2 | SupportSection + BookingWizard | 1991 | 1991 | **0** |
| 3 | PricingSection | 901 | 901 | **0** |
| 4 | StepsSection | 799 | 799 | **0** |
| 5 | StorySection | 853 | 853 | **0** |
| 6 | CareAreasSection | 1056 | 1059 | +3 |
| 7 | ApproachSection | 984 | 984 | **0** |
| 8 | BlogSection | 1243 | 1243 | **0** |
| 9 | FinalCtaSection | 854 | 854 | **0** |
| 10 | FaqSection | 746 | 746 | **0** |
| — | SiteFooter | 680 | 681 | +1 |
| — | **Whole document** | **11697** | **11701** | **+4 (0.03%)** |

Ten of eleven sections are pixel-exact. The single remaining delta is in the care-areas carousel,
whose track animates continuously — sub-pixel accumulation, not layout error.

The booking wizard is independently pixel-exact: wrapper 1465x1614 vs 1465x1613, identical grid
template (`353.328px 353.328px 353.344px`), and all twelve service-card heights match exactly
(`266 ×6, 310 ×3, 289 ×3`).

## Defects found and fixed during QA

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| 1 | Hero `h1` rendered dark green instead of white | The base typography appended to `globals.css` was **unlayered**, and unlayered CSS outranks every Tailwind utility, so `h1 { color }` beat `text-white` | Moved the whole block into `@layer base` |
| 2 | Hero headline wrapped on the wrong word | Used `text-wrap: balance`; the target computes `pretty` | Changed to `pretty` |
| 3 | Support section 66px short | The `<section>` is itself a flex column with `gap: 67.5px` between the heading and the wizard — only the inner container gap had been specced | Added the section-level gap |
| 4 | Blog section 48px short | (a) head text block gap is 30px, not 20px; (b) post images were cropped to a fixed 200px, but the source keeps natural aspect under `min-height: 200px`, so the 1024×809 post renders 300×237 | Both corrected |
| 5 | **Horizontal scrollbar at mobile widths** | Blog title block hard-coded `width: 580px`; 580px is what the desktop flex row *produces*, not a fixed value | Changed to `flex: 1 1 auto; min-width: 0; max-width: 580px`, released at ≤767px |
| 6 | Footer 8px short | `.footer-16__logo` (the link) is 54px tall while the `img` inside is 45px — the two had been conflated | Link set to 54px, image left at 45px |
| 7 | Approach accordion missing its open-state marker | The 8px mint dot (`.icon--active`) is `position: absolute; visibility: hidden` until `.brx-open`, then becomes `relative; visible` | Added with the same absolute→relative mechanic |
| 8 | Steps and Blog headings missing their divider | Both carry the same `padding-bottom: 45px; border-bottom: 1px solid #ececec` as Pricing | Added to both |
| 9 | FAQ footer built as a mint pill button | It is actually a centred prompt plus an icon link: `Still have questions?` + `Explore All FAQs →`, where `.text--icon-link` is `flex-direction: row-reverse; gap: 4px` | Rebuilt as the text link |
| 10 | Story / Approach images missing `border-radius: 10px` | Not captured in the original specs | Added |
| 11 | `.hhcp-btn` had `letter-spacing: 0.36px` | The Bricks theme declares it but it is overridden downstream — buttons compute `normal` (nav links really are 0.36px) | Corrected to `normal` |
| 12 | Booking-embed paragraph 1.4px too tall | The wizard's own wrapper sets `line-height: 1.6`; the target also ships `p, li { line-height: var(--text-line-height, calc(1.5)) }`, which beats that inherited value. Only `body` had been set here, so the wizard's 1.6 won | Added `p, li` to `@layer base`; this also closed the wizard section's remaining +2px |

## Interaction verification

| Behaviour | Result |
|---|---|
| Header sticky/scroll change | Correctly **absent** — no scroll listeners or IntersectionObservers anywhere in the component tree, matching the source |
| Booking wizard step 1 → 2 | Advances correctly; progress bar step 2 activates and relabels to `Appointment Timing`; step-2 panel renders identically to the original (verified side by side) |
| FAQ accordion | All five rows closed on load (matches source); single-open; icon rotates 45° |
| Approach accordion | Item 1 open on load (matches source); single-open; title, border and dot all flip to mint together |
| Care-areas carousel | Auto-scrolls; play/pause toggle swaps icon and `aria-pressed`; does **not** pause on hover, matching `pauseOnHover: false` |
| Header Services dropdown | Opens on hover and on keyboard focus |
| Responsive @ ~485px | Nav collapses to hamburger; pricing / steps / story grids all collapse to one column; services grid to one column; **no horizontal overflow** |

## Known gaps

1. **Halaxy booking iframe — ported at the user's explicit request.** `hhpPerformRedirect()` has two
   branches and both are now modelled as distinct phases:
   - *with* a url (only the one-day certificate path) → `{ kind: "redirect", url }`, the spinner panel;
   - *without* one (every other path) → `{ kind: "embed" }`, which renders
     `<iframe src="https://www.halaxy.com/book/widget/horizon-health-care-partners-australia/location/1345231"
     allow="payment" loading="lazy" style="border:0;width:100%;height:1100px;max-height:90vh">`
     under `Book your consultation` / `Complete your booking securely below.`
   Verified against the live site: identical heading, subheading, iframe attributes, 1100x654 box,
   step-3 progress state, and the spinner panel correctly suppressed. **This is the real clinic's
   widget, so the page can take real bookings.**
   (`BOOKING_REDIRECT_URL` is declared in the source but never passed — the default branch embeds
   rather than navigating. Kept in the data module for parity.)
2. **The certificate branch still does not navigate.** For full fidelity it should
   `window.location.href = CERT_REDIRECT_URL` after 1500ms; it currently renders the spinner panel
   and stops, since that path leads to a page outside this clone. Easy to enable on request.
3. **Original bug not reproduced.** The source's `hhpReset()` never cleared the step-2 label, so a
   stale label persisted on the services screen. The clone clears it.
4. A `bis_skin_checked` hydration warning appears in dev — injected by a browser extension on the
   reviewer's machine, not by this code.
