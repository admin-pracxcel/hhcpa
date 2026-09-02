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
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/images/";

export const IMAGE = {
  approach: `${IMAGES}approach-to-care.jpg`,
  complexHealth: `${IMAGES}care-complex-health.jpg`,
  generalHealth: `${IMAGES}care-general-health.jpg`,
  mentalWellbeing: `${IMAGES}care-mental-wellbeing.jpg`,
  painManagement: `${IMAGES}care-pain-management.jpg`,
  physicalWellbeing: `${IMAGES}care-physical-wellbeing.jpg`,
  ourStory: `${IMAGES}our-story.jpg`,
  weightLoss: `${IMAGES}blog-weight-loss.jpeg`,
  sleepHealth: `${IMAGES}blog-sleep-health.jpg`,
  sleepPain: `${IMAGES}blog-sleep-pain.jpg`,
  consultation: `${IMAGES}steps-03-attend-appointment.jpg`,
  ongoing: `${IMAGES}steps-04-ongoing-support.jpg`,
} as const;

/**
 * Alt text for the stock photography. These are the descriptions captured from
 * the source site; they describe the picture, not the page it sits on, which is
 * what alt text is for.
 */
export const IMAGE_ALT = {
  approach:
    "A practitioner and a patient talking together in a bright consulting room.",
  complexHealth:
    "A woman in athletic wear performs a side lunge stretch on a path outdoors.",
  generalHealth: "A woman and man sitting close together, talking.",
  mentalWellbeing: "A man and a woman sit indoors, looking at a laptop together.",
  painManagement:
    "Two people sit facing each other indoors, holding hands and talking warmly.",
  physicalWellbeing:
    "A smiling person with a bald head, wearing a striped shirt, sits indoors.",
  ourStory: "A practitioner smiling in a consulting room.",
  weightLoss: "A person preparing a fresh meal at home.",
  sleepHealth: "A person resting comfortably in bed.",
  sleepPain: "A person sitting up in bed, holding their lower back.",
  consultation: "A person at a desk having a video consultation on a laptop.",
  ongoing:
    "An older man with grey hair and a beard smiles while using a laptop.",
} as const;

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
