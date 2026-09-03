/**
 * Pieces every service page repeats.
 *
 * Most pages in the content document end with "(Use standard closing CTA
 * band.)" rather than their own copy, and most carry the same "How to begin"
 * paragraph pointing at pricing and how-it-works. Keeping one copy of each
 * means the wording cannot drift across nineteen pages, and a change to the
 * standard band is a one-file edit.
 */

const IMAGES =
  "/images/";

/**
 * The section photography commissioned for the service pages — one image per
 * section, named for where it goes.
 *
 * A helper rather than a map of keys, because these are used once each. A map of
 * thirty-six single-use entries is indirection for its own sake; the filename
 * reads better sitting next to the section it belongs to, and grepping it finds
 * the one place it is used. Alt text is written inline at each section for the
 * same reason.
 *
 * This replaced an IMAGE / IMAGE_ALT pair of shared stock photographs. Those had
 * no consumers left once every section had its own picture, so they are gone —
 * along with the reason one of them was appearing on nine pages at once.
 */
export function sectionImage(name: string): string {
  return `${IMAGES}${name}.webp`;
}

/** Used wherever the source says "use standard closing CTA band". */
export const STANDARD_CLOSING = {
  heading: "Your health, handled from home",
  body: "Start with the free pre-screening quiz. It takes about two minutes, it is not a diagnosis, and there is no commitment until you choose to book.",
  primary: { label: "Start the free quiz", href: "/quiz/" },
} as const;

export const STANDARD_FOOTNOTE = "New here? See the full patient journey on";

export const STANDARD_FOOTNOTE_LINKS = [
  { label: "how it works", href: "/how-it-works/" },
  { label: "pricing", href: "/pricing/" },
] as const;

/**
 * The "How to begin" band. `lead`, `mid` and `tail` wrap the two links, so the
 * sentence reads as one line of prose rather than a list of buttons.
 */
export function howToBegin(lead: string) {
  return {
    heading: "How to begin",
    lead,
    mid: ", and the full process is explained on ",
    tail: ".",
    links: [
      { label: "pricing page", href: "/pricing/" },
      { label: "how it works", href: "/how-it-works/" },
    ],
    cta: { label: "Start the free quiz", href: "/quiz/" },
  } as const;
}
