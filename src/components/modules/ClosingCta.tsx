import { Container } from "./Container";
import { CLINIC } from "@/content/clinic";

/**
 * The standard closing CTA band. 29 instances — every page but the quiz itself.
 * The sticky mobile CTA bar that the content doc pairs with this lives in the
 * layout, not here, so it renders once per page rather than once per band.
 */
export function ClosingCta({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  return (
    <section className="bg-[color:var(--hhcp-dark)] py-[var(--hhcp-section-space-l)] px-[var(--hhcp-gutter)]">
      <Container>
        <div className="flex max-w-[720px] flex-col gap-[var(--hhcp-space-m)]">
          <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-white)]">
            {heading}
          </h2>
          <p className="font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-action-light)]">
            {body}
          </p>
          <div className="flex flex-wrap gap-[var(--hhcp-space-s)]">
            <a href="/quiz/" className="hhcp-btn">
              Start the free quiz
            </a>
            <a
              href={CLINIC.phoneHref}
              className="font-dm-sans text-[length:var(--hhcp-text-s)] font-medium text-[color:var(--hhcp-action)] underline"
            >
              Call {CLINIC.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
