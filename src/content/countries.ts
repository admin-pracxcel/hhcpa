/**
 * Country dialling codes for the phone field.
 *
 * Not an exhaustive ISO list. The clinic is Australia-only, so this covers
 * Australia first and then the countries an Australian patient is realistically
 * dialling from — travellers, expats, and the migration corridors that make up
 * most of the population. A 200-entry list would be worse: a longer scroll for
 * no one's benefit.
 *
 * `example` is a real-shaped national number for that country, used as the
 * field's placeholder so the format changes with the selection. It is written
 * without the dial code, because the selector already carries that.
 *
 * `zones` are IANA timezones that imply the country. They are how the field
 * guesses where the visitor is without an IP lookup — no third-party request,
 * nothing to disclose in a privacy policy, and it works offline.
 */

export interface Country {
  /** ISO 3166-1 alpha-2. */
  readonly code: string;
  readonly name: string;
  /** Including the leading +. */
  readonly dial: string;
  readonly flag: string;
  /** National-format example, no dial code. */
  readonly example: string;
  readonly zones?: readonly string[];
}

export const COUNTRIES: readonly Country[] = [
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺", example: "412 345 678", zones: ["Australia/"] },
  { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿", example: "21 123 4567", zones: ["Pacific/Auckland", "Pacific/Chatham"] },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧", example: "7400 123456", zones: ["Europe/London", "Europe/Belfast"] },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸", example: "(201) 555-0123", zones: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Phoenix", "America/Anchorage", "Pacific/Honolulu", "America/Detroit"] },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦", example: "506 234-5678", zones: ["America/Toronto", "America/Vancouver", "America/Edmonton", "America/Winnipeg", "America/Halifax", "America/St_Johns"] },
  { code: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪", example: "85 012 3456", zones: ["Europe/Dublin"] },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳", example: "81234 56789", zones: ["Asia/Kolkata", "Asia/Calcutta"] },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳", example: "131 2345 6789", zones: ["Asia/Shanghai", "Asia/Chongqing", "Asia/Urumqi"] },
  { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭", example: "905 123 4567", zones: ["Asia/Manila"] },
  { code: "NP", name: "Nepal", dial: "+977", flag: "🇳🇵", example: "984 1234567", zones: ["Asia/Kathmandu", "Asia/Katmandu"] },
  { code: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳", example: "91 234 56 78", zones: ["Asia/Ho_Chi_Minh", "Asia/Saigon"] },
  { code: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩", example: "812 345 678", zones: ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"] },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾", example: "12 345 6789", zones: ["Asia/Kuala_Lumpur", "Asia/Kuching"] },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬", example: "8123 4567", zones: ["Asia/Singapore"] },
  { code: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭", example: "81 234 5678", zones: ["Asia/Bangkok"] },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵", example: "90 1234 5678", zones: ["Asia/Tokyo"] },
  { code: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷", example: "10 2000 0000", zones: ["Asia/Seoul"] },
  { code: "HK", name: "Hong Kong", dial: "+852", flag: "🇭🇰", example: "5123 4567", zones: ["Asia/Hong_Kong"] },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰", example: "301 2345678", zones: ["Asia/Karachi"] },
  { code: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩", example: "1812-345678", zones: ["Asia/Dhaka"] },
  { code: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰", example: "71 234 5678", zones: ["Asia/Colombo"] },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦", example: "71 123 4567", zones: ["Africa/Johannesburg"] },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪", example: "1512 3456789", zones: ["Europe/Berlin", "Europe/Busingen"] },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷", example: "6 12 34 56 78", zones: ["Europe/Paris"] },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹", example: "312 345 6789", zones: ["Europe/Rome"] },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸", example: "612 34 56 78", zones: ["Europe/Madrid"] },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱", example: "6 12345678", zones: ["Europe/Amsterdam"] },
  { code: "GR", name: "Greece", dial: "+30", flag: "🇬🇷", example: "691 234 5678", zones: ["Europe/Athens"] },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹", example: "912 345 678", zones: ["Europe/Lisbon"] },
  { code: "PL", name: "Poland", dial: "+48", flag: "🇵🇱", example: "512 345 678", zones: ["Europe/Warsaw"] },
  { code: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪", example: "50 123 4567", zones: ["Asia/Dubai"] },
  { code: "FJ", name: "Fiji", dial: "+679", flag: "🇫🇯", example: "701 2345", zones: ["Pacific/Fiji"] },
  { code: "PG", name: "Papua New Guinea", dial: "+675", flag: "🇵🇬", example: "7012 3456", zones: ["Pacific/Port_Moresby"] },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷", example: "11 96123-4567", zones: ["America/Sao_Paulo"] },
] as const;

export const DEFAULT_COUNTRY = "AU";

export function findCountry(code: string): Country {
  return (
    COUNTRIES.find((country) => country.code === code) ??
    COUNTRIES.find((country) => country.code === DEFAULT_COUNTRY)!
  );
}

/**
 * Best guess at the visitor's country, from the browser only.
 *
 * Timezone first, because it reflects where the device actually is; locale
 * second, because a traveller's device keeps its home region. Falls back to
 * Australia, which is right for almost every visitor to this clinic.
 */
export function guessCountry(): string {
  if (typeof Intl === "undefined") return DEFAULT_COUNTRY;

  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (zone) {
      const byZone = COUNTRIES.find((country) =>
        country.zones?.some((prefix) =>
          prefix.endsWith("/") ? zone.startsWith(prefix) : zone === prefix,
        ),
      );
      if (byZone) return byZone.code;
    }
  } catch {
    /* Intl unavailable or timezone blocked; fall through to locale. */
  }

  try {
    const language =
      typeof navigator !== "undefined" ? navigator.language : undefined;
    if (language) {
      const region = new Intl.Locale(language).region;
      if (region && COUNTRIES.some((country) => country.code === region)) {
        return region;
      }
    }
  } catch {
    /* Malformed language tag; fall through to the default. */
  }

  return DEFAULT_COUNTRY;
}
