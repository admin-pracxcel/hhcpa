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

  describe("the fall-through to the phone block", () => {
    it("offers nothing for a service the quiz does not have", () => {
      expect(productsFor({ service: "Dentistry" })).toEqual([]);
      expect(productsFor({ service: "" })).toEqual([]);
    });

    /*
     * Health Optimisation is the one quiz service deliberately without a
     * checkout. Its refs exist and its calendar may well answer — the hold
     * is on Jamie's training, not on the link — so the phone block is doing
     * real work here: it stops a patient buying a consultation nobody is
     * trained to deliver yet.
     */
    it("offers nothing for health optimisation while the hold is on", () => {
      expect(
        productsFor({ service: "Health Optimisation & Complete Wellness" }),
      ).toEqual([]);
    });

    /*
     * Everything else the quiz offers must reach a checkout. Smoking /
     * Vaping Cessation, Menopause / Perimenopause and the hormone-therapy
     * products are also dark, but none is a `service_selection` option, so
     * no quiz answer can reach them.
     */
    it("leaves no other quiz service without products", () => {
      const step = QUIZ_STEPS.find((s) => s.id === "service");
      expect(step, "service step").toBeDefined();
      if (step === undefined || step.kind !== "choice") return;

      const held = "Health Optimisation & Complete Wellness";

      for (const service of step.options.filter((s) => s !== held)) {
        /*
         * Every branch of every service, because two of them answer a second
         * question before they have products. Undefined covers the services
         * that take no sub-answer at all.
         */
        const best = [
          undefined,
          "Chronic Disease Management",
          "A prescription or repeat script",
          "A medical certificate",
          "General or everyday care",
          "A pathology, imaging or specialist referral",
        ].reduce(
          (most, answer) =>
            Math.max(
              most,
              productsFor({
                service,
                continuityFocus: answer,
                onlineDoctorKind: answer,
                prescriptionFee: 29,
              }).length,
            ),
          0,
        );
        expect(best, `${service} has no checkout`).toBeGreaterThan(0);
      }
    });
  });

  /*
   * Lit on 2026-10-26. Ranjeeta called these "Jamie's links"; the refs were
   * on the original spreadsheet and the URLs name no practitioner, so these
   * assert the refs and prices from that spreadsheet, unchanged.
   */
  describe("the services Jamie's list turned on (2026-10-26)", () => {
    it("offers two holistic care tiers", () => {
      const list = productsFor({
        service: "Holistic Care / Alternative Medicine",
      });
      expect(refs(list)).toEqual([
        "holistic-alternative-care-initial",
        "holistic-alternative-care-follow-up",
      ]);
      expect(list.map((p) => p.price)).toEqual([69, 59]);
    });

    /*
     * Holistic Care is the medicinal cannabis pathway under a compliant
     * name — see the block above its products. Nothing user-facing says so,
     * which makes it the easiest service on the site to switch off by
     * accident while "tidying up the ones nobody books". Ranjeeta asked for
     * it live on 2026-10-26 because a patient could not book one.
     */
    it("keeps holistic care bookable", () => {
      expect(
        productsFor({ service: "Holistic Care / Alternative Medicine" }).length,
      ).toBe(2);
    });

    it("matches the service strings the quiz actually sends", () => {
      /* "Holistic Care / Alternative Medicine" on the question against
         "Holistic / Alternative Care" on her spreadsheet — the quiz's
         wording is the one this file has to branch on. */
      const step = QUIZ_STEPS.find((s) => s.id === "service");
      if (step === undefined || step.kind !== "choice") return;
      expect(step.options).toContain("Holistic Care / Alternative Medicine");
      expect(step.options).toContain(
        "Health Optimisation & Complete Wellness",
      );
    });
  });

  describe("the services Dr Yulia's list turned on (2026-10-14)", () => {
    const refs2 = (list: readonly CheckoutProduct[]) => list.map((p) => p.ref);

    it("offers three men's health tiers", () => {
      expect(refs2(productsFor({ service: "Men's Health" }))).toEqual([
        "mens-health-short",
        "mens-health-standard",
        "mens-health-initial-long",
      ]);
    });

    it("offers three women's health tiers", () => {
      expect(refs2(productsFor({ service: "Women's Health" }))).toEqual([
        "womens-health-short",
        "womens-health-standard",
        "womens-health-initial-long",
      ]);
    });

    it("offers three mental health tiers", () => {
      expect(refs2(productsFor({ service: "Mental Health Support" }))).toEqual([
        "mental-health-short",
        "mental-health-standard",
        "mental-health-initial-long",
      ]);
    });

    it("sends chronic disease management to its own refs", () => {
      /*
       * `cp_focus`'s first option. Same three prices as the continuity set,
       * different refs — the patient cannot tell them apart and should not
       * need to; the ref is what routes them in her portal.
       */
      const chronic = productsFor({
        service: "Continuity & Preventative Health",
        continuityFocus: "Chronic Disease Management",
      });
      expect(refs2(chronic)).toEqual([
        "chronic-disease-management-short",
        "chronic-disease-management-standard",
        "chronic-disease-management-long",
      ]);
      expect(chronic.map((p) => p.price)).toEqual([69, 89, 119]);
    });

    it("sends every other kind of ongoing care to the continuity refs", () => {
      const step = QUIZ_STEPS.find((s) => s.id === "cp_focus");
      expect(step, "cp_focus step").toBeDefined();
      if (step === undefined || step.kind !== "choice") return;

      for (const option of step.options) {
        const got = refs2(
          productsFor({
            service: "Continuity & Preventative Health",
            continuityFocus: option,
          }),
        );
        const chronic = option === "Chronic Disease Management";
        expect(got[0], option).toBe(
          chronic
            ? "chronic-disease-management-short"
            : "continuity-preventative-health-short",
        );
      }
    });

    it("falls back to continuity when the question was never answered", () => {
      expect(
        refs2(productsFor({ service: "Continuity & Preventative Health" }))[0],
      ).toBe("continuity-preventative-health-short");
    });

    it("offers all three referral kinds, because the quiz asks for one", () => {
      /* The question is "a pathology, imaging or specialist referral" and
         does not ask which, so the patient picks here. */
      expect(
        refs2(
          productsFor({
            service: "Online Doctor",
            onlineDoctorKind: "A pathology, imaging or specialist referral",
          }),
        ),
      ).toEqual([
        "prescriptions-referrals-pathology-referral",
        "prescriptions-referrals-imaging-referral",
        "prescriptions-referrals-specialist-allied-health-referral",
      ]);
    });

    it("keeps priority and after-hours, which are not on her list", () => {
      /*
       * The union, not the replacement. Her file omits them because she does
       * not do after-hours; they were live before it arrived and taking them
       * out would have cost the general-care path two buttons.
       */
      const general = refs2(
        productsFor({
          service: "Online Doctor",
          onlineDoctorKind: "General or everyday care",
        }),
      );
      expect(general).toContain("priority-after-hours-after-hours");
      expect(general).toContain("priority-after-hours-priority");
    });
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
      /* Every option now has products behind it. */
      expect(result.length, `${option}`).toBeGreaterThan(0);
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

  it("lets a product have no note, but never an empty one", () => {
    /*
     * A missing note is allowed. Several products have none on purpose: a
     * note may state a verifiable fact and nothing else, and for those tiers
     * anything we could write would be our guess at which one a patient
     * should pick rather than something her catalogue says.
     *
     * ⚠️ The three General GP tiers are the gap worth closing. They are bare
     * because we do not have her consultation durations — minutes would say
     * what the removed guidance tried to, as fact. Ask her for them, then add
     * notes here; nothing else changes.
     *
     * What this does still hold is that a note, where there is one, is real
     * text. An empty string renders an empty line under the label.
     */
    const kinds = [
      "A prescription or repeat script",
      "A medical certificate",
      "General or everyday care",
    ];
    const all = [
      ...productsFor({ service: "Weight Management" }),
      ...kinds.flatMap((kind) => [
        ...productsFor({
          service: "Online Doctor",
          onlineDoctorKind: kind,
          prescriptionFee: 29,
        }),
        ...productsFor({
          service: "Online Doctor",
          onlineDoctorKind: kind,
          prescriptionFee: 49,
        }),
      ]),
    ];
    const seen = new Set<string>();
    for (const p of all) {
      seen.add(p.ref);
      if (p.note !== undefined) expect(p.note.trim(), p.ref).not.toBe("");
    }
    expect(seen.size, "all thirteen live products").toBe(13);
  });

  it("promises nothing about availability at the point of payment", () => {
    /*
     * "First available appointment" sat on the $99 priority button. Whatever
     * her service boxes say, an availability claim must not be the last thing
     * a patient reads before they are charged — it is unresolved with her.
     */
    const all = [
      ...productsFor({ service: "Weight Management" }),
      ...productsFor({
        service: "Online Doctor",
        onlineDoctorKind: "General or everyday care",
      }),
    ];
    for (const p of all) {
      expect(`${p.label} ${p.note ?? ""}`, p.ref).not.toMatch(
        /first available|next available|same.?day|guaranteed|immediately/i,
      );
    }
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
