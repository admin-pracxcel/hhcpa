/**
 * Hero for the service pages.
 *
 * Deliberately not `HeroSection`: that one is the homepage's full-viewport
 * video, and a 100dvh video on every one of nineteen service pages would push
 * the actual content below the fold on all of them. This is a compact dark
 * band — breadcrumb, H1 and the two CTAs — sized by its content, so the page's
 * first section starts where the reader can see it.
 *
 * No tap-to-call here, though the content document's hero lists one. The
 * number is already in the header at every width and in the sticky bar on
 * phones, so the call path is covered twice over without it.
 *
 * The breadcrumb is visible, not only in the BreadcrumbList schema. It is the
 * only in-page indication of which silo a service page belongs to.
 */

import { cn } from "@/lib/utils";

const STYLES = `
.hhcp-sv-section {
  position: relative;
  background-color: var(--hhcp-primary, #013126);
  padding: calc(var(--hhcp-section-space-m) + 122px) var(--hhcp-gutter)
    var(--hhcp-section-space-m);
}

/* The header is absolute over this band, so the top padding clears it. */
@media (max-width: 991px) {
  .hhcp-sv-section {
    padding-top: calc(var(--hhcp-section-space-m) + 108px);
  }
}

.hhcp-sv-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-m, 30px);
}

.hhcp-sv-crumbs {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-action-light, #baf8d9);
}

.hhcp-sv-crumbs a {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s linear;
}

.hhcp-sv-crumbs a:hover {
  color: var(--hhcp-action, #58eda2);
}

.hhcp-sv-crumb-sep {
  opacity: 0.5;
}

.hhcp-sv-current {
  color: #ffffff;
}

.hhcp-sv-title {
  max-width: 900px;
  font-size: 52px;
  line-height: 1.15;
  font-weight: 400;
  letter-spacing: -0.6px;
  color: #ffffff;
}

.hhcp-sv-actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-top: var(--hhcp-space-xs, 13.5px);
}

.hhcp-sv-cta-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  line-height: 1;
  font-weight: 500;
  text-transform: uppercase;
  padding: 12.132px 19.2px;
  border-radius: var(--hhcp-radius-pill, 800px);
  border: 1px solid #ffffff;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s linear;
}

.hhcp-sv-cta-outline:hover {
  background-color: #ffffff;
  color: var(--hhcp-primary, #013126);
}

@media (max-width: 991px) {
  .hhcp-sv-title {
    font-size: 36px;
  }
}

@media (max-width: 767px) {
  .hhcp-sv-title {
    font-size: 28px;
  }
}

@media (max-width: 478px) {
  .hhcp-sv-title {
    font-size: 24px;
  }
}
`;

export interface Crumb {
  readonly label: string;
  readonly href: string;
}

interface ServiceHeroProps {
  className?: string;
  eyebrow: string;
  heading: string;
  crumbs: readonly Crumb[];
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}

export function ServiceHero({
  className,
  eyebrow,
  heading,
  crumbs,
  primary,
  secondary,
}: ServiceHeroProps) {
  return (
    <section className={cn("hhcp-sv-section", "hhcp-on-dark", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-sv-container">
        <nav className="hhcp-sv-crumbs" aria-label="Breadcrumb">
          {crumbs.map((crumb) => (
            <span key={crumb.href}>
              <a href={crumb.href}>{crumb.label}</a>
              <span className="hhcp-sv-crumb-sep"> / </span>
            </span>
          ))}
          <span className="hhcp-sv-current" aria-current="page">
            {eyebrow}
          </span>
        </nav>

        <h1 className="hhcp-sv-title font-dm-sans">{heading}</h1>

        <div className="hhcp-sv-actions">
          <a className="hhcp-btn" href={primary.href}>
            {primary.label}
          </a>
          <a className="hhcp-sv-cta-outline" href={secondary.href}>
            {secondary.label}
          </a>
        </div>
      </div>
    </section>
  );
}
