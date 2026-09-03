/**
 * Text one side, image the other — the explainer block on a service page.
 *
 * Not `StorySection`, which is what this started as. That component caps its
 * text at 410px because the homepage's version carries a bullet list and a
 * button beside a square photo; drop those and the copy sets at about 25
 * characters a line inside a 652px column, with 240px of dead space next to it
 * and a photo 220px taller than the text it is meant to sit beside.
 *
 * Here the columns are sized for prose — 73 characters a line at 1534px — and
 * the image is a 4:5 portrait crop rather than a square, which keeps its height
 * close to the text beside it instead of towering over it.
 *
 * `imageSide` flips the order for alternating rows down a page. It only swaps
 * the columns on desktop: stacked, the text always leads.
 */

import { cn } from "@/lib/utils";

const STYLES = `
.hhcp-sf-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-sf-container {
  padding-inline: 0;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: var(--hhcp-space-xxl, 101.25px);
  align-items: center;
}

.hhcp-sf-container[data-image-side="left"] .hhcp-sf-body {
  order: 2;
}

.hhcp-sf-body {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
}

.hhcp-sf-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hhcp-sf-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-sf-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-sf-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

/* Every paragraph reads the same: the layout carries this section, not
   typographic emphasis on one passage over another. */
.hhcp-sf-text {
  /* At 16px the full column ran to 89 characters a line. The heading still
     spans the column; only the body copy is held to a readable measure. */
  max-width: 520px;
  font-size: 16px;
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-sf-cta {
  align-self: flex-start;
  margin-top: var(--hhcp-space-xs, 13.5px);
}

.hhcp-sf-image {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  display: block;
  border-radius: 12px;
}

@media (max-width: 991px) {
  .hhcp-sf-container {
    grid-template-columns: 1fr;
    gap: var(--hhcp-space-l, 45px);
  }

  /* Stacked, the copy always leads regardless of the desktop order. */
  .hhcp-sf-container[data-image-side="left"] .hhcp-sf-body {
    order: 0;
  }

  /* One column means the text would otherwise run the container's full width:
     89 characters a line at 991px, against 64 in the two-column layout. */
  .hhcp-sf-body {
    max-width: 720px;
  }

  .hhcp-sf-image {
    aspect-ratio: 16 / 10;
    /*
     * Crop from above centre, not from the centre.
     *
     * The section photography is 4:5 portrait with the subject's head in the
     * upper third, so a centred 16:10 crop takes the band across their chest.
     * On /online-doctor/pathology-imaging-referrals/ that cut the man's head off
     * at the mouth. 32% keeps faces in every one of the thirty-two, checked as a
     * sheet rather than one at a time.
     */
    object-position: 50% 32%;
  }
}
`;

interface SplitFeatureProps {
  className?: string;
  eyebrow: string;
  heading: string;
  paragraphs: readonly string[];
  cta?: { label: string; href: string };
  image: string;
  imageAlt: string;
  /** Which side the image sits on at >= 992px. Defaults to the right. */
  imageSide?: "left" | "right";
}

export function SplitFeature({
  className,
  eyebrow,
  heading,
  paragraphs,
  cta,
  image,
  imageAlt,
  imageSide = "right",
}: SplitFeatureProps) {
  return (
    <section className={cn("hhcp-sf-section", className)}>
      <style>{STYLES}</style>
      <div
        className="hhcp-container hhcp-sf-container"
        data-image-side={imageSide}
      >
        <div className="hhcp-sf-body">
          <div className="hhcp-sf-eyebrow">
            <span className="hhcp-sf-dot" />
            <span className="hhcp-sf-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>

          <h2 className="hhcp-sf-title font-dm-sans">{heading}</h2>

          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="hhcp-sf-text font-dm-sans">
              {paragraph}
            </p>
          ))}

          {cta !== undefined && (
            <a className={cn("hhcp-btn", "hhcp-sf-cta")} href={cta.href}>
              {cta.label}
            </a>
          )}
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hhcp-sf-image"
          src={image}
          alt={imageAlt}
          width={768}
          height={960}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}
