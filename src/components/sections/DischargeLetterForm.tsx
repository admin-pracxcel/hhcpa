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

import { findCountry } from "@/content/countries";
import { DISCHARGE_FORM } from "@/content/services/discharge";
import { PhoneField } from "./PhoneField";

/** Base64 inflates by about a third; n8n's default body cap is the real limit. */
const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

const STYLES = `
/*
 * Her mint card, measured off the live page: rgba(180, 253, 236, 0.3) on
 * white, 48px of padding, a 10px radius, and 32px group headings. It is the
 * right-hand column of the grid in DischargeSwitch, so it sets no width of
 * its own.
 */
.hhcp-dl-card {
  padding: 48px;
  border-radius: 10px;
  background: rgba(180, 253, 236, 0.3);
}

.hhcp-dl-group + .hhcp-dl-group {
  margin-top: var(--hhcp-space-l, 40px);
}

.hhcp-dl-group-title {
  font-size: 32px;
  line-height: 1.2;
  font-weight: 400;
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

/*
 * PhoneField brings the contact form's own wrapper and label classes with it.
 * Inside this card they have to read as one of its fields, not as a transplant
 * from another page: same 20px gap above, same sentence-case label rather than
 * the contact form's uppercase mono.
 */
.hhcp-dl-card .hhcp-form-field {
  margin-top: var(--hhcp-space-s, 20px);
}

.hhcp-dl-card .hhcp-form-label {
  display: block;
  margin-bottom: 6px;
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif;
  font-size: var(--hhcp-text-s, 14px);
  font-weight: 500;
  letter-spacing: normal;
  text-transform: none;
  color: var(--hhcp-primary, #013126);
}

/* 14px, not 12, so these sit at the same 54px height as PhoneField's input —
   the mobile field is one of this column and must not be the odd one out. */
.hhcp-dl-input,
.hhcp-dl-textarea {
  width: 100%;
  padding: 14px;
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

/* Her file control is a pill button, not the browser's default row. */
.hhcp-dl-file { display: none; }

.hhcp-dl-file-button {
  display: inline-flex;
  align-items: center;
  padding: 12px 19.2px;
  border-radius: var(--hhcp-radius-pill, 999px);
  background: var(--hhcp-action, #58eda2);
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--hhcp-primary, #013126);
  cursor: pointer;
}

.hhcp-dl-file-button:hover { background: var(--hhcp-primary, #013126); color: var(--hhcp-action, #58eda2); }

.hhcp-dl-submit {
  width: 100%;
  margin-top: var(--hhcp-space-m, 30px);
  justify-content: center;
  border: 0;
  cursor: pointer;
}

.hhcp-dl-offer {
  margin-top: var(--hhcp-space-s, 20px);
  font-size: var(--hhcp-text-s, 14px);
  line-height: 20px;
  text-align: center;
  color: var(--hhcp-base-80, #34524a);
}

.hhcp-dl-problem {
  margin-top: var(--hhcp-space-s, 20px);
  color: #b3261e;
  font-size: var(--hhcp-text-s, 14px);
}

.hhcp-dl-done {
  font-size: 16px;
  line-height: 24px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-dl-done-title {
  margin-bottom: var(--hhcp-space-s, 20px);
  font-size: 32px;
  line-height: 1.2;
  font-weight: 400;
}

@media (max-width: 991px) {
  .hhcp-dl-card { padding: var(--hhcp-space-m, 30px); }
}

@media (max-width: 478px) {
  .hhcp-dl-card { padding: var(--hhcp-space-s, 20px); }
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

    const mobileCountry = findCountry(value("mobileCountry"));

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
              /* The national part alone is not dialable. Same three fields the
                 contact form sends, so n8n sees one shape for a phone number. */
              mobileCountry: mobileCountry.code,
              mobileDial: mobileCountry.dial,
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
    <div className="hhcp-dl-card" id="discharge-letter">
      <style>{STYLES}</style>
      {status === "done" ? (
        <div className="hhcp-dl-done font-dm-sans">
          <h2 className="hhcp-dl-done-title font-dm-sans">Thanks, we have that</h2>
          <p>
            We will be in touch to arrange your transfer consultation. If you
            still need help getting your discharge letter, we can help with
            that on the call.
          </p>
        </div>
      ) : (
        /*
         * aria-label, not visible text: her form carries a hidden <legend>
         * reading "Discharge Letter Form", which is its accessible name. Same
         * name here, nothing added to the page.
         */
        <form onSubmit={submit} aria-label="Discharge Letter Form">
          <div className="hhcp-dl-group">
            <h2 className="hhcp-dl-group-title font-dm-sans">
              {DISCHARGE_FORM.headings.details}
            </h2>
            <div className="hhcp-dl-pair">
              <Field name="firstName" label="First Name" required />
              <Field name="lastName" label="Last Name" required />
            </div>
            {/*
              Her page puts a country selector on this field. Ours is the same
              PhoneField the contact form uses, so there is one such control on
              the site rather than two that behave differently — and it defaults
              to Australia, where hers defaults to India.
            */}
            <PhoneField name="mobile" label="Mobile Contact" required />
            <Field name="email" label="Your Email" type="email" required />
          </div>

          <div className="hhcp-dl-group">
            <h2 className="hhcp-dl-group-title font-dm-sans">
              {DISCHARGE_FORM.headings.clinic}
            </h2>
            <Field name="previousClinic" label="Previous Clinic Name" />
            <Field name="previousDoctor" label="Previous Doctor's Name" />

            <div className="hhcp-dl-field">
              <label className="hhcp-dl-label" htmlFor="dl-letter">
                Upload Your Discharge Letter
              </label>
              {/* The input is hidden and the label is the control, which is
                  how her page renders it — a pill reading CHOOSE FILE. */}
              <input
                id="dl-letter"
                name="letter"
                type="file"
                className="hhcp-dl-file"
                accept={ACCEPT}
                onChange={(event) =>
                  setFileName(event.target.files?.[0]?.name ?? "")
                }
              />
              <label className="hhcp-dl-file-button" htmlFor="dl-letter">
                Choose file
              </label>
              {/*
                Her page has no hint line, so there is none here. This renders
                only once a file is picked, and is not an addition to her copy:
                the native input is hidden behind the pill above, so without it
                nothing on screen tells you the file attached. Oversized files
                still get their own message from the submit handler.
              */}
              {fileName !== "" && (
                <p className="hhcp-dl-hint">{`Selected: ${fileName}`}</p>
              )}
            </div>

            <div className="hhcp-dl-field">
              <label className="hhcp-dl-label" htmlFor="dl-help">
                {DISCHARGE_FORM.helpLabel}
              </label>
              <textarea id="dl-help" name="help" className="hhcp-dl-textarea" />
            </div>
          </div>

          {problem !== "" && (
            <p className="hhcp-dl-problem font-dm-sans" role="alert">
              {problem}
            </p>
          )}

          <button
            type="submit"
            className="hhcp-btn hhcp-dl-submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Complete"}
          </button>

          <p className="hhcp-dl-offer font-dm-sans">{DISCHARGE_FORM.offer}</p>
        </form>
      )}
    </div>
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
        {/* Decoration; `required` on the input is what announces it. */}
        {required && (
          <span className="hhcp-dl-req" aria-hidden="true">
            {" *"}
          </span>
        )}
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
