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
/* Ranjeeta's four, verbatim. Pinned here character for character, because
   they name another business and distinguish two healthcare providers. */
const TRANSFERRING =
  "I am transferring from another clinic and would like to become a patient of HHCPA.";
const EXISTING_PATIENT = "I am an existing HHCPA patient submitting a document.";
const NEW_PATIENT_CHOICE = "I am a new patient wanting to book a consultation.";
const WRONG_CLINIC =
  "I am looking for Horizon Health Clinic (a different business).";

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

  it("offers her four options, in her words", async () => {
    render(<DischargeLetterForm />);
    fill();
    complete();
    await screen.findByRole("dialog");
    for (const label of [
      TRANSFERRING,
      EXISTING_PATIENT,
      NEW_PATIENT_CHOICE,
      WRONG_CLINIC,
    ]) {
      expect(
        screen.getByRole("button", { name: label }).textContent,
        label,
      ).toBe(label);
    }
  });

  it("submits for someone transferring from another clinic", async () => {
    render(<DischargeLetterForm />);
    fill();
    complete();
    fireEvent.click(
      await screen.findByRole("button", { name: TRANSFERRING }),
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith("/discharge-thank-you/"),
    );
  });

  it("records which option they chose, per option", async () => {
    for (const [label, expected] of [
      [TRANSFERRING, "transferring_from_another_clinic"],
      [EXISTING_PATIENT, "existing_hhcpa_patient"],
    ] as const) {
      fetchMock.mockClear();
      const view = render(<DischargeLetterForm />);
      fill();
      complete();
      fireEvent.click(await screen.findByRole("button", { name: label }));
      await waitFor(() => expect(fetchMock).toHaveBeenCalled());
      const [, call] = fetchMock.mock.calls[0] as unknown as [
        string,
        RequestInit,
      ];
      expect(JSON.parse(String(call.body)).intake.answers.confirmation_choice).toBe(
        expected,
      );
      view.unmount();
    }
  });

  it("carries confirmation_choice alongside the real answers", async () => {
    render(<DischargeLetterForm />);
    fill();
    complete();
    fireEvent.click(
      await screen.findByRole("button", { name: TRANSFERRING }),
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    expect(body.intake.answers.confirmation_choice).toBe(
      "transferring_from_another_clinic",
    );
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

  /*
   * ⚠️ The assertion the whole change exists for.
   *
   * Someone looking for Horizon Health Clinic must not be able to send
   * medical records to HHCPA. Not tagged afterwards and filtered — unable
   * to send at all, because an enquiry that never posts cannot reach an
   * inbox or a report.
   */
  describe("someone looking for the other clinic", () => {
    async function pickWrongClinic() {
      render(<DischargeLetterForm />);
      fill();
      complete();
      fireEvent.click(
        await screen.findByRole("button", { name: WRONG_CLINIC }),
      );
    }

    it("cannot submit anything", async () => {
      await pickWrongClinic();
      await waitFor(() =>
        expect(screen.queryByRole("button", { name: TRANSFERRING })).toBeNull(),
      );
      expect(fetchMock).not.toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
    });

    it("is left with no way forward but closing", async () => {
      await pickWrongClinic();
      await waitFor(() =>
        expect(screen.queryByRole("button", { name: TRANSFERRING })).toBeNull(),
      );
      /* Every other choice is gone too — it is a stop, not a branch. */
      for (const label of [EXISTING_PATIENT, NEW_PATIENT_CHOICE, WRONG_CLINIC]) {
        expect(screen.queryByRole("button", { name: label }), label).toBeNull();
      }
      const buttons = screen.getAllByRole("button", { hidden: false });
      const inDialog = buttons.filter((b) =>
        b.closest('[role="dialog"]') !== null,
      );
      expect(inDialog).toHaveLength(1);
      expect(inDialog[0].getAttribute("aria-label")).toMatch(/close/i);
    });

    it("is told the two businesses are unaffiliated, in her words", async () => {
      await pickWrongClinic();
      expect(
        await screen.findByText(
          /is an independent telehealth provider and is not affiliated with Horizon Health Clinic/,
        ),
      ).toBeTruthy();
    });

    it("can go back to the form with everything still typed", async () => {
      await pickWrongClinic();
      fireEvent.click(screen.getByRole("button", { name: /close/i }));
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
      expect(
        (screen.getByLabelText(/first name/i) as HTMLInputElement).value,
      ).toBe("Test");
      expect(fetchMock).not.toHaveBeenCalled();
    });
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
