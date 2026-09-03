/**
 * The 404 for any URL that matches no route.
 *
 * See NotFoundPage for why it builds its own header and footer rather than
 * inheriting them, and what it leaves out of them.
 */

import type { Metadata } from "next";

import { NotFoundPage } from "@/components/sections/NotFoundPage";

export const metadata: Metadata = {
  title: "Page not found | Horizon Health Care Partners",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundPage />;
}
