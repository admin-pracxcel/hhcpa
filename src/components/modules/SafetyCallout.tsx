import { Container } from "./Container";
import { EMERGENCY_CONTACTS } from "@/content/clinic";

/**
 * Highlighted safety callout. 6 instances.
 *
 * The emergency numbers come from the shared constant rather than page copy:
 * these must be identical everywhere they appear and must never be edited by
 * accident on one page.
 */
export function SafetyCallout({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <section className="py-[var(--hhcp-section-space-s)] px-[var(--hhcp-gutter)]">
      <Container>
        <div
          role="note"
          className="flex flex-col gap-[var(--hhcp-space-s)] rounded-[var(--hhcp-radius-l)] border-2 border-[color:var(--hhcp-action-dark)] bg-[color:var(--hhcp-light-green)] p-[var(--hhcp-space-l)]"
        >
          <h2 className="font-dm-sans text-[length:var(--hhcp-h3)] leading-[var(--hhcp-heading-lh)] font-medium text-[color:var(--hhcp-primary)]">
            {heading}
          </h2>
          <p className="font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-primary)]">
            {body}
          </p>
          <ul className="flex flex-wrap gap-[var(--hhcp-space-m)]">
            {EMERGENCY_CONTACTS.map((contact) => (
              <li key={contact.number}>
                <a
                  href={contact.href}
                  className="font-dm-sans text-[length:var(--hhcp-text-m)] font-medium text-[color:var(--hhcp-primary)] underline"
                >
                  {contact.label}: {contact.number}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
