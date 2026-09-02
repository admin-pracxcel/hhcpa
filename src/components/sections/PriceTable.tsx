/**
 * A price table, rendered from `pricing.ts` rather than from prose.
 *
 * The component takes `PriceKey`s, not strings, so the pricing page cannot
 * quote a figure that differs from the one a service page's pricing cue shows —
 * both read the same record. It also means confirming Ranjeeta's numbers stays
 * a one-file change however many pages display them.
 *
 * A real `<table>` rather than a grid of divs: this is tabular data, the header
 * row names what the columns mean, and screen readers announce the row header
 * with each cell as a result.
 */

import { cn } from "@/lib/utils";
import { PRICES, formatPrice } from "@/content/pricing";
import type { PriceKey } from "@/content/pricing";

/**
 * Labels come from the price record itself, so a row cannot be labelled as one
 * service and priced as another.
 */
const PRICE_LABEL = Object.fromEntries(
  (Object.keys(PRICES) as PriceKey[]).map((key) => [key, PRICES[key].label]),
) as Record<PriceKey, string>;

const STYLES = `
.hhcp-pt-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-pt-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-pt-heading {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-pt-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hhcp-pt-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-pt-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pt-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pt-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.hhcp-pt-table th {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-base-60, rgba(1, 49, 38, 0.6));
  padding-bottom: 16px;
  border-bottom: 1px solid var(--hhcp-base-20, rgba(1, 49, 38, 0.2));
}

.hhcp-pt-table th:last-child,
.hhcp-pt-table td:last-child {
  text-align: right;
}

.hhcp-pt-table td {
  padding: 20px 0;
  border-bottom: 1px solid #ececec;
  vertical-align: baseline;
}

.hhcp-pt-label {
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.5;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pt-value {
  font-size: var(--hhcp-h4, 20px);
  font-weight: 500;
  white-space: nowrap;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pt-note {
  font-size: var(--hhcp-text-s, 16px);
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

@media (max-width: 767px) {
  .hhcp-pt-table td {
    padding: 16px 0;
  }

  .hhcp-pt-value {
    font-size: var(--hhcp-text-m, 16px);
  }
}
`;

interface PriceTableProps {
  className?: string;
  eyebrow: string;
  heading: string;
  /** Column header over the figures. The source uses "Fee" and "From". */
  valueHeading: string;
  rows: readonly PriceKey[];
  /** Overrides a row's label where the table wording differs from the key's. */
  labels?: Partial<Record<PriceKey, string>>;
  /**
   * Drops the "from" prefix the shared formatter adds. Under a column headed
   * "From", "from $49" says it twice.
   */
  stripFrom?: boolean;
  note?: string;
}

export function PriceTable({
  className,
  eyebrow,
  heading,
  valueHeading,
  rows,
  labels,
  stripFrom,
  note,
}: PriceTableProps) {
  return (
    <section className={cn("hhcp-pt-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-pt-container">
        <div className="hhcp-pt-heading">
          <div className="hhcp-pt-eyebrow">
            <span className="hhcp-pt-dot" />
            <span className="hhcp-pt-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>
          <h2 className="hhcp-pt-title font-dm-sans">{heading}</h2>
        </div>

        <table className="hhcp-pt-table">
          <thead>
            <tr>
              <th scope="col">Service</th>
              <th scope="col">{valueHeading}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((key) => (
              <tr key={key}>
                <td className="hhcp-pt-label font-dm-sans">
                  {labels?.[key] ?? PRICE_LABEL[key]}
                </td>
                <td className="hhcp-pt-value font-dm-sans">
                  {stripFrom === true
                    ? formatPrice(key).replace(/^from /, "")
                    : formatPrice(key)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {note !== undefined && (
          <p className="hhcp-pt-note font-dm-sans">{note}</p>
        )}
      </div>
    </section>
  );
}
