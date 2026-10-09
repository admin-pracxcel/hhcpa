import { describe, expect, it } from "vitest";

import { parseBookingHandoff } from "./booking-handoff";

/**
 * Every one of these falls through to the phone block on /quiz-book/, and
 * falling through is the behaviour worth protecting. A patient who reaches
 * that page must always be able to book; the wrong checkout is worse than a
 * phone number, so anything this cannot vouch for returns null.
 */
describe("parseBookingHandoff", () => {
  const good = {
    service: "Weight Management",
    level: "green",
    at: Date.now(),
  };

  it("reads a well-formed record", () => {
    const out = parseBookingHandoff(JSON.stringify(good));
    expect(out?.service).toBe("Weight Management");
    expect(out?.level).toBe("green");
  });

  it("keeps the Online Doctor branch and the fee when present", () => {
    const out = parseBookingHandoff(
      JSON.stringify({
        ...good,
        service: "Online Doctor",
        onlineDoctorKind: "A medical certificate",
        prescriptionFee: 29,
      }),
    );
    expect(out?.onlineDoctorKind).toBe("A medical certificate");
    expect(out?.prescriptionFee).toBe(29);
  });

  it("returns null for nothing at all", () => {
    for (const raw of [null, undefined, ""]) {
      expect(parseBookingHandoff(raw)).toBeNull();
    }
  });

  it("returns null for anything that is not a record", () => {
    for (const raw of ["{", "not json", "[]", "null", '"a string"', "42"]) {
      expect(parseBookingHandoff(raw), raw).toBeNull();
    }
  });

  it("returns null when a required field is missing or empty", () => {
    for (const bad of [
      { level: "green", at: Date.now() },
      { service: "Weight Management", at: Date.now() },
      { service: "Weight Management", level: "green" },
      { ...good, service: "" },
      { ...good, level: "" },
      { ...good, service: 7 },
      { ...good, at: "yesterday" },
      { ...good, at: Number.NaN },
    ]) {
      expect(parseBookingHandoff(JSON.stringify(bad))).toBeNull();
    }
  });

  it("returns null for a stale record", () => {
    /*
     * A tab left open. Someone coming back to it later should not be handed a
     * checkout built from a quiz they have forgotten taking.
     */
    const old = { ...good, at: Date.now() - 11 * 60 * 1000 };
    expect(parseBookingHandoff(JSON.stringify(old))).toBeNull();
  });

  it("returns null for a record from the future", () => {
    /* A clock that moved, or a hand-edited record. */
    const ahead = { ...good, at: Date.now() + 5 * 60 * 1000 };
    expect(parseBookingHandoff(JSON.stringify(ahead))).toBeNull();
  });

  it("accepts a record right up to the limit", () => {
    const edge = { ...good, at: Date.now() - 9 * 60 * 1000 };
    expect(parseBookingHandoff(JSON.stringify(edge))).not.toBeNull();
  });

  it("drops a fee that is not a number", () => {
    const out = parseBookingHandoff(
      JSON.stringify({ ...good, prescriptionFee: "29" }),
    );
    /* Not 29. A string here would sail through the === comparison that picks
       the $29 product over the $49 one and pick the wrong one. */
    expect(out?.prescriptionFee).toBeNull();
  });
});
