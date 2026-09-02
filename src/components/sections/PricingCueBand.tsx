/**
 * "What to expect on cost" — the pricing cue card.
 *
 * One fee shown large, the rest as a short table, then the caveat and a link
 * out to the full pricing page. It is a cue, not a price list: the service
 * pages point at `/pricing/` rather than restating it, so there is one page to
 * correct when Ranjeeta confirms the figures.
 *
 * Named PricingCueBand rather than PricingCue because `components/modules`
 * already has a PricingCue from the Phase 1 module layer.
 */

import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

const STYLES = `
.hhcp-pc-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-pc-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-pc-heading {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-pc-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hhcp-pc-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-pc-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pc-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pc-card {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--hhcp-space-xl, 67.5px);
  align-items: center;
  padding: var(--hhcp-space-l, 45px);
  border-radius: 12px;
  background: var(--hhcp-light-green, #ddffeb);
}

.hhcp-pc-headline-label {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-primary, #013126);
  margin-bottom: 8px;
}

.hhcp-pc-headline {
  font-size: 64px;
  line-height: 1;
  font-weight: 400;
  letter-spacing: -0.6px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pc-rows {
  display: flex;
  flex-direction: column;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

.hhcp-pc-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(1, 49, 38, 0.12);
}

.hhcp-pc-row:last-child {
  border-bottom: none;
}

.hhcp-pc-row-label {
  font-size: var(--hhcp-text-s, 16px);
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-pc-row-value {
  font-size: var(--hhcp-text-s, 16px);
  font-weight: 600;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pc-foot {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--hhcp-space-m, 30px);
}

.hhcp-pc-note {
  max-width: 700px;
  font-size: var(--hhcp-text-s, 16px);
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-pc-link {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 4px;
  flex: none;
  font-size: 16px;
  font-weight: 600;
  color: var(--hhcp-primary, #013126);
  text-decoration: none;
  transition: all 0.3s linear;
}

.hhcp-pc-link:hover {
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-pc-link-icon {
  display: flex;
  flex: none;
  color: inherit;
}

@media (max-width: 991px) {
  .hhcp-pc-card {
    grid-template-columns: 1fr;
    gap: var(--hhcp-space-m, 30px);
  }
}

@media (max-width: 767px) {
  .hhcp-pc-card {
    padding: var(--hhcp-space-m, 30px);
  }

  .hhcp-pc-headline {
    font-size: 48px;
  }
}
`;

interface PricingRow {
  readonly label: string;
  readonly value: string;
}

interface PricingCueBandProps {
  className?: string;
  eyebrow: string;
  heading: string;
  headline: string;
  headlineLabel: string;
  rows: readonly PricingRow[];
  note: string;
  cta: { label: string; href: string };
}

export function PricingCueBand({
  className,
  eyebrow,
  heading,
  headline,
  headlineLabel,
  rows,
  note,
  cta,
}: PricingCueBandProps) {
  return (
    <section className={cn("hhcp-pc-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-pc-container">
        <div className="hhcp-pc-heading">
          <div className="hhcp-pc-eyebrow">
            <span className="hhcp-pc-dot" />
            <span className="hhcp-pc-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>
          <h2 className="hhcp-pc-title font-dm-sans">{heading}</h2>
        </div>

        <div className="hhcp-pc-card">
          <div>
            <p className="hhcp-pc-headline-label">{headlineLabel}</p>
            <p className="hhcp-pc-headline font-dm-sans">{headline}</p>
          </div>

          <ul className="hhcp-pc-rows">
            {rows.map((row) => (
              <li key={row.label} className="hhcp-pc-row">
                <span className="hhcp-pc-row-label font-dm-sans">
                  {row.label}
                </span>
                <span className="hhcp-pc-row-value font-dm-sans">
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hhcp-pc-foot">
          <p className="hhcp-pc-note font-dm-sans">{note}</p>
          <a className="hhcp-pc-link font-dm-sans" href={cta.href}>
            <span className="hhcp-pc-link-icon">
              <ArrowRightIcon width={17} height={17} />
            </span>
            <span>{cta.label}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
