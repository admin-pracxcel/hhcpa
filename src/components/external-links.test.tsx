import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";

import { SiteFooter } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteFooter";
import { SiteHeader } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader";
import { isExternalHref } from "@/lib/external-link";

/**
 * Every link that leaves the site opens in a new tab.
 *
 * Rendered rather than grepped, because the hrefs come from content arrays and
 * the attributes come from a helper — neither is visible in the markup of the
 * component that renders them, and a link added to `FOOTER_COLUMNS` months
 * from now is exactly the case this has to catch.
 *
 * ⚠️ The booking portal is the deliberate exception and is not rendered by
 * either of these. A patient mid-checkout is continuing their booking, not
 * looking something up, so BookingPanel keeps it in the same tab — asserted
 * in BookingPanel.test.tsx, so the two rules cannot both drift.
 */
const CHROME: readonly (readonly [string, ReactElement])[] = [
  ["SiteFooter", <SiteFooter key="f" />],
  ["SiteHeader", <SiteHeader key="h" />],
];

const anchorsOf = (element: ReactElement) => {
  const { container } = render(element);
  return Array.from(container.querySelectorAll<HTMLAnchorElement>("a[href]"));
};

describe("links that leave the site", () => {
  it("finds the offsite links it is meant to be checking", () => {
    /* Without this the assertions below pass on an empty list. Today: the
       patient portal, three social accounts and the Pracxcel credit. */
    const external = CHROME.flatMap(([, element]) =>
      anchorsOf(element).filter((a) =>
        isExternalHref(a.getAttribute("href") ?? ""),
      ),
    );
    expect(external.length).toBeGreaterThanOrEqual(5);
  });

  it("opens every one in a new tab, with noopener", () => {
    for (const [name, element] of CHROME) {
      for (const anchor of anchorsOf(element)) {
        const href = anchor.getAttribute("href") ?? "";
        if (!isExternalHref(href)) continue;
        expect(anchor.getAttribute("target"), `${name} → ${href}`).toBe(
          "_blank",
        );
        expect(anchor.getAttribute("rel") ?? "", `${name} → ${href}`).toContain(
          "noopener",
        );
      }
    }
  });

  it("leaves tel: and mailto: in the same tab", () => {
    /*
     * target="_blank" on these opens a blank tab that stays behind once the
     * dialler or mail client takes over. There are several in the footer.
     */
    for (const [name, element] of CHROME) {
      for (const anchor of anchorsOf(element)) {
        const href = anchor.getAttribute("href") ?? "";
        if (!/^(tel|mailto):/i.test(href)) continue;
        expect(anchor.getAttribute("target"), `${name} → ${href}`).toBeNull();
      }
    }
  });
});
