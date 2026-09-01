/**
 * The canonical route registry.
 *
 * Drives the sitemap, robots.txt, navigation and breadcrumbs from one place, so a
 * gated page cannot leak through one channel while being hidden in another.
 *
 * `gated: true` means the page is built but withheld from publication pending the
 * client's express written approval under Clause 6.2(b) of the Service Agreement.
 * Removing the flag is the act of publishing — do not remove one without the
 * written sign-off on file.
 */

export interface RouteEntry {
  path: string;
  title: string;
  gated?: boolean;
}

export const ROUTES: readonly RouteEntry[] = [
  { path: "/", title: "Home" },

  // Weight Loss & Peptides
  { path: "/weight-loss-peptides/", title: "Weight Loss & Peptides" },
  { path: "/weight-loss-peptides/weight-loss-injections/", title: "Weight Loss Injections" },
  { path: "/weight-loss-peptides/medical-weight-loss-program/", title: "Medical Weight Loss Program" },

  // Men's Health
  { path: "/mens-health/", title: "Men's Health" },
  { path: "/mens-health/erectile-dysfunction-treatment/", title: "Erectile Dysfunction Treatment" },
  { path: "/mens-health/testosterone-replacement-therapy/", title: "Testosterone Replacement Therapy" },
  { path: "/mens-health/premature-ejaculation-treatment/", title: "Premature Ejaculation Treatment" },
  { path: "/mens-health/hair-loss-treatment/", title: "Hair Loss Treatment" },

  // Women's Health
  { path: "/womens-health/", title: "Women's Health" },
  { path: "/womens-health/menopause-treatment/", title: "Menopause Treatment" },
  { path: "/womens-health/pcos-management/", title: "PCOS Management" },
  { path: "/womens-health/contraception/", title: "Contraception & Sexual Health" },

  // Medicinal Cannabis — withheld pending compliance sign-off
  { path: "/medicinal-cannabis/", title: "Medicinal Cannabis", gated: true },

  // Online Doctor
  { path: "/online-doctor/", title: "Online Doctor" },
  { path: "/online-doctor/online-prescriptions/", title: "Online Prescriptions & Repeat Scripts" },
  { path: "/online-doctor/medical-certificates/", title: "Online Medical Certificates" },
  { path: "/online-doctor/pathology-imaging-referrals/", title: "Pathology & Imaging Referrals" },
  { path: "/online-doctor/specialist-referrals/", title: "Specialist Referrals" },
  { path: "/online-doctor/mental-health/", title: "Mental Health Support" },

  // Information & Trust
  { path: "/how-it-works/", title: "How It Works" },
  { path: "/pricing/", title: "Pricing" },
  { path: "/about-us/", title: "About Us" },
  // Withheld: only one named practitioner, no AHPRA number, no headshot on file.
  { path: "/our-practitioners/", title: "Our Practitioners", gated: true },
  { path: "/contact/", title: "Contact" },
  { path: "/faqs/", title: "FAQs" },

  // Patient actions
  { path: "/quiz/", title: "Free Pre-Screening Quiz" },
  { path: "/discharge/", title: "Transfer Your Care" },
  { path: "/services/", title: "Services" },

  // Policies & safety
  { path: "/patient-safety/", title: "Patient Safety & Emergencies" },
  { path: "/complaints/", title: "Complaints" },
  { path: "/conflict-of-interest-disclosure/", title: "Conflict of Interest & Pharmacy Disclosure" },
  { path: "/privacy/", title: "Privacy Policy" },
  { path: "/terms-and-conditions/", title: "Terms & Conditions" },

  // Content
  { path: "/articles/", title: "Knowledge Hub" },
] as const;

export function publicRoutes(): RouteEntry[] {
  return ROUTES.filter((route) => !route.gated);
}

export function gatedRoutes(): RouteEntry[] {
  return ROUTES.filter((route) => route.gated === true);
}

export function isGated(path: string): boolean {
  return ROUTES.find((route) => route.path === path)?.gated === true;
}
