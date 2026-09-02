import { describe, expect, it } from "vitest";

import { QUIZ_CONSENTS, QUIZ_STEPS, findStep, nextStepId } from "./quiz";

/**
 * The flow is a graph held as data, so a typo in a `next` target is a dead end
 * a visitor walks into rather than a compile error. These assertions are the
 * substitute for the type system not being able to see it.
 */
describe("quiz flow", () => {
  const ids = new Set(QUIZ_STEPS.map((step) => step.id));

  it("has no duplicate step ids", () => {
    expect(ids.size).toBe(QUIZ_STEPS.length);
  });

  it("points every branch at a step that exists", () => {
    for (const step of QUIZ_STEPS) {
      if (step.kind === "bmi") {
        expect(ids, `${step.id} → ${step.next}`).toContain(step.next);
        continue;
      }
      if (step.kind !== "choice") continue;
      for (const [answer, target] of Object.entries(step.next)) {
        expect(ids, `${step.id} on "${answer}" → ${target}`).toContain(target);
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
      if (step === undefined) continue;
      if (step.kind === "bmi") queue.push(step.next);
      if (step.kind === "choice") queue.push(...Object.values(step.next));
    }
    for (const step of QUIZ_STEPS) {
      expect(seen, `${step.id} is unreachable`).toContain(step.id);
    }
  });

  it("ends every non-exit path at the contact step", () => {
    /* Walk each answer of each choice; a path must terminate at an exit or contact. */
    const walk = (id: string, depth: number): void => {
      expect(depth, `runaway path at ${id}`).toBeLessThan(20);
      const step = findStep(id);
      expect(step, `missing step ${id}`).toBeDefined();
      if (step === undefined) return;
      if (step.kind === "exit" || step.kind === "contact") return;
      if (step.kind === "bmi") {
        walk(step.next, depth + 1);
        return;
      }
      for (const option of step.options) {
        walk(nextStepId(step, option), depth + 1);
      }
    };
    walk("age", 0);
  });

  it("marks the three consents the API requires as required", () => {
    const required = QUIZ_CONSENTS.filter((consent) => consent.required).map(
      (consent) => consent.id,
    );
    expect(required).toEqual(["terms", "privacy", "clinicalUnderstanding"]);
  });

  it("keeps marketing consent optional", () => {
    const marketing = QUIZ_CONSENTS.find((consent) => consent.id === "marketing");
    expect(marketing?.required).toBe(false);
  });
});
