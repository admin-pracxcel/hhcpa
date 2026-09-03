import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { QuizForm } from "./QuizForm";

/*
 * The form navigates to /quiz-thank-you/ on success, and useRouter throws
 * outside an app-router tree. The push spy is also how the tests below assert
 * that a submission finished — there is no success screen to look for any more.
 */
const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

/**
 * What matters here is not the wiring, it is the four rules the flow exists to
 * enforce.
 *
 * A safety exit must not submit. Someone who says they are in crisis has given
 * no contact details and no consent, and forwarding a partial clinical record
 * of them would be both useless and wrong.
 *
 * A red triage must submit. Red means a human has to call the patient back,
 * which is impossible if the form discards them — this is the one thing that
 * distinguishes red from the "Unable to Proceed" dead ends it replaced.
 *
 * Clinical answers must travel under the segregated `clinical` key. n8n routes
 * on that key to keep health-inferred data out of any marketing branch, so an
 * answer leaking into the open payload is a privacy defect, not a naming one.
 *
 * The BMI band a patient is shown must match their number, because the message
 * states a treatment direction.
 */
describe("quiz form", () => {
  const choose = (label: string) =>
    fireEvent.click(screen.getByRole("button", { name: label }));

  const cont = () =>
    fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));

  const type = (label: string | RegExp, value: string) =>
    fireEvent.change(screen.getByLabelText(label), { target: { value } });

  /** Age gate, location gate, then a service. */
  const start = (service: string) => {
    choose("Yes");
    choose("Yes");
    choose(service);
  };

  /** Through the gates and the first two weight-loss questions. */
  const startWeightLoss = () => {
    start("Weight Loss");
    type("Date of birth", "1985-04-12");
    cont();
    choose("Female");
  };

  const fillContactAndSubmit = () => {
    type("First name", "Jane");
    type("Last name", "Citizen");
    type("Email", "jane@example.com");
    type("Phone number", "412345678");
    for (const box of screen.getAllByRole("checkbox")) fireEvent.click(box);
    fireEvent.click(screen.getByRole("button", { name: /get my results/i }));
  };

  const sentBody = () => {
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    return JSON.parse(String(init.body)) as {
      answers: Record<string, string>;
      clinical: Record<string, string>;
      service: string;
      outcome: string;
      consents: Record<string, boolean>;
    };
  };

  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    push.mockClear();
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /* ---------- safety ---------- */

  it("blocks under-18s without submitting anything", () => {
    render(<QuizForm />);
    choose("No");

    expect(screen.getByText("Unable to Proceed")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows crisis numbers and does not submit", () => {
    render(<QuizForm />);
    start("Mental Health");
    choose("Yes"); // diagnosed
    choose("Yes"); // on treatment
    choose("Yes"); // severe symptoms or crisis

    expect(screen.getByText("Crisis Support")).toBeTruthy();
    expect(screen.getByText("13 11 14")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
    /* And no thank-you page either: nothing was submitted to thank them for. */
    expect(push).not.toHaveBeenCalled();
  });

  it("walks back through the answers actually given", () => {
    render(<QuizForm />);
    choose("Yes");
    choose("Yes");
    expect(screen.getByText("What service are you interested in?")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(
      screen.getByText("Are you currently located in Australia?"),
    ).toBeTruthy();
  });

  /* ---------- BMI ---------- */

  it("shows the medication band at a BMI of 27 or over", () => {
    render(<QuizForm />);
    startWeightLoss();

    type("Weight", "96");
    type("Height", "178");

    expect(screen.getByText(/Your BMI is 30.3/)).toBeTruthy();
    expect(screen.getByText(/you might need medication/)).toBeTruthy();
  });

  it("shows the diet-and-activity band between 25 and 27", () => {
    render(<QuizForm />);
    startWeightLoss();

    type("Weight", "80"); // 1.78m → 25.2
    type("Height", "178");

    expect(screen.getByText(/reduced or a low energy diet/)).toBeTruthy();
  });

  it("shows the healthy-range band below 25", () => {
    render(<QuizForm />);
    startWeightLoss();

    type("Weight", "70"); // 1.78m → 22.1
    type("Height", "178");

    expect(screen.getByText(/within the healthy range/)).toBeTruthy();
  });

  /* ---------- advisories ---------- */

  it("shows the pregnancy advisory without ending the flow", () => {
    render(<QuizForm />);
    startWeightLoss();
    type("Weight", "96");
    type("Height", "178");
    cont();
    type("Waist circumference", "98");
    cont();
    choose("Caucasian");
    choose("None of these");
    cont();
    choose("No"); // family
    choose("No"); // childhood

    choose("Currently pregnant");
    expect(
      screen.getByText(/We advise you to consult your GP/),
    ).toBeTruthy();
    /* Advisory, not an exit — Continue is still there. */
    expect(screen.getByRole("button", { name: /^continue$/i })).toBeTruthy();
  });

  /* ---------- triage ---------- */

  it("submits a red triage rather than dead-ending it", async () => {
    render(<QuizForm />);
    start("Complete Wellness");
    choose("Healthy Ageing & Longevity");
    choose("No"); // prior therapy
    choose("No"); // under specialist
    choose("Yes"); // pregnant, planning or breastfeeding  → red
    choose("No"); // cancer
    choose("No"); // organ condition
    choose("No"); // prescription medications
    choose("No"); // injectable allergies

    expect(
      screen.getByText(/requires further review before booking/),
    ).toBeTruthy();

    fillContactAndSubmit();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(sentBody().outcome).toBe("red");

    /*
     * Red is the one outcome that must not be offered a booking: the whole
     * point of it is that a person reviews the answers first.
     */
    await waitFor(() => expect(push).toHaveBeenCalledWith("/quiz-thank-you/"));
    expect(push).not.toHaveBeenCalledWith("/quiz-book/");
  });

  it("triages a clean run green", async () => {
    render(<QuizForm />);
    start("Complete Wellness");
    choose("Mental Clarity & Focus");
    choose("No");
    choose("No");
    choose("No");
    choose("No");
    choose("No");
    choose("No");
    choose("No");

    fillContactAndSubmit();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(sentBody().outcome).toBe("green");
    await waitFor(() => expect(push).toHaveBeenCalledWith("/quiz-book/"));
  });

  it("offers amber a booking too, and leaves the review to n8n", async () => {
    render(<QuizForm />);
    start("Complete Wellness");
    choose("Healthy Ageing & Longevity");
    choose("No"); // prior therapy
    choose("Yes"); // under a specialist → amber
    choose("No"); // pregnancy
    choose("No"); // cancer
    choose("No"); // organ condition
    choose("No"); // prescription medications
    choose("No"); // injectable allergies

    fillContactAndSubmit();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(sentBody().outcome).toBe("amber");
    /*
     * Same destination as green. The patient's experience of the two is
     * identical; what separates them is an email the clinic gets, and that is
     * n8n's branch on the outcome above rather than anything the site does.
     */
    await waitFor(() => expect(push).toHaveBeenCalledWith("/quiz-book/"));
  });

  it("asks whether a cancer diagnosis is in active treatment", () => {
    render(<QuizForm />);
    start("Complete Wellness");
    choose("General Wellness Optimisation");
    choose("No");
    choose("No");
    choose("No");
    choose("Yes"); // ever diagnosed with cancer

    expect(
      screen.getByText("Are you currently receiving treatment for cancer?"),
    ).toBeTruthy();
  });

  /* ---------- payload ---------- */

  it("segregates clinical answers and keeps the goal in the open payload", async () => {
    render(<QuizForm />);
    start("Complete Wellness");
    choose("Energy, Vitality & Wellness");
    choose("No");
    choose("No");
    choose("No");
    choose("No");
    choose("No");
    choose("No");
    choose("No");

    fillContactAndSubmit();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/quiz");

    const body = sentBody();
    expect(body.clinical.ho_pregnancy).toBe("No");
    expect(body.answers.ho_pregnancy).toBeUndefined();
    /* A goal is a marketing-safe answer; the health questions are not. */
    expect(body.answers.ho_primary_goal).toBe("Energy, Vitality & Wellness");
    expect(body.answers.service_selection).toBe("Complete Wellness");
    expect(body.service).toBe("Complete Wellness");
    expect(body.consents.terms).toBe(true);
    expect(body.consents.marketing).toBe(true);
  });

  it("refuses to submit without the required consents", () => {
    render(<QuizForm />);
    start("Mental Health");
    choose("No");
    choose("No");
    choose("No");

    type("First name", "Jane");
    type("Last name", "Citizen");
    type("Email", "jane@example.com");
    type("Phone number", "412345678");

    fireEvent.submit(screen.getByRole("button", { name: /get my results/i }));

    expect(fetchMock).not.toHaveBeenCalled();
  });

  /* ---------- multi-select ---------- */

  it("makes 'None of these' exclusive both ways", () => {
    render(<QuizForm />);
    startWeightLoss();
    type("Weight", "96");
    type("Height", "178");
    cont();
    type("Waist circumference", "98");
    cont();
    choose("Caucasian");

    const selected = () =>
      screen
        .getAllByRole("button", { pressed: true })
        .map((element) => within(element).getAllByText(/.+/)[0].textContent);

    choose("Cholesterol");
    expect(selected()).toEqual(["Cholesterol"]);

    choose("None of these");
    expect(selected()).toEqual(["None of these"]);

    choose("Blood sugar");
    expect(selected()).toEqual(["Blood sugar"]);
  });
});
