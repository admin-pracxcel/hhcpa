import type { Metadata } from "next";

import {
  ServicePage,
  serviceMetadata,
} from "@/components/sections/ServicePage";
import { TRANSFER_CARE } from "@/content/services/transfer-your-care";

export const metadata: Metadata = serviceMetadata(TRANSFER_CARE);

/**
 * `/transfer-your-care/` — Ranjeeta's approved Transfer Your Care page.
 *
 * It used to live at `/discharge/`, on the reading that her Discharge Letter
 * page and this were one page under two names (build spec v2.3 §8). They are
 * not, and rebuilding `/discharge/` as her live page replaced this one.
 * Restored here 2026-09-14; `/discharge/` is untouched.
 *
 * No form. The discharge letter form posts, and it belongs on the page that
 * takes the letter — this page links there from "Where to next" instead of
 * carrying a second copy of it.
 */
export default function Page() {
  return <ServicePage data={TRANSFER_CARE} />;
}
