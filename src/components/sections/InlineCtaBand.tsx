/**
 * "How to begin" — a short prompt with one button and a couple of supporting
 * links, sitting mid-page rather than closing it.
 *
 * Distinct from `FinalCtaSection`, which is the full-bleed closing band with
 * the video behind it. A page can only have one of those; this is the lighter
 * one that appears wherever the copy stops to say "here is the next step".
 */

import { cn } from "@/lib/utils";

const STYLES = `
.hhcp-ic-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-ic-container {
  padding-inline: 0;
}

.hhcp-ic-card {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--hhcp-space-l, 45px);
  padding: var(--hhcp-space-l, 45px);
  border-radius: 12px;
  background: var(--hhcp-light-green, #ddffeb);
}

.hhcp-ic-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 620px;
}

.hhcp-ic-title {
  font-size: var(--hhcp-h3, 32px);
  line-height: 1.2;
  font-weight: 400;
  letter-spacing: -0.32px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ic-text {
  font-size: 16px;
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-ic-text a {
  color: var(--hhcp-primary, #013126);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.hhcp-ic-text a:hover {
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-ic-action {
  flex: none;
}

@media (max-width: 767px) {
  .hhcp-ic-card {
    padding: var(--hhcp-space-m, 30px);
    gap: var(--hhcp-space-m, 30px);
  }
}
`;

interface InlineLink {
  readonly label: string;
  readonly href: string;
}

interface InlineCtaBandProps {
  className?: string;
  heading: string;
  /**
   * Split around the links: the text reads
   * `lead` <link 0> `mid` <link 1> `tail`.
   */
  lead: string;
  mid: string;
  tail: string;
  links: readonly [InlineLink, InlineLink];
  cta: { label: string; href: string };
}

export function InlineCtaBand({
  className,
  heading,
  lead,
  mid,
  tail,
  links,
  cta,
}: InlineCtaBandProps) {
  return (
    <section className={cn("hhcp-ic-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-ic-container">
        <div className="hhcp-ic-card">
          <div className="hhcp-ic-body">
            <h2 className="hhcp-ic-title font-dm-sans">{heading}</h2>
            <p className="hhcp-ic-text font-dm-sans">
              {lead}
              <a href={links[0].href}>{links[0].label}</a>
              {mid}
              <a href={links[1].href}>{links[1].label}</a>
              {tail}
            </p>
          </div>

          <a className={cn("hhcp-btn", "hhcp-ic-action")} href={cta.href}>
            {cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
