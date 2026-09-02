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
 * Reads `utm_source` from the current URL and records it. Safe to call on every
 * page: the first-touch value is only written once, and a page with no
 * `utm_source` leaves both values untouched.
 */
export function captureLeadSource(): void {
  if (typeof window === "undefined") return;

  let source = "";
  try {
    source = new URL(window.location.href).searchParams.get("utm_source") ?? "";
  } catch {
    return;
  }

  source = source.trim().slice(0, 120);
  if (source === "") return;

  if (readCookie(FIRST_TOUCH) === "") writeCookie(FIRST_TOUCH, source);
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
