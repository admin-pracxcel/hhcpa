import { SITE_DISCLAIMER } from "@/content/clinic";

/**
 * The site-wide disclaimer.
 *
 * Required on every page by the content specification and by the Service
 * Agreement's compliant-claims obligations. It renders from the layout, not from
 * page data, so no page can omit it.
 */
export function SiteDisclaimer() {
  return (
    <div className="bg-[color:var(--hhcp-dark)] px-[var(--hhcp-gutter)] py-[var(--hhcp-space-m)]">
      <p className="hhcp-container font-dm-sans text-[length:var(--hhcp-text-xs)] leading-[var(--hhcp-text-lh)] text-[color:var(--hhcp-base-20)]">
        {SITE_DISCLAIMER}
      </p>
    </div>
  );
}
