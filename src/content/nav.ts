/**
 * Header navigation.
 *
 * HHCPA_Sitemap_and_Navigation.pdf §3 proposes four separate top-level service
 * dropdowns. That does not physically fit: those four labels plus How It Works,
 * Pricing and About measure 935px of nav against 1300px of available row, and
 * the logo, phone and CTA need the rest. The four silos are therefore grouped
 * under a single Services mega-menu — which is also what the original site did.
 * Every page in the sitemap is still one hover and one click away.
 *
 * Gated destinations are filtered out by `visibleNavItems()` rather than being
 * commented out here, so publishing is a single flag flip in the route registry.
 */
import { isGated } from "./routes";

export interface NavChild {
  label: string;
  href: string;
}

/** One silo inside the Services mega-menu. The title is itself the hub link. */
export interface NavColumn {
  title: string;
  href: string;
  links: readonly NavChild[];
}

export interface NavItem {
  label: string;
  href: string;
  /** Simple single-column dropdown. */
  children?: readonly NavChild[];
  /** Multi-column mega-menu. Mutually exclusive with `children`. */
  columns?: readonly NavColumn[];
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "Services",
    href: "/services/",
    columns: [
      {
        title: "Weight Loss & Peptides",
        href: "/weight-loss-peptides/",
        links: [
          { label: "Weight Loss Injections", href: "/weight-loss-peptides/weight-loss-injections/" },
          { label: "Medical Weight Loss Program", href: "/weight-loss-peptides/medical-weight-loss-program/" },
        ],
      },
      {
        title: "Men's Health",
        href: "/mens-health/",
        links: [
          { label: "Erectile Dysfunction", href: "/mens-health/erectile-dysfunction-treatment/" },
          { label: "Testosterone Replacement", href: "/mens-health/testosterone-replacement-therapy/" },
          { label: "Premature Ejaculation", href: "/mens-health/premature-ejaculation-treatment/" },
          { label: "Hair Loss Treatment", href: "/mens-health/hair-loss-treatment/" },
        ],
      },
      {
        title: "Women's Health",
        href: "/womens-health/",
        links: [
          { label: "Menopause Treatment", href: "/womens-health/menopause-treatment/" },
          { label: "PCOS Management", href: "/womens-health/pcos-management/" },
          { label: "Contraception & Sexual Health", href: "/womens-health/contraception/" },
        ],
      },
      {
        title: "Online Doctor",
        href: "/online-doctor/",
        links: [
          { label: "Online Prescriptions", href: "/online-doctor/online-prescriptions/" },
          { label: "Medical Certificates", href: "/online-doctor/medical-certificates/" },
          { label: "Pathology & Imaging Referrals", href: "/online-doctor/pathology-imaging-referrals/" },
          { label: "Specialist Referrals", href: "/online-doctor/specialist-referrals/" },
          { label: "Mental Health Support", href: "/online-doctor/mental-health/" },
        ],
      },
      // Appears as a fifth column on compliance sign-off; filtered out until then.
      { title: "Medicinal Cannabis", href: "/medicinal-cannabis/", links: [] },
    ],
  },
  { label: "How It Works", href: "/how-it-works/" },
  { label: "Pricing", href: "/pricing/" },
  {
    label: "About",
    href: "/about-us/",
    children: [
      { label: "About Us", href: "/about-us/" },
      { label: "Our Practitioners", href: "/our-practitioners/" },
      { label: "Knowledge Hub", href: "/articles/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
] as const;

export function visibleNavItems(): NavItem[] {
  return NAV_ITEMS.filter((item) => !isGated(item.href)).map((item) => ({
    ...item,
    children: item.children?.filter((child) => !isGated(child.href)),
    // A gated hub takes its whole column with it — the sub-pages of a withheld
    // silo must not be reachable from the menu either.
    columns: item.columns
      ?.filter((column) => !isGated(column.href))
      .map((column) => ({
        ...column,
        links: column.links.filter((link) => !isGated(link.href)),
      })),
  }));
}
