/**
 * "Why patients choose Horizon" — the trust tiles.
 *
 * Authored for the rebuilt homepage in the clone's idiom. The content spec
 * calls for "3 to 4 across, icon + heading + line"; five items divide badly
 * into four columns, so the grid runs three across and lets the last row hold
 * two wider tiles rather than leaving a hole.
 *
 * The check icon is the same one the pricing list and the story bullets use, so
 * this reads as part of the same family rather than a new visual language.
 */

import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

const STYLES = `
.hhcp-vt-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-vt-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-vt-heading {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-vt-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hhcp-vt-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-vt-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-vt-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-vt-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--hhcp-space-m, 30px);
}

.hhcp-vt-tile {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.hhcp-vt-icon {
  flex: none;
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-vt-tile-title {
  font-size: var(--hhcp-h4, 20px);
  line-height: 24.16px;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
  margin-bottom: 8px;
}

.hhcp-vt-tile-body {
  font-size: var(--hhcp-text-s, 16px);
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

@media (max-width: 1199px) {
  .hhcp-vt-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .hhcp-vt-grid {
    grid-template-columns: 1fr;
    gap: var(--hhcp-space-l, 45px);
  }
}
`;

interface ValueTile {
  readonly title: string;
  readonly body: string;
}

interface ValueTilesProps {
  className?: string;
  eyebrow: string;
  heading: string;
  tiles: readonly ValueTile[];
}

export function ValueTiles({
  className,
  eyebrow,
  heading,
  tiles,
}: ValueTilesProps) {
  return (
    <section className={cn("hhcp-vt-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-vt-container">
        <div className="hhcp-vt-heading">
          <div className="hhcp-vt-eyebrow">
            <span className="hhcp-vt-dot" />
            <span className="hhcp-vt-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>
          <h2 className="hhcp-vt-title font-dm-sans">{heading}</h2>
        </div>

        <div className="hhcp-vt-grid">
          {tiles.map((tile) => (
            <div key={tile.title} className="hhcp-vt-tile">
              <CheckCircleIcon
                className="hhcp-vt-icon"
                width={24}
                height={25}
              />
              <div>
                <h3 className="hhcp-vt-tile-title font-dm-sans">
                  {tile.title}
                </h3>
                <p className="hhcp-vt-tile-body font-dm-sans">{tile.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
