import { CLINIC } from "@/content/clinic";

/**
 * Book + tap-to-call bar, fixed to the bottom of the viewport at ≤767px.
 *
 * The content doc pairs this with every closing CTA band (29 pages). Rendering
 * it from the layout gives one instance per page regardless of how many bands
 * the page carries.
 *
 * Its height is pinned to `--hhcp-sticky-cta-h` rather than left to its own
 * padding, because the hero subtracts that token from its height to fill the
 * screen exactly. A bar that sized itself would put the two out of step.
 *
 * This is `position: fixed` only — no scroll listener, no IntersectionObserver.
 * See AGENTS.md.
 */
export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex h-[var(--hhcp-sticky-cta-h)] items-center gap-2 border-t border-[color:var(--hhcp-base-20)] bg-[color:var(--hhcp-white)] px-3 min-[768px]:hidden">
      <a href="/quiz/" className="hhcp-btn flex-1 text-center">
        Book a consultation
      </a>
      <a
        href={CLINIC.phoneHref}
        className="flex-1 rounded-[var(--hhcp-radius-pill)] border border-[color:var(--hhcp-primary)] py-3 text-center font-dm-sans text-[length:var(--hhcp-text-s)] font-medium text-[color:var(--hhcp-primary)]"
      >
        Call us
      </a>
    </div>
  );
}
