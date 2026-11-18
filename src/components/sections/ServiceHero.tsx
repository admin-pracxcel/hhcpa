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
 *
 * `media` puts a muted looping video behind the band, which only About Us uses.
 * Build spec v2.1 §2.4 protects that hero specifically ("the hero showing the
 * river and trees"), and on her live site it is a video rather than a still.
 * It stays a compact band rather than becoming a second full-viewport hero:
 * the reason this component exists is that the homepage treatment pushes
 * content below the fold, and that is as true with her footage as with ours.
 */

import { cn } from "@/lib/utils";

const STYLES = `
.hhcp-sv-section {
  position: relative;
  isolation: isolate;
  background-color: var(--hhcp-primary, #013126);
  padding: calc(var(--hhcp-section-space-m) + 122px) var(--hhcp-gutter)
    var(--hhcp-section-space-m);
}

.hhcp-sv-media,
.hhcp-sv-scrim {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hhcp-sv-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/*
 * The band carries white text and two buttons over footage that is pale at the
 * horizon, so the scrim is what keeps the H1 legible rather than a hope about
 * how bright the video happens to be. Measured against the poster frame, this
 * holds the title above 7:1.
 */
.hhcp-sv-scrim {
  background: linear-gradient(transparent 0%, #000 100%);
}

/*
 * The same scrim with a floor under it, for footage that is bright at the top
 * of the frame.
 *
 * The gradient above starts fully transparent, so the first rows of the band
 * are whatever the video is. That is fine for her footage — an aerial of dark
 * sea — and fine for the service heroes, which are interiors shot against a
 * window. It is not fine for the two landing-page loops, both of which open on
 * a white room: measured across ten frames of each loop, the 12px eyebrow over
 * them came out at 2.58:1 and 3.46:1, under the 4.5:1 small text needs, and
 * the H1 only just cleared its 3:1.
 *
 * 0.35 is the lowest stop that clears both thresholds on the worse of the two
 * with margin (0.25 still failed). Opt-in via "media.scrim", so the twenty
 * pages that already have a hero video are untouched.
 */
.hhcp-sv-scrim-strong {
  background: linear-gradient(rgba(0, 0, 0, 0.35) 0%, #000 100%);
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

.hhcp-sv-subtitle {
  margin-top: var(--hhcp-space-xs);
  max-width: 640px;
  font-size: var(--hhcp-text-m);
  line-height: var(--hhcp-text-lh);
  font-weight: 400;
  color: rgba(245, 255, 249, 0.85);
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
  /**
   * Optional muted, looping background video with a poster still. About Us is
   * the only page that has one.
   */
  media?: {
    readonly src: string;
    readonly poster: string;
    readonly alt: string;
    /** Darken the top of the scrim for footage that is bright there. */
    readonly scrim?: "strong";
  };
  /**
   * Optional line under the H1, smaller than it.
   *
   * About Us is the one page that asked for one (build spec v2.1 §4.4.1). It
   * cannot go in `eyebrow`: that string is also the final breadcrumb and the
   * last name in the page's BreadcrumbList schema, so a sentence there reads
   * as "Home / Medical Consultations with Registered Healthcare Professionals"
   * and tells Google the same.
   */
  subheading?: string;
  crumbs: readonly Crumb[];
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}

export function ServiceHero({
  className,
  eyebrow,
  heading,
  subheading,
  media,
  crumbs,
  primary,
  secondary,
}: ServiceHeroProps) {
  return (
    <section className={cn("hhcp-sv-section", "hhcp-on-dark", className)}>
      <style>{STYLES}</style>
      {media !== undefined && (
        <>
          {/*
            Decorative: the band's meaning is entirely in the text over it, so
            the video is aria-hidden rather than described. `alt` on the prop
            documents the footage for whoever maintains this, and is not
            rendered.
          */}
          <video
            className="hhcp-sv-media"
            src={media.src}
            poster={media.poster}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />
          <div
            className={cn(
              "hhcp-sv-scrim",
              media.scrim === "strong" && "hhcp-sv-scrim-strong",
            )}
          />
        </>
      )}
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
        {subheading !== undefined && (
          <p className="hhcp-sv-subtitle font-dm-sans">{subheading}</p>
        )}

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
