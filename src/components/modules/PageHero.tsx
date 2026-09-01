import { Container } from "./Container";
import { CLINIC } from "@/content/clinic";

/**
 * Inner-page hero: H1 + intro line + primary CTA + quiz link + tap-to-call.
 * 31 instances — one per page. The homepage keeps its video hero (`HeroSection`
 * in the cloned components); this is the flat variant every other page uses.
 *
 * The top padding reserves the 124px header, which is an absolutely-positioned
 * overlay (PAGE_TOPOLOGY.md). The homepage does not reserve it, because its
 * video hero sits under the overlay by design.
 */
export function PageHero({ h1, intro }: { h1: string; intro: string }) {
  return (
    <section className="bg-[color:var(--hhcp-primary)] pt-[calc(124px+var(--hhcp-section-space-m))] pb-[var(--hhcp-section-space-m)] px-[var(--hhcp-gutter)]">
      <Container>
        <div className="flex max-w-[880px] flex-col gap-[var(--hhcp-space-m)]">
          <h1 className="font-dm-sans text-[length:var(--hhcp-h1)] leading-[var(--hhcp-heading-lh)] font-normal tracking-[-0.64px] text-[color:var(--hhcp-white)]">
            {h1}
          </h1>
          <p className="font-dm-sans text-[length:var(--hhcp-text-l)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-action-light)]">
            {intro}
          </p>
          <div className="flex flex-wrap items-center gap-[var(--hhcp-space-s)]">
            <a href="/quiz/" className="hhcp-btn">
              Book a consultation
            </a>
            <a
              href="/quiz/"
              className="font-dm-sans text-[length:var(--hhcp-text-s)] text-[color:var(--hhcp-action)] underline"
            >
              Take the free pre-screening quiz
            </a>
            <a
              href={CLINIC.phoneHref}
              className="font-dm-sans text-[length:var(--hhcp-text-s)] text-[color:var(--hhcp-white)]"
            >
              {CLINIC.phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
