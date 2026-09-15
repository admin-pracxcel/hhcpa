/**
 * The lead paragraph that opens most pages, under the hero and trust bar.
 *
 * This was `ScrollRevealParagraph`, which set every word in its own `<span>` and
 * brought them up from 0.2 opacity one after another on a CSS scroll-driven
 * timeline. Build spec v2.1 §2.1 removed that: "render each intro paragraph as a
 * single block of text in one solid colour. Remove the per-word wrapping
 * entirely, not just the animation trigger, so the text is one selectable,
 * copyable paragraph."
 *
 * The per-word wrapping is what that instruction is really about. Turning the
 * animation off but keeping the spans would still leave a paragraph that
 * selects and copies with the word breaks intact, and that reads as one node
 * per word to a screen reader. So the spans are gone, not merely inert.
 *
 * Nothing replaced the effect. The typography, the width and the trailing link
 * are unchanged, so the section keeps its place in the page rhythm.
 *
 * `text` takes an array as well as a string, because the homepage intro is four
 * paragraphs (§4.1.2) while every other page passes one.
 */

import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

const STYLES = `
.hhcp-lp-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-lp-container {
  padding-inline: 0;
}

.hhcp-lp-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--hhcp-space-m, 30px);
}

.hhcp-lp-text {
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  /* 30px — Bilal, 2026-09-15. Was 40. */
  font-size: 30px;
  line-height: 1.3;
  font-weight: 400;
  letter-spacing: -0.5px;
  color: var(--hhcp-primary, #013126);
}

/*
 * A multi-paragraph intro steps down a size.
 *
 * This was written when the single-paragraph size was 40px: at that size the
 * homepage's four paragraphs of her copy ran to roughly 900px between the
 * trust bar and the first section, which is a wall rather than an opening,
 * and 28px halved it.
 *
 * The base dropped to 30px on 2026-09-15, so the step is now 30 to 28 and
 * barely reads as one. Kept rather than collapsed, because two paragraph
 * counts wanting the same size is a decision to take deliberately, not a
 * side effect of changing the other number. Raised with Bilal.
 */
.hhcp-lp-text[data-paragraphs="many"] {
  font-size: 28px;
  letter-spacing: -0.3px;
}

.hhcp-lp-link {
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

.hhcp-lp-link:hover {
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-lp-link-icon {
  display: flex;
  flex: none;
  color: inherit;
}

/* Tablet. */
@media (max-width: 991px) {
  /*
   * No rule for the single-paragraph case: it was 30px here, which is now the
   * desktop size too, so the declaration set a value to itself. The step to
   * 20px at 767px below still applies.
   */
  .hhcp-lp-text[data-paragraphs="many"] {
    font-size: 22px;
  }
}

/* Phone. */
@media (max-width: 767px) {
  .hhcp-lp-text {
    font-size: 20px;
  }
  .hhcp-lp-text[data-paragraphs="many"] {
    font-size: 18px;
  }
}
`;

interface LeadParagraphProps {
  className?: string;
  text: string | readonly string[];
  /** Omitted where the section's own page is the destination, e.g. `/quiz/`. */
  cta?: { label: string; href: string };
}

export function LeadParagraph({ className, text, cta }: LeadParagraphProps) {
  const paragraphs = typeof text === "string" ? [text] : text;

  return (
    <section className={cn("hhcp-lp-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-lp-container">
        <div className="hhcp-lp-body">
          <div
            className="hhcp-lp-text font-dm-sans"
            data-paragraphs={paragraphs.length > 1 ? "many" : undefined}
          >
            {paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
            ))}
          </div>

          {cta !== undefined && (
            <a className="hhcp-lp-link font-dm-sans" href={cta.href}>
              <span className="hhcp-lp-link-icon">
                <ArrowRightIcon />
              </span>
              <span>{cta.label}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
