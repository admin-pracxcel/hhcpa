/**
 * Article body: renders the migrated block list.
 *
 * The blocks are a small closed union rather than raw HTML, so nothing from the
 * old WordPress markup can carry a script, an inline style or a stray class
 * into this site. It also means the switch below is exhaustive, guarded by the
 * usual `never` assignment.
 *
 * Measure is capped at 720px. The container is 1340px, and 16px body copy set
 * across all of it runs past 150 characters a line.
 */

import { cn } from "@/lib/utils";
import type { ArticleBlock } from "@/content/articles";

const STYLES = `
.hhcp-ab-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-ab-container {
  padding-inline: 0;
}

.hhcp-ab-body {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
}

.hhcp-ab-body h2 {
  font-size: var(--hhcp-h3, 32px);
  line-height: 1.25;
  font-weight: 400;
  letter-spacing: -0.32px;
  color: var(--hhcp-primary, #013126);
  margin-top: var(--hhcp-space-m, 30px);
}

.hhcp-ab-body h3 {
  font-size: var(--hhcp-h4, 20px);
  line-height: 1.3;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
  margin-top: var(--hhcp-space-xs, 13.5px);
}

.hhcp-ab-body p {
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.7;
  color: rgba(1, 49, 38, 0.85);
}

.hhcp-ab-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding-left: 22px;
}

.hhcp-ab-list li {
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.7;
  color: rgba(1, 49, 38, 0.85);
}

.hhcp-ab-list li::marker {
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-ab-money {
  margin: var(--hhcp-space-s, 20px) 0;
  padding: var(--hhcp-space-m, 30px);
  border-radius: 12px;
  background: var(--hhcp-accent, #f5fff9);
  border: 1px solid #d6e8e1;
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.6;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ab-money a {
  color: var(--hhcp-primary, #013126);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.hhcp-ab-money a:hover {
  color: var(--hhcp-action-dark, #0c7340);
}
`;

interface ArticleBodyProps {
  className?: string;
  blocks: readonly ArticleBlock[];
  moneyPage: { label: string; href: string };
}

export function ArticleBody({
  className,
  blocks,
  moneyPage,
}: ArticleBodyProps) {
  /* The money-page link belongs near the top, after the opening paragraphs. */
  const insertAfter = Math.min(
    2,
    blocks.findIndex((block) => block.kind === "h2"),
  );

  return (
    <section className={cn("hhcp-ab-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-ab-container">
        <div className="hhcp-ab-body font-dm-sans">
          {blocks.map((block, index) => (
            <div key={index} style={{ display: "contents" }}>
              <Block block={block} />
              {index === insertAfter - 1 && (
                <p className="hhcp-ab-money">
                  Considering your options?{" "}
                  <a href={moneyPage.href}>Read about {moneyPage.label}</a>, or
                  start with the <a href="/quiz/">free pre-screening quiz</a>.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "p":
      return <p>{block.text}</p>;
    case "ul":
      return (
        <ul className="hhcp-ab-list">
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
