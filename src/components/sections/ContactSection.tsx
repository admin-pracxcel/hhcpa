"use client";

/**
 * Contact details beside the contact form.
 *
 * Submits to `/api/contact`, which forwards to the n8n webhook. Posting to our
 * own route rather than the webhook keeps its URL out of the client bundle and
 * lets the server stamp the fields a browser must not be trusted with.
 *
 * Alongside the five visible fields it sends three derived ones: the country
 * the visitor is in (guessed from their browser, not the dial code they
 * picked), the campaign that brought them (see `lib/attribution.ts`), and the
 * submission date, which the server stamps in AEST.
 *
 * If delivery fails the visitor is told plainly and given the phone number and
 * email, both live. A form that reports success on a dropped message is worse
 * than one that admits the failure.
 *
 * Two compliance points are structural here, not incidental:
 *
 *   1. The warning against clinical detail sits directly under the message
 *      box, where someone about to type their symptoms will read it, rather
 *      than in fine print at the foot of the page.
 *   2. Nothing here is counted toward the Clause 1.2 quota. A general contact
 *      message is not a consultation request; treating one as the other would
 *      inflate the number the Risk-Share Bond is measured on.
 */

import { useState } from "react";
import type { FormEvent } from "react";

import { CLINIC } from "@/content/clinic";
import { findCountry, guessCountry } from "@/content/countries";
import { getLeadSource } from "@/lib/attribution";
import { cn } from "@/lib/utils";
import { PhoneField } from "./PhoneField";

const STYLES = `
.hhcp-ct-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-ct-container {
  padding-inline: 0;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: var(--hhcp-space-xxl, 101.25px);
  align-items: start;
}

.hhcp-ct-col {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  /* Grid children default to min-width:auto, so the column refuses to shrink
     below its longest unbreakable string. The email address is 38 characters
     with no break opportunity, which forced 34px of horizontal scroll at
     320px. This lets the column shrink; the rule below lets the address wrap. */
  min-width: 0;
}

.hhcp-ct-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hhcp-ct-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-ct-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ct-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ct-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

.hhcp-ct-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #ececec;
}

.hhcp-ct-row-label {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-base-60, rgba(1, 49, 38, 0.6));
}

.hhcp-ct-row-value,
.hhcp-ct-row-value a {
  overflow-wrap: anywhere;
  font-size: var(--hhcp-text-m, 16px);
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
  text-decoration: none;
}

.hhcp-ct-row-value a:hover {
  color: var(--hhcp-action-dark, #0c7340);
  text-decoration: underline;
}

.hhcp-ct-actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: var(--hhcp-space-xs, 13.5px);
}

.hhcp-ct-cta-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  line-height: 1;
  font-weight: 500;
  text-transform: uppercase;
  padding: 12.132px 19.2px;
  border-radius: var(--hhcp-radius-pill, 800px);
  border: 1px solid var(--hhcp-base-20, rgba(1, 49, 38, 0.2));
  color: var(--hhcp-primary, #013126);
  text-decoration: none;
  transition: all 0.3s linear;
}

.hhcp-ct-cta-outline:hover {
  background: var(--hhcp-primary, #013126);
  color: #ffffff;
}

/* ---------- form ---------- */
.hhcp-ct-form {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  padding: var(--hhcp-space-l, 45px);
  border-radius: 12px;
  background: var(--hhcp-accent, #f5fff9);
  border: 1px solid #d6e8e1;
}

.hhcp-ct-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--hhcp-space-s, 20px);
}

.hhcp-form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hhcp-form-label {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-primary, #013126);
}

.hhcp-form-input,
.hhcp-form-textarea {
  width: 100%;
  border: 1px solid var(--hhcp-base-20, rgba(1, 49, 38, 0.2));
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: #ffffff;
  padding: 14px;
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif;
  font-size: var(--hhcp-text-s, 16px);
  color: var(--hhcp-primary, #013126);
  outline: none;
  transition: border-color 0.2s linear, box-shadow 0.2s linear;
}

.hhcp-form-textarea {
  min-height: 140px;
  resize: vertical;
}

.hhcp-form-input:focus,
.hhcp-form-textarea:focus {
  border-color: var(--hhcp-primary, #013126);
  box-shadow: 0 0 0 3px rgba(88, 237, 162, 0.35);
}

.hhcp-form-input::placeholder,
.hhcp-form-textarea::placeholder {
  color: var(--hhcp-base-60, rgba(1, 49, 38, 0.6));
}

.hhcp-form-note {
  font-size: var(--hhcp-text-s, 16px);
  line-height: 1.5;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-form-status {
  padding: 14px;
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-cream, #ede9e3);
  font-size: var(--hhcp-text-s, 16px);
  line-height: 1.5;
  color: var(--hhcp-primary, #013126);
}

.hhcp-form-status a {
  color: var(--hhcp-primary, #013126);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.hhcp-ct-submit {
  align-self: flex-start;
}

.hhcp-ct-submit[disabled] {
  opacity: 0.6;
  cursor: progress;
}

/* Off-screen rather than display:none, which some bots skip. */
.hhcp-form-trap {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 991px) {
  .hhcp-ct-container {
    grid-template-columns: 1fr;
    gap: var(--hhcp-space-l, 45px);
  }
}

@media (max-width: 600px) {
  .hhcp-ct-row-2 {
    grid-template-columns: 1fr;
  }

  .hhcp-ct-form {
    padding: var(--hhcp-space-m, 30px);
  }
}
`;

interface ContactSectionProps {
  className?: string;
  detailsEyebrow: string;
  detailsHeading: string;
  hours: string;
  formEyebrow: string;
  formHeading: string;
  formNote: string;
}

export function ContactSection({
  className,
  detailsEyebrow,
  detailsHeading,
  hours,
  formEyebrow,
  formHeading,
  formNote,
}: ContactSectionProps) {
  type Status = "idle" | "sending" | "sent" | "failed" | "invalid";
  const [status, setStatus] = useState<Status>("idle");
  const [problem, setProblem] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "");

    /* Where the visitor is, which is not necessarily the dial code they chose. */
    const visitorCountry = findCountry(guessCountry());
    const phoneCountry = findCountry(value("phoneCountry"));

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: value("firstName"),
          lastName: value("lastName"),
          email: value("email"),
          phone: value("phone"),
          phoneCountry: phoneCountry.code,
          phoneDial: phoneCountry.dial,
          message: value("message"),
          company: value("company"),
          leadCountry: visitorCountry.code,
          leadCountryName: visitorCountry.name,
          ...getLeadSource(),
          pagePath:
            typeof window === "undefined" ? "" : window.location.pathname,
        }),
      });

      if (!response.ok) {
        /*
         * A 400 is the visitor's to fix and the server says how; anything else
         * is ours, and they should be given the phone number instead of a
         * correction they cannot act on.
         */
        if (response.status === 400) {
          const detail = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          setProblem(detail.error ?? "Please check the form and try again.");
          setStatus("invalid");
          return;
        }
        setStatus("failed");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("failed");
    }
  };

  return (
    <section className={cn("hhcp-ct-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-ct-container">
        <div className="hhcp-ct-col">
          <div className="hhcp-ct-eyebrow">
            <span className="hhcp-ct-dot" />
            <span className="hhcp-ct-eyebrow-label font-roboto-mono">
              {detailsEyebrow}
            </span>
          </div>
          <h2 className="hhcp-ct-title font-dm-sans">{detailsHeading}</h2>

          <ul className="hhcp-ct-list">
            <li className="hhcp-ct-row">
              <span className="hhcp-ct-row-label">Phone</span>
              <span className="hhcp-ct-row-value font-dm-sans">
                <a href={CLINIC.phoneHref}>{CLINIC.phone}</a>
              </span>
            </li>
            <li className="hhcp-ct-row">
              <span className="hhcp-ct-row-label">Email</span>
              <span className="hhcp-ct-row-value font-dm-sans">
                <a href={CLINIC.emailHref}>{CLINIC.email}</a>
              </span>
            </li>
            <li className="hhcp-ct-row">
              <span className="hhcp-ct-row-label">Service area</span>
              <span className="hhcp-ct-row-value font-dm-sans">
                {CLINIC.serviceArea}
              </span>
            </li>
            <li className="hhcp-ct-row">
              <span className="hhcp-ct-row-label">Hours</span>
              <span className="hhcp-ct-row-value font-dm-sans">{hours}</span>
            </li>
          </ul>

          <div className="hhcp-ct-actions">
            <a className="hhcp-btn" href="/quiz/">
              Book a consultation
            </a>
            <a className="hhcp-ct-cta-outline" href="/quiz/">
              Take the free quiz
            </a>
          </div>
        </div>

        <form className="hhcp-ct-form" onSubmit={handleSubmit} noValidate={false}>
          <div className="hhcp-ct-eyebrow">
            <span className="hhcp-ct-dot" />
            <span className="hhcp-ct-eyebrow-label font-roboto-mono">
              {formEyebrow}
            </span>
          </div>
          <h2 className="hhcp-ct-title font-dm-sans">{formHeading}</h2>

          <div className="hhcp-ct-row-2">
            <div className="hhcp-form-field">
              <label className="hhcp-form-label" htmlFor="contact-first-name">
                First name
              </label>
              <input
                id="contact-first-name"
                className="hhcp-form-input"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Jordan"
                required
              />
            </div>

            <div className="hhcp-form-field">
              <label className="hhcp-form-label" htmlFor="contact-last-name">
                Last name
              </label>
              <input
                id="contact-last-name"
                className="hhcp-form-input"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Fraser"
                required
              />
            </div>
          </div>

          <div className="hhcp-form-field">
            <label className="hhcp-form-label" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              className="hhcp-form-input"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <PhoneField name="phone" label="Phone number" />

          <div className="hhcp-form-field">
            <label className="hhcp-form-label" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              className="hhcp-form-textarea"
              name="message"
              placeholder="How can we help?"
              required
            />
            {/* Directly under the box, where someone about to type their
                symptoms will actually read it. */}
            <p className="hhcp-form-note font-dm-sans">{formNote}</p>
          </div>

          {/* Honeypot: no human sees it, bots fill everything. Hidden from
              assistive tech too, so nobody is asked to complete it. */}
          <div className="hhcp-form-trap" aria-hidden="true">
            <label htmlFor="contact-company">Company</label>
            <input
              id="contact-company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button
            className="hhcp-btn hhcp-ct-submit"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>

          {status === "sent" && (
            <p className="hhcp-form-status font-dm-sans" role="status">
              Thank you — your message has been sent. Our team will get back to
              you during business hours. If it is urgent, call{" "}
              <a href={CLINIC.phoneHref}>{CLINIC.phone}</a>.
            </p>
          )}

          {status === "invalid" && (
            <p className="hhcp-form-status font-dm-sans" role="alert">
              {problem}
            </p>
          )}

          {status === "failed" && (
            <p className="hhcp-form-status font-dm-sans" role="alert">
              Sorry — we could not send your message just now. Please call{" "}
              <a href={CLINIC.phoneHref}>{CLINIC.phone}</a> or email{" "}
              <a href={CLINIC.emailHref}>{CLINIC.email}</a> and our team will
              help you.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
