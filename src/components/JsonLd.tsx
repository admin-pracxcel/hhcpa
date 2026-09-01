/**
 * Renders a schema object as JSON-LD.
 *
 * `data` is built by the helpers in `@/lib/schema` from the page's own content
 * consts — never hand-authored — so the markup cannot diverge from what renders.
 * Accepts `null` so a page with no FAQs can pass `buildFaqPage([])` directly.
 */
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
