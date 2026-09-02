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
import type { FormEvent } from "react";
import { cn } from "@/lib/utils";

const ASSET_BASE =
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/videos";
const VIDEO_SRC = `${ASSET_BASE}/hero-background.mp4`;
const POSTER_SRC = `${ASSET_BASE}/hero-background-poster.png`;

const QUIZ_HREF = "https://www.horizonhealthcarepartners.com.au/quiz/";

const HEADING = "Professional Healthcare at Your Fingertips";
const BODY =
  "Access registered healthcare professionals from the comfort of your home. Complete our pre-screening and schedule your consultation in minutes.";

export function HeroSection() {
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
              className="font-dm-sans max-w-[536px] text-[length:var(--hhcp-h1)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.6px] text-white"
            >
              {HEADING}
            </h1>
            <p className="max-w-[536px] text-[length:var(--hhcp-text-s)] leading-[24px] font-normal text-white">
              {BODY}
            </p>
          </div>

          {/* Email capture + quiz link — desktop/tablet only */}
          <div
            className={cn(
              "flex flex-col items-start gap-[16px]",
              "max-[767px]:hidden",
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
          <div className="hidden w-full max-[767px]:block">
            <a className="hhcp-btn" href={QUIZ_HREF}>
              Get Started Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
