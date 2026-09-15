/**
 * Clinical answers, paired with the question that produced them.
 *
 * n8n emails a submission to the clinic, and the raw object is keys only —
 * `cert_consent5: true` is eight booleans standing in for eight different
 * declarations, and `ho_prior_therapy: Yes` does not say yes to what. The keys
 * stay exactly as they are, because storage columns and dedupe are built on
 * them; this is a second, ordered view of the same answers for a human to read.
 *
 * An array rather than a second object, for two reasons. Order is the order the
 * patient was asked, which is the order the email should read in, and object
 * key order is insertion order by convention rather than by contract once it
 * has been through JSON, a workflow engine and a template. And a key can then
 * appear with its question rather than instead of it.
 *
 * `source` separates what the patient answered from what the system worked
 * out. `cert_route`, `cert_days` and `triage_reasons` are derived — nobody was
 * asked them — and an email that presents them as answers is misleading about
 * what the patient said.
 */

export type ReadableSource = "answer" | "derived";

export interface ReadableAnswer {
  /** The key as it appears in `clinical`. Unchanged, and the join between the two. */
  readonly key: string;
  /** The question as it was on screen, or a plain-English name if derived. */
  readonly label: string;
  readonly value: string;
  readonly source: ReadableSource;
}

/**
 * Labels written by hand because no question produced them — these are
 * outcomes of the flow rather than things anyone was asked.
 */
const DERIVED: ReadonlyMap<string, string> = new Map([
  ["cert_days", "Certificate length requested"],
  ["cert_route", "How the certificate is issued"],
  ["triage_reasons", "Why this was triaged the way it was"],
]);

/**
 * A boolean answer reads as `true` in the raw object, which in an email beside
 * a declaration is worse than useless — it looks like a debug value. The
 * question already says what was agreed to, so the value only has to say
 * whether it was.
 */
function present(value: string): string {
  if (value === "true") return "Agreed";
  if (value === "false") return "Not agreed";
  return value;
}

/**
 * Pairs each answer with its question.
 *
 * `labels` is looked up first with the key as given and then with a prefix
 * stripped, so `cert_purpose` finds the certificate question declared as
 * `purpose`. A key with no label at all still comes through — carrying it with
 * its own name beats dropping a clinical answer out of the email because
 * somebody added a field and not a label.
 */
export function toReadable(
  answers: Readonly<Record<string, string>>,
  labels: ReadonlyMap<string, string>,
  prefix = "",
): readonly ReadableAnswer[] {
  const out: ReadableAnswer[] = [];

  for (const [key, value] of Object.entries(answers)) {
    if (value === "") continue;

    const derived = DERIVED.get(key);
    if (derived !== undefined) {
      out.push({ key, label: derived, value: present(value), source: "derived" });
      continue;
    }

    const bare =
      prefix !== "" && key.startsWith(prefix) ? key.slice(prefix.length) : key;
    out.push({
      key,
      label: labels.get(key) ?? labels.get(bare) ?? key,
      value: present(value),
      source: "answer",
    });
  }

  return out;
}
