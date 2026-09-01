import { Container } from "./Container";
import type { TileItem } from "./types";

/**
 * Feature tiles, 3 to 4 across. 8 instances. Icon + heading + line in the
 * content doc; the icon slot is a decorative dot until per-tile icons are
 * supplied with the imagery pack (onboarding item 15).
 */
export function FeatureTiles({
  heading,
  tiles,
}: {
  heading: string;
  tiles: readonly TileItem[];
}) {
  return (
    <section className="py-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <h2 className="font-dm-sans text-[length:var(--hhcp-h2)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.42px] text-[color:var(--hhcp-primary)]">
          {heading}
        </h2>
        <div className="mt-[var(--hhcp-space-l)] grid grid-cols-3 gap-[var(--hhcp-content-gap)] max-[991px]:grid-cols-2 max-[767px]:grid-cols-1">
          {tiles.map((tile) => (
            <div
              key={tile.title}
              className="flex flex-col gap-[var(--hhcp-space-xs)] rounded-[var(--hhcp-radius-l)] border border-[color:var(--hhcp-base-10)] p-[var(--hhcp-space-m)]"
            >
              <span
                aria-hidden="true"
                className="h-[10px] w-[10px] rounded-full bg-[color:var(--hhcp-action)]"
              />
              <h3 className="font-dm-sans text-[length:var(--hhcp-h4)] leading-[var(--hhcp-heading-lh)] font-medium text-[color:var(--hhcp-primary)]">
                {tile.title}
              </h3>
              <p className="font-dm-sans text-[length:var(--hhcp-text-s)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-80)]">
                {tile.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
