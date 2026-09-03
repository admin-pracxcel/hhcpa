/**
 * The body of the 404 page.
 *
 * A person lands here having failed at something — a stale link, a typo, a page
 * that moved. So it says what happened in one line and then gets out of the way,
 * and the space goes to the handful of places people were most likely heading.
 * No apology, no illustration of a broken robot, no "oops".
 *
 * The destinations are hardcoded rather than read from `ROUTES` on purpose: the
 * registry has thirty-five entries and a list that long is another thing to
 * fail at. These are the six a lost visitor actually wants.
 */

import { cn } from "@/lib/utils";
import { CLINIC } from "@/content/clinic";

const STYLES = `
.hhcp-nf-section {
  /* Clears the fixed header, the allowance ServiceHero makes. */
  padding: calc(var(--hhcp-section-space-m) + 122px) var(--hhcp-gutter)
    var(--hhcp-section-space-m);
  background-color: var(--hhcp-accent, #f5fff9);
}

@media (max-width: 991px) {
  .hhcp-nf-section {
    padding-top: calc(var(--hhcp-section-space-m) + 108px);
  }
}

.hhcp-nf-container {
  max-width: 715px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-nf-head {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
}

.hhcp-nf-code {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.36px;
  text-transform: uppercase;
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-nf-heading {
  font-size: var(--hhcp-h2);
  line-height: var(--hhcp-heading-lh);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-nf-body {
  font-size: var(--hhcp-text-m, 16px);
  line-height: var(--hhcp-text-lh, 1.5);
  color: rgba(1, 49, 38, 0.8);
}

/* Two up, then one. Six links in a single column is a long way to scan. */
.hhcp-nf-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (max-width: 600px) {
  .hhcp-nf-links {
    grid-template-columns: 1fr;
  }
}

.hhcp-nf-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 20px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #d6e8e1;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hhcp-nf-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -8px rgba(1, 49, 39, 0.1);
  border-color: var(--hhcp-primary, #013126);
}

.hhcp-nf-link-title {
  font-size: 16px;
  line-height: 1.3;
  color: var(--hhcp-primary, #013126);
}

.hhcp-nf-link-body {
  font-size: 14px;
  line-height: 1.5;
  color: #526f68;
}

.hhcp-nf-note {
  font-size: 14px;
  line-height: 1.6;
  color: #526f68;
}

.hhcp-nf-note a {
  color: var(--hhcp-primary, #013126);
  text-decoration: underline;
  text-underline-offset: 3px;
}
`;

const LINKS = [
  {
    title: "Home",
    body: "Start again from the top.",
    href: "/",
  },
  {
    title: "Services",
    body: "Everything we treat, in one list.",
    href: "/services/",
  },
  {
    title: "Free pre-screening quiz",
    body: "Two minutes, no commitment.",
    href: "/quiz/",
  },
  {
    title: "Pricing",
    body: "Every consultation fee, before you book.",
    href: "/pricing/",
  },
  {
    title: "FAQs",
    body: "The questions patients ask most.",
    href: "/faqs/",
  },
  {
    title: "Contact us",
    body: "Phone, email, or a message to our team.",
    href: "/contact/",
  },
] as const;

export function NotFoundPanel({ className }: { className?: string }) {
  return (
    <section className={cn("hhcp-nf-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-nf-container">
        <div className="hhcp-nf-head">
          <p className="hhcp-nf-code font-roboto-mono">Error 404</p>
          <h1 className="hhcp-nf-heading font-dm-sans">
            We could not find that page
          </h1>
          <p className="hhcp-nf-body font-dm-sans">
            The link may be out of date, or the address may have a typo in it.
          </p>
        </div>

        <ul className="hhcp-nf-links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a className="hhcp-nf-link" href={link.href}>
                <span className="hhcp-nf-link-title font-dm-sans">
                  {link.title}
                </span>
                <span className="hhcp-nf-link-body font-dm-sans">
                  {link.body}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="hhcp-nf-note font-dm-sans">
          {"Still stuck? Call "}
          <a href={CLINIC.phoneHref}>{CLINIC.phone}</a>
          {` — ${CLINIC.hours}. In an emergency, call 000.`}
        </p>
      </div>
    </section>
  );
}
