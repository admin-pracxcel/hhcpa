/**
 * "Get started" four-step section for https://www.horizonhealthcarepartners.com.au/
 *
 * Structure mirrors the source markup:
 *   section                      — --hhcp-section-space-m block / --hhcp-gutter inline
 *     └─ .hhcp-container         — global 1340px wrapper, inline padding zeroed
 *          ├─ .heading           — eyebrow + h2 (no hairline in this section)
 *          └─ .grid              — 4 → 2 → 1 columns at 1199px / 767px
 *               └─ article × 4   — photo window, floating pill, revealed copy
 *
 * Interaction is a pure-CSS hover reveal: the card is a fixed 444px window that
 * shows only the photo at rest. On hover the image (and its wrapper's min-height)
 * shrinks to 319px, freeing exactly the 125px the copy block needs, and the copy
 * fades in from visibility:hidden/opacity:0. No state, no JS, no scroll listeners,
 * so this stays a server component.
 *
 * The image is a plain <img> rather than next/image because the effect animates
 * `height` and `transform` on the element itself, which next/image's wrapper and
 * sizing machinery would fight.
 *
 * Breakpoints 1199 / 767 / 478 are the target's own (Bricks defaults), not
 * Tailwind's, so the responsive rules live in the scoped <style> block. Below
 * 478px the reveal is disabled outright: the card grows to auto height and the
 * copy is permanently visible, since hover is meaningless on a phone.
 */

import { cn } from "@/lib/utils";
import { StepNumberIcon } from "../shared/icons";

const IMAGE_BASE =
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/images";

interface Step {
  /** 1-4; also selects the numeral drawn inside StepNumberIcon. */
  number: 1 | 2 | 3 | 4;
  /** White chip floating over the photo. */
  pill: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

const STEPS: readonly Step[] = [
  {
    number: 1,
    pill: "Pre-Screening Quiz",
    title: "Take Our Pre-Screening Quiz",
    description:
      "Complete a simple questionnaire to determine if we can support you.",
    image: `${IMAGE_BASE}/steps-01-prescreening.jpg`,
    alt: "A woman with short light brown hair in a denim shirt is lying on a couch, smiling while looking at her smartphone.",
  },
  {
    number: 2,
    pill: "Book a Consultation",
    title: "Schedule at Your Convenience",
    description:
      "Choose a time that suits you and book your telehealth appointment online.",
    image: `${IMAGE_BASE}/steps-02-book-consultation.webp`,
    alt: "A male doctor in a white coat with a stethoscope talks on the phone.",
  },
  {
    number: 3,
    pill: "Attend Your Appointment",
    title: "Speak with an AHPRA-registered practitioner",
    description:
      "Join your video consultation with one of our AHPRA-registered practitioners.",
    image: `${IMAGE_BASE}/steps-03-attend-appointment.jpg`,
    alt: "A person sits at a desk having a video call with another person.",
  },
  {
    number: 4,
    pill: "Ongoing Support",
    title: "Receive Care & Follow-Up",
    description:
      "We provide ongoing support, follow-up consultations, and are here to guide you.",
    image: `${IMAGE_BASE}/steps-04-ongoing-support.jpg`,
    alt: "Older man with gray hair and beard smiling, holding his chest.",
  },
] as const;

const EYEBROW = "Get Started";
const HEADING = "Access Healthcare Support In Four Simple Steps";

const STYLES = `
.hhcp-st-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

/* The section supplies the gutter, so the shared container must not add its own. */
.hhcp-st-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-st-heading {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  /* Same hairline rule the Pricing and Blog headings carry. */
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-st-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hhcp-st-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-st-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-st-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-st-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--hhcp-space-xs, 13.5068px);
}

/* Fixed-height window: the copy below the photo is clipped until hover. */
.hhcp-st-card {
  position: relative;
  height: 444px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.hhcp-st-image-block {
  overflow: hidden;
  min-height: 444px;
  border-radius: 10px;
  transition: all 0.3s linear;
}

/* The 1.05 overscale is cropped by the wrapper at rest and released on hover. */
.hhcp-st-image {
  height: 444px;
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
  transform: scaleX(1.05) scaleY(1.05);
  transition: all 0.3s linear;
}

.hhcp-st-pill {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  padding: 3px 12px;
  border-radius: var(--hhcp-radius-xl, 22.5px);
  font-size: 16px;
  font-weight: 400;
  background-color: #ffffff;
  color: var(--hhcp-primary, #013126);
}

.hhcp-st-content {
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s linear;
}

.hhcp-st-icon-box {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.hhcp-st-step-icon {
  min-width: 30px;
  height: 30px;
}

.hhcp-st-step-title {
  font-size: var(--hhcp-h4, 20px);
  line-height: 24.16px;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
  margin-bottom: 16px;
}

.hhcp-st-step-text {
  font-size: 16px;
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-st-card:hover .hhcp-st-image {
  height: 319px;
  transform: scale(1);
}

.hhcp-st-card:hover .hhcp-st-image-block {
  min-height: 319px;
}

.hhcp-st-card:hover .hhcp-st-content {
  visibility: visible;
  opacity: 1;
}

@media (max-width: 1199px) {
  .hhcp-st-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .hhcp-st-grid {
    grid-template-columns: 1fr;
    gap: var(--hhcp-space-l, 45px);
  }
}

/* Phones: hover cannot happen, so the card grows and the copy is always shown. */
@media (max-width: 478px) {
  .hhcp-st-card {
    height: auto;
    overflow: visible;
  }

  .hhcp-st-image-block {
    min-height: 360px;
  }

  .hhcp-st-image {
    height: 360px;
  }

  .hhcp-st-content {
    visibility: visible;
    opacity: 1;
  }
}
`;

interface StepsSectionProps {
  className?: string;
}

export function StepsSection({ className }: StepsSectionProps) {
  return (
    <section className={cn("hhcp-st-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-st-container">
        <div className="hhcp-st-heading">
          <div className="hhcp-st-eyebrow">
            <span className="hhcp-st-dot" />
            <span className="hhcp-st-eyebrow-label font-roboto-mono">
              {EYEBROW}
            </span>
          </div>
          <h2 className="hhcp-st-title font-dm-sans">{HEADING}</h2>
        </div>

        <div className="hhcp-st-grid">
          {STEPS.map((step) => (
            <article key={step.number} className="hhcp-st-card">
              <div className="hhcp-st-image-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="hhcp-st-image"
                  src={step.image}
                  alt={step.alt}
                  width={318}
                  height={444}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <h3 className="hhcp-st-pill font-dm-sans">{step.pill}</h3>

              <div className="hhcp-st-content">
                <div className="hhcp-st-icon-box">
                  <StepNumberIcon
                    className="hhcp-st-step-icon"
                    step={step.number}
                  />
                  <div>
                    <h4 className="hhcp-st-step-title font-dm-sans">
                      {step.title}
                    </h4>
                    <p className="hhcp-st-step-text font-dm-sans">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
