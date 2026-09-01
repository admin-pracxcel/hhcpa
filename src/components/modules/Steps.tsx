import { Container } from "./Container";
import type { StepItem } from "./types";

/**
 * Numbered step cards. 26 instances. Horizontal on desktop, stacked at ≤767px,
 * per the content doc's module annotation.
 */
export function Steps({
  heading,
  steps,
}: {
  heading: string;
  steps: readonly StepItem[];
}) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
          {heading}
        </h2>
        <ol className="mt-[var(--hhcp-space-l)] grid grid-cols-4 gap-[var(--hhcp-content-gap)] max-[991px]:grid-cols-2 max-[767px]:grid-cols-1">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-[var(--hhcp-space-s)] rounded-[var(--hhcp-radius-l)] bg-[color:var(--hhcp-accent)] p-[var(--hhcp-space-m)]"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--hhcp-action)] font-roboto-mono text-[length:var(--hhcp-text-s)] font-medium text-[color:var(--hhcp-primary)]"
              >
                {index + 1}
              </span>
              <h3 className="font-dm-sans text-[length:var(--hhcp-h4)] leading-[var(--hhcp-heading-lh)] font-medium text-[color:var(--hhcp-primary)]">
                {step.title}
              </h3>
              <p className="font-dm-sans text-[length:var(--hhcp-text-s)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
