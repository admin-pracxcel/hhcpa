/**
 * "Our Approach to Care" section for https://www.horizonhealthcarepartners.com.au/
 *
 * Structure mirrors the source markup:
 *   section                     — --hhcp-dark fill, 32px block / --hhcp-gutter inline,
 *                                 --hhcp-section-space-m outer margin
 *     └─ .hhcp-container        — global 1340px wrapper, inline padding zeroed
 *          └─ .grid             — 1fr 1fr, gap 0, both cells stretched
 *               ├─ div > .content — 522px text column with a 30px right pad
 *               └─ img            — stretches to the row height, object-fit: cover
 *
 * Client component purely for the accordion's open-index state. The source is a
 * Bricks accordion: single-open, click-driven, item 0 expanded on load, and the
 * closed panels are `display: none` (not a height transition), so this mirrors
 * that exactly rather than animating.
 *
 * The 991px breakpoint is the target's own (Bricks default), not Tailwind's, so
 * the responsive rules live in the scoped <style> block.
 */

"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { ArrowRightLongIcon } from "../shared/icons";

const CTA_HREF = "https://www.horizonhealthcarepartners.com.au/quiz/";
const CTA_LABEL = "Start pre-screening quiz";

const EYEBROW = "Our Approach to Care";
const HEADING = "How We Support You";

const PARAGRAPH =
  "Access practitioner-led consultations from anywhere in Australia. Our AHPRA-registered practitioners provide confidential telehealth appointments, guiding you through every step with professional support and transparent processes.";

interface AccordionItem {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

const ITEMS: readonly AccordionItem[] = [
  {
    id: "medical-guidance",
    title: "Medical Guidance",
    body: "Navigate your healthcare journey with confidence. Our AHPRA-registered medical practitioners provide ongoing support throughout your consultations, helping you understand your options and ensuring you receive the professional guidance you need at every stage of your care.",
  },
  {
    id: "judgement-free-care",
    title: "Judgement-Free Care",
    body: "Your health concerns deserve a supportive, confidential environment. We create a safe space where you can openly discuss your healthcare needs with qualified medical professionals who listen without judgement and respect your individual circumstances throughout the process.",
  },
  {
    id: "clinical-standards",
    title: "Clinical Standards",
    body: "All consultations are conducted by AHPRA-registered medical practitioners who maintain rigorous clinical standards. Our practitioners bring extensive medical experience and stay current with healthcare guidelines to provide informed, professional consultations.",
  },
  {
    id: "informed-approach",
    title: "Informed Approach",
    body: "Our consultation process follows established medical protocols and professional healthcare standards. Our AHPRA-registered practitioners will review your medical history and discuss your health concerns to determine the most appropriate pathway for your individual circumstances.",
  },
] as const;

const IMAGE_SRC =
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/images/approach-to-care.jpg";
const IMAGE_ALT =
  "Two older adults with gray hair, wearing sweaters and jeans, embrace and smile at each other outdoors in a green, natural setting.";

const STYLES = `
.hhcp-ap-section {
  background-color: var(--hhcp-dark, #01221b);
  padding: 32px var(--hhcp-gutter);
  margin: var(--hhcp-section-space-m) 0;
}

/* The section supplies the gutter, so the shared container must not add its own. */
.hhcp-ap-container {
  padding-inline: 0;
}

.hhcp-ap-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.hhcp-ap-col {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hhcp-ap-media {
  align-self: stretch;
}

.hhcp-ap-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: 522px;
  padding-right: 30px;
}

.hhcp-ap-head {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
}

.hhcp-ap-eyebrow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.hhcp-ap-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-ap-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-white, #ffffff);
}

.hhcp-ap-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-white, #ffffff);
}

.hhcp-ap-body {
  max-width: 390px;
  font-size: 16px;
  line-height: 24px;
  color: var(--hhcp-white, #ffffff);
}

.hhcp-ap-accordion {
  width: 100%;
  max-width: 480px;
}

.hhcp-ap-item {
  border-bottom: 1.5px solid var(--hhcp-white, #ffffff);
}

.hhcp-ap-item.is-open {
  border-bottom-color: var(--hhcp-action, #58eda2);
}

.hhcp-ap-item-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 0;
  cursor: pointer;
  width: 100%;
  min-height: 76.8px;
  font-size: var(--hhcp-h4, 20px);
  font-weight: 400;
  color: var(--hhcp-white, #ffffff);
  text-align: left;
  background: none;
  border: none;
  transition: color 0.3s linear;
}

.hhcp-ap-item.is-open .hhcp-ap-item-title {
  color: var(--hhcp-action, #58eda2);
}

.hhcp-ap-item-icon {
  flex: none;
}

/* Title label group: an 8px mint dot that is absolutely positioned (so it takes
   no space) and hidden until the row opens, then becomes relative and visible —
   this is the source's .icon--active / .brx-open .icon--active pair. */
.hhcp-ap-item-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.hhcp-ap-item-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
  position: absolute;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s linear;
}

.hhcp-ap-item.is-open .hhcp-ap-item-bullet {
  position: relative;
  visibility: visible;
  opacity: 1;
}

.hhcp-ap-panel {
  display: none;
  padding: 0 0 20px 20px;
  font-size: 16px;
  line-height: 24px;
  color: var(--hhcp-white, #ffffff);
}

.hhcp-ap-item.is-open .hhcp-ap-panel {
  display: block;
}

.hhcp-ap-cta {
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  align-self: flex-start;
  transition: all 0.3s linear;
}

.hhcp-ap-cta:hover {
  box-shadow: 5px 5px 25px 0 rgba(33, 33, 33, 0.1);
}

/* Source renders a 10px fa-circle icon after the label. */
.hhcp-ap-cta-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  flex: none;
  transition: all 0.3s linear;
}

.hhcp-ap-cta:hover .hhcp-ap-cta-dot {
  box-shadow: 0 0 0 3px rgba(1, 49, 38, 0.25);
}

.hhcp-ap-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 10px;
}

@media (max-width: 991px) {
  .hhcp-ap-section {
    padding-block: var(--hhcp-section-space-m);
  }

  .hhcp-ap-grid {
    grid-template-columns: 1fr;
    gap: var(--hhcp-space-m, 30px);
  }

  .hhcp-ap-content,
  .hhcp-ap-body,
  .hhcp-ap-accordion {
    max-width: 100%;
  }
}
`;

interface ApproachSectionProps {
  className?: string;
}

export function ApproachSection({ className }: ApproachSectionProps) {
  /* The source ships item 0 expanded (.brx-open / aria-expanded="true"). */
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className={cn("hhcp-ap-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-ap-container">
        <div className="hhcp-ap-grid">
          <div className="hhcp-ap-col">
            <div className="hhcp-ap-content">
              <div className="hhcp-ap-head">
                <div className="hhcp-ap-eyebrow">
                  <span className="hhcp-ap-dot" />
                  <span className="hhcp-ap-eyebrow-label font-roboto-mono">
                    {EYEBROW}
                  </span>
                </div>
                <h2 className="hhcp-ap-title font-dm-sans">{HEADING}</h2>
              </div>

              <p className="hhcp-ap-body font-dm-sans">{PARAGRAPH}</p>

              <div className="hhcp-ap-accordion">
                {ITEMS.map((item, index) => {
                  const open = index === openIndex;
                  const panelId = "hhcp-ap-panel-" + item.id;
                  const titleId = "hhcp-ap-title-" + item.id;

                  return (
                    <div
                      key={item.id}
                      className={cn("hhcp-ap-item", open && "is-open")}
                    >
                      <button
                        type="button"
                        id={titleId}
                        className="hhcp-ap-item-title font-dm-sans"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(index)}
                      >
                        <span className="hhcp-ap-item-label">
                          <span className="hhcp-ap-item-bullet" aria-hidden="true" />
                          {item.title}
                        </span>
                        <ArrowRightLongIcon
                          className="hhcp-ap-item-icon"
                          width={14}
                          height={15}
                        />
                      </button>
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={titleId}
                        className="hhcp-ap-panel font-dm-sans"
                      >
                        {item.body}
                      </div>
                    </div>
                  );
                })}
              </div>

              <a className="hhcp-ap-cta font-roboto-mono" href={CTA_HREF}>
                {CTA_LABEL}
                <span className="hhcp-ap-cta-dot" />
              </a>
            </div>
          </div>

          <div className="hhcp-ap-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hhcp-ap-image"
              src={IMAGE_SRC}
              alt={IMAGE_ALT}
              width={746}
              height={1024}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
