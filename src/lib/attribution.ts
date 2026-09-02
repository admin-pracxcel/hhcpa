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
