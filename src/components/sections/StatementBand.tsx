/**
 * A single-paragraph band on the dark brand colour.
 *
 * The content document's module map calls this section feature tiles, but its
 * copy is one continuous argument rather than four separable points. Splitting
 * it into tiles would have meant writing three sentences that are not in the
 * approved copy — and regulated content needs express written approval before
 * publication (clause 6.2(b)), so inventing it is not a free choice. The band
 * carries the same visual weight the tiles would have.
 */

import { cn } from "@/lib/utils";

const STYLES = `
.hhcp-sm-section {
  background-color: var(--hhcp-primary, #013126);
  padding: var(--hhcp-section-space-l, 135px) var(--hhcp-gutter);
}

.hhcp-sm-container {
  padding-inline: 0;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--hhcp-space-xl, 67.5px);
  align-items: start;
}

.hhcp-sm-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
}

.hhcp-sm-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-sm-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-action-light, #baf8d9);
}

.hhcp-sm-body {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-m, 30px);
}

.hhcp-sm-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: #ffffff;
}

.hhcp-sm-text {
  font-size: var(--hhcp-text-l, 21.328px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
}

@media (max-width: 991px) {
  .hhcp-sm-container {
    grid-template-columns: 1fr;
    gap: var(--hhcp-space-m, 30px);
  }

  .hhcp-sm-eyebrow {
    padding-top: 0;
  }
}

@media (max-width: 767px) {
  .hhcp-sm-text {
    font-size: var(--hhcp-text-m, 16px);
  }
}
`;

interface StatementBandProps {
  className?: string;
  eyebrow: string;
  heading: string;
  body: string;
}

export function StatementBand({
  className,
  eyebrow,
  heading,
  body,
}: StatementBandProps) {
  return (
    <section className={cn("hhcp-sm-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-sm-container">
        <div className="hhcp-sm-eyebrow">
          <span className="hhcp-sm-dot" />
          <span className="hhcp-sm-eyebrow-label font-roboto-mono">
            {eyebrow}
          </span>
        </div>

        <div className="hhcp-sm-body">
          <h2 className="hhcp-sm-title font-dm-sans">{heading}</h2>
          <p className="hhcp-sm-text font-dm-sans">{body}</p>
        </div>
      </div>
    </section>
  );
}
