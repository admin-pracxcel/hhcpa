/**
 * `/quiz-thank-you/` — where the pre-screening quiz lands after it submits.
 *
 * Absent from `ROUTES`, so it appears in no sitemap, nav or breadcrumb, and
 * `noindex` on top of that: a confirmation page has nothing to offer a searcher,
 * and one that ranks gets opened by people who never submitted anything.
 *
 * No closing CTA band. Pushing "start the free quiz" at someone who has just
 * finished the quiz reads as nobody being home.
 *
 * A plain server component. It used to be a client one that read the triage
 * level out of sessionStorage to choose between four messages; there is one
 * message now, so there is nothing to read and nothing to hydrate.
 */

import type { Metadata } from "next";

import { QUIZ_SUCCESS } from "@/content/quiz";
import { ThankYouPanel } from "@/components/sections/ThankYouPanel";

export const metadata: Metadata = {
  title: "Thank you | Horizon Health Care Partners",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ThankYouPanel
      heading={QUIZ_SUCCESS.heading}
      body={QUIZ_SUCCESS.body}
      note={QUIZ_SUCCESS.note}
      primary={{ label: "Back to home", href: "/" }}
      secondary={{ label: "Read the knowledge hub", href: "/articles/" }}
    />
  );
}
