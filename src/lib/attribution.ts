/**
 * Lead-source attribution.
 *
 * `utm_source` arrives on one URL and is gone the moment the visitor clicks
 * through to another page, so it is read on load and kept in a cookie. Without
 * that, a lead who lands on an ad, reads two service pages and then fills in
 * the contact form arrives at n8n with no source at all — which is most of
 * them.
 *
 * Both a first-touch and a last-touch value are kept, because the two answer
 * different questions and picking one here would be guessing which one the
 * business wants:
 *
 *   - `leadSource` is the first campaign that ever brought this browser to the
 *     site, and is never overwritten. It answers "what won this lead".
 *   - `leadSourceLatest` is the campaign on the visit where the form was
 *     submitted. It answers "what brought them back to convert".
 *
 * A cookie rather than localStorage: it is the same lifetime, it survives a
 * subdomain move, and it is the thing an analytics stack already expects to
 * find. Not httpOnly, because the page has to read it back to submit it.
 *
 * Nothing here identifies a person. It is a campaign label the visitor arrived
 * with, so it carries no privacy weight of its own — but note the Privacy
 * Policy's tracking section, which currently describes cookies this site does
 * not set. See `content/legal.ts`.
 */

const FIRST_TOUCH = "hhcp_lead_source";
const LAST_TOUCH = "hhcp_lead_source_latest";
/* The full attribution set the quiz payload carries (spec §6.2). */
const ATTRIBUTION = "hhcp_attribution";

/** Click ids and campaign parameters, captured once and kept. */
const TRACKED = [
  "gclid",
  "wbraid",
  "gbraid",
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** 90 days: long enough to cover a considered health decision. */
const MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : "";
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

/**
 * The label a visit from a search engine is recorded under.
 *
 * Deliberately a weak value: it is the only source a later paid visit is
 * allowed to overwrite. See `captureLeadSource`.
 */
const ORGANIC = "organic";

/**
 * Sources that outrank `organic` on first touch.
 *
 * A paid click that brings back someone who first found the site through
 * search is what actually won that lead, so it replaces the placeholder.
 * Nothing replaces a source that is already one of these — first touch among
 * real campaigns still wins.
 */
const PAID_SOURCES: ReadonlySet<string> = new Set([
  "google_ads",
  "meta_ads",
  /* The tag HHCPA's Meta campaigns actually carry, added 2026-11-09.
     Both spellings are live, so both are listed rather than one being
     rewritten into the other — the stored value stays whatever the URL
     said, which is what n8n and the reports already key on. */
  "metaads",
  "microsoft_ads",
  "bing_ads",
  "linkedin_ads",
  "tiktok_ads",
]);

/**
 * Marks this visit as already classified. A session cookie, with no max-age,
 * so it dies with the tab.
 *
 * ⚠️ Without it, referrer-derived attribution corrupts paid visits.
 *
 * `document.referrer` is set when the document loads and does not change on a
 * client-side navigation, and this runs on every route change. So a visitor
 * who arrives from a Google ad on page one still has a google.com referrer on
 * page two — where the URL no longer carries the click id — and would be
 * reclassified as organic, overwriting the paid source that brought them.
 *
 * With it, the referrer is read once per visit and ignored thereafter. A
 * campaign parameter in the URL is still honoured whenever one appears,
 * because that is an explicit signal rather than an inference.
 */
const VISIT = "hhcp_visit";

/** Hosts whose referrals are search results rather than campaigns. */
const SEARCH_HOSTS: readonly RegExp[] = [
  /(^|\.)google\./,
  /(^|\.)bing\./,
  /(^|\.)duckduckgo\./,
  /(^|\.)yahoo\./,
  /(^|\.)ecosia\./,
  /(^|\.)brave\.com$/,
  /(^|\.)search\.brave\.com$/,
  /(^|\.)startpage\./,
  /(^|\.)qwant\./,
  /(^|\.)baidu\./,
  /(^|\.)yandex\./,
];

/** Our own site, in every spelling it answers to. */
const OWN_HOSTS: readonly string[] = [
  "horizonhealthcarepartners.com.au",
  "www.horizonhealthcarepartners.com.au",
];

function isSearchReferrer(referrer: string): boolean {
  if (referrer === "") return false;
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return false;
  }
  /* An internal link is not a referral. */
  if (OWN_HOSTS.includes(host)) return false;
  return SEARCH_HOSTS.some((pattern) => pattern.test(host));
}

/**
 * What brought this page view, in order of how much the signal can be trusted.
 *
 * 1. `utm_source`, which is someone stating it outright.
 * 2. A Google Ads click id. `gclid`, `wbraid` and `gbraid` are only ever set
 *    by Google Ads, so a visit carrying one is paid even though its referrer
 *    is google.com — which is exactly the case that would otherwise be
 *    mislabelled organic, and the reason this order is not alphabetical.
 * 3. A search engine referrer, inferred, and only on the first page of a
 *    visit.
 *
 * `fbclid` is deliberately NOT treated as paid. Facebook and Instagram add it
 * to any outbound link, including organic posts, so it cannot tell a paid
 * click from someone sharing a page. Meta campaigns need `utm_source=meta_ads`
 * on the destination URL to be recorded as paid.
 */
function sourceForThisView(params: URLSearchParams): string {
  const utm = (params.get("utm_source") ?? "").trim();
  if (utm !== "") return utm.slice(0, 120);

  for (const id of ["gclid", "wbraid", "gbraid"]) {
    if ((params.get(id) ?? "").trim() !== "") return "google_ads";
  }

  /* Inferred, so only once per visit — see VISIT. */
  if (readCookie(VISIT) !== "") return "";
  if (typeof document !== "undefined" && isSearchReferrer(document.referrer)) {
    return ORGANIC;
  }
  return "";
}

/**
 * Reads `utm_source` from the current URL and records it. Safe to call on every
 * page: the first-touch value is only written once, and a page with no
 * `utm_source` leaves both values untouched.
 */
export function captureLeadSource(): void {
  if (typeof window === "undefined") return;

  let params: URLSearchParams;
  try {
    params = new URL(window.location.href).searchParams;
  } catch {
    return;
  }

  const source = sourceForThisView(params);

  /* Mark the visit classified either way, so the referrer is read once. */
  if (typeof document !== "undefined" && readCookie(VISIT) === "") {
    document.cookie = `${VISIT}=1; path=/; SameSite=Lax`;
  }

  if (source === "") return;

  /*
   * ─── FIRST TOUCH ────────────────────────────────────────────────────────
   *
   * Written once and then left alone, with one exception: `organic` is a
   * placeholder for "found us through search", and a paid click that brings
   * that person back is what actually won the lead, so it replaces it.
   *
   * Nothing else is ever overwritten. A second organic visit does not
   * displace the first, and one paid campaign does not displace another —
   * among real campaigns, first touch still wins.
   */
  const existing = readCookie(FIRST_TOUCH);
  if (existing === "" || (existing === ORGANIC && PAID_SOURCES.has(source))) {
    writeCookie(FIRST_TOUCH, source);
  }

  /* Last touch is the visit that converted, so it always moves. */
  writeCookie(LAST_TOUCH, source);
}

/**
 * Captures the wider attribution set, plus the landing page and referrer.
 *
 * Written once per browser and never overwritten: the landing page and
 * referrer only mean anything for the visit that first arrived, and a later
 * page would otherwise overwrite them with an internal URL.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  if (readCookie(ATTRIBUTION) !== "") return;

  let params: URLSearchParams;
  try {
    params = new URL(window.location.href).searchParams;
  } catch {
    return;
  }

  const captured: Record<string, string> = {};
  for (const key of TRACKED) {
    const value = params.get(key);
    if (value !== null && value.trim() !== "") {
      captured[key] = value.trim().slice(0, 200);
    }
  }

  captured.landingPage = window.location.pathname.slice(0, 200);
  captured.referrer = (document.referrer || "").slice(0, 300);

  /* Only worth storing if the visit actually carried a campaign or a referrer. */
  const meaningful =
    Object.keys(captured).some((key) => TRACKED.includes(key as never)) ||
    captured.referrer !== "";
  if (!meaningful) return;

  try {
    writeCookie(ATTRIBUTION, JSON.stringify(captured));
  } catch {
    /* Over the cookie size limit; the lead-source cookies still carry the source. */
  }
}

export function getAttribution(): Record<string, string> {
  const raw = readCookie(ATTRIBUTION);
  if (raw === "") return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

export interface LeadSource {
  readonly leadSource: string;
  readonly leadSourceLatest: string;
}

export function getLeadSource(): LeadSource {
  return {
    leadSource: readCookie(FIRST_TOUCH),
    leadSourceLatest: readCookie(LAST_TOUCH),
  };
}
