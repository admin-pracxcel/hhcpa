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
    ],
  },
  { title: "Newsletter", links: [] },
] as const;

export const FOOTER_BAR_LINKS: readonly FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy/" },
  { label: "Terms & Conditions", href: "/terms-and-conditions/" },
  {
    label: "Conflict of Interest & Pharmacy Disclosure",
    href: "/conflict-of-interest-disclosure/",
  },
] as const;

export function visibleFooterColumns(): FooterColumn[] {
  return FOOTER_COLUMNS.map((column) => ({
    ...column,
    links: column.links.filter((link) => !isGated(link.href)),
  }));
}
