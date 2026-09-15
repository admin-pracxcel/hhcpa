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
 * It renders the booking widget and nothing else.
 *
 * It used to run her six clinical intake forms first — build spec v2.3
 * addendum §1 step 6. Removed 2026-09-15 on Bilal's instruction. Her own
 * architecture, in v2.2 Q21, was a single pass: gates, service selection, the
 * question set, triage, then booking. The step-6 split was ours, introduced to
 * stop a red outcome collecting a residential address, and it put a 25-field
 * form between a cleared patient and the booking button. v2.4 Q28 already
 * records the split causing a regression of its own.
 *
 * The forms are not lost: they are Ranjeeta's FRM documents and they are in
 * git history. If she wants them collected after booking instead, the natural
 * home is the confirmation email rather than this page.
 *
 * ⚠️ Which URL a patient lands on still says something about their answers:
 * here means they were offered a booking, `/quiz-thank-you/` means they were
 * not. That is far weaker than a URL naming the triage level, but it is not
 * nothing, and it will reach any analytics or ad pixel added later. If that
 * matters more than the convenience of a page-URL conversion trigger, the
 * alternative is one URL whose content varies and a custom event instead.
 */

import type { Metadata } from "next";

import { BookingPanel } from "@/components/sections/BookingPanel";

export const metadata: Metadata = {
  title: "Book your consultation | Horizon Health Care Partners",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BookingPanel />;
}
