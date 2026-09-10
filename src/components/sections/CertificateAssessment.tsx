"use client";

/**
 * Her medical certificate assessment, rendered inside the quiz.
 *
 * Build spec v2.1 §4.9: "keep the screening questions as they are". So they
 * are not transcribed. This renders `CERT_STEPS` — the twelve steps and
 * forty-four questions ported verbatim from her live site — directly, which
 * is the only way "as they are" can be true of clinical questions over time.
 * A copy in the quiz's own step model would be forty-four chances to drift,
 * and the drift would be silent.
 *
 * It has its own step index rather than becoming forty-four quiz steps. The
 * quiz's graph stays four nodes wide (Online Doctor, certificate, assessment,
 * closing) and this owns the inside of the third.
 *
 * ─── THE RULE IT IMPLEMENTS ────────────────────────────────────────────────
 *
 * §4.9, her direction: a single-day certificate is issued on the questionnaire
 * alone, without a real-time consultation. Multi-day requires a consultation.
 * That decision is `daysRequested`, her question, and it comes out of here as
 * `certificate_route`, which n8n reads.
 *
 * The Medical Board guidance point was put to her in writing on 9 September
 * and she answered with this direction. The spec says not to raise it again,
 * and this comment is a record of what was built and why, not a re-raising.
 *
 * ⚠️ Nothing on this page may say a consultation is always required — §4.9 and
 * §7.3 both. The homepage FAQ says prescriptions are not issued on a
 * questionnaire alone; that is about prescriptions, and the two must not be
 * blurred into each other.
 *
 * ─── THE TWO HARD STOPS ────────────────────────────────────────────────────
 *
 * Hers, kept: a safety flag ends the assessment, and so does answering that
 * you are not in Australia. The residency one is redundant here because the
 * quiz already gates on it at Step 2, but it costs nothing and removing a
 * safety exclusion from a clinical instrument is not a refactor.
 */

import { useState } from "react";

import {
  CERT_STEPS,
  type AnswerMap,
  type AnswerValue,
  type CertQuestion,
  type ShowIf,
} from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/bookingWizardData";

const STYLES = `
.hhcp-ct-head { margin-bottom: var(--hhcp-space-s, 20px); }

.hhcp-ct-step {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-ct-title {
  margin-top: 6px;
  font-size: var(--hhcp-h4, 22px);
  line-height: 1.25;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ct-subtitle {
  margin-top: 6px;
  font-size: var(--hhcp-text-s, 14px);
  color: var(--hhcp-base-80, #34524a);
}

.hhcp-ct-note {
  margin-top: var(--hhcp-space-s, 20px);
  padding: 14px 16px;
  border-left: 3px solid var(--hhcp-action-dark, #0c7340);
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-accent, #f5fff9);
  font-size: var(--hhcp-text-s, 14px);
  color: var(--hhcp-primary, #013126);
}

.hhcp-ct-note[data-variant="warning"] {
  border-left-color: #b3261e;
}

.hhcp-ct-note strong { display: block; margin-bottom: 4px; }
.hhcp-ct-note p + p,
.hhcp-ct-note ul { margin-top: 8px; }
.hhcp-ct-note ul { padding-left: 18px; list-style: disc; }
.hhcp-ct-note li + li { margin-top: 4px; }

.hhcp-ct-q { margin-top: var(--hhcp-space-m, 30px); }

.hhcp-ct-label {
  display: block;
  margin-bottom: 8px;
  font-size: var(--hhcp-text-m, 16px);
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ct-req { color: #b3261e; }

.hhcp-ct-options { display: flex; flex-wrap: wrap; gap: 8px; }

.hhcp-ct-option {
  padding: 9px 14px;
  border: 1px solid var(--hhcp-neutral-ultra-light, #d6e8e1);
  border-radius: var(--hhcp-radius-pill, 999px);
  background: #ffffff;
  font: inherit;
  font-size: var(--hhcp-text-s, 14px);
  color: var(--hhcp-primary, #013126);
  cursor: pointer;
}

.hhcp-ct-option[data-on="true"] {
  border-color: var(--hhcp-primary, #013126);
  background: var(--hhcp-accent, #f5fff9);
  font-weight: 500;
}

.hhcp-ct-input,
.hhcp-ct-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--hhcp-neutral-ultra-light, #d6e8e1);
  border-radius: var(--hhcp-radius-s, 6.667px);
  font: inherit;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ct-textarea { min-height: 84px; resize: vertical; }

.hhcp-ct-check {
  display: flex;
  gap: 10px;
  margin-top: var(--hhcp-space-xs, 10px);
  font-size: var(--hhcp-text-s, 14px);
  color: var(--hhcp-primary, #013126);
}

.hhcp-ct-check input { margin-top: 3px; flex: none; }

.hhcp-ct-problem {
  margin-top: var(--hhcp-space-s, 20px);
  color: #b3261e;
  font-size: var(--hhcp-text-s, 14px);
}
`;

function passesShowIf(showIf: ShowIf | undefined, answers: AnswerMap): boolean {
  if (showIf === undefined) return true;
  const value = answers[showIf.q];
  if ("includes" in showIf) {
    return Array.isArray(value) && value.includes(showIf.includes);
  }
  return value !== undefined && value !== "" && value !== showIf.notEquals;
}

const asText = (v: AnswerValue | undefined) => (typeof v === "string" ? v : "");
const asList = (v: AnswerValue | undefined) => (Array.isArray(v) ? v : []);

export interface CertificateResult {
  /** Her `daysRequested` answer, verbatim. */
  readonly days: string;
  /**
   * `questionnaire-only` for a single day, `consultation` otherwise.
   *
   * Her rule, and the only thing this component decides. n8n routes on it.
   */
  readonly route: "questionnaire-only" | "consultation";
  readonly answers: AnswerMap;
}

interface Props {
  onDone: (result: CertificateResult) => void;
  /** Ends the assessment: a safety flag, or not being in Australia. */
  onStop: (reason: string) => void;
}

export function CertificateAssessment({ onDone, onStop }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [problem, setProblem] = useState("");

  const step = CERT_STEPS[index];
  const visible = step.questions.filter(
    (q) => !("showIf" in q) || passesShowIf(q.showIf, answers),
  );

  const set = (id: string, value: AnswerValue) => {
    setAnswers((current) => ({ ...current, [id]: value }));
    setProblem("");
  };

  const toggle = (id: string, option: string, exclusive?: string) =>
    setAnswers((current) => {
      const chosen = asList(current[id]);
      if (option === exclusive) return { ...current, [id]: [option] };
      const next = chosen.includes(option)
        ? chosen.filter((x) => x !== option)
        : [...chosen.filter((x) => x !== exclusive), option];
      return { ...current, [id]: next };
    });

  const advance = () => {
    for (const question of visible) {
      if (!("required" in question) || question.required !== true) continue;
      const value = answers[question.id];
      const answered =
        question.type === "multi"
          ? asList(value).length > 0
          : question.type === "check"
            ? value === true
            : asText(value) !== "";
      if (!answered) {
        setProblem(
          question.type === "check"
            ? "Please tick every box on this step to continue."
            : "Please answer every question on this step to continue.",
        );
        return;
      }
    }

    /* Her two hard stops, unchanged. */
    if (step.title === "Eligibility" && answers.inAustralia === "No") {
      onStop("Not currently located in Australia.");
      return;
    }
    if (step.title === "Safety Screening") {
      const flagged = asList(answers.safety).filter(
        (v) => v !== "None of the Above",
      );
      if (flagged.length > 0) {
        onStop(flagged.join("; "));
        return;
      }
    }

    if (index < CERT_STEPS.length - 1) {
      setIndex(index + 1);
      setProblem("");
      return;
    }

    const days = asText(answers.daysRequested);
    onDone({
      days,
      route: days === "1 Day" ? "questionnaire-only" : "consultation",
      answers,
    });
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="hhcp-ct-head">
        <p className="hhcp-ct-step">
          {`Step ${index + 1} of ${CERT_STEPS.length}`}
        </p>
        <h2 className="hhcp-ct-title font-dm-sans">{step.title}</h2>
        {step.subtitle !== "" && (
          <p className="hhcp-ct-subtitle font-dm-sans">{step.subtitle}</p>
        )}
      </div>

      {step.note !== undefined && (
        <p className="hhcp-ct-note font-dm-sans">{step.note}</p>
      )}

      {visible.map((question) => (
        <Question
          key={question.id ?? question.type}
          question={question}
          answers={answers}
          set={set}
          toggle={toggle}
        />
      ))}

      {problem !== "" && (
        <p className="hhcp-ct-problem font-dm-sans" role="alert">
          {problem}
        </p>
      )}

      <button type="button" className="hhcp-btn hhcp-qz-submit" onClick={advance}>
        {index < CERT_STEPS.length - 1 ? "Continue" : "See your options"}
      </button>
    </>
  );
}

function Question({
  question,
  answers,
  set,
  toggle,
}: {
  question: CertQuestion;
  answers: AnswerMap;
  set: (id: string, value: AnswerValue) => void;
  toggle: (id: string, option: string, exclusive?: string) => void;
}) {
  /*
   * Two shapes, not one. A warning carries a title and text; an info block
   * carries text, a bullet list, or both. Her certificate intro is the only
   * one that uses bullets, and flattening it to a paragraph would lose the
   * structure she wrote it in.
   */
  if (question.type === "warning") {
    return (
      <div className="hhcp-ct-note font-dm-sans" data-variant="warning">
        <strong>{question.title}</strong>
        <p>{question.text}</p>
      </div>
    );
  }

  if (question.type === "info") {
    return (
      <div className="hhcp-ct-note font-dm-sans">
        {question.text !== undefined && <p>{question.text}</p>}
        {question.bullets !== undefined && (
          <ul>
            {question.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  const value = answers[question.id];
  const id = `cert-${question.id}`;

  if (question.type === "check") {
    return (
      <label className="hhcp-ct-check">
        <input
          type="checkbox"
          checked={value === true}
          onChange={(event) => set(question.id, event.target.checked)}
        />
        <span>{question.text}</span>
      </label>
    );
  }

  const label = (
    <span className="hhcp-ct-label">
      {question.label}
      {question.required && <span className="hhcp-ct-req"> *</span>}
    </span>
  );

  if (question.type === "single" || question.type === "multi") {
    const chosen = question.type === "multi" ? asList(value) : [];
    const exclusive =
      question.type === "multi" ? question.exclusiveOption : undefined;
    return (
      <div className="hhcp-ct-q">
        {label}
        {"note" in question && question.note !== undefined && (
          <p className="hhcp-ct-subtitle font-dm-sans">{question.note}</p>
        )}
        <div className="hhcp-ct-options">
          {question.options.map((option) => {
            const on =
              question.type === "single"
                ? asText(value) === option
                : chosen.includes(option);
            return (
              <button
                key={option}
                type="button"
                className="hhcp-ct-option"
                data-on={on}
                aria-pressed={on}
                onClick={() =>
                  question.type === "single"
                    ? set(question.id, option)
                    : toggle(question.id, option, exclusive)
                }
              >
                {option}
              </button>
            );
          })}
        </div>
        {question.detailIf !== undefined &&
          question.detailId !== undefined &&
          asText(value) === question.detailIf && (
            <div className="hhcp-ct-q">
              <label className="hhcp-ct-label" htmlFor={`cert-${question.detailId}`}>
                {question.detailLabel ?? "Please provide details"}
              </label>
              <textarea
                id={`cert-${question.detailId}`}
                className="hhcp-ct-textarea"
                value={asText(answers[question.detailId])}
                onChange={(event) =>
                  set(question.detailId as string, event.target.value)
                }
              />
            </div>
          )}
      </div>
    );
  }

  if (question.type === "textarea") {
    return (
      <div className="hhcp-ct-q">
        <label className="hhcp-ct-label" htmlFor={id}>
          {question.label}
          {question.required && <span className="hhcp-ct-req"> *</span>}
        </label>
        <textarea
          id={id}
          className="hhcp-ct-textarea"
          maxLength={question.maxLength}
          value={asText(value)}
          onChange={(event) => set(question.id, event.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="hhcp-ct-q">
      <label className="hhcp-ct-label" htmlFor={id}>
        {question.label}
        {question.required && <span className="hhcp-ct-req"> *</span>}
      </label>
      <input
        id={id}
        type="date"
        className="hhcp-ct-input"
        value={asText(value)}
        onChange={(event) => set(question.id, event.target.value)}
      />
    </div>
  );
}
