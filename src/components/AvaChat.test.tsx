import { describe, expect, it, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));
/* next/script renders nothing useful in jsdom; a plain tag is enough to
   assert whether the widget was requested at all. */
vi.mock("next/script", () => ({
  default: (props: Record<string, unknown>) => (
    <script data-testid="ava" {...props} />
  ),
}));

import { AvaChat, isChatWithheld } from "./AvaChat";

describe("isChatWithheld", () => {
  it("withholds the three quiz routes, slashed or not", () => {
    for (const p of ["/quiz", "/quiz-book", "/quiz-thank-you"]) {
      expect(isChatWithheld(p), p).toBe(true);
      expect(isChatWithheld(`${p}/`), `${p}/`).toBe(true);
    }
  });

  it("allows every other page", () => {
    for (const p of [
      "/",
      "/pricing/",
      "/contact/",
      "/discharge/",
      "/discharge-thank-you/",
      "/thank-you/",
      "/online-doctor/mental-health/",
      "/quiz-booking/",
    ]) {
      expect(isChatWithheld(p), p).toBe(false);
    }
  });

  it("copes with no pathname", () => {
    expect(isChatWithheld(null)).toBe(false);
    expect(isChatWithheld("")).toBe(false);
  });
});

describe("AvaChat", () => {
  beforeEach(() => {
    pathname.current = "/";
    document.body.innerHTML = "";
  });

  it("loads the vendor's widget on an ordinary page, as specified", () => {
    const { getByTestId } = render(<AvaChat />);
    const tag = getByTestId("ava");
    expect(tag.getAttribute("src")).toBe("https://api.tellixai.com/widget.js");
    /* Verbatim, at her vendor's request. */
    expect(tag.getAttribute("data-client")).toBe(
      "89131950-b2c7-40c2-8a46-c54b57a86c77",
    );
    expect(tag.getAttribute("strategy")).toBe("afterInteractive");
  });

  it("requests nothing at all on a withheld route", () => {
    /* A fresh load of /quiz/ must not reach the vendor, not even once. */
    pathname.current = "/quiz/";
    const { queryByTestId } = render(<AvaChat />);
    expect(queryByTestId("ava")).toBeNull();
  });

  it("hides a widget that was already mounted before the visitor arrived", () => {
    /*
     * The case not rendering cannot cover: next/script does not unload, so
     * someone who opens the homepage and clicks through to the quiz would
     * otherwise carry the button onto it.
     */
    const host = document.createElement("div");
    host.setAttribute("data-capture-chat", "");
    document.body.appendChild(host);

    pathname.current = "/quiz-thank-you/";
    render(<AvaChat />);

    expect(host.style.getPropertyValue("display")).toBe("none");
    expect(host.style.getPropertyPriority("display")).toBe("important");
    expect(host.getAttribute("aria-hidden")).toBe("true");
  });

  it("gives it back when they leave the quiz", () => {
    /* Hidden rather than removed, because the script only mounts once — a
       removed host could not come back without a hard load. */
    const host = document.createElement("div");
    host.setAttribute("data-capture-chat", "");
    host.style.setProperty("display", "none", "important");
    host.setAttribute("aria-hidden", "true");
    document.body.appendChild(host);

    pathname.current = "/pricing/";
    render(<AvaChat />);

    expect(host.style.getPropertyValue("display")).toBe("");
    expect(host.getAttribute("aria-hidden")).toBeNull();
  });
});
