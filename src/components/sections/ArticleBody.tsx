/**
 * Article body: the migrated block list, then the share row.
 *
 * The blocks are a small closed union rather than raw HTML, so nothing from the
 * old WordPress markup can carry a script, an inline style or a stray class
 * into this site. It also means the switch below is exhaustive, guarded by the
 * usual `never` assignment.
 *
 * Typeset to the live article template, measured at 375 / 480 / 767 / 991 /
 * 1200 / 1534px; the spec is in `docs/research/.../SINGLE_POST_SPEC.md`. Four of
 * its values turned out to be tokens this site already had — body copy and
 * paragraph spacing are `--hhcp-text-m`, the h3 is `--hhcp-text-l`, the list
 * margin is `--hhcp-space-m` and the section's side padding is `--hhcp-gutter`,
 * each matching to the fourth decimal at every width. Only the h1, h2 and their
 * spacing needed new ones.
 *
 * Three things are the live template's, not this site's, and look wrong beside
 * the rest of the site until you know that: the measure is 715px rather than the
 * 720px this file used to cap at, the headings are 700-weight black rather than
 * 400-weight brand green, and the closing disclaimer is 13px italic under a 2px
 * grey rule. All three are what the reference does.
 */

import { Fragment } from "react";

import { cn } from "@/lib/utils";
import type { ArticleBlock } from "@/content/articles";
import { FacebookIcon, LinkedInIcon, XIcon } from "./social-icons";

const STYLES = `
/* padding-top 0: the header section above ends flush against this one. */
.hhcp-ab-section {
  padding: 0 var(--hhcp-gutter) var(--hhcp-section-space-m);
  background-color: #ffffff;
}

.hhcp-ab-container {
  max-width: 715px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  row-gap: var(--hhcp-space-l, 45px);
  align-items: flex-start;
}

.hhcp-ab-body {
  width: 100%;
}

/*
 * No letter-spacing here on purpose. The base layer sets -0.42px on h2 and
 * -0.6px on h3, which is exactly what the live template computes; overriding it
 * to normal put every heading 0.42px per character wider than the reference.
 */
.hhcp-ab-body h2 {
  font-size: var(--hhcp-article-h2);
  line-height: var(--hhcp-heading-lh);
  font-weight: 700;
  color: #000000;
  margin: var(--hhcp-article-h2-space) 0 var(--hhcp-article-h-gap);
}

.hhcp-ab-body h3 {
  font-size: var(--hhcp-text-l);
  line-height: var(--hhcp-heading-lh);
  font-weight: 700;
  color: #000000;
  margin: var(--hhcp-article-h3-space) 0 var(--hhcp-article-h-gap);
}

.hhcp-ab-body p {
  font-size: var(--hhcp-text-m, 16px);
  line-height: var(--hhcp-text-lh, 1.5);
  color: rgba(1, 49, 38, 0.8);
}

/*
 * One line of space above a paragraph — 1em, which is --hhcp-text-m at every
 * width, matching the reference exactly.
 *
 * A paragraph gets it after another paragraph and after a heading, but not
 * after a list, and never as the first thing in the article. That is the live
 * template's own pattern, checked paragraph by paragraph: a list already ends
 * with its own 30px, so a paragraph following one needs nothing.
 *
 * The money-page block is excluded because it sets its own margins, and this
 * selector would otherwise outrank them on specificity.
 */
.hhcp-ab-body :is(p, h2, h3) + p:not(.hhcp-ab-money, .hhcp-ab-note) {
  margin-top: 1em;
}

.hhcp-ab-list {
  margin: var(--hhcp-space-m, 30px) 0;
  padding-left: var(--hhcp-article-list-indent);
  list-style: disc;
}

.hhcp-ab-list li {
  font-size: var(--hhcp-text-m, 16px);
  line-height: var(--hhcp-text-lh, 1.5);
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-ab-list li + li {
  margin-top: 8px;
}

/* ---------- Closing disclaimer ---------- */
/*
 * A rule, then the line in 13px italic. The rule is the live template's
 * wp-block-separator: 2px, grey, one line of space above it and none below,
 * so the note sits tight under it.
 *
 * 13px is a flat number rather than a fluid one — it is the only size on the
 * page that does not scale, and it measures 13px at 375px as well as at 1534px.
 */
.hhcp-ab-rule {
  width: 100%;
  border: 0;
  border-top: 2px solid #808080;
  margin: 1em 0 0;
}

/*
 * Qualified with a type selector so it outranks .hhcp-ab-body p above, which
 * is a class plus a type and would otherwise keep the note at body size.
 *
 * Italic through CSS rather than an <em>, which the reference uses. <em> means
 * stress emphasis, and a disclaimer set in italic is a convention of the form
 * rather than a sentence being emphasised — this way a screen reader reads it
 * plainly instead of leaning on every word of it.
 */
p.hhcp-ab-note {
  font-size: 13px;
  line-height: 1.5;
  font-style: italic;
  color: rgba(1, 49, 38, 0.8);
  margin-top: 13px;
}

/* ---------- Money-page prompt ---------- */
/*
 * Not on the live template, which is a plain WordPress post. It is kept because
 * these pages exist to lead somewhere: the design spec makes each article carry
 * one link to the service it supports. It sits in the measure, in the body's own
 * type, so it reads as part of the article rather than as an advert dropped into
 * it.
 */
.hhcp-ab-money {
  margin: var(--hhcp-space-m, 30px) 0;
  padding: var(--hhcp-space-m, 30px);
  border-radius: 12px;
  background: var(--hhcp-accent, #f5fff9);
  border: 1px solid #d6e8e1;
  font-size: var(--hhcp-text-m, 16px);
  line-height: var(--hhcp-text-lh, 1.5);
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

/* ---------- Share ---------- */
.hhcp-ab-divider {
  width: 100%;
  border: 0;
  border-top: 1px solid rgba(1, 49, 38, 0.2);
  margin: 0;
}

.hhcp-ab-share {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: var(--hhcp-space-xs, 13.5px);
}

.hhcp-ab-share-heading {
  font-size: var(--hhcp-text-m, 16px);
  line-height: var(--hhcp-heading-lh);
  font-weight: 400;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ab-share-list {
  display: flex;
  flex-direction: row;
  gap: var(--hhcp-space-xs, 13.5px);
  list-style: none;
  margin: 0;
  padding: 0;
}

.hhcp-ab-share-list a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: rgba(1, 49, 38, 0.8);
  transition: color 0.3s linear;
}

.hhcp-ab-share-list a:hover {
  color: var(--hhcp-primary, #013126);
}

@media (max-width: 767px) {
  .hhcp-ab-share-heading {
    text-align: center;
  }
}
`;

interface ArticleBodyProps {
  className?: string;
  blocks: readonly ArticleBlock[];
  moneyPage: { label: string; href: string };
  /** Absolute, because the share endpoints resolve it on their own servers. */
  shareUrl: string;
  shareTitle: string;
}

export function ArticleBody({
  className,
  blocks,
  moneyPage,
  shareUrl,
  shareTitle,
}: ArticleBodyProps) {
  /* The money-page link belongs near the top, after the opening paragraphs. */
  const insertAfter = Math.min(
    2,
    blocks.findIndex((block) => block.kind === "h2"),
  );

  const url = encodeURIComponent(shareUrl);
  const text = encodeURIComponent(shareTitle);
  const shares = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer.php?u=${url}&title=${text}`,
      icon: <FacebookIcon />,
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      icon: <XIcon />,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`,
      icon: <LinkedInIcon />,
    },
  ];

  return (
    <section className={cn("hhcp-ab-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-ab-container">
        <div className="hhcp-ab-body font-dm-sans">
          {/*
            Fragment, not a `display: contents` wrapper. Adjacent-sibling
            selectors read the DOM, not the box tree, so with a wrapper element
            around each block the paragraphs were never siblings and `p + p`
            silently matched nothing — every paragraph ran into the next.
          */}
          {blocks.map((block, index) => (
            <Fragment key={index}>
              <Block block={block} />
              {index === insertAfter - 1 && (
                <p className="hhcp-ab-money">
                  Considering your options?{" "}
                  <a href={moneyPage.href}>Read about {moneyPage.label}</a>, or
                  start with the <a href="/quiz/">free pre-screening quiz</a>.
                </p>
              )}
            </Fragment>
          ))}
        </div>

        <hr className="hhcp-ab-divider" />

        <div className="hhcp-ab-share">
          <h2 className="hhcp-ab-share-heading font-dm-sans">
            Share this post
          </h2>
          <ul className="hhcp-ab-share-list">
            {shares.map((share) => (
              <li key={share.name}>
                <a
                  href={share.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label={`Share on ${share.name}`}
                >
                  {share.icon}
                </a>
              </li>
            ))}
          </ul>
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
    case "note":
      return (
        <>
          <hr className="hhcp-ab-rule" />
          <p className="hhcp-ab-note">{block.text}</p>
        </>
      );
    default: {
      /* Exhaustiveness guard; see ServicePage for why this is not redundant. */
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}
