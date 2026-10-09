import { describe, expect, it } from "vitest";

import { isExternalHref, externalLinkProps } from "./external-link";

describe("isExternalHref", () => {
  it("is true for another site", () => {
    for (const href of [
      "https://escript.link/",
      "https://www.linkedin.com/company/109897954/",
      "https://pracxcel.com.au",
      "http://example.com/page",
      "https://www.oaic.gov.au/",
    ]) {
      expect(isExternalHref(href), href).toBe(true);
    }
  });

  it("is false for anything that stays here or hands off to an app", () => {
    /*
     * tel: and mailto: matter most. Given target="_blank" they open a blank
     * tab that sits there after the dialler or mail client takes over.
     */
    for (const href of [
      "/pricing/",
      "/quiz/",
      "#discharge-letter",
      "tel:1300336572",
      "mailto:hello@horizonhealthcarepartners.com.au",
      "",
      "https://horizonhealthcarepartners.com.au/about-us/",
      "https://www.horizonhealthcarepartners.com.au/",
      "not a url",
    ]) {
      expect(isExternalHref(href), href).toBe(false);
    }
  });

  it("treats the booking portal as external, which it is", () => {
    /*
     * The subdomain is a different host and this says so. The same-tab
     * decision is made at the checkout button, not here — see the note in
     * lib/external-link.ts.
     */
    expect(
      isExternalHref(
        "https://portal.horizonhealthcarepartners.com.au/book/consult?ref=x",
      ),
    ).toBe(true);
  });
});

describe("externalLinkProps", () => {
  it("opens an offsite link in a new tab, with the referrer withheld", () => {
    /* This is a health site: the page a patient came from is itself an
       inference about them, so noreferrer sits beside noopener. */
    expect(externalLinkProps("https://escript.link/")).toEqual({
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });

  it("adds nothing to an internal link", () => {
    for (const href of ["/pricing/", "tel:1300336572", "#top"]) {
      expect(externalLinkProps(href), href).toEqual({});
    }
  });
});
