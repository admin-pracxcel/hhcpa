/**
 * The whole 404 page — chrome included.
 *
 * Used by `app/not-found.tsx` only, and it exists because that file has no
 * chrome of its own to inherit: `(site)` is a route group, so a URL that matched
 * nothing never entered the segment and `(site)/layout.tsx` never runs. Without
 * this the 404 would be a paragraph on a blank page with no way out.
 *
 * `(site)/not-found.tsx` is the opposite case and renders `NotFoundPanel`
 * directly — it *is* inside that layout, and rendering this shell there put two
 * headers, two footers and two `<main>` elements on the page.
 *
 * Two pieces of the site layout are deliberately left off. `AttributionCapture`,
 * because a dead URL is not a campaign landing and should not overwrite a stored
 * utm_source. And `StickyMobileCta`, because "book a consultation" is not the
 * next step for someone who has just hit a broken link.
 */

import { NotFoundPanel } from "./NotFoundPanel";
import { SiteDisclaimer } from "../layout/SiteDisclaimer";
import { SiteFooter } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter";
import { SiteHeader } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader";

export function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main id="brx-content">
        <NotFoundPanel />
      </main>
      <SiteFooter />
      <SiteDisclaimer />
    </>
  );
}
