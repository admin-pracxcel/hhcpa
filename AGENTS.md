<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Horizon Health Care Partners — site clone

A pixel-perfect clone of `https://www.horizonhealthcarepartners.com.au/`, served at `/`.
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind CSS v4.

Measured against the live original at matched 1534px viewports: **10 of 11 sections are
pixel-exact; the whole document is within 4px (0.03%)**. Treat that as the bar — if you
change layout values, re-measure rather than eyeballing.

## Commands

```bash
npm install
npm run dev      # Turbopack dev server
npm run check    # lint + typecheck + build — run before calling anything done
```

## Layout

```
src/app/
  globals.css     design tokens + base typography (see the layering warning below)
  layout.tsx      next/font/local wiring for DM Sans + Roboto Mono, page metadata
  page.tsx        assembles the 13 sections in order
  fonts/          the exact woff2 files the target serves
src/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/
  shared/icons.tsx          inline SVGs lifted from the target
  root-8a5edab2/*.tsx       one component per page section
  root-8a5edab2/bookingWizardData.ts   the wizard's config, ported verbatim
public/sites/<site-key>/<page-key>/    images, videos, fonts, favicons
docs/research/<site-key>/<page-key>/   specs, captured CSS/HTML, QA results
scripts/download-assets-*.mjs          re-fetches every asset from the target
```

The `<site-key>/<page-key>` namespacing exists so a second cloned page can be added
without collisions. Keep it if you add pages; don't flatten it.

## Conventions

- Each section component owns a scoped `<style>` block with a unique class prefix
  (`hhcp-pr-*`, `hhcp-bl-*`, …). Values are exact numbers from the target's computed
  styles — not Tailwind's t-shirt scale. `HeroSection` and `FinalCtaSection` use Tailwind
  arbitrary values instead; both approaches are fine, match whichever file you're in.
- **Never put a backtick inside those style template literals** — it terminates the
  string. Three separate agents hit this.
- Breakpoints are the target's own: **991 / 767 / 478px**. Not Tailwind defaults. Use
  arbitrary variants (`max-[991px]:`).
- Content is modelled as typed `readonly` const arrays and mapped once.

## Gotchas that cost real time

1. **`globals.css` base typography must stay inside `@layer base`.** Unlayered CSS
   outranks every Tailwind utility, so an unlayered `h1 { color }` silently beats
   `text-white` on the hero headline. Same reason `p, li { line-height }` is in there:
   the booking wizard's wrapper sets `1.6`, and only a directly-matching rule overrides
   an inherited one.
2. **The header is not sticky.** It is `position: absolute` and scrolls away. There are
   no scroll listeners or IntersectionObservers anywhere in this codebase, by design.
   Don't add any.
3. **Both carousels are continuous CSS marquees, not slide-steppers.** The target uses
   Splide auto-scroll (`pauseOnHover: false`); these are duplicated-track CSS animations.
   The care-areas one has an explicit play/pause button — that is the only thing that
   stops it.
4. **The target ships `html { font-size: 62.5% }`.** Its authored rem values are
   10px-based. Every token here was converted to px so Tailwind's own 16px rem scale
   still works. If you lift a new value from the target's CSS, multiply rem by 10.
5. Accordion defaults differ on purpose: `ApproachSection` opens item 1 on load,
   `FaqSection` opens nothing. Both match the target.

## Deliberate deviations from the target

Recorded in `docs/research/<site-key>/<page-key>/CUSTOMISATIONS.md`. Read it before
"fixing" anything that looks off-spec. Currently:

- **Hero capped to the viewport** — `h-[min(1060px,100dvh)] min-h-fit` with the content
  offset scaled to match. The target is a flat 1060px.
- **Halaxy booking widget embedded** — the wizard's final step renders the clinic's live
  booking iframe. **It takes real bookings.**

Also note the one-day medical-certificate branch of the wizard renders its spinner panel
but does not navigate; the target sets `window.location`. Enable it if you want that.

## Not wired up

There is no backend. Every form (`HeroSection`, `FinalCtaSection`, `SiteFooter`
newsletter) is `preventDefault()` only. All nav links point at the live target's domain.
