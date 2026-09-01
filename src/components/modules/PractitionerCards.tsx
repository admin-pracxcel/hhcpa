import Image from "next/image";
import { Container } from "./Container";
import type { Practitioner } from "./types";

/**
 * Practitioner profile cards.
 *
 * Clause 6.5 of the Service Agreement requires the AHPRA registration number on
 * all practitioner-identifying content. A missing number renders a visible
 * placeholder and sets `data-ahpra-missing`, so an incomplete profile cannot
 * ship quietly.
 */
export function PractitionerCards({
  heading,
  practitioners,
}: {
  heading: string;
  practitioners: readonly Practitioner[];
}) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
          {heading}
        </h2>
        <div className="mt-[var(--hhcp-space-l)] grid grid-cols-3 gap-[var(--hhcp-content-gap)] max-[991px]:grid-cols-2 max-[767px]:grid-cols-1">
          {practitioners.map((person) => {
            const missing = person.ahpraNumber.trim() === "";
            return (
              <article
                key={person.name}
                data-ahpra-missing={missing}
                className="flex flex-col gap-[var(--hhcp-space-xs)] rounded-[var(--hhcp-radius-l)] border border-[color:var(--hhcp-base-10)] p-[var(--hhcp-space-m)]"
              >
                {person.photo ? (
                  <Image
                    src={person.photo.src}
                    alt={person.photo.alt}
                    width={person.photo.width}
                    height={person.photo.height}
                    className="h-auto w-full rounded-[var(--hhcp-radius-m)] object-cover"
                  />
                ) : null}
                <h3 className="font-dm-sans text-[length:var(--hhcp-h4)] font-medium text-[color:var(--hhcp-primary)]">
                  {person.name}
                </h3>
                <p className="font-dm-sans text-[length:var(--hhcp-text-s)] text-[color:var(--hhcp-base-80)]">
                  {person.title}
                </p>
                <p className="font-roboto-mono text-[length:var(--hhcp-text-xs)] text-[color:var(--hhcp-base-60)]">
                  {missing
                    ? "AHPRA registration number required before publication"
                    : `AHPRA: ${person.ahpraNumber}`}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {person.focusAreas.map((area) => (
                    <li
                      key={area}
                      className="rounded-[var(--hhcp-radius-pill)] bg-[color:var(--hhcp-accent)] px-3 py-1 font-dm-sans text-[length:var(--hhcp-text-xs)] text-[color:var(--hhcp-primary)]"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
