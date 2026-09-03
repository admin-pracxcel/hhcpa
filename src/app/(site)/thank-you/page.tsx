/**
 * `/thank-you/` — where the contact form lands after it submits.
 *
 * Absent from `ROUTES` and `noindex`, for the same reasons as
 * `/quiz-thank-you/`: a confirmation page has nothing to offer a searcher, and
 * one that ranks gets opened by people who never sent anything.
 *
 * Unlike the quiz's, this message is the same for everyone, so the page is a
 * plain server component with no state to carry.
 */

import type { Metadata } from "next";

import { ThankYouPanel } from "@/components/sections/ThankYouPanel";

export const metadata: Metadata = {
  title: "Thank you | Horizon Health Care Partners",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ThankYouPanel
      heading="Thank you — your message has been sent"
      body="Our team will get back to you as soon as we can. If your message needs a practitioner, we will let you know what happens next before anything is booked."
      primary={{ label: "Back to home", href: "/" }}
      secondary={{ label: "Read the knowledge hub", href: "/articles/" }}
    />
  );
}
