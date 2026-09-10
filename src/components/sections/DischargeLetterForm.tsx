"use client";

/**
 * The Discharge Letter form, on `/discharge/`.
 *
 * Build spec v2.3 §8. Her live page and the staging Transfer Your Care page
 * are the same page, not two — v2.2's Q11 assumed a new one and was corrected.
 * So this adds what hers has and staging did not: the form, and the upload.
 *
 * ─── THE UPLOAD ────────────────────────────────────────────────────────────
 *
 * A discharge letter is health information. There is no object storage on this
 * project, so the file is base64-encoded into the same webhook payload as
 * everything else — option (b) of the four v2.4 Q38 set out, chosen by Bilal
 * on 2026-09-10 after (a) was recommended against.
 *
 * What that means concretely, recorded because it is a deliberate trade:
 *   - the file crosses in a JSON body to n8n, which owns scanning and storage;
 *   - nothing on this side scans it, and nothing on this side keeps it;
 *   - the cap below exists because a base64 payload is a third larger than the
 *     file and n8n will reject a large one with an error the patient cannot
 *     act on. Better to say so before the upload than after.
 *
 * The free-text field is her "if you need support with acquiring a discharge
 * letter" box. It is the reason the upload can stay optional: a patient who
 * cannot get their letter still has a way through.
 *
 * ─── THE DISCOUNT ──────────────────────────────────────────────────────────
 *
 * Her live page ties 15% off to holding a valid discharge letter from a
 * current prescribing doctor. v2.4 Q32 retied it to transferring care and
 * asked for the terms stated on the page, because eligibility conditional on
 * holding a prescription, on the transfer path for the holistic service,
 * edges toward an inducement connected to a prescription-only medicine. Both
 * the retie and the terms are built and both need her approval.
 */

import { useState } from "react";

import { DISCHARGE_FORM } from "@/content/services/discharge";

/** Base64 inflates by about a third; n8n's default body cap is the real limit. */
const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

const STYLES = `
.hhcp-dl-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
  background: var(--hhcp-accent, #f5fff9);
}

.hhcp-dl-card {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--hhcp-space-l, 40px);
  border-radius: var(--hhcp-radius-m, 12px);
  background: #ffffff;
  border: 1px solid var(--hhcp-neutral-ultra-light, #d6e8e1);
}

.hhcp-dl-title {
  font-size: var(--hhcp-h3, 28px);
  line-height: 1.2;
  color: var(--hhcp-primary, #013126);
}

.hhcp-dl-group { margin-top: var(--hhcp-space-l, 40px); }

.hhcp-dl-group-title {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--hhcp-neutral-ultra-light, #d6e8e1);
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-primary, #013126);
}

.hhcp-dl-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--hhcp-space-s, 20px);
}

.hhcp-dl-field { margin-top: var(--hhcp-space-s, 20px); }

.hhcp-dl-label {
  display: block;
  margin-bottom: 6px;
  font-size: var(--hhcp-text-s, 14px);
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
}

.hhcp-dl-req { color: #b3261e; }

.hhcp-dl-input,
.hhcp-dl-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--hhcp-neutral-ultra-light, #d6e8e1);
  border-radius: var(--hhcp-radius-s, 6.667px);
  font: inherit;
  color: var(--hhcp-primary, #013126);
  background: #ffffff;
}

.hhcp-dl-textarea { min-height: 88px; resize: vertical; }

.hhcp-dl-hint {
  margin-top: 6px;
  font-size: var(--hhcp-text-xs, 12px);
  color: var(--hhcp-base-80, #34524a);
}

.hhcp-dl-terms {
  margin-top: var(--hhcp-space-l, 40px);
  padding: var(--hhcp-space-m, 30px);
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-neutral-ultra-light, #eef6f3);
  font-size: var(--hhcp-text-s, 14px);
  color: var(--hhcp-primary, #013126);
}

.hhcp-dl-terms strong { display: block; margin-bottom: 6px; }

.hhcp-dl-problem {
  margin-top: var(--hhcp-space-s, 20px);
  color: #b3261e;
  font-size: var(--hhcp-text-s, 14px);
}

.hhcp-dl-done {
  padding: var(--hhcp-space-m, 30px);
  border-radius: var(--hhcp-radius-s, 6.667px);
  background: var(--hhcp-accent, #f5fff9);
  color: var(--hhcp-primary, #013126);
}

@media (max-width: 767px) {
  .hhcp-dl-card { padding: var(--hhcp-space-m, 30px) var(--hhcp-space-s, 20px); }
  .hhcp-dl-pair { grid-template-columns: 1fr; }
}
`;

const readAsBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const result = String(reader.result ?? "");
      /* data:...;base64,XXXX — n8n wants the payload, not the prefix. */
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.readAsDataURL(file);
  });

export function DischargeLetterForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [problem, setProblem] = useState("");
  const [fileName, setFileName] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? "").trim();

    const missing = (["firstName", "lastName", "mobile", "email"] as const).filter(
      (name) => value(name) === "",
    );
    if (missing.length > 0) {
      setProblem("Please give us your name, mobile and email so we can reach you.");
      return;
    }

    const file = data.get("letter");
    let letter: { name: string; type: string; base64: string } | null = null;
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_BYTES) {
        setProblem(
          "That file is larger than 4MB. Please send a smaller scan, or leave it out and tell us below.",
        );
        return;
      }
      try {
        letter = {
          name: file.name,
          type: file.type,
          base64: await readAsBase64(file),
        };
      } catch {
        setProblem("We could not read that file. Please try another, or leave it out.");
        return;
      }
    }

    setProblem("");
    setStatus("sending");
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "discharge",
          submissionId: crypto.randomUUID(),
          service: "Transfer your care",
          intake: {
            formId: "HHCPA-DISCHARGE",
            formVersion: "1.0",
            formTitle: "Discharge Letter Form",
            answers: {
              firstName: value("firstName"),
              lastName: value("lastName"),
              mobile: value("mobile"),
              email: value("email"),
              previousClinic: value("previousClinic"),
              previousDoctor: value("previousDoctor"),
              help: value("help"),
            },
            /* Health information. Segregated with everything else clinical. */
            letter,
          },
        }),
      });
      if (!response.ok) {
        setProblem("We could not send that just now. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setProblem(
        "We could not send that just now. Please check your connection and try again.",
      );
      setStatus("idle");
    }
  };

  return (
    <section className="hhcp-dl-section" id="discharge-letter">
      <style>{STYLES}</style>
      <div className="hhcp-dl-card">
        {status === "done" ? (
          <div className="hhcp-dl-done font-dm-sans">
            <h2 className="hhcp-dl-title font-dm-sans">Thanks, we have that</h2>
            <p>
              We will be in touch to arrange your transfer consultation. If you
              still need help getting your discharge letter, we can help with
              that on the call.
            </p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 className="hhcp-dl-title font-dm-sans">{DISCHARGE_FORM.heading}</h2>

            <div className="hhcp-dl-group">
              <h3 className="hhcp-dl-group-title">Your details</h3>
              <div className="hhcp-dl-pair">
                <Field name="firstName" label="First name" required />
                <Field name="lastName" label="Last name" required />
              </div>
              <div className="hhcp-dl-pair">
                <Field name="mobile" label="Mobile" type="tel" required />
                <Field name="email" label="Email" type="email" required />
              </div>
            </div>

            <div className="hhcp-dl-group">
              <h3 className="hhcp-dl-group-title">Your current clinic</h3>
              <Field name="previousClinic" label="Previous clinic name" />
              <Field name="previousDoctor" label="Previous doctor's name" />

              <div className="hhcp-dl-field">
                <label className="hhcp-dl-label" htmlFor="dl-letter">
                  Upload your discharge letter
                </label>
                <input
                  id="dl-letter"
                  name="letter"
                  type="file"
                  accept={ACCEPT}
                  onChange={(event) =>
                    setFileName(event.target.files?.[0]?.name ?? "")
                  }
                />
                <p className="hhcp-dl-hint">
                  {fileName !== ""
                    ? `Selected: ${fileName}`
                    : "PDF, JPG or PNG, up to 4MB. Optional: if you do not have one yet, tell us below."}
                </p>
              </div>

              <div className="hhcp-dl-field">
                <label className="hhcp-dl-label" htmlFor="dl-help">
                  {DISCHARGE_FORM.helpLabel}
                </label>
                <textarea id="dl-help" name="help" className="hhcp-dl-textarea" />
              </div>
            </div>

            <div className="hhcp-dl-terms font-dm-sans">
              <strong>{DISCHARGE_FORM.offer}</strong>
              <p>{DISCHARGE_FORM.terms}</p>
            </div>

            {problem !== "" && (
              <p className="hhcp-dl-problem font-dm-sans" role="alert">
                {problem}
              </p>
            )}

            <div className="hhcp-dl-field">
              <button
                type="submit"
                className="hhcp-btn"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Complete"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="hhcp-dl-field">
      <label className="hhcp-dl-label" htmlFor={`dl-${name}`}>
        {label}
        {required && <span className="hhcp-dl-req"> *</span>}
      </label>
      <input
        id={`dl-${name}`}
        name={name}
        type={type}
        className="hhcp-dl-input"
        autoComplete={
          name === "firstName"
            ? "given-name"
            : name === "lastName"
              ? "family-name"
              : name === "email"
                ? "email"
                : name === "mobile"
                  ? "tel"
                  : "off"
        }
      />
    </div>
  );
}
