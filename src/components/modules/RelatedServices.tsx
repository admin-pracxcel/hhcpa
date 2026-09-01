import { Container } from "./Container";
import { ArrowRightIcon } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";
import type { LinkRef } from "./types";

/**
 * Related-service link cards, 2 to 3 across. 16 instances. This is the site's
 * internal-linking workhorse — the SEO silo structure depends on it.
 */
export function RelatedServices({
  heading,
  links,
}: {
  heading: string;
  links: readonly LinkRef[];
}) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
          {heading}
        </h2>
        <div className="mt-[var(--hhcp-space-l)] grid grid-cols-3 gap-[var(--hhcp-content-gap)] max-[991px]:grid-cols-2 max-[767px]:grid-cols-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-[var(--hhcp-space-xs)] rounded-[var(--hhcp-radius-l)] border border-[color:var(--hhcp-base-10)] p-[var(--hhcp-space-m)] transition-all duration-300 hover:border-[color:var(--hhcp-action-dark)]"
            >
              <span className="flex items-center gap-2 font-dm-sans text-[length:var(--hhcp-h4)] font-medium text-[color:var(--hhcp-primary)]">
                {link.label}
                <ArrowRightIcon className="h-4 w-4" />
              </span>
              {link.body ? (
                <span className="font-dm-sans text-[length:var(--hhcp-text-s)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
                  {link.body}
                </span>
              ) : null}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
