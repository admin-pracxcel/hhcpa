/**
 * The site disclaimer, with its emergency numbers turned into tel: links.
 *
 * The disclaimer tells someone to call 000, Lifeline or Beyond Blue. On a
 * phone, which is most of the traffic, a number they have to memorise and
 * retype is a worse instruction than one they can press — and this is the one
 * line on the site where that matters.
 *
 * The numbers are not written out here. They are matched against
 * `EMERGENCY_CONTACTS`, which already holds each display number beside its
 * dialable href, so the link cannot dial something the text does not say. Add
 * a number there and it becomes clickable here with no further change; change
 * one and both move together.
 *
 * Returns fragments rather than parsing HTML out of the string. The disclaimer
 * is copy, it is subject to compliance review, and the moment markup goes into
 * it someone has to reason about escaping in a sentence whose exact wording is
 * the point.
 */

import type { ReactNode } from "react";

import { EMERGENCY_CONTACTS } from "@/content/clinic";

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/*
 * Longest first, so "1300 22 4636" is matched before any shorter number that
 * could sit inside it. The digit lookarounds stop a short number matching part
 * of a longer run — "000" must not match inside "10007".
 */
const NUMBERS = [...EMERGENCY_CONTACTS]
  .map((contact) => contact.number)
  .sort((a, b) => b.length - a.length);

const PATTERN = new RegExp(
  `(?<!\\d)(${NUMBERS.map(escape).join("|")})(?!\\d)`,
  "g",
);

const HREF = new Map(
  EMERGENCY_CONTACTS.map((contact) => [contact.number, contact.href]),
);

/**
 * Splits `text` on the emergency numbers and wraps each one in a tel: link.
 *
 * Anything that is not a number comes through untouched, so a wording change
 * to the disclaimer needs no change here.
 */
export function linkEmergencyNumbers(text: string): readonly ReactNode[] {
  return text.split(PATTERN).map((part, index) => {
    const href = HREF.get(part);
    if (href === undefined) return part;
    return (
      <a key={`${part}-${index}`} className="hhcp-tel" href={href}>
        {part}
      </a>
    );
  });
}
