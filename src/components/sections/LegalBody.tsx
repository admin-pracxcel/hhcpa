/**
 * Renders a legal document's block list.
 *
 * Same closed union as the articles use, for the same reason: nothing from the
 * old WordPress markup can carry a script, an inline style or a stray class
 * across, and the switch is exhaustive.
 *
 * Measure is capped at 760px. Legal text is long and dense, and set across the
 * full 1340px container it runs past 150 characters a line — unreadable
 * exactly where a reader most needs to follow the sentence.
 */

import { cn } from "@/lib/utils";
import type { LegalBlock } from "@/content/legal";

const STYLES = `
.hhcp-lg-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-lg-container {
  padding-inline: 0;
}

.hhcp-lg-updated {
  display: inline-block;
  margin-bottom: var(--hhcp-space-m, 30px);
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(1, 49, 39, 0.08);
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-primary, #013126);
}

.hhcp-lg-body {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
}

.hhcp-lg-body h2 {
  font-size: var(--hhcp-h3, 32px);
  line-height: 1.25;
  font-weight: 400;
  letter-spacing: -0.32px;
  color: var(--hhcp-primary, #013126);
  margin-top: var(--hhcp-space-m, 30px);
}

.hhcp-lg-body h3 {
  font-size: var(--hhcp-h4, 20px);
  line-height: 1.3;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
  margin-top: var(--hhcp-space-xs, 13.5px);
}

.hhcp-lg-body p {
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.7;
  color: rgba(1, 49, 38, 0.85);
}

.hhcp-lg-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding-left: 22px;
}

.hhcp-lg-list li {
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.7;
  color: rgba(1, 49, 38, 0.85);
}

.hhcp-lg-list li::marker {
  color: var(--hhcp-action-dark, #0c7340);
}
`;

interface LegalBodyProps {
  className?: string;
  lastUpdated: string;
  blocks: readonly LegalBlock[];
}

export function LegalBody({ className, lastUpdated, blocks }: LegalBodyProps) {
  return (
    <section className={cn("hhcp-lg-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-lg-container">
        {lastUpdated !== "" && (
          <p className="hhcp-lg-updated">{lastUpdated}</p>
        )}
        <div className="hhcp-lg-body font-dm-sans">
          {blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "p":
      return <p>{block.text}</p>;
    case "ul":
      return (
        <ul className="hhcp-lg-list">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    default: {
      /* Exhaustiveness guard; see ServicePage for why this is not redundant. */
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}
