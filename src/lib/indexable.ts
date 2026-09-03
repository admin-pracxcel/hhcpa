/**
 * Whether this deployment may be indexed by search engines.
 *
 * Defaults to **false**. Only a deployment that sets `SITE_INDEXABLE=true` is
 * offered to search engines; everything else — staging, previews, a developer's
 * laptop, and any host nobody has thought about yet — is noindex by omission.
 *
 * That direction matters. The alternative is a list of hosts to exclude, and the
 * cost of forgetting to add one is a staging copy of the site competing with the
 * real one for the terms it was built to win. Forgetting to set this on
 * production costs nothing worse than a day of not being indexed, which is
 * visible and reversible.
 */
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE === "true";
