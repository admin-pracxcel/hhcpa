import { Container } from "./Container";
import type { LinkRef } from "./types";

/** Inline CTA + related links. 16 instances — the mid-page nudge. */
export function InlineCta({
  heading,
  body,
  links,
}: {
  heading?: string;
  body: string;
  links: readonly LinkRef[];
}) {
  return (
    <section className="py-[var(--hhcp-section-space-s)] px-[var(--hhcp-gutter)]">
      <Container>
        <div className="flex flex-col gap-[var(--hhcp-space-s)] rounded-[var(--hhcp-radius-l)] bg-[color:var(--hhcp-accent)] p-[var(--hhcp-space-l)]">
          {heading ? (
            <h2 className="font-dm-sans text-[length:var(--hhcp-h3)] leading-[var(--hhcp-heading-lh)] font-normal text-[color:var(--hhcp-primary)]">
              {heading}
            </h2>
          ) : null}
          <p className="font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
            {body}
          </p>
          <div className="flex flex-wrap gap-[var(--hhcp-space-s)]">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="hhcp-btn">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
