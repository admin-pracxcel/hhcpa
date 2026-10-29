"use client";

/**
 * The accordion rows, shared by `FaqSection` and article FAQs.
 *
 * Extracted from FaqSection on 2026-10-29, when articles grew an FAQ of their
 * own. The rows, their chrome, the rotating plus and the open/close behaviour
 * are the same thing in both places; what differs is everything around them —
 * FaqSection is a full-width page section with a centred 42px heading, a CTA
 * row and its own FAQPage markup, and an article FAQ is a block in a prose
 * column under an ordinary h2.
 *
 * So the rows moved here and the chrome stayed where it was. Styles came with
 * the markup, class names unchanged, because FaqSection is one of the eleven
 * sections measured against the live original and renaming its classes would
 * have put that measurement at risk for no gain.
 *
 * ─── BEHAVIOUR, WHICH IS THE TARGET'S AND NOT A PREFERENCE ─────────────────
 *
 * One row open at a time, and every row ships closed. The source page does
 * both. `ApproachSection` opens its first item on load and this does not —
 * that difference is deliberate and documented in CUSTOMISATIONS.md.
 *
 * `<button>` and an `aria-expanded`/`aria-controls` pair rather than
 * `<details>`: the panel must stay in the accessibility tree while collapsed
 * so the questions are reachable by screen reader, and the rotating plus is
 * driven from `is-open` rather than a marker.
 */

import { useState } from "react";

import { cn } from "@/lib/utils";
import { FaqTogglePlusIcon } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

export interface FaqAccordionItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}


interface FaqAccordionProps {
  items: readonly FaqAccordionItem[];
  className?: string;
  /**
   * Distinguishes the ids when more than one accordion renders on a page.
   * `/faqs/` renders four, and without this their buttons and panels would
   * collide on `aria-controls`.
   */
  idPrefix?: string;
}

export function FaqAccordion({
  items,
  className,
  idPrefix = "hhcp-fq",
}: FaqAccordionProps) {
  /* Every row ships collapsed on the source page. */
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={cn("hhcp-fq-accordion", className)}>
      {items.map((item) => {
        const open = item.id === openId;
        const panelId = `${idPrefix}-panel-${item.id}`;
        const buttonId = `${idPrefix}-question-${item.id}`;

        return (
          <div key={item.id} className={cn("hhcp-fq-item", open && "is-open")}>
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
  );
}
