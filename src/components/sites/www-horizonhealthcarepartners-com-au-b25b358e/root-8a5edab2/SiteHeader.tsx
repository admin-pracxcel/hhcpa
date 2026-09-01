"use client";

/**
 * Site header for https://www.horizonhealthcarepartners.com.au/
 *
 * Structure mirrors the source markup:
 *   header > .header--container (absolute overlay, z-index 1)
 *     ├─ .banner-7   — cream announcement strip
 *     └─ .header-15  — the white pill nav bar
 *
 * The header is NOT sticky: it is an absolutely-positioned overlay that scrolls
 * away with the page. No scroll listeners anywhere.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { FocusEvent } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "../shared/icons";

const SITE = "https://www.horizonhealthcarepartners.com.au";
const LOGO_SRC =
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/images/logo-colour.svg";

type NavItem = {
  label: string;
  href: string;
  children?: readonly { label: string; href: string }[];
};

const SERVICES_SUBMENU = [
  { label: "General Telehealth", href: "/services/?service=general#hhp-booking-wrapper" },
  { label: "Mental Health", href: "/services/?service=mental-health#hhp-booking-wrapper" },
  { label: "Holistic Care", href: "/services/?service=holistic#hhp-booking-wrapper" },
  { label: "Men’s and Women’s Health", href: "/services?service=menopause#hhp-booking-wrapper" },
  {
    label: "Continuity & Preventative Health",
    href: "/services/?service=covid#hhp-booking-wrapper",
  },
  {
    label: "Health Optimisation",
    href: "/services/?service=health-optimisation#hhp-booking-wrapper",
  },
  {
    label: "Weight Management",
    href: "/services/?service=weight-management#hhp-booking-wrapper",
  },
] as const;

const NAV_ITEMS: readonly NavItem[] = [
  { label: "About Us", href: `${SITE}/about-us/` },
  { label: "Services", href: `${SITE}/services/`, children: SERVICES_SUBMENU },
  { label: "Pricing", href: `${SITE}/pricing/` },
  { label: "How It Works", href: `${SITE}/how-it-works/` },
  { label: "Articles", href: `${SITE}/articles/` },
  { label: "Patient Portal", href: "https://escript.link/" },
  { label: "Contact", href: `${SITE}/contact/` },
] as const;

const CTA = { label: "Book Consultation", href: `${SITE}/quiz/` } as const;

/* Scoped stylesheet — every value transcribed from the source's computed styles. */
const HEADER_CSS = `
.hhcp-hdr__container {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}

/* ---------- Announcement bar ---------- */
.hhcp-hdr__banner {
  background-color: var(--hhcp-cream);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hhcp-hdr__banner-inner {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  column-gap: var(--hhcp-content-gap);
  padding: 11px 20px;
}
.hhcp-hdr__banner-info {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: var(--hhcp-content-gap);
}
.hhcp-hdr__banner-link {
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.6px;
  color: var(--hhcp-primary);
  text-align: center;
  text-decoration: none;
}
.hhcp-hdr__banner-link span {
  --bg-h: 1.4px;
  background: linear-gradient(0deg, #013126, #013126) no-repeat;
  background-size: 100% var(--bg-h);
  background-position-x: left;
  background-position-y: 95%;
  transition: background-size 0.3s;
  padding-bottom: 2.8px;
}
.hhcp-hdr__banner-link:hover span {
  background-size: 0% var(--bg-h);
  background-position-x: right;
}
@media (max-width: 478px) {
  .hhcp-hdr__banner-inner {
    align-items: flex-start;
    padding-block: var(--hhcp-space-s);
  }
  .hhcp-hdr__banner-info {
    flex-direction: column;
  }
  .hhcp-hdr__banner-link {
    margin-bottom: 10px;
    max-width: 200px;
  }
}

/* ---------- White pill bar ---------- */
.hhcp-hdr__bar {
  margin-top: var(--hhcp-space-xs);
}
.hhcp-hdr__bar-inner {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  column-gap: var(--hhcp-space-xl);
  padding: 13.25px 24px;
  background-color: var(--hhcp-white);
  border-radius: 6px;
}
@media (max-width: 991px) {
  .hhcp-hdr__bar-wrapper {
    padding-inline: var(--hhcp-space-xs);
  }
  .hhcp-hdr__bar-inner {
    column-gap: var(--hhcp-space-m);
  }
}

/* ---------- Logo ---------- */
.hhcp-hdr__logo,
.hhcp-hdr__logo img {
  height: 30px;
  width: auto;
  border-radius: 0;
}
.hhcp-hdr__logo {
  display: inline-flex;
  align-items: center;
  flex: none;
}
@media (max-width: 991px) {
  .hhcp-hdr__logo,
  .hhcp-hdr__logo img {
    height: 28px;
  }
  .hhcp-hdr__logo {
    order: 1;
  }
}
@media (max-width: 478px) {
  .hhcp-hdr__logo,
  .hhcp-hdr__logo img {
    height: 22px;
  }
}

/* ---------- Desktop nav ---------- */
.hhcp-hdr__nav-list {
  display: flex;
  flex-direction: row;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.hhcp-hdr__nav-list > li {
  position: relative;
  margin-block: auto;
}
.hhcp-hdr__nav-link {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-primary);
  text-decoration: none;
  transition: all 0.3s linear;
  white-space: nowrap;
}
.hhcp-hdr__nav-link:hover {
  color: var(--hhcp-action-dark);
}
.hhcp-hdr__nav-item {
  display: inline-flex;
  align-items: center;
}
.hhcp-hdr__nav-toggle {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  color: inherit;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  line-height: 0;
}
@media (min-width: 991px) and (max-width: 1184px) {
  .hhcp-hdr__nav-list {
    gap: 18px;
  }
}
@media (max-width: 991px) {
  .hhcp-hdr__nav {
    display: none;
  }
}

/* ---------- Services submenu ---------- */
.hhcp-hdr__submenu {
  position: absolute;
  top: 100%;
  transform: translateY(var(--hhcp-space-xs));
  min-width: 150px;
  white-space: nowrap;
  z-index: 998;
  background-color: var(--hhcp-white);
  border: 1px solid var(--hhcp-neutral-ultra-light);
  border-radius: var(--hhcp-radius-xs);
  box-shadow: 4px 4px 12px 0 rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0;
  padding: 0;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s linear;
}
.hhcp-hdr__submenu[data-open="true"] {
  opacity: 1;
  visibility: visible;
}
.hhcp-hdr__submenu li:hover {
  background-color: var(--hhcp-neutral-ultra-light);
}
.hhcp-hdr__submenu a {
  display: block;
  width: 100%;
  color: #000000;
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif;
  font-size: var(--hhcp-text-s);
  font-weight: 600;
  line-height: 120%;
  padding: var(--hhcp-space-xs) var(--hhcp-space-s);
  text-decoration: none;
}

/* ---------- Hamburger ---------- */
.hhcp-hdr__burger {
  display: none;
  width: 20px;
  height: 16px;
  position: relative;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: var(--hhcp-primary);
  flex: none;
}
.hhcp-hdr__burger span {
  position: absolute;
  right: 0;
  width: 20px;
  height: 2px;
  background-color: currentColor;
  transition: all 0.2s;
}
.hhcp-hdr__burger span:nth-child(1) { top: 0; }
.hhcp-hdr__burger span:nth-child(2) { top: 7px; }
.hhcp-hdr__burger span:nth-child(3) { top: 14px; }
.hhcp-hdr__burger[aria-expanded="true"] {
  color: var(--hhcp-white);
  z-index: 1000;
}
.hhcp-hdr__burger[aria-expanded="true"] span:nth-child(1) {
  top: 50%;
  transform: rotate(45deg);
}
.hhcp-hdr__burger[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
}
.hhcp-hdr__burger[aria-expanded="true"] span:nth-child(3) {
  top: 50%;
  transform: rotate(-45deg);
}
@media (max-width: 991px) {
  .hhcp-hdr__burger { display: block; order: 0; }
  .hhcp-hdr__cta { order: 2; }
}

/* ---------- Mobile drawer ---------- */
.hhcp-hdr__drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 300px;
  height: 100vh;
  background-color: var(--hhcp-primary);
  z-index: 999;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  visibility: hidden;
  transition-duration: 0.2s;
  transition-property: background-color, opacity, transform, visibility;
  overflow-y: auto;
}
.hhcp-hdr__drawer[data-open="true"] {
  transform: translateX(0);
  visibility: visible;
}
.hhcp-hdr__drawer-list,
.hhcp-hdr__drawer-sublist {
  list-style: none;
  margin: 0;
  padding: 0;
}
.hhcp-hdr__drawer-list {
  padding-top: 60px;
}
.hhcp-hdr__drawer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hhcp-hdr__drawer-link {
  display: block;
  width: 100%;
  color: var(--hhcp-action-light);
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: var(--hhcp-text-s);
  text-transform: uppercase;
  line-height: 60px;
  padding-inline: var(--hhcp-space-m);
  text-decoration: none;
  transition: all 0.3s linear;
}
.hhcp-hdr__drawer-link:hover {
  color: var(--hhcp-action);
}
.hhcp-hdr__drawer-toggle {
  background: transparent;
  border: 0;
  cursor: pointer;
  color: var(--hhcp-action-light);
  padding-inline: var(--hhcp-space-m);
  line-height: 60px;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
}
.hhcp-hdr__drawer-toggle[aria-expanded="true"] {
  transform: rotate(180deg);
}
.hhcp-hdr__drawer-sublist a {
  display: block;
  width: 100%;
  color: var(--hhcp-white);
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: var(--hhcp-text-s);
  text-transform: uppercase;
  line-height: 40px;
  padding-inline: var(--hhcp-space-l);
  text-decoration: none;
  transition: all 0.3s linear;
}
.hhcp-hdr__drawer-sublist a:hover {
  color: var(--hhcp-action);
}

/* ---------- Overlay ---------- */
.hhcp-hdr__overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 998;
  border: 0;
  padding: 0;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  cursor: pointer;
}
.hhcp-hdr__overlay[data-open="true"] {
  opacity: 1;
  visibility: visible;
}
`;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [drawerServicesOpen, setDrawerServicesOpen] = useState(false);
  const servicesItemRef = useRef<HTMLLIElement | null>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setDrawerServicesOpen(false);
  }, []);

  useEffect(() => {
    if (!menuOpen && !servicesOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setServicesOpen(false);
      closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, servicesOpen, closeMenu]);

  // Close the desktop dropdown when focus leaves the Services list item.
  const handleServicesBlur = useCallback((event: FocusEvent<HTMLLIElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && servicesItemRef.current?.contains(next)) return;
    setServicesOpen(false);
  }, []);

  return (
    <header>
      <style>{HEADER_CSS}</style>

      <div className="hhcp-hdr__container">
        {/* Announcement bar */}
        <div className="hhcp-hdr__banner">
          <div className={cn("hhcp-container", "hhcp-hdr__banner-inner")}>
            <div className="hhcp-hdr__banner-info">
              <a className="hhcp-hdr__banner-link" href={`${SITE}/quiz/`}>
                {"Take our "}
                <span>Pre-Screening Quiz</span>
              </a>
            </div>
          </div>
        </div>

        {/* White pill nav bar */}
        <div className="hhcp-hdr__bar">
          <div className={cn("hhcp-container", "hhcp-hdr__bar-wrapper")}>
            <div className="hhcp-hdr__bar-inner">
              <button
                type="button"
                className="hhcp-hdr__burger"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-controls="hhcp-mobile-drawer"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span />
                <span />
                <span />
              </button>

              <a className="hhcp-hdr__logo" href={SITE}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO_SRC} alt="HHCPA" />
              </a>

              <nav className="hhcp-hdr__nav" aria-label="Primary">
                <ul className="hhcp-hdr__nav-list">
                  {NAV_ITEMS.map((item) =>
                    item.children ? (
                      <li
                        key={item.label}
                        ref={servicesItemRef}
                        onMouseEnter={() => setServicesOpen(true)}
                        onMouseLeave={() => setServicesOpen(false)}
                        onBlur={handleServicesBlur}
                      >
                        <div className="hhcp-hdr__nav-item">
                          <a className="hhcp-hdr__nav-link" href={item.href}>
                            {item.label}
                          </a>
                          <button
                            type="button"
                            className="hhcp-hdr__nav-toggle"
                            aria-expanded={servicesOpen}
                            aria-label={`${
                              servicesOpen ? "Hide" : "Show"
                            } ${item.label} submenu`}
                            onClick={() => setServicesOpen((open) => !open)}
                            onFocus={() => setServicesOpen(true)}
                          >
                            <ChevronDownIcon />
                          </button>
                        </div>
                        <ul className="hhcp-hdr__submenu" data-open={servicesOpen}>
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <a href={child.href}>{child.label}</a>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li key={item.label}>
                        <a className="hhcp-hdr__nav-link" href={item.href}>
                          {item.label}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </nav>

              <a className={cn("hhcp-btn", "hhcp-hdr__cta")} href={CTA.href}>
                {CTA.label}
              </a>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          id="hhcp-mobile-drawer"
          className="hhcp-hdr__drawer"
          data-open={menuOpen}
          aria-hidden={!menuOpen}
        >
          <nav aria-label="Mobile">
            <ul className="hhcp-hdr__drawer-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <div className="hhcp-hdr__drawer-row">
                    <a
                      className="hhcp-hdr__drawer-link"
                      href={item.href}
                      tabIndex={menuOpen ? undefined : -1}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </a>
                    {item.children ? (
                      <button
                        type="button"
                        className="hhcp-hdr__drawer-toggle"
                        aria-expanded={drawerServicesOpen}
                        aria-label={`${
                          drawerServicesOpen ? "Hide" : "Show"
                        } ${item.label} submenu`}
                        tabIndex={menuOpen ? undefined : -1}
                        onClick={() => setDrawerServicesOpen((open) => !open)}
                      >
                        <ChevronDownIcon />
                      </button>
                    ) : null}
                  </div>
                  {item.children && drawerServicesOpen ? (
                    <ul className="hhcp-hdr__drawer-sublist">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <a href={child.href} onClick={closeMenu}>
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Overlay */}
        <button
          type="button"
          className="hhcp-hdr__overlay"
          data-open={menuOpen}
          aria-label="Close menu"
          tabIndex={menuOpen ? undefined : -1}
          onClick={closeMenu}
        />
      </div>
    </header>
  );
}
