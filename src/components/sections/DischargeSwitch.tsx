/**
 * `/discharge/` — the two-column "Make the switch" section.
 *
 * Her layout, measured off the live page at a 1534px viewport:
 *
 *   section          transparent, padding 90px 60px
 *     └─ container   the shared 1340px wrapper
 *          └─ grid   left column 495px, mint card 619px, 226px between them
 *
 * Those three widths are 37% / 46.2% of the container with the remainder as
 * the gap, which is how they are expressed below — the proportions hold as the
 * container narrows, where three fixed pixel values would not.
 *
 * The left column is static copy, so it lives here. The card is the form,
 * which posts, so it stays a client component and is passed in rather than
 * rendered here — this file has no "use client" and does not need one.
 */

import type { ReactNode } from "react";

import { DISCHARGE_PAGE } from "@/content/services/discharge";
import { CheckCircleIcon } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

const STYLES = `
/*
 * The header is fixed and this page has no hero band under it, so the top
 * padding has to clear it the way ServiceHero's does — 122px above the
 * section's own spacing, dropping to 108px once the announcement strip has
 * furled at the narrower widths.
 */
.hhcp-ds-section {
  padding: calc(var(--hhcp-section-space-m) + 122px) var(--hhcp-gutter)
    var(--hhcp-section-space-m);
}

/* The section supplies the gutter, so the shared container must not add its own. */
.hhcp-ds-container {
  padding-inline: 0;
}

.hhcp-ds-grid {
  display: grid;
  /* 495px and 619px of a 1340px container. See the header. */
  grid-template-columns: 37% 46.2%;
  justify-content: space-between;
  /*
   * Required for the sticky column below, not just for looks: a grid item
   * defaults to stretching the full row height, and an element as tall as its
   * scroll container has nowhere to travel, so it never sticks.
   */
  align-items: start;
}

/*
 * The copy holds at the top while the form scrolls past it, as hers does.
 * Her wrapper is sticky sticky--top static--l at top: 0; ours offsets by
 * the pinned header instead, because her header scrolls away and ours does
 * not — at top: 0 the eyebrow would sit under the floating pill.
 *
 * CSS only. No scroll listener and no IntersectionObserver, which this
 * codebase does not have and is not getting.
 */
.hhcp-ds-copy {
  position: sticky;
  top: calc(var(--hhcp-header-pinned-h, 110px) + var(--hhcp-space-s, 20px));
}

.hhcp-ds-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ds-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--hhcp-action, #58eda2);
}

.hhcp-ds-title {
  margin-top: var(--hhcp-space-xs, 10px);
  font-size: 56px;
  line-height: 60.448px;
  font-weight: 400;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ds-intro {
  margin-top: var(--hhcp-space-m, 30px);
  font-size: 16px;
  line-height: 24px;
  color: var(--hhcp-base-80, #34524a);
}

.hhcp-ds-why {
  margin-top: var(--hhcp-space-m, 30px);
  font-size: 16px;
  font-weight: 600;
  color: var(--hhcp-base-80, #34524a);
}

.hhcp-ds-reasons {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  margin-top: var(--hhcp-space-s, 20px);
  padding: 0;
  list-style: none;
}

.hhcp-ds-reason {
  display: flex;
  gap: 12px;
  font-size: 16px;
  line-height: 24px;
  color: var(--hhcp-base-80, #34524a);
}

.hhcp-ds-check {
  flex: none;
  width: 20px;
  height: 20px;
  margin-top: 2px;
  color: var(--hhcp-action-dark, #0c7340);
}

/*
 * One column below the target's own 991px breakpoint, copy first. The card
 * keeps its own padding, so only the grid changes.
 */
@media (max-width: 991px) {
  .hhcp-ds-section {
    padding-top: calc(var(--hhcp-section-space-m) + 108px);
  }

  .hhcp-ds-grid {
    grid-template-columns: 1fr;
    row-gap: var(--hhcp-space-l, 40px);
  }

  /* Her static--l: stacked, the copy is above the form, so pinning it would
     only push the form off screen. */
  .hhcp-ds-copy {
    position: static;
  }

  .hhcp-ds-title {
    font-size: var(--hhcp-h2, 40px);
    line-height: 1.1;
  }
}

@media (max-width: 478px) {
  .hhcp-ds-title {
    font-size: var(--hhcp-h3, 28px);
  }
}
`;

export function DischargeSwitch({ form }: { form: ReactNode }) {
  return (
    <section className="hhcp-ds-section">
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-ds-container">
        <div className="hhcp-ds-grid">
          <div className="hhcp-ds-copy">
            <div className="hhcp-ds-eyebrow">
              <span className="hhcp-ds-dot" />
              <span>{DISCHARGE_PAGE.eyebrow}</span>
            </div>

            <h1 className="hhcp-ds-title font-dm-sans">
              {DISCHARGE_PAGE.heading}
            </h1>

            <p className="hhcp-ds-intro font-dm-sans">{DISCHARGE_PAGE.intro}</p>

            <p className="hhcp-ds-why font-dm-sans">
              {DISCHARGE_PAGE.whyHeading}
            </p>

            <ul className="hhcp-ds-reasons font-dm-sans">
              {DISCHARGE_PAGE.reasons.map((reason) => (
                <li key={reason} className="hhcp-ds-reason">
                  <CheckCircleIcon className="hhcp-ds-check" aria-hidden="true" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {form}
        </div>
      </div>
    </section>
  );
}
