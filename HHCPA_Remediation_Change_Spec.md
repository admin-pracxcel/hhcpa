# HHCPA Website: Complete Remediation Change Specification

**Site audited:** https://hhcpa.pracxcel.com (staging, currently `noindex, nofollow`)
**Prepared by:** Pracxcel · Internal build document
**Scope:** Every page, menu, footer, metadata field and structured-data block on the staging build, checked against current AHPRA and TGA advertising law. This is the definition of done for the remediation pass and the pre-publish gate.

---

## The single governing rule

You may advertise a **health service** (a consultation, an assessment, an ongoing program). You may **not** advertise a **prescription medicine**, name it, imply it, or present the service as the way to obtain it. Framing must be **condition-led and service-led, never product-led**.

The terms that must not appear anywhere public (page copy, headings, titles, meta descriptions, URLs, image alt text, and JSON-LD schema) are: peptides, weight-loss injections, GLP-1, semaglutide, tirzepatide, Ozempic, Wegovy, Mounjaro, medicinal or medical cannabis, THC, CBD, TRT, testosterone replacement therapy, and any specific S4 or S8 medicine or brand. Conditions may be named (low testosterone, erectile dysfunction, menopause, PCOS, hair loss). Weight loss as a goal or service may be named. The delivery form of a medicine (an "injection") may not be the headline of a page.

Three points decide the harder calls, and all three are the regulator's own position:

- A disclaimer does not fix non-compliant content. The TGA states that adding a caveat such as "speak to a practitioner about appropriate options" does not exempt material from the restrictions. So the current medicinal-cannabis page's "this is not an advertisement" line does not save it.
- Naming the medicine as a service, or presenting the service as a route to the prescription, is itself advertising the medicine. A page headed "Medicinal cannabis prescription: check your eligibility" is the exact prohibited pattern.
- The named restricted categories include peptides, weight-loss injections, medicinal cannabis and erectile-dysfunction medicines by name in the current TGA guidance.

**Sources** (for the client's reviewer):
Complying with the restrictions on advertising prescription medicines to the public: tga.gov.au/resources/guidance/complying-restrictions-advertising-prescription-medicines-public
Advertising medicinal cannabis products is prohibited: tga.gov.au/resources/guidance/advertising-medicinal-cannabis-products-prohibited
New guidance on advertising restrictions for prescription medicines: tga.gov.au/news/media-releases/tga-releases-new-guidance-advertising-restrictions-prescription-medicines
What can and cannot be advertised to the general public: tga.gov.au/products/regulations-all-products/advertising/advertising-basics/what-can-and-cannot-be-advertised-general-public

**What we are deliberately NOT changing** (agreed in discovery and sales, compliant as built): the site structure and page hierarchy, the quiz-to-booking funnel and the quiz as the primary conversion action, the four-step "how it works" journey, the pricing display model, the condition pages themselves, the trust and safety pages, the review and cross-linking UX, the design language, and the Australian, plain-English tone. Only content that breaches AHPRA or TGA is touched.

---

## PART A: Global changes (apply once; affect every page)

### A1. Header navigation menu

**Current structure:**
Services → Weight Loss & Peptides (→ Weight Loss Injections, Medical Weight Loss Program) · Medicinal Cannabis · Men's Health (→ Erectile Dysfunction, Testosterone Replacement, Premature Ejaculation, Hair Loss Treatment) · Women's Health (→ Menopause Treatment, PCOS Management, Contraception & Sexual Health) · Online Doctor (→ five children) · How It Works · Pricing · About

**Change to:**
Services → **Weight Management** (→ Medical Weight Loss Program) · Men's Health (→ Erectile Dysfunction, **Low Testosterone**, Premature Ejaculation, **Hair Loss**) · Women's Health (→ **Menopause & Perimenopause**, PCOS Management, Contraception & Sexual Health) · Online Doctor (→ five children, unchanged) · How It Works · Pricing · About

Item by item:
- "Weight Loss & Peptides" becomes **"Weight Management"**. Why: "peptides" names a restricted prescription class.
- "Weight Loss Injections" is **removed** from the menu. Why: the item's whole identity is an injectable prescription, which cannot be advertised.
- "Medicinal Cannabis" is **removed** from the menu. Why: advertising medicinal cannabis to the public is prohibited outright.
- "Testosterone Replacement" becomes **"Low Testosterone"**. Why: the condition is fine to name; the therapy is not.
- "Hair Loss Treatment" becomes **"Hair Loss"**. Why: drop the "treatment" framing that foregrounds the prescription; the condition is fine.
- "Menopause Treatment" becomes **"Menopause & Perimenopause"**. Why: same reason; keep the condition, drop the treatment framing.
- All other menu items are unchanged. Why: they are condition-led or service-led and compliant.

### A2. Footer "Our Services" column

**Current:** Weight Loss & Peptides · Men's Health · Women's Health · Medicinal Cannabis · Online Doctor · Mental Health Support
**Change to:** Weight Management · Men's Health · Women's Health · Online Doctor · Mental Health Support
Why: mirror the nav changes; remove medicinal cannabis; rename the weight item.

### A3. Footer business-hours line

**Current:** "Australia-wide telehealth · Hours: Monday to Sunday, 8am to 10pm AEST"
**Change to:** confirm with the client first. Her live contact page shows Monday to Friday, 8am to 5pm; the onboarding note is ambiguous. Set one true figure and use it identically in the footer, the contact page and any schema. Why: inconsistent or overstated hours are a false-or-misleading representation and also break local SEO signals.

### A4. Structured data (JSON-LD schema)

Update the schema blocks on every affected page so they carry no restricted terms. Confirmed restricted terms currently sit in the JSON-LD on: the weight-management pages ("peptide", "weight loss injection"), the men's health and low-testosterone pages ("TRT", "testosterone replacement"), and the medicinal cannabis page ("cannabis"). Why: schema is machine-read by Google and is exactly what an automated compliance sweep parses; a visible-copy fix that leaves the schema dirty is not a fix.

### A5. Indexing gate

Keep the whole site `noindex, nofollow` until the client has given written sign-off. Only enable indexing after sign-off. Why: the agreement requires the client's express written approval before regulated content is published, and the titles and meta descriptions must be clean before Google ever sees them.

### A6. Standing rules for all current and future content

No naming of any S4 or S8 medicine, class or brand in public copy, headings, titles, meta, URLs, alt text or schema. No presenting the service as a means to obtain a specific prescription. No relying on a disclaimer to carry otherwise non-compliant content. No testimonials or reviews about clinical care on the site, and no before-and-after imagery. Wherever a specific practitioner is named, show their name and AHPRA registration number. No outcome guarantees. Any Medicare or bulk-billing statement must be accurate for the actual service. Why: these are the recurring AHPRA and TGA failure points in this vertical and the ones enforcement has targeted.

---

## PART B: Page-by-page changes

### B1. Home  (`/`)

- **Meta description.** Current: "AHPRA-registered telehealth clinic. Consult online for peptides for weight loss, men's and women's health and everyday care. Free pre-screening, Australia-wide." Change to: "AHPRA-registered telehealth clinic. Online consultations for weight management, men's and women's health, and everyday care. Free pre-screening, Australia-wide." Why: removes "peptides", which would otherwise show in Google.
- **Title.** Current: "Online Telehealth Clinic Australia | Weight Loss & More". No change. Why: "weight loss" as a goal is permitted; no medicine is named.
- **H1.** Current: "Australia's practitioner-led telehealth clinic for weight loss, hormones and everyday care". No change. Why: condition-and-service-led, compliant.
- **Intro paragraph.** Current contains "Our practitioners consult on peptides for weight loss, men's and women's health, and a wide range of everyday health needs." Change that clause to "Our practitioners consult on weight management, men's and women's health, and a wide range of everyday health needs." Why: removes "peptides".
- **Service card 1.** Current title "Weight Loss & Peptides"; description "Peptides for weight loss, weight-loss injections, and medically supervised programs, assessed by a practitioner and reviewed over time." Change title to "Weight Management" and description to "Medically supervised weight-loss consultations and programs, assessed by a practitioner and reviewed over time." Why: removes "peptides" and "weight-loss injections".
- **Service card "Medicinal Cannabis".** Current title "Medicinal Cannabis"; description "Find out if you may be eligible for a medicinal cannabis prescription, assessed under TGA pathways by registered practitioners."; link "Check eligibility". **Remove the entire card.** The services grid drops from six cards to five. Why: this card advertises medicinal cannabis and frames the clinic as the route to a prescription.
- All other cards, pricing strip, four-step section, "why patients choose", FAQ: no change. Why: compliant as written, including "a prescription is never guaranteed", which is the correct framing to keep.

### B2. Services overview  (`/services/`)

This page repeats the home service cards. Apply the same two changes: rename the "Weight Loss & Peptides" card to "Weight Management" with the reworded description from B1, and remove the "Medicinal Cannabis" card. Title and H1 ("Choose a service and book your consultation") need no change. Why: same as B1.

### B3. Weight Management parent  (was `/weight-loss-peptides/`)

- **URL.** Change `/weight-loss-peptides/` to `/weight-management/` with a 301 redirect. Why: the URL string itself contains "peptides".
- **Title.** Current: "Peptides for Weight Loss | Medical Weight Loss Clinic AU". Change to: "Medical Weight Loss Clinic Online | Australia". Why: removes "peptides".
- **Meta description.** Current: "Explore peptides for weight loss with AHPRA-registered practitioners. Medical weight-loss consults online, Australia-wide. Free pre-screening, no obligation." Change to: "Medically supervised weight loss with AHPRA-registered practitioners. Online weight-loss consultations, Australia-wide. Free pre-screening, no obligation." Why: removes "peptides".
- **H1.** Current: "Peptides for weight loss, guided by AHPRA-registered practitioners". Change to: "Medical weight loss, guided by AHPRA-registered practitioners". Why: removes "peptides".
- **Intro paragraph.** Current: "Peptides for weight loss have become one of the most searched-for treatments in Australia, and also one of the most misunderstood. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses whether a peptide-based or other medical weight-loss approach is clinically appropriate for you, then supports you through it with proper review. This is medical weight loss, delivered online. It starts with understanding your health, not with handing out a product." Change to: "Medical weight loss has become one of the most sought-after areas of care in Australia, and one of the most misunderstood. At Horizon Health Care Partners, an AHPRA-registered practitioner assesses whether a medically supervised weight-loss approach is clinically appropriate for you, then supports you through it with proper review. This is medical weight loss, delivered online. It starts with understanding your health, not with handing out a product." Why: removes "peptides" and "peptide-based" while keeping the (good) message that care starts with assessment, not a product.
- **Section H2.** Current: "What \"peptides for weight loss\" actually means", followed by a paragraph explaining that peptides are amino-acid chains and that several prescription weight-management treatments fall into that category. Change the heading to "How medically supervised weight loss works" and replace the paragraph with: "Medically supervised weight loss means a registered practitioner assesses your health, agrees a plan with you, and reviews it over time, rather than you buying something without advice. Where a prescription is clinically appropriate, that decision is made in your consultation, based on your history, your other medications, your goals and your safety. We do not name or promote specific medicines on this page, and we do not sell them. Your practitioner discusses suitable options with you directly, in private." Why: removes the explainer that names and describes the restricted class, while keeping the honest "assessment first, no product-selling" positioning.
- **"Talk it through" step.** Current body: "...discusses whether a peptide-based or other medical weight-loss option is appropriate...". Change to: "...discusses whether a medically supervised weight-loss option is appropriate...". Why: removes "peptide-based".
- **FAQ heading.** Current: "Common questions about peptides for weight loss". Change to: "Common questions about medical weight loss". First FAQ currently "Are peptides for weight loss available in Australia?", which becomes "Is medical weight loss available online in Australia?", and reword the answer to describe the consultation and assessment rather than the medicine. Why: removes "peptides".
- **"Explore your options" cards.** Remove the "Weight loss injections" card (page is being removed, B4). Keep "Medical weight loss program" and the men's/women's cross-links. Why: the injections page is going.
- **JSON-LD.** Strip "peptide" from all schema on this page (see A4).

### B4. Weight Loss Injections child  (`/weight-loss-peptides/weight-loss-injections/`)

**Remove the page. 301 redirect to `/weight-management/`.** Why: the page exists to describe and promote an injectable prescription. Its title ("Weight Loss Injections Australia"), meta ("prescription weight-loss injections"), H1 and body are all built on the restricted product, and weight-loss injections are named by the TGA as a restricted category. Unlike the condition pages, this one cannot be reframed without removing its reason to exist, so it is cleaner to fold it into the medical-weight-loss content. If the client specifically wants injectable options mentioned at all, they belong as one neutral line inside the consultation description on the parent page, never as a standalone destination.

### B5. Medical Weight Loss Program child  (was `/weight-loss-peptides/medical-weight-loss-program/`)

- **URL.** Change to `/weight-management/medical-weight-loss-program/` with a 301. Why: parent path no longer contains "peptides".
- **Keep the page.** It describes a supervised service (assessment, testing, plan, review), which is compliant.
- **Body and cross-links.** Remove the "peptide" occurrence in the body and change the "Weight loss & peptides" cross-link card to "Weight management" and remove the "Weight loss injections" cross-link card. Why: same restricted terms; keep the page otherwise intact.
- **JSON-LD.** Strip "peptide" (see A4).

### B6. Medicinal Cannabis  (`/medicinal-cannabis/`)

**Remove the page entirely. 301 redirect to `/` (or `/online-doctor/`).** Remove it from the nav (A1), the home services grid (B1), the services overview (B2) and the footer (A2). Why: this is the highest-risk page on the site. Its title ("Medicinal Cannabis Prescription | Eligibility Check"), H1 ("Medicinal cannabis prescription: eligibility assessed by registered practitioners") and "check your eligibility" call to action present the clinic as the way to obtain a medicinal-cannabis prescription, which is the exact pattern the TGA prohibits, and the page's "not an advertisement" line does not cure it. The body copy is carefully written, but careful wording around a prohibited subject is still prohibited. Cannabis care can still be delivered to patients; it simply cannot be advertised, named or gated behind a public page. (Client decision required, see Part D: full removal is recommended; a stripped, strictly non-promotional information page is possible but materially higher-risk and not advised.)

### B7. Men's Health parent  (`/mens-health/`)

- **Title.** Current: "Men's Health Clinic Online | ED, TRT & More | AU". Change to: "Men's Health Consultations Online | Australia". Why: removes "TRT"; keeps a clean service title.
- **Meta description.** Current: "Discreet men's health consultations online. Talk to an AHPRA-registered practitioner about ED, low testosterone, hair loss and more. Australia-wide telehealth." No change. Why: these are conditions, which may be named.
- **H1.** Current: "Men's health, handled discreetly and online". No change required for compliance. Optional per the client's preference: change "discreetly" to "privately". Why: "discreetly" is correct English (it means privately), but the client found it jarring, and "privately" reads the same and satisfies her; her call.
- **Service card.** Current: "Low testosterone and TRT". Change to: "Low testosterone". Why: keep the condition, drop the therapy acronym.
- **Medicare FAQ.** Current: "Do you bulk bill or offer Medicare rebates? Some telehealth consultations may attract a Medicare rebate in certain circumstances. Check with Medicare, and we can provide documentation to support a claim." Change to: "Do you offer Medicare rebates? Most of our consultations are private and are not bulk billed. A Medicare rebate applies only in limited circumstances, and only where you have an eligible relationship with the practitioner. We suggest confirming your eligibility with Medicare before you book." Why: the current wording overstates rebate availability for a private weight, hormone and men's-health service and offering "documentation to support a claim" implies an entitlement that will usually not exist; that is a false-or-misleading representation risk. (Confirm the accurate position with the client, Part D.)
- **JSON-LD.** Strip "TRT" (see A4).

### B8. Erectile Dysfunction  (`/mens-health/erectile-dysfunction-treatment/`)

- **Title.** Current: "Erectile Dysfunction Treatment Online | Australia". Change to: "Erectile Dysfunction Consultations Online | Australia". Why: shift from the medicine ("treatment") to the service.
- **Meta description.** Current opens "Erectile dysfunction treatment assessed online by AHPRA-registered practitioners...". Change to "Erectile dysfunction assessed online by AHPRA-registered practitioners. Private, judgement-free consultations Australia-wide. Free pre-screening." Why: same shift.
- **H1.** Current: "Erectile dysfunction treatment, assessed privately online". Change to: "Erectile dysfunction, assessed privately online". Why: same shift.
- **Cross-link card.** Current: "Testosterone replacement therapy". Change to: "Low testosterone". Why: condition not therapy.
- **URL.** Optional: change `/erectile-dysfunction-treatment/` to `/erectile-dysfunction/` with a 301 for consistency; not compliance-critical. The body is condition-led and stays. Why: ED is a condition and consultations for it are a permitted service; only the "treatment" framing and the TRT cross-link needed fixing.

### B9. Low Testosterone  (was `/mens-health/testosterone-replacement-therapy/`)

- **URL.** Change to `/mens-health/low-testosterone/` with a 301. Why: the path names the therapy.
- **Title.** Current: "TRT Australia | Low Testosterone Treatment Online | HHCPA". Change to: "Low Testosterone, Assessed Online | Australia | HHCPA". Why: removes "TRT" and "treatment".
- **Meta description.** Current names "testosterone replacement therapy (TRT)". Change to: "Low testosterone assessed online by AHPRA-registered practitioners. Symptom review and pathology where needed. Australia-wide telehealth." Why: removes the therapy naming.
- **H1.** Current: "TRT in Australia: low testosterone, assessed properly online". Change to: "Low testosterone, assessed properly online". Why: removes "TRT".
- **Intro paragraph.** Current: "TRT in Australia is a genuine medical treatment, and it deserves a genuine medical assessment. At Horizon Health Care Partners, an AHPRA-registered practitioner reviews your symptoms, arranges the right blood tests, and discusses whether testosterone replacement therapy is appropriate for you. Low testosterone is often missed and sometimes over-treated. A careful, evidence-led approach protects you from both." Change to: "Low testosterone is a genuine medical issue, and it deserves a genuine medical assessment. At Horizon Health Care Partners, an AHPRA-registered practitioner reviews your symptoms, arranges the right blood tests, and discusses whether treatment is appropriate for you. Low testosterone is often missed and sometimes over-treated. A careful, evidence-led approach protects you from both." Why: removes "TRT" and "testosterone replacement therapy" while keeping the clinical message intact.
- **Step "A plan".** Current: "If testosterone replacement therapy is appropriate, your practitioner explains how it works...". Change to: "If treatment is appropriate, your practitioner explains how it works...". Why: removes the therapy naming.
- **Section H2.** Current: "Why monitoring is part of TRT" with body referring to "Testosterone therapy". Change heading to "Why monitoring matters" and change "Testosterone therapy is not something to start and forget" to "Treatment for low testosterone is not something to start and forget". Why: removes "TRT" and the therapy naming; the monitoring content stays.
- **Cross-link card.** "Erectile dysfunction" stays; "Men's health" stays. No change.
- **JSON-LD.** Strip "TRT" and "testosterone replacement" (see A4).

### B10. Premature Ejaculation  (`/mens-health/premature-ejaculation-treatment/`)

- **Title.** Current: "Premature Ejaculation Treatment Online | Australia | HHCPA". Change to: "Premature Ejaculation Consultations Online | Australia | HHCPA". Why: service not medicine.
- **H1.** Current: "Premature ejaculation treatment, assessed discreetly online". Change to: "Premature ejaculation, assessed discreetly online". Why: same.
- **URL.** Optional: `/premature-ejaculation/` with a 301. Body is condition-led and stays. Why: PE is a condition; only the "treatment" framing needed softening.

### B11. Hair Loss  (was `/mens-health/hair-loss-treatment/`)

- **Title.** Current: "Hair Loss Treatment for Men | Online | Australia". Change to: "Hair Loss in Men, Assessed Online | Australia". Why: softens the "treatment" framing.
- **H1.** Current: "Hair loss treatment for men, assessed online". Change to: "Hair loss in men, assessed online". Why: same.
- **URL.** Change `/hair-loss-treatment/` to `/hair-loss/` with a 301. Why: consistency. This page is lower-risk than ED and testosterone, but the same condition-led framing keeps it clean given hair-loss prescriptions are S4. Body stays.

### B12. Women's Health parent  (`/womens-health/`)

No compliance change. Title, meta, H1 and body are condition-led (menopause, PCOS, contraception, hormonal health). Confirm the body does not name a specific hormone therapy as an offering; if it does, reframe to "options discussed in your consultation". Why: women's health consultations are a permitted service and no medicine is named.

### B13. Menopause & Perimenopause  (`/womens-health/menopause-treatment/`)

- **Title.** Current: "Menopause Treatment Online | Perimenopause & MHT | Australia". Change to: "Menopause & Perimenopause, Assessed Online | Australia". Why: removes "MHT" (menopausal hormone therapy is an S4 therapy) and the "treatment" framing.
- **Meta description.** Current names "menopausal hormone therapy (MHT) options". Change to: "Menopause and perimenopause assessed online by AHPRA-registered practitioners. Symptom review and options discussed in your consultation. Australia-wide." Why: removes the therapy naming.
- **H1.** Current: "Menopause treatment, assessed online by practitioners who listen". Change to: "Menopause and perimenopause, assessed online by practitioners who listen". Why: same.
- **Body.** Wherever the copy names MHT or HRT as the offering, change to "options your practitioner discusses with you". Why: keep the condition and the consultation; do not advertise the hormone therapy.
- **URL.** Optional: `/womens-health/menopause/` with a 301.

### B14. PCOS Management  (`/womens-health/pcos-management/`)

- **Keep the page.** PCOS is a condition and "management" is a service; both are fine.
- **Cross-link card.** Current: "Weight loss & peptides". Change to: "Weight management". Why: removes "peptides".
- **JSON-LD / body.** Strip the "peptide" occurrence flagged on this page. Why: restricted term in a cross-reference.

### B15. Contraception & Sexual Health  (`/womens-health/contraception/`)

No change. Condition-led and service-led throughout; compliant. Why: contraception advice and eligible prescriptions handled in consultation is a permitted service and no restricted product is named.

### B16. Online Doctor parent and children

- `/online-doctor/`. No change. Service-led, compliant.
- `/online-doctor/online-prescriptions/`. No change. Frames prescriptions as "where clinically appropriate", which is correct.
- `/online-doctor/medical-certificates/`. No change. "Issued on clinical judgement" framing is compliant.
- `/online-doctor/pathology-imaging-referrals/`. No change. The line "many pathology tests are covered by Medicare when referred appropriately" is accurate for practitioner-referred pathology and may stay.
- `/online-doctor/specialist-referrals/`. No change.
- `/online-doctor/mental-health/`. No change. ADHD, anxiety, sleep and smoking cessation are named as conditions and support, not as specific medicines; keep, and ensure no specific S8 stimulant is ever named.
Why for all: these pages advertise services and name conditions only, which is permitted; they inherit the corrected nav and footer.

### B17. How It Works  (`/how-it-works/`)

No change. The four-step journey and the "a prescription is never guaranteed" line are compliant and worth keeping. Why: it advertises the process, not a medicine.

### B18. Pricing  (`/pricing/`)

- **"Can I claim a Medicare rebate?" FAQ.** Current: "Some telehealth consultations may attract a Medicare rebate in certain circumstances. Check with Medicare, and we can provide documentation to support a claim." Change to the same corrected wording as B7 (private by default; rebate only in limited, eligible circumstances; confirm with Medicare). Why: consistency and accuracy.
- **"Other services" block.** Verify the rows list only compliant service names and the client's confirmed prices. Do not list "peptides", "injections", "TRT" or "medicinal cannabis" as priced line items. Align the figures with the client's confirmed pricing (she flagged changes and wants "from" clarified). Why: pricing that names restricted products advertises them, and stale figures are misleading. (Client input required, Part D.)
- Core consultation fee cards and "what your fee includes": no change. Why: compliant.

### B19. About Us  (`/about-us/`)

No compliance change. The staging copy is clean: it does not call the founder "Dr", does not claim "doctors" the clinic does not yet have, and it states the clinic is an Australian entity run through AHPRA-registered practitioners. Keep as is. Why: accurate and compliant as written. (Note: the client's separate live site does call her "Dr Ranjeeta Roshan" and refers to "our experienced doctors and nurses"; that is a live-site issue to raise gently with her, not a staging change.)

### B20. Our Practitioners  (`/our-practitioners/`)

No change now. The page correctly states profiles will be published as clinicians join, and does not invent practitioners. Standing item: when practitioners are confirmed, publish each name with their AHPRA registration number, and only then. Why: AHPRA requires the registration number wherever a practitioner is identified, and the claim "every consultation is with an AHPRA-registered practitioner" must remain true as the roster fills.

### B21. Contact  (`/contact/`)

No content change beyond reconciling the business hours (A3). Why: compliant; only the hours figure must be consistent and true.

### B22. FAQs  (`/faqs/`)

- **"Cost and Medicare" section.** Current answer: "Some telehealth consultations may be eligible for a Medicare rebate in certain circumstances. Check with Medicare or your insurer, and we can provide documentation." Change to the corrected Medicare wording (B7). Why: consistency and accuracy across the site.
- All other FAQ sections (getting started, prescriptions and treatment, privacy and safety): no change. Why: compliant, with correct "where clinically appropriate" framing.

### B23. Pre-Screening Quiz  (`/quiz/`)

The quiz is a JavaScript-rendered application, so its question logic cannot be read from the page source and is not covered by this copy pass. **It requires a separate, dedicated review before sign-off**, against AHPRA's warning about online questionnaires that "coach patients to say the right thing" and that materially gate a prescribing decision. Export the full question set and routing logic and review it explicitly. Why: the quiz is the primary conversion action and the single most scrutinised element in this vertical; it was already flagged for compliance review in onboarding. Do not treat the site as signed off until the quiz is reviewed.

### B24. Transfer Your Care  (`/discharge/`)

No compliance change. Confirm any promotional discount ("save on your first consultation") is stated accurately. Why: a transfer service and an accurate discount are permitted; no medicine is advertised.

### B25. Patient Safety & Emergencies  (`/patient-safety/`)

No change. Keep. Why: this is a required, compliant safety page and an asset.

### B26. Complaints  (`/complaints/`)

No change. Keep. Why: required by AHPRA advertising guidance and compliant.

### B27. Conflict of Interest & Pharmacy Disclosure  (`/conflict-of-interest-disclosure/`)

No change to the page itself. Once medicinal cannabis is removed from the public site, confirm the pharmacy-disclosure wording still reads correctly in general terms. The client must supply the actual pharmacy relationship (single or multiple, any commission) so the disclosure is accurate. Why: the page is required and valuable; its content must match reality. (Client input required, Part D.)

### B28. Privacy Policy  (`/privacy/`)

No change. Compliant; the "guarantee" hits here are ordinary contractual language. Why: standard privacy content.

### B29. Terms and Conditions  (`/terms-and-conditions/`)

Replace the specific "medicinal cannabis" reference in the Definitions and Services sections with a generic phrase such as "prescription medicines, where clinically appropriate". Have the client's legal reviewer confirm. Why: terms are contractual rather than promotional, so the risk is lower, but naming medicinal cannabis anywhere public is best avoided once it is removed from the site, and consistency matters if a regulator reads the whole domain.

### B30. Knowledge Hub / Articles  (`/articles/` and article pages)

The three article bodies are educational and condition-led and stay as written, with one fix: the weight-loss article ends with a "Read about Weight loss & peptides" cross-link, which becomes "Weight management" per Shared Block C. (Article bodies were scanned directly; this was the only restricted term in them.) Standing rule: articles must stay educational and must never name or promote a specific S4 or S8 product, peptides or cannabis. Why: educational content is permitted; product-led content is not.

---

## PART C: Redirect (301) map

- `/weight-loss-peptides/` → `/weight-management/`
- `/weight-loss-peptides/weight-loss-injections/` → `/weight-management/` (page removed)
- `/weight-loss-peptides/medical-weight-loss-program/` → `/weight-management/medical-weight-loss-program/`
- `/medicinal-cannabis/` → `/` (page removed)
- `/mens-health/testosterone-replacement-therapy/` → `/mens-health/low-testosterone/`
- `/mens-health/hair-loss-treatment/` → `/mens-health/hair-loss/`
- `/mens-health/erectile-dysfunction-treatment/` → `/mens-health/erectile-dysfunction/` (optional)
- `/mens-health/premature-ejaculation-treatment/` → `/mens-health/premature-ejaculation/` (optional)
- `/womens-health/menopause-treatment/` → `/womens-health/menopause/` (optional)

Update every internal link (nav, footer, in-body cross-links, cards, breadcrumbs) to the new paths regardless of the redirects, so the site never links to a redirecting URL. The site is not yet indexed, so redirects here mainly protect internal integrity and any equity carried over when the build replaces the live domain.

**SEO note (a compliance consequence, not a free choice):** the site can no longer target "peptides for weight loss", "weight loss injections", "TRT" or "medicinal cannabis" as keywords, because it cannot use the words. The compliant target clusters are condition-led and service-led: "medical weight loss", "weight loss clinic online", "low testosterone", "menopause help online", "men's health telehealth", "online doctor". This is the same clean-term approach the strategy deck already described for paid search, now applied to organic as well.

---

## PART D: Items that need the client's input or written sign-off before publish

1. Medicinal cannabis: confirm full removal from the public site (recommended) rather than a stripped information page.
2. Medicare and bulk-billing: confirm the accurate position for her service mix so the reworded answers are correct.
3. Practitioner details: names and AHPRA registration numbers, supplied as clinicians join, before any page names a practitioner or before ads run.
4. Quiz logic: export and review the question set and routing; obtain written sign-off.
5. Business hours: one true figure for the footer, contact page and schema.
6. Pricing rows for the "Other services" block, with confirmed figures and "from" pricing clarified.
7. Pharmacy relationship for the conflict-of-interest disclosure.
8. Optional wording preference: "discreetly" to "privately" on the men's health H1.

Under the agreement, every regulated page needs her express written approval before it is published; nothing is deemed approved by silence.

---

## PART E: Flagged, but outside the website copy scope

- **Repuboost review flow.** The described approach of routing positive feedback to Google and negative feedback to a private form is a review-gating pattern that carries its own risk under ACCC guidance on misleading reviews and under AHPRA's rules on reviews and testimonials for regulated health services. Review this separately before it goes live; it is not part of the site copy but it is a compliance exposure.
- **Google and Meta advertising.** Run only on compliant, condition-led and service-led terms, with healthcare advertiser verification in place, and never on peptide, injection, testosterone or cannabis keywords. Landing pages must be the corrected pages, not restricted-term pages.

---

## PART F: Pre-publish gate (the go-live checklist)

Do not enable indexing or run any advertising until every item below is true and the client has approved in writing.

1. No restricted term appears in any page copy, heading, title, meta description, URL, image alt text or JSON-LD schema, verified by viewing page source, not only the rendered page.
2. The medicinal cannabis page is removed and redirected, and gone from nav, home grid, services overview and footer.
3. The weight-loss-injections page is removed and redirected; the weight parent, its URL, title, meta, H1 and body are reframed to medical weight loss.
4. The testosterone page is reframed to low testosterone across URL, title, meta, H1, body and schema.
5. The Medicare and bulk-billing wording is corrected on the men's health, pricing and FAQ pages, and confirmed accurate with the client.
6. All ED, PE, hair-loss and menopause "treatment" framings are reframed to condition and consultation.
7. The quiz question logic has been reviewed and signed off separately.
8. Business hours are consistent and true across footer, contact page and schema.
9. Practitioner pages name only real, AHPRA-registered practitioners with their registration numbers, or state that profiles will follow.
10. The client has given written approval on every regulated page.

---

*End of specification.*
