/**
 * `notFound()` called from inside the `(site)` group — an unknown article slug
 * is the one that does it today.
 *
 * Renders the panel alone. This file *is* wrapped by `(site)/layout.tsx`, so the
 * header, footer and disclaimer are already around it; rendering the full page
 * shell here put two of each on the page. Counted in a browser, which is where
 * it shows — the server HTML did not make it obvious either way.
 *
 * It still needs its own metadata. Without it the title fell back to the root
 * layout\'s "Telehealth Australia | AHPRA-Registered Practitioners", so a 404
 * announced itself as the homepage.
 */

import type { Metadata } from "next";

import { NotFoundPanel } from "@/components/sections/NotFoundPanel";

export const metadata: Metadata = {
  title: "Page not found | Horizon Health Care Partners",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundPanel />;
}
