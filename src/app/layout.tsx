import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";

import { SITE_INDEXABLE } from "@/lib/indexable";
import "./globals.css";

// The exact woff2 files the target serves — DM Sans 400/500, Roboto Mono 500.
const dmSans = localFont({
  variable: "--font-dm-sans-local",
  display: "swap",
  src: [
    { path: "./fonts/DMSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/DMSans-Medium.woff2", weight: "500", style: "normal" },
  ],
});

const robotoMono = localFont({
  variable: "--font-roboto-mono-local",
  display: "swap",
  src: [{ path: "./fonts/RobotoMono-Medium.woff2", weight: "500", style: "normal" }],
});

export const metadata: Metadata = {
  /*
   * Every page on a non-indexable deployment carries noindex, from here, so no
   * page can be missed. Pages that set their own robots — the thank-you pages,
   * the 404, the archived clone — override this and are noindex either way.
   *
   * Spread rather than a conditional property so that on production the key is
   * absent entirely and pages default to indexable.
   */
  ...(SITE_INDEXABLE ? {} : { robots: { index: false, follow: false } }),
  title: "Telehealth Australia | AHPRA-Registered Practitioners",
  description:
    "Access AHPRA-registered practitioners online. Book telehealth consultations. Professional healthcare from home across Australia.",
  openGraph: {
    title: "Telehealth Australia | AHPRA-Registered Practitioners",
    description:
      "Access AHPRA-registered practitioners online. Book telehealth consultations. Professional healthcare from home across Australia.",
    url: "https://www.horizonhealthcarepartners.com.au/",
    siteName: "Horizon Health Care Partners",
    locale: "en_AU",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32" },
      { url: "/icons/favicon-192x192.png", sizes: "192x192" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

/**
 * Google Tag Manager — container GTM-5JFZMNLQ, Ranjeeta's.
 *
 * A container rather than any tag hardcoded here, so what fires is
 * configuration she can change or kill without a deploy. Nothing in this
 * repository decides what loads inside it.
 *
 * `afterInteractive` is GTM's own recommendation for the snippet and the
 * Next default. It is the equivalent of "as high in the head as possible"
 * without the container's download sitting in front of first paint, which on
 * a site measured to the pixel against a live original is not a trade worth
 * making. `beforeInteractive` would load it ahead of our own code and is for
 * scripts the page cannot render without.
 *
 * ─── ⚠️ THIS IS A HEALTH SITE ──────────────────────────────────────────────
 *
 * On a telehealth site the URL is itself the data: `/online-doctor/mental-
 * health/`, `/womens-health/menopause/` and the quiz routes each say what an
 * identifiable visitor is seeking care for. Health information is *sensitive
 * information* under the Privacy Act — APP 3 wants consent to collect it, and
 * APP 8 makes sending it to a US ad platform a cross-border disclosure.
 *
 * So what goes in the container is a clinical decision, not a marketing one:
 *
 *   - An advertising pixel must not fire on `/quiz/`, `/quiz-book/` or
 *     `/quiz-thank-you/` at all. Those three are a patient mid-consultation.
 *   - On condition and service pages it needs Ranjeeta's written approval,
 *     page by page, the same rule as the page copy (Service Agreement 6.2(b)).
 *   - `BookingPanel` pushes a `checkout_start` event carrying `service`. That
 *     is a condition inference about a named person at the moment they pay.
 *     It exists for Ranjeeta's own conversion reporting. Do not forward it to
 *     an ad platform, and if that is ever wanted, drop the `service` field
 *     first.
 */
const GTM_ID = "GTM-5JFZMNLQ";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${dmSans.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* GTM's own noscript fallback, first thing in the body as it asks. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {children}
      </body>
    </html>
  );
}
