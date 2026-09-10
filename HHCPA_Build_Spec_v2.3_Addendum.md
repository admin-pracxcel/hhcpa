# HHCPA Build Spec addendum v2.3

**Date:** 10 September 2026
**Supersedes:** the open items in v2.2 Part 4 that have now been answered
**Source of new material:** Ranjeeta's email of 1 September 2026, which contains the triage logic, the eligibility gates and the BMI banding that v2.2 listed as blocked.

---

## 1. Quiz architecture, now fully specified

Her 1 September email supplies everything that was missing. The architecture in v2.2 Q21 holds and is now buildable end to end.

```
Step 0   Emergency / crisis gate          (all services, before any data)
Step 1   Age gate: "Are you 18 years or older?"        No  -> exit
Step 2   Residency gate: "Are you currently located in Australia?"   No  -> exit
Step 3   Service selection                (8 services)
Step 4   Eligibility screening            (her 1 Sept question sets)
Step 5   Triage outcome computed          green / amber / red
Step 6   Intake form HHCPA-FRM-00X        (collected on green and amber only)
Step 7   Booking, or red exit message
```

Steps 1 and 2 are her own questions, taken verbatim from the Health Optimisation Screening. Apply them to every service, not just Health Optimisation. That closes v2.2 Q22 and Q23 with her own wording rather than our assumption.

Placing the intake form at Step 6 rather than Step 4 matters: a red outcome should never have collected a residential address and an emergency contact first. This also resolves the field-staging concern in v2.2 Q24 without needing to restage her form, because the form only ever runs after someone has cleared triage.

### 1.1 Which document governs where the two overlap

She has sent two Health Optimisation instruments. They are complementary, not competing:

| Purpose | Source | Runs at |
|---|---|---|
| Eligibility and triage | Health Optimisation Screening, 1 Sept email | Step 4 |
| Clinical intake | HHCPA-FRM-007, Version 1.1 | Step 6 |

Same pattern for Weight Management: the 14-question pre-screening from the 1 Sept email is Step 4, HHCPA-FRM-002 is Step 6.

For the four services with no screening set supplied (Men's Health, Women's Health, Mental Health, Holistic Care), the FRM's own contraindication tick-lists drive the triage outcome. Their thresholds still need her sign-off; use the conservative default until then, which is that any contraindication tick produces amber and nothing auto-excludes except Steps 0 to 2.

---

## 2. Health Optimisation triage rules, verbatim from her 1 September email

**Step 1, primary goal.** Single select, seven options, her wording exactly: Weight Management & Metabolic Health, Healthy Ageing & Longevity, Recovery & Physical Wellbeing, Mental Clarity & Focus, Energy Vitality & Wellness, Sexual Health & Wellbeing, General Wellness Optimisation.

Note this is the screening question, not a public page heading. The rename to Metabolic Health discussed in v2.2 applies to the **website navigation and page sections**. Leave the screening option as she wrote it unless she says otherwise, since it is not public marketing copy.

**Step 4, safety questions.** Pregnant, planning pregnancy or breastfeeding. Ever diagnosed with cancer. Liver, kidney or heart condition. Currently taking prescription medications, with a list field. Allergies to injectable medications.

**Automatic triage, her definitions:**

| Outcome | Conditions | Action |
|---|---|---|
| **Green** | Age 18 or over, Australian resident, no pregnancy, no active cancer, no significant contraindications | Book initial consultation |
| **Amber** | Under specialist care, complex medications, controlled chronic disease | Book consultation, practitioner reviews |
| **Red** | Pregnant or breastfeeding, active cancer treatment, serious uncontrolled cardiac disease | Do not auto-book |

**Red exit message, her wording exactly:**

> Based on your responses, your situation requires further review before booking. A member of our team will contact you.

Two build notes. "No significant contraindications" and "complex medications" are not machine-evaluable as written, so map them explicitly: a free-text medication list or a specialist-care yes should route to amber, and anything not matching a red rule and not flagged amber falls to green. And a red outcome creates a follow-up obligation, since the message promises contact. Confirm who owns that queue before launch.

**Step 5 consent, her wording exactly:**

> Health Optimisation programs may include prescription-only treatments where clinically appropriate. All patients require assessment by a registered healthcare practitioner. Additional pathology testing may be required before treatment recommendations can be made.

> - I understand that completing this form does not guarantee treatment eligibility.
> - I understand that treatment decisions can only be made following consultation with a qualified practitioner.
> - I consent to HHCPA collecting my health information for assessment purposes.

This consent block is compliant as written. It refers to prescription-only treatments as a category and names nothing. Use it.

---

## 3. Weight Management BMI rules

Her 1 September email contains **two different BMI banding schemes**. Both are hers. Build the second one.

**Do not build this one**, from the Question 4 result text:

> If ≥27 kg/m2 => your BMI result suggests that you are overweight and you might need medication as part of your overall weight loss treatment.

An automated message telling someone they might need medication, before a practitioner has seen them, is the exact pattern flagged in the earlier compliance pass. It also pre-empts clinical judgement.

**Build this one**, from her "For Weight Management" section:

| BMI | Outcome |
|---|---|
| Below 25 | Show: `Your BMI is within the healthy range. Weight management treatments may not be appropriate, however a practitioner can discuss your health goals and determine suitable options.` |
| 25 to 29.9 | Eligible for practitioner review |
| 30 or over | Eligible for practitioner review |

This is not us overriding her. She wrote both versions in the same email and the second is the later, cleaner one. It says nothing about medication and still routes everyone to a practitioner.

Formula as she specified: BMI = weight (kg) / height (m)². Compute and store it for the practitioner. Display only the band outcome above, never an interpretive claim.

Her note that the threshold is 30, or 27.5 for Asian and Australian Indigenous populations, is clinically correct and is why the ethnicity question exists. See section 6.

---

## 4. Weight Loss pre-screening, Step 4 question set

Fourteen questions supplied in her 1 September email. Build as written, with three notes.

Questions: date of birth, sex at birth, current weight, height, waist circumference, ethnic background, recent abnormal blood results, family weight history, childhood weight difficulty, recent life events, ongoing health conditions, current medications, weight-loss methods tried, weight-loss medications tried.

**Inline routing she specified.** "Currently pregnant" shows: `We advise you to consult your GP and follow the recommendations.` "Diabetes or pre-diabetes" shows her note about discussing with the physician managing their diabetes care. Keep both.

**Her "why we ask" explanations** for sex at birth, ethnic background and health conditions should be rendered as expandable helper text. They are good practice and they justify collecting sensitive fields.

**Completion message, her wording:** `Well done! Our Weight Loss Program might work for you! Based on your answers we can create a treatment program that suits you the most.`

Two changes needed here. The service is now called Weight Management, not Weight Loss, so align the name. And "might work for you" plus "we can create a treatment program" reads as a pre-clinical assurance; soften to reflect that suitability is decided in the consultation. Small change, worth making.

---

## 5. Medicine names in the screening: the distinction that matters

Question 12 of the weight pre-screening names specific medicines: corticosteroids, anti-psychotics, mirtazapine, lithium, valproate, carbamazepine, gabapentin, certain diabetes medications.

**This is fine and should be built as written.** These are medicines the patient may already take, screened for interaction and for their known effect on weight. Nothing here promotes a medicine the clinic supplies.

The distinction to hold on to, because the two look superficially similar:

- Naming a medicine you might **prescribe** is advertising a prescription-only medicine. Not permitted.
- Naming a medicine you **screen for** is clinical intake. Permitted.

Apply that test to any future question rather than a blanket ban on medicine names.

---

## 6. Sensitive fields

The weight pre-screening collects **ethnic background**, and the intake forms collect date of birth, residential address and emergency contact. Ethnicity is sensitive information under the Privacy Act and needs a higher standard than ordinary personal information.

It has a genuine clinical justification here, since Australian guidance uses a lower BMI threshold for Asian and Aboriginal and Torres Strait Islander populations, and her form already explains that to the patient. Keep the explanation visible, keep the field optional if possible, and make sure the privacy policy names ethnicity specifically. See section 9.

---

## 7. Health Optimisation: the peptide wording decision

You have instructed that her exact wording be used. Recording the position clearly, then the build instruction.

**What her wording puts on a public page.** FRM-007 asks `Have you previously used peptide therapy or other health optimisation treatment?` and its declaration states `I understand that health optimisation or peptide treatment is not guaranteed.` The 1 September screening asks `Have you previously used peptide therapy or prescription weight management medications?`

The history questions are defensible on the section 5 test: they ask what the patient has taken, not what we supply. The **declaration is different**, because it states that the clinic may provide peptide treatment. That is presenting the service as a means of obtaining a prescription-only medicine, which is the specific thing the TGA guidance names, and it is the layer that caused the original problem.

**The option that gives her exact wording without the exposure.** Run Step 4 screening publicly with the history question as she wrote it, and place FRM-007 at Step 6, after booking, where it is not public. Her wording is preserved verbatim in both, and the declaration stops being an advertisement because it is no longer publicly accessible. This costs nothing and needs no change to her documents.

**Note also** that her Step 5 consent block, quoted in section 2, already does the declaration's job compliantly. If FRM-007's declaration is dropped in favour of it, nothing is lost clinically.

**If you proceed with the declaration on a public page anyway**, treat it exactly as you treated the medical certificates decision: build it as instructed, and make sure her written instruction to do so is on the record. Do not let it rest on an inference from "use her exact wordings" in an internal thread.

**One thing that must not reach the site in any form.** Her 1 September email contains service description text beginning `Peptides may assist in accelerated healing and recovery, weight loss and muscle development, skin health and anti-aging support`, and further claims about growth hormone-releasing peptides, cognitive performance and libido. That was written to brief us, not to publish. It is unambiguous prohibited advertising and it must not appear on any page, in any metadata, or in any ad. Flag it to whoever drafts the Health Optimisation copy.

---

## 8. Discharge Letter page

Her live page at `/discharge/` is titled `Discharge Letter | Switch to Horizon Health Care Partners`. Staging already has `/discharge` as `Transfer Your Care`. **These are the same page, not two pages.** v2.2 Q11 assumed a new page; that assumption was wrong.

What her live version has that staging does not:

- A **Discharge Letter Form**: first name, last name, mobile, email, previous clinic name, previous doctor's name, file upload for the discharge letter, and a free-text field for people who need help obtaining one.
- A **15% discount** on the initial consultation: `Receive 15% off your Initial Consultation with a valid discharge letter from your current prescribing doctor or clinic.`
- Four "why patients choose us" points.

**Build:** add the Discharge Letter Form and the four points to the existing `/discharge` page, and label the footer link under Patients as `Discharge Letter`. Do not create a second page.

**The discount needs a decision.** Under the National Law a discount may be advertised provided its terms and conditions are stated, so 15% off is not automatically a problem. What needs care is that eligibility is tied to holding a current prescription from another prescriber, on the page that is the transfer path for the holistic and alternative medicine service. That edges from "discount for transferring care" toward an inducement connected to a prescription-only medicine.

Two straightforward fixes: state the terms and conditions of the offer plainly on the page, and tie eligibility to transferring care rather than to holding a prescription. If the offer is dropped instead, the page still works.

File upload also brings its own requirements: virus scanning, size and type limits, encrypted storage, and coverage in the privacy policy, since a discharge letter is health information.

---

## 9. Residual gaps

Four items remain, none of which blocks the build continuing.

**Crisis notification.** The crisis support content is in place, which covers display. The half that is still missing is what happens when someone answers yes to the FRM-004 safety question: nobody is alerted, and the disclosure sits in a queue. Display tells the person where to get help; it does not tell you that someone disclosed. Before launch, decide who is notified and through what channel.

**Signed declarations.** Launching after Get Scripted removes the interim storage problem only if Get Scripted can actually store the declaration with its form ID, version and timestamp. Put that on the agenda for the integration call rather than assuming it. Separately, `QUIZ_WEBHOOK_SECRET` being unset is a defect in its own right and should be fixed now, independent of any of this.

**Privacy policy.** The copied policy was written for a site that collects clinical answers only. The new flow adds date of birth, residential address, emergency contact, ethnicity, a file upload of health records, and a signed declaration, some of it before payment. Review the copied policy against that list before go-live. Build can proceed.

**Red-outcome follow-up.** Her red message promises that a member of the team will contact the person. Someone has to own that queue.

---

## 10. Fee evidence, for the record

You asked where the discrepancy came from. Verified on her live site on 10 September:

| Source | First | Follow-up | Transfer |
|---|---|---|---|
| Live homepage fees block | $69 | $49 | $59 |
| Live About page fees block | $59 | $49 | $59 |
| Live pricing page | $59 | $59 | $54 |
| Her instruction, 9 Sept email | $69 | $59 | $59 |

Four combinations across three pages of her own site plus her email. **Confirmed position: $69, $59, $59.** Build that everywhere and ignore the live site figures. Her live site will contradict the new one until it is replaced, which does not matter because the two are never live together.
