import { Container } from "./Container";

/**
 * The lead paragraph. 31 instances — one per page, always directly under the
 * trust bar, always carrying the page's primary keyword in its first sentence.
 */
export function Intro({ text }: { text: string }) {
  return (
    <section className="py-[var(--hhcp-section-space-s)] px-[var(--hhcp-gutter)]">
      <Container>
        <p className="max-w-[880px] font-dm-sans text-[length:var(--hhcp-text-l)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
          {text}
        </p>
      </Container>
    </section>
  );
}
