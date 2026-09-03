/**
 * `/quiz-thank-you/` — where the pre-screening quiz lands after it submits.
 *
 * Absent from `ROUTES`, so it appears in no sitemap, nav or breadcrumb, and
 * `noindex` on top of that. A confirmation page has nothing to offer a
 * searcher, and one that ranks gets opened by people who never submitted
 * anything — who would then read a message written for someone who did.
 *
 * No closing CTA band: pushing "start the free quiz" at someone who has just
 * finished the quiz reads as nobody being home.
 *
 * The panel is a client component because the triage level it needs is in
 * sessionStorage; see QuizThankYouPanel.
 */

import type { Metadata } from "next";

import { QuizThankYouPanel } from "@/components/sections/QuizThankYouPanel";

export const metadata: Metadata = {
  title: "Thank you | Horizon Health Care Partners",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <QuizThankYouPanel />;
}
