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
 * shows only the photo at rest. On hover the copy block's grid row grows from
 * 0fr to 1fr — i.e. to its own content height — and the photo, which is the
 * flex child that absorbs the remainder, gives up exactly that much. Nothing is
 * hardcoded, so the copy cannot outgrow the space made for it. No state, no JS,
 * no scroll listeners, so this stays a server component.
 *
 * The image is a plain <img> rather than next/image because it has to fill a
 * wrapper whose height the hover changes, and carry a transform of its own,
 * which next/image's wrapper and sizing machinery would fight.
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
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--hhcp-space-m, 30px);
  /* Same hairline rule the Pricing and Blog headings carry. */
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-st-heading-text {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
}

@media (max-width: 767px) {
  .hhcp-st-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--hhcp-space-s, 20px);
  }
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

/* Same pill CTA the Approach and Story sections carry, dot first. */
.hhcp-st-cta {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12.132px 19.2px;
  border-radius: 800px;
  background-color: var(--hhcp-action, #58eda2);
  border: 1px solid var(--hhcp-action, #58eda2);
  color: var(--hhcp-primary, #013126);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: normal;
  text-decoration: none;
  transition: all 0.3s linear;
}

.hhcp-st-cta:hover {
  box-shadow: 5px 5px 25px 0 rgba(33, 33, 33, 0.1);
}

.hhcp-st-cta-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  flex: none;
  transition: all 0.3s linear;
}

.hhcp-st-cta:hover .hhcp-st-cta-dot {
  box-shadow: 0 0 0 3px rgba(1, 49, 38, 0.25);
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
}

/*
 * Takes whatever height the copy leaves it. The photo used to shrink to a
 * hardcoded 319px on hover, which frees a fixed 95px once the gap is paid for —
 * and the copy does not have a fixed height. "Speak with an AHPRA-registered
 * practitioner" wraps to two lines and needs 112px, so its last line was cut off
 * by the card's own overflow; at 1280px, where every title wraps, three of the
 * four cards lost 41px. Sizing the photo off the copy instead of the other way
 * round cannot clip, whatever the copy grows to.
 */
.hhcp-st-image-block {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  border-radius: 10px;
}

/* The 1.05 overscale is cropped by the wrapper at rest and released on hover. */
.hhcp-st-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
  transform: scaleX(1.05) scaleY(1.05);
  transition: transform 0.3s linear;
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

/*
 * grid-template-rows 0fr -> 1fr is what makes the reveal measure itself: the
 * row resolves to the copy's own height, so the photo above it gives up exactly
 * that much and no fixed number has to be kept in sync with the text.
 */
.hhcp-st-content {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  padding-top: 0;
  transition:
    grid-template-rows 0.3s linear,
    padding-top 0.3s linear,
    opacity 0.3s linear;
}

.hhcp-st-content > * {
  overflow: hidden;
  min-height: 0;
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
  transform: scale(1);
}

.hhcp-st-card:hover .hhcp-st-content {
  grid-template-rows: 1fr;
  padding-top: 30px;
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

  /* Auto-height card: the photo needs a height of its own to size the img. */
  .hhcp-st-image-block {
    flex: none;
    height: 360px;
  }

  .hhcp-st-content {
    grid-template-rows: 1fr;
    padding-top: 30px;
    opacity: 1;
  }
}
`;

/** Copy for the four cards. The photography and numerals stay put. */
export interface StepCopy {
  readonly pill: string;
  readonly title: string;
  readonly description: string;
}

interface StepsSectionProps {
  className?: string;
  eyebrow?: string;
  heading?: string;
  /** Four entries, matched positionally to the four photographs. */
  steps?: readonly StepCopy[];
  cta?: { label: string; href: string };
}

export function StepsSection({
  className,
  eyebrow = EYEBROW,
  heading = HEADING,
  steps,
  cta,
}: StepsSectionProps) {
  const cards = STEPS.map((step, index) => {
    const copy = steps?.[index];
    return copy === undefined ? step : { ...step, ...copy };
  });
  return (
    <section className={cn("hhcp-st-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-st-container">
        <div className="hhcp-st-heading">
          <div className="hhcp-st-heading-text">
            <div className="hhcp-st-eyebrow">
              <span className="hhcp-st-dot" />
              <span className="hhcp-st-eyebrow-label font-roboto-mono">
                {eyebrow}
              </span>
            </div>
            <h2 className="hhcp-st-title font-dm-sans">{heading}</h2>
          </div>

          {cta !== undefined && (
            <a className="hhcp-st-cta font-roboto-mono" href={cta.href}>
              <span className="hhcp-st-cta-dot" />
              {cta.label}
            </a>
          )}
        </div>

        <div className="hhcp-st-grid">
          {cards.map((step) => (
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
