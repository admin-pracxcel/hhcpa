/**
 * Practitioner cards.
 *
 * ⚠️ A card without an AHPRA registration number is not rendered. AHPRA's
 * Guidelines for advertising a regulated health service require that when a
 * practitioner is named in advertising, their registration is verifiable, and
 * the content document calls this "the single most important compliance fix on
 * the site". The filter is here, in the component, so the rule holds however
 * the data is edited later — a page cannot name a practitioner by adding a
 * record and forgetting the number.
 *
 * With no practitioners to list, the section renders its empty state rather
 * than disappearing: the page says plainly that profiles are published as
 * clinicians are onboarded, which is true and better than a blank space.
 */

import { cn } from "@/lib/utils";

const STYLES = `
.hhcp-pc-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-pc-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-pc-heading {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-pc-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hhcp-pc-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-pc-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pc-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pc-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.hhcp-pc-card {
  flex: 0 1 calc((100% - 40px) / 3);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #d6e8e1;
}

.hhcp-pc-photo {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  /* Faces sit high in a portrait crop; centring them cuts the forehead. */
  object-position: 50% 22%;
  border-radius: 10px;
  background: var(--hhcp-accent, #f5fff9);
}

.hhcp-pc-photo[data-fallback="true"] {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif;
  font-size: 44px;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
  border: 1px solid #d6e8e1;
}

.hhcp-pc-focus-label {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pc-focus {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding-left: 18px;
  list-style: disc;
  font-size: 14px;
  line-height: 1.5;
  color: #526f68;
}

.hhcp-pc-name {
  font-size: 20px;
  line-height: 1.3;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pc-role {
  font-size: 14px;
  color: #526f68;
}

.hhcp-pc-ahpra {
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(1, 49, 39, 0.08);
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pc-bio {
  font-size: 14px;
  line-height: 1.5;
  color: #526f68;
}

.hhcp-pc-empty {
  padding: var(--hhcp-space-l, 45px);
  border-radius: 12px;
  background: var(--hhcp-accent, #f5fff9);
  border: 1px solid #d6e8e1;
  font-size: var(--hhcp-text-l, 21.328px);
  line-height: 1.6;
  color: var(--hhcp-primary, #013126);
}

@media (max-width: 900px) {
  .hhcp-pc-card {
    flex-basis: calc((100% - 20px) / 2);
  }
}

@media (max-width: 600px) {
  .hhcp-pc-card {
    flex-basis: 100%;
  }

  .hhcp-pc-empty {
    padding: var(--hhcp-space-m, 30px);
    font-size: var(--hhcp-text-m, 16px);
  }
}
`;

export interface Practitioner {
  readonly name: string;
  readonly title: string;
  /** Required. A practitioner without one is not rendered. */
  readonly ahpraNumber: string;
  /**
   * Optional, and left out rather than written for someone who has not
   * supplied one. A bio invented for a named clinician is a claim about a real
   * person made by whoever typed it.
   */
  readonly bio?: string;
  /** Headshot under /images/. Optional: one practitioner has not supplied one. */
  readonly photo?: string;
  /** What they consult on, as supplied. Optional for the same reason as `bio`. */
  readonly focusAreas?: readonly string[];
}

interface PractitionerCardsProps {
  className?: string;
  eyebrow: string;
  heading: string;
  practitioners: readonly Practitioner[];
  emptyMessage: string;
}

/** "Dr Ines Fernandes" -> "IF". Drops the honorific, keeps two letters. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((part) => !/^(dr|mr|mrs|ms|miss)\.?$/i.test(part))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function PractitionerCards({
  className,
  eyebrow,
  heading,
  practitioners,
  emptyMessage,
}: PractitionerCardsProps) {
  const publishable = practitioners.filter(
    (person) => person.ahpraNumber.trim() !== "",
  );

  return (
    <section className={cn("hhcp-pc-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-pc-container">
        <div className="hhcp-pc-heading">
          <div className="hhcp-pc-eyebrow">
            <span className="hhcp-pc-dot" />
            <span className="hhcp-pc-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>
          <h2 className="hhcp-pc-title font-dm-sans">{heading}</h2>
        </div>

        {publishable.length === 0 ? (
          <p className="hhcp-pc-empty font-dm-sans">{emptyMessage}</p>
        ) : (
          <div className="hhcp-pc-grid">
            {publishable.map((person) => (
              <article key={person.ahpraNumber} className="hhcp-pc-card">
                {/*
                  A card without a headshot keeps its initials in the same
                  box rather than collapsing, so one missing photo does not
                  leave a row of cards at two different heights.

                  Decorative: the name is directly beneath it in text, so a
                  screen reader announcing the photograph as well would only
                  repeat it.
                */}
                {person.photo === undefined ? (
                  <div className="hhcp-pc-photo" data-fallback="true" aria-hidden="true">
                    {initials(person.name)}
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="hhcp-pc-photo"
                    src={person.photo}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    aria-hidden="true"
                  />
                )}
                <h3 className="hhcp-pc-name font-dm-sans">{person.name}</h3>
                <p className="hhcp-pc-role font-dm-sans">{person.title}</p>
                <p className="hhcp-pc-ahpra">{`AHPRA ${person.ahpraNumber}`}</p>
                {person.bio !== undefined && (
                  <p className="hhcp-pc-bio font-dm-sans">{person.bio}</p>
                )}
                {person.focusAreas !== undefined &&
                  person.focusAreas.length > 0 && (
                    <>
                      <p className="hhcp-pc-focus-label font-dm-sans">
                        Consults on
                      </p>
                      <ul className="hhcp-pc-focus font-dm-sans">
                        {person.focusAreas.map((area) => (
                          <li key={area}>{area}</li>
                        ))}
                      </ul>
                    </>
                  )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
