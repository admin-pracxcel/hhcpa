/**
 * The two pages a patient reaches *after* finishing the pre-screening quiz.
 *
 * Every "Book a consultation" CTA on the site points at `/quiz/`, which is
 * right everywhere except here: on these two pages it sends someone who has
 * just answered twenty questions back to question one.
 *
 * On `/quiz-book/` that is a loop — the booking they want is already on the
 * screen. On `/quiz-thank-you/` it is worse than a loop: that page is where a
 * red outcome lands, and a red outcome has just been told this service is not
 * suitable for them. A button inviting them to book is the last thing it
 * should carry.
 *
 * So the chrome drops the CTA on both and leaves the phone number, which is a
 * route that works for either patient. The quiz is still reachable from the
 * nav; what goes is the button that looks like the page's main action.
 *
 * ⚠️ `/quiz/` itself is deliberately absent. It sits outside the `(site)`
 * route group and renders no header, footer or sticky bar at all.
 */

export const POST_QUIZ_ROUTES: readonly string[] = [
  "/quiz-book",
  "/quiz-thank-you",
];

/**
 * True on a page that follows the quiz.
 *
 * `usePathname()` returns no trailing slash on this site — the config
 * redirects `/quiz-book/` to `/quiz-book` with a 308 — but the hrefs are all
 * written with one, so both spellings are accepted rather than relying on
 * which side of that redirect the caller is on.
 */
export function isPostQuizRoute(pathname: string | null): boolean {
  if (pathname === null || pathname === "") return false;
  const trimmed =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return POST_QUIZ_ROUTES.includes(trimmed);
}
