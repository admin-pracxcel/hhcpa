# HHCPA staging site: complete build specification

**Prepared:** 10 September 2026
**Staging:** https://hhcpa.pracxcel.com
**Client live site (source of "original website" content):** https://horizonhealthcarepartners.com.au
**Version:** 2.1, amended after receipt of the six assessment forms (HHCPA-FRM-002 to 007, Version 1.1). Amendments are in Sections 2.6, 4.7, 7.2, 8 and 9.
**Scope:** every change arising from Ranjeeta's emails of 7 September (11:36), 9 September (15:11) and her red-annotated reply of 9 September (20:10), plus the Weight Management / Health Optimisation separation.

---

## 0. How to use this document

Work top to bottom. Sections 1 to 3 change the architecture, so do them before Section 4, which changes page content. Section 9 is the gate: nothing goes to the client for review until every line in it passes.

Three conventions used throughout:

**CURRENT** means the exact string as it stands on staging today, verified by crawl on 10 September 2026. If your build does not contain that string, stop and check you are on the right component before editing.

**TARGET** means the exact string to replace it with. Where the target copy is Ranjeeta's own wording, it is reproduced verbatim and must not be paraphrased or "improved".

**SOURCE: LIVE** means the content must be lifted from her live site rather than written fresh. Where I have been able to retrieve that content, it is reproduced in Section 10 so nobody has to guess.

Anything marked **BLOCKED** must not be built until she answers. Build everything else around it.

---

## 1. Target site architecture

The current staging build has five service areas. The target has eight. Her live site navigation already carries seven of them, and her footer instruction of 9 September named the three that staging is missing.

### 1.1 Final service map

| # | Service area | URL | Status |
|---|---|---|---|
| 1 | Weight Management | `/weight-management` | Exists, no structural change |
| 2 | Health Optimisation & Complete Wellness | `/health-optimisation` | **NEW HUB** |
| 3 | Men's Health | `/mens-health` | Exists |
| 4 | Women's Health | `/womens-health` | Exists |
| 5 | Mental Health Support | `/online-doctor/mental-health` | Exists, promote in nav |
| 6 | Online Doctor (GP and everyday care) | `/online-doctor` | Exists |
| 7 | Continuity & Preventative Health | `/continuity-preventative-health` | **NEW HUB** |
| 8 | Holistic Care / Alternative Medicine | `/holistic-alternative-care` | **NEW HUB** |

Three new hubs, not one. This is the single most commonly missed item in this brief.

### 1.2 Existing child pages (unchanged)

`/weight-management/medical-weight-loss-program`
`/mens-health/erectile-dysfunction`
`/mens-health/low-testosterone`
`/mens-health/premature-ejaculation`
`/mens-health/hair-loss`
`/womens-health/menopause`
`/womens-health/pcos-management`
`/womens-health/contraception`
`/online-doctor/online-prescriptions`
`/online-doctor/medical-certificates`
`/online-doctor/pathology-imaging-referrals`
`/online-doctor/specialist-referrals`
`/online-doctor/mental-health`

### 1.3 Non-service pages

`/`, `/about-us`, `/services`, `/pricing`, `/how-it-works`, `/our-practitioners`, `/articles` and three article pages, `/quiz`, `/contact`, `/discharge`, `/faqs`, `/patient-safety`, `/complaints`, `/conflict-of-interest-disclosure`, `/privacy`, `/terms-and-conditions`, plus **one new page**: Discharge Letter (Section 3.4).

### 1.4 Decision recorded: Mental Health Support URL

Mental Health Support is a main service in her footer instruction but currently sits at `/online-doctor/mental-health`. Keep that URL. Promote it to a top-level group in the navigation and footer. Nav position and URL depth do not need to match, the page is already built at that path, and the blog programme already links to it. Do not move it.

---

## 2. Global changes (apply across the whole site)

### 2.1 Remove the scroll animation on intro paragraphs

**CURRENT:** intro paragraphs on `/`, `/about-us`, `/how-it-works`, `/discharge` and others render each word in a separate wrapping element so it can reveal and change colour on scroll. This is visible in the DOM as one element per word.

**TARGET:** render each intro paragraph as a single block of text in one solid colour. Remove the per-word wrapping entirely, not just the animation trigger, so the text is one selectable, copyable paragraph. Verify on every page listed above and on any other page using that component.

### 2.2 Replace the site-wide tagline

**CURRENT:** `Your health, handled from home`
**TARGET:** `Professional Healthcare, Wherever You Are`

This string appears on **33 pages**. It is the closing call-to-action heading on every page except `/`, `/patient-safety`, `/quiz` and `/weight-management`. Search and replace globally, then re-crawl to confirm zero remaining instances.

### 2.3 Compulsory emergency line

**TARGET (exact):**
`Medical emergency? Call 000 immediately. If you are in crisis, call Lifeline 13 11 14 (24/7) or Beyond Blue 1300 22 4636.`

Verified already present on 35 of 36 pages. **Only `/quiz` is missing it.** Add it there. Do not re-add elsewhere or you will duplicate it.

### 2.4 Hero images on inner pages

**TARGET:** replace hero images on inner pages with the corresponding hero images from her live site. Two heroes are explicitly protected by her instruction and must be kept or restored:

- `/about-us`: the hero showing the river and trees.
- `/how-it-works`: keep the existing hero and its wording, `How it works: from pre-screening to ongoing care in four steps`.
- `/pricing`: keep the existing hero and its wording, `Pre-screening is free. No commitment until you're ready.`

### 2.5 Add the three new services everywhere the taxonomy is hard-coded

Every location below enumerates services and will silently fall out of sync. Update all of them:

1. Header mega-menu (Section 6.1)
2. Footer services column (Section 6.2)
3. Homepage "What we help with" grid (Section 4.1.4)
4. `/services` "What we help with" grid (Section 4.6)
5. `/pricing` "Other services" table (Section 5.1)
6. Homepage "Everything in one place" body copy (Section 4.1.7)
7. Homepage intro paragraph (Section 4.1.2)
8. Breadcrumb configuration
9. `/about-us` clinical standards paragraph (Section 4.4.5)

### 2.6 The "two minutes" quiz claim is now wrong

**CURRENT:** 42 instances across 35 pages describe the pre-screening quiz as taking about two minutes. Phrases in use include `two minutes`, `about two minutes` and `free two-minute pre-screening quiz`.

**Reality:** the six assessment forms she has supplied are 5 to 7 minutes each.

**TARGET:** on service pages, state that service's actual time (Men's Health five minutes, Holistic Care six, Women's Health six, Mental Health six, Weight Management seven, Health Optimisation seven). On non-service pages use `takes a few minutes`. Do not leave `two minutes` anywhere on the site.

`not a diagnosis` and `no commitment` remain accurate. Keep both.

---

## 3. New pages to build

### 3.1 Health Optimisation & Complete Wellness

**URL:** `/health-optimisation`
**Nav label:** `Health Optimisation & Complete Wellness`
**Page title:** `Health Optimisation & Wellness Programs Online | Australia`
**H1:** `Health optimisation and complete wellness, guided by AHPRA-registered practitioners`
**Price shown:** Programs from $299
**Schema:** `MedicalClinic` + `Service` block with `name: "Health optimisation and wellness programs"`, matching the pattern already used on `/mens-health`, `/womens-health` and `/online-doctor`. Plus `BreadcrumbList` and `FAQPage`.

**The seven sub-areas**, rendered as on-page sections at launch:

1. Metabolic Health
2. Healthy Ageing & Longevity
3. Recovery & Physical Wellbeing
4. Mental Clarity & Focus
5. Energy, Vitality & Wellness
6. Sexual Health & Wellbeing
7. General Wellness Optimisation

**Sub-area 1 rename:** her diagram says "Weight Management & Metabolic Health". Build it as **Metabolic Health** and keep every weight-loss reference out of it, otherwise this page and `/weight-management` compete for the same queries and the separation she asked for does not actually happen. This is flagged for her confirmation in Section 8, item 5. If she declines, revert the label but keep the copy weight-neutral regardless.

**Card description.** Her live site uses "Comprehensive programs focused on weight, energy, recovery and long-term health." **Drop "weight".**
**TARGET:** `Comprehensive programs focused on energy, recovery, healthy ageing and long-term health.`

**Content rules for this page, non-negotiable:**

- No medicine, medicine class, compound or brand named anywhere, including in metadata, alt text and schema.
- Do not build the seven sub-areas as a product or indication menu. Each section describes the concern, what assessment looks at, and what review involves.
- No longevity, anti-ageing or performance outcome claims.
- Sexual Health & Wellbeing must cross-link to the existing `/mens-health` and `/womens-health` condition pages rather than duplicating them. Keep it to two or three sentences plus links so the pages do not cannibalise each other.
- Do not use pepticlinic.com.au as a content model. See Section 7.1.

**Internal links out:** `/weight-management`, `/mens-health`, `/womens-health`, `/continuity-preventative-health`, `/how-it-works`, `/pricing`.

### 3.2 Continuity & Preventative Health

**URL:** `/continuity-preventative-health`
**Nav label:** `Continuity & Preventative Health`
**Price shown:** From $69
**Description (SOURCE: LIVE, verbatim):** `Chronic disease management, long-term care planning and preventative health support.`
**Schema:** `Service` block, name `Continuity and preventative health consultations`, plus `BreadcrumbList` and `FAQPage`.

Covers chronic disease management, long-term care planning, and preventative health review. Cross-link to `/online-doctor/pathology-imaging-referrals` and `/health-optimisation`.

### 3.3 Holistic Care / Alternative Medicine

**URL:** `/holistic-alternative-care`
**Nav label:** `Holistic Care / Alternative Medicine`
**Price shown:** From $49
**Description (SOURCE: LIVE, verbatim):** `A personalised approach supporting chronic conditions, pain, sleep and overall wellbeing through evidence-based treatment options.`
**Schema:** `Service` block, name `Holistic and alternative care consultations`, plus `BreadcrumbList` and `FAQPage`.

**Content rules for this page, non-negotiable.** Ranjeeta has defined this service internally as the medicinal cannabis service, in writing: "Transfer your care is specific to Holistic/Alternative Care (Medicinal Cannabis) $54." The service area itself is legitimate and her live-site description above is compliant. What must not happen is any public signal connecting this page to that prescription:

- Never name cannabis, medicinal cannabis, THC, CBD, plant medicine or any equivalent term, in copy, headings, URLs, metadata, alt text, schema, image filenames or the quiz.
- Do not present the page as a route to obtaining any prescription.
- Write it as genuine whole-person care across chronic conditions, pain, sleep and wellbeing, coordinating with medical care. That is what the live description already says, and it is the correct framing.
- The TGA has enforced against euphemisms used as product promotion. The euphemism is only a problem if the page signals what it stands in for. Keep the page genuinely broad and it is fine.

### 3.4 Discharge Letter page

**TARGET:** create a Discharge Letter page and place its link in the footer under the **Patients** column. Distinct from the existing `/discharge` (Transfer Your Care) page, which stays.
**Suggested URL:** `/discharge-letter`

---

## 4. Page-by-page content changes

### 4.1 Homepage `/`

#### 4.1.1 Page title

**CURRENT:** `Online Telehealth Clinic Australia | Weight Loss & More`
**TARGET:** `Online Telehealth Clinic Australia | AHPRA-Registered Practitioners`

Rationale: the current title leads on weight loss, which contradicts the eight-service structure and under-represents the new areas. Not a client instruction, so flag it to her as a recommendation rather than treating it as approved.

#### 4.1.2 Intro paragraph, full replacement

**CURRENT:** `Horizon Health Care Partners helps Australians get practical medical support without the waiting room. Our practitioners consult on weight management, men's and women's health, and a wide range of everyday health needs. You tell us what is going on through a short pre-screening quiz, you book a time that suits you, and you speak with a registered practitioner...`

**TARGET (Ranjeeta's own copy, use verbatim):**

> Healthcare designed around you, wherever you are in Australia.
>
> Horizon Health Care Partners Australia makes it easier to access professional, personalised healthcare without the waiting room. Our AHPRA-registered practitioners provide Australia-wide telehealth care across everyday health, holistic and alternative care, mental health, weight and metabolic health, men's and women's health, hormone health, health optimisation, prescriptions, referrals and preventative care.
>
> Getting started is simple. Complete a short pre-screening questionnaire where applicable, choose a consultation time that suits you, and speak directly with a registered healthcare practitioner who will review your health history, listen to your concerns and discuss appropriate options for your individual needs.
>
> Every treatment decision is based on an appropriate clinical assessment. Prescriptions and specific treatments are not guaranteed and are only provided where clinically appropriate.

Note: her original used an em dash in the first line. It has been rendered as a comma above, which is the only change made to her wording.

This paragraph satisfies her instruction that the intro list all services including GP and everyday care. Apply Section 2.1 to it: single block, one solid colour, no per-word animation.

#### 4.1.3 Hero subheading

**CURRENT:** `Australia's practitioner-led telehealth clinic for weight loss, hormones and everyday care`
**TARGET:** `Australia's practitioner-led telehealth clinic for everyday health, weight, hormones and health optimisation`

#### 4.1.4 Service boxes

**Instruction:** replace with the original versions from her website (SOURCE: LIVE).
**Behaviour (her answer to question 1, verbatim):** "Keep the current build where it takes to the services page and then it asks them to do the pre-screening questions before booking."

So restore the original **visual design** of the boxes, but keep the current **link behaviour**: box goes to the service page, and the service page prompts the pre-screening questionnaire before booking. Do not restore the original behaviour of jumping straight into the questionnaire.

The grid grows from five to eight boxes. Use the live-site descriptions where they exist:

| Service | Description | Price |
|---|---|---|
| Weight Management | Medically supervised weight management programs tailored to your health goals. | From $99 |
| Health Optimisation & Complete Wellness | Comprehensive programs focused on energy, recovery, healthy ageing and long-term health. | Programs from $299 |
| Men's Health | Discreet online consultations for erectile dysfunction, low testosterone, hair loss and more. | From $59 |
| Women's Health | Menopause and perimenopause support, hormones, PCOS and contraception, on your schedule. | From $59 |
| Mental Health Support | Practitioner-led support for ADHD, anxiety, sleep and smoking cessation. | From $59 |
| Online Doctor | Prescriptions, repeat scripts, medical certificates, and pathology or specialist referrals, where clinically appropriate. | From $49 |
| Continuity & Preventative Health | Chronic disease management, long-term care planning and preventative health support. | From $69 |
| Holistic Care / Alternative Medicine | A personalised approach supporting chronic conditions, pain, sleep and overall wellbeing through evidence-based treatment options. | From $49 |

#### 4.1.5 Fees section

**CURRENT title:** `Simple, upfront consultation pricing`
**TARGET title:** `Our Fees: Holistic Care / Alternative Medicine`

**CURRENT figures:** First consultation $59, Follow-up consultation $59, Transfer $54
**TARGET figures:** First medical consultation **$69**, Follow-up **$59**, Transfer **$59**

Her live site shows Follow-Up at $49. Her ticked instruction says $59. Build $59 and verify with her (Section 8, item 6).

#### 4.1.6 Four steps section

**Instruction:** the description under the second image reverts to the original wording (SOURCE: LIVE).

**TARGET (verbatim from live):**
Heading: `Book a Consultation` / `Schedule at Your Convenience`
Body: `Choose a time that suits you and book your telehealth appointment online.`

#### 4.1.7 "Everything in one place"

Three changes.

**(a) Combine two paragraphs into one.**

**CURRENT paragraph 1:** `Horizon brings the common threads of everyday healthcare into one online clinic, so you can deal with weight, hormones, sexual health, mental health and routine scripts through the same trusted practitioners.`

**Paragraph 2 (SOURCE: LIVE, does not exist on staging):** `We believe healthcare should be compassionate, transparent, and convenient. Our team is committed to providing medical guidance in a safe, stigma-free environment where every patient feels heard and respected.`

**TARGET (combined, with services added per (b)):**

> Horizon brings the common threads of everyday healthcare into one online clinic, so you can deal with weight and metabolic health, health optimisation, men's and women's health, mental health, holistic care, preventative health and routine scripts through the same trusted practitioners. We believe healthcare should be compassionate, transparent, and convenient. Our team is committed to providing medical guidance in a safe, stigma-free environment where every patient feels heard and respected.

**(b)** Health Optimisation and men's and women's health are added to the service list, done above.

**(c) Revert the three points to the original wording** (SOURCE: LIVE). Current staging points are `One clinic for weight, hormones and everyday care`, `The same practitioners across your concerns`, `No waiting room, no referral chase`. Replace with the equivalent points from her live site.

#### 4.1.8 "How we support you" image slider

**Instruction:** add back the slider from her original website (SOURCE: LIVE). Staging currently has a four-card text section with this heading; that is not the slider.

**Slider categories (verbatim from live):**
Professional Medical Consultations · Pain Management Support · Physical Wellbeing · Mental Wellbeing · Complex Health Concerns · General Health

#### 4.1.9 "Our Approach to Care"

**Instruction:** replace with the version from her original website (SOURCE: LIVE). Full source copy is in Section 10.1.

#### 4.1.10 FAQ section

**Instruction:** replace with the version from her original website (SOURCE: LIVE), titled `Your Questions Answered`. Source copy in Section 10.2.

Important: the live FAQ answer to "Will I receive a prescription?" states that prescriptions are not issued solely on the basis of completing an online questionnaire. Carry that across verbatim. It is strong compliance copy. See Section 7.3 for the conflict it creates with the certificate flow.

#### 4.1.11 Closing CTA

**Instruction:** replace with the original `Easy Access, Professional Care` section and **move it above the FAQ section**.

**TARGET (verbatim from live):**
Heading: `Easy Access, Professional Care`
Body: `Book online consultations with AHPRA-registered medical practitioners. Our streamlined telehealth process is simple and confidential.`

Order after change: ... → How we support you slider → Our Approach to Care → Everything in one place → Knowledge hub → **Easy Access, Professional Care** → **Your Questions Answered** → footer.

### 4.2 How It Works `/how-it-works`

1. Keep the hero and its wording: `How it works: from pre-screening to ongoing care in four steps`. No change.
2. **Add** the `Our Approach to Care` section from the original site (Section 10.1).
3. **Add** the `How We Support You` section from the original site (Section 10.1).
4. **Keep** a `Your Questions Answered` section. She specified it must include `How long does a consultation take?` and `What happens during my first consultation?` Source both from the live site. The current staging FAQ here has three different questions and should be replaced.
5. Safety section: **leave as is with the new version.** Solid background, no image. This is her explicit answer to question 5. Do not add an image.

### 4.3 Pricing `/pricing`

Covered in full in Section 5. In summary: keep the hero, move Other Services above the three-box section, retitle both, match the design treatment so neither is visually prioritised, correct the three-box figures, rename one row, add two rows, change one price.

### 4.4 About `/about-us`

#### 4.4.1 Hero

Keep the hero with the river and trees.
**TARGET hero heading:** `Your Health Journey Begins`
**TARGET subtitle, added below the title in a smaller size:** `Medical Consultations with Registered Healthcare Professionals`

#### 4.4.2 Intro paragraph, full replacement

This supersedes the individual edits about West End, "across the country" and "wherever they live". She asked for the whole paragraph replaced.

**CURRENT:** `Horizon Health Care Partners is an Australian telehealth clinic, based in West End, Queensland, serving patients across the country. We were founded on a straightforward belief: every Australian deserves accessible, practitioner-led healthcare, wherever they live. We are an Australian entity focused on Australian patients, and everything we do runs through AHPRA-registered practitioners.`

**TARGET (Ranjeeta's own copy, use verbatim):**

> **About HHCPA**
>
> Horizon Health Care Partners Australia is an Australian telehealth clinic providing professional healthcare to patients across Australia.
>
> We were founded on a simple belief: every Australian should have access to quality, practitioner-led healthcare, wherever they live.
>
> Our care is delivered by AHPRA-registered healthcare practitioners, with a focus on accessibility, professionalism, personalised care and genuine patient support. Through convenient telehealth consultations, we make it easier for Australians to access the healthcare they need from the comfort and privacy of home.
>
> Australian healthcare. Australian practitioners. Care centred around you.

Confirm after the swap that no reference to West End or "across the country" survives anywhere on the page.

#### 4.4.3 Our Story

**Instruction:** retain her original content exactly as written. The staging version is a rewrite and must be replaced. Verbatim source in Section 10.3.

Note the original opens `founded by Healthcare Practitioner Ranjeeta Roshan`. Keep that exact title. Do not upgrade it to "Dr" anywhere on the site.

#### 4.4.4 FAQ section

Replace with the version from her original website (SOURCE: LIVE).

#### 4.4.5 Clinical standards section

**No image.** Her feedback accepted, section stays as is.

One content edit: the paragraph currently reads `across weight management, men's and women's health, and everyday medical needs`. Update to reflect the eight service areas.

### 4.5 Transfer of Care `/discharge`

**CURRENT:** `Transfer consultations are $54.`
**TARGET:** `Transfer consultations are $59.`

Check for any other instance of $54 on the page and in the "Explore your options" block.

### 4.6 Services `/services`

The "What we help with" grid grows from five to eight, using exactly the same names, descriptions and prices as Section 4.1.4. Update the page intro to reflect eight areas.

### 4.7 Pre-screening quizzes `/quiz`

**Add** the compulsory emergency line (Section 2.3). This is the only page missing it.

Six assessment forms received, Version 1.1. Build each as its own per-service flow.

| Service | Form ID | Stated time |
|---|---|---|
| Weight Management | HHCPA-FRM-002 | 7 minutes |
| Holistic Care / Alternative Medicine | HHCPA-FRM-003 | 6 minutes |
| Mental Health Support | HHCPA-FRM-004 | 6 minutes |
| Men's Health | HHCPA-FRM-005 | 5 minutes |
| Women's Health | HHCPA-FRM-006 | 6 minutes |
| Health Optimisation & Complete Wellness | HHCPA-FRM-007 | 7 minutes |

**Not supplied:** HHCPA-FRM-001 (numbering gap, form unknown), and there is no form for Continuity & Preventative Health, none for general or everyday GP care, and none for the prescriptions ladder in Section 4.8.

**Common structure across all six.** Patient details (full legal name, date of birth, residential address, phone, email, emergency contact name, emergency contact phone), then service-specific sections, then a declaration with two mandatory confirmation checkboxes, then full legal name as electronic signature, then date.

**Build requirements.** Capture the electronic signature with a timestamp and store it against the submission as a record. Both checkboxes mandatory before submit. Display the per-service estimated time. Reproduce each form's declaration wording exactly, except FRM-007 (Section 4.7.1). Routing of completed forms into the patient profile is her stated requirement and is **BLOCKED** on Get Scripted access.

None of these fields exist on the site today. This is a new data-collection capability, not an edit to the current quiz.

#### 4.7.1 Peptide wording in FRM-007, must not ship as written

Two lines in the Health Optimisation form name peptides:

- `Have you previously used peptide therapy or other health optimisation treatment?`
- `I understand that health optimisation or peptide treatment is not guaranteed.`

The quiz is a public page. Publishing either line puts a restricted term back into public web content, and the declaration goes further by implying the clinic provides that treatment. This is the same failure mode as the original build, in a place nobody thought to check.

**Build these instead:**

Question: `Have you previously used any prescribed treatment for health optimisation, recovery or healthy ageing?` Yes / No, plus a free-text `If yes, provide details`. This captures identical clinical history.

Declaration: `I understand that health optimisation treatment is not guaranteed. The practitioner will assess the available evidence, potential benefits, risks, contraindications and monitoring requirements. Treatment will only be recommended or prescribed where legally permitted and clinically appropriate.`

If she wants the original wording kept for clinical reasons, it belongs in the post-booking intake the practitioner sees, which is not public. Raised with her in Section 8.

#### 4.7.2 Safety question in FRM-004

The Mental Health form asks `Have you recently had thoughts of harming yourself or someone else?` with a free-text follow-up.

A public web form cannot collect this and simply queue it. Build:

- Selecting Yes immediately surfaces crisis resources on screen before anything else: call 000, Lifeline 13 11 14, Beyond Blue 1300 22 4636.
- The form must never block the person from continuing or from leaving the page.
- The submission must be visibly flagged wherever the practitioner receives it.
- An internal escalation path and response time must exist and be documented.

The form as supplied says only `For immediate danger call 000`. Add Lifeline and Beyond Blue so it matches the compulsory site-wide line.

**BLOCKED:** escalation path and response time need her direction.

#### 4.7.3 Assessment of the other five forms

**FRM-002 Weight Management.** Asks about prescription weight-management treatment and includes a `Weight-loss medication` checkbox. Acceptable. These are clinical history questions in generic terms, no medicine or class is named, and nothing implies a product is offered. Build as supplied.

**FRM-003 Holistic Care.** Compliant as written. Names conditions only, no medicine anywhere. Build as supplied and add nothing to it. Its indication and contraindication set is recognisable to anyone familiar with the field, which is a further reason the Holistic Care page copy must stay inside the description agreed in Section 3.3.

**FRM-004 Mental Health**, **FRM-005 Men's Health**, **FRM-006 Women's Health.** Compliant as written apart from Section 4.7.2. Build as supplied.

Note for Section 3.1: FRM-007 lists the goal as `Body composition`, not weight management. That supports listing the sub-area as Metabolic Health.

#### 4.7.4 Privacy

These forms collect identity, address, emergency contact details and health information before any payment or booking. Before launch, confirm the privacy policy covers pre-booking collection, storage, retention and access, and place a privacy policy link on every quiz step.

### 4.8 Online prescriptions `/online-doctor/online-prescriptions`

**Instruction (her red reply):** add conditional pricing modelled on the InstantScripts flow she screenshotted, reworded not copied.

**Pricing ladder as she specified it:**

| Question | Answer | Price |
|---|---|---|
| How many medications are you requesting? | One | $19 |
| | Multiple | $49 |
| Would you like to request prescription repeats? | No | $19 |
| | Yes | $49 |
| Are you currently taking this medication? | Yes | $19 |
| | No | $49 |

**Disclaimer.** She supplied the InstantScripts wording as an example and asked for it to be changed slightly. Do not copy it. Suggested original wording, subject to her approval:

> Our practitioners work to the same clinical standards as your local GP. Prescriptions and repeats are not guaranteed and are issued only where clinically appropriate and safe for you. Consultation fees are non-refundable except where required by law.

**BLOCKED:** whether the $19 tier includes a real-time consultation. See Section 8, item 2. Build the pricing logic and the page copy, leave the routing configurable.

### 4.9 Medical certificates `/online-doctor/medical-certificates`

**Instruction (her direction, verbatim in effect):** keep the screening questions as they are. Single-day certificates issued on the questionnaire alone without a real-time consultation. Multi-day certificates require a consultation.

Build exactly that. The Medical Board guidance point was raised with her in writing on 9 September and she answered with this direction. Do not raise it again. Do file the exchange.

One consequence to handle in build: the homepage FAQ being restored (Section 4.1.10) states that prescriptions are not issued on a questionnaire alone. That statement is about prescriptions, not certificates, so the two can coexist. Do not extend that FAQ wording to certificates, and do not add any statement to the certificates page claiming a consultation is always required.

---

## 5. Pricing reconciliation

### 5.1 "Other services" table

Move this section **above** the three-box section. Give both sections the same design treatment so neither is visually prioritised. Retitle the section (suggested: `All services and fees`).

| Row | Staging now | Target | Action |
|---|---|---|---|
| General consult and referrals | from $49 | from $49 | No change |
| After-hours consult | from $69 | from $69 | No change |
| Priority consult (limited daily) | from $98 | from $98 | No change |
| Medical certificates | from $19.90 | from $19.90 | No change |
| Prescriptions and repeat scripts | from $49 | **from $19** | **CHANGE PRICE** |
| Pathology and imaging referrals | from $49 | from $49 | No change |
| Mental health support | from $59 | from $59 | No change |
| Men's and women's health | from $89 | from $89 | No change |
| Weight management | from $99 | from $99 | No change |
| Structured health programs | from $299 | **Health Optimisation & Complete Wellness, from $299** | **RENAME** |
| (not present) | absent | **Continuity & Preventative Health, from $69** | **ADD ROW** |
| (not present) | absent | **Holistic Care / Alternative Medicine, from $49** | **ADD ROW** |

Two rows are missing, not one. She named Continuity explicitly; Holistic Care is on her live site at $49 and is absent from staging. Both belong.

### 5.2 Three-box consultation fees

Retitle so it is clear these fees are for holistic care and alternative medicine.
**TARGET title:** `Our Fees: Holistic Care / Alternative Medicine`

| Box | Staging now | Target |
|---|---|---|
| First medical consultation | $59 | **$69** |
| Follow-up consultation | $59 | $59 |
| Transfer consultation | $54 | **$59** |

Apply identical figures on the homepage fees section (Section 4.1.5) and the `/discharge` page (Section 4.5). After the change, run a site-wide search for `$54` and `$59` and confirm every instance is intentional.

---

## 6. Navigation and footer

### 6.1 Header mega-menu, target structure

```
Services
├── Weight Management                    /weight-management
│   └── Medical Weight Loss Program      /weight-management/medical-weight-loss-program
├── Health Optimisation & Complete Wellness   /health-optimisation          [NEW]
├── Men's Health                         /mens-health
│   ├── Erectile Dysfunction             /mens-health/erectile-dysfunction
│   ├── Low Testosterone                 /mens-health/low-testosterone
│   ├── Premature Ejaculation            /mens-health/premature-ejaculation
│   └── Hair Loss                        /mens-health/hair-loss
├── Women's Health                       /womens-health
│   ├── Menopause & Perimenopause        /womens-health/menopause
│   ├── PCOS Management                  /womens-health/pcos-management
│   └── Contraception & Sexual Health    /womens-health/contraception
├── Mental Health Support                /online-doctor/mental-health
├── Online Doctor                        /online-doctor
│   ├── Online Prescriptions             /online-doctor/online-prescriptions
│   ├── Medical Certificates             /online-doctor/medical-certificates
│   ├── Pathology & Imaging Referrals    /online-doctor/pathology-imaging-referrals
│   └── Specialist Referrals             /online-doctor/specialist-referrals
├── Continuity & Preventative Health     /continuity-preventative-health   [NEW]
└── Holistic Care / Alternative Medicine /holistic-alternative-care        [NEW]
```

Mental Health Support is promoted out of the Online Doctor group to its own top-level entry, keeping its URL.

### 6.2 Footer

Her answer to question 3: main service areas only, plus the three additions.

**Services column, target:**
Weight Management · Health Optimisation & Complete Wellness · Men's Health · Women's Health · Mental Health Support · Online Doctor · Continuity & Preventative Health · Holistic Care / Alternative Medicine

Do not list child pages. **Currently missing from the footer:** the three new hubs.

**Patients column:** add the **Discharge Letter** link (Section 3.4) alongside the existing Transfer Your Care, Patient Portal, FAQs, Pre-Screening Quiz.

**Disclaimer text:** make bold.

---

## 7. Compliance gates

### 7.1 Peptides and the PeptiClinic reference

She sent pepticlinic.com.au on 9 September as a compliance model for "our peptides pages". Verified 10 September: that site's page title reads `Peptide Therapy Australia | Doctor-Led Telehealth | PeptiClinic` and its meta description reads `Australia's leading peptide clinic. Telehealth consults and prescription peptide therapy for recovery, skin, sleep & more.` Its visible page is euphemised as a wellness clinic while its metadata openly advertises prescription peptide therapy, which is exactly the hidden layer we removed from HHCPA.

Its "Choose your health goal" tiles are Muscle Building, Weight Management, Sexual Health, Sleep & Recovery, Injury & Recovery, Immunity Support and Anti-Ageing, which closely mirrors her seven Health Optimisation sub-areas.

**Build rule:** do not use that site as a content, structure or metadata model. Do not build any page named or framed around peptides. Health Optimisation is built around conditions, markers, assessment and review. This is raised with her in Section 8, item 1.

### 7.2 Prohibited terms register

No page, heading, URL, meta title, meta description, Open Graph tag, alt text, image filename, schema field or quiz question may contain: peptide or peptides, semaglutide, tirzepatide, or any GLP-1 reference, any medicine brand name, TRT or testosterone replacement therapy, medicinal cannabis, cannabis, THC, CBD, plant medicine, MHT or HRT, weight loss injections.

Run the scan across all layers, not just visible copy. The original build passed a visual check and failed on metadata and schema.

**This includes the quizzes.** Form questions, answer options, field labels, help text and declaration wording are public web content once the quiz is live. The Health Optimisation form as supplied fails this scan twice. See Section 4.7.1.

### 7.3 Questionnaire-only issuance

Two statements will coexist on the site after this build. The restored homepage FAQ says prescriptions are not issued on a questionnaire alone. The certificate flow issues single-day certificates on a questionnaire alone. These are compatible because they concern different things, but do not let the wording blur:

- Never state on any page that a consultation is always required before a certificate.
- Never state on any page that a prescription can be issued without a consultation.
- Keep the certificate and prescription flows visually and textually separate.

### 7.4 Standing rules

No outcome guarantees. No testimonials about clinical care. No before-and-after imagery. No page presented as a route to obtaining a specific prescription. No practitioner named or titled without their AHPRA number displayed. Ranjeeta's express written approval required before any regulated page publishes; no deemed approval.

---

## 8. Blocked items awaiting client answers

Do not build these. Build around them.

| # | Item | Blocks |
|---|---|---|
| 1 | Peptides approach and the PeptiClinic reference | Health Optimisation page brief |
| 2 | Does the $19 prescription tier include a real-time consultation? | Prescriptions quiz routing |
| 3 | Mental health counsellor: name, qualification, AHPRA registration status | Practitioners page, site-wide "AHPRA-registered" wording |
| 4 | Missing forms: HHCPA-FRM-001 (numbering gap), Continuity & Preventative Health, general and everyday GP care | Per-service quiz build |
| 4b | Confirm the reworded Health Optimisation question and declaration (Section 4.7.1) | Health Optimisation quiz |
| 4c | Crisis escalation path and response time for a Yes on the FRM-004 safety question | Mental Health quiz |
| 4d | Get Scripted access, to route completed forms into the patient profile | All six quizzes |
| 5 | Confirm sub-area rename to "Metabolic Health" | Health Optimisation page structure |
| 6 | Follow-up fee: $59 as instructed, or $49 as shown on her live site? | Homepage and pricing fee blocks |

The six assessment PDFs attached on 9 September have been received and are specified in Section 4.7. Five are ready to build. The Health Optimisation form needs the wording change in Section 4.7.1 before it can be published.

---

## 9. Pre-review QA checklist

Run all of it before anything goes to her.

**Architecture**
- [ ] Three new hubs live and reachable: `/health-optimisation`, `/continuity-preventative-health`, `/holistic-alternative-care`
- [ ] All eight services appear in header, footer, homepage grid, `/services` grid and pricing table
- [ ] Discharge Letter page live and linked in the footer Patients column
- [ ] Breadcrumbs correct on all new pages
- [ ] No page returns 404; no orphan pages

**Content**
- [ ] Zero instances of `Your health, handled from home` site-wide
- [ ] `Professional Healthcare, Wherever You Are` present on all 33 affected pages
- [ ] Emergency line on all 36 pages including `/quiz`, and not duplicated anywhere
- [ ] Zero instances of `West End` or `across the country`
- [ ] Our Story matches her original verbatim, including `Healthcare Practitioner Ranjeeta Roshan`
- [ ] No per-word wrapping remains on any intro paragraph
- [ ] `Easy Access, Professional Care` sits above the FAQ on the homepage

**Pricing**
- [ ] Fees read $69 / $59 / $59 on homepage, `/pricing` and `/discharge`
- [ ] Zero instances of `$54`
- [ ] Prescriptions row reads from $19
- [ ] Twelve rows in the Other services table
- [ ] `Structured health programs` no longer appears anywhere
- [ ] Other services sits above the three-box section, matching design weight

**Compliance**
- [ ] Prohibited terms scan clean across copy, titles, meta, Open Graph, URLs, alt text, image filenames and JSON-LD, on all pages
- [ ] Health Optimisation contains no weight-loss framing
- [ ] Holistic Care page contains no cannabis signal in any layer
- [ ] `Service` schema present on all eight hubs
- [ ] Every page still `noindex, nofollow` while on staging
- [ ] No quiz question, option, label or declaration contains a prohibited term
- [ ] The Health Optimisation quiz uses the reworded question and declaration, not the supplied wording
- [ ] A Yes on the mental health safety question surfaces 000, Lifeline and Beyond Blue immediately
- [ ] Electronic signature captured with a timestamp on every submission
- [ ] Privacy policy linked from every quiz step
- [ ] Zero instances of `two minutes` site-wide; each service shows its own stated time

**Technical**
- [ ] `sitemap.xml` populated. It currently returns a valid but empty urlset and will block indexing at go-live. Independent bug, fix it now.
- [ ] Trailing-slash redirects still resolve for new URLs
- [ ] No em dashes anywhere in the copy

---

## 10. Source copy appendix

Retrieved from horizonhealthcarepartners.com.au on 10 September 2026. Use verbatim.

### 10.1 Our Approach to Care / How We Support You

> **Our Approach to Care**
>
> **How We Support You**
> Access practitioner-led consultations from anywhere in Australia. Our AHPRA-registered practitioners provide confidential telehealth appointments, guiding you through every step with professional support and transparent processes.
>
> **Medical Guidance**
> Navigate your healthcare journey with confidence. Our AHPRA-registered medical practitioners provide ongoing support throughout your consultations, helping you understand your options and ensuring you receive the professional guidance you need at every stage of your care.
>
> **Judgement-Free Care**
> Your health concerns deserve a supportive, confidential environment. We create a safe space where you can openly discuss your healthcare needs with qualified medical professionals who listen without judgement and respect your individual circumstances throughout the process.
>
> **Clinical Standards**
> All consultations are conducted by AHPRA-registered medical practitioners who maintain rigorous clinical standards. Our practitioners bring extensive medical experience and stay current with healthcare guidelines to provide informed, professional consultations.
>
> **Informed Approach**
> Our consultation process follows established medical protocols and professional healthcare standards.

Slider categories: Professional Medical Consultations · Pain Management Support · Physical Wellbeing · Mental Wellbeing · Complex Health Concerns · General Health

### 10.2 Your Questions Answered, opening entries

> **How does Horizon Health Care Partners work?**
> You start with a free online pre-screening quiz. The quiz is not a diagnosis. If you look suitable, you book a real-time consultation with one of our practitioners by video or phone. The practitioner reviews your health and talks through your options with you. Any care plan comes from that consultation, not the quiz on its own.
>
> **Will I receive a prescription?**
> If clinically appropriate, your treating practitioner may issue a prescription following a comprehensive telehealth consultation. Every prescription is based on an individual clinical assessment, your medical history, current health needs, and the practitioner's professional judgement. Prescriptions are not issued solely on the basis of completing an online questionnaire or request form. Our practitioners are committed to providing safe, evidence-based care and will only prescribe medications when they believe it is clinically appropriate and in your best interests. If a prescription is not considered suitable, your practitioner will discuss alternative treatment options or recommend the most appropriate next steps.
>
> **How much does a consultation cost?**
> Consultation fees vary depending on the healthcare service, appointment type and consultation length. Any online pre-screening questionnaire is free, and there is no obligation to proceed. The full consultation fee will be displayed before you confirm and pay for your booking.

Pull the remaining entries from the live page in the same order.

### 10.3 About page, Our Story, verbatim

> Horizon Health Care Partners was founded by Healthcare Practitioner Ranjeeta Roshan on a simple but powerful belief: every Australian deserves access to compassionate, evidence-based healthcare, no matter where they live. She recognised a significant gap in our healthcare system. Patients with complex, chronic conditions often struggle to access good practitioners, particularly those in regional areas or with limited mobility. Many felt unheard, dismissed, or overwhelmed by a fragmented system.
>
> We established Horizon Health Care Partners to change that narrative. Through our secure telehealth platform, patients can now connect with qualified AHPRA-registered practitioners from the comfort of their own homes. Our mission is clear: provide accessible, professional medical consultations that empower patients to take control of their health journey with confidence and dignity.
>
> At Horizon Health Care Partners, we understand that seeking medical support can feel daunting. That's why we've built our practice on transparency, education, and compassion. Every consultation is conducted with care and respect, ensuring you feel heard, supported, and fully informed. Our experienced practitioners take time to understand your unique medical history, current symptoms, and personal goals.
>
> We work collaboratively with you to develop a personalised care plan that aligns with your needs. We believe in caring for the whole person, not just the condition. Whether you're exploring care options for the first time or seeking continuity of care, we're here to guide you every step of the way without judgment.

Continue from the live page for the final paragraph on clinical excellence.

### 10.4 Easy Access, Professional Care

> **Easy Access, Professional Care**
> Book online consultations with AHPRA-registered medical practitioners. Our streamlined telehealth process is simple and confidential.

---

## 11. Build order

1. Section 2 global changes, since they touch every page.
2. Section 6 navigation and footer, so the new URLs resolve.
3. Section 3 new hubs, minus blocked content.
4. Section 5 pricing.
5. Section 4 page-by-page content, homepage last because it depends on the most restored sections.
6. Section 9 QA.
7. Release to client for review. Regulated pages require her express written approval before publication.
