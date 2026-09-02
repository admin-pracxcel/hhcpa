/**
 * "Choose your focus" — the six service cards that route into the silos.
 *
 * Authored for the rebuilt homepage in the clone's idiom: 1340px container,
 * eyebrow dot + h2 over a hairline, 10px card radius, and the target's own
 * 1199 / 767 breakpoints rather than Tailwind's.
 *
 * Gated destinations are filtered out here rather than commented out of the
 * content file. `/medicinal-cannabis/` is gated pending compliance sign-off
 * (Service Agreement clause 6.2(b)), so its card does not render and the grid
 * closes up around it — the same mechanism the navigation uses. Ungating is one
 * flag in `routes.ts`.
 */

import { cn } from "@/lib/utils";
import { isGated } from "@/content/routes";
import type { FocusCard } from "@/content/home";
import { ArrowRightIcon } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

const STYLES = `
.hhcp-fo-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-fo-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-fo-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--hhcp-space-s, 20px);
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-fo-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.hhcp-fo-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-fo-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-fo-title {
  text-align: center;
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-fo-intro {
  max-width: 620px;
  text-align: center;
  font-size: var(--hhcp-text-s, 16px);
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

/*
 * Card styling is the booking wizard's service cards verbatim: 20px grid gap,
 * white face on a #d6e8e1 hairline, 12px radius, 24px padding, 220px floor, and
 * the lift-and-shadow hover. Its own breakpoints too (900 / 600), which are the
 * wizard's rather than the target's 1199 / 767.
 */
/*
 * Flex rather than grid, so a row that is not full centres its cards instead
 * of leaving a hole on the right. Five cards across three columns is the usual
 * case here, and the gated sixth returning would make it six -- both look
 * right this way. The card widths reproduce a three-column grid exactly:
 * a third of the row, less its share of the two gaps.
 */
.hhcp-fo-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.hhcp-fo-card {
  flex: 0 1 calc((100% - 40px) / 3);
}

.hhcp-fo-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #d6e8e1;
  text-align: left;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hhcp-fo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(1, 49, 39, 0.1);
  border-color: var(--hhcp-primary, #013126);
}

/*
 * The card is a flex column, so an auto width alone does not keep the icon
 * square: the default align-items of stretch pulls it to the card's full width
 * and squashes the artwork. align-self opts it out, and the supplied icons are
 * square, so the box is too.
 */
.hhcp-fo-icon {
  align-self: flex-start;
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  object-fit: contain;
  display: block;
}

/* The wizard's price chip: tinted block, not a mint pill. */
.hhcp-fo-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(1, 49, 39, 0.08);
  color: var(--hhcp-primary, #013126);
  font-size: 16px;
  font-weight: 500;
}

.hhcp-fo-card-title {
  font-size: 20px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 8px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-fo-card-body {
  flex-grow: 1;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.5;
  color: #526f68;
}

/* Price chip and link share the card's last row. */
.hhcp-fo-foot {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

/* Same icon-link treatment the FAQ footer uses: arrow first, row-reverse. */
.hhcp-fo-link {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--hhcp-primary, #013126);
  text-decoration: none;
  transition: all 0.3s linear;
}

.hhcp-fo-link:hover {
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-fo-link-icon {
  display: flex;
  flex: none;
  color: inherit;
}

@media (max-width: 900px) {
  .hhcp-fo-card {
    flex-basis: calc((100% - 20px) / 2);
  }
}

@media (max-width: 600px) {
  .hhcp-fo-card {
    flex-basis: 100%;
  }
}
`;

interface FocusGridProps {
  className?: string;
  /** Anchor target, so a CTA higher on the page can jump to the grid. */
  id?: string;
  eyebrow: string;
  heading: string;
  intro: string;
  cards: readonly FocusCard[];
}

export function FocusGrid({
  className,
  id,
  eyebrow,
  heading,
  intro,
  cards,
}: FocusGridProps) {
  const visible = cards.filter((card) => !isGated(card.href));

  return (
    <section className={cn("hhcp-fo-section", className)} id={id}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-fo-container">
        <div className="hhcp-fo-heading">
          <div className="hhcp-fo-eyebrow">
            <span className="hhcp-fo-dot" />
            <span className="hhcp-fo-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>
          <h2 className="hhcp-fo-title font-dm-sans">{heading}</h2>
          <p className="hhcp-fo-intro font-dm-sans">{intro}</p>
        </div>

        <div className="hhcp-fo-grid">
          {visible.map((card) => (
            <article key={card.title} className="hhcp-fo-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hhcp-fo-icon"
                src={card.icon}
                alt={card.iconAlt}
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
              />
              <h3 className="hhcp-fo-card-title font-dm-sans">{card.title}</h3>
              <p className="hhcp-fo-card-body font-dm-sans">{card.body}</p>
              <div className="hhcp-fo-foot">
                <span className="hhcp-fo-badge font-dm-sans">{card.badge}</span>
                <a className="hhcp-fo-link font-dm-sans" href={card.href}>
                  <span className="hhcp-fo-link-icon">
                    <ArrowRightIcon width={17} height={17} />
                  </span>
                  <span>{card.cta}</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
