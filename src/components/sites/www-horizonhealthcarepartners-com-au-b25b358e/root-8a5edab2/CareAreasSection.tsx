"use client";

/**
 * "How We Support You" care-areas carousel for
 * https://www.horizonhealthcarepartners.com.au/
 *
 * The source drives this with Splide + the auto-scroll extension:
 *   type: "loop", gap: "0px", perPage: 2, arrows: false, pagination: false,
 *   autoScroll: { speed: 1.5, pauseOnHover: false, pauseOnFocus: false },
 *   breakpoints: { 478: { perPage: 1 } }
 *
 * Because auto-scroll is active this is NOT slide-by-slide stepping — the track
 * glides continuously at 1.5px/frame (~90px/second), right → left, forever.
 * Both pauseOnHover and pauseOnFocus are false, so hovering must NOT pause it;
 * the explicit play/pause button is the only thing that does.
 *
 * Reproduced with the same duplicated-track CSS marquee as FeatureMarquee: the
 * five slides are rendered twice inside one `width: max-content` flex track and
 * the track is translated by exactly one copy's worth. Unlike FeatureMarquee
 * there is no track `gap` here (Splide's gap is 0px — the slides carry their own
 * 8px inline padding instead), so a plain `translateX(-50%)` is exactly one copy
 * with no half-gap correction needed.
 *
 * Structure mirrors the source markup:
 *   section                       — --hhcp-section-space-m block / --hhcp-gutter inline
 *     └─ .hhcp-container          — global 1340px wrapper, gutter zeroed
 *          ├─ .heading            — eyebrow + h2, centred box / left-aligned text
 *          └─ .slider             — viewport + transport row, 32px apart
 *               ├─ .viewport      — overflow hidden
 *               │    └─ .track    — flex, `width: max-content`, animated
 *               │         └─ .slide × 10 (5 real + 5 aria-hidden duplicates)
 *               └─ .controls      — right-aligned play/pause button
 */

import { useState } from "react";

import { cn } from "@/lib/utils";
import { PauseCircleIcon, PlayCircleIcon } from "../shared/icons";

const IMAGE_BASE =
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/images/";

interface CareArea {
  readonly heading: string;
  readonly image: string;
  readonly alt: string;
}

const CARE_AREAS: readonly CareArea[] = [
  {
    heading: "Pain Management Support",
    image: "care-pain-management.jpg",
    alt: "Two people sit facing each other indoors, holding hands and smiling, engaged in a warm and friendly conversation.",
  },
  {
    heading: "Physical Wellbeing",
    image: "care-physical-wellbeing.jpg",
    alt: "A smiling person with a bald head, wearing a striped shirt, sits indoors.",
  },
  {
    heading: "Mental Wellbeing",
    image: "care-mental-wellbeing.jpg",
    alt: "A man and a woman sit indoors, looking at a laptop together.",
  },
  {
    heading: "Complex Health Concerns",
    image: "care-complex-health.jpg",
    alt: "A woman in athletic wear performs a side lunge stretch on a path outdoors.",
  },
  {
    heading: "General Health",
    image: "care-general-health.jpg",
    alt: "A woman and man are sitting close together on a bed or couch.",
  },
] as const;

const EYEBROW = "How We Support You";
const HEADING = "Professional Medical Consultations";

/**
 * One copy is 5 slides x 670px = 3350px; 3350 / 90px-per-second ≈ 37s.
 * Hard-coded to match the source's constant-velocity auto-scroll.
 */
const SCROLL_DURATION = "37s";

const STYLES = `
.hhcp-ca-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
  overflow: hidden;
}

/* The section supplies the gutter, so the shared container must not add its own. */
.hhcp-ca-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-xl, 67.5px);
}

.hhcp-ca-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--hhcp-content-gap, 30px);
  padding-inline: var(--hhcp-space-xl, 67.5px);
}

.hhcp-ca-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hhcp-ca-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-ca-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

/* The flex parent centres the heading box, but the text itself stays left-aligned. */
.hhcp-ca-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
  text-align: start;
}

.hhcp-ca-slider {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hhcp-ca-viewport {
  overflow: hidden;
}

.hhcp-ca-track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: hhcp-ca-scroll ${SCROLL_DURATION} linear infinite;
}

.hhcp-ca-track--paused {
  animation-play-state: paused;
}

/*
 * The track has no gap, so exactly half of it is one full copy of the slides.
 */
@keyframes hhcp-ca-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.hhcp-ca-slide {
  position: relative;
  flex: none;
  width: 670px;
  padding: 0 8px;
}

.hhcp-ca-image {
  display: block;
  width: 100%;
  max-width: 700px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 10px;
}

.hhcp-ca-slide-title {
  position: absolute;
  bottom: 40px;
  left: 56px;
  max-width: 238px;
  font-size: 24px;
  line-height: 28.192px;
  font-weight: 400;
  color: #ffffff;
}

.hhcp-ca-controls {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.hhcp-ca-toggle {
  background-color: transparent;
  padding: 0;
  border: none;
  cursor: pointer;
  font-size: 30px;
  line-height: 0;
  color: var(--hhcp-primary, #013126);
}

@media (max-width: 991px) {
  .hhcp-ca-heading {
    padding-inline: var(--hhcp-space-m, 30px);
  }
}

@media (max-width: 478px) {
  .hhcp-ca-slide {
    width: calc(100vw - 2 * var(--hhcp-gutter));
  }

  .hhcp-ca-slide-title {
    bottom: 20px;
    left: 30px;
    max-width: 180px;
    font-size: 20px;
  }
}
`;

interface CareAreasSectionProps {
  className?: string;
}

export function CareAreasSection({ className }: CareAreasSectionProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  // `duplicate` marks the second, purely visual copy that makes the wrap seamless.
  const renderCopy = (duplicate: boolean) =>
    CARE_AREAS.map((area) => (
      <div
        className="hhcp-ca-slide"
        key={`${duplicate ? "b" : "a"}-${area.heading}`}
        aria-hidden={duplicate || undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hhcp-ca-image"
          src={`${IMAGE_BASE}${area.image}`}
          alt={duplicate ? "" : area.alt}
          loading="lazy"
          decoding="async"
        />
        <h3 className="hhcp-ca-slide-title font-dm-sans">{area.heading}</h3>
      </div>
    ));

  return (
    <section className={cn("hhcp-ca-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-ca-container">
        <div className="hhcp-ca-heading">
          <div className="hhcp-ca-eyebrow">
            <span className="hhcp-ca-dot" />
            <span className="hhcp-ca-eyebrow-label font-roboto-mono">
              {EYEBROW}
            </span>
          </div>
          <h2 className="hhcp-ca-title font-dm-sans">{HEADING}</h2>
        </div>

        <div className="hhcp-ca-slider">
          <div className="hhcp-ca-viewport">
            <div
              className={cn(
                "hhcp-ca-track hhcp-marquee-track",
                !isPlaying && "hhcp-ca-track--paused",
              )}
            >
              {renderCopy(false)}
              {renderCopy(true)}
            </div>
          </div>

          <div className="hhcp-ca-controls">
            <button
              type="button"
              className="hhcp-ca-toggle"
              onClick={() => setIsPlaying((playing) => !playing)}
              aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
              aria-pressed={!isPlaying}
            >
              {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
