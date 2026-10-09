import { describe, expect, it } from "vitest";

import { isPostQuizRoute, POST_QUIZ_ROUTES } from "./post-quiz-routes";

describe("isPostQuizRoute", () => {
  it("matches both post-quiz pages, with or without a trailing slash", () => {
    for (const route of POST_QUIZ_ROUTES) {
      expect(isPostQuizRoute(route), route).toBe(true);
      expect(isPostQuizRoute(`${route}/`), `${route}/`).toBe(true);
    }
  });

  it("does not match the quiz itself or any ordinary page", () => {
    /*
     * /quiz/ renders no chrome at all, so it never asks. The rest keep their
     * CTA — this is a two-page exception, not a new rule about the site.
     */
    for (const path of [
      "/quiz",
      "/quiz/",
      "/",
      "/pricing",
      "/weight-management",
      "/online-doctor/medical-certificates",
      "/quiz-booking",
      "/quiz-book-something",
    ]) {
      expect(isPostQuizRoute(path), path).toBe(false);
    }
  });

  it("copes with no pathname at all", () => {
    expect(isPostQuizRoute(null)).toBe(false);
    expect(isPostQuizRoute("")).toBe(false);
  });
});
