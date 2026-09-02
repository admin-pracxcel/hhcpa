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
 */

import { cn } from "@/lib/utils";

const STYLES = `
.hhcp-lp-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-lp-container {
  padding-inline: 0;
}

.hhcp-lp-text {
  max-width: 100%;
  font-size: var(--hhcp-text-l, 21.328px);
  line-height: 1.6;
  font-weight: 400;
  color: var(--hhcp-primary, #013126);
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
  text: string;
}

export function LeadParagraph({ className, text }: LeadParagraphProps) {
  return (
    <section className={cn("hhcp-lp-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-lp-container">
        <p className="hhcp-lp-text font-dm-sans">{text}</p>
      </div>
    </section>
  );
}
