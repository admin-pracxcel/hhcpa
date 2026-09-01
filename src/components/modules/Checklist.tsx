import { Container } from "./Container";
import { CheckCircleIcon } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

/**
 * Eligibility checklist / icon list — "this may suit you if…". 19 instances.
 *
 * `outro` carries the counterweight the content doc always pairs with these
 * lists ("A consultation may not be the right step if…"), which is a compliance
 * requirement as much as a copy one: eligibility lists must not read as
 * qualification promises.
 */
export function Checklist({
  heading,
  intro,
  items,
  outro,
}: {
  heading: string;
  intro?: string;
  items: readonly string[];
  outro?: string;
}) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
          {heading}
        </h2>
        {intro ? (
          <p className="mt-[var(--hhcp-space-s)] font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
            {intro}
          </p>
        ) : null}
        <ul className="mt-[var(--hhcp-space-m)] flex flex-col gap-[var(--hhcp-space-s)]">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircleIcon className="mt-1 h-5 w-5 shrink-0 text-[color:var(--hhcp-action-dark)]" />
              <span className="font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
                {item}
              </span>
            </li>
          ))}
        </ul>
        {outro ? (
          <p className="mt-[var(--hhcp-space-m)] font-dm-sans text-[length:var(--hhcp-text-m)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-60)]">
            {outro}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
