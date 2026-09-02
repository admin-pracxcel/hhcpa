/**
 * Lead paragraph, scroll-revealed — a variant of `LeadParagraph` for trying a
 * larger, animated treatment of the same copy. Both are on `/home-v2/`; this
 * one does not replace the other.
 *
 * Words rest at 0.2 opacity and come up to 1, one after another, as the section
 * travels up the viewport. Full container width, no eyebrow column.
 *
 * The timing is modelled on Salient's `scroll-opacity-reveal`, which is the
 * reference for this effect. Three things carry it, and all three are timing
 * rather than styling:
 *
 *   1. Opacity only — no blur, no movement, no colour change.
 *   2. The whole reveal spans about one viewport of scroll, beginning as the
 *      block's top reaches the bottom of the viewport. For a block this size
 *      that is 51% of the view() cover range, hence --sr-span.
 *   3. Each word's fade lasts 1.8x the gap between word starts (Salient runs
 *      450ms fades on a 250ms stagger), so only about two words are in flight
 *      at once. A longer fade relative to the stagger blurs the wave into a
 *      whole-block dissolve, which is what a first attempt here did.
 *
 * No JS. It is a CSS scroll-driven animation: `animation-timeline: view()` ties
 * each word's colour to the section's own progress through the viewport, and
 * each word gets a slightly later `animation-range` than the one before it, so
 * the fill runs with the reading order. AGENTS.md rules out scroll listeners
 * and IntersectionObservers in this codebase; this needs neither.
 *
 * Two ways it degrades, both to fully-legible final-colour text:
 *   - browsers without scroll-driven animation support (`@supports`)
 *   - `prefers-reduced-motion: reduce`
 * Nothing here hides content, so the copy is readable either way.
 */

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

const STYLES = `
.hhcp-sr-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-sr-container {
  padding-inline: 0;
}

.hhcp-sr-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--hhcp-space-m, 30px);
}

.hhcp-sr-text {
  font-size: 40px;
  line-height: 1.3;
  font-weight: 400;
  letter-spacing: -0.5px;
  /* The resting colour; the keyframes decide what the words start at. */
  color: var(--hhcp-primary, #013126);
}

.hhcp-sr-word {
  color: var(--hhcp-primary, #013126);
}

.hhcp-sr-link {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--hhcp-primary, #013126);
  text-decoration: none;
  transition: all 0.3s linear;
}

.hhcp-sr-link:hover {
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-sr-link-icon {
  display: flex;
  flex: none;
  color: inherit;
}

@keyframes hhcp-sr-fill {
  from { opacity: 0.2; }
  to { opacity: 1; }
}

@supports (animation-timeline: view()) {
  /*
   * One timeline for the whole paragraph, which the words attach to by name.
   * A bare view() on each word would track that word's own trip through the
   * viewport, so a word on the last line would start its fade only once it had
   * entered — the stagger would be counted twice and the reveal would run at
   * whatever rate the reader happened to be scrolling past each line. Salient
   * drives every word from the block's progress, and so does this.
   */
  .hhcp-sr-text {
    view-timeline-name: --hhcp-sr-progress;
    view-timeline-axis: block;
  }

  .hhcp-sr-word {
    /*
     * --i is the word's index and --n the count, both set inline.
     *
     * cover runs from the block's top touching the viewport bottom to its
     * bottom clearing the viewport top, so its length is blockHeight + winH.
     *
     * --sr-start holds the reveal off until the block is properly on screen.
     * Beginning at cover 0 meant it began the instant the first line crossed
     * the fold and was nearly spent by the time the reader arrived: the block
     * read as already-dark with a pale tail.
     *
     * --sr-span then runs it out to roughly where the block's bottom reaches
     * the middle of the viewport, so the wave is travelling while the reader
     * is looking at the text rather than before.
     *
     * --sr-step is the gap between word starts. The 1.8 is Salient's 450ms
     * fade over its 250ms stagger, and the same 1.8 sets each word's own
     * duration below, so the wave stays two words wide however many there are.
     */
    --sr-start: 15%;
    --sr-span: 64%;
    --sr-step: calc(var(--sr-span) / (var(--n) + 0.8));
    animation: hhcp-sr-fill linear both;
    animation-timeline: --hhcp-sr-progress;
    animation-range:
      cover calc(var(--sr-start) + var(--i) * var(--sr-step))
      cover calc(var(--sr-start) + var(--i) * var(--sr-step) + 1.8 * var(--sr-step));
  }
}

@media (prefers-reduced-motion: reduce) {
  .hhcp-sr-word {
    animation: none;
    opacity: 1;
  }
}

@media (max-width: 991px) {
  .hhcp-sr-text {
    font-size: 36px;
  }
}

@media (max-width: 767px) {
  .hhcp-sr-text {
    font-size: 28px;
  }
}
`;

interface ScrollRevealParagraphProps {
  className?: string;
  text: string;
  cta: { label: string; href: string };
}

export function ScrollRevealParagraph({
  className,
  text,
  cta,
}: ScrollRevealParagraphProps) {
  const words = text.split(" ");

  return (
    <section className={cn("hhcp-sr-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-sr-container">
        <div className="hhcp-sr-body">
          <p className="hhcp-sr-text font-dm-sans">
            {words.map((word, index) => (
              <span
                // Words repeat, so the index has to be part of the key.
                key={`${index}-${word}`}
                className="hhcp-sr-word"
                style={
                  {
                    "--i": index,
                    "--n": words.length,
                  } as CSSProperties
                }
              >
                {word}
                {index < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>

          <a className="hhcp-sr-link font-dm-sans" href={cta.href}>
            <span className="hhcp-sr-link-icon">
              <ArrowRightIcon width={17} height={17} />
            </span>
            <span>{cta.label}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
