"use client";

/**
 * Hero for https://www.horizonhealthcarepartners.com.au/
 *
 * Structure mirrors the source markup:
 *   section.hero            — exactly one screen tall, poster image behind
 *     ├─ .bg-wrap           — absolute layer holding the looping video…
 *     │    ├─ video         — object-cover, click toggles play/pause
 *     │    └─ .overlay      — transparent → black gradient scrim above the video
 *     ├─ .scrim478          — extra rgba(0,0,0,.3) wash, ≤478px only
 *     └─ .hhcp-container    — content, anchored to the bottom-left of the
 *                             section, one section space clear of the edge
 *
 * Breakpoints 991 / 767 / 478 are the target's own, not Tailwind defaults, so
 * every responsive rule is written as an arbitrary `max-[…]` variant.
 */

import { useCallback, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

const ASSET_BASE =
  "/videos";
/*
 * MP4 for the video, WebP for the poster.
 *
 * The WebM re-encode was visibly distorted on this footage — heavy foliage and
 * blown-out sunlight is about the worst case for it at that bitrate — so the
 * original MP4 is back. It costs 6.4MB against the WebM's 1.7MB, which is most
 * of this page's transfer weight; worth revisiting with a higher-bitrate WebM
 * or an AV1 encode if page speed becomes the priority.
 *
 * The poster stays WebP. That one is a still frame and shows no distortion at
 * 78KB, against 1.1MB for the PNG it replaced, so the saving is free.
 */
const VIDEO_SRC = `${ASSET_BASE}/hero-background.mp4`;
const POSTER_SRC = `${ASSET_BASE}/hero-background-poster.webp`;

/* Relative: this site now *is* horizonhealthcarepartners.com.au. */
const QUIZ_HREF = "/quiz/";

const HEADING = "Professional Healthcare at Your Fingertips";
const BODY =
  "Access registered healthcare professionals from the comfort of your home. Complete our pre-screening and schedule your consultation in minutes.";

interface HeroSectionProps {
  /** Defaults to the cloned homepage's headline. */
  heading?: string;
  body?: string;
  /** Appended to the h1, so a page can set its own size and measure. */
  headingClassName?: string;
  /**
   * Replaces the email-capture form and its mobile CTA. The rebuilt homepage
   * passes two buttons instead: the content spec's hero has no email field.
   */
  actions?: ReactNode;
}

export function HeroSection({
  heading = HEADING,
  body = BODY,
  headingClassName,
  actions,
}: HeroSectionProps = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [email, setEmail] = useState("");

  // Matches the source: clicking the background video toggles playback.
  const toggleVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, []);

  // Demo-only form — the target posts to a mailing provider we do not clone.
  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  return (
    <section
      className={cn(
        // The hero fills exactly one screen at every width — no overflow, no
        // underflow. `dvh` rather than `vh` so a mobile browser collapsing its
        // toolbar does not leave the section taller than the visible area.
        "relative h-[100dvh] overflow-hidden bg-cover bg-no-repeat bg-blend-overlay",
        // Video ground: see .hhcp-on-dark in globals.css.
        "hhcp-on-dark",
        // Floor and safety net, both inert on any viewport with room to spare.
        // The header is `position: absolute` over the hero at 108-122px tall,
        // and the content is bottom-anchored, so on a short screen the copy
        // climbs until it is behind the logo — 24px behind it at 320x568, and
        // clipped outright at 320x480. `pt` stops it there; `min-h-fit` then
        // lets the section grow a little past the fold rather than hiding the
        // top of the headline, which is the better of the two failures.
        "min-h-fit pt-[142px]",
        // ≤767px the fixed CTA bar occupies the bottom of the screen, so the
        // hero gets the screen minus that bar. Same token the bar's own height
        // is set from, so the two cannot drift apart.
        "max-[767px]:h-[calc(100dvh-var(--hhcp-sticky-cta-h))]",
        "bg-[position:50%_0%]",
        // Content sits at the bottom-left, one standard section space clear of
        // the edge — the same `--hhcp-section-space-m` every other section pads
        // with (90px at desktop, scaling down with the viewport), so the gap
        // under the hero matches the gaps between everything below it.
        "flex flex-col justify-end pb-[var(--hhcp-section-space-m)]",
      )}
      style={{ backgroundImage: `url("${POSTER_SRC}")` }}
    >
      {/* Background video + gradient scrim */}
      <div className="absolute top-0 left-0 z-0 h-full w-full">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoPlay
          loop
          muted
          playsInline
          onClick={toggleVideo}
        />
        <div
          className="absolute top-0 left-0 h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0) 0%, #000000 100%)",
          }}
        />
      </div>

      {/* Extra wash, ≤478px only */}
      <div className="absolute inset-0 hidden bg-[rgba(0,0,0,0.3)] max-[478px]:block" />

      <div
        className="hhcp-container relative flex flex-col gap-[var(--hhcp-space-l)]"
      >
        {/* Bottom-left: the block hugs the container's left edge. */}
        <div className="flex flex-col items-start justify-center gap-[24px]">
          <div className="flex flex-col gap-[16px]">
            <h1
              className={cn(
                "font-dm-sans max-w-[536px] text-[length:var(--hhcp-h1)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.6px] text-white",
                headingClassName,
              )}
            >
              {heading}
            </h1>
            <p className="max-w-[536px] text-[length:var(--hhcp-text-s)] leading-[24px] font-normal text-white">
              {body}
            </p>
          </div>

          {actions}

          {/* Email capture + quiz link — desktop/tablet only */}
          <div
            className={cn(
              "flex flex-col items-start gap-[16px]",
              "max-[767px]:hidden",
              /* Last, so tailwind-merge keeps it over the `flex` above. */
              actions !== undefined && "hidden",
            )}
          >
            <div className="max-w-[500px] min-w-[404px] max-[767px]:w-full max-[767px]:max-w-[400px] max-[767px]:min-w-[auto]">
              <form
                onSubmit={handleSubmit}
                className="relative flex items-center justify-between rounded-[40px] border-none bg-[#f5fff9] py-[2px] pr-[2px] pl-[25px] focus-within:[outline:1px_solid_rgba(88,237,162,0.5)]"
              >
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="E-MAIL"
                  aria-label="Email"
                  className="font-roboto-mono flex-1 border-none bg-transparent p-0 text-[12px] font-medium tracking-[0.36px] text-[#013126] outline-none"
                />
                <button
                  type="submit"
                  className={cn(
                    "font-roboto-mono rounded-[33px] border-none bg-[#58eda2] px-[20px] py-[12.3px]",
                    "text-[12px] leading-[1.625] font-medium tracking-[0.36px] whitespace-nowrap uppercase text-[#013126]",
                    "transition-all duration-[400ms]",
                    "hover:bg-[#0c7340] hover:text-[#baf8d9] focus:bg-[#0c7340] focus:text-[#baf8d9]",
                  )}
                >
                  Book Consultation
                </button>
              </form>
            </div>

            <a
              href={QUIZ_HREF}
              className="text-white transition-all duration-300 ease-linear hover:underline"
            >
              Or take your pre-screening quiz here
            </a>
          </div>

          {/* Mobile-only CTA */}
          <div
            className={cn(
              "hidden w-full max-[767px]:block",
              actions !== undefined && "max-[767px]:hidden",
            )}
          >
            <a className="hhcp-btn" href={QUIZ_HREF}>
              Get Started Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
