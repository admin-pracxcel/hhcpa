"use client";

/**
 * The newsletter signup, shared by the three email-only forms.
 *
 * There are three of them — the footer, the closing CTA band and the homepage
 * hero — and they are the same form in three places, so the submit, the
 * states and the messages live here once. Before this they were three copies
 * of `event.preventDefault()` and nothing else.
 *
 * `placement` is the only thing that differs between them, and it travels with
 * the payload so n8n can tell which of the three actually converts.
 *
 * It posts to `/api/newsletter`, not to n8n directly: the webhook URL stays
 * out of the client bundle and there is no cross-origin surface to spam from
 * another site. See that route for the rest of the reasoning.
 */

import { useCallback, useState } from "react";
import type { FormEvent } from "react";

import { getLeadSource } from "@/lib/attribution";

export type NewsletterPlacement = "footer" | "closing-cta" | "hero";

export type NewsletterStatus = "idle" | "sending" | "done" | "error";

export interface NewsletterSignup {
  email: string;
  setEmail: (value: string) => void;
  status: NewsletterStatus;
  /** Set only when `status` is "error"; safe to show to the visitor. */
  problem: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const GENERIC_PROBLEM =
  "Something went wrong. Please try again, or email us directly.";

export function useNewsletterSignup(
  placement: NewsletterPlacement,
): NewsletterSignup {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");
  const [problem, setProblem] = useState("");

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === "sending") return;

      const form = event.currentTarget;
      const data = new FormData(form);
      const address = String(data.get("email") ?? "").trim();

      /*
       * Checked here as well as on the server. The server is the one that
       * counts, but a round trip to be told the box is empty is a poor way to
       * find out.
       */
      if (address === "") {
        setStatus("error");
        setProblem("Please enter your email address.");
        return;
      }

      setStatus("sending");
      setProblem("");

      void (async () => {
        try {
          const response = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: address,
              company: String(data.get("company") ?? ""),
              formPlacement: placement,
              ...getLeadSource(),
              pagePath:
                typeof window === "undefined" ? "" : window.location.pathname,
            }),
          });

          if (!response.ok) {
            const body = (await response.json().catch(() => ({}))) as {
              error?: string;
            };
            setStatus("error");
            /*
             * The route answers 400 with a sentence worth showing and 502 with
             * the token "delivery-failed", which is not.
             */
            setProblem(
              body.error === undefined || body.error === "delivery-failed"
                ? GENERIC_PROBLEM
                : body.error,
            );
            return;
          }

          setStatus("done");
          setEmail("");
        } catch {
          setStatus("error");
          setProblem(GENERIC_PROBLEM);
        }
      })();
    },
    [placement, status],
  );

  return { email, setEmail, status, problem, onSubmit };
}
