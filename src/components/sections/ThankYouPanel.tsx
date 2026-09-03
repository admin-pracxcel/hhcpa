/**
 * The confirmation panel both thank-you pages are built from.
 *
 * A terminal page, so it is deliberately quiet: what we have, what happens
 * next, how to reach a person, and one way onward. There is no closing CTA band
 * below it on either page — pushing "start the free quiz" at someone who has
 * just finished the quiz is the kind of thing that reads as nobody being home.
 */

import { cn } from "@/lib/utils";
import { CLINIC } from "@/content/clinic";

const STYLES = `
.hhcp-ty-section {
  /* Clears the fixed header, same allowance ServiceHero makes. */
  padding: calc(var(--hhcp-section-space-m) + 122px) var(--hhcp-gutter)
    var(--hhcp-section-space-m);
  background-color: var(--hhcp-accent, #f5fff9);
}

@media (max-width: 991px) {
  .hhcp-ty-section {
    padding-top: calc(var(--hhcp-section-space-m) + 108px);
  }
}

.hhcp-ty-card {
  max-width: 715px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--hhcp-space-m, 30px);
  padding: var(--hhcp-section-space-xs) var(--hhcp-space-l);
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #d6e8e1;
  text-align: center;
}

.hhcp-ty-tick {
  width: 48px;
  height: 48px;
  flex: none;
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-ty-heading {
  font-size: var(--hhcp-h3);
  line-height: var(--hhcp-heading-lh);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ty-body {
  font-size: var(--hhcp-text-m, 16px);
  line-height: var(--hhcp-text-lh, 1.5);
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-ty-actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

/*
 * Outlined rather than a second filled button: one of these is the thing to do
 * next and the other is a way out, and two identical pills would not say which.
 */
.hhcp-ty-secondary {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  line-height: 1;
  font-weight: 500;
  text-transform: uppercase;
  padding: 12.132px 19.2px;
  border-radius: var(--hhcp-radius-pill);
  border: 1px solid var(--hhcp-base-20);
  color: var(--hhcp-primary, #013126);
  transition: all 0.3s linear;
}

.hhcp-ty-secondary:hover {
  background-color: var(--hhcp-primary, #013126);
  color: #ffffff;
}

.hhcp-ty-note {
  font-size: 14px;
  line-height: 1.6;
  color: #526f68;
}

.hhcp-ty-note a {
  color: var(--hhcp-primary, #013126);
  text-decoration: underline;
  text-underline-offset: 3px;
}
`;

interface ThankYouPanelProps {
  className?: string;
  heading: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  /**
   * Replaces the closing line. `/quiz-thank-you/` supplies its own, which
   * points at 000 and a GP rather than at us — so the default's phone number
   * and opening hours would read as an alternative to that, which is not what
   * an urgent enquiry needs.
   */
  note?: string;
}

export function ThankYouPanel({
  className,
  heading,
  body,
  primary,
  secondary,
  note,
}: ThankYouPanelProps) {
  return (
    <section className={cn("hhcp-ty-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-ty-card">
        <svg
          className="hhcp-ty-tick"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m8 12.5 2.5 2.5L16 9.5" strokeLinecap="round" />
        </svg>

        <h1 className="hhcp-ty-heading font-dm-sans">{heading}</h1>
        <p className="hhcp-ty-body font-dm-sans">{body}</p>

        <div className="hhcp-ty-actions">
          <a className="hhcp-btn" href={primary.href}>
            {primary.label}
          </a>
          <a
            className="hhcp-ty-secondary font-roboto-mono"
            href={secondary.href}
          >
            {secondary.label}
          </a>
        </div>

        <p className="hhcp-ty-note font-dm-sans">
          {note ?? (
            <>
              {"Need us sooner? Call "}
              <a href={CLINIC.phoneHref}>{CLINIC.phone}</a>
              {` — ${CLINIC.hours}. In an emergency, call 000.`}
            </>
          )}
        </p>
      </div>
    </section>
  );
}
