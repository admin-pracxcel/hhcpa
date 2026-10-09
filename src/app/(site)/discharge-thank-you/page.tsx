/**
 * `/discharge-thank-you/` — where the discharge letter form lands.
 *
 * Absent from `ROUTES` and `noindex`, for the same reasons as `/thank-you/`
 * and `/quiz-thank-you/`: a confirmation page has nothing to offer a searcher,
 * and one that ranks gets opened by people who never sent anything.
 *
 * It replaced an in-place confirmation panel. The wording is carried over
 * unchanged — it was the right wording, and the only thing wrong with it was
 * that it produced no URL for conversion tracking to see.
 *
 * ⚠️ A discharge request is a transfer-of-care enquiry, not a booking. The
 * copy promises a call to arrange the consultation and nothing more, which is
 * what the clinic can deliver and what the form asked for. Do not add a
 * booking CTA here.
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
      heading="Thanks, we have that"
      body="We will be in touch to arrange your transfer consultation. If you still need help getting your discharge letter, we can help with that on the call."
      primary={{ label: "Back to home", href: "/" }}
      secondary={{ label: "Transfer your care", href: "/transfer-your-care/" }}
    />
  );
}
