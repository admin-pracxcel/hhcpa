/**
 * Copy for the `/quiz/` landing panel, transcribed from the live page.
 *
 * The live quiz sits on its own — no header, no footer, no navigation. That is
 * deliberate on a page whose only job is to start the quiz, and it is why this
 * route lives outside the `(site)` group.
 */

export const QUIZ_LANDING = {
  /* §2.6: was "Takes just 2 minutes to complete". The assessment forms
     state 5 to 7 minutes depending on the service, so the landing page cannot
     promise a figure before the service has been chosen. */
  eyebrow: "Takes just a few minutes to complete",
  heading: "Start Your Pre-Screening Quiz",
  /* The live page has a double space after "will"; corrected here. */
  intro:
    "Tell us about your health through a few straightforward questions. Based on your responses, we will see if our services could be suitable for your situation.",
  points: [
    "Takes only a few minutes",
    "Confidential & secure",
    "Directly book a consultation after this quiz",
  ],
  cta: "Begin Pre-Screening",
  footnote: "Your medical consultation is just a few steps away",
  image: "/images/quiz-hero.webp",
  imageAlt:
    "A person in a lime green sweater holds a smartphone and a mug of coffee at a wooden table.",
} as const;
