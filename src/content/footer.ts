/**
 * Footer structure, per HHCPA_Sitemap_and_Navigation.pdf §4.
 *
 * Column 1 is rendered from CLINIC rather than declared here, since it is the
 * NAP block. Column 5 is the newsletter form, which has no links.
 */
import { isGated } from "./routes";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: readonly FooterLink[];
}

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  { title: "Horizon Health Care Partners", links: [] },
  {
    title: "Our Services",
    links: [
      { label: "Weight Loss & Peptides", href: "/weight-loss-peptides/" },
      { label: "Men's Health", href: "/mens-health/" },
      { label: "Women's Health", href: "/womens-health/" },
      { label: "Medicinal Cannabis", href: "/medicinal-cannabis/" },
      { label: "Online Doctor", href: "/online-doctor/" },
      { label: "Mental Health Support", href: "/online-doctor/mental-health/" },
    ],
  },
  {
    title: "Patients",
    links: [
      { label: "How It Works", href: "/how-it-works/" },
      { label: "Pricing", href: "/pricing/" },
      { label: "Pre-Screening Quiz", href: "/quiz/" },
      { label: "Transfer Your Care", href: "/discharge/" },
      { label: "Patient Portal", href: "https://escript.link/" },
      { label: "FAQs", href: "/faqs/" },
    ],
  },
  {
    title: "About & Trust",
    links: [
      { label: "About Us", href: "/about-us/" },
      { label: "Our Practitioners", href: "/our-practitioners/" },
      { label: "Contact", href: "/contact/" },
      { label: "Knowledge Hub", href: "/articles/" },
      { label: "Patient Safety & Emergencies", href: "/patient-safety/" },
      { label: "Complaints", href: "/complaints/" },
      /* Moved up from the bar under the menus, at request. */
      { label: "Privacy Policy", href: "/privacy/" },
      { label: "Terms & Conditions", href: "/terms-and-conditions/" },
      {
        label: "Conflict of Interest & Pharmacy Disclosure",
        href: "/conflict-of-interest-disclosure/",
      },
    ],
  },
  { title: "Newsletter", links: [] },
] as const;

/**
 * The credit line opposite the copyright, in the bar under the menus.
 *
 * The three legal links used to live there and are now in the About & Trust
 * column, so the bar carries this instead of standing half empty.
 *
 * `nofollow` on the agency link because it is a paid-relationship credit rather
 * than an editorial recommendation, which is what Google asks that attribute to
 * mark. It is a plain same-tab link — `noreferrer` implies `noopener`, so there
 * is nothing further to add for safety.
 */
export const FOOTER_CREDIT = {
  before: "Web Design & Digital Marketing by ",
  label: "Pracxcel",
  href: "https://pracxcel.com.au",
  rel: "nofollow noreferrer",
} as const;

export function visibleFooterColumns(): FooterColumn[] {
  return FOOTER_COLUMNS.map((column) => ({
    ...column,
    links: column.links.filter((link) => !isGated(link.href)),
  }));
}
