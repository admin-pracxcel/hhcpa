import { describe, expect, it } from "vitest";

import {
  checkoutUrl,
  productsFor,
  type CheckoutProduct,
} from "./checkout-products";
import { PRICES } from "@/content/pricing";
import { QUIZ_STEPS } from "@/content/quiz";

/**
 * This file decides what a patient is charged, so its branches are asserted
 * rather than reviewed. Thirteen products are live; everything else must fall
 * through to the phone block rather than to a checkout that cannot complete.
 */
describe("checkout products", () => {
  const refs = (list: readonly CheckoutProduct[]) => list.map((p) => p.ref);

  describe("the six services with no connected calendar", () => {
    for (const service of [
      "Health Optimisation & Complete Wellness",
      "Men's Health",
      "Women's Health",
      "Mental Health Support",
      "Continuity & Preventative Health",
      "Holistic Care / Alternative Medicine",
    ]) {
      it(`${service} offers nothing`, () => {
        expect(productsFor({ service })).toEqual([]);
      });
    }
  });

  it("offers all four weight products", () => {
    expect(refs(productsFor({ service: "Weight Management" }))).toEqual([
      "weight-metabolic-health-initial",
      "weight-metabolic-health-short-follow-up",
      "weight-metabolic-health-long-complex-review",
      "weight-metabolic-health-pathology-results-review",
    ]);
  });

  describe("Online Doctor branches on what they came for", () => {
    const od = (kind: string, fee?: number | null) =>
      refs(
        productsFor({
          service: "Online Doctor",
          onlineDoctorKind: kind,
          prescriptionFee: fee,
        }),
      );

    it("sends a simple repeat to the $29 product", () => {
      expect(od("A prescription or repeat script", 29)).toEqual([
        "prescriptions-referrals-repeat-prescription-simple",
      ]);
    });

    it("sends anything else to the $49 review", () => {
      /*
       * Including a null fee. If the ladder did not run, the cheaper product
       * is the wrong guess to make — it is the one a patient would rather we
       * guessed, which is exactly why it must not be the default.
       */
      for (const fee of [49, null, undefined]) {
        expect(od("A prescription or repeat script", fee)).toEqual([
          "prescriptions-referrals-prescription-medication-review",
        ]);
      }
    });

    it("offers both certificate lengths", () => {
      expect(od("A medical certificate")).toEqual([
        "medical-certificates-single-day-certificate",
        "medical-certificates-multi-day-certificate-consultation",
      ]);
    });

    it("offers the five general-care products", () => {
      expect(od("General or everyday care")).toEqual([
        "general-gp-short",
        "general-gp-standard",
        "general-gp-long",
        "priority-after-hours-after-hours",
        "priority-after-hours-priority",
      ]);
    });

    it("offers nothing for referrals, which are not live", () => {
      expect(od("A pathology, imaging or specialist referral")).toEqual([]);
    });

    it("offers nothing for an answer it does not recognise", () => {
      expect(od("")).toEqual([]);
      expect(od("something else entirely")).toEqual([]);
      expect(refs(productsFor({ service: "Online Doctor" }))).toEqual([]);
    });
  });

  /**
   * The branch keys are the literal option strings from the quiz. If that
   * question is reworded, every Online Doctor patient silently falls through
   * to the phone block — a quiet failure, and this is what catches it.
   */
  it("branches on answers the quiz actually offers", () => {
    const step = QUIZ_STEPS.find((s) => s.id === "od_kind");
    expect(step, "od_kind step").toBeDefined();
    if (step === undefined || step.kind !== "choice") return;

    for (const option of step.options) {
      const result = productsFor({
        service: "Online Doctor",
        onlineDoctorKind: option,
        prescriptionFee: 29,
      });
      /* Referrals are the one option with nothing behind it, by design. */
      const expectEmpty = /referral/i.test(option);
      expect(result.length === 0, `${option}`).toBe(expectEmpty);
    }
  });

  /**
   * The portal's prices and the site's advertised prices come from different
   * places on purpose, and three of them are known to disagree. These pin the
   * ones that must not: a patient told a figure on /pricing/ and charged
   * another at checkout is the failure worth a test.
   */
  it("charges what the site advertises, where the two should agree", () => {
    const priceOf = (ref: string) => {
      for (const service of [
        "Weight Management",
        "Online Doctor",
      ] as const) {
        for (const kind of [
          "A prescription or repeat script",
          "A medical certificate",
          "General or everyday care",
        ]) {
          for (const fee of [29, 49]) {
            const hit = productsFor({
              service,
              onlineDoctorKind: kind,
              prescriptionFee: fee,
            }).find((p) => p.ref === ref);
            if (hit !== undefined) return hit.price;
          }
        }
      }
      return null;
    };

    expect(priceOf("weight-metabolic-health-initial")).toBe(
      PRICES.weightLossInitial.amount,
    );
    expect(priceOf("weight-metabolic-health-short-follow-up")).toBe(
      PRICES.weightLossFollowUp.amount,
    );
    expect(priceOf("medical-certificates-single-day-certificate")).toBe(
      PRICES.medicalCertificate.amount,
    );
    expect(priceOf("medical-certificates-multi-day-certificate-consultation"))
      .toBe(PRICES.medicalCertificateMultiDay.amount);
    expect(priceOf("prescriptions-referrals-repeat-prescription-simple")).toBe(
      PRICES.prescriptions.amount,
    );
    expect(
      priceOf("prescriptions-referrals-prescription-medication-review"),
    ).toBe(PRICES.prescriptionsComplex.amount);
    expect(priceOf("priority-after-hours-after-hours")).toBe(
      PRICES.afterHoursConsult.amount,
    );
    expect(priceOf("priority-after-hours-priority")).toBe(
      PRICES.priorityConsult.amount,
    );
  });

  describe("the URL", () => {
    const product = productsFor({ service: "Weight Management" })[0];

    it("carries the ref and nothing else", () => {
      const url = new URL(checkoutUrl(product));
      expect(url.origin).toBe("https://portal.horizonhealthcarepartners.com.au");
      expect(url.pathname).toBe("/book/consult");
      expect([...url.searchParams.keys()]).toEqual(["ref"]);
      expect(url.searchParams.get("ref")).toBe(product.ref);
    });

    it("never carries patient data or campaign parameters", () => {
      /*
       * This page is reached straight after answering clinical questions.
       * Anything added here travels into her portal's logs and into the
       * referrer of whatever loads next.
       */
      for (const service of ["Weight Management", "Online Doctor"]) {
        for (const kind of [
          "A medical certificate",
          "General or everyday care",
        ]) {
          for (const p of productsFor({
            service,
            onlineDoctorKind: kind,
            prescriptionFee: 29,
          })) {
            const url = checkoutUrl(p);
            expect(url, p.ref).not.toMatch(/utm_|email|name|phone|level|=green/i);
          }
        }
      }
    });
  });

  it("names no restricted term in any ref or label", () => {
    /*
     * Her catalogue includes a hormone-therapy product under its restricted
     * abbreviation. It is not in this file and must not arrive in one: these
     * strings are one import away from public copy.
     */
    const all = [
      ...productsFor({ service: "Weight Management" }),
      ...productsFor({
        service: "Online Doctor",
        onlineDoctorKind: "General or everyday care",
      }),
      ...productsFor({
        service: "Online Doctor",
        onlineDoctorKind: "A medical certificate",
      }),
    ];
    for (const p of all) {
      expect(`${p.ref} ${p.label} ${p.note ?? ""}`).not.toMatch(
        /\bTRT\b|testosterone|peptide|cannabis|semaglutide|ozempic|wegovy/i,
      );
    }
  });
});
