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

import { QUIZ_LANDING } from "@/content/quiz-landing";
import { QuizForm } from "./QuizForm";

const STYLES = `
.hhcp-ql-section {
  min-height: 100dvh;
  padding: var(--hhcp-space-m) var(--hhcp-gutter);
  background: #ffffff;
}

.hhcp-ql-grid {
  max-width: var(--hhcp-content-width, 1340px);
  min-height: calc(100dvh - var(--hhcp-space-m) * 2);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--hhcp-space-m, 30px);
  align-items: stretch;
}

.hhcp-ql-image {
  width: 100%;
  height: 100%;
  min-height: 420px;
  object-fit: cover;
  object-position: 50% 30%;
  display: block;
  border-radius: 4px;
}

/*
 * The copy is inset from the column and vertically centred, which is what puts
 * the headline level with the middle of the photograph beside it.
 */
.hhcp-ql-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--hhcp-section-space-xs);
  padding: var(--hhcp-space-m) 0 var(--hhcp-space-m) var(--hhcp-space-xxl, 101px);
  max-width: 640px;
}

.hhcp-ql-logo {
  height: 55px;
  width: auto;
  align-self: flex-start;
}

.hhcp-ql-copy {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-m, 30px);
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
  .hhcp-ql-grid {
    grid-template-columns: 1fr;
    min-height: 0;
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hhcp-ql-logo"
            src="/images/logo-colour-tagline.svg"
            alt="Horizon Health Care Partners Australia"
            width={195}
            height={55}
          />

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
