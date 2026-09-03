/**
 * `/quiz/` — the pre-screening quiz.
 *
 * Outside the `(site)` group on purpose, so it renders with no header, footer,
 * navigation or sticky CTA. That matches the live page, and it is the right
 * shape for it: on a page whose only job is to start the quiz, every other link
 * is a way to not start it.
 *
 * `AttributionCapture` is kept even though the rest of the site chrome is not.
 * This is the only lead-capturing page here, so it is the one page that most
 * needs the utm_source stored before anything is submitted.
 *
 * Unlike every other page here this one submits: the closing step posts to
 * `/api/quiz`, which forwards to n8n. That submission is the New Patient
 * Booking counted under Clause 1.2, so treat changes to the flow as changes to
 * a measured number, not just to a form.
 *
 * The questions, branches and exit wording live in `content/quiz.ts` and were
 * migrated from the client's live FluentForms build. Read the compliance note
 * at the top of that file before editing the holistic branch.
 */

import { Suspense } from "react";
import type { Metadata } from "next";

import { AttributionCapture } from "@/components/AttributionCapture";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbList, buildMedicalWebPage } from "@/lib/schema";
import { QUIZ_META } from "@/content/quiz";

import { QuizLanding } from "@/components/sections/QuizLanding";

export const metadata: Metadata = {
  title: QUIZ_META.title,
  description: QUIZ_META.description,
  alternates: { canonical: QUIZ_META.path },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildMedicalWebPage({
          name: QUIZ_META.title,
          description: QUIZ_META.description,
          path: QUIZ_META.path,
        })}
      />
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Pre-screening quiz", path: QUIZ_META.path },
        ])}
      />

      {/* useSearchParams needs a Suspense boundary so the rest of the page can
          still be statically rendered around it. */}
      <Suspense fallback={null}>
        <AttributionCapture />
      </Suspense>

      <main id="brx-content">
        <QuizLanding />
      </main>
    </>
  );
}
