/**
 * `/quiz-book/` — where a green or amber submission lands.
 *
 * Green and amber share this page because the patient's experience of them is
 * identical: both book. The difference between the two is an email to the
 * clinic so a practitioner reviews the amber answers, which is an n8n branch on
 * the `outcome` already in the payload — the site does nothing differently.
 * Two pages that render the same thing would be two pages to keep in step.
 *
 * ⚠️ The booking portal itself is a placeholder. Halaxy, MedPrescribe and
 * getscripted are all live on the client's current site and which one this uses
 * is not settled; the slot below says so plainly rather than pretending.
 *
 * Because of that the phone number is not a footnote here, it is the working
 * path. A patient who has just been told they can book must not reach a dead
 * end, so the panel gives them a number that answers seven days a week. When the
 * portal is chosen, it replaces the placeholder and the number goes back to
 * being a fallback.
 */

import { cn } from "@/lib/utils";
import { CLINIC } from "@/content/clinic";

const STYLES = `
.hhcp-bk-section {
  /* Clears the fixed header, the allowance ServiceHero makes. */
  padding: calc(var(--hhcp-section-space-m) + 122px) var(--hhcp-gutter)
    var(--hhcp-section-space-m);
  background-color: var(--hhcp-accent, #f5fff9);
}

@media (max-width: 991px) {
  .hhcp-bk-section {
    padding-top: calc(var(--hhcp-section-space-m) + 108px);
  }
}

.hhcp-bk-container {
  max-width: 715px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-bk-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--hhcp-space-s, 20px);
  text-align: center;
}

.hhcp-bk-tick {
  width: 48px;
  height: 48px;
  flex: none;
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-bk-heading {
  font-size: var(--hhcp-h3);
  line-height: var(--hhcp-heading-lh);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-bk-body {
  font-size: var(--hhcp-text-m, 16px);
  line-height: var(--hhcp-text-lh, 1.5);
  color: rgba(1, 49, 38, 0.8);
}

/*
 * Dashed, and labelled as a placeholder, so nobody mistakes it for a finished
 * booking widget — least of all whoever ships this.
 */
.hhcp-bk-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--hhcp-space-s, 20px);
  padding: var(--hhcp-section-space-xs) var(--hhcp-space-l);
  border-radius: 12px;
  background: #ffffff;
  border: 2px dashed #b9d4c9;
  text-align: center;
}

.hhcp-bk-slot-label {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-bk-slot-text {
  max-width: 46ch;
  font-size: var(--hhcp-text-m, 16px);
  line-height: var(--hhcp-text-lh, 1.5);
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-bk-phone {
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
  text-decoration: none;
}

.hhcp-bk-phone:hover {
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-bk-hours {
  font-size: 14px;
  line-height: 1.6;
  color: #526f68;
}

.hhcp-bk-note {
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  color: #526f68;
}
`;

export function BookingPanel({ className }: { className?: string }) {
  return (
    <section className={cn("hhcp-bk-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-bk-container">
        <div className="hhcp-bk-head">
          <svg
            className="hhcp-bk-tick"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12.5 2.5 2.5L16 9.5" strokeLinecap="round" />
          </svg>

          <h1 className="hhcp-bk-heading font-dm-sans">
            Thanks — we’ve got your details
          </h1>
          <p className="hhcp-bk-body font-dm-sans">
            Your pre-screening answers have been received. You can book your
            consultation with an AHPRA-registered practitioner now.
          </p>
        </div>

        <div className="hhcp-bk-slot">
          <p className="hhcp-bk-slot-label font-roboto-mono">
            Booking portal — placeholder
          </p>
          <p className="hhcp-bk-slot-text font-dm-sans">
            Online booking is being finalised. To book your consultation now,
            call our team and we will find you a time.
          </p>
          <a className="hhcp-bk-phone font-dm-sans" href={CLINIC.phoneHref}>
            {CLINIC.phone}
          </a>
          <p className="hhcp-bk-hours font-dm-sans">{CLINIC.hours}</p>
        </div>

        <p className="hhcp-bk-note font-dm-sans">
          Nothing has been prescribed from this quiz. Any care plan comes from
          your consultation. If your enquiry is urgent, please call 000 or
          contact your GP.
        </p>
      </div>
    </section>
  );
}
