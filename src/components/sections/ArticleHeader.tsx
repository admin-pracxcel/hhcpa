/**
 * The head of an article page: title, byline, featured image.
 *
 * Built to the live article template rather than to this site's own hero. The
 * reference is
 * `https://www.horizonhealthcarepartners.com.au/article/why-weight-loss-is-difficult-to-maintain-and-what-actually-works-long-term/`,
 * measured at 375 / 480 / 767 / 991 / 1200 / 1534px; every value below is one of
 * those measurements, and the spec is recorded in
 * `docs/research/.../SINGLE_POST_SPEC.md`.
 *
 * Worth knowing what this replaced: article pages used `ServiceHero`, the dark
 * green band with breadcrumbs and two CTAs that every service page carries. The
 * live template has no band at all — the title sits on white, centred, directly
 * under the header, and the first thing a reader meets is the article. So the
 * breadcrumb trail is gone from the page; `BreadcrumbList` JSON-LD still ships
 * from the page itself, so the trail survives where search engines read it.
 */

import { cn } from "@/lib/utils";

const STYLES = `
.hhcp-ah-section {
  /*
   * 122px clears the header, which is fixed over the top of the page. The live
   * site's header is in flow and needs no such allowance; ours is the one that
   * has to be paid for. Matches ServiceHero, so articles and service pages
   * start at the same height.
   *
   * The bottom is --hhcp-space-xl, which is the gap the live template leaves
   * between the featured image and the opening paragraph: 67 / 59 / 44px at
   * 1534 / 991 / 375px, matching that token at all three. The body section
   * below has no top padding of its own, so this is the whole of it.
   */
  padding: calc(var(--hhcp-section-space-m) + 122px) var(--hhcp-gutter)
    var(--hhcp-space-xl);
}

@media (max-width: 991px) {
  .hhcp-ah-section {
    padding-top: calc(var(--hhcp-section-space-m) + 108px);
  }
}

/* 1072px, centred, and the full width once the gutters have taken their share. */
.hhcp-ah-container {
  max-width: 1072px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  row-gap: var(--hhcp-space-m, 30px);
}

/*
 * 804px rather than the container's full 1072px: the measured title box holds
 * at 804 from 991px up, so a long headline breaks into three tighter lines
 * instead of two loose ones.
 */
.hhcp-ah-title {
  max-width: 804px;
  margin-inline: auto;
  font-size: var(--hhcp-article-h1);
  line-height: var(--hhcp-heading-lh);
  font-weight: 400;
  letter-spacing: -0.6px;
  text-align: center;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ah-byline {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.hhcp-ah-avatar {
  width: 48px;
  height: 48px;
  flex: none;
  border-radius: 22.5px;
  object-fit: contain;
}

.hhcp-ah-byline-text {
  display: flex;
  flex-direction: column;
}

.hhcp-ah-author {
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.2;
  font-weight: 700;
  color: #000000;
}

/*
 * 0.9 of the body size, holding that ratio at every width measured.
 *
 * align-self keeps the box shrink-to-fit. Stretched to the column it would look
 * the same — the text is left-aligned either way — but the measured box is 75px
 * rather than 242px, and a box that matches is one less thing to re-derive next
 * time someone compares the two.
 */
.hhcp-ah-date {
  align-self: flex-start;
  font-size: calc(var(--hhcp-text-m, 16px) * 0.9);
  line-height: 1.5;
  color: #000000;
}

/*
 * 3:2 at every width on the live page. object-fit is cover rather than the
 * live template's fill: the images here are already 3:2, so the two render
 * identically, and cover is what keeps a differently-shaped one from being
 * stretched rather than cropped.
 */
.hhcp-ah-image {
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  border-radius: 0;
}
`;

/*
 * The live template puts the site's own favicon here — the 512px "H" mark — as
 * the byline avatar. This is that same artwork, already in the tree for the
 * <link rel="icon"> tags. Empty alt: the author's name is right beside it, so a
 * screen reader announcing the mark as well would only repeat it.
 */
const AVATAR =
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/seo/favicon-192x192.png";

interface ArticleHeaderProps {
  className?: string;
  title: string;
  author: string;
  date: string;
  image: string;
  imageAlt: string;
}

export function ArticleHeader({
  className,
  title,
  author,
  date,
  image,
  imageAlt,
}: ArticleHeaderProps) {
  return (
    <section className={cn("hhcp-ah-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-ah-container">
        <h1 className="hhcp-ah-title font-dm-sans">{title}</h1>

        <div className="hhcp-ah-byline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hhcp-ah-avatar"
            src={AVATAR}
            alt=""
            width={48}
            height={48}
          />
          <div className="hhcp-ah-byline-text">
            <span className="hhcp-ah-author font-dm-sans">{author}</span>
            <time className="hhcp-ah-date font-dm-sans">{date}</time>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hhcp-ah-image"
          src={image}
          alt={imageAlt}
          width={1072}
          height={715}
        />
      </div>
    </section>
  );
}
