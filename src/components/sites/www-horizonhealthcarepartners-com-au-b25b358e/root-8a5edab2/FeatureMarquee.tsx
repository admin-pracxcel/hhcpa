/**
 * Feature marquee for https://www.horizonhealthcarepartners.com.au/
 *
 * The source drives this strip with Splide + the auto-scroll extension
 * (`type: "loop"`, `autoWidth: true`, `autoScroll.speed: 0.5`). 0.5px per frame
 * is ~30px/second, right → left, wrapping seamlessly.
 *
 * Reproduced here with a pure CSS marquee — no Splide, no JS, no client
 * boundary. The five items are rendered twice inside one `width: max-content`
 * flex track; translating that track by exactly one copy's worth makes the wrap
 * seamless. The second copy is `aria-hidden` so it isn't announced twice.
 *
 * The track carries the class `hhcp-marquee-track`, which globals.css targets
 * under `prefers-reduced-motion: reduce` to halt the animation.
 *
 * Structure mirrors the source markup:
 *   section                    — 30px block padding
 *     └─ .hhcp-container       — global 1340px wrapper
 *          └─ .viewport        — overflow hidden + 150px white edge fades
 *               └─ .track      — flex, gap `--hhcp-space-xl` (28px ≤766px)
 *                    └─ .item  — dot + label, 36px apart
 */

import { cn } from "@/lib/utils";

const ITEMS = [
  "Streamlined Digital Experience",
  "Clear, Upfront Costs",
  "Care Centred on You",
  "AHPRA-Registered Practitioners",
  "Clinical Care, Human Touch",
] as const;

/**
 * ~1900px per copy at desktop widths; 1900 / 30px-per-second ≈ 63s.
 * Hard-coded to match the source's constant-velocity auto-scroll.
 */
const SCROLL_DURATION = "63s";

const STYLES = `
.hhcp-fm-section {
  padding: 30px 0;
}

.hhcp-fm-viewport {
  position: relative;
  overflow: hidden;
}

.hhcp-fm-viewport::before {
  content: "";
  width: 150px;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  background-image: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
}

.hhcp-fm-viewport::after {
  content: "";
  width: 150px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  pointer-events: none;
  background-image: linear-gradient(-90deg, #ffffff, rgba(255, 255, 255, 0));
}

.hhcp-fm-track {
  --hhcp-fm-gap: var(--hhcp-space-xl);
  display: flex;
  align-items: center;
  width: max-content;
  gap: var(--hhcp-fm-gap);
  will-change: transform;
  animation: hhcp-fm-scroll ${SCROLL_DURATION} linear infinite;
}

/*
 * One copy spans half the track *plus* half a gap: the track's total width is
 * 10 items + 9 gaps, but a seamless wrap needs 5 items + 5 gaps.
 */
@keyframes hhcp-fm-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-50% - var(--hhcp-fm-gap) / 2)); }
}

.hhcp-fm-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 36px;
  flex: none;
}

.hhcp-fm-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-fm-label {
  font-size: var(--hhcp-h5, 14px);
  font-weight: 500;
  font-style: italic;
  color: rgba(1, 49, 38, 0.76);
  white-space: nowrap;
}

@media (max-width: 766px) {
  .hhcp-fm-track {
    --hhcp-fm-gap: 28px;
  }
}
`;

interface FeatureMarqueeProps {
  className?: string;
}

export function FeatureMarquee({ className }: FeatureMarqueeProps) {
  // `duplicate` marks the second, purely visual copy that makes the wrap seamless.
  const renderCopy = (duplicate: boolean) =>
    ITEMS.map((label) => (
      <div
        className="hhcp-fm-item"
        key={`${duplicate ? "b" : "a"}-${label}`}
        aria-hidden={duplicate || undefined}
      >
        <span className="hhcp-fm-dot" />
        <span className="hhcp-fm-label font-dm-sans">{label}</span>
      </div>
    ));

  return (
    <section className={cn("hhcp-fm-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container">
        <div className="hhcp-fm-viewport">
          <div className="hhcp-fm-track hhcp-marquee-track">
            {renderCopy(false)}
            {renderCopy(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
