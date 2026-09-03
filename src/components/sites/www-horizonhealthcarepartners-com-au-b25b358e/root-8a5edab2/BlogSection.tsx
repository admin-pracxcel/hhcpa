/**
 * "Our Knowledge Hub" blog teaser for https://www.horizonhealthcarepartners.com.au/
 *
 * Structure mirrors the source markup:
 *   section                       — --hhcp-section-space-m block / --hhcp-gutter inline
 *     └─ .hhcp-container          — global 1340px wrapper, inline padding zeroed
 *          ├─ .head               — ROW (not a column): title stack left, CTA right
 *          └─ .list               — column of <article> rows, 30px apart
 *
 * Each row is meta / title / image in DOM order. The image is last in the DOM but
 * `order: -1` lifts it to the top of the stacked mobile layout, matching the source.
 * The 767px breakpoint is the target's own, so it lives in the scoped <style> block.
 * Fully static — the row and CTA hovers are pure CSS, so this stays a server
 * component.
 *
 * The CTA is the source's `bricks-button` verbatim, including
 * `letter-spacing: normal` (the theme's 0.36px rule loses downstream) and the
 * `fa-circle` dot ahead of the label that grows a ring on hover.
 */

import { cn } from "@/lib/utils";

/* Relative: this site now *is* horizonhealthcarepartners.com.au. */
const CTA_HREF = "/articles/";
const CTA_LABEL = "Read All Blogs";

const EYEBROW = "Our Health & Wellness Blogs";
const HEADING = "Our Knowledge Hub";

/*
 * The source has a topic taxonomy at /topic/<name>/. This site does not, so the
 * topic label goes to the article index instead — the one page here that lists
 * articles. Pointing it at the source would send the reader off-site; leaving it
 * absolute-but-local would 404.
 */
const TOPIC_HREF = "/articles/";
const IMAGE_BASE =
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/images/";

/**
 * One card. Exported because two pages feed it their own: the homepage and the
 * knowledge hub both list the same articles, and they read them from
 * `articles.ts` so the two cannot disagree about a title, a date or a read
 * time. The default POSTS below stay as the target wrote them, for the clone.
 */
export interface BlogPost {
  readonly topic: string;
  readonly readTime: string;
  readonly date: string;
  readonly title: string;
  readonly href: string;
  /** Full path. The defaults below prefix IMAGE_BASE themselves. */
  readonly image: string;
  readonly alt: string;
}

const POSTS: readonly BlogPost[] = [
  {
    topic: "General",
    readTime: "3 minutes",
    date: "May 05, 2026",
    title:
      "Why Weight Loss is Difficult to Maintain, and What Actually Works Long-Term",
    href: "/article/why-weight-loss-is-difficult-to-maintain-and-what-actually-works-long-term/",
    image: `${IMAGE_BASE}blog-weight-loss.jpeg`,
    alt: "Two women exercising outdoors in activewear, representing a healthy active lifestyle for sustainable long-term weight management",
  },
  {
    topic: "General",
    readTime: "3 minutes",
    date: "May 05, 2026",
    title: "Why Sleep is Essential for Chronic Pain, Weight, and Overall Health",
    href: "/article/why-sleep-is-essential-for-chronic-pain-weight-and-overall-health/",
    image: `${IMAGE_BASE}blog-sleep-health.jpg`,
    alt: "Woman sitting on bed stretching in the morning, representing the connection between healthy sleep and overall wellbeing",
  },
  {
    topic: "General",
    readTime: "2 minutes",
    date: "May 05, 2026",
    title: "Why Sleep Matters in Chronic Pain",
    href: "/article/why-sleep-matters-in-chronic-pain/",
    image: `${IMAGE_BASE}blog-sleep-pain.jpg`,
    alt: "Young woman sleeping peacefully in white sheets, representing the importance of quality sleep for chronic pain relief",
  },
] as const;

const STYLES = `
.hhcp-bl-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

/* The section supplies the gutter, so the shared container must not add its own. */
.hhcp-bl-container {
  padding-inline: 0;
  /* Source: the container is a 30px-gap column (heading rule, then the post list). */
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-m, 30px);
}

.hhcp-bl-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  /* Same hairline rule the Pricing and Steps headings carry. */
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-bl-head-text {
  display: flex;
  flex-direction: column;
  /* 30px, not the 20px used by the other section headings — measured on the
     live page (eyebrow 18 + 30 + h2 46 = the 94px block height). */
  gap: 30px;
  align-items: flex-start;
}

.hhcp-bl-eyebrow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.hhcp-bl-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-bl-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-bl-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-bl-head-action {
  min-width: 164px;
}

.hhcp-bl-cta {
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
  transition: all 0.3s linear;
}

.hhcp-bl-cta:hover {
  box-shadow: 5px 5px 25px 0 rgba(33, 33, 33, 0.1);
}

/* 10px fa-circle icon, before the label. */
.hhcp-bl-cta-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  flex: none;
  transition: all 0.3s linear;
}

.hhcp-bl-cta:hover .hhcp-bl-cta-dot {
  box-shadow: 0 0 0 3px rgba(1, 49, 38, 0.25);
}

.hhcp-bl-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.hhcp-bl-post {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--hhcp-space-m, 30px);
  padding: 32px 16px;
  border-top: 1px solid rgba(236, 236, 236, 0.3);
  border-radius: 4px;
  transition: all 0.3s linear;
}

.hhcp-bl-post:hover {
  background-color: var(--hhcp-accent, #f5fff9);
}

.hhcp-bl-meta {
  width: 100%;
  max-width: 368px;
  display: flex;
  flex-direction: row;
  gap: var(--hhcp-space-xl, 67.5px);
}

.hhcp-bl-meta-sub {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.hhcp-bl-meta-text {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-bl-title-block {
  /* 580px is what the flex row *produces* at 1340px wide
     (1340 - 32 padding - 368 meta - 300 image - 2x30 gap), not a fixed width.
     Hard-coding it overflowed the viewport once the row stacked on mobile, so
     let flex size it and just cap it at the desktop figure. */
  flex: 1 1 auto;
  min-width: 0;
  max-width: 580px;
}

@media (max-width: 767px) {
  .hhcp-bl-title-block {
    max-width: 100%;
  }
}

.hhcp-bl-post-title {
  font-size: var(--hhcp-h4, 20px);
  line-height: 24.16px;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
}

.hhcp-bl-post-title a {
  color: inherit;
}

.hhcp-bl-media {
  width: 300px;
  max-width: 300px;
  min-height: 200px;
  border-radius: 4px;
  flex: none;
  display: block;
  overflow: hidden;
  transition: all 0.3s linear;
}

.hhcp-bl-image {
  width: 100%;
  /* The source does NOT crop these to a fixed 200px. The wrapper carries
     min-height: 200px and the image keeps its natural aspect ratio, so the
     taller 1024x809 post renders 300x237 and makes its row taller. */
  height: auto;
  border-radius: 4px;
  display: block;
}

@media (max-width: 767px) {
  .hhcp-bl-head {
    flex-direction: column;
  }

  .hhcp-bl-post {
    flex-direction: column;
    gap: var(--hhcp-space-xs, 13.5px);
  }

  .hhcp-bl-meta {
    justify-content: space-between;
  }

  .hhcp-bl-meta-sub {
    align-items: flex-end;
  }

  /* The image is last in the DOM but leads the stacked layout. */
  .hhcp-bl-media {
    max-width: 100%;
    width: 100%;
    order: -1;
  }
}
`;

interface BlogSectionProps {
  className?: string;
  eyebrow?: string;
  heading?: string;
  /** Defaults to the target's own three. Pages pass articles.ts instead. */
  posts?: readonly BlogPost[];
  cta?: { label: string; href: string };
  /**
   * Set false on `/articles/`. The CTA is the way out to the article index, so
   * on the index it links to the page being read — the same reason FaqSection
   * carries one of these.
   */
  showCta?: boolean;
}

export function BlogSection({
  className,
  eyebrow = EYEBROW,
  heading = HEADING,
  posts = POSTS,
  cta = { label: CTA_LABEL, href: CTA_HREF },
  showCta = true,
}: BlogSectionProps) {
  return (
    <section className={cn("hhcp-bl-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-bl-container">
        <div className="hhcp-bl-head">
          <div className="hhcp-bl-head-text">
            <div className="hhcp-bl-eyebrow">
              <span className="hhcp-bl-dot" />
              <span className="hhcp-bl-eyebrow-label font-roboto-mono">
                {eyebrow}
              </span>
            </div>
            <h2 className="hhcp-bl-title font-dm-sans">{heading}</h2>
          </div>

          {showCta && (
            <div className="hhcp-bl-head-action">
              <a className="hhcp-bl-cta font-roboto-mono" href={cta.href}>
                <span className="hhcp-bl-cta-dot" />
                {cta.label}
              </a>
            </div>
          )}
        </div>

        <div className="hhcp-bl-list">
          {posts.map((post) => (
            <article key={post.href} className="hhcp-bl-post">
              <div className="hhcp-bl-meta">
                <a
                  className="hhcp-bl-meta-text font-roboto-mono"
                  href={TOPIC_HREF}
                >
                  {post.topic}
                </a>
                <div className="hhcp-bl-meta-sub">
                  <span className="hhcp-bl-meta-text font-roboto-mono">
                    {post.readTime}
                  </span>
                  <span className="hhcp-bl-meta-text font-roboto-mono">
                    {post.date}
                  </span>
                </div>
              </div>

              <div className="hhcp-bl-title-block">
                <h3 className="hhcp-bl-post-title font-dm-sans">
                  <a href={post.href}>{post.title}</a>
                </h3>
              </div>

              <a className="hhcp-bl-media" href={post.href}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="hhcp-bl-image"
                  src={post.image}
                  alt={post.alt}
                  width={300}
                  height={200}
                />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
