/**
 * The three lead fields every form on the site carries.
 *
 * They were being assembled by hand at each call site, which is how the quiz,
 * the discharge form and the intake form ended up sending different subsets of
 * them — and the intake form sending none at all. One helper, called by every
 * form, so a new form cannot be added without them.
 *
 *   Lead country  where the visitor is, guessed from the browser. Not where
 *                 they dial: someone in Australia may give a UK mobile, and
 *                 the phone fields carry that separately.
 *   Lead source   the `utm_source` they first arrived with, kept in a cookie
 *                 so it survives the walk from the landing page to the form.
 *                 See lib/attribution.ts for why there are two of them.
 *   Lead date     NOT here. It is stamped server-side, in the API route, and
 *                 deliberately not collected in the browser — a client clock
 *                 can be wrong, in another timezone, or edited. See
 *                 `aestDate`/`aestDateTime`, which every route calls.
 *
 * Client-only: it reads cookies and the browser's timezone. Calling it during
 * a server render returns the defaults, which is harmless because every caller
 * runs inside a submit handler.
 */

import { findCountry, guessCountry } from "@/content/countries";
import { getLeadSource } from "./attribution";

export interface LeadFields {
  readonly leadCountry: string;
  readonly leadCountryName: string;
  readonly leadSource: string;
  readonly leadSourceLatest: string;
  readonly pagePath: string;
}

export function getLeadFields(): LeadFields {
  const visitor = findCountry(guessCountry());
  return {
    leadCountry: visitor.code,
    leadCountryName: visitor.name,
    ...getLeadSource(),
    pagePath: typeof window === "undefined" ? "" : window.location.pathname,
  };
}
