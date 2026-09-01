/**
 * Header navigation, per HHCPA_Sitemap_and_Navigation.pdf §3.
 *
 * The menu leads with the service areas because that is what most patients are
 * looking for. Gated destinations are filtered out by `visibleNavItems()` rather
 * than being commented out here, so publishing is a single flag flip in the
 * route registry.
 */
import { isGated } from "./routes";

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: readonly NavChild[];
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    label: "Weight Loss & Peptides",
    href: "/weight-loss-peptides/",
    children: [
      { label: "Weight Loss & Peptides", href: "/weight-loss-peptides/" },
      { label: "Weight Loss Injections", href: "/weight-loss-peptides/weight-loss-injections/" },
      { label: "Medical Weight Loss Program", href: "/weight-loss-peptides/medical-weight-loss-program/" },
    ],
  },
  {
    label: "Men's Health",
    href: "/mens-health/",
    children: [
      { label: "Men's Health", href: "/mens-health/" },
      { label: "Erectile Dysfunction Treatment", href: "/mens-health/erectile-dysfunction-treatment/" },
      { label: "Testosterone Replacement Therapy", href: "/mens-health/testosterone-replacement-therapy/" },
      { label: "Premature Ejaculation Treatment", href: "/mens-health/premature-ejaculation-treatment/" },
      { label: "Hair Loss Treatment", href: "/mens-health/hair-loss-treatment/" },
    ],
  },
  {
    label: "Women's Health",
    href: "/womens-health/",
    children: [
      { label: "Women's Health", href: "/womens-health/" },
      { label: "Menopause Treatment", href: "/womens-health/menopause-treatment/" },
      { label: "PCOS Management", href: "/womens-health/pcos-management/" },
      { label: "Contraception & Sexual Health", href: "/womens-health/contraception/" },
    ],
  },
  {
    label: "Online Doctor",
    href: "/online-doctor/",
    children: [
      { label: "Online Doctor", href: "/online-doctor/" },
      { label: "Online Prescriptions", href: "/online-doctor/online-prescriptions/" },
      { label: "Medical Certificates", href: "/online-doctor/medical-certificates/" },
      { label: "Pathology & Imaging Referrals", href: "/online-doctor/pathology-imaging-referrals/" },
      { label: "Specialist Referrals", href: "/online-doctor/specialist-referrals/" },
      { label: "Mental Health Support", href: "/online-doctor/mental-health/" },
    ],
  },
  // Added to the nav on compliance sign-off; filtered out until then.
  { label: "Medicinal Cannabis", href: "/medicinal-cannabis/" },
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
  }));
}
