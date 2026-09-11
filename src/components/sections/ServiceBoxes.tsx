/**
 * "Choose Your Service" — her thirteen service boxes.
 *
 * Replaces the eight-card focus grid on `/` and `/services`, per her
 * 9 September instruction and the 11 September audit. See
 * `content/service-boxes.ts` for what is hers, what is not, and why.
 *
 * A separate component rather than a variant of `FocusGrid`, because the two
 * carry different things. A focus card is a service area with a one-line
 * summary; a service box is a bookable thing with her "Includes:" line, her
 * emphasised caveat and her price. Flagging those through FocusGrid would
 * have meant four optional props and a card that renders differently
 * depending which page it is on.
 *
 * The whole box is the link. Thirteen boxes each with a separate "Explore"
 * affordance is thirteen more tab stops for no gain — the title is the link
 * text, and the arrow is decorative.
 */

import { cn } from "@/lib/utils";
import { isGated } from "@/content/routes";
import { boxPrice, type ServiceBox } from "@/content/service-boxes";
import { ArrowRightIcon } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

const STYLES = `
.hhcp-sb-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-sb-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--hhcp-space-xs, 10px);
  margin-bottom: var(--hhcp-space-l, 40px);
  text-align: center;
}

.hhcp-sb-eyebrow {
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

.hhcp-sb-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--hhcp-action, #58eda2);
}

.hhcp-sb-title {
  font-size: var(--hhcp-h2, 40px);
  line-height: 1.15;
  color: var(--hhcp-primary, #013126);
}

.hhcp-sb-intro {
  max-width: 620px;
  color: var(--hhcp-base-80, #34524a);
}

/*
 * Flex, not grid, so a row that is not full centres rather than leaving a
 * hole. Thirteen boxes over four columns is three full rows and one of one,
 * and that last box sits in the middle where it reads as deliberate.
 */
.hhcp-sb-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.hhcp-sb-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 0 1 calc((100% - 60px) / 4);
  min-height: 200px;
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #d6e8e1;
  text-align: left;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hhcp-sb-card:hover {
  transform: translateY(-2px);
  border-color: var(--hhcp-primary, #013126);
  box-shadow: 0 10px 24px rgba(1, 49, 38, 0.08);
}

.hhcp-sb-card:focus-visible {
  outline: 2px solid var(--hhcp-action-dark, #0c7340);
  outline-offset: 2px;
}

.hhcp-sb-icon { width: 48px; height: 48px; }

.hhcp-sb-card-title {
  font-size: var(--hhcp-text-l, 18px);
  line-height: 1.25;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
}

.hhcp-sb-card-body {
  font-size: var(--hhcp-text-s, 14px);
  line-height: 1.5;
  color: var(--hhcp-base-80, #34524a);
}

.hhcp-sb-includes,
.hhcp-sb-strong {
  font-size: var(--hhcp-text-xs, 12px);
  line-height: 1.45;
  color: var(--hhcp-base-80, #34524a);
}

.hhcp-sb-strong { font-weight: 600; color: var(--hhcp-primary, #013126); }

.hhcp-sb-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 12px;
}

.hhcp-sb-price {
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(1, 49, 39, 0.08);
  color: var(--hhcp-primary, #013126);
  font-size: var(--hhcp-text-s, 14px);
  font-weight: 500;
}

.hhcp-sb-arrow {
  display: flex;
  flex: none;
  color: var(--hhcp-primary, #013126);
}

.hhcp-sb-card:hover .hhcp-sb-arrow { color: var(--hhcp-action-dark, #0c7340); }

@media (max-width: 1199px) {
  .hhcp-sb-card { flex-basis: calc((100% - 40px) / 3); }
}

@media (max-width: 900px) {
  .hhcp-sb-card { flex-basis: calc((100% - 20px) / 2); }
}

@media (max-width: 600px) {
  .hhcp-sb-card { flex-basis: 100%; }
  .hhcp-sb-title { font-size: var(--hhcp-h3, 28px); }
}
`;

interface ServiceBoxesProps {
  className?: string;
  /** Anchor target, so a CTA higher on the page can jump here. */
  id?: string;
  eyebrow: string;
  heading: string;
  intro: string;
  boxes: readonly ServiceBox[];
}

export function ServiceBoxes({
  className,
  id,
  eyebrow,
  heading,
  intro,
  boxes,
}: ServiceBoxesProps) {
  /* Same gating as the focus grid: a withheld destination takes its box. */
  const visible = boxes.filter((box) => !isGated(box.href));

  return (
    <section className={cn("hhcp-sb-section", className)} id={id}>
      <style>{STYLES}</style>
      <div className="hhcp-container">
        <div className="hhcp-sb-heading">
          <div className="hhcp-sb-eyebrow">
            <span className="hhcp-sb-dot" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="hhcp-sb-title font-dm-sans">{heading}</h2>
          <p className="hhcp-sb-intro font-dm-sans">{intro}</p>
        </div>

        <div className="hhcp-sb-grid">
          {visible.map((box) => (
            <a key={box.key} className="hhcp-sb-card" href={box.href}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hhcp-sb-icon"
                src={box.icon}
                alt=""
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                aria-hidden="true"
              />
              <h3 className="hhcp-sb-card-title font-dm-sans">{box.title}</h3>
              <p className="hhcp-sb-card-body font-dm-sans">{box.description}</p>
              {box.includes !== undefined && (
                <p className="hhcp-sb-includes font-dm-sans">{box.includes}</p>
              )}
              {box.strong !== undefined && (
                <p className="hhcp-sb-strong font-dm-sans">{box.strong}</p>
              )}
              <div className="hhcp-sb-foot">
                <span className="hhcp-sb-price font-dm-sans">
                  {boxPrice(box)}
                </span>
                <span className="hhcp-sb-arrow">
                  <ArrowRightIcon width={17} height={17} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
