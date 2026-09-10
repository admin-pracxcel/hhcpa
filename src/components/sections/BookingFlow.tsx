"use client";

/**
 * What `/quiz-book/` renders: the intake form, then the booking widget.
 *
 * Steps 6 and 7 of HHCPA_Build_Spec_v2.3_Addendum §1, in that order. The
 * intake form is the clinical detail a practitioner reads before the
 * consultation; booking is what the patient came for.
 *
 * Three cases, and the fallback is the important one:
 *
 *   - Arrived from the quiz, with a form for their service: intake, then
 *     booking.
 *   - Arrived from the quiz, service has no form (Online Doctor, Continuity):
 *     straight to booking. Those two run no screening either — the
 *     consultation is the screening (v2.4 Q30).
 *   - Arrived some other way, or sessionStorage refused: straight to booking.
 *     A patient who reaches this page must always be able to book. The intake
 *     form is additive, and losing it costs a practitioner some reading rather
 *     than costing a patient their appointment.
 *
 * "Skip for now and book" is offered even when the form is shown, for the same
 * reason. It is a clinical convenience, not a gate.
 */

import { useState, useSyncExternalStore } from "react";

import { BookingPanel } from "./BookingPanel";
import { IntakeForm } from "./IntakeForm";
import { intakeFormFor, type IntakeForm as IntakeFormData } from "@/content/intake-forms";

interface Handoff {
  submissionId: string;
  service: string;
}

const HANDOFF_KEY = "hhcpa:intake";

/*
 * `useSyncExternalStore` rather than reading sessionStorage in an effect.
 *
 * The read is client-only, so the first render has to match the server's or
 * hydration mismatches — and the naive fix, setState inside useEffect, is a
 * cascading render and is what the lint rule objects to. This hook exists for
 * exactly this shape: React uses the server snapshot for the hydrating render
 * and the client one immediately after, with no extra state and no mismatch.
 *
 * Three values, deliberately distinct. `undefined` means "not known yet",
 * which renders nothing; `null` means "looked, found nothing", which books.
 * Collapsing those two would flash the booking widget before the intake form
 * replaced it, and that widget is a live third-party iframe.
 */
const subscribe = () => () => {};
const serverSnapshot = () => undefined;
const clientSnapshot = () => {
  try {
    return window.sessionStorage.getItem(HANDOFF_KEY);
  } catch {
    /* Private browsing can refuse. Treated as "nothing stored". */
    return null;
  }
};

function parseHandoff(
  raw: string | null | undefined,
): { handoff: Handoff; form: IntakeFormData } | null {
  if (raw === null || raw === undefined) return null;
  try {
    const parsed = JSON.parse(raw) as Handoff;
    const form = intakeFormFor(parsed.service);
    if (typeof parsed.submissionId !== "string" || form === undefined) {
      return null;
    }
    return { handoff: parsed, form };
  } catch {
    return null;
  }
}

export function BookingFlow() {
  const raw = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  /* Set from the form's own callback, which is an event handler. */
  const [dismissed, setDismissed] = useState(false);

  if (raw === undefined) return null;

  const pending = dismissed ? null : parseHandoff(raw);

  if (pending !== null) {
    return (
      <IntakeForm
        form={pending.form}
        submissionId={pending.handoff.submissionId}
        service={pending.handoff.service}
        onDone={() => {
          /*
           * Cleared on the way through, so a refresh does not offer the same
           * form again, and so an opaque id does not outlive its flow.
           */
          try {
            window.sessionStorage.removeItem(HANDOFF_KEY);
          } catch {
            /* Nothing to do; `dismissed` still moves the page on. */
          }
          setDismissed(true);
        }}
      />
    );
  }

  return <BookingPanel />;
}
