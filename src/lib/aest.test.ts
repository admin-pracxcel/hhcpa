import { describe, expect, it } from "vitest";

import { aestDate, aestDateTime } from "./aest";

describe("AEST timestamps", () => {
  it("formats the date as year-month-day", () => {
    // 2026-09-02T04:00:00Z is 14:00 on the 2nd in Brisbane.
    const date = new Date("2026-09-02T04:00:00Z");
    expect(aestDate(date)).toBe("2026-09-02");
    expect(aestDateTime(date)).toBe("2026-09-02 14:00:00 +10:00");
  });

  it("rolls the date over at the Brisbane day boundary, not UTC's", () => {
    // 22:30 UTC on the 1st is already 08:30 on the 2nd in Brisbane.
    const date = new Date("2026-09-01T22:30:00Z");
    expect(aestDate(date)).toBe("2026-09-02");
  });

  it("stays on +10 during southern daylight saving", () => {
    /*
     * January is AEDT (+11) in Sydney and Melbourne but still +10 in Brisbane.
     * 2026-01-15T04:00:00Z is 14:00 Brisbane and 15:00 Sydney; a Sydney zone
     * would stamp the wrong hour and label it AEST.
     */
    const date = new Date("2026-01-15T04:00:00Z");
    expect(aestDateTime(date)).toBe("2026-01-15 14:00:00 +10:00");
  });

  it("renders midnight as 00, not 24", () => {
    // 14:00 UTC is midnight the next day in Brisbane.
    const date = new Date("2026-09-01T14:00:00Z");
    expect(aestDateTime(date)).toBe("2026-09-02 00:00:00 +10:00");
    expect(aestDate(date)).toBe("2026-09-02");
  });
});
