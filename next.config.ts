import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  /*
   * Build-time memory, not runtime. The production host is a shared cloud plan
   * and the build is what has to fit, not the server.
   *
   * On 2026-09-28 a deploy died with a Turbopack panic: a PostCSS worker was
   * killed while processing a next/font CSS module — "node process exited
   * before we could connect to it with exit status: 0", no stdout, no stderr,
   * which is a kill rather than a failure. It builds locally either way; the
   * difference is headroom. Measured here from clean: Turbopack peaks at
   * 1.41GB, webpack at 691MB. `npm run build` therefore passes --webpack.
   *
   * `cpus` is the other half. Static generation forks one worker per core —
   * nine on this laptop — and each holds its own React render context, so a
   * machine with more cores spawns a bigger spike after compile has finished.
   * Two keeps that predictable regardless of what the host reports, at the
   * cost of a slower generate step on 52 pages.
   *
   * Both are here to fit a constrained builder, not because anything is wrong
   * with Turbopack. If the plan grows, drop --webpack first and keep this.
   */
  experimental: {
    cpus: 2,
  },
  async redirects() {
    return [
      // The WordPress site folded these into the new information architecture.
      // See the design spec, §3.2. All three are permanent.
      {
        source: "/medical-certificate",
        destination: "/online-doctor/medical-certificates/",
        permanent: true,
      },
      { source: "/home", destination: "/", permanent: true },
      // Screening now precedes booking.
      { source: "/book-consultation", destination: "/quiz/", permanent: true },

      /*
       * Compliance remediation, Part C of HHCPA_Remediation_Change_Spec.md.
       *
       * Every one of these old paths named a prescription medicine or class in
       * the URL string itself, which the TGA restrictions reach the same way
       * they reach page copy. The pages were renamed or removed; these keep the
       * old addresses resolving. Order matters — the two child paths must be
       * matched before the parent prefix, or the parent rule would swallow them.
       *
       * Destinations carry no trailing slash, unlike the three rules above.
       * `trailingSlash` is off, so Next normalises `/foo/` to `/foo` with its own
       * 308 — a destination written as `/foo/` therefore costs a third hop on
       * every one of these. The three older rules predate this pass and are left
       * as they are rather than changed under a compliance commit.
       */
      {
        source: "/weight-loss-peptides/medical-weight-loss-program",
        destination: "/weight-management/medical-weight-loss-program",
        permanent: true,
      },
      // Page removed: its whole subject was an injectable prescription.
      {
        source: "/weight-loss-peptides/weight-loss-injections",
        destination: "/weight-management",
        permanent: true,
      },
      {
        source: "/weight-loss-peptides",
        destination: "/weight-management",
        permanent: true,
      },
      // Page removed: advertising medicinal cannabis to the public is prohibited.
      { source: "/medicinal-cannabis", destination: "/", permanent: true },
      {
        source: "/mens-health/testosterone-replacement-therapy",
        destination: "/mens-health/low-testosterone",
        permanent: true,
      },
      {
        source: "/mens-health/hair-loss-treatment",
        destination: "/mens-health/hair-loss",
        permanent: true,
      },
      {
        source: "/mens-health/erectile-dysfunction-treatment",
        destination: "/mens-health/erectile-dysfunction",
        permanent: true,
      },
      {
        source: "/mens-health/premature-ejaculation-treatment",
        destination: "/mens-health/premature-ejaculation",
        permanent: true,
      },
      {
        source: "/womens-health/menopause-treatment",
        destination: "/womens-health/menopause",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
