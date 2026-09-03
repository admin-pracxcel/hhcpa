/**
 * `/quiz/` — the landing panel, and the thing that opens the quiz.
 *
 * Built to the live page: a two-column split with the photograph on the left
 * running the full height, and the logo, headline, three points and the button
 * on the right. No header, no footer, no navigation — which is why the route
 * sits outside the `(site)` group. On a page whose only job is to start the
 * quiz, every other link is a way to not start it.
 *
 * This owns whether the quiz is open, rather than the form owning it. The form
 * already carries the answers, the history and the submission; which of the two
 * states the *page* is in is not its business, and keeping it here means
 * closing the overlay puts the reader back on the landing page rather than
 * unmounting into nothing.
 */

"use client";

import { useCallback, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";

import { QUIZ_LANDING } from "@/content/quiz-landing";
import { QuizForm } from "./QuizForm";

const STYLES = `
/*
 * One screen, and it does not scroll unless the copy genuinely needs more than
 * one. height rather than min-height is the part that matters: it gives the
 * grid row a definite height, without which height: 100% on the photograph
 * cannot resolve and the image falls back to its own 1340x1839 aspect ratio —
 * which is what made it 899px tall in a 800px window and pushed the page into
 * scrolling.
 *
 * min-height: fit-content is the escape hatch. On a short window, or at a
 * large text size, the copy wins and the page scrolls rather than being clipped.
 */
.hhcp-ql-section {
  height: 100dvh;
  min-height: fit-content;
  padding: var(--hhcp-space-m) var(--hhcp-gutter);
  background: #ffffff;
}

.hhcp-ql-grid {
  height: 100%;
  max-width: var(--hhcp-content-width, 1340px);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--hhcp-space-m, 30px);
  align-items: stretch;
}

.hhcp-ql-image {
  width: 100%;
  height: 100%;
  /*
   * Grid items default to min-height: auto, and for a replaced element that
   * floor is its own aspect-ratio height — 1340x1839 here, so the photograph
   * refused to shrink below 1.37x the column width and kept pushing the page
   * past one screen even with the row given a definite height. 0 lets it crop.
   */
  min-height: 0;
  object-fit: cover;
  object-position: 50% 30%;
  display: block;
  border-radius: 4px;
}

/*
 * The copy is inset from the column and vertically centred, which is what puts
 * the headline level with the middle of the photograph beside it.
 */
/*
 * The gaps are in vh, not the usual vw-based tokens. Every other section on the
 * site is constrained by how wide the window is; this one is constrained by how
 * tall it is, and a short laptop window is exactly where the copy stopped
 * fitting. They still cap at the values the design uses on a roomy screen.
 */
.hhcp-ql-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(20px, 4vh, 40px);
  padding: var(--hhcp-space-m) 0 var(--hhcp-space-m) var(--hhcp-space-xxl, 101px);
  max-width: 640px;
}

/*
 * The page has no header, so these two are its whole navigation. Back returns
 * to wherever the reader came from — most arrive from a CTA somewhere on the
 * site — and the logo is the fallback for anyone who landed here cold, from an
 * ad or a shared link, with nothing to go back to.
 *
 * Both sit above the logo in the copy column rather than floating over the
 * photograph: the top-left of the section is 30px of padding, too little for a
 * control, and anything laid over the image would have to survive whatever is
 * behind it.
 */
.hhcp-ql-nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* 10px more than the rest of the column's rhythm: Back sat too close to the
     logo and read as part of it rather than as its own control. */
  gap: clamp(22px, calc(2vh + 10px), 30px);
}

.hhcp-ql-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: #526f68;
  text-decoration: none;
  transition: color 0.2s linear;
}

.hhcp-ql-back:hover {
  color: var(--hhcp-primary, #013126);
}

.hhcp-ql-logo {
  height: 55px;
  width: auto;
  align-self: flex-start;
  display: block;
}

.hhcp-ql-copy {
  display: flex;
  flex-direction: column;
  gap: clamp(14px, 3vh, 30px);
}

.hhcp-ql-eyebrow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.hhcp-ql-dot {
  width: 10px;
  height: 10px;
  flex: none;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
}

.hhcp-ql-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ql-heading {
  font-size: var(--hhcp-h1);
  line-height: var(--hhcp-heading-lh);
  font-weight: 400;
  letter-spacing: -0.6px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ql-intro {
  max-width: 536px;
  font-size: var(--hhcp-text-m, 16px);
  line-height: var(--hhcp-text-lh, 1.5);
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-ql-points {
  display: flex;
  flex-direction: column;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.hhcp-ql-point {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.5;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-ql-tick {
  width: 24px;
  height: 24px;
  flex: none;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ql-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.hhcp-ql-footnote {
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.5;
  color: rgba(1, 49, 38, 0.8);
}

@media (max-width: 991px) {
  /* Stacked, one screen stops being the right unit — let it be as tall as it is. */
  .hhcp-ql-section {
    height: auto;
  }
  .hhcp-ql-grid {
    grid-template-columns: 1fr;
    height: auto;
  }
  /* Stacked, the copy leads — the photograph is not the reason to be here. */
  .hhcp-ql-body {
    order: -1;
    padding: var(--hhcp-space-l) 0;
    max-width: none;
  }
  .hhcp-ql-image {
    min-height: 320px;
    max-height: 460px;
  }
}
`;

export function QuizLanding() {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);

  /*
   * Focus goes back to the button that opened the quiz. Without it, closing the
   * overlay drops the caret at the top of the document and a keyboard user has
   * to tab all the way back to where they were.
   */
  const close = useCallback(() => {
    setOpen(false);
    opener.current?.focus();
  }, []);

  /*
   * Steps back only when the reader came from this site. `document.referrer`
   * is empty on a cold landing and cross-origin when they arrived from an ad,
   * and history.back() in either case either does nothing or throws them off
   * the site entirely. Falling through to the href sends them home instead.
   */
  const back = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    const from = document.referrer;
    if (from !== "" && new URL(from).origin === window.location.origin) {
      event.preventDefault();
      window.history.back();
    }
  }, []);

  return (
    <section className="hhcp-ql-section">
      <style>{STYLES}</style>
      <div className="hhcp-ql-grid">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hhcp-ql-image"
          src={QUIZ_LANDING.image}
          alt={QUIZ_LANDING.imageAlt}
          width={1340}
          height={1839}
          fetchPriority="high"
        />

        <div className="hhcp-ql-body">
          <div className="hhcp-ql-nav">
            {/*
              A real link to "/" first, so it works before hydration and shows a
              destination on hover. The click only steps back in history when
              there is same-origin history to step back to — otherwise it does
              what the href says and goes home, rather than being a dead button.
            */}
            <Link className="hhcp-ql-back" href="/" onClick={back}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8.5 2.5 4 7l4.5 4.5" />
              </svg>
              Back
            </Link>

            <Link href="/" aria-label="Horizon Health Care Partners — home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="hhcp-ql-logo"
                src="/images/logo-colour-tagline.svg"
                alt="Horizon Health Care Partners Australia"
                width={195}
                height={55}
              />
            </Link>
          </div>

          <div className="hhcp-ql-copy">
            <div className="hhcp-ql-eyebrow">
              <span className="hhcp-ql-dot" />
              <span className="hhcp-ql-eyebrow-label font-roboto-mono">
                {QUIZ_LANDING.eyebrow}
              </span>
            </div>

            <h1 className="hhcp-ql-heading font-dm-sans">
              {QUIZ_LANDING.heading}
            </h1>

            <p className="hhcp-ql-intro font-dm-sans">{QUIZ_LANDING.intro}</p>

            <ul className="hhcp-ql-points">
              {QUIZ_LANDING.points.map((point) => (
                <li key={point} className="hhcp-ql-point font-dm-sans">
                  {/*
                    Two elements, not one path: a single filled path draws the
                    tick in the circle's own colour, which renders as a plain
                    dark disc. The tick has to be stroked on top in white.
                  */}
                  <svg
                    className="hhcp-ql-tick"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="12" fill="currentColor" />
                    <path
                      d="m7.5 12.4 3 3 6-6.4"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>

            <div className="hhcp-ql-actions">
              <button
                ref={opener}
                type="button"
                className="hhcp-btn"
                onClick={() => setOpen(true)}
              >
                {QUIZ_LANDING.cta}
              </button>
              <p className="hhcp-ql-footnote font-dm-sans">
                {QUIZ_LANDING.footnote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {open && <QuizForm onClose={close} />}
    </section>
  );
}
