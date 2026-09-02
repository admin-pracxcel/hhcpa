/**
 * `/quiz/`
 *
 * The pre-screening quiz. Unlike every other page here this one submits: the
 * closing step posts to `/api/quiz`, which forwards to n8n. That submission is
 * the New Patient Booking counted under Clause 1.2, so treat changes to the
 * flow as changes to a measured number, not just to a form.
 *
 * The questions, branches and exit wording all live in `content/quiz.ts` and
 * were migrated from the client's live FluentForms build. Read the compliance
 * note at the top of that file before editing the holistic branch.
 */

import type { Metadata } from "next";

import { CLINIC } from "@/content/clinic";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbList, buildMedicalWebPage } from "@/lib/schema";
import { QUIZ_META, QUIZ_PAGE } from "@/content/quiz";

import { QuizForm } from "@/components/sections/QuizForm";
import { ScrollRevealParagraph } from "@/components/sections/ScrollRevealParagraph";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { StatementBand } from "@/components/sections/StatementBand";

import { FinalCtaSection } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/FinalCtaSection";

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
          { name: QUIZ_PAGE.hero.eyebrow, path: QUIZ_META.path },
        ])}
      />

      <ServiceHero
        eyebrow={QUIZ_PAGE.hero.eyebrow}
        heading={QUIZ_PAGE.hero.heading}
        crumbs={QUIZ_PAGE.crumbs}
        primary={QUIZ_PAGE.hero.primary}
        secondary={QUIZ_PAGE.hero.secondary}
      />

      <ScrollRevealParagraph text={QUIZ_PAGE.intro} />

      <QuizForm />

      <StatementBand
        eyebrow={QUIZ_PAGE.safety.eyebrow}
        heading={QUIZ_PAGE.safety.heading}
        paragraphs={[QUIZ_PAGE.safety.body]}
      />

      <FinalCtaSection
        heading={QUIZ_PAGE.closing.heading}
        body={QUIZ_PAGE.closing.body}
        actions={
          <div className="flex flex-row flex-wrap items-center justify-center gap-[16px]">
            <a className="hhcp-btn" href={QUIZ_PAGE.closing.primary.href}>
              {QUIZ_PAGE.closing.primary.label}
            </a>
            <a
              className="font-roboto-mono rounded-[var(--hhcp-radius-pill)] border border-white px-[19.2px] py-[12.132px] text-[12px] leading-none font-medium uppercase text-white transition-all duration-300 hover:bg-white hover:text-[color:var(--hhcp-primary)]"
              href={CLINIC.phoneHref}
            >
              {`Call ${CLINIC.phone}`}
            </a>
          </div>
        }
      />
    </>
  );
}
