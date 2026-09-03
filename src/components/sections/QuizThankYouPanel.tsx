/**
 * The confirmation panel for `/quiz-thank-you/`, which has to know how the
 * submission was triaged.
 *
 * That difference is clinical rather than cosmetic: a red result tells the
 * patient their answers need review before any booking, and points them at
 * their GP and at 000. Landing every submission on one generic message would
 * have thrown that away.
 *
 * A client component only because the level is read from `sessionStorage` —
 * see `TRIAGE_STORAGE_KEY` for why it is stored there and not in the URL.
 *
 * "unknown" is the honest state for anyone arriving without having just
 * submitted: a bookmark, a back button, a shared link. It cannot claim to have
 * their answers, and it must not tell them their situation needs review.
 */

"use client";

import { useSyncExternalStore } from "react";

import { QUIZ_SUCCESS, TRIAGE_STORAGE_KEY } from "@/content/quiz";
import type { TriageLevel } from "@/content/quiz";
import { ThankYouPanel } from "./ThankYouPanel";

type Outcome = TriageLevel | "unknown";

function isLevel(value: string | null): value is TriageLevel {
  return value === "green" || value === "amber" || value === "red";
}

/*
 * Nothing to subscribe to: the value is written before the navigation that
 * lands here, and cannot change while this page is open.
 */
const subscribe = () => () => {};

/*
 * The value is deliberately left in place rather than consumed on arrival.
 *
 * Clearing it in an effect looked tidier and was wrong: on a full page load
 * React renders the server snapshot first and only reads the client one in a
 * passive effect afterwards, so the clear raced that read and won — every
 * submission, red included, landed on the neutral message. Verified in a
 * browser, which is the only place the ordering shows.
 *
 * The cost of leaving it is that reopening this URL later in the same tab
 * repeats the last result. That result is the same person's, in their own tab,
 * in storage the browser drops when the tab closes — and the quiz overwrites it
 * on every submission, so what is shown after a real one is always current.
 */

const readStored = () => window.sessionStorage.getItem(TRIAGE_STORAGE_KEY);

/* The server has no sessionStorage, so it renders the message for nobody. */
const readOnServer = () => null;

export function QuizThankYouPanel() {
  /*
   * useSyncExternalStore rather than useState in an effect. Reading a
   * client-only store during render would make the server and client disagree;
   * setting state from an effect would render twice and is what
   * react-hooks/set-state-in-effect exists to stop. This is the API for reading
   * something React does not own, and it takes the server snapshot separately
   * so hydration matches.
   */
  const stored = useSyncExternalStore(subscribe, readStored, readOnServer);
  const outcome: Outcome = isLevel(stored) ? stored : "unknown";

  const copy = QUIZ_SUCCESS[outcome];

  return (
    <ThankYouPanel
      heading={copy.heading}
      body={copy.body}
      primary={{ label: "Back to home", href: "/" }}
      secondary={{ label: "Read the knowledge hub", href: "/articles/" }}
    />
  );
}
