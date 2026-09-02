"use client";

/**
 * The pre-screening quiz.
 *
 * One question per step, driven by the flow data in `content/quiz.ts`. The
 * component knows how to render a step and how to walk the graph; it knows
 * nothing about which questions exist, so changing the flow is a content edit.
 *
 * Answers are held in state and only leave the browser at the closing step. A
 * visitor who exits at a safety screen — crisis, emergency, or not eligible —
 * has given no contact details and nothing is submitted. That is deliberate:
 * there is nobody to contact, and a partial clinical record of someone in
 * crisis is not something to store.
 *
 * Back is real. The step history is a stack, so leaving a branch and choosing
 * differently walks back through the answers actually given rather than
 * guessing the previous step from the flow.
 */

import { useCallback, useMemo, useState } from "react";

import {
  CONSENT_VERSION,
  QUIZ_CONSENTS,
  QUIZ_CONTACT,
  QUIZ_STEPS,
  QUIZ_SUCCESS,
  findStep,
  nextStepId,
} from "@/content/quiz";
import type { QuizStep } from "@/content/quiz";
import { findCountry, guessCountry } from "@/content/countries";
import { getAttribution, getLeadSource } from "@/lib/attribution";
import { cn } from "@/lib/utils";
import { PhoneField } from "./PhoneField";

const STYLES = `
.hhcp-qz-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-qz-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hhcp-qz-card {
  width: 100%;
  max-width: 720px;
  padding: var(--hhcp-space-l, 45px);
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #d6e8e1;
  box-shadow: 0 12px 24px -18px rgba(1, 49, 39, 0.25);
}

.hhcp-qz-progress {
  height: 6px;
  border-radius: 999px;
  background: var(--hhcp-accent, #f5fff9);
  overflow: hidden;
  margin-bottom: var(--hhcp-space-m, 30px);
}

.hhcp-qz-progress-bar {
  height: 100%;
  border-radius: 999px;
  background: var(--hhcp-action, #58eda2);
  transition: width 0.3s linear;
}

.hhcp-qz-step-count {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-base-60, rgba(1, 49, 38, 0.6));
  margin-bottom: 10px;
}

.hhcp-qz-question {
  font-size: var(--hhcp-h3, 32px);
  line-height: 1.25;
  font-weight: 400;
  letter-spacing: -0.32px;
  color: var(--hhcp-primary, #013126);
  margin-bottom: var(--hhcp-space-m, 30px);
}

.hhcp-qz-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hhcp-qz-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 18px 20px;
  border: 1px solid var(--hhcp-base-20, rgba(1, 49, 38, 0.2));
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif;
  font-size: var(--hhcp-text-m, 16px);
  color: var(--hhcp-primary, #013126);
  transition: all 0.2s linear;
}

.hhcp-qz-option:hover {
  border-color: var(--hhcp-primary, #013126);
  background: var(--hhcp-accent, #f5fff9);
}

.hhcp-qz-option-mark {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid var(--hhcp-base-20, rgba(1, 49, 38, 0.2));
  flex: none;
}

.hhcp-qz-option:hover .hhcp-qz-option-mark {
  border-color: var(--hhcp-action-dark, #0c7340);
  background: var(--hhcp-action, #58eda2);
}

.hhcp-qz-back {
  /* Block, so it drops below the BMI step's Continue button rather than
     sitting alongside it. */
  display: block;
  margin-top: var(--hhcp-space-m, 30px);
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-base-60, rgba(1, 49, 38, 0.6));
}

.hhcp-qz-back:hover {
  color: var(--hhcp-primary, #013126);
}

/* ---------- exits ---------- */
.hhcp-qz-exit-heading {
  font-size: var(--hhcp-h3, 32px);
  line-height: 1.25;
  font-weight: 400;
  color: var(--hhcp-primary, #013126);
  margin-bottom: var(--hhcp-space-s, 20px);
}

.hhcp-qz-exit-body {
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.7;
  color: rgba(1, 49, 38, 0.85);
}

.hhcp-qz-card[data-variant="crisis"],
.hhcp-qz-card[data-variant="emergency"] {
  background: var(--hhcp-primary, #013126);
  border-color: var(--hhcp-primary, #013126);
}

.hhcp-qz-card[data-variant="crisis"] .hhcp-qz-exit-heading,
.hhcp-qz-card[data-variant="emergency"] .hhcp-qz-exit-heading {
  color: #ffffff;
}

.hhcp-qz-card[data-variant="crisis"] .hhcp-qz-exit-body,
.hhcp-qz-card[data-variant="emergency"] .hhcp-qz-exit-body {
  color: rgba(255, 255, 255, 0.9);
}

.hhcp-qz-card[data-variant="crisis"] .hhcp-qz-back,
.hhcp-qz-card[data-variant="emergency"] .hhcp-qz-back {
  color: var(--hhcp-action-light, #baf8d9);
}

.hhcp-qz-urgent {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: var(--hhcp-space-m, 30px);
}

.hhcp-qz-urgent a {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  text-decoration: none;
  font-size: var(--hhcp-text-m, 16px);
}

.hhcp-qz-urgent a:hover {
  background: rgba(255, 255, 255, 0.18);
}

.hhcp-qz-urgent strong {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-weight: 500;
}

/* ---------- bmi + contact ---------- */
.hhcp-qz-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--hhcp-space-s, 20px);
}

.hhcp-qz-bmi {
  margin-top: var(--hhcp-space-m, 30px);
  padding: 18px;
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-accent, #f5fff9);
  font-size: var(--hhcp-text-m, 16px);
  color: var(--hhcp-primary, #013126);
}

.hhcp-qz-consents {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: var(--hhcp-space-s, 20px);
}

.hhcp-qz-consent {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(1, 49, 38, 0.85);
  cursor: pointer;
}

.hhcp-qz-consent input {
  margin-top: 3px;
  flex: none;
  width: 18px;
  height: 18px;
  accent-color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-qz-consent a {
  color: var(--hhcp-primary, #013126);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.hhcp-qz-privacy {
  margin-top: var(--hhcp-space-s, 20px);
  font-size: 14px;
  line-height: 1.6;
  color: rgba(1, 49, 38, 0.7);
}

.hhcp-qz-privacy a {
  color: var(--hhcp-primary, #013126);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.hhcp-qz-error {
  margin-top: var(--hhcp-space-s, 20px);
  padding: 14px;
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-cream, #ede9e3);
  font-size: var(--hhcp-text-s, 16px);
  color: var(--hhcp-primary, #013126);
}

.hhcp-qz-submit {
  margin-top: var(--hhcp-space-m, 30px);
}

.hhcp-qz-submit[disabled] {
  opacity: 0.6;
  cursor: progress;
}

.hhcp-qz-trap {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 600px) {
  .hhcp-qz-card {
    padding: var(--hhcp-space-m, 30px);
  }

  .hhcp-qz-question {
    font-size: var(--hhcp-h4, 20px);
  }

  .hhcp-qz-pair {
    grid-template-columns: 1fr;
  }
}
`;

const URGENT = [
  { label: "Lifeline", number: "13 11 14", href: "tel:131114" },
  { label: "Beyond Blue", number: "1300 22 4636", href: "tel:1300224636" },
  { label: "Emergency", number: "000", href: "tel:000" },
];

/** Longest path through the flow, used only to size the progress bar. */
const LONGEST_PATH = 8;

/**
 * Renders `text`, turning each named phrase into a link.
 *
 * The consent labels are one sentence each and name the documents they consent
 * to, so the alternative — splitting each label into typed fragments — would
 * make the wording harder to read against the live form it was migrated from.
 * Matching on the phrase keeps the sentence intact in the content file.
 */
function withLinks(
  text: string,
  links: readonly { readonly text: string; readonly href: string }[] = [],
) {
  if (links.length === 0) return text;

  const parts: (string | { text: string; href: string })[] = [text];
  for (const link of links) {
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      if (typeof part !== "string") continue;
      const at = part.indexOf(link.text);
      if (at === -1) continue;
      parts.splice(
        i,
        1,
        part.slice(0, at),
        link,
        part.slice(at + link.text.length),
      );
      break;
    }
  }

  return parts
    .filter((part) => part !== "")
    .map((part, index) =>
      typeof part === "string" ? (
        part
      ) : (
        <a key={`${index}-${part.href}`} href={part.href}>
          {part.text}
        </a>
      ),
    );
}

export function QuizForm({ className }: { className?: string }) {
  const [history, setHistory] = useState<string[]>(["age"]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [problem, setProblem] = useState("");

  const currentId = history[history.length - 1];
  const step = findStep(currentId);

  const bmi = useMemo(() => {
    const h = Number(height) / 100;
    const w = Number(weight);
    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) {
      return null;
    }
    return Math.round((w / (h * h)) * 10) / 10;
  }, [height, weight]);

  const advance = useCallback((from: QuizStep, answer: string) => {
    const nextId = nextStepId(from, answer);
    if (nextId === "") return;
    setHistory((stack) => [...stack, nextId]);
  }, []);

  const answer = (from: QuizStep, value: string) => {
    if (from.kind === "choice") {
      setAnswers((current) => ({ ...current, [from.field]: value }));
    }
    advance(from, value);
  };

  const back = () => {
    setProblem("");
    setHistory((stack) => (stack.length > 1 ? stack.slice(0, -1) : stack));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "").trim();

    const missingConsent = QUIZ_CONSENTS.filter(
      (consent) => consent.required && consents[consent.id] !== true,
    );
    if (missingConsent.length > 0) {
      setProblem("Please accept the required consents to continue.");
      return;
    }

    const phoneCountry = findCountry(value("phoneCountry"));
    const visitor = findCountry(guessCountry());

    /* Only the answers marked clinical; the rest stay in the open payload. */
    const clinical: Record<string, string> = {};
    const general: Record<string, string> = {};
    for (const item of QUIZ_STEPS) {
      if (item.kind !== "choice") continue;
      const given = answers[item.field];
      if (given === undefined) continue;
      (item.clinical === true ? clinical : general)[item.field] = given;
    }
    if (bmi !== null) {
      clinical.wl_height_cm = height;
      clinical.wl_weight_kg = weight;
      clinical.wl_bmi = String(bmi);
    }

    setProblem("");
    setStatus("sending");
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: {
            firstName: value("firstName"),
            lastName: value("lastName"),
            email: value("email"),
            phone: value("phone"),
            phoneCountry: phoneCountry.code,
            phoneDial: phoneCountry.dial,
            phoneE164:
              value("phone") === ""
                ? ""
                : `${phoneCountry.dial}${value("phone").replace(/[^\d]/g, "")}`,
          },
          service: answers.service_selection ?? "",
          outcome: "eligible",
          consents: Object.fromEntries(
            QUIZ_CONSENTS.map((consent) => [
              consent.id,
              consents[consent.id] === true,
            ]),
          ),
          consentVersion: CONSENT_VERSION,
          consentedAt: new Date().toISOString(),
          attribution: { ...getAttribution(), ...getLeadSource() },
          leadCountry: visitor.code,
          leadCountryName: visitor.name,
          pageTitle: typeof document === "undefined" ? "" : document.title,
          answers: general,
          clinical,
          company: value("company"),
        }),
      });

      if (!response.ok) {
        const detail = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setProblem(detail.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setProblem(
        "We could not send your answers just now. Please check your connection and try again.",
      );
      setStatus("idle");
    }
  };

  if (status === "done") {
    return (
      <section id="quiz" className={cn("hhcp-qz-section", className)}>
        <style>{STYLES}</style>
        <div className="hhcp-container hhcp-qz-container">
          <div className="hhcp-qz-card">
            <h2 className="hhcp-qz-exit-heading font-dm-sans">
              {QUIZ_SUCCESS.heading}
            </h2>
            <p className="hhcp-qz-exit-body font-dm-sans">{QUIZ_SUCCESS.body}</p>
          </div>
        </div>
      </section>
    );
  }

  if (step === undefined) return null;

  const progress = Math.min(
    100,
    Math.round((history.length / LONGEST_PATH) * 100),
  );

  return (
    <section id="quiz" className={cn("hhcp-qz-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-qz-container">
        <div
          className="hhcp-qz-card"
          data-variant={step.kind === "exit" ? step.variant : "question"}
        >
          {step.kind !== "exit" && (
            <>
              <div
                className="hhcp-qz-progress"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Quiz progress"
              >
                <div
                  className="hhcp-qz-progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="hhcp-qz-step-count">{`Step ${history.length}`}</p>
            </>
          )}

          {step.kind === "choice" && (
            <>
              <h2 className="hhcp-qz-question font-dm-sans">{step.question}</h2>
              <div className="hhcp-qz-options">
                {step.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="hhcp-qz-option"
                    onClick={() => answer(step, option)}
                  >
                    <span className="hhcp-qz-option-mark" aria-hidden="true" />
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step.kind === "bmi" && (
            <>
              <h2 className="hhcp-qz-question font-dm-sans">{step.question}</h2>
              <div className="hhcp-qz-pair">
                <div className="hhcp-form-field">
                  <label className="hhcp-form-label" htmlFor="quiz-height">
                    Height (cm)
                  </label>
                  <input
                    id="quiz-height"
                    className="hhcp-form-input"
                    type="number"
                    inputMode="numeric"
                    min={100}
                    max={250}
                    value={height}
                    onChange={(event) => setHeight(event.target.value)}
                    placeholder="175"
                  />
                </div>
                <div className="hhcp-form-field">
                  <label className="hhcp-form-label" htmlFor="quiz-weight">
                    Weight (kg)
                  </label>
                  <input
                    id="quiz-weight"
                    className="hhcp-form-input"
                    type="number"
                    inputMode="numeric"
                    min={30}
                    max={400}
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    placeholder="82"
                  />
                </div>
              </div>

              <p className="hhcp-qz-bmi font-dm-sans">
                {bmi === null
                  ? "Enter your height and weight to calculate your BMI."
                  : `Your BMI is ${bmi}. This is one measure among many and it is not a diagnosis — your practitioner will look at the whole picture.`}
              </p>

              <button
                type="button"
                className="hhcp-btn hhcp-qz-submit"
                disabled={bmi === null}
                onClick={() => advance(step, "")}
              >
                Continue
              </button>
            </>
          )}

          {step.kind === "exit" && (
            <>
              <h2 className="hhcp-qz-exit-heading font-dm-sans">
                {step.heading}
              </h2>
              <p className="hhcp-qz-exit-body font-dm-sans">{step.body}</p>
              {(step.variant === "crisis" || step.variant === "emergency") && (
                <div className="hhcp-qz-urgent font-dm-sans">
                  {URGENT.map((line) => (
                    <a key={line.label} href={line.href}>
                      <span>{line.label}</span>
                      <strong>{line.number}</strong>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}

          {step.kind === "contact" && (
            <form onSubmit={submit}>
              <h2 className="hhcp-qz-question font-dm-sans">
                {QUIZ_CONTACT.heading}
              </h2>
              <p className="hhcp-qz-exit-body font-dm-sans">
                {QUIZ_CONTACT.body}
              </p>

              <div className="hhcp-qz-pair" style={{ marginTop: 24 }}>
                <div className="hhcp-form-field">
                  <label className="hhcp-form-label" htmlFor="quiz-first">
                    First name
                  </label>
                  <input
                    id="quiz-first"
                    className="hhcp-form-input"
                    name="firstName"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="hhcp-form-field">
                  <label className="hhcp-form-label" htmlFor="quiz-last">
                    Last name
                  </label>
                  <input
                    id="quiz-last"
                    className="hhcp-form-input"
                    name="lastName"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div className="hhcp-form-field" style={{ marginTop: 20 }}>
                <label className="hhcp-form-label" htmlFor="quiz-email">
                  Email
                </label>
                <input
                  id="quiz-email"
                  className="hhcp-form-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div style={{ marginTop: 20 }}>
                <PhoneField name="phone" label="Phone number" required />
              </div>

              <div className="hhcp-qz-consents">
                {QUIZ_CONSENTS.map((consent) => (
                  <label key={consent.id} className="hhcp-qz-consent font-dm-sans">
                    <input
                      type="checkbox"
                      name={consent.field}
                      checked={consents[consent.id] === true}
                      onChange={(event) =>
                        setConsents((current) => ({
                          ...current,
                          [consent.id]: event.target.checked,
                        }))
                      }
                      required={consent.required}
                    />
                    <span>{withLinks(consent.label, consent.links)}</span>
                  </label>
                ))}
              </div>

              <p className="hhcp-qz-privacy font-dm-sans">
                {withLinks(QUIZ_CONTACT.privacyNote, QUIZ_CONTACT.privacyLinks)}
              </p>

              <div className="hhcp-qz-trap" aria-hidden="true">
                <label htmlFor="quiz-company">Company</label>
                <input
                  id="quiz-company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {problem !== "" && (
                <p className="hhcp-qz-error font-dm-sans" role="alert">
                  {problem}
                </p>
              )}

              <button
                className="hhcp-btn hhcp-qz-submit"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Get my results"}
              </button>
            </form>
          )}

          {history.length > 1 && (
            <button type="button" className="hhcp-qz-back" onClick={back}>
              ← Back
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
