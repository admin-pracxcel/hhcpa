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
 * The five slides are rendered twice inside one `width: max-content` flex track,
 * and the track is translated by one copy's worth before wrapping. Unlike
 * FeatureMarquee there is no track `gap` here (Splide's gap is 0px — the slides
 * carry their own 8px inline padding instead), so one copy is exactly half the
 * track's scroll width.
 *
 * The transport is a requestAnimationFrame loop rather than a CSS keyframe
 * animation, because the track is draggable: a drag has to be able to take over
 * mid-flight and hand back a new offset for the loop to continue from, which a
 * keyframe animation cannot do. It is a rAF loop, not a scroll listener — see
 * AGENTS.md. `prefers-reduced-motion` stops the auto-advance; dragging still
 * works, since that is the user moving it themselves.
 *
 * Structure mirrors the source markup:
 *   section                       — --hhcp-section-space-m block / --hhcp-gutter inline
 *     └─ .hhcp-container          — global 1340px wrapper, gutter zeroed
 *          ├─ .heading            — eyebrow + h2, centred box / left-aligned text
 *          └─ .slider             — viewport + transport row, 32px apart
 *               ├─ .viewport      — full-bleed, overflow hidden, drag surface
 *               │    └─ .track    — flex, `width: max-content`, rAF-translated
 *               │         └─ .slide × 10 (5 real + 5 aria-hidden duplicates)
 *               └─ .controls      — right-aligned play/pause button, still
 *                                   inside the 1340px container
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { cn } from "@/lib/utils";
import { PauseCircleIcon, PlayCircleIcon } from "../shared/icons";

const IMAGE_BASE =
  "/images/";

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

/** The source's auto-scroll runs at 1.5px per frame — 90px/second at 60fps. */
const SCROLL_SPEED = 90;

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

/*
 * Full-bleed. The heading and the play/pause control stay inside the 1340px
 * container; only the rail escapes it. calc(50% - 50vw) works because the
 * container is centred in the viewport, so half the container plus that margin
 * lands exactly on the viewport edge. The section's own overflow:hidden absorbs
 * the scrollbar's width, so this cannot create a horizontal scrollbar.
 */
.hhcp-ca-viewport {
  overflow: hidden;
  width: 100vw;
  margin-inline: calc(50% - 50vw);
  /* Drag surface: horizontal gestures move the rail, vertical ones still scroll
     the page. */
  touch-action: pan-y;
  cursor: grab;
}

.hhcp-ca-viewport[data-dragging="true"] {
  cursor: grabbing;
}

.hhcp-ca-track {
  display: flex;
  width: max-content;
  will-change: transform;
  /* A drag over images otherwise starts a native image drag or selects text. */
  user-select: none;
  -webkit-user-drag: none;
}

.hhcp-ca-track img {
  pointer-events: none;
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
  const [isDragging, setIsDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  /* Distance the track has travelled left, in px, always inside [0, oneCopy). */
  const offsetRef = useRef(0);
  /* Read inside the rAF loop, which must not be torn down and rebuilt on every
     play/pause toggle — that would reset its timestamp and drop a frame. */
  const playingRef = useRef(true);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);

  /* Mirrored into a ref rather than read directly, so the rAF effect below does
     not have to be torn down and rebuilt on every toggle. */
  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  const applyOffset = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    /* Two identical copies, no track gap: one copy is exactly half of it. */
    const oneCopy = track.scrollWidth / 2;
    if (oneCopy > 0) {
      offsetRef.current = ((offsetRef.current % oneCopy) + oneCopy) % oneCopy;
    }
    track.style.transform = "translate3d(" + -offsetRef.current + "px, 0, 0)";
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = performance.now();

    const step = (now: number) => {
      /* Clamped: a backgrounded tab hands back a delta of many seconds, which
         would teleport the rail on return. */
      const elapsed = Math.min(now - previous, 100) / 1000;
      previous = now;
      if (playingRef.current && !draggingRef.current && !reduced.matches) {
        offsetRef.current += SCROLL_SPEED * elapsed;
      }
      applyOffset();
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [applyOffset]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      setIsDragging(true);
      dragStartXRef.current = event.clientX;
      dragStartOffsetRef.current = offsetRef.current;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      offsetRef.current =
        dragStartOffsetRef.current - (event.clientX - dragStartXRef.current);
      applyOffset();
    },
    [applyOffset],
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

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
          <div
            className="hhcp-ca-viewport"
            data-dragging={isDragging}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="hhcp-ca-track" ref={trackRef}>
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
