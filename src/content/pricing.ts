/**
 * The single source for every price displayed on the site.
 *
 * PROVENANCE — every figure below is on the client's own live site today.
 * None was invented for the rebuild, and none was inferred. Checked against the
 * capture at docs/research/<site-key>/root-8a5edab2/, where the booking wizard
 * carries them as structured data rather than as prose:
 *
 *   From $19.90  Medical Certificates          From $49  General & Referrals
 *   From $49     Prescriptions                 From $49  Pathology & Imaging
 *   From $59     Mental Health                 From $69  After-Hours Consult
 *   From $89     Men's & Women's Health        From $98  Priority Consult
 *   From $99     Weight Management             from $299 Health Optimisation
 *
 * and the page copy carried the three consultation fees: "The online
 * pre-screening quiz is free. Your first medical consultation is $59. Follow-up
 * consultations are $59. Transfer consultations are $54."
 *
 * Those three have since been superseded. Her live site prices the same block
 * three different ways — the homepage at $69/$49, the About page at $59/$49,
 * the pricing page at $59/$59 with a $54 transfer — and her instruction of
 * 9 September gives a fourth. Build spec v2.3 §10 settles it at **$69 first,
 * $59 follow-up, $59 transfer**, and says to ignore the live figures because
 * the two sites are never live together. That is what is built.
 *
 * The prescriptions row drops from $49 to $19 under §5.1, which is the entry
 * price of the conditional ladder on the prescriptions page.
 *
 * The content document then quotes Ranjeeta's own onboarding replies against
 * those same figures — "Wants to change - from $99 but holistic from $59" and
 * "Confirmed but need to clarify 'FROM' $49 etc" — so she has seen the list and
 * commented on it. What is missing is her written sign-off on the final list,
 * which is the only thing `provisional` claims.
 *
 * The two services that were absent here because the approved sitemap had no
 * page for them — Continuity & Preventative Health (from $69) and Holistic Care
 * / Alternative Medicine (from $49) — now have both. The second still bears on
 * the open question above: her "holistic from $59" reads against a live price
 * of $49, and $49 is what is built until she confirms otherwise.
 *
 * Anything marked `provisional` is awaiting Ranjeeta's written confirmation per
 * onboarding items 21 and 25, and must not be presented as final until confirmed
 * — see the design spec, §10.2.
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
  | "continuityPreventative"
  | "holisticCare"
  | "healthProgram";

export const PRICES: Record<PriceKey, Price> = {
  quiz:               { label: "Pre-screening quiz",               amount: 0,    from: false, provisional: false },
  firstConsult:       { label: "First medical consultation",       amount: 69,   from: false, provisional: true },
  followUpConsult:    { label: "Follow-up consultation",           amount: 59,   from: false, provisional: true },
  transferConsult:    { label: "Transfer consultation",            amount: 59,   from: false, provisional: true },
  generalConsult:     { label: "General consult and referrals",    amount: 49,   from: true,  provisional: true },
  afterHoursConsult:  { label: "After-hours consult",              amount: 69,   from: true,  provisional: true },
  priorityConsult:    { label: "Priority consult",                 amount: 98,   from: true,  provisional: true },
  medicalCertificate: { label: "Medical certificates",             amount: 19.9, from: true,  provisional: true },
  prescriptions:      { label: "Prescriptions and repeat scripts", amount: 19,   from: true,  provisional: true },
  pathologyReferral:  { label: "Pathology and imaging referrals",  amount: 49,   from: true,  provisional: true },
  mentalHealth:       { label: "Mental health support",            amount: 59,   from: true,  provisional: true },
  mensWomensHealth:   { label: "Men's and women's health",         amount: 89,   from: true,  provisional: true },
  weightManagement:   { label: "Weight management",                amount: 99,   from: true,  provisional: true },
  /*
   * Both were priced on her live site and were missing from the rebuild only
   * because the approved sitemap had no page for them. Build spec v2.1 §5.1
   * adds the rows; §3.2 and §3.3 add the pages.
   */
  continuityPreventative:
                      { label: "Continuity & Preventative Health", amount: 69,   from: true,  provisional: true },
  holisticCare:       { label: "Holistic Care / Alternative Medicine", amount: 49, from: true, provisional: true },
  /* Renamed from "Structured health programs" by §5.1: the row is the Health
     Optimisation hub's price, so it should read as that service's name. */
  healthProgram:      { label: "Health Optimisation & Complete Wellness", amount: 299, from: true, provisional: true },
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
