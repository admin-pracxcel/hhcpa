"use client";

import { Container } from "./Container";
import { CLINIC } from "@/content/clinic";

/**
 * Contact details beside an enquiry form.
 *
 * The form does not submit in this phase. Wiring it to `/api/submit` is Phase 2
 * work — under Clause 1.2 a consultation request via a website form counts
 * toward the Patient Quota, so this form becomes a countable event and must post
 * server-side before it can be considered done.
 */
export function ContactBlock({ heading }: { heading: string }) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <div className="grid grid-cols-2 gap-[var(--hhcp-space-xl)] max-[991px]:grid-cols-1">
          <div className="flex flex-col gap-[var(--hhcp-space-s)]">
            <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
              {heading}
            </h2>
            <a
              href={CLINIC.phoneHref}
              className="font-dm-sans text-[length:var(--hhcp-text-l)] font-medium text-[color:var(--hhcp-primary)]"
            >
              {CLINIC.phone}
            </a>
            <a
              href={CLINIC.emailHref}
              className="font-dm-sans text-[length:var(--hhcp-text-m)] text-[color:var(--hhcp-base-80)]"
            >
              {CLINIC.email}
            </a>
            <p className="font-dm-sans text-[length:var(--hhcp-text-s)] text-[color:var(--hhcp-base-60)]">
              {CLINIC.serviceArea} · {CLINIC.hours}
            </p>
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="flex flex-col gap-[var(--hhcp-space-s)]"
          >
            <Field id="firstName" label="First name" />
            <Field id="lastName" label="Last name" />
            <Field id="email" label="Email" type="email" />
            <Field id="phone" label="Phone" type="tel" />
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="font-dm-sans text-[length:var(--hhcp-text-s)] text-[color:var(--hhcp-primary)]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="rounded-[var(--hhcp-radius-s)] border border-[color:var(--hhcp-base-20)] p-3 font-dm-sans text-[length:var(--hhcp-text-s)]"
              />
            </div>
            <button type="submit" className="hhcp-btn self-start">
              Send enquiry
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}

function Field({
  id,
  label,
  type = "text",
}: {
  id: string;
  label: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-dm-sans text-[length:var(--hhcp-text-s)] text-[color:var(--hhcp-primary)]"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="rounded-[var(--hhcp-radius-s)] border border-[color:var(--hhcp-base-20)] p-3 font-dm-sans text-[length:var(--hhcp-text-s)]"
      />
    </div>
  );
}
