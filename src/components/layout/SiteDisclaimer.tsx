import { SITE_DISCLAIMER } from "@/content/clinic";

/**
 * The site-wide disclaimer.
 *
 * Required on every page by the content specification and by the Service
 * Agreement's compliant-claims obligations. It renders from inside
 * `SiteFooter`, so no page can omit it — and `/quiz/`, which sits outside the
 * site layout, mounts it directly.
 *
 * It has been through three legibility fixes, which is the point of this note.
 * It began as --hhcp-base-20, the brand green at 20% opacity, measuring about
 * 1.1:1 on this #01221b band and effectively invisible. That became the accent
 * at 80%. Her 9 September reply then asked for it in bold, and the
 * 11 September audit found it still small, still at 80%, and sitting outside
 * the footer element altogether. It is now bold, full opacity, and inside the
 * footer. A disclaimer that is technically present and practically unreadable
 * is not a disclaimer.
 */
export function SiteDisclaimer() {
  return (
    <div className="bg-[color:var(--hhcp-dark)] px-[var(--hhcp-gutter)] py-[var(--hhcp-space-m)]">
      <p className="hhcp-container font-dm-sans text-[length:var(--hhcp-text-xs)] leading-[var(--hhcp-text-lh)] font-semibold text-[color:var(--hhcp-accent)]">
        {SITE_DISCLAIMER}
      </p>
    </div>
  );
}
