/**
 * "Your Questions Answered" FAQ section for
 * https://www.horizonhealthcarepartners.com.au/
 *
 * Structure mirrors the source markup:
 *   section                   — 90px block margin, 90px / --hhcp-gutter padding
 *     └─ .container           — own 1072px width (80% of the 1340px content width),
 *                               centred column, 67.5px row gap
 *          ├─ head            — centred h2, no eyebrow row in this section
 *          ├─ accordion       — 662px max-width, hairline top/bottom rules
 *          └─ cta             — pill link out to the full FAQ index
 *
 * Client component purely for the accordion's open-index state. The source is a
 * Bricks accordion: single-open, click-driven, and — unlike ApproachSection —
 * every row ships CLOSED (aria-expanded="false", panel display: none). Closed
 * panels are `display: none` rather than a height transition, so this mirrors
 * that exactly instead of animating the panel.
 *
 * The toggle icon is a single plus glyph that the source rotates 45deg into a
 * cross when its row opens; it never swaps the artwork.
 */

"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/JsonLd";
import { buildFaqPage } from "@/lib/schema";
import { ArrowRightIcon, FaqTogglePlusIcon } from "../shared/icons";

const HEADING = "Your Questions Answered";

/* Relative: this site now *is* horizonhealthcarepartners.com.au. */
const CTA_HREF = "/faqs/";
const CTA_LABEL = "Explore All FAQs";
const CTA_PROMPT = "Still have questions?";

interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

/*
 * Verbatim source copy. The consultation fees quoted in item 3 ($59/$59/$54)
 * disagree with the pricing cards elsewhere on the page ($69/$59/$59); that
 * inconsistency exists on the live site and is reproduced as-is.
 */
const ITEMS: readonly FaqItem[] = [
  {
    id: "how-it-works",
    question: "How does Horizon Health Care Partners work?",
    answer:
      "You start with a free online pre-screening quiz. The quiz is not a diagnosis. If you look suitable, you book a real-time consultation with one of our practitioners by video or phone. The practitioner reviews your health and talks through your options with you. Any care plan comes from that consultation, not the quiz on its own.",
  },
  {
    id: "prescription",
    question: "Will I be given a prescription?",
    answer:
      "A prescription is not guaranteed. Our practitioners only prescribe where it is clinically appropriate, following a real-time consultation. Depending on your situation, the outcome may be advice, lifestyle guidance, a referral, monitoring, or no treatment. We do not prescribe based on a questionnaire alone.",
  },
  {
    id: "cost",
    question: "How much does it cost?",
    answer:
      "The online pre-screening quiz is free. Your first medical consultation is $59. Follow-up consultations are $59. Transfer consultations are $54. There is no commitment until you are ready to book a consultation.",
  },
  {
    id: "topics",
    question: "What can I speak to a practitioner about?",
    answer:
      "Our practitioners consult on a range of everyday health concerns. These include weight management, mental health support, menopause support, smoking cessation, and ongoing support for chronic conditions. Each consultation is tailored to you. Individual results vary, and assessment findings do not guarantee a particular outcome.",
  },
  {
    id: "telehealth-suitability",
    question: "Is telehealth right for me, and what if it is an emergency?",
    answer:
      "Telehealth suits many common health needs, but not all of them. Your practitioner may recommend an in-person assessment, a GP review, a specialist referral, further tests, or no treatment, depending on your circumstances. If this is a medical emergency, call 000 immediately. If you are in crisis, call Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636.",
  },
] as const;

const STYLES = `
.hhcp-fq-section {
  margin: var(--hhcp-section-space-m) 0;
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

/* Not the shared 1340px .hhcp-container — this section runs its own 1072px width. */
.hhcp-fq-container {
  width: 1072px;
  max-width: 100%;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 67.5px;
  column-gap: var(--hhcp-space-m, 30px);
}

.hhcp-fq-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: var(--hhcp-space-xs, 13.5068px);
}

.hhcp-fq-title {
  text-align: center;
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-fq-accordion {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 662px;
  border-bottom: 1px solid #ececec;
}

.hhcp-fq-question {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--hhcp-space-m, 30px);
  cursor: pointer;
  width: 100%;
  padding: var(--hhcp-space-s, 20px) 0;
  border-top: 1px solid #ececec;
  border-left: none;
  border-right: none;
  border-bottom: none;
  background-color: transparent;
  text-align: left;
}

.hhcp-fq-question-label {
  font-size: var(--hhcp-h4, 20px);
  line-height: 24.16px;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
  text-align: start;
}

.hhcp-fq-icon {
  flex: none;
  transition: all 0.2s ease;
}

/* The source rotates the whole plus glyph into a cross; it does not swap art. */
.hhcp-fq-item.is-open .hhcp-fq-icon {
  transform: rotate(45deg);
}

.hhcp-fq-panel {
  display: none;
  padding: 0 0 var(--hhcp-space-m, 30px);
  font-size: var(--hhcp-text-s, 16px);
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-fq-item.is-open .hhcp-fq-panel {
  display: block;
}

/*
 * The FAQ footer is NOT a pill button — it is a centred prompt plus an icon
 * link: "Still have questions?  Explore All FAQs →".
 * Source: .brxe-block.flex--row.justify-content--center.gap--12 wrapping
 * a.brxe-text-link.text--icon-link, which is
 *   { font-family: DM Sans; color: var(--primary); flex-direction: row-reverse; gap: 4px }
 * The arrow sits FIRST in the DOM and row-reverse moves it after the label.
 */
.hhcp-fq-cta-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
  font-size: 16px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-fq-cta {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--hhcp-primary, #013126);
  text-decoration: none;
  transition: all 0.3s linear;
}

.hhcp-fq-cta-icon {
  display: flex;
  flex: none;
  color: inherit;
  transition: all 0.3s linear;
}
`;

interface FaqSectionProps {
  className?: string;
  /** Defaults to the homepage heading. */
  heading?: string;
  /**
   * Defaults to the homepage's own FAQ set. Service and information pages pass
   * their own; the accompanying FAQPage JSON-LD is generated from whatever is
   * passed here, so the markup and the visible answers cannot drift apart.
   */
  items?: readonly FaqItem[];
}

export function FaqSection({
  className,
  heading = HEADING,
  items = ITEMS,
}: FaqSectionProps) {
  /* Every row ships collapsed on the source page. */
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className={cn("hhcp-fq-section", className)}>
      <style>{STYLES}</style>
      <JsonLd
        data={buildFaqPage(
          items.map((item) => ({ q: item.question, a: item.answer })),
        )}
      />
      <div className="hhcp-fq-container">
        <div className="hhcp-fq-head">
          <h2 className="hhcp-fq-title font-dm-sans">{heading}</h2>
        </div>

        <div className="hhcp-fq-accordion">
          {items.map((item) => {
            const open = item.id === openId;
            const panelId = "hhcp-fq-panel-" + item.id;
            const buttonId = "hhcp-fq-question-" + item.id;

            return (
              <div
                key={item.id}
                className={cn("hhcp-fq-item", open && "is-open")}
              >
                <button
                  type="button"
                  id={buttonId}
                  className="hhcp-fq-question"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  <span className="hhcp-fq-question-label font-dm-sans">
                    {item.question}
                  </span>
                  <FaqTogglePlusIcon className="hhcp-fq-icon" />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="hhcp-fq-panel font-dm-sans"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hhcp-fq-cta-row font-dm-sans">
          <span>{CTA_PROMPT}</span>
          <a className="hhcp-fq-cta" href={CTA_HREF}>
            <span className="hhcp-fq-cta-icon">
              <ArrowRightIcon width={17} height={17} />
            </span>
            <span>{CTA_LABEL}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
