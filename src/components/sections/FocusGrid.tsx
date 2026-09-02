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
  gap: var(--hhcp-space-s, 20px);
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-fo-eyebrow {
  display: flex;
  align-items: center;
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
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-fo-intro {
  max-width: 620px;
  font-size: var(--hhcp-text-s, 16px);
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-fo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--hhcp-space-m, 30px);
}

.hhcp-fo-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: var(--hhcp-space-m, 30px);
  border-radius: 10px;
  background-color: var(--hhcp-accent, #f5fff9);
  border: 1px solid var(--hhcp-neutral-ultra-light, #f2f2f2);
  transition: all 0.3s linear;
}

.hhcp-fo-card:hover {
  box-shadow: 5px 5px 25px 0 rgba(33, 33, 33, 0.1);
}

/* Matches the booking wizard's service cards: 64px tall, width auto. */
.hhcp-fo-icon {
  height: 64px;
  width: auto;
  max-width: 100%;
  display: block;
}

.hhcp-fo-badge {
  align-self: flex-start;
  padding: 3px 12px;
  border-radius: var(--hhcp-radius-xl, 22.5px);
  background-color: var(--hhcp-action, #58eda2);
  color: var(--hhcp-primary, #013126);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
}

.hhcp-fo-card-title {
  font-size: var(--hhcp-h4, 20px);
  line-height: 24.16px;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
}

.hhcp-fo-card-body {
  flex: 1;
  font-size: var(--hhcp-text-s, 16px);
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

/* Same icon-link treatment the FAQ footer uses: arrow first, row-reverse. */
.hhcp-fo-link {
  display: flex;
  flex-direction: row-reverse;
  align-self: flex-start;
  align-items: center;
  gap: 4px;
  font-size: 16px;
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

@media (max-width: 1199px) {
  .hhcp-fo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .hhcp-fo-grid {
    grid-template-columns: 1fr;
  }
}
`;

interface FocusGridProps {
  className?: string;
  eyebrow: string;
  heading: string;
  intro: string;
  cards: readonly FocusCard[];
}

export function FocusGrid({
  className,
  eyebrow,
  heading,
  intro,
  cards,
}: FocusGridProps) {
  const visible = cards.filter((card) => !isGated(card.href));

  return (
    <section className={cn("hhcp-fo-section", className)}>
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
                height={64}
                loading="lazy"
                decoding="async"
              />
              <span className="hhcp-fo-badge font-roboto-mono">
                {card.badge}
              </span>
              <h3 className="hhcp-fo-card-title font-dm-sans">{card.title}</h3>
              <p className="hhcp-fo-card-body font-dm-sans">{card.body}</p>
              <a className="hhcp-fo-link font-dm-sans" href={card.href}>
                <span className="hhcp-fo-link-icon">
                  <ArrowRightIcon width={17} height={17} />
                </span>
                <span>{card.cta}</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
