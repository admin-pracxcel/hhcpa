/**
 * Lead paragraph — the first on-page text under the hero.
 *
 * Authored for the rebuilt homepage rather than lifted from the clone, but
 * written in the clone's idiom: scoped `<style>` with its own class prefix,
 * exact values rather than Tailwind's t-shirt scale, and the target's own
 * 991 / 767 / 478 breakpoints.
 *
 * It carries the page's primary keyword in its first sentence, so it is a
 * content module in its own right, not decoration — see the design spec, §3.1.
 *
 * Two columns rather than one full-width slab. Set across the whole 1340px
 * container the copy ran to 136 characters a line, about double a comfortable
 * measure, and the band held nothing but those four lines. The eyebrow column
 * gives it a left edge to sit against and the text column lands near 75.
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

.hhcp-lp-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--hhcp-space-xl, 67.5px);
  align-items: start;
}

.hhcp-lp-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 10px;
}

.hhcp-lp-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-lp-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-lp-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--hhcp-space-m, 30px);
}

.hhcp-lp-text {
  max-width: 100%;
  font-size: var(--hhcp-text-l, 21.328px);
  line-height: 1.6;
  font-weight: 400;
  color: var(--hhcp-primary, #013126);
}

/* Same icon-link treatment the FAQ footer and the focus cards use. */
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

@media (max-width: 991px) {
  .hhcp-lp-grid {
    grid-template-columns: 1fr;
    gap: var(--hhcp-space-m, 30px);
  }

  .hhcp-lp-eyebrow {
    padding-top: 0;
  }
}

@media (max-width: 767px) {
  .hhcp-lp-text {
    font-size: var(--hhcp-text-m, 16px);
    line-height: 1.6;
  }
}
`;

interface LeadParagraphProps {
  className?: string;
  eyebrow: string;
  text: string;
  cta: { label: string; href: string };
}

export function LeadParagraph({
  className,
  eyebrow,
  text,
  cta,
}: LeadParagraphProps) {
  return (
    <section className={cn("hhcp-lp-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-lp-container">
        <div className="hhcp-lp-grid">
          <div className="hhcp-lp-eyebrow">
            <span className="hhcp-lp-dot" />
            <span className="hhcp-lp-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>

          <div className="hhcp-lp-body">
            <p className="hhcp-lp-text font-dm-sans">{text}</p>
            <a className="hhcp-lp-link font-dm-sans" href={cta.href}>
              <span className="hhcp-lp-link-icon">
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
