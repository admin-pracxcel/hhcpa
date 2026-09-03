/**
 * The "Other services" price list, as tiles.
 *
 * Ten services across two rows of five, in the card idiom the homepage's
 * "Choose your focus" grid established — white face, 12px radius, the same
 * #d6e8e1 hairline, and the same lift on hover. Requested in place of the
 * two-column table this replaced.
 *
 * Markup is a description list, not a grid of divs. Each tile is one
 * service-to-fee pair, which is what a `dt`/`dd` is; a screen reader reading
 * the tiles gets the pairing that the table's two columns used to carry, and
 * the price is never read adrift from the service it belongs to.
 *
 * The tiles show "from $49" rather than a bare "$49" under a column headed
 * "From", because there is no column header to inherit from once the rows are
 * broken apart. `formatPrice` already does this — the table had to strip it
 * back off.
 *
 * Amounts come from `pricing.ts`, never from a literal here, so this list and
 * the nineteen service pages that quote the same figures cannot disagree.
 */

import { cn } from "@/lib/utils";
import type { PriceKey } from "@/content/pricing";
import { PRICES, formatPrice } from "@/content/pricing";

const STYLES = `
.hhcp-ptl-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-ptl-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-ptl-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--hhcp-space-s, 20px);
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-ptl-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.hhcp-ptl-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-ptl-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ptl-title {
  font-size: var(--hhcp-h2);
  line-height: var(--hhcp-heading-lh);
  letter-spacing: -0.6px;
  font-weight: 400;
  text-align: center;
  color: var(--hhcp-primary, #013126);
}

/*
 * Five to a row, and ten services, so the two rows come out even. Explicit
 * columns rather than the focus grid's flex-basis arithmetic: a dangling
 * fifth tile on a row of its own is the thing to avoid here, and a grid says
 * "five" in one place instead of deriving it from a percentage.
 */
.hhcp-ptl-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin: 0;
}

.hhcp-ptl-tile {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  min-height: 150px;
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #d6e8e1;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hhcp-ptl-tile:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(1, 49, 39, 0.1);
  border-color: var(--hhcp-primary, #013126);
}

.hhcp-ptl-term {
  font-size: 16px;
  line-height: 1.3;
  font-weight: 400;
  color: var(--hhcp-primary, #013126);
}

/*
 * dd carries a browser default margin-inline-start of 40px, which would indent
 * every price away from the service above it.
 */
.hhcp-ptl-value {
  margin: 0;
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-accent, #f5fff9);
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
  white-space: nowrap;
}

.hhcp-ptl-note {
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  color: #526f68;
}

/*
 * Five, then two, then one — skipping the three and four the project's usual
 * ladder would take. Ten tiles divide evenly by five, two and one and by
 * nothing else on that ladder, and a row carrying a single stranded tile after
 * three full ones looks like something failed to load.
 *
 * Two columns are too wide for a stacked tile, so below 991 the tile turns
 * itself into a row: service on the left, fee on the right, which is the shape
 * the table this replaced had anyway. It reads better at that width than a
 * name marooned above a chip 150px below it.
 */
@media (max-width: 991px) {
  .hhcp-ptl-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hhcp-ptl-tile {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    min-height: 0;
    padding: 20px 24px;
  }
  .hhcp-ptl-value {
    align-self: center;
  }
}

@media (max-width: 478px) {
  .hhcp-ptl-grid {
    grid-template-columns: 1fr;
  }
}
`;

interface PriceTilesProps {
  className?: string;
  eyebrow: string;
  heading: string;
  rows: readonly PriceKey[];
  /** Overrides the canonical label where a page needs to qualify one. */
  labels?: Partial<Record<PriceKey, string>>;
  note?: string;
}

export function PriceTiles({
  className,
  eyebrow,
  heading,
  rows,
  labels,
  note,
}: PriceTilesProps) {
  return (
    <section className={cn("hhcp-ptl-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-ptl-container">
        <div className="hhcp-ptl-heading">
          <div className="hhcp-ptl-eyebrow">
            <span className="hhcp-ptl-dot" />
            <span className="hhcp-ptl-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>
          <h2 className="hhcp-ptl-title font-dm-sans">{heading}</h2>
        </div>

        <dl className="hhcp-ptl-grid">
          {rows.map((key) => (
            <div key={key} className="hhcp-ptl-tile">
              <dt className="hhcp-ptl-term font-dm-sans">
                {labels?.[key] ?? PRICES[key].label}
              </dt>
              <dd className="hhcp-ptl-value font-dm-sans">
                {formatPrice(key)}
              </dd>
            </div>
          ))}
        </dl>

        {note !== undefined && (
          <p className="hhcp-ptl-note font-dm-sans">{note}</p>
        )}
      </div>
    </section>
  );
}
