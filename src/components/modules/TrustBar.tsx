import { Container } from "./Container";
import { TRUST_BAR_DEFAULT } from "@/content/clinic";

/**
 * The five-item trust strip that repeats under most hero sections. 24 instances.
 * Pages override the items where the content doc gives them a service-specific
 * variant (e.g. the weight-loss page swaps in "Ongoing review, not one-off scripts").
 */
export function TrustBar({ items = TRUST_BAR_DEFAULT }: { items?: readonly string[] }) {
  return (
    <section className="bg-[color:var(--hhcp-accent)] py-[var(--hhcp-space-s)] px-[var(--hhcp-gutter)]">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-[var(--hhcp-space-m)] gap-y-2">
          {items.map((item) => (
            <li
              key={item}
              className="font-dm-sans text-[length:var(--hhcp-text-xs)] text-[color:var(--hhcp-primary)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
