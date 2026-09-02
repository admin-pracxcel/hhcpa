/**
 * "Explore your options" — the interlinking block at the foot of a service page.
 *
 * Cards can carry more than one destination, because the source copy pairs
 * men's and women's health in a single item. One card per destination would
 * have meant four cards where the module map asks for two to three.
 *
 * Gated destinations are filtered out, and a card whose every link is gated
 * disappears with them — the same mechanism the navigation and the homepage's
 * focus grid use.
 */

import { cn } from "@/lib/utils";
import { isGated } from "@/content/routes";
import { ArrowRightIcon } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

const STYLES = `
.hhcp-rc-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-rc-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-rc-heading {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-rc-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hhcp-rc-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-rc-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-rc-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

/* Same card treatment as the homepage focus grid. */
.hhcp-rc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.hhcp-rc-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  min-height: 200px;
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #d6e8e1;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hhcp-rc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(1, 49, 39, 0.1);
  border-color: var(--hhcp-primary, #013126);
}

.hhcp-rc-card-title {
  font-size: 20px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 8px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-rc-card-body {
  font-size: 14px;
  line-height: 1.5;
  color: #526f68;
}

.hhcp-rc-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hhcp-rc-link {
  display: flex;
  flex-direction: row-reverse;
  align-self: flex-start;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: var(--hhcp-primary, #013126);
  text-decoration: none;
  transition: all 0.3s linear;
}

.hhcp-rc-link:hover {
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-rc-link-icon {
  display: flex;
  flex: none;
  color: inherit;
}

.hhcp-rc-footnote {
  font-size: var(--hhcp-text-s, 16px);
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-rc-footnote a {
  color: var(--hhcp-primary, #013126);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.hhcp-rc-footnote a:hover {
  color: var(--hhcp-action-dark, #0c7340);
}

@media (max-width: 900px) {
  .hhcp-rc-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .hhcp-rc-grid {
    grid-template-columns: 1fr;
  }
}
`;

interface RelatedLink {
  readonly label: string;
  readonly href: string;
}

export interface RelatedCard {
  readonly title: string;
  readonly body: string;
  readonly links: readonly RelatedLink[];
}

interface RelatedCardsProps {
  className?: string;
  eyebrow: string;
  heading: string;
  cards: readonly RelatedCard[];
  footnote: string;
  footnoteLinks: readonly RelatedLink[];
}

export function RelatedCards({
  className,
  eyebrow,
  heading,
  cards,
  footnote,
  footnoteLinks,
}: RelatedCardsProps) {
  const visible = cards
    .map((card) => ({
      ...card,
      links: card.links.filter((link) => !isGated(link.href)),
    }))
    .filter((card) => card.links.length > 0);

  return (
    <section className={cn("hhcp-rc-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-rc-container">
        <div className="hhcp-rc-heading">
          <div className="hhcp-rc-eyebrow">
            <span className="hhcp-rc-dot" />
            <span className="hhcp-rc-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>
          <h2 className="hhcp-rc-title font-dm-sans">{heading}</h2>
        </div>

        <div className="hhcp-rc-grid">
          {visible.map((card) => (
            <article key={card.title} className="hhcp-rc-card">
              <div>
                <h3 className="hhcp-rc-card-title font-dm-sans">
                  {card.title}
                </h3>
                <p className="hhcp-rc-card-body font-dm-sans">{card.body}</p>
              </div>

              <div className="hhcp-rc-links">
                {card.links.map((link) => (
                  <a
                    key={link.href}
                    className="hhcp-rc-link font-dm-sans"
                    href={link.href}
                  >
                    <span className="hhcp-rc-link-icon">
                      <ArrowRightIcon width={17} height={17} />
                    </span>
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="hhcp-rc-footnote font-dm-sans">
          {footnote}{" "}
          {footnoteLinks.map((link, index) => (
            <span key={link.href}>
              {index > 0 ? ", or view " : ""}
              <a href={link.href}>{link.label}</a>
              {index === footnoteLinks.length - 1 ? "." : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
