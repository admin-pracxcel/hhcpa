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
import type { FormEvent } from "react";
import { cn } from "@/lib/utils";

const ASSET_BASE =
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/videos";
const VIDEO_SRC = `${ASSET_BASE}/cta-background.mp4`;
const POSTER_SRC = `${ASSET_BASE}/cta-background-poster.png`;

const QUIZ_HREF = "https://www.horizonhealthcarepartners.com.au/quiz/";

const HEADING = "Easy Access, Professional Care";
const BODY =
  "Book online consultations with AHPRA-registered medical practitioners. Our streamlined telehealth process is simple and confidential.";

export function FinalCtaSection({ className }: { className?: string }) {
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
        "relative flex h-[854px] flex-col justify-center overflow-hidden",
        "bg-cover bg-no-repeat bg-blend-overlay bg-[position:50%_0%]",
        "px-[var(--hhcp-gutter)] py-[var(--hhcp-section-space-m)]",
        "mt-[var(--hhcp-section-space-m)] mb-[var(--hhcp-space-m)]",
        "max-[991px]:h-auto",
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
          {/* Source computes text-align: start on this h2 (the paragraph below it is
              the one carrying text--center). The flex parent centres the box, so a
              single line still reads centred. */}
          <h2 className="font-dm-sans text-[length:var(--hhcp-h1)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.6px] text-start text-white">
            {HEADING}
          </h2>
          <p className="max-w-[536px] text-[16px] leading-[24px] font-normal text-center text-white">
            {BODY}
          </p>

          {/* Email capture + quiz link — shown at every width */}
          <div className="flex flex-col items-center gap-[16px]">
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
