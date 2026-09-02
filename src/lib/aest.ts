/**
 * Timestamps in AEST.
 *
 * `Australia/Brisbane`, not `Australia/Sydney`. Sydney observes daylight saving
 * and spends roughly half the year on AEDT (+11), so stamping "AEST" from a
 * Sydney zone would silently be an hour out for months at a time. Brisbane is
 * +10 all year, which is what AEST means.
 *
 * These run on the server. A browser clock can be wrong, in another zone, or
 * simply edited, and the submission time on a lead record is the sort of thing
 * that ends up in a dispute about the Clause 1.2 patient quota.
 */

const ZONE = "Australia/Brisbane";

function parts(date: Date): Record<string, string> {
  const formatter = new Intl.DateTimeFormat("en-AU", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
}

/** `2026-09-02` — the format the brief asked for. */
export function aestDate(date: Date = new Date()): string {
  const p = parts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

/** `2026-09-02 14:35:07 +10:00` — the same instant, with the time kept. */
export function aestDateTime(date: Date = new Date()): string {
  const p = parts(date);
  /* 24-hour formatting renders midnight as "24" in some ICU versions. */
  const hour = p.hour === "24" ? "00" : p.hour;
  return `${p.year}-${p.month}-${p.day} ${hour}:${p.minute}:${p.second} +10:00`;
}
