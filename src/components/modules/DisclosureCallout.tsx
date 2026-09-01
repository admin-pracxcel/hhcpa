import { Container } from "./Container";
import type { LinkRef } from "./types";

/**
 * Callout box linking to the conflict-of-interest / pharmacy disclosure page.
 * One instance, on the Medicinal Cannabis page, where the disclosure is a
 * regulatory expectation rather than a nicety.
 */
export function DisclosureCallout({
  heading,
  body,
  link,
}: {
  heading: string;
  body: string;
  link: LinkRef;
}) {
  return (
    <section className="py-[var(--hhcp-section-space-s)] px-[var(--hhcp-gutter)]">
      <Container>
        <div className="flex flex-col gap-[var(--hhcp-space-xs)] rounded-[var(--hhcp-radius-m)] bg-[color:var(--hhcp-neutral-ultra-light)] p-[var(--hhcp-space-m)]">
          <h2 className="font-dm-sans text-[length:var(--hhcp-h4)] font-medium text-[color:var(--hhcp-primary)]">
            {heading}
          </h2>
          <p className="font-dm-sans text-[length:var(--hhcp-text-s)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
            {body}
          </p>
          <a
            href={link.href}
            className="font-dm-sans text-[length:var(--hhcp-text-s)] font-medium text-[color:var(--hhcp-action-dark)] underline"
          >
            {link.label}
          </a>
        </div>
      </Container>
    </section>
  );
}
