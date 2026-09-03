import { SITE_DISCLAIMER } from "@/content/clinic";

/**
 * The site-wide disclaimer.
 *
 * Required on every page by the content specification and by the Service
 * Agreement's compliant-claims obligations. It renders from the layout, not from
 * page data, so no page can omit it.
 *
 * The text was --hhcp-base-20, which is the brand green at 20% opacity — on
 * this band, which is #01221b, that came out at about 1.1:1 against its own
 * background and was effectively invisible. A disclaimer nobody can read is not
 * a disclaimer. It is now the accent at 80%, the same treatment the live site
 * gives it, which measures near 10:1.
 */
export function SiteDisclaimer() {
  return (
    <div className="bg-[color:var(--hhcp-dark)] px-[var(--hhcp-gutter)] py-[var(--hhcp-space-m)]">
      <p className="hhcp-container font-dm-sans text-[length:var(--hhcp-text-xs)] leading-[var(--hhcp-text-lh)] text-[color:rgba(245,255,249,0.8)]">
        {SITE_DISCLAIMER}
      </p>
    </div>
  );
}
