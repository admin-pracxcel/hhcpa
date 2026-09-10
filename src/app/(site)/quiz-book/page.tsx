/**
 * `/quiz-book/` — where a green or amber quiz submission lands.
 *
 * Two destinations rather than three. Green and amber both book; the only
 * difference is an email so a practitioner reviews the amber answers, and that
 * is an n8n branch on the `outcome` already in the payload. A third page would
 * render the same thing as this one forever.
 *
 * Absent from `ROUTES` and `noindex`, like the other post-submission pages.
 *
 * It renders two steps, not one: the clinical intake form for the patient's
 * service, then the booking widget. See `BookingFlow` for what happens when
 * there is no form, or when the patient arrived here some other way.
 *
 * ⚠️ Which URL a patient lands on still says something about their answers:
 * here means they were offered a booking, `/quiz-thank-you/` means they were
 * not. That is far weaker than a URL naming the triage level, but it is not
 * nothing, and it will reach any analytics or ad pixel added later. If that
 * matters more than the convenience of a page-URL conversion trigger, the
 * alternative is one URL whose content varies and a custom event instead.
 */

import type { Metadata } from "next";

import { BookingFlow } from "@/components/sections/BookingFlow";

export const metadata: Metadata = {
  title: "Book your consultation | Horizon Health Care Partners",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BookingFlow />;
}
