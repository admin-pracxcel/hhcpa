/**
 * What the quiz tells `/quiz-book/`.
 *
 * sessionStorage, not the URL. The service and the triage level are health
 * information about the person holding the phone: in a query string they would
 * sit in browser history, in the `Referer` header of every request the next
 * page makes, and in the path of any analytics or ad pixel added later. None
 * of those are places a clinical answer belongs, and a URL is the one piece of
 * state a patient can accidentally share.
 *
 * It dies with the tab, which is the right lifetime — this exists to carry one
 * answer across one navigation.
 *
 * ─── EVERY READ FALLS THROUGH ──────────────────────────────────────────────
 *
 * Missing, malformed, stale, or refused by a private window: the page shows
 * the phone number. A patient who reaches `/quiz-book/` must always have a way
 * to book, and the wrong checkout is worse than none — so anything this is not
 * certain of returns null and the page offers a person instead.
 */

const KEY = "hhcpa:booking";

/**
 * How long a record is worth reading.
 *
 * Ten minutes covers the navigation and a slow page load with room to spare.
 * Beyond that the tab has been sitting open, and a patient returning to it
 * later should not be handed a checkout built from a quiz they have forgotten
 * taking.
 */
const MAX_AGE_MS = 10 * 60 * 1000;

export interface BookingHandoff {
  readonly service: string;
  readonly onlineDoctorKind?: string;
  /** "green" or "amber". Red never reaches this page. */
  readonly level: string;
  readonly prescriptionFee?: number | null;
  /** `Date.now()` at the moment the quiz wrote it. */
  readonly at: number;
}

/** Writes the record. Silent on failure — a booking page is not worth an error. */
export function writeBookingHandoff(
  value: Omit<BookingHandoff, "at">,
): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({ ...value, at: Date.now() }),
    );
  } catch {
    /* Private browsing, a full quota, or storage disabled. The page copes. */
  }
}

/** The raw string, for `useSyncExternalStore`. `null` when there is nothing. */
export function readBookingHandoffRaw(): string | null {
  try {
    return window.sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function clearBookingHandoff(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* Nothing to do. A stale record expires on its own. */
  }
}

/**
 * Parses a record, or returns null for anything it cannot vouch for.
 *
 * Validated field by field rather than cast. This string is the one input to
 * the page that decides what a patient is charged, it survives a reload, and
 * nothing stops a person editing it — so it is treated as untrusted, like any
 * other value that arrives from the client side.
 */
export function parseBookingHandoff(
  raw: string | null | undefined,
): BookingHandoff | null {
  if (raw === null || raw === undefined || raw === "") return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;

  const record = parsed as Record<string, unknown>;
  const service = record.service;
  const level = record.level;
  const at = record.at;

  if (typeof service !== "string" || service === "") return null;
  if (typeof level !== "string" || level === "") return null;
  if (typeof at !== "number" || !Number.isFinite(at)) return null;
  /* A clock that moved, or a record from another day. */
  if (Date.now() - at > MAX_AGE_MS || at > Date.now() + 60_000) return null;

  const kind = record.onlineDoctorKind;
  const fee = record.prescriptionFee;

  return {
    service,
    level,
    at,
    onlineDoctorKind: typeof kind === "string" && kind !== "" ? kind : undefined,
    prescriptionFee: typeof fee === "number" ? fee : null,
  };
}
