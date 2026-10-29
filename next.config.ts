import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  /*
   * One URL per page: apex host, trailing slash.
   *
   *   https://horizonhealthcarepartners.com.au/
   *   https://horizonhealthcarepartners.com.au/pricing/
   *
   * Next serves the slashed form and 308s `/pricing` to `/pricing/`; the rule
   * at the top of `redirects()` 308s `www.` to apex. Between them every other
   * spelling of an address lands on the one form, which is also the form
   * `SITE_URL` + the route paths produce — so canonicals, the sitemap and
   * every internal href already agree with it.
   *
   * This was off until 2026-10-12, which meant the opposite: the server
   * served `/pricing` while the sitemap, the canonical tag and every link on
   * the site said `/pricing/`. Thirty-six of the thirty-seven sitemap entries
   * 308'd, and each page's canonical pointed at the URL that redirected back
   * to it.
   *
   * Exempt by Next's own rule, and this is why robots and sitemap still work:
   * anything with a file extension, plus `.well-known/`. `/sitemap.xml` and
   * `/robots.txt` do not gain a slash.
   */
  trailingSlash: true,

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
      /*
       * `www.` → apex, keeping the path. First, so every other rule below
       * only ever has to think about paths.
       *
       * Done here rather than left to DNS because this is a shared plan and
       * the two hosts resolve to the same app: if the host does it too, this
       * never fires and costs nothing; if it does not, the site would
       * otherwise answer on both names with no redirect between them, which
       * splits every signal in two.
       *
       * It cannot loop: it only matches when the host IS `www.`, and sends
       * the visitor to a host that is not.
       */
      {
        /*
         * `(.*)` rather than `:path*`. The segment form drops a trailing
         * slash on the way through — `www/pricing/` would arrive at
         * `apex/pricing` and need a second 308 to get its slash back. This
         * captures the path exactly as asked for, so a correctly-spelled www
         * URL reaches its apex twin in one hop. The root still works: the
         * capture is empty and the destination is the bare origin.
         */
        source: "/:path(.*)",
        has: [
          { type: "host", value: "www.horizonhealthcarepartners.com.au" },
        ],
        destination: "https://horizonhealthcarepartners.com.au/:path",
        permanent: true,
      },

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
       * Destinations carry the trailing slash, because that is now the form
       * the server serves. Written without one they would each cost a second
       * hop: this 308, then Next's own 308 adding the slash.
       */
      {
        source: "/weight-loss-peptides/medical-weight-loss-program",
        destination: "/weight-management/medical-weight-loss-program/",
        permanent: true,
      },
      // Page removed: its whole subject was an injectable prescription.
      {
        source: "/weight-loss-peptides/weight-loss-injections",
        destination: "/weight-management/",
        permanent: true,
      },
      {
        source: "/weight-loss-peptides",
        destination: "/weight-management/",
        permanent: true,
      },
      // Page removed: advertising medicinal cannabis to the public is prohibited.
      { source: "/medicinal-cannabis", destination: "/", permanent: true },
      {
        source: "/mens-health/testosterone-replacement-therapy",
        destination: "/mens-health/low-testosterone/",
        permanent: true,
      },
      {
        source: "/mens-health/hair-loss-treatment",
        destination: "/mens-health/hair-loss/",
        permanent: true,
      },
      {
        source: "/mens-health/erectile-dysfunction-treatment",
        destination: "/mens-health/erectile-dysfunction/",
        permanent: true,
      },
      {
        source: "/mens-health/premature-ejaculation-treatment",
        destination: "/mens-health/premature-ejaculation/",
        permanent: true,
      },
      {
        source: "/womens-health/menopause-treatment",
        destination: "/womens-health/menopause/",
        permanent: true,
      },
      /*
       * Consolidated 2026-10-29, technical audit item 7. Two articles were
       * competing for one intent — both categorised "Sleep and recovery",
       * both about sleep and chronic pain — which splits whatever authority
       * either earns. The shorter and narrower one was removed from
       * content/articles.ts; this keeps its address resolving.
       *
       * Not a `permanent: false`: the page is gone for good and the
       * surviving article covers its subject, so the signal should
       * consolidate rather than be held open.
       */
      {
        source: "/article/why-sleep-matters-in-chronic-pain",
        destination:
          "/article/why-sleep-is-essential-for-chronic-pain-weight-and-overall-health/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
