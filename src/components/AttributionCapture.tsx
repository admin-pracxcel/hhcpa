"use client";

/**
 * Records `utm_source` on every page load.
 *
 * Rendered once from the site layout, so a visitor who lands on an ad and then
 * clicks through to three service pages before filling in the contact form
 * still submits with the campaign that brought them. Reading it only on the
 * contact page would lose the source for almost every real lead.
 *
 * It renders nothing. The effect is the point: this is writing to an external
 * system — the cookie jar — rather than deriving state, which is exactly what
 * effects are for.
 */

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { captureLeadSource } from "@/lib/attribution";

export function AttributionCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    captureLeadSource();
    /* Client-side navigation changes the URL without remounting, so the
       campaign on a later page would otherwise be missed. */
  }, [pathname, searchParams]);

  return null;
}
