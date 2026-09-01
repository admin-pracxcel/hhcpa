/**
 * The single source for every price displayed on the site.
 *
 * Figures come from HHCPA_Website_Content_UPDATED.md (page 22, Pricing) and the
 * current live site. Anything marked `provisional` is awaiting Ranjeeta's written
 * confirmation per onboarding items 21 and 25, and must not be presented as final
 * until confirmed — see the design spec, §10.2.
 *
 * Onboarding item 25 also asks whether *every* figure should read as a "from"
 * price. If that is confirmed, set `from: true` across the board here; no other
 * file changes.
 */

export interface Price {
  label: string;
  /** In AUD. `0` renders as "Free". */
  amount: number;
  /** Renders a "from" prefix. */
  from: boolean;
  /** Awaiting written client confirmation. */
  provisional: boolean;
}

export type PriceKey =
  | "quiz"
  | "firstConsult"
  | "followUpConsult"
  | "transferConsult"
  | "generalConsult"
  | "afterHoursConsult"
  | "priorityConsult"
  | "medicalCertificate"
  | "prescriptions"
  | "pathologyReferral"
  | "mentalHealth"
  | "mensWomensHealth"
  | "weightManagement"
  | "healthProgram";

export const PRICES: Record<PriceKey, Price> = {
  quiz:               { label: "Pre-screening quiz",               amount: 0,    from: false, provisional: false },
  firstConsult:       { label: "First medical consultation",       amount: 59,   from: false, provisional: true },
  followUpConsult:    { label: "Follow-up consultation",           amount: 59,   from: false, provisional: true },
  transferConsult:    { label: "Transfer consultation",            amount: 54,   from: false, provisional: true },
  generalConsult:     { label: "General consult and referrals",    amount: 49,   from: true,  provisional: true },
  afterHoursConsult:  { label: "After-hours consult",              amount: 69,   from: true,  provisional: true },
  priorityConsult:    { label: "Priority consult",                 amount: 98,   from: true,  provisional: true },
  medicalCertificate: { label: "Medical certificates",             amount: 19.9, from: true,  provisional: true },
  prescriptions:      { label: "Prescriptions and repeat scripts", amount: 49,   from: true,  provisional: true },
  pathologyReferral:  { label: "Pathology and imaging referrals",  amount: 49,   from: true,  provisional: true },
  mentalHealth:       { label: "Mental health support",            amount: 59,   from: true,  provisional: true },
  mensWomensHealth:   { label: "Men's and women's health",         amount: 89,   from: true,  provisional: true },
  weightManagement:   { label: "Weight management",                amount: 99,   from: true,  provisional: true },
  healthProgram:      { label: "Structured health programs",       amount: 299,  from: true,  provisional: true },
};

export const PROVISIONAL_PRICE_KEYS: readonly PriceKey[] = (
  Object.keys(PRICES) as PriceKey[]
).filter((key) => PRICES[key].provisional);

export function formatPrice(key: PriceKey): string {
  const price = PRICES[key];
  if (price.amount === 0) return "Free";
  const hasCents = !Number.isInteger(price.amount);
  const amount = hasCents ? price.amount.toFixed(2) : String(price.amount);
  return `${price.from ? "from " : ""}$${amount}`;
}
