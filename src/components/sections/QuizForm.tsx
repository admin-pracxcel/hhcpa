"use client";

/**
 * The pre-screening quiz.
 *
 * One question per step, driven by the flow data in `content/quiz.ts`. The
 * component knows how to render a step kind and how to walk the graph; it knows
 * nothing about which questions exist, so changing the flow is a content edit.
 *
 * Answers are held in state and only leave the browser at the closing step. A
 * visitor who exits at a safety screen — crisis, emergency, or not eligible —
 * has given no contact details and nothing is submitted. That is deliberate:
 * there is nobody to contact, and a partial clinical record of someone in
 * crisis is not something to store.
 *
 * A red triage is NOT such an exit. Red means a human has to call the patient
 * back, so it collects details and submits like any other outcome; only the
 * closing message differs. See `triage` in the content file.
 *
 * Back is real. The step history is a stack, so leaving a branch and choosing
 * differently walks back through the answers actually given rather than
 * guessing the previous step from the flow.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CONSENT_VERSION,
  NONE_OF_THESE,
  QUIZ_CONSENTS,
  QUIZ_CONTACT,
  QUIZ_STEPS,
  TRIAGE_MESSAGES,
  bmiMessage,
  calculateBmi,
  findStep,
  nextStepId,
  summaryRows,
  triage,
} from "@/content/quiz";
import type { QuizStep, TriageLevel } from "@/content/quiz";
import { findCountry, guessCountry } from "@/content/countries";
import { getAttribution, getLeadSource } from "@/lib/attribution";
import { cn } from "@/lib/utils";
import { PhoneField } from "./PhoneField";

const STYLES = `
/* ---------- Modal shell ---------- */
/*
 * The quiz opens over the landing page rather than sitting under it. Two
 * reasons it is a real overlay and not a route: nothing is submitted until the
 * closing step, so a half-finished quiz should not be a page someone can land
 * on or link to; and closing it should put the reader back where they were,
 * with the landing page still behind.
 */
.hhcp-qz-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  background: var(--hhcp-accent, #f5fff9);
  overflow-y: auto;
  overscroll-behavior: contain;
}

/*
 * Pinned to the top of the overlay, full width, above the scrolling body — a
 * long branch scrolls under it rather than taking the progress bar with it.
 */
.hhcp-qz-topbar {
  position: sticky;
  top: 0;
  z-index: 1;
  flex: none;
  background: #ffffff;
  border-bottom: 1px solid #d6e8e1;
}

.hhcp-qz-track {
  height: 4px;
  width: 100%;
  background: #d6e8e1;
}

.hhcp-qz-fill {
  height: 100%;
  background: var(--hhcp-action, #58eda2);
  transition: width 0.3s ease;
}

.hhcp-qz-topbar-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--hhcp-space-m, 30px);
  padding: 14px var(--hhcp-gutter);
}

.hhcp-qz-topbar-logo {
  height: 30px;
  width: auto;
}

.hhcp-qz-count {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: #526f68;
}

.hhcp-qz-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 50%;
  border: 1px solid #d6e8e1;
  background: #ffffff;
  color: var(--hhcp-primary, #013126);
  cursor: pointer;
  transition: all 0.2s linear;
}

.hhcp-qz-close:hover {
  background: var(--hhcp-primary, #013126);
  color: #ffffff;
  border-color: var(--hhcp-primary, #013126);
}

@media (max-width: 767px) {
  .hhcp-qz-topbar-logo {
    height: 24px;
  }
  .hhcp-qz-count {
    display: none;
  }
}

.hhcp-qz-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

/* Inside the overlay the section is the scrolling body, not a page band. */
.hhcp-qz-overlay .hhcp-qz-section {
  flex: 1 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
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
  margin-bottom: var(--hhcp-space-s, 20px);
}

/* "Why are we asking this question?" */
.hhcp-qz-note {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(1, 49, 38, 0.7);
  margin-bottom: var(--hhcp-space-m, 30px);
  padding-left: 14px;
  border-left: 2px solid var(--hhcp-action, #58eda2);
}

.hhcp-qz-hint {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-base-60, rgba(1, 49, 38, 0.6));
  margin-bottom: 12px;
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

.hhcp-qz-option:hover,
.hhcp-qz-option[data-selected="true"] {
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

.hhcp-qz-option-mark[data-shape="box"] {
  border-radius: 4px;
}

.hhcp-qz-option:hover .hhcp-qz-option-mark,
.hhcp-qz-option[data-selected="true"] .hhcp-qz-option-mark {
  border-color: var(--hhcp-action-dark, #0c7340);
  background: var(--hhcp-action, #58eda2);
}

/* Advisory shown when an answer carries one. Never ends the flow. */
.hhcp-qz-advisory {
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-cream, #ede9e3);
  font-size: 14px;
  line-height: 1.6;
  color: var(--hhcp-primary, #013126);
}

.hhcp-qz-back {
  /* Block, so it drops below a Continue button rather than sitting alongside. */
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

/* ---------- inputs ---------- */
.hhcp-qz-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--hhcp-space-s, 20px);
}

.hhcp-qz-unit-wrap {
  position: relative;
  display: block;
}

.hhcp-qz-unit {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 13px;
  color: var(--hhcp-base-60, rgba(1, 49, 38, 0.6));
  pointer-events: none;
}

.hhcp-qz-followup {
  margin-top: var(--hhcp-space-s, 20px);
}

.hhcp-qz-bmi {
  margin-top: var(--hhcp-space-m, 30px);
  padding: 18px;
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-accent, #f5fff9);
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.6;
  color: var(--hhcp-primary, #013126);
}

.hhcp-qz-bmi strong {
  font-weight: 600;
}

/* ---------- summary ---------- */
.hhcp-qz-rows {
  display: flex;
  flex-direction: column;
  margin-top: var(--hhcp-space-m, 30px);
  border-top: 1px solid var(--hhcp-base-20, rgba(1, 49, 38, 0.2));
}

.hhcp-qz-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 0;
  border-bottom: 1px solid var(--hhcp-base-20, rgba(1, 49, 38, 0.2));
}

.hhcp-qz-row dt {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-base-60, rgba(1, 49, 38, 0.6));
}

.hhcp-qz-row dd {
  font-size: var(--hhcp-text-m, 16px);
  color: var(--hhcp-primary, #013126);
  text-align: right;
}

/* ---------- closing step ---------- */
.hhcp-qz-banner {
  padding: 18px 20px;
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-accent, #f5fff9);
  border-left: 3px solid var(--hhcp-action, #58eda2);
  margin-bottom: var(--hhcp-space-m, 30px);
}

.hhcp-qz-banner[data-level="red"] {
  background: var(--hhcp-cream, #ede9e3);
  border-left-color: var(--hhcp-primary, #013126);
}

.hhcp-qz-banner h3 {
  font-size: var(--hhcp-h4, 20px);
  font-weight: 500;
  line-height: 1.3;
  color: var(--hhcp-primary, #013126);
  margin-bottom: 8px;
}

.hhcp-qz-banner p {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-qz-important {
  margin-top: var(--hhcp-space-m, 30px);
  padding: 18px 20px;
  border-radius: var(--hhcp-radius-s, 6.667px);
  border: 1px solid var(--hhcp-base-20, rgba(1, 49, 38, 0.2));
}

.hhcp-qz-important h3 {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-primary, #013126);
  margin-bottom: 8px;
}

.hhcp-qz-important p {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(1, 49, 38, 0.8);
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
  opacity: 0.5;
  cursor: not-allowed;
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

  .hhcp-qz-row {
    flex-direction: column;
    gap: 4px;
  }

  .hhcp-qz-row dd {
    text-align: left;
  }
}
`;

const URGENT = [
  { label: "Lifeline", number: "13 11 14", href: "tel:131114" },
  { label: "Beyond Blue", number: "1300 22 4636", href: "tel:1300224636" },
  { label: "Emergency", number: "000", href: "tel:000" },
];

/**
 * Which posted fields are clinical.
 *
 * Built from the flow so the two cannot drift: a question marked clinical in
 * the content file segregates its answer, its follow-up text and its "other"
 * text without anyone having to remember. Anything not in the map is treated as
 * clinical, because the cost of guessing wrong runs one way — a marketing field
 * routed to the clinical destination is untidy; a health answer routed to a
 * marketing branch is a privacy breach.
 */
const CLINICAL_FIELDS: ReadonlyMap<string, boolean> = new Map(
  QUIZ_STEPS.flatMap((step) => {
    if (
      step.kind === "exit" ||
      step.kind === "contact" ||
      step.kind === "summary"
    ) {
      return [];
    }
    const clinical = step.clinical === true;
    const names: string[] = [];
    if (step.kind === "choice" || step.kind === "multi") names.push(step.field);
    if (step.kind === "choice" && step.followUp !== undefined) {
      names.push(step.followUp.name);
    }
    if (step.kind === "multi" && step.other !== undefined) {
      names.push(step.other.name);
    }
    if (step.kind === "input") {
      names.push(...step.fields.map((field) => field.name));
    }
    if (step.kind === "bmi") {
      names.push("wl_height_cm", "wl_weight_kg", "wl_bmi");
    }
    return names.map((name): [string, boolean] => [name, clinical]);
  }),
);

/**
 * How many steps remain on the longest route out of `id`, for the progress bar.
 *
 * The branches are very different lengths — three questions for mental health,
 * seventeen for weight loss — so a fixed denominator would show a bar that
 * lurches when the visitor picks a service. Walking the graph gives each branch
 * an honest one.
 */
function longestRemaining(
  id: string,
  seen: ReadonlySet<string> = new Set<string>(),
): number {
  if (seen.has(id)) return 0;
  const step = findStep(id);
  if (step === undefined || step.kind === "exit" || step.kind === "contact") {
    return 0;
  }
  const nextSeen = new Set(seen).add(id);
  const targets =
    step.kind === "choice" ? Object.values(step.next) : [step.next];
  return (
    1 + Math.max(0, ...targets.map((target) => longestRemaining(target, nextSeen)))
  );
}

/** Renders `text`, turning each named phrase into a link. */
function renderWithLinks(
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

interface QuizFormProps {
  className?: string;
  /**
   * Closes the overlay. Supplied by the landing page, which owns whether the
   * quiz is open — the form has enough state of its own.
   */
  onClose: () => void;
}

export function QuizForm({ className, onClose }: QuizFormProps) {
  const [history, setHistory] = useState<string[]>(["age"]);
  /** Single-value answers: choices, follow-up text, numbers, dates. */
  const [answers, setAnswers] = useState<Record<string, string>>({});
  /** Multi-select answers, kept as arrays for the checkbox UI. */
  const [picked, setPicked] = useState<Record<string, string[]>>({});
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const router = useRouter();

  /*
   * Escape closes, and the page behind is held still so a long branch does not
   * scroll the landing page under the overlay. This is not a scroll listener —
   * AGENTS.md rules those out and there are still none.
   */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [problem, setProblem] = useState("");

  const currentId = history[history.length - 1];
  const step = findStep(currentId);

  /* One flat map of every answer given — for triage, the summary and the payload. */
  const allAnswers = useMemo(() => {
    const flat: Record<string, string> = { ...answers };
    for (const [field, values] of Object.entries(picked)) {
      if (values.length > 0) flat[field] = values.join(", ");
    }
    return flat;
  }, [answers, picked]);

  const bmi = useMemo(
    () => calculateBmi(answers.wl_height_cm ?? "", answers.wl_weight_kg ?? ""),
    [answers.wl_height_cm, answers.wl_weight_kg],
  );

  const outcome = useMemo(() => triage(allAnswers), [allAnswers]);

  const set = useCallback((name: string, value: string) => {
    setAnswers((current) => ({ ...current, [name]: value }));
  }, []);

  const go = useCallback((from: QuizStep, answer: string) => {
    const nextId = nextStepId(from, answer);
    if (nextId === "") return;
    setProblem("");
    setHistory((stack) => [...stack, nextId]);
  }, []);

  const back = useCallback(() => {
    setProblem("");
    setHistory((stack) => (stack.length > 1 ? stack.slice(0, -1) : stack));
  }, []);

  /** "None of these" is exclusive, both ways. */
  const toggle = useCallback((field: string, option: string) => {
    setPicked((current) => {
      const existing = current[field] ?? [];
      if (option === NONE_OF_THESE) {
        return {
          ...current,
          [field]: existing.includes(NONE_OF_THESE) ? [] : [NONE_OF_THESE],
        };
      }
      const without = existing.filter(
        (value) => value !== option && value !== NONE_OF_THESE,
      );
      return {
        ...current,
        [field]: existing.includes(option) ? without : [...without, option],
      };
    });
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "").trim();

    const missing = QUIZ_CONSENTS.filter(
      (consent) => consent.required && consents[consent.id] !== true,
    );
    if (missing.length > 0) {
      setProblem("Please accept the required consents to continue.");
      return;
    }

    const phoneCountry = findCountry(value("phoneCountry"));
    const visitor = findCountry(guessCountry());

    const clinical: Record<string, string> = {};
    const general: Record<string, string> = {};
    for (const [field, answer] of Object.entries(allAnswers)) {
      if (answer === "") continue;
      /* Unknown fields default to clinical. See CLINICAL_FIELDS. */
      (CLINICAL_FIELDS.get(field) !== false ? clinical : general)[field] =
        answer;
    }
    if (outcome.reasons.length > 0) {
      clinical.triage_reasons = outcome.reasons.join("; ");
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
          service: allAnswers.service_selection ?? "",
          outcome: outcome.level,
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

      /*
       * `status` stays "sending" through the navigation so the button stays
       * disabled — going back to "idle" would re-enable it and let a slow
       * redirect be submitted twice.
       *
       * Where they land is the one thing the triage level decides on the site.
       * Green and amber are offered a booking; red is told a person will be in
       * touch, because red means the answers need review before any booking.
       * The amber-versus-green difference is an email to the clinic, which n8n
       * branches on from the `outcome` in the payload above — nothing here.
       */
      router.push(
        outcome.level === "red" ? "/quiz-thank-you/" : "/quiz-book/",
      );
    } catch {
      setProblem(
        "We could not send your answers just now. Please check your connection and try again.",
      );
      setStatus("idle");
    }
  };

  if (step === undefined) return null;

  const done = history.length;
  const progress = Math.round(
    (done / (done + longestRemaining(currentId))) * 100,
  );

  return (
    <div
      className="hhcp-qz-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Pre-screening quiz"
    >
      <style>{STYLES}</style>

      {/*
        The progress bar sits at the top of the overlay rather than inside the
        card. It measures the whole quiz, not the step you happen to be reading,
        and a card that scrolls would otherwise carry it out of view.
      */}
      <div className="hhcp-qz-topbar">
        <div
          className="hhcp-qz-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Quiz progress"
        >
          <div
            className="hhcp-qz-fill"
            style={{ width: `${step.kind === "exit" ? 100 : progress}%` }}
          />
        </div>
        <div className="hhcp-qz-topbar-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hhcp-qz-topbar-logo"
            src="/images/logo-colour.svg"
            alt="Horizon Health Care Partners"
            width={195}
            height={30}
          />
          {step.kind !== "exit" && (
            <p className="hhcp-qz-count font-roboto-mono">{`Step ${done}`}</p>
          )}
          <button
            type="button"
            className="hhcp-qz-close"
            onClick={onClose}
            aria-label="Close the quiz"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>
      </div>

      <section id="quiz" className={cn("hhcp-qz-section", className)}>
        <div className="hhcp-container hhcp-qz-container">
          <div
            className="hhcp-qz-card"
            data-variant={step.kind === "exit" ? step.variant : "question"}
          >

            <StepBody
              step={step}
              answers={answers}
              picked={picked}
              allAnswers={allAnswers}
              bmi={bmi}
              outcome={outcome}
              consents={consents}
              status={status}
              problem={problem}
              set={set}
              toggle={toggle}
              go={go}
              setConsents={setConsents}
              onSubmit={submit}
            />

              {history.length > 1 && (
                <button type="button" className="hhcp-qz-back" onClick={back}>
                  ← Back
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* -------------------------------------------------------------------------
     Step bodies
     ------------------------------------------------------------------------- */

  interface StepBodyProps {
    step: QuizStep;
    answers: Record<string, string>;
    picked: Record<string, string[]>;
    allAnswers: Record<string, string>;
    bmi: number | null;
    outcome: { level: TriageLevel; reasons: readonly string[] };
    consents: Record<string, boolean>;
    status: "idle" | "sending";
    problem: string;
    set: (name: string, value: string) => void;
    toggle: (field: string, option: string) => void;
    go: (from: QuizStep, answer: string) => void;
    setConsents: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  }

  function StepBody(props: StepBodyProps) {
    const { step } = props;

    switch (step.kind) {
      case "choice":
        return <ChoiceStep {...props} step={step} />;
      case "multi":
        return <MultiStep {...props} step={step} />;
      case "input":
        return <InputStep {...props} step={step} />;
      case "bmi":
        return <BmiStep {...props} step={step} />;
      case "summary":
        return <SummaryStep {...props} step={step} />;
      case "exit":
        return <ExitStep step={step} />;
      case "contact":
        return <ContactStep {...props} />;
      default: {
        /* A new step kind must be rendered here — this is a compile error until
           it is. Do not replace it with a null return. */
        const exhaustive: never = step;
        return exhaustive;
      }
    }
  }

  function QuestionHead({
    step,
  }: {
    step: Extract<QuizStep, { kind: "choice" | "multi" | "input" | "bmi" }>;
  }) {
    return (
      <>
        <h2 className="hhcp-qz-question font-dm-sans">{step.question}</h2>
        {step.note !== undefined && (
          <p className="hhcp-qz-note font-dm-sans">{step.note}</p>
        )}
      </>
    );
  }

  function ChoiceStep({
    step,
    answers,
    set,
    go,
  }: StepBodyProps & { step: Extract<QuizStep, { kind: "choice" }> }) {
    const chosen = answers[step.field] ?? "";
    const followUp = step.followUp;
    const advisory = step.optionNotes?.[chosen];
    const needsFollowUp = followUp !== undefined && followUp.when === chosen;

    /* An answer carrying an advisory or a follow-up has something more to show,
       so it waits for Continue. Every other answer is the click itself. */
    const waiting = advisory !== undefined || needsFollowUp;

    const choose = (option: string) => {
      set(step.field, option);
      const stops =
        step.optionNotes?.[option] !== undefined ||
        (followUp !== undefined && followUp.when === option);
      if (!stops) go(step, option);
    };

    return (
      <>
        <QuestionHead step={step} />
        <div className="hhcp-qz-options">
          {step.options.map((option) => (
            <button
              key={option}
              type="button"
              className="hhcp-qz-option"
              data-selected={option === chosen}
              onClick={() => choose(option)}
            >
              <span className="hhcp-qz-option-mark" aria-hidden="true" />
              <span>{option}</span>
            </button>
          ))}
        </div>

        {advisory !== undefined && (
          <p className="hhcp-qz-advisory font-dm-sans">{advisory}</p>
        )}

        {needsFollowUp && followUp !== undefined && (
          <div className="hhcp-form-field hhcp-qz-followup">
            <label className="hhcp-form-label" htmlFor={`quiz-${followUp.name}`}>
              {followUp.label}
            </label>
            <input
              id={`quiz-${followUp.name}`}
              className="hhcp-form-input"
              value={answers[followUp.name] ?? ""}
              onChange={(event) => set(followUp.name, event.target.value)}
            />
          </div>
        )}

        {waiting && (
          <button
            type="button"
            className="hhcp-btn hhcp-qz-submit"
            onClick={() => go(step, chosen)}
          >
            Continue
          </button>
        )}
      </>
    );
  }

  function MultiStep({
    step,
    answers,
    picked,
    set,
    toggle,
    go,
  }: StepBodyProps & { step: Extract<QuizStep, { kind: "multi" }> }) {
    const selected = picked[step.field] ?? [];
    const other = step.other;
    const otherText = other === undefined ? "" : (answers[other.name] ?? "");
    const answered = selected.length > 0 || otherText.trim() !== "";

    return (
      <>
        <QuestionHead step={step} />
        <p className="hhcp-qz-hint">Choose all that apply</p>

        <div className="hhcp-qz-options">
          {step.options.map((option) => {
            const on = selected.includes(option);
            const advisory = step.optionNotes?.[option];
            return (
              <div key={option}>
                <button
                  type="button"
                  className="hhcp-qz-option"
                  data-selected={on}
                  aria-pressed={on}
                  onClick={() => toggle(step.field, option)}
                >
                  <span
                    className="hhcp-qz-option-mark"
                    data-shape="box"
                    aria-hidden="true"
                  />
                <span>{option}</span>
              </button>
              {on && advisory !== undefined && (
                <p className="hhcp-qz-advisory font-dm-sans">{advisory}</p>
              )}
            </div>
          );
        })}
      </div>

      {other !== undefined && (
        <div className="hhcp-form-field hhcp-qz-followup">
          <label className="hhcp-form-label" htmlFor={`quiz-${other.name}`}>
            {other.label}
          </label>
          <input
            id={`quiz-${other.name}`}
            className="hhcp-form-input"
            placeholder="Optional"
            value={otherText}
            onChange={(event) => set(other.name, event.target.value)}
          />
        </div>
      )}

      <button
        type="button"
        className="hhcp-btn hhcp-qz-submit"
        disabled={!answered}
        onClick={() => go(step, selected.join(", "))}
      >
        Continue
      </button>
    </>
  );
}

function InputStep({
  step,
  answers,
  set,
  go,
}: StepBodyProps & { step: Extract<QuizStep, { kind: "input" }> }) {
  const complete = step.fields.every(
    (field) => (answers[field.name] ?? "").trim() !== "",
  );

  return (
    <>
      <QuestionHead step={step} />
      <div className={step.fields.length > 1 ? "hhcp-qz-pair" : undefined}>
        {step.fields.map((field) => (
          <div key={field.name} className="hhcp-form-field">
            <label className="hhcp-form-label" htmlFor={`quiz-${field.name}`}>
              {field.label}
            </label>
            <span className="hhcp-qz-unit-wrap">
              <input
                id={`quiz-${field.name}`}
                className="hhcp-form-input"
                type={field.type}
                inputMode={field.type === "number" ? "numeric" : undefined}
                min={field.min}
                max={field.max}
                placeholder={field.placeholder}
                value={answers[field.name] ?? ""}
                onChange={(event) => set(field.name, event.target.value)}
              />
              {field.unit !== undefined && (
                <span className="hhcp-qz-unit">{field.unit}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="hhcp-btn hhcp-qz-submit"
        disabled={!complete}
        onClick={() => go(step, "")}
      >
        Continue
      </button>
    </>
  );
}

function BmiStep({
  step,
  answers,
  bmi,
  set,
  go,
}: StepBodyProps & { step: Extract<QuizStep, { kind: "bmi" }> }) {
  return (
    <>
      <QuestionHead step={step} />
      <div className="hhcp-qz-pair">
        <div className="hhcp-form-field">
          <label className="hhcp-form-label" htmlFor="quiz-weight">
            Weight
          </label>
          <span className="hhcp-qz-unit-wrap">
            <input
              id="quiz-weight"
              className="hhcp-form-input"
              type="number"
              inputMode="numeric"
              min={30}
              max={400}
              placeholder="82"
              value={answers.wl_weight_kg ?? ""}
              onChange={(event) => set("wl_weight_kg", event.target.value)}
            />
            <span className="hhcp-qz-unit">kg</span>
          </span>
        </div>
        <div className="hhcp-form-field">
          <label className="hhcp-form-label" htmlFor="quiz-height">
            Height
          </label>
          <span className="hhcp-qz-unit-wrap">
            <input
              id="quiz-height"
              className="hhcp-form-input"
              type="number"
              inputMode="numeric"
              min={100}
              max={250}
              placeholder="175"
              value={answers.wl_height_cm ?? ""}
              onChange={(event) => set("wl_height_cm", event.target.value)}
            />
            <span className="hhcp-qz-unit">cm</span>
          </span>
        </div>
      </div>

      <p className="hhcp-qz-bmi font-dm-sans">
        {bmi === null ? (
          "Enter your weight and height and we will work out your BMI."
        ) : (
          <>
            <strong>{`Your BMI is ${bmi}.`}</strong> {bmiMessage(bmi)}
          </>
        )}
      </p>

      <button
        type="button"
        className="hhcp-btn hhcp-qz-submit"
        disabled={bmi === null}
        onClick={() => {
          if (bmi !== null) set("wl_bmi", String(bmi));
          go(step, "");
        }}
      >
        Continue
      </button>
    </>
  );
}

function SummaryStep({
  step,
  allAnswers,
  go,
}: StepBodyProps & { step: Extract<QuizStep, { kind: "summary" }> }) {
  return (
    <>
      <h2 className="hhcp-qz-question font-dm-sans">{step.heading}</h2>
      <p className="hhcp-qz-exit-body font-dm-sans">{step.body}</p>

      <dl className="hhcp-qz-rows">
        {summaryRows(allAnswers).map((row) => (
          <div key={row.label} className="hhcp-qz-row">
            <dt>{row.label}</dt>
            <dd className="font-dm-sans">{row.value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        className="hhcp-btn hhcp-qz-submit"
        onClick={() => go(step, "")}
      >
        Confirm answers
      </button>
    </>
  );
}

function ExitStep({ step }: { step: Extract<QuizStep, { kind: "exit" }> }) {
  return (
    <>
      <h2 className="hhcp-qz-exit-heading font-dm-sans">{step.heading}</h2>
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
  );
}

function ContactStep({
  allAnswers,
  outcome,
  consents,
  status,
  problem,
  setConsents,
  onSubmit,
}: StepBodyProps) {
  const messages =
    allAnswers.service_selection === "Weight Loss"
      ? TRIAGE_MESSAGES.weightLoss
      : TRIAGE_MESSAGES.general;
  const message = messages[outcome.level];

  return (
    <form onSubmit={onSubmit}>
      <div className="hhcp-qz-banner" data-level={outcome.level}>
        <h3 className="font-dm-sans">{message.heading}</h3>
        <p className="font-dm-sans">{message.body}</p>
      </div>

      <h2 className="hhcp-qz-question font-dm-sans">{QUIZ_CONTACT.heading}</h2>
      <p className="hhcp-qz-exit-body font-dm-sans">{QUIZ_CONTACT.body}</p>

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

      <div className="hhcp-qz-important">
        <h3>{QUIZ_CONTACT.important.heading}</h3>
        <p className="font-dm-sans">{QUIZ_CONTACT.important.body}</p>
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
            <span>{renderWithLinks(consent.label, consent.links)}</span>
          </label>
        ))}
      </div>

      <p className="hhcp-qz-privacy font-dm-sans">
        {renderWithLinks(QUIZ_CONTACT.privacyNote, QUIZ_CONTACT.privacyLinks)}
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
  );
}
