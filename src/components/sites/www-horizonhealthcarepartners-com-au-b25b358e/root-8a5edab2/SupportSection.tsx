/**
 * "How We Support You" section for https://www.horizonhealthcarepartners.com.au/
 *
 * Structure mirrors the source markup:
 *   section                       — --hhcp-accent ground, --hhcp-section-space-m block /
 *                                   --hhcp-gutter inline
 *     ├─ .hhcp-sp-container       — global 1340px wrapper, inline padding zeroed
 *     │    └─ .hhcp-sp-head       — centred column: eyebrow row + h2
 *     └─ {children}               — the booking wizard, a direct child of the section
 *
 * The wizard supplies its own padding and its own marginally different ground
 * (#f4fffa against this section's #f5fff9). That mismatch exists in the source, so
 * nothing here wraps or compensates for it.
 *
 * Fully static — no state, no handlers — so this stays a server component.
 */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const EYEBROW = "How We Support You";
const HEADING = "Your health at your fingertips - anytime, anywhere";

const STYLES = `
.hhcp-sp-section {
  background-color: var(--hhcp-accent, #f5fff9);
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
  /* The section itself is a flex column with a 67.5px gap between the heading
     block and the booking wizard — measured on the live page. Without this the
     section comes out 66px short. */
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-xl, 67.5px);
}

/* The section supplies the gutter, so the shared container must not add its own. */
.hhcp-sp-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.hhcp-sp-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.hhcp-sp-eyebrow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.hhcp-sp-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-sp-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-sp-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
  text-align: center;
  max-width: 804px;
}
`;

interface SupportSectionProps {
  children?: ReactNode;
  className?: string;
  eyebrow?: string;
  heading?: string;
  /** Anchor target, so a CTA elsewhere on the page can jump to the wizard. */
  id?: string;
}

export function SupportSection({
  children,
  className,
  eyebrow = EYEBROW,
  heading = HEADING,
  id,
}: SupportSectionProps) {
  return (
    <section className={cn("hhcp-sp-section", className)} id={id}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-sp-container">
        <div className="hhcp-sp-head">
          <div className="hhcp-sp-eyebrow">
            <span className="hhcp-sp-dot" />
            <span className="hhcp-sp-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>
          <h2 className="hhcp-sp-title font-dm-sans">{heading}</h2>
        </div>
      </div>

      {children}
    </section>
  );
}
