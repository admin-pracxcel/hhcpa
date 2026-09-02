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

import { useCallback, useEffect, useState } from "react";
import type { FocusEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "../shared/icons";
import { visibleNavItems, type NavItem } from "@/content/nav";
import { CLINIC } from "@/content/clinic";

const LOGO_SRC =
  "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/images/logo-colour.svg";

/**
 * Navigation comes from the route registry rather than being declared here, so
 * gated pages cannot appear in the menu while being hidden from the sitemap.
 * Paths are relative: this site now *is* horizonhealthcarepartners.com.au, and
 * absolute links back to the WordPress build would send visitors off-site.
 */
const NAV_ITEMS: readonly NavItem[] = visibleNavItems();

const CTA = { label: "Book a consultation", href: "/quiz/" } as const;

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
  /* Deviation from the target, which left-aligns this strip. See
     CUSTOMISATIONS.md. */
  justify-content: center;
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
  /* Containing block for the mega panel. Anchoring the panel here rather than
     to the nav or the <li> is what makes it structurally unable to extend past
     the header, at any viewport width. */
  position: relative;
  transition: border-radius 0.3s linear;
}
/*
 * With the panel seated flush, the pill's rounded bottom corners leave two
 * small notches of background showing beside the panel's square top corners.
 * Squaring them while the panel is open makes the join exact.
 *
 * Pulling the panel up instead would not work: it is a descendant of the pill,
 * so it always paints above the pill's background rather than tucking behind
 * it — it would square these corners anyway, and drag the top hairline up
 * across the white pill face.
 */
.hhcp-hdr__bar-inner[data-mega-open="true"] {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
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
    order: 0;
  }
}
@media (max-width: 478px) {
  .hhcp-hdr__logo,
  .hhcp-hdr__logo img {
    height: 22px;
  }
}

/* ---------- Desktop nav ---------- */
.hhcp-hdr__nav {
  /* Deliberately NOT positioned: the mega panel anchors to .hhcp-hdr__bar-inner,
     and a positioned nav would become its containing block instead. The
     [data-mega] rule below does the same job for the <li>. */
  /* Absorbs all the slack between the logo and the phone/CTA group, then
     centres the list inside it — so the nav sits in the middle of the space
     that is actually left over, not the middle of the bar. */
  flex: 1;
  display: flex;
  justify-content: center;
}
.hhcp-hdr__nav-list > li[data-mega="true"] {
  position: static;
}
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

/* ---------- Services mega-menu ---------- */
.hhcp-hdr__mega {
  position: absolute;
  top: 100%;
  /* Spans the pill exactly. Not max-content and not centred on the nav: both
     let the panel's own content width decide its edges, which pushed it off
     the left of the viewport once the nav moved to the middle of the row. */
  left: 0;
  right: 0;
  z-index: 998;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--hhcp-space-l);
  padding: var(--hhcp-space-m);
  background-color: var(--hhcp-white);
  border: 1px solid var(--hhcp-neutral-ultra-light);
  /* The panel seats flush against the pill and both are white, so the top edge
     needs a stronger hairline than the other three or the two surfaces read as
     one block. */
  border-top: 1px solid var(--hhcp-base-10);
  /* Square at the top so it meets the pill cleanly; rounded below. */
  border-radius: 0 0 var(--hhcp-radius-s) var(--hhcp-radius-s);
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.08);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s linear;
}

/*
 * Hover bridge.
 *
 * onMouseLeave is bound to the <li>, which is only as tall as its label — so
 * the pill's 13.25px bottom padding is dead space between the nav item and the
 * panel, and crossing it closed the menu before the pointer arrived. This
 * invisible strip belongs to the panel, which is a DOM descendant of the <li>,
 * so the pointer never leaves the subtree.
 */
.hhcp-hdr__mega::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  height: 20px;
}
.hhcp-hdr__mega[data-open="true"] {
  opacity: 1;
  visibility: visible;
}
.hhcp-hdr__mega-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* Share the pill's width rather than dictating the panel's. */
  flex: 1 1 170px;
  min-width: 170px;
  max-width: 260px;
}
.hhcp-hdr__mega-title {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-primary);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--hhcp-neutral-ultra-light);
  transition: all 0.3s linear;
}
.hhcp-hdr__mega-title:hover { color: var(--hhcp-action-dark); }
.hhcp-hdr__mega-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.hhcp-hdr__mega-list a {
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif;
  font-size: var(--hhcp-text-s);
  line-height: 1.4;
  color: var(--hhcp-base-80);
  text-decoration: none;
  transition: all 0.3s linear;
}
.hhcp-hdr__mega-list a:hover { color: var(--hhcp-action-dark); }

@media (max-width: 1184px) {
  .hhcp-hdr__mega { gap: var(--hhcp-space-m); }
  .hhcp-hdr__mega-col { flex-basis: 150px; min-width: 150px; }
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
/* ---------- Phone number + CTA ---------- */
.hhcp-hdr__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--hhcp-space-s);
  flex: none;
  /* Holds the pair against the right edge regardless of how much slack the
     row's space-between has to distribute. */
  margin-left: auto;
}
.hhcp-hdr__phone {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  text-align: right;
  color: var(--hhcp-primary);
  transition: all 0.3s linear;
}
.hhcp-hdr__phone:hover { color: var(--hhcp-action-dark); }

@media (max-width: 991px) {
  /* Tablet: logo left, CTA, hamburger right. The phone is carried by the
     sticky bar rather than the pill, so only the button rides outside. */
  .hhcp-hdr__burger { display: block; order: 2; }
  .hhcp-hdr__actions { order: 1; margin-left: auto; }
  .hhcp-hdr__phone { display: none; }
}
@media (max-width: 767px) {
  /* Phone: nothing between logo and hamburger. The CTA moves into the drawer
     as its last item. */
  .hhcp-hdr__actions { display: none; }
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
/* Mega-menu silo headings in the drawer: same weight as a sublist row, but
   tinted and tracked so the 19 service pages read as five groups, not one list. */
.hhcp-hdr__drawer-subheading {
  color: var(--hhcp-action) !important;
  letter-spacing: 0.36px;
}
.hhcp-hdr__drawer-subitem {
  text-transform: none !important;
  font-family: var(--font-dm-sans-local), ui-sans-serif, system-ui, sans-serif !important;
  padding-left: calc(var(--hhcp-space-l) + 12px) !important;
  line-height: 34px !important;
}

/* Only phone-width drawers carry the CTA; on tablet it is in the bar. */
.hhcp-hdr__drawer-cta-row {
  display: none;
  padding: var(--hhcp-space-m);
  margin-top: var(--hhcp-space-s);
}
@media (max-width: 767px) {
  .hhcp-hdr__drawer-cta-row { display: block; }
}
.hhcp-hdr__drawer-cta {
  width: 100%;
  justify-content: center;
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
  /**
   * There are now four service dropdowns plus an About menu, so open-state is
   * tracked by label rather than as a single boolean. `null` means all closed.
   */
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  /* True only for a columns-style item, so the simple About dropdown — which is
     narrow and does not meet the pill edge-to-edge — leaves the radius alone. */
  const megaOpen = NAV_ITEMS.some(
    (item) => item.columns !== undefined && item.label === openMenu,
  );
  const [openDrawerMenu, setOpenDrawerMenu] = useState<string | null>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setOpenDrawerMenu(null);
  }, []);

  useEffect(() => {
    if (!menuOpen && openMenu === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenMenu(null);
      closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, openMenu, closeMenu]);

  /**
   * Close a desktop dropdown when focus leaves its list item. `currentTarget` is
   * the <li> the handler is bound to, so this works for every dropdown without
   * needing a ref per item.
   */
  const handleMenuBlur = useCallback((event: FocusEvent<HTMLLIElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    setOpenMenu(null);
  }, []);

  return (
    <header>
      <style>{HEADER_CSS}</style>

      <div className="hhcp-hdr__container">
        {/* Announcement bar */}
        <div className="hhcp-hdr__banner">
          <div className={cn("hhcp-container", "hhcp-hdr__banner-inner")}>
            <div className="hhcp-hdr__banner-info">
              <a className="hhcp-hdr__banner-link" href="/quiz/">
                {"Take our "}
                <span>Pre-Screening Quiz</span>
              </a>
            </div>
          </div>
        </div>

        {/* White pill nav bar */}
        <div className="hhcp-hdr__bar">
          <div className={cn("hhcp-container", "hhcp-hdr__bar-wrapper")}>
            <div className="hhcp-hdr__bar-inner" data-mega-open={megaOpen}>
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

              <Link className="hhcp-hdr__logo" href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO_SRC} alt="HHCPA" />
              </Link>

              <nav className="hhcp-hdr__nav" aria-label="Primary">
                <ul className="hhcp-hdr__nav-list">
                  {NAV_ITEMS.map((item) =>
                    item.columns || item.children ? (
                      <li
                        key={item.label}
                        data-mega={item.columns ? "true" : undefined}
                        onMouseEnter={() => setOpenMenu(item.label)}
                        onMouseLeave={() => setOpenMenu(null)}
                        onBlur={handleMenuBlur}
                      >
                        <div className="hhcp-hdr__nav-item">
                          <a className="hhcp-hdr__nav-link" href={item.href}>
                            {item.label}
                          </a>
                          <button
                            type="button"
                            className="hhcp-hdr__nav-toggle"
                            aria-expanded={openMenu === item.label}
                            aria-label={`${
                              openMenu === item.label ? "Hide" : "Show"
                            } ${item.label} submenu`}
                            onClick={() =>
                              setOpenMenu((open) =>
                                open === item.label ? null : item.label,
                              )
                            }
                            onFocus={() => setOpenMenu(item.label)}
                          >
                            <ChevronDownIcon />
                          </button>
                        </div>
                        {item.columns ? (
                          <div
                            className="hhcp-hdr__mega"
                            data-open={openMenu === item.label}
                          >
                            {item.columns.map((column) => (
                              <div key={column.title} className="hhcp-hdr__mega-col">
                                <a className="hhcp-hdr__mega-title" href={column.href}>
                                  {column.title}
                                </a>
                                {column.links.length > 0 ? (
                                  <ul className="hhcp-hdr__mega-list">
                                    {column.links.map((link) => (
                                      <li key={link.href}>
                                        <a href={link.href}>{link.label}</a>
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <ul
                            className="hhcp-hdr__submenu"
                            data-open={openMenu === item.label}
                          >
                            {item.children?.map((child) => (
                              <li key={child.label}>
                                <a href={child.href}>{child.label}</a>
                              </li>
                            ))}
                          </ul>
                        )}
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

              {/* Sitemap §3: the phone number appears in the header on every
                  page. It is grouped with the CTA rather than being a fourth
                  sibling, so the pair stays flush right instead of the row's
                  space-between distribution floating the number mid-row. */}
              <div className="hhcp-hdr__actions">
                <a className="hhcp-hdr__phone" href={CLINIC.phoneHref}>
                  {CLINIC.phone}
                </a>

                <a className={cn("hhcp-btn", "hhcp-hdr__cta")} href={CTA.href}>
                  {CTA.label}
                </a>
              </div>
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
                    {item.children || item.columns ? (
                      <button
                        type="button"
                        className="hhcp-hdr__drawer-toggle"
                        aria-expanded={openDrawerMenu === item.label}
                        aria-label={`${
                          openDrawerMenu === item.label ? "Hide" : "Show"
                        } ${item.label} submenu`}
                        tabIndex={menuOpen ? undefined : -1}
                        onClick={() =>
                          setOpenDrawerMenu((open) =>
                            open === item.label ? null : item.label,
                          )
                        }
                      >
                        <ChevronDownIcon />
                      </button>
                    ) : null}
                  </div>
                  {openDrawerMenu === item.label && item.children ? (
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
                  {/* The mega-menu flattens in the drawer: each silo becomes a
                      heading link followed by its sub-pages. */}
                  {openDrawerMenu === item.label && item.columns ? (
                    <ul className="hhcp-hdr__drawer-sublist">
                      {item.columns.map((column) => (
                        <li key={column.href}>
                          <a
                            className="hhcp-hdr__drawer-subheading"
                            href={column.href}
                            onClick={closeMenu}
                          >
                            {column.title}
                          </a>
                          {column.links.map((link) => (
                            <a
                              key={link.href}
                              className="hhcp-hdr__drawer-subitem"
                              href={link.href}
                              onClick={closeMenu}
                            >
                              {link.label}
                            </a>
                          ))}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}

              {/* Below 768px the bar is just logo and hamburger, so the CTA
                  lives here as the drawer's last item. Tablets keep it in the
                  bar and this row is hidden. */}
              <li className="hhcp-hdr__drawer-cta-row">
                <a
                  className={cn("hhcp-btn", "hhcp-hdr__drawer-cta")}
                  href={CTA.href}
                  tabIndex={menuOpen ? undefined : -1}
                  onClick={closeMenu}
                >
                  {CTA.label}
                </a>
              </li>
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
