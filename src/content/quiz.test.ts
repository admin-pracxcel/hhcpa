import { describe, expect, it } from "vitest";

import {
  BMI_BANDS,
  NONE_OF_THESE,
  QUIZ_CONSENTS,
  QUIZ_STEPS,
  REQUIRED_CONSENT_IDS,
  bmiMessage,
  calculateBmi,
  findStep,
  nextStepId,
  triage,
} from "./quiz";
import type { QuizStep } from "./quiz";

/** Every step id a step can lead to. */
function targetsOf(step: QuizStep): readonly string[] {
  switch (step.kind) {
    case "choice":
      return Object.values(step.next);
    case "multi":
    case "input":
    case "bmi":
    case "summary":
      return [step.next];
    case "exit":
    case "contact":
      return [];
  }
}

/**
 * The flow is a graph held as data, so a typo in a `next` target is a dead end
 * a patient walks into rather than a compile error. These assertions are the
 * substitute for the type system not being able to see it.
 */
describe("quiz flow", () => {
  const ids = new Set(QUIZ_STEPS.map((step) => step.id));

  it("has no duplicate step ids", () => {
    expect(ids.size).toBe(QUIZ_STEPS.length);
  });

  it("points every branch at a step that exists", () => {
    for (const step of QUIZ_STEPS) {
      for (const target of targetsOf(step)) {
        expect(ids, `${step.id} → ${target}`).toContain(target);
      }
    }
  });

  it("resolves every offered option to a next step", () => {
    for (const step of QUIZ_STEPS) {
      if (step.kind !== "choice") continue;
      for (const option of step.options) {
        expect(nextStepId(step, option), `${step.id} / ${option}`).not.toBe("");
      }
    }
  });

  it("reaches every step from the first question", () => {
    const seen = new Set<string>();
    const queue = ["age"];
    while (queue.length > 0) {
      const id = queue.pop() as string;
      if (seen.has(id)) continue;
      seen.add(id);
      const step = findStep(id);
      if (step !== undefined) queue.push(...targetsOf(step));
    }
    for (const step of QUIZ_STEPS) {
      expect(seen, `${step.id} is unreachable`).toContain(step.id);
    }
  });

  it("ends every path at an exit or the closing step", () => {
    const walk = (id: string, depth: number): void => {
      expect(depth, `runaway path at ${id}`).toBeLessThan(40);
      const step = findStep(id);
      expect(step, `missing step ${id}`).toBeDefined();
      if (step === undefined) return;
      if (step.kind === "exit" || step.kind === "contact") return;
      for (const target of targetsOf(step)) walk(target, depth + 1);
    };
    walk("age", 0);
  });

  it("offers a way to answer 'none' on every multi-select", () => {
    for (const step of QUIZ_STEPS) {
      if (step.kind !== "multi") continue;
      expect(step.options, `${step.id}`).toContain(NONE_OF_THESE);
    }
  });

  it("gives every follow-up a trigger that is one of the options", () => {
    for (const step of QUIZ_STEPS) {
      if (step.kind !== "choice" || step.followUp === undefined) continue;
      expect(step.options, `${step.id}`).toContain(step.followUp.when);
    }
  });

  it("marks the sensitive branches clinical", () => {
    /* Anything a patient would call medical must be segregated in the payload. */
    for (const step of QUIZ_STEPS) {
      if (step.kind !== "choice" && step.kind !== "multi") continue;
      if (/^(mh_|hl_|wl_|ho_)/.test(step.field) && step.field !== "ho_primary_goal") {
        expect(step.clinical, `${step.field}`).toBe(true);
      }
    }
  });
});

describe("bmi", () => {
  it("computes weight over height squared", () => {
    /* 96kg at 1.78m = 30.3 */
    expect(calculateBmi("178", "96")).toBe(30.3);
  });

  it("refuses nonsense rather than returning Infinity", () => {
    expect(calculateBmi("0", "96")).toBeNull();
    expect(calculateBmi("", "")).toBeNull();
    expect(calculateBmi("abc", "96")).toBeNull();
  });

  it("uses the >= 27 band at exactly 27", () => {
    expect(bmiMessage(27)).toBe(BMI_BANDS[0].message);
    expect(bmiMessage(26.9)).toBe(BMI_BANDS[1].message);
  });

  it("uses the healthy-range band below 25", () => {
    expect(bmiMessage(24.9)).toBe(BMI_BANDS[2].message);
    expect(bmiMessage(25)).toBe(BMI_BANDS[1].message);
  });

  it("always returns a message", () => {
    for (const value of [0, 12, 25, 26.9, 27, 40, 90]) {
      expect(bmiMessage(value), `${value}`).not.toBe("");
    }
  });
});

/**
 * Triage decides whether a submission is auto-bookable. Getting it wrong in the
 * lenient direction sends someone to a booking they should not have, so the
 * red rules are asserted individually rather than as a group.
 */
describe("triage", () => {
  it("is green when nothing is flagged", () => {
    expect(triage({ ho_pregnancy: "No", ho_cancer: "No" }).level).toBe("green");
  });

  it("is red for pregnancy, from either branch", () => {
    expect(triage({ ho_pregnancy: "Yes" }).level).toBe("red");
    expect(
      triage({ wl_life_events: "Ceasing sport, Currently pregnant" }).level,
    ).toBe("red");
  });

  it("is red for active cancer treatment but amber for a past diagnosis", () => {
    expect(triage({ ho_cancer: "Yes", ho_cancer_active: "Yes" }).level).toBe(
      "red",
    );
    expect(triage({ ho_cancer: "Yes", ho_cancer_active: "No" }).level).toBe(
      "amber",
    );
  });

  it("is red for an organ condition that is not controlled", () => {
    expect(
      triage({ ho_organ_condition: "Yes", ho_organ_controlled: "No" }).level,
    ).toBe("red");
    expect(
      triage({ ho_organ_condition: "Yes", ho_organ_controlled: "Yes" }).level,
    ).toBe("amber");
  });

  it("is amber for someone already under a GP or specialist", () => {
    /*
     * Reads ho_under_specialist, which is the field the step writes — its id is
     * ho_specialist, and triage() checked the id for a while, so this rule
     * silently never fired.
     */
    expect(triage({ ho_under_specialist: "Yes" }).level).toBe("amber");
  });

  it("lets red win over amber", () => {
    const result = triage({ ho_under_specialist: "Yes", ho_pregnancy: "Yes" });
    expect(result.level).toBe("red");
  });

  it("does not treat 'None of these' medications as a flag", () => {
    expect(triage({ wl_medications: NONE_OF_THESE }).level).toBe("green");
    expect(triage({ wl_medications: "Lithium" }).level).toBe("amber");
  });

  it("explains itself", () => {
    const result = triage({ ho_pregnancy: "Yes" });
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});

describe("consents", () => {
  it("requires everything except marketing", () => {
    expect(REQUIRED_CONSENT_IDS).toEqual([
      "terms",
      "healthInfo",
      "noGuarantee",
      "practitionerDecision",
    ]);
  });

  it("keeps marketing consent optional", () => {
    const marketing = QUIZ_CONSENTS.find(
      (consent) => consent.id === "marketing",
    );
    expect(marketing?.required).toBe(false);
  });

  it("links every document it names", () => {
    for (const consent of QUIZ_CONSENTS) {
      for (const link of consent.links ?? []) {
        expect(consent.label, consent.id).toContain(link.text);
      }
    }
  });
});
