import type { Metadata } from "next";
import localFont from "next/font/local";
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
      { url: "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/seo/favicon-32x32.png", sizes: "32x32" },
      { url: "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/seo/favicon-192x192.png", sizes: "192x192" },
    ],
    apple: "/sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/seo/apple-touch-icon.png",
  },
};

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
