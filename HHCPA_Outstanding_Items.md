# HHCPA: outstanding items after full audit

**Audited:** 11 September 2026 against hhcpa.pracxcel.com as deployed, plus horizonhealthcarepartners.com.au for the "original version" comparisons.
**Method:** every item Ranjeeta ticked on 9 September, every item from her 7 September and 1 September emails, and every section of the build spec, checked individually against the rendered site and the JS bundles.

Ordered by severity. Each item states what was committed, what is actually there, and exactly what to change.

---

## P1-1. Discharge file upload is posting health records through the quiz API

**Committed:** round 3 Q38 answer, option (d). Ship the page without the file input, keep only the free-text field, add upload when an encrypted destination exists. Option (a), base64 through the webhook, was explicitly ruled out.

**Actual:** the upload field uses `readAsDataURL` and posts the file base64-encoded to `/api/quiz`. 4MB limit, no scanning.

**Do this:**
1. Remove the file input and its label from the Discharge Letter form on `/discharge`.
2. Keep the free-text field. Change its helper text to: `If you have a discharge letter from your current provider, our team will request it from you after you book. If you do not have one yet, tell us below and we will help.`
3. Remove the base64 conversion and the file key from the `/api/quiz` payload.
4. Leave the rest of the form, the 15% offer and the terms exactly as they are. They are correct.

---

## P1-2. The six intake forms were not built

**Committed:** build spec s4.7. Step 6 of the quiz architecture, one intake form per service, built from HHCPA-FRM-002 to 007.

**Actual:** no trace anywhere of full legal name, date of birth, residential address, emergency contact, the two declaration checkboxes, or electronic signature. No form ID or version is stored.

**Do this.** Confirm whether this was a deliberate deferral pending the storage decision. If it was, that is defensible, but it needs recording and Ranjeeta needs telling, because these are her documents and she will look for them. If it was not, build Step 6 per s4.7, with the Health Optimisation form using the reworded question and declaration from s4.7.1.

Either way, do not advertise the per-service completion times anywhere until the forms exist.

---

## P2-1. Footer disclaimer is not bold, and is not in the footer

**Committed:** her 9 September reply, ticked: "Footer disclaimer text to be in bold."

**Actual:** the disclaimer sits in a plain `<div>` placed *after* the closing `</footer>` tag, rendered at `var(--hhcp-text-xs)` in `rgba(245,255,249,0.8)`. No bold, small, and low contrast. This is roughly the opposite of what she asked for.

**Do this:**
1. Move the disclaimer block inside `<footer>`, below the bottom row that carries the copyright and the Pracxcel byline.
2. Apply a bold weight to the paragraph.
3. Raise the colour to full opacity so it is legible against the dark background.
4. Leave the wording exactly as it is. The text is correct and carries her exact emergency line.

---

## P2-2. The service boxes are not her original version

**Committed:** her 9 September reply, ticked: "The service boxes will be replaced with the original versions from your website." Combined with her answer to question 1: keep the current behaviour, where a box goes to the service page and the service page prompts pre-screening before booking.

**Actual:** an eight-card "What we help with" grid. Her live site has a twelve-box "Choose Your Service" selector under the subtitle `Select a category below to view detailed options and pricing`.

This deviation is mine, not the build team's. The spec said eight cards because I mapped her boxes onto the eight-service architecture. That is not what she asked for and she will notice, because six of her boxes disappeared.

**Do this.** Rebuild the section using her twelve boxes, her descriptions and her prices, keeping the current click behaviour rather than her booking redirect. Replace the eight-card grid rather than running both, since two service grids on one page is confusing.

Section heading: `Choose Your Service`
Subtitle: `Select a category below to view detailed options and pricing.`

| Box | Description | Price | Links to |
|---|---|---|---|
| General & Referrals | Standard consults, referrals, prescriptions, certificates and more. | From $49 | `/online-doctor` |
| After-Hours Consult | Evenings and weekends consultations. | From $69 | **see note** |
| Priority Consult | First available appointment, fast turnaround. Limited spots available each day. | From $98 | **see note** |
| Prescriptions | Repeat eScripts and new prescriptions. | From $19 | `/online-doctor/online-prescriptions` |
| Medical Certificates | Single day and multi-day certificates for work, study or carer. | From $19.90 | `/online-doctor/medical-certificates` |
| Pathology & Imaging | Referrals for blood tests, X-rays and ultrasounds. | From $49 | `/online-doctor/pathology-imaging-referrals` |
| Mental Health | Personalised support for mental wellbeing and neurological conditions. Includes: ADHD Support, Anxiety & PTSD, Smoking Cessation, Sleep Concerns | From $59 | `/online-doctor/mental-health` |
| Men's Health | Discreet online consultations for erectile dysfunction, low testosterone, hair loss and more. | From $89 | `/mens-health` |
| Women's Health | Menopause and perimenopause support, hormones, PCOS and contraception. | From $89 | `/womens-health` |
| Continuity & Preventative Health | Chronic disease management, long-term care planning and preventative health support. | From $69 | `/continuity-preventative-health` |
| Holistic Care / Alternative Medicine | A personalised approach supporting chronic conditions, pain, sleep and overall wellbeing through evidence-based treatment options. | From $49 | `/holistic-alternative-care` |
| Health Optimisation & Complete Wellness | Comprehensive programs focused on energy, recovery, healthy ageing and long-term health. | Programs from $299 | `/health-optimisation` |
| Weight Management | Medically supervised weight management programs tailored to your health goals. | From $99 | `/weight-management` |

Three deliberate changes from her originals, each for a reason already agreed:

- Her site has one combined "Men's & Women's Health" box. Split into two, because they are separate services in the agreed structure and have separate pages.
- Prescriptions is $19, not her site's $49, per her own instruction of 9 September.
- Health Optimisation's description drops the word "weight", per the separation. Her site's version reads "weight, energy, recovery and long-term health".

**Note on After-Hours and Priority.** These have no pages. Either point both at `/online-doctor` with the consult type pre-selected, or point them straight into `/quiz`. Flag to her for confirmation; do not guess silently a second time.

Apply the same section to `/services`.

---

## P2-3. The About hero image is missing

**Committed:** her 9 September reply: "Also keep the hero page with the river and trees."

**Actual:** `/about-us` has no hero image at all. The only images on the page are the Our Story and Meet the Team photos.

**Do this:** restore the river and trees hero image behind the `Your Health Journey Begins` heading, sourced from her live About page. The heading, subtitle and copy are all correct and should not change.

---

## P2-4. Inner page hero images were never replaced

**Committed:** build spec s2.4. Replace hero images on inner pages with the corresponding hero images from her live site.

**Actual:** not done. `/pricing` carries no images other than the logo. Other inner pages use existing build assets rather than hers.

**Do this:** pull the hero assets from her live site and apply them page by page. This was authorised in the v2.2 answers, Q9, including the two constraints: no before-and-after imagery, and do not carry across any practitioner headshot, because those are stock placeholders on her current site and real headshots are still pending.

---

## P2-5. Pricing hero was not restored

**Committed:** her 9 September annotation, "keep this hero page with its wording", which round 3 Q4 traced to the H1 on her live pricing page.

**Actual:** H1 reads `Transparent pricing, no surprises`.

**Do this:**
- Eyebrow above the H1: `Transparent, Straightforward Pricing`
- H1: `Pre-screening is free. No commitment until you're ready.`

---

## P2-6. Health Optimisation screening reintroduces weight framing

**Committed:** remove the peptide reference and keep the Health Optimisation flow clear of weight-loss framing, which is the whole point of the separation.

**Actual:** the peptide reference was correctly removed, but `ho_prior_therapy` now reads `Have you previously used prescription weight management medications or therapies?`

**Do this:** change the question text to `Have you previously used any prescribed treatment for health optimisation, recovery or healthy ageing?` Keep the Yes/No options and the existing free-text follow-up unchanged.

---

## P2-7. Health Optimisation page shows six of her seven areas

**Committed:** her seven sub-areas, with sexual health cross-linked rather than duplicated.

**Actual:** six render as `<h3>` items under "The areas a program can cover". Sexual Health and Wellbeing sits outside the list as its own `<h2>`, "Sexual health is handled on its own pages".

**Do this:** move it back into the list as the seventh `<h3>`, headed `Sexual health and wellbeing`, with two or three sentences and inline links to `/mens-health` and `/womens-health`. Remove the separate section. No duplicated condition content, so the cannibalisation concern is still satisfied and her list of seven reads as seven.

---

## P3-1. Em dash in a page title

**Actual:** `/article/why-sleep-matters-in-chronic-pain` uses an em dash as its title separator. Every other page uses a pipe.

**Do this:** change to a pipe. This is the only em dash left in rendered copy across all 42 pages.

---

## Confirm with Ranjeeta, do not decide internally

1. **After-Hours and Priority consult destinations**, per P2-2.
2. **Discharge Letter as an anchor rather than a page.** The footer points to `/discharge/#discharge-letter`, which matches her live site's single-page arrangement, but she asked for a "page".
3. **The Metabolic Health rename** is live but she has not answered question 3 of the email yet.

---

## Verified correct, do not touch

Global copy sweeps all clean: no old tagline, no "two minutes", no West End, no "across the country", no "Structured health programs", no `$54`. Per-word scroll animation removed. Her exact emergency wording on all 42 pages with the old variant gone. Prohibited-terms scan clean across copy, titles, meta, Open Graph, alt text and JSON-LD.

Navigation and footer carry all eight services with Mental Health Support promoted. Three new hubs live with full schema; `Service` schema verified on all eight hubs.

Pricing has all twelve rows with correct figures, the fee table sits above the three-box, and fees read $69, $59, $59. Transfer is $59 on `/discharge`.

Homepage: her intro copy verbatim, "How We Support You" slider with her six categories, "Our Approach to Care" with her five items verbatim, "Everything in one place" combined with her three original points restored, the four-steps second description reverted, her five-entry FAQ restored, and "Easy Access, Professional Care" correctly placed above it.

About: her replacement copy verbatim, the subtitle added, Our Story opening `founded by Healthcare Practitioner Ranjeeta Roshan`, clinical standards paragraph updated to the eight service areas, and her FAQ restored.

How It Works: hero wording kept, "Our Approach to Care" and "How We Support You" both added, safety section left as the new version.

Quiz: age and residency gates, green/amber/red triage with her red message verbatim, the safety question surfacing crisis contacts without blocking, contact capture on every outcome, `clinical` segregation preserved, and `{service, outcome}` plus `safetyFlag` emitted.

All 42 pages `noindex`. Empty sitemap is the `SITE_INDEXABLE` gate working as designed.
