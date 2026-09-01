import { Container } from "./Container";
import { PRICES, formatPrice, type PriceKey } from "@/content/pricing";

/**
 * Pricing cue card. 8 instances.
 *
 * Reads from the single pricing source rather than carrying its own figure, so
 * the outstanding client confirmations resolve in one edit. `data-provisional`
 * marks any figure not yet confirmed in writing — a review hook, not a visual.
 */
export function PricingCue({
  heading,
  body,
  priceKey,
  note,
}: {
  heading: string;
  body: string;
  priceKey: PriceKey;
  note?: string;
}) {
  const price = PRICES[priceKey];
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <div
          data-provisional={price.provisional}
          className="flex flex-col gap-[var(--hhcp-space-s)] rounded-[var(--hhcp-radius-l)] border border-[color:var(--hhcp-base-20)] p-[var(--hhcp-space-l)]"
        >
          <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
            {heading}
          </h2>
          <p className="font-roboto-mono text-[length:var(--hhcp-h1)] leading-[var(--hhcp-heading-lh)] font-medium text-[color:var(--hhcp-primary)]">
            {formatPrice(priceKey)}
          </p>
          <p className="font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
            {body}
          </p>
          {note ? (
            <p className="font-dm-sans text-[length:var(--hhcp-text-xs)] text-[color:var(--hhcp-base-60)]">
              {note}
            </p>
          ) : null}
          <a href="/pricing/" className="hhcp-btn self-start">
            See full pricing
          </a>
        </div>
      </Container>
    </section>
  );
}
