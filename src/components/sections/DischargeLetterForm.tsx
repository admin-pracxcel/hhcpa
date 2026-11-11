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

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { findCountry } from "@/content/countries";
import { getAttribution } from "@/lib/attribution";
import { getLeadFields } from "@/lib/lead-fields";
import { toReadable } from "@/lib/readable";
import { DISCHARGE_FORM } from "@/content/services/discharge";
import { PhoneField } from "./PhoneField";
import { primeRecaptcha, recaptchaToken } from "@/lib/recaptcha";
import { RecaptchaNotice } from "@/components/RecaptchaNotice";

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


@media (max-width: 991px) {
  .hhcp-dl-card { padding: var(--hhcp-space-m, 30px); }
}

@media (max-width: 478px) {
  .hhcp-dl-card { padding: var(--hhcp-space-s, 20px); }
  .hhcp-dl-pair { grid-template-columns: 1fr; }
}

/* ---------- Confirmation dialog ---------- */
/*
 * Fixed to the viewport and centred, with the page dimmed behind it.
 *
 * position:fixed and a flex centre rather than a transform: the panel's
 * height depends on how the two labels wrap, and the first of them is a long
 * sentence that runs to three lines on a narrow phone. Centring by transform
 * would need a height this does not have.
 */
.hhcp-dlc-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(1, 49, 38, 0.55);
  overflow-y: auto;
}

.hhcp-dlc-panel {
  position: relative;
  width: 100%;
  max-width: 420px;
  margin: auto;
  padding: 32px 24px 24px;
  border-radius: 10px;
  background: var(--hhcp-white, #ffffff);
  box-shadow: 0 18px 50px rgba(1, 49, 38, 0.25);
}

/*
 * 44px, which is the smallest target a thumb reliably hits. The icon inside
 * is 16px; the rest is the tap area, which is why the button is bigger than
 * it looks.
 */
.hhcp-dlc-close {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--hhcp-primary, #013126);
  cursor: pointer;
  transition: background-color 0.2s linear;
}

.hhcp-dlc-close:hover {
  background: var(--hhcp-accent, #f5fff9);
}

.hhcp-dlc-question {
  margin: 0 0 20px;
  padding-right: 32px;
  font-size: 18px;
  line-height: 1.4;
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
}

/* Stacked, always. Side by side would halve the width of a label that needs
   all of it. */
.hhcp-dlc-choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/*
 * Full width, left-aligned, and tall enough to tap. min-height rather than
 * a fixed height because the first label wraps to three lines on a narrow
 * screen and a fixed height would clip it.
 */
.hhcp-dlc-choice {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 56px;
  padding: 14px 18px;
  border: 1px solid var(--hhcp-base-20, #d6e8e1);
  border-radius: 8px;
  background: var(--hhcp-white, #ffffff);
  color: var(--hhcp-primary, #013126);
  font-size: 15px;
  line-height: 1.4;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s linear;
}

.hhcp-dlc-choice:hover {
  border-color: var(--hhcp-primary, #013126);
  background: var(--hhcp-accent, #f5fff9);
}

.hhcp-dlc-choice--primary {
  border-color: var(--hhcp-primary, #013126);
  background: var(--hhcp-primary, #013126);
  color: var(--hhcp-white, #ffffff);
}

.hhcp-dlc-choice--primary:hover {
  background: #01241c;
  color: var(--hhcp-white, #ffffff);
}

.hhcp-dlc-close:focus-visible,
.hhcp-dlc-choice:focus-visible {
  outline: 2px solid var(--hhcp-primary, #013126);
  outline-offset: 2px;
}

@media (max-width: 478px) {
  .hhcp-dlc-panel {
    padding: 30px 18px 20px;
  }

  .hhcp-dlc-question {
    font-size: 17px;
  }
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

/**
 * The confirmation shown before a discharge letter is sent.
 *
 * ⚠️ The practice name in `discharge` is required verbatim, full and
 * unabbreviated. It is written out rather than built from `CLINIC.name`
 * because the two are not the same string — CLINIC.name is "Horizon Health
 * Care Partners" and this must end "Australia" — and because this is
 * specified copy rather than a label that should follow a rename.
 * `DischargeLetterForm.test.tsx` pins it character for character.
 */
const CONFIRM = {
  question: "Before we submit this, could you confirm what you are here for?",
  discharge:
    "I am submitting a discharge letter for Horizon Health Care Partners Australia",
  newPatient: "I am a new patient looking to book a consultation",
  close: "Close",
} as const;

/** Recorded on every submission that reaches n8n. */
const CONFIRMATION_CHOICE = "discharge_letter";

export function DischargeLetterForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [problem, setProblem] = useState("");
  const [fileName, setFileName] = useState("");
  const [confirming, setConfirming] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const completeRef = useRef<HTMLButtonElement>(null);
  const firstChoiceRef = useRef<HTMLButtonElement>(null);

  function closeConfirm() {
    setConfirming(false);
    /* Back to the button they pressed, with everything they typed intact —
       the form is never unmounted, so nothing is cleared. */
    completeRef.current?.focus();
  }

  /*
   * Escape closes the confirmation, same as the quiz overlay. A keydown
   * listener, not a scroll listener — AGENTS.md rules those out and there are
   * still none.
   */
  useEffect(() => {
    if (!confirming) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeConfirm();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirming]);

  /* Focus the first choice when the dialog opens, so a keyboard or screen
     reader user lands inside it rather than back at the top of the form. */
  useEffect(() => {
    if (confirming) firstChoiceRef.current?.focus();
  }, [confirming]);

  /**
   * Pressing Complete no longer sends anything.
   *
   * The browser has already run its own validation by the time this fires, so
   * required fields are filled; the checks below are the ones it cannot do.
   * Only once those pass does the confirmation open — asking someone to
   * confirm and then failing them on a missing field would be the wrong order.
   */
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
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

    const chosen = data.get("letter");
    if (chosen instanceof File && chosen.size > MAX_BYTES) {
      setProblem(
        "That file is larger than 4MB. Please send a smaller scan, or leave it out and tell us below.",
      );
      return;
    }

    setProblem("");
    setConfirming(true);
  };

  /** What Complete used to do, now reached only by confirming. */
  const send = async (form: HTMLFormElement) => {
    if (status === "sending") return;

    const data = new FormData(form);
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
      const captchaToken = await recaptchaToken("discharge");

      const response = await fetch("/api/quiz/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recaptchaToken: captchaToken,
          stage: "discharge",
          submissionId: crypto.randomUUID(),
          service: "Transfer your care",
          /* Lead country, source and page path — the same three every form
             sends. This form had none of them. */
          ...getLeadFields(),
          attribution: getAttribution(),
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
              /*
               * Which of the two things they confirmed they were here for.
               * Only one of them submits — a new patient is sent to the quiz
               * and nothing is posted — so this is always "discharge_letter"
               * today. It is sent anyway, so n8n can tell a confirmed
               * discharge submission from one made before this gate existed.
               */
              confirmation_choice: CONFIRMATION_CHOICE,
            },
            /*
             * The same answers with their on-screen labels, for the email n8n
             * sends the clinic. Written out rather than derived: these eight
             * labels are JSX props on the fields below, not data, and lifting
             * them into a list purely to derive this would move the copy away
             * from the form it belongs to.
             *
             * The letter itself is not here. It is a file, it is already
             * carried under `letter`, and an email is not where it belongs.
             */
            answersReadable: toReadable(
              {
                firstName: value("firstName"),
                lastName: value("lastName"),
                mobile:
                  value("mobile") === ""
                    ? ""
                    : `${mobileCountry.dial} ${value("mobile")}`,
                email: value("email"),
                previousClinic: value("previousClinic"),
                previousDoctor: value("previousDoctor"),
                help: value("help"),
              },
              new Map([
                ["firstName", "First Name"],
                ["lastName", "Last Name"],
                ["mobile", "Mobile Contact"],
                ["email", "Your Email"],
                ["previousClinic", "Previous Clinic Name"],
                ["previousDoctor", "Previous Doctor's Name"],
                ["help", DISCHARGE_FORM.helpLabel],
              ]),
            ),
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
      /*
       * `status` stays "sending" through the navigation so the button stays
       * disabled — going back to idle would re-enable it and let a slow
       * redirect be submitted twice. Same reason as the contact form.
       */
      router.push("/discharge-thank-you/");
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
      {/*
        aria-label, not visible text: her form carries a hidden <legend>
        reading "Discharge Letter Form", which is its accessible name. Same
        name here, nothing added to the page.
      */}
      <form
        ref={formRef}
        onSubmit={submit}
        onFocus={primeRecaptcha}
        aria-label="Discharge Letter Form"
      >
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

        {/*
          Still type="submit", so the browser runs its own validation first
          and `submit` only opens the confirmation once the form is fillable.
          A type="button" here would skip that and let someone confirm an
          empty form.
        */}
        <button
          ref={completeRef}
          type="submit"
          className="hhcp-btn hhcp-dl-submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Complete"}
        </button>

        <p className="hhcp-dl-offer font-dm-sans">{DISCHARGE_FORM.offer}</p>
        <RecaptchaNotice />
      </form>

      {confirming && (
        <div
          className="hhcp-dlc-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hhcp-dlc-question"
          /*
            Clicking the dimmed area closes, like the close icon. Guarded on
            the target so a click that starts inside the panel and drifts out
            does not dismiss it.
          */
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeConfirm();
          }}
        >
          <div className="hhcp-dlc-panel">
            <button
              type="button"
              className="hhcp-dlc-close"
              onClick={closeConfirm}
              aria-label={CONFIRM.close}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>

            <p id="hhcp-dlc-question" className="hhcp-dlc-question font-dm-sans">
              {CONFIRM.question}
            </p>

            <div className="hhcp-dlc-choices">
              <button
                ref={firstChoiceRef}
                type="button"
                className="hhcp-dlc-choice hhcp-dlc-choice--primary font-dm-sans"
                onClick={() => {
                  setConfirming(false);
                  const form = formRef.current;
                  if (form !== null) void send(form);
                }}
              >
                {CONFIRM.discharge}
              </button>

              {/* Nothing is submitted and nothing is posted — they are simply
                  sent to the quiz, which is where a new patient belongs. */}
              <button
                type="button"
                className="hhcp-dlc-choice font-dm-sans"
                onClick={() => {
                  setConfirming(false);
                  router.push("/quiz/");
                }}
              >
                {CONFIRM.newPatient}
              </button>
            </div>
          </div>
        </div>
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
