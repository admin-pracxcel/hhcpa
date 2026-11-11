import { describe, expect, it } from "vitest";

import { TRANSFER_CARE } from "./transfer-your-care";
import { ROUTES } from "../routes";

/*
 * "Start your transfer" pointed at /quiz/ until 2026-11-11, on all five
 * CTAs. The quiz has no transfer in it — not a service option, not a branch,
 * not a checkout ref — so the button promised something its destination
 * could not deliver: the visitor landed on "What service are you interested
 * in?" with eight options, none of them a transfer.
 *
 * Pinned because the mistake is an easy one to repeat. /quiz/ is the right
 * destination for almost every other CTA on this site, so a later edit
 * "correcting" these back would look like tidying.
 */
describe("transfer your care", () => {
  const json = JSON.stringify(TRANSFER_CARE);
  const starts = (href: string) =>
    json.match(
      new RegExp(
        `"label":"Start your transfer","href":"${href.replace(/\//g, "\\/")}"`,
        "g",
      ),
    ) ?? [];

  it("starts a transfer where a transfer can actually be started", () => {
    expect(starts("/discharge/")).toHaveLength(5);
  });

  it("never sends a transfer to the quiz", () => {
    expect(starts("/quiz/")).toHaveLength(0);
  });

  it("points every link on the page at a route this site serves", () => {
    const known = new Set(ROUTES.map((route) => route.path));
    for (const match of json.match(/"href":"\/[^"]*"/g) ?? []) {
      const href = match.slice(8, -1);
      expect(known, href).toContain(href);
    }
  });
});
