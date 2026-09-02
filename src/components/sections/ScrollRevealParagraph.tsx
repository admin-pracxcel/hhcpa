/**
 * Lead paragraph, scroll-revealed — a variant of `LeadParagraph` for trying a
 * larger, animated treatment of the same copy. Both are on `/home-v2/`; this
 * one does not replace the other.
 *
 * The copy sets faint, blurred and slightly low, and each word sharpens, rises
 * and fills to the body colour as the section travels up the viewport. Full
 * container width, no eyebrow column.
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

import { Fragment } from "react";
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
  font-size: 50px;
  line-height: 1.25;
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

/*
 * Colour alone was too quiet to read as an animation at a normal scroll speed.
 * Each word also arrives out of focus and slightly low, so there is movement
 * and a change of sharpness to catch, not just a tint.
 */
@keyframes hhcp-sr-fill {
  from {
    color: rgba(1, 49, 38, 0.08);
    filter: blur(6px);
    transform: translateY(0.18em);
  }
  to {
    color: var(--hhcp-primary, #013126);
    filter: blur(0);
    transform: translateY(0);
  }
}

@supports (animation-timeline: view()) {
  .hhcp-sr-word {
    /* transform and filter need a box; inline boxes do not take one. */
    display: inline-block;
    animation: hhcp-sr-fill linear both;
    animation-timeline: view();
    /*
     * --i is the word's index and --n the count, both set inline. The stagger
     * runs across 62% of the section's pass in reading order, and each word
     * takes 9% of it, so a short wave travels the paragraph rather than the
     * whole block easing together.
     */
    animation-range:
      cover calc(12% + (var(--i) / var(--n)) * 62%)
      cover calc(21% + (var(--i) / var(--n)) * 62%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hhcp-sr-word {
    animation: none;
    color: var(--hhcp-primary, #013126);
    filter: none;
    transform: none;
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
              // Words repeat, so the index has to be part of the key. The space
              // sits outside the span: an inline-block trims its own trailing
              // whitespace, which would run the words together.
              <Fragment key={`${index}-${word}`}>
                <span
                  className="hhcp-sr-word"
                  style={
                    {
                      "--i": index,
                      "--n": words.length,
                    } as CSSProperties
                  }
                >
                  {word}
                </span>
                {index < words.length - 1 ? " " : ""}
              </Fragment>
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
