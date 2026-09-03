"use client";

/**
 * Closing call-to-action for https://www.horizonhealthcarepartners.com.au/
 *
 * Sibling of the hero — same video-background treatment, same email pill form.
 * Differences from the hero, all taken from getComputedStyle on the source:
 *   • 854px tall (auto ≤991px), content vertically centred
 *   • the video overlay is a FLAT rgba(0,0,0,.2), not a vertical gradient
 *   • the rgba(0,0,0,.3) scrim applies at every viewport width, not just ≤478px
 *   • no mobile-only replacement button — the form is shown at all sizes
 *
 * Structure:
 *   section                 — poster image behind, overflow hidden, flex-centred
 *     ├─ .bg-wrap           — absolute layer holding the looping video…
 *     │    ├─ video         — object-cover, click toggles play/pause
 *     │    └─ .overlay      — flat 20% black above the video
 *     ├─ .scrim             — full-bleed 30% black wash
 *     └─ .hhcp-container    — heading, copy, form, quiz link
 *
 * Breakpoints 991 / 767 are the target's own, not Tailwind defaults, so the
 * responsive rules are written as arbitrary `max-[…]` variants.
 */

import { useCallback, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

const ASSET_BASE =
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/videos";
const VIDEO_SRC = `${ASSET_BASE}/cta-background.mp4`;
const POSTER_SRC = `${ASSET_BASE}/cta-background-poster.png`;

/* Relative: this site now *is* horizonhealthcarepartners.com.au. */
const QUIZ_HREF = "/quiz/";

const HEADING = "Easy Access, Professional Care";
const BODY =
  "Book online consultations with AHPRA-registered medical practitioners. Our streamlined telehealth process is simple and confidential.";

interface FinalCtaSectionProps {
  className?: string;
  heading?: string;
  body?: string;
  /**
   * Replaces the email-capture form. The rebuilt homepage's closing band is a
   * quiz button and a tap-to-call, per the content spec.
   */
  actions?: ReactNode;
}

export function FinalCtaSection({
  className,
  heading = HEADING,
  body = BODY,
  actions,
}: FinalCtaSectionProps) {
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
        // Sized by its content and its own 90px padding. The 854px fixed
        // height left ~270px of dead band above and below the copy, and the
        // margins stacked on top of the neighbouring sections' padding.
        "relative flex flex-col justify-center overflow-hidden",
        // Video ground: see .hhcp-on-dark in globals.css.
        "hhcp-on-dark",
        "bg-cover bg-no-repeat bg-blend-overlay bg-[position:50%_0%]",
        "px-[var(--hhcp-gutter)] py-[var(--hhcp-section-space-m)]",
        className,
      )}
      style={{ backgroundImage: `url("${POSTER_SRC}")` }}
    >
      {/* Background video + flat 20% overlay */}
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
        <div className="absolute top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.2)]" />
      </div>

      {/* Full-bleed 30% wash, all viewport sizes */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)]" />

      <div className="hhcp-container relative flex flex-col gap-[var(--hhcp-space-l)]">
        <div className="flex flex-col items-center gap-[32px]">
          {/*
            The source computes text-align: start here — only the paragraph below
            carries text--center. The flex parent centres the box, so a heading
            that fits on one line still reads centred and the target never shows
            otherwise. A heading that wraps does: "Questions about whether
            telehealth suits you?" on /patient-safety/ set two ragged-right lines
            in the middle of a centred band.

            Centred, and given the same 880px cap the body copy has in spirit, so
            a long heading breaks into balanced lines instead of running the full
            1340px container. See CUSTOMISATIONS.md deviation 8.
          */}
          <h2 className="font-dm-sans max-w-[880px] text-[length:var(--hhcp-h1)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.6px] text-center text-white">
            {heading}
          </h2>
          <p className="max-w-[536px] text-[16px] leading-[24px] font-normal text-center text-white">
            {body}
          </p>

          {actions}

          {/* Email capture + quiz link — shown at every width */}
          <div
            className={cn(
              "flex flex-col items-center gap-[16px]",
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
        </div>
      </div>
    </section>
  );
}
