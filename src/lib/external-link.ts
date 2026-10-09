/**
 * Whether a link leaves the site, and what to put on it when it does.
 *
 * Offsite links open in a new tab. The decision is made from the href rather
 * than remembered at each call site, because the hrefs live in content arrays
 * — `FOOTER_COLUMNS`, the social row, the nav — and a link added there months
 * from now should not depend on whoever adds it also knowing this rule.
 *
 * ─── WHAT COUNTS AS LEAVING ────────────────────────────────────────────────
 *
 * Only `http:` and `https:` to another host. Not `tel:` or `mailto:`, which
 * hand off to an app and would open a blank tab behind it; not an anchor or a
 * site-relative path; and not our own domain written out in full, which is
 * still this site however it is spelled.
 *
 * ─── THE PORTAL IS DELIBERATELY NOT HERE ───────────────────────────────────
 *
 * `portal.horizonhealthcarepartners.com.au` is offsite by every test above and
 * still opens in the same tab. A patient clicking a checkout button is not
 * going to look at something and come back — they are continuing the booking
 * they started, and the page they leave has done its job. A new tab there
 * costs them the back button, and on a phone it is a second window they did
 * not ask for in the middle of paying. See `checkoutUrl` in
 * lib/checkout-products.ts, which builds those links itself and does not call
 * this.
 */

/** Our own site, however it is spelled. */
const OWN_HOSTS: readonly string[] = [
  "horizonhealthcarepartners.com.au",
  "www.horizonhealthcarepartners.com.au",
];

export function isExternalHref(href: string): boolean {
  if (href === "") return false;
  /* Anything that is not http(s) — tel:, mailto:, #anchor, /path — stays put. */
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    return !OWN_HOSTS.includes(new URL(href).host.toLowerCase());
  } catch {
    /* Not parseable as a URL, so not something to open in a new tab. */
    return false;
  }
}

export interface ExternalLinkProps {
  readonly target?: "_blank";
  readonly rel?: string;
}

/**
 * Spread onto an `<a>`. Returns nothing for an internal link, so the same
 * call site serves both.
 *
 * `noopener` stops the opened page reaching back through `window.opener`.
 * `noreferrer` keeps our URL out of its referrer — this is a health site, and
 * the page a patient came from is itself an inference about them.
 */
export function externalLinkProps(href: string): ExternalLinkProps {
  if (!isExternalHref(href)) return {};
  return { target: "_blank", rel: "noopener noreferrer" };
}
