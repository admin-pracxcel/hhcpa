import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
}));

import { SiteHeader } from "@/components/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/SiteHeader";
import { StickyMobileCta } from "./StickyMobileCta";
import { CLINIC } from "@/content/clinic";

/**
 * Every "Book a consultation" on the site points at /quiz/. On the two pages
 * that follow the quiz that is a loop, and on /quiz-thank-you/ — where a red
 * outcome lands — it invites someone who has just been told this is not
 * suitable for them to go and book it anyway.
 */
describe("the chrome after the quiz", () => {
  beforeEach(() => {
    pathname.current = "/";
  });

  const bookingCtas = (root: HTMLElement) =>
    Array.from(root.querySelectorAll<HTMLAnchorElement>("a[href]")).filter(
      (a) =>
        /book a consultation/i.test(a.textContent ?? "") &&
        a.getAttribute("href") === "/quiz/",
    );

  describe("SiteHeader", () => {
    it("carries the booking CTA on an ordinary page", () => {
      const { container } = render(<SiteHeader />);
      /* The bar and the drawer each hold one. */
      expect(bookingCtas(container)).toHaveLength(2);
    });

    for (const route of ["/quiz-book", "/quiz-thank-you"]) {
      it(`drops it on ${route}`, () => {
        pathname.current = route;
        const { container } = render(<SiteHeader />);
        expect(bookingCtas(container)).toHaveLength(0);
      });

      it(`keeps a way to reach a person on ${route}`, () => {
        pathname.current = route;
        const { container } = render(<SiteHeader />);
        const phones = Array.from(
          container.querySelectorAll<HTMLAnchorElement>("a[href]"),
        ).filter((a) => a.getAttribute("href") === CLINIC.phoneHref);
        /* The bar's number, and the drawer CTA that replaced the booking one. */
        expect(phones.length).toBeGreaterThanOrEqual(2);
      });
    }
  });

  describe("StickyMobileCta", () => {
    it("offers both halves on an ordinary page", () => {
      const { container } = render(<StickyMobileCta />);
      expect(bookingCtas(container)).toHaveLength(1);
      expect(screen.getByText("Call us")).toBeTruthy();
    });

    for (const route of ["/quiz-book", "/quiz-thank-you"]) {
      it(`leaves only the call half on ${route}`, () => {
        /*
         * This bar sits over the checkout buttons on a phone. Without this the
         * fix would work on a desktop and nowhere else.
         */
        pathname.current = route;
        const { container } = render(<StickyMobileCta />);
        expect(bookingCtas(container)).toHaveLength(0);
        expect(screen.getByText(`Call ${CLINIC.phone}`)).toBeTruthy();
      });
    }
  });
});
