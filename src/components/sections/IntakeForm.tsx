"use client";

/**
 * Step 6: the clinical intake form, between triage and booking.
 *
 * It renders on `/quiz-book/`, which is where a green or amber outcome lands.
 * A red outcome never reaches this page, so it never reaches this form —
 * which is the point of the ordering in HHCPA_Build_Spec_v2.3_Addendum §1: a
 * patient whose answers need review before booking should not have handed
 * over a full clinical history first.
 *
 * ─── WHAT IT SUBMITS, AND WHY IT IS A SECOND SUBMISSION ────────────────────
 *
 * The triage submission already fired at Step 5.5 with the contact details and
 * the screening answers. This is a separate POST carrying `stage: "intake"`
 * and the same `submissionId`, per the v2.4 answer to Q36.
 *
 * One submission at the end would have recreated the hole Q28 found: an
 * abandoned intake would emit nothing at all, and the patient who filled in
 * their name and phone number two screens earlier would vanish. Two
 * submissions means the clinic has the person either way, and the intake is
 * additive detail rather than the thing that makes them exist.
 *
 * ─── THE SIGNATURE ─────────────────────────────────────────────────────────
 *
 * Typed full legal name, with a timestamp, the form id and its version — and
 * `renderedAt`, a snapshot of the questions actually shown. "Version 1.1"
 * identifies her PDF; it does not identify what this flow put on screen, and a
 * signature is a signature of what was on screen. v2.2's answer to Q26 asks
 * for all of it.
 *
 * Where it ends up: n8n, like every other submission. Bilal settled this on
 * 2026-09-10 — the site posts to the webhook and the workflow owns storage and
 * retention from there. So this file's job is to send the whole record in one
 * piece: the answers, the signature, when it was signed, which form and
 * version, and the questions as shown. Nothing on this side is the archive.
 *
 * ─── SAFETY ────────────────────────────────────────────────────────────────
 *
 * FRM-004 asks whether the patient has recently had thoughts of harming
 * themselves or someone else. Answering yes surfaces the crisis numbers
 * immediately, above everything else, and sets `safetyFlag` on the submission.
 * It does not block submitting and it does not block leaving. Same rule as the
 * screening step, and for the same reason: a form that collects a disclosure
 * and tells nobody is worse than one that never asked.
 */

import { useMemo, useState } from "react";

import { EMERGENCY_CONTACTS } from "@/content/clinic";
import {
  INTAKE_CONFIRMATIONS,
  type IntakeField,
  type IntakeForm as IntakeFormData,
} from "@/content/intake-forms";

const STYLES = `
.hhcp-in-section {
  padding: var(--hhcp-section-space-s) var(--hhcp-gutter);
  background: var(--hhcp-accent, #f5fff9);
}

.hhcp-in-card {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--hhcp-space-l, 40px);
  border-radius: var(--hhcp-radius-m, 12px);
  background: #ffffff;
  border: 1px solid var(--hhcp-neutral-ultra-light, #d6e8e1);
}

.hhcp-in-eyebrow {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-in-title {
  margin-top: 8px;
  font-size: var(--hhcp-h3, 28px);
  line-height: 1.2;
  color: var(--hhcp-primary, #013126);
}

.hhcp-in-lede {
  margin-top: var(--hhcp-space-xs, 10px);
  color: var(--hhcp-base-80, #34524a);
}

.hhcp-in-group {
  margin-top: var(--hhcp-space-l, 40px);
}

.hhcp-in-group-title {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--hhcp-neutral-ultra-light, #d6e8e1);
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-primary, #013126);
}

.hhcp-in-field {
  margin-top: var(--hhcp-space-s, 20px);
}

.hhcp-in-label {
  display: block;
  margin-bottom: 6px;
  font-size: var(--hhcp-text-s, 14px);
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
}

.hhcp-in-req {
  color: #b3261e;
}

.hhcp-in-input,
.hhcp-in-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--hhcp-neutral-ultra-light, #d6e8e1);
  border-radius: var(--hhcp-radius-s, 6.667px);
  font: inherit;
  color: var(--hhcp-primary, #013126);
  background: #ffffff;
}

.hhcp-in-textarea { min-height: 88px; resize: vertical; }

.hhcp-in-input:focus-visible,
.hhcp-in-textarea:focus-visible {
  outline: 2px solid var(--hhcp-action-dark, #0c7340);
  outline-offset: 1px;
}

.hhcp-in-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hhcp-in-option {
  padding: 9px 14px;
  border: 1px solid var(--hhcp-neutral-ultra-light, #d6e8e1);
  border-radius: var(--hhcp-radius-pill, 999px);
  background: #ffffff;
  font: inherit;
  font-size: var(--hhcp-text-s, 14px);
  color: var(--hhcp-primary, #013126);
  cursor: pointer;
  transition: all 0.2s linear;
}

.hhcp-in-option[data-on="true"] {
  border-color: var(--hhcp-primary, #013126);
  background: var(--hhcp-accent, #f5fff9);
  font-weight: 500;
}

/* Crisis numbers, above everything else on the step. Same treatment the quiz
   uses inline: a red rule, the brand ground, full-contrast numbers. */
.hhcp-in-urgent {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: var(--hhcp-space-s, 20px);
  padding: 14px 16px 16px;
  border-left: 3px solid #b3261e;
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-accent, #f5fff9);
}

.hhcp-in-urgent a {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 14px;
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: rgba(1, 49, 38, 0.06);
  color: var(--hhcp-primary, #013126);
  text-decoration: none;
}

.hhcp-in-urgent strong {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-weight: 500;
}

.hhcp-in-declaration {
  margin-top: var(--hhcp-space-l, 40px);
  padding: var(--hhcp-space-m, 30px);
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-neutral-ultra-light, #eef6f3);
  color: var(--hhcp-primary, #013126);
}

.hhcp-in-check {
  display: flex;
  gap: 10px;
  margin-top: var(--hhcp-space-s, 20px);
  font-size: var(--hhcp-text-s, 14px);
  color: var(--hhcp-primary, #013126);
}

.hhcp-in-check input { margin-top: 3px; flex: none; }

.hhcp-in-problem {
  margin-top: var(--hhcp-space-s, 20px);
  color: #b3261e;
  font-size: var(--hhcp-text-s, 14px);
}

.hhcp-in-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: var(--hhcp-space-l, 40px);
}

.hhcp-in-skip {
  font-size: var(--hhcp-text-s, 14px);
  color: var(--hhcp-base-80, #34524a);
  text-decoration: underline;
  background: none;
  border: 0;
  cursor: pointer;
}

@media (max-width: 767px) {
  .hhcp-in-card { padding: var(--hhcp-space-m, 30px) var(--hhcp-space-s, 20px); }
  .hhcp-in-actions { flex-direction: column; align-items: stretch; }
}
`;

/** The field whose "Yes" is a self-harm disclosure. FRM-004 only. */
const SAFETY_FIELD = "self_harm";

interface IntakeFormProps {
  form: IntakeFormData;
  submissionId: string;
  service: string;
  onDone: () => void;
}

export function IntakeForm({
  form,
  submissionId,
  service,
  onDone,
}: IntakeFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [signature, setSignature] = useState("");
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [problem, setProblem] = useState("");

  const fields = useMemo(
    () => form.sections.flatMap((section) => section.fields),
    [form],
  );

  const disclosedSelfHarm = values[SAFETY_FIELD] === "Yes";

  const set = (name: string, value: string) =>
    setValues((current) => ({ ...current, [name]: value }));

  const toggle = (name: string, option: string) =>
    setValues((current) => {
      const chosen = (current[name] ?? "").split("; ").filter(Boolean);
      const next = chosen.includes(option)
        ? chosen.filter((x) => x !== option)
        : [...chosen, option];
      return { ...current, [name]: next.join("; ") };
    });

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const missing = fields.filter(
      (field) => field.required === true && (values[field.name] ?? "") === "",
    );
    if (missing.length > 0) {
      setProblem(`Please answer: ${missing.map((f) => f.label).join(", ")}.`);
      return;
    }
    if (INTAKE_CONFIRMATIONS.some((c) => confirmed[c.id] !== true)) {
      setProblem("Please confirm both statements above before submitting.");
      return;
    }
    if (signature.trim() === "") {
      setProblem("Please type your full legal name as your signature.");
      return;
    }

    setProblem("");
    setStatus("sending");
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "intake",
          submissionId,
          service,
          safetyFlag: disclosedSelfHarm,
          intake: {
            formId: form.id,
            formVersion: form.version,
            formTitle: form.title,
            answers: values,
            signature: signature.trim(),
            signedAt: new Date().toISOString(),
            confirmations: Object.fromEntries(
              INTAKE_CONFIRMATIONS.map((c) => [c.id, confirmed[c.id] === true]),
            ),
            /*
             * What was actually on screen. The version string identifies her
             * PDF; this identifies the form the patient signed, which is the
             * thing that matters if the wording is ever questioned.
             */
            renderedAt: fields.map((f) => ({ name: f.name, label: f.label })),
            declaration: form.declaration,
          },
        }),
      });
      if (!response.ok) {
        setProblem("We could not save your answers just now. Please try again.");
        setStatus("idle");
        return;
      }
      onDone();
    } catch {
      setProblem(
        "We could not save your answers just now. Please check your connection and try again.",
      );
      setStatus("idle");
    }
  };

  return (
    <section className="hhcp-in-section">
      <style>{STYLES}</style>
      <div className="hhcp-in-card">
        <p className="hhcp-in-eyebrow">
          Before your consultation · about {form.minutes} minutes
        </p>
        <h1 className="hhcp-in-title font-dm-sans">{form.title}</h1>
        <p className="hhcp-in-lede font-dm-sans">
          Your practitioner reads this before you meet, so the consultation can
          start with your situation rather than with the basics. You can book
          first and complete it afterwards if you would rather.
        </p>

        <form onSubmit={submit}>
          {form.sections.map((section) => (
            <div key={section.title} className="hhcp-in-group">
              <h2 className="hhcp-in-group-title">{section.title}</h2>
              {section.fields.map((field) => (
                <Field
                  key={field.name}
                  field={field}
                  value={values[field.name] ?? ""}
                  detail={values[`${field.name}_detail`] ?? ""}
                  onChange={(v) => set(field.name, v)}
                  onDetail={(v) => set(`${field.name}_detail`, v)}
                  onToggle={(option) => toggle(field.name, option)}
                />
              ))}
              {section.title === "Safety" && disclosedSelfHarm && (
                <div className="hhcp-in-urgent font-dm-sans">
                  {EMERGENCY_CONTACTS.map((line) => (
                    <a key={line.label} href={line.href}>
                      <span>{line.label}</span>
                      <strong>{line.number}</strong>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="hhcp-in-declaration font-dm-sans">
            <p>{form.declaration}</p>
            {INTAKE_CONFIRMATIONS.map((confirmation) => (
              <label key={confirmation.id} className="hhcp-in-check">
                <input
                  type="checkbox"
                  checked={confirmed[confirmation.id] === true}
                  onChange={(event) =>
                    setConfirmed((current) => ({
                      ...current,
                      [confirmation.id]: event.target.checked,
                    }))
                  }
                />
                <span>{confirmation.label}</span>
              </label>
            ))}
          </div>

          <div className="hhcp-in-field">
            <label className="hhcp-in-label" htmlFor="intake-signature">
              Full legal name (electronic signature){" "}
              <span className="hhcp-in-req">*</span>
            </label>
            <input
              id="intake-signature"
              className="hhcp-in-input"
              value={signature}
              onChange={(event) => setSignature(event.target.value)}
              autoComplete="name"
            />
          </div>

          {problem !== "" && (
            <p className="hhcp-in-problem font-dm-sans" role="alert">
              {problem}
            </p>
          )}

          <div className="hhcp-in-actions">
            <button
              type="submit"
              className="hhcp-btn"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Saving…" : "Save and continue to booking"}
            </button>
            <button type="button" className="hhcp-in-skip" onClick={onDone}>
              Skip for now and book
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  field,
  value,
  detail,
  onChange,
  onDetail,
  onToggle,
}: {
  field: IntakeField;
  value: string;
  detail: string;
  onChange: (value: string) => void;
  onDetail: (value: string) => void;
  onToggle: (option: string) => void;
}) {
  const id = `intake-${field.name}`;
  const label = (
    <label className="hhcp-in-label" htmlFor={id}>
      {field.label}
      {field.unit !== undefined && ` (${field.unit})`}
      {field.required === true && <span className="hhcp-in-req"> *</span>}
    </label>
  );

  if (field.kind === "single" || field.kind === "multi") {
    const chosen = value.split("; ").filter(Boolean);
    return (
      <div className="hhcp-in-field">
        <span className="hhcp-in-label">
          {field.label}
          {field.required === true && <span className="hhcp-in-req"> *</span>}
        </span>
        <div className="hhcp-in-options">
          {(field.options ?? []).map((option) => {
            const on =
              field.kind === "single" ? value === option : chosen.includes(option);
            return (
              <button
                key={option}
                type="button"
                className="hhcp-in-option"
                data-on={on}
                aria-pressed={on}
                onClick={() =>
                  field.kind === "single" ? onChange(option) : onToggle(option)
                }
              >
                {option}
              </button>
            );
          })}
        </div>
        {field.detailIf !== undefined && value === field.detailIf && (
          <div className="hhcp-in-field">
            <label className="hhcp-in-label" htmlFor={`${id}-detail`}>
              {field.detailLabel ?? "Please provide details"}
            </label>
            <textarea
              id={`${id}-detail`}
              className="hhcp-in-textarea"
              value={detail}
              onChange={(event) => onDetail(event.target.value)}
            />
          </div>
        )}
      </div>
    );
  }

  if (field.kind === "textarea") {
    return (
      <div className="hhcp-in-field">
        {label}
        <textarea
          id={id}
          className="hhcp-in-textarea"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="hhcp-in-field">
      {label}
      <input
        id={id}
        className="hhcp-in-input"
        type={field.kind === "number" ? "number" : field.kind === "date" ? "date" : "text"}
        value={value}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
