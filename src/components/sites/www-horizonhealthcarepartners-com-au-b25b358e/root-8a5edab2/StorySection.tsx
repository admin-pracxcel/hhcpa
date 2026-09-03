/**
 * "Our story" section for https://www.horizonhealthcarepartners.com.au/
 *
 * Structure mirrors the source markup:
 *   section                    — --hhcp-section-space-m block / --hhcp-gutter inline
 *     └─ .hhcp-container       — global 1340px wrapper, inline padding zeroed
 *          └─ .grid            — 1fr 1fr, gap 0, vertically centred
 *               ├─ div > .content  — fixed 410px text column
 *               └─ img            — stretches to the row height, object-fit: cover
 *
 * The 991px breakpoint is the target's own (Bricks default), not Tailwind's, so
 * the responsive rules live in the scoped <style> block. Fully static — the only
 * hover is on the CTA, which is pure CSS, so this stays a server component.
 *
 * The CTA is the source's `bricks-button` verbatim, including
 * `letter-spacing: normal` (the theme's 0.36px rule loses downstream) and the
 * `fa-circle` dot ahead of the label that grows a ring on hover.
 */

import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "../shared/icons";

/* Relative: this site now *is* horizonhealthcarepartners.com.au. */
const CTA_HREF = "/about-us/";

const EYEBROW = "OUR STORY";
const HEADING = "Healthcare That Puts You in Control";

const PARAGRAPH_ONE =
  "Horizon Health Care Partners is a telehealth clinic dedicated to providing accessible, practitioner-led medical consultations across Australia. Our AHPRA-registered practitioners offer professional healthcare consultations through our secure online platform.";
const PARAGRAPH_TWO =
  "We believe healthcare should be compassionate, transparent, and convenient. Our team is committed to providing medical guidance in a safe, stigma-free environment where every patient feels heard and respected.";

const POINTS: readonly string[] = [
  "Flexible appointment schedules",
  "AHPRA-registered practitioners",
  "Australia-wide support",
] as const;

const IMAGE_SRC =
  "/images/our-story.jpg";
const IMAGE_ALT =
  "A person stands on a rocky outcrop overlooking a vast, sunlit landscape of green hills and distant forests under a hazy sky.";

const STYLES = `
.hhcp-so-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

/* The section supplies the gutter, so the shared container must not add its own. */
.hhcp-so-container {
  padding-inline: 0;
}

.hhcp-so-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  align-items: center;
}

.hhcp-so-content {
  width: 410px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hhcp-so-head {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
}

.hhcp-so-eyebrow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.hhcp-so-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-so-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-so-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-so-body {
  font-size: 16px;
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
  max-width: 100%;
}

.hhcp-so-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.hhcp-so-row {
  display: flex;
  flex-direction: row;
  gap: 13.3px;
  align-items: center;
}

.hhcp-so-row-icon {
  flex: none;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-so-row-text {
  font-size: 16px;
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-so-cta {
  width: 100%;
  min-height: 52px;
  padding: 12.132px 19.2px;
  border-radius: 800px;
  background-color: var(--hhcp-action, #58eda2);
  border: 1px solid var(--hhcp-action, #58eda2);
  color: var(--hhcp-primary, #013126);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s linear;
}

.hhcp-so-cta:hover {
  box-shadow: 5px 5px 25px 0 rgba(33, 33, 33, 0.1);
}

/* 10px fa-circle icon, before the label. */
.hhcp-so-cta-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  flex: none;
  transition: all 0.3s linear;
}

.hhcp-so-cta:hover .hhcp-so-cta-dot {
  box-shadow: 0 0 0 3px rgba(1, 49, 38, 0.25);
}

.hhcp-so-image {
  align-self: stretch;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* The source computes a 10px radius on this image, same as the other
     photographic blocks on the page (steps, care areas, approach). */
  border-radius: 10px;
}

@media (max-width: 991px) {
  .hhcp-so-grid {
    grid-template-columns: 1fr;
    gap: var(--hhcp-space-m, 30px);
  }

  .hhcp-so-content {
    width: 100%;
  }
}
`;

interface StorySectionProps {
  className?: string;
  eyebrow?: string;
  heading?: string;
  /** Rendered as one paragraph with a blank line between entries. */
  paragraphs?: readonly string[];
  /** An empty array renders no list. */
  points?: readonly string[];
  /** null renders no button. */
  cta?: { label: string; href: string } | null;
  image?: string;
  imageAlt?: string;
}

export function StorySection({
  className,
  eyebrow = EYEBROW,
  heading = HEADING,
  paragraphs = [PARAGRAPH_ONE, PARAGRAPH_TWO],
  points = POINTS,
  cta = { label: "Learn more about us", href: CTA_HREF },
  image = IMAGE_SRC,
  imageAlt = IMAGE_ALT,
}: StorySectionProps) {
  return (
    <section className={cn("hhcp-so-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-so-container">
        <div className="hhcp-so-grid">
          <div>
            <div className="hhcp-so-content">
              <div className="hhcp-so-head">
                <div className="hhcp-so-eyebrow">
                  <span className="hhcp-so-dot" />
                  <span className="hhcp-so-eyebrow-label font-roboto-mono">
                    {eyebrow}
                  </span>
                </div>
                <h2 className="hhcp-so-title font-dm-sans">{heading}</h2>
              </div>

              <p className="hhcp-so-body font-dm-sans">
                {paragraphs.map((paragraph, index) => (
                  <span key={paragraph}>
                    {index > 0 && (
                      <>
                        <br />
                        <br />
                      </>
                    )}
                    {paragraph}
                  </span>
                ))}
              </p>

              {points.length > 0 && (
              <ul className="hhcp-so-list">
                {points.map((point) => (
                  <li key={point} className="hhcp-so-row">
                    <CheckCircleIcon
                      className="hhcp-so-row-icon"
                      width={24}
                      height={25}
                    />
                    <span className="hhcp-so-row-text font-dm-sans">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              )}

              {cta !== null && (
                <a className="hhcp-so-cta font-roboto-mono" href={cta.href}>
                  <span className="hhcp-so-cta-dot" />
                  {cta.label}
                </a>
              )}
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hhcp-so-image"
            src={image}
            alt={imageAlt}
            width={768}
            height={771}
          />
        </div>
      </div>
    </section>
  );
}
