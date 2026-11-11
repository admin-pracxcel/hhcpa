import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import { DischargeLetterForm } from "./DischargeLetterForm";

/**
 * Pressing Complete no longer sends anything. It asks which of two people the
 * visitor is, because the form was collecting new patients who had no
 * discharge letter to send.
 */
const DISCHARGE_CHOICE =
  "I am submitting a discharge letter for Horizon Health Care Partners Australia";
const NEW_PATIENT_CHOICE = "I am a new patient looking to book a consultation";

function fill() {
  const set = (label: RegExp, value: string) =>
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  set(/first name/i, "Test");
  set(/last name/i, "Person");
  set(/mobile/i, "400000000");
  set(/email/i, "test@example.com");
}

function complete() {
  fireEvent.submit(screen.getByRole("button", { name: /^complete$/i }));
}

describe("discharge letter form", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    push.mockClear();
    fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("crypto", { randomUUID: () => "test-uuid" });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("sends nothing when Complete is pressed", async () => {
    render(<DischargeLetterForm />);
    fill();
    complete();

    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("asks the question in the words it was given", async () => {
    render(<DischargeLetterForm />);
    fill();
    complete();
    expect(
      await screen.findByText(
        "Before we submit this, could you confirm what you are here for?",
      ),
    ).toBeTruthy();
  });

  /* The practice name is required in full and unabbreviated. */
  it("names the practice exactly, on the first button", async () => {
    render(<DischargeLetterForm />);
    fill();
    complete();
    const button = await screen.findByRole("button", {
      name: DISCHARGE_CHOICE,
    });
    expect(button.textContent).toBe(DISCHARGE_CHOICE);
  });

  it("submits when they confirm the discharge letter", async () => {
    render(<DischargeLetterForm />);
    fill();
    complete();
    fireEvent.click(
      await screen.findByRole("button", { name: DISCHARGE_CHOICE }),
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/discharge-thank-you/"),
    );
  });

  it("carries confirmation_choice with the rest of the form data", async () => {
    render(<DischargeLetterForm />);
    fill();
    complete();
    fireEvent.click(
      await screen.findByRole("button", { name: DISCHARGE_CHOICE }),
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    expect(body.intake.answers.confirmation_choice).toBe("discharge_letter");
    /* Alongside the real answers, not instead of them. */
    expect(body.intake.answers.firstName).toBe("Test");
    expect(body.intake.answers.email).toBe("test@example.com");
  });

  it("sends a new patient to the quiz and posts nothing", async () => {
    render(<DischargeLetterForm />);
    fill();
    complete();
    fireEvent.click(
      await screen.findByRole("button", { name: NEW_PATIENT_CHOICE }),
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith("/quiz/"));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("closes on the close icon, keeping what they typed and sending nothing", async () => {
    render(<DischargeLetterForm />);
    fill();
    complete();
    fireEvent.click(await screen.findByRole("button", { name: /close/i }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    /* The form is never unmounted, so nothing is cleared. */
    expect(
      (screen.getByLabelText(/first name/i) as HTMLInputElement).value,
    ).toBe("Test");
  });

  it("closes on Escape without sending", async () => {
    render(<DischargeLetterForm />);
    fill();
    complete();
    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not open the confirmation on an incomplete form", () => {
    /* Asking someone to confirm and then failing them on a missing field is
       the wrong order. */
    render(<DischargeLetterForm />);
    complete();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is a modal dialog, labelled by its question", async () => {
    render(<DischargeLetterForm />);
    fill();
    complete();
    const dialog = await screen.findByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-labelledby")).toBe("hhcp-dlc-question");
  });
});
