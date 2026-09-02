/**
 * Lead paragraph, scroll-revealed — a variant of `LeadParagraph` for trying a
 * larger, animated treatment of the same copy. Both are on `/home-v2/`; this
 * one does not replace the other.
 *
 * The copy sets faint and fills to the body colour word by word as the section
 * travels up the viewport.
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

import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

const STYLES = `
.hhcp-sr-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-sr-container {
  padding-inline: 0;
}

.hhcp-sr-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--hhcp-space-xl, 67.5px);
  align-items: start;
}

.hhcp-sr-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 18px;
}

.hhcp-sr-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-sr-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
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
  /* The resting colour. Words animate from --hhcp-sr-faint up to this. */
  color: var(--hhcp-primary, #013126);
}

.hhcp-sr-word {
  /* Words are inline, so the space between them is a real text node; keeping
     them inline is what lets the paragraph wrap normally. */
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
  from { color: rgba(1, 49, 38, 0.16); }
  to { color: var(--hhcp-primary, #013126); }
}

@supports (animation-timeline: view()) {
  .hhcp-sr-word {
    animation: hhcp-sr-fill linear both;
    animation-timeline: view();
    /*
     * --i is the word's index and --n the count, both set inline. Each word
     * starts 55% of the way through the section's pass in reading order and
     * takes 12% of it to finish, so the fill sweeps rather than snapping.
     */
    animation-range:
      cover calc(20% + (var(--i) / var(--n)) * 55%)
      cover calc(32% + (var(--i) / var(--n)) * 55%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hhcp-sr-word {
    animation: none;
    color: var(--hhcp-primary, #013126);
  }
}

@media (max-width: 991px) {
  .hhcp-sr-grid {
    grid-template-columns: 1fr;
    gap: var(--hhcp-space-m, 30px);
  }

  .hhcp-sr-eyebrow {
    padding-top: 0;
  }

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
  eyebrow: string;
  text: string;
  cta: { label: string; href: string };
}

export function ScrollRevealParagraph({
  className,
  eyebrow,
  text,
  cta,
}: ScrollRevealParagraphProps) {
  const words = text.split(" ");

  return (
    <section className={cn("hhcp-sr-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-sr-container">
        <div className="hhcp-sr-grid">
          <div className="hhcp-sr-eyebrow">
            <span className="hhcp-sr-dot" />
            <span className="hhcp-sr-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>

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
                    } as React.CSSProperties
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
      </div>
    </section>
  );
}
