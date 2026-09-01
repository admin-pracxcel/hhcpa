// Asset downloader for https://www.horizonhealthcarepartners.com.au/
// site-key: www-horizonhealthcarepartners-com-au-b25b358e  page-key: root-8a5edab2
import fs from 'node:fs/promises';
import path from 'node:path';

const SITE = 'www-horizonhealthcarepartners-com-au-b25b358e';
const PAGE = 'root-8a5edab2';
const UP = 'https://www.horizonhealthcarepartners.com.au/wp-content/uploads/';
const OUT = path.resolve('public/sites', SITE, PAGE);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

/** @type {Array<{url:string,dest:string}>} */
const ASSETS = [
  // --- Logos ---
  ['HHCPA_Logo_colour-@2x.svg', 'images/logo-colour.svg'],
  ['HHCPA_Logo_Light-tagline.svg', 'images/logo-light-tagline.svg'],
  // --- Service icons (booking wizard) ---
  ['hhcpa-01.svg', 'images/icon-weight-management.svg'],
  ['hhcpa-02.svg', 'images/icon-after-hours-consult.svg'],
  ['hhcpa-03.svg', 'images/icon-priority-consult.svg'],
  ['hhcpa-04.svg', 'images/icon-mental-health.svg'],
  ['hhcpa-05.svg', 'images/icon-mens-womens-health.svg'],
  ['hhcpa-07.svg', 'images/icon-pathology-imaging.svg'],
  ['hhcpa-08.svg', 'images/icon-medical-certificates.svg'],
  ['hhcpa-010.svg', 'images/icon-prescriptions.svg'],
  ['hhcpa-011.svg', 'images/icon-continuity-preventative.svg'],
  ['hhcpa-012.svg', 'images/icon-general-referrals.svg'],
  ['Alternative-Medicine.png', 'images/icon-holistic-care.png'],
  ['heart.png', 'images/icon-health-optimisation.png'],
  // --- Photography ---
  ['horizon-health-care-partners-01.jpg', 'images/steps-01-prescreening.jpg'],
  ['horizon-health-care-partners-14.webp', 'images/steps-02-book-consultation.webp'],
  ['horizon-health-care-partners-02.jpg', 'images/steps-03-attend-appointment.jpg'],
  ['horizon-health-care-partners-04.jpg', 'images/steps-04-ongoing-support.jpg'],
  ['horizon-health-care-partners-05-768x771.jpg', 'images/our-story.jpg'],
  ['horizon-health-care-partners-06-1024x1024.jpg', 'images/care-pain-management.jpg'],
  ['horizon-health-care-partners-07-1024x1024.jpg', 'images/care-physical-wellbeing.jpg'],
  ['horizon-health-care-partners-11-1024x1024.jpg', 'images/care-mental-wellbeing.jpg'],
  ['horizon-health-care-partners-09-1024x1024.jpg', 'images/care-complex-health.jpg'],
  ['horizon-health-care-partners-10-1024x1024.jpg', 'images/care-general-health.jpg'],
  ['horizon-health-care-partners-12-746x1024.jpg', 'images/approach-to-care.jpg'],
  ['hhcpa-weight-management-active-lifestyle-1024x683.jpeg', 'images/blog-weight-loss.jpeg'],
  ['hhcpa-sleep-health-1024x809.jpg', 'images/blog-sleep-health.jpg'],
  ['hhcpa-sleep-pain-v3-1024x683.jpg', 'images/blog-sleep-pain.jpg'],
  // --- Fonts (exact woff2 files the target serves) ---
  ['DMSans-Regular.woff2', 'fonts/DMSans-Regular.woff2'],
  ['DMSans-Medium.woff2', 'fonts/DMSans-Medium.woff2'],
  ['RobotoMono-Medium.woff2', 'fonts/RobotoMono-Medium.woff2'],
  // --- Favicons ---
  ['cropped-HHCPA_favicon-512x512-1-32x32.png', 'seo/favicon-32x32.png'],
  ['cropped-HHCPA_favicon-512x512-1-192x192.png', 'seo/favicon-192x192.png'],
  ['cropped-HHCPA_favicon-512x512-1-180x180.png', 'seo/apple-touch-icon.png'],
].map(([f, dest]) => ({ url: UP + f, dest }));

// Absolute (off-origin) assets: hero + CTA background videos and their posters.
const ABSOLUTE = [
  ['https://video.gumlet.io/6750e4dd948718dd94168ed1/68d380d204980dd75305e47a/download.mp4', 'videos/hero-background.mp4'],
  ['https://video.gumlet.io/6750e4dd948718dd94168ed1/68d380d204980dd75305e47a/thumbnail-1-0.png?v=1758694494307', 'videos/hero-background-poster.png'],
  ['https://video.gumlet.io/6750e4dd948718dd94168ed1/68db7d04a4135504a2d57641/download.mp4', 'videos/cta-background.mp4'],
  ['https://video.gumlet.io/6750e4dd948718dd94168ed1/68db7d04a4135504a2d57641/thumbnail-1-0.png?v=1759214941751', 'videos/cta-background-poster.png'],
].map(([url, dest]) => ({ url, dest }));

async function download({ url, dest }) {
  const target = path.join(OUT, dest);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://www.horizonhealthcarepartners.com.au/' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length === 0) throw new Error('empty body');
  await fs.writeFile(target, buf);
  return buf.length;
}

async function main() {
  const queue = [...ASSETS, ...ABSOLUTE];
  const failures = [];
  let ok = 0;
  for (let i = 0; i < queue.length; i += 4) {
    const batch = queue.slice(i, i + 4);
    const results = await Promise.allSettled(batch.map(download));
    results.forEach((r, j) => {
      const a = batch[j];
      if (r.status === 'fulfilled') {
        ok += 1;
        console.log(`  ok  ${a.dest} (${(r.value / 1024).toFixed(1)} KB)`);
      } else {
        failures.push(`${a.dest} <- ${a.url}: ${r.reason.message}`);
        console.error(`  FAIL ${a.dest}: ${r.reason.message}`);
      }
    });
  }
  console.log(`\n${ok}/${queue.length} downloaded into ${OUT}`);
  if (failures.length) {
    console.error(`\n${failures.length} failed:\n${failures.join('\n')}`);
    process.exitCode = 1;
  }
}

main();
