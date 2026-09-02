import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { QuizForm } from "./QuizForm";

/**
 * Two things are worth locking down here, and neither is cosmetic.
 *
 * A safety exit must not submit. Someone who says they are in crisis has given
 * no contact details and no consent, and forwarding a partial clinical record
 * of them would be both useless and wrong.
 *
 * Clinical answers must travel under the segregated `clinical` key. n8n routes
 * on that key to keep health-inferred data out of any marketing branch, so an
 * answer leaking into the open payload is a privacy defect, not a naming one.
 */
describe("quiz form", () => {
  const choose = (label: string) =>
    fireEvent.click(screen.getByRole("button", { name: label }));

  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("blocks under-18s without submitting anything", () => {
    render(<QuizForm />);
    choose("No");

    expect(screen.getByText("Unable to Proceed")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows crisis numbers and does not submit", () => {
    render(<QuizForm />);
    choose("Yes"); // 18 or older
    choose("Yes"); // in Australia
    choose("Mental Health");
    choose("Yes"); // diagnosed
    choose("Yes"); // on treatment
    choose("Yes"); // severe symptoms or crisis

    expect(screen.getByText("Crisis Support")).toBeTruthy();
    expect(screen.getByText("13 11 14")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
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

  it("segregates clinical answers in the submitted payload", async () => {
    render(<QuizForm />);
    choose("Yes");
    choose("Yes");
    choose("Mental Health");
    choose("Yes"); // diagnosed — clinical
    choose("No"); // on treatment — clinical
    choose("No"); // no crisis → contact step

    fireEvent.change(screen.getByLabelText("First name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText("Last name"), {
      target: { value: "Citizen" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "412345678" },
    });

    for (const box of screen.getAllByRole("checkbox")) {
      fireEvent.click(box);
    }

    fireEvent.click(screen.getByRole("button", { name: /get my results/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/quiz");
    const body = JSON.parse(String(init.body)) as {
      answers: Record<string, string>;
      clinical: Record<string, string>;
      service: string;
      consents: Record<string, boolean>;
    };

    expect(body.clinical.mh_diagnosed).toBe("Yes");
    expect(body.clinical.mh_severe_crisis).toBe("No");
    expect(body.answers.mh_diagnosed).toBeUndefined();
    expect(body.answers.service_selection).toBe("Mental Health");
    expect(body.service).toBe("Mental Health");
    expect(body.consents.terms).toBe(true);
    expect(body.consents.marketing).toBe(true);

    await screen.findByText("Thank you — we have your answers");
  });

  it("refuses to submit without the required consents", async () => {
    render(<QuizForm />);
    choose("Yes");
    choose("Yes");
    choose("Mental Health");
    choose("No");
    choose("No");
    choose("No");

    fireEvent.change(screen.getByLabelText("First name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText("Last name"), {
      target: { value: "Citizen" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "412345678" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /get my results/i }));

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
