"use client";

/**
 * Site footer for https://www.horizonhealthcarepartners.com.au/
 *
 * Structure mirrors the source markup:
 *   footer                          — #013126, 45px block / 30px inline padding
 *     └─ .container                 — 1340px wrapper, 45px row-gap
 *          ├─ .top                  — logo left, social row right
 *          ├─ .divider
 *          ├─ nav .middle           — two menu columns + the newsletter column
 *          ├─ .divider
 *          └─ .bottom               — credit + legal links, then the disclaimer
 *
 * Client component purely so the newsletter form can `preventDefault()` — the
 * source posts to a CRM endpoint we do not clone, so the demo submit is inert.
 * Every hover is plain CSS.
 *
 * Two details are verbatim from the source and look like typos but are not:
 * the "SUPPORT LINKS" heading really is upper-case in the markup (the other
 * heading is "Pages"), and the copyright line really does carry a double space
 * after the © symbol — the JSX string literal keeps JSX from collapsing it.
 *
 * The email input deliberately carries no site font: the source leaves the UA
 * default control font in place, so the scoped rule restores a system stack
 * against the Tailwind preflight's `font: inherit` reset.
 */

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LinkedInIcon,
  FacebookSquareIcon,
  InstagramIcon,
} from "../shared/icons";
import { visibleFooterColumns, FOOTER_BAR_LINKS } from "@/content/footer";
import { CLINIC } from "@/content/clinic";

const LOGO_SRC =
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/images/logo-light-tagline.svg";

/**
 * Columns come from the route registry via `visibleFooterColumns()`, so a gated
 * page cannot appear here while being hidden from the sitemap. Column 1 is the
 * NAP block, rendered from CLINIC; column 5 is the newsletter form. Both carry
 * no links, so only columns 2 to 4 are mapped.
 */
const COLUMNS = visibleFooterColumns();
const LINK_COLUMNS = COLUMNS.filter((column) => column.links.length > 0);

interface SocialLink {
  readonly label: string;
  readonly href: string;
  readonly Icon: typeof LinkedInIcon;
}

const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/109897954/admin/dashboard/",
    Icon: LinkedInIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61583057797612&sk=about",
    Icon: FacebookSquareIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/horizonhealthcarepartnersaus/",
    Icon: InstagramIcon,
  },
] as const;

const CREDIT = "©  2026 by Horizon Health Care Partners. All Rights Reserved.";

/**
 * The footer no longer carries its own disclaimer. `SiteDisclaimer` renders the
 * canonical text from `(site)/layout.tsx` on every page — the version here was
 * both a duplicate and less complete, omitting the Lifeline and Beyond Blue
 * numbers the content specification requires.
 */

const STYLES = `
.hhcp-ft {
  background-color: var(--hhcp-primary, #013126);
  padding: var(--hhcp-space-l, 45px) var(--hhcp-space-m, 30px);
}

.hhcp-ft-container {
  width: 1340px;
  max-width: 100%;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  row-gap: var(--hhcp-space-l, 45px);
}

/* --- Top row: logo / social --- */
.hhcp-ft-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-ft-logo {
  display: block;
  /* Source: .footer-16__logo is 5.4rem (54px) tall while the img inside it is
     4.5rem (45px) — the link is deliberately taller than its image, and that
     9px is what sets the footer's top-row height. */
  height: 54px;
}

.hhcp-ft-logo img {
  height: 45px;
  width: auto;
  display: block;
}

.hhcp-ft-social {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--hhcp-space-m, 30px);
}

.hhcp-ft-social a {
  display: inline-flex;
  color: rgba(245, 255, 249, 0.6);
  transition: all 0.3s linear;
}

.hhcp-ft-social a:hover {
  color: var(--hhcp-accent, #f5fff9);
}

/* --- Hairline, used above and below the menu block --- */
.hhcp-ft-divider {
  width: 100%;
  height: 1px;
  border-top: 1px solid rgba(245, 255, 249, 0.1);
}

/* --- Middle: two menu columns + newsletter --- */
.hhcp-ft-middle {
  display: flex;
  flex-direction: row;
  /* Five columns now share this row rather than three, so the gap tightens and
     the columns are allowed to wrap before they crush. */
  gap: var(--hhcp-space-m, 30px);
  flex-wrap: wrap;
}

/* Column 1 — NAP block. */
.hhcp-ft-nap {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--hhcp-action-light, #baf8d9);
  list-style: none;
}
.hhcp-ft-nap a {
  color: var(--hhcp-action-light, #baf8d9);
  transition: all 0.3s linear;
}
.hhcp-ft-nap a:hover { color: var(--hhcp-action, #58eda2); }

.hhcp-ft-news-blurb {
  font-size: 14px;
  line-height: 1.5;
  color: var(--hhcp-action-light, #baf8d9);
}

.hhcp-ft-menu {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: var(--hhcp-space-s, 20px);
  max-width: 268px;
  flex-basis: 180px;
  flex-grow: 1;
  flex-shrink: 1;
  width: auto;
  padding: 0;
}

.hhcp-ft-menu-heading {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-accent, #f5fff9);
}

.hhcp-ft-menu-list {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  list-style: none;
  margin: 0;
  padding: 0;
}

.hhcp-ft-menu-list a {
  font-size: 16px;
  line-height: 24px;
  color: rgba(245, 255, 249, 0.8);
  transition: all 0.3s linear;
}

.hhcp-ft-menu-list a:hover {
  color: var(--hhcp-accent, #f5fff9);
}

/* --- Newsletter column --- */
.hhcp-ft-news {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 536px;
  max-width: 100%;
  flex-shrink: 0;
  margin-left: auto;
  gap: var(--hhcp-space-m, 30px);
}

.hhcp-ft-news-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}

.hhcp-ft-news-heading {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0;
  color: var(--hhcp-accent, #f5fff9);
}

.hhcp-ft-form {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 15px;
  width: 100%;
}

/* The source leaves the UA control font here — no DM Sans, no Roboto Mono.
   Tailwind preflight forces font: inherit, so restore a system stack. */
.hhcp-ft-input {
  flex: 1;
  padding: 13px;
  border: 1px solid rgba(245, 255, 249, 0.2);
  border-radius: 33.75px;
  background-color: var(--hhcp-primary, #013126);
  color: var(--hhcp-accent, #f5fff9);
  font-size: 16px;
  font-family: system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
  letter-spacing: normal;
}

.hhcp-ft-input::placeholder {
  color: rgba(245, 255, 249, 0.2);
}

.hhcp-ft-submit {
  padding: 12.8px 20px;
  border-radius: 800px;
  background-color: var(--hhcp-action, #58eda2);
  color: var(--hhcp-primary, #013126);
  border: none;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s linear;
}

.hhcp-ft-submit:hover {
  background-color: #0c7340;
  color: #baf8d9;
}

.hhcp-ft-terms {
  font-size: 10px;
  line-height: 15px;
  color: rgba(245, 255, 249, 0.8);
}

.hhcp-ft-terms a {
  color: var(--hhcp-accent, #f5fff9);
  text-decoration: none;
}

.hhcp-ft-contact {
  display: flex;
  flex-direction: row;
  gap: var(--hhcp-space-m, 30px);
  list-style: none;
  padding: 0;
  margin: 0;
}

.hhcp-ft-contact li {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.hhcp-ft-contact-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: rgba(245, 255, 249, 0.8);
}

.hhcp-ft-contact-value {
  font-size: 16px;
  letter-spacing: -0.6px;
  color: var(--hhcp-accent, #f5fff9);
}

/* --- Bottom: credit / legal / disclaimer --- */
.hhcp-ft-bottom {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  row-gap: var(--hhcp-space-l, 45px);
  column-gap: var(--hhcp-space-m, 30px);
}

.hhcp-ft-bottom-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  row-gap: var(--hhcp-space-s, 20px);
  column-gap: var(--hhcp-space-m, 30px);
  width: 100%;
  flex-wrap: wrap;
}

.hhcp-ft-credit {
  font-size: 16px;
  color: rgba(245, 255, 249, 0.8);
}

.hhcp-ft-legal {
  display: flex;
  flex-direction: row;
  gap: 13.5068px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.hhcp-ft-legal a {
  font-size: 16px;
  color: var(--hhcp-accent, #f5fff9);
  letter-spacing: -0.6px;
}

.hhcp-ft-disclaimer {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: rgba(245, 255, 249, 0.8);
  max-width: 100%;
  text-align: start;
}

@media (max-width: 991px) {
  .hhcp-ft-middle {
    flex-wrap: wrap;
  }

  .hhcp-ft-news {
    width: 100%;
  }
}

@media (max-width: 767px) {
  .hhcp-ft-top {
    flex-direction: column;
  }

  .hhcp-ft-news {
    width: 100%;
    max-width: 100%;
  }

  .hhcp-ft-form {
    flex-direction: column;
  }
}

@media (max-width: 478px) {
  .hhcp-ft-middle {
    row-gap: var(--hhcp-space-xl, 67.5px);
  }

  .hhcp-ft-menu {
    max-width: 100%;
  }
}
`;

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn("hhcp-ft", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-ft-container">
        <div className="hhcp-ft-top">
          <Link className="hhcp-ft-logo" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="HHCPA" />
          </Link>

          <div className="hhcp-ft-social">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a key={href} href={href} aria-label={label}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="hhcp-ft-divider" />

        <nav className="hhcp-ft-middle">
          {/* Column 1 — the NAP block. Sitemap §4. */}
          <div className="hhcp-ft-menu">
            <span className="hhcp-ft-menu-heading font-roboto-mono">
              {CLINIC.name}
            </span>
            <ul className="hhcp-ft-nap font-dm-sans">
              <li>AHPRA-registered telehealth care, Australia-wide.</li>
              <li>
                {CLINIC.legalName} · ABN {CLINIC.abn}
              </li>
              <li>
                <a href={CLINIC.phoneHref}>{CLINIC.phone}</a>
              </li>
              <li>
                <a href={CLINIC.emailHref}>{CLINIC.email}</a>
              </li>
              <li>
                {CLINIC.serviceArea} · Hours: {CLINIC.hours}
              </li>
            </ul>
          </div>

          {LINK_COLUMNS.map((column) => (
            <div key={column.title} className="hhcp-ft-menu">
              <span className="hhcp-ft-menu-heading font-roboto-mono">
                {column.title}
              </span>
              <ul className="hhcp-ft-menu-list">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a className="font-dm-sans" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="hhcp-ft-news">
            <div className="hhcp-ft-news-inner">
              <span className="hhcp-ft-news-heading font-roboto-mono">
                Newsletter
              </span>
              <p className="hhcp-ft-news-blurb font-dm-sans">
                Email sign-up for occasional health guidance.
              </p>

              <form
                className="hhcp-ft-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="hhcp-ft-input"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  aria-label="Enter your email"
                />
                <button className="hhcp-ft-submit font-roboto-mono" type="submit">
                  Register
                </button>
              </form>

              <p className="hhcp-ft-terms">
                {"By clicking Register, you acknowledge that you have read and accepted our "}
                <a href="/terms-and-conditions/">Terms and Conditions</a>.
              </p>
            </div>

          </div>
        </nav>

        <div className="hhcp-ft-divider" />

        <div className="hhcp-ft-bottom">
          <div className="hhcp-ft-bottom-row">
            <small className="hhcp-ft-credit">{CREDIT}</small>

            <ul className="hhcp-ft-legal">
              {FOOTER_BAR_LINKS.map((link) => (
                <li key={link.href}>
                  <a className="font-dm-sans" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
