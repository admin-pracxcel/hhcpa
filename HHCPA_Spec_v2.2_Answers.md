# HHCPA Build Spec: answers and corrections

**Version:** 2.2, answering the build team's questions of 10 September 2026
**Against:** HHCPA_Build_Spec_v2.1
**Method:** every correction below was re-verified against a live crawl of hhcpa.pracxcel.com before being accepted or rejected. Where the build team is right, it says so. Where they are not, it says that too.

---

## Part 1. Corrections to the spec

### A2. The "two minutes" count. Partially accepted.

Their crawl of the production build found 39 instances across 33 pages. My crawl of rendered HTML on 10 September found 42 across 35. Neither number changes the instruction, and the build team's count is authoritative for their codebase. **Use 39 across 33 and verify zero at the end.** The spec's figures are corrected.

### A3. The tagline exemption list. Accepted with one correction to their correction.

They are right that the homepage carries `Your health, handled from home`. My exemption list wrongly included `/`. Verified.

They are wrong that the total is 32. It is **33 pages**, which is what the spec already said. The three pages that do not carry it are `/patient-safety`, `/quiz` and `/weight-management`. 36 minus 3 is 33.

### A4. The emergency string. Accepted in full. My error.

Verified: the exact TARGET string appears on **zero** pages. What is deployed on 35 pages is a differently worded equivalent. The spec's claim that it was "already present on 35 of 36 pages" was wrong. See Q2 for what to do.

### A5. The pricing hero. Accepted, and now resolved.

Verified: `Pre-screening is free. No commitment until you're ready.` is not on staging. It is the **H1 on her live pricing page**, sitting under the eyebrow `Transparent, Straightforward Pricing`. The spec said "keep" when it should have said "restore". See Q4.

### A6. NEW. The site is 39 pages, not 36.

Three pages exist that nothing links to, so my crawl never reached them: `/thank-you`, `/quiz-book`, `/quiz-thank-you`. All three return 200 and render the layout disclaimer.

Every global change in Section 2 applies to them. Confirmed on all three: they carry the deployed emergency variant, none carries the tagline, none carries a "two minutes" claim. Correct every "36 pages" reference in the spec to 39, and re-run the Section 9 checklist against 39.

---

## Part 2. Answers, by number

### Section B: arising from the six forms

**Q21. The forms replace the per-service question sets. The triage engine stays as the wrapper.**

This is the most important answer in this document, so here is the full architecture:

```
emergency / crisis gate   (all services, before anything is collected)
        ↓
age gate                  (under 18 exits, as today)
        ↓
service selection         (expands from 4 to 8)
        ↓
FRM-00X as the question set for that service
        ↓
outcome computed from the FRM answers  → green / amber / red
        ↓
booking, or exit with the appropriate message
```

The triage engine is not removed and n8n keeps its input. What changes is where the answers come from: the migrated clinical branches are replaced by the forms she supplied, which is exactly what she asked for when she said the screening questions are currently the same for every service even where they do not suit.

The outcome mapping has to be defined per form. **The mechanism is ours to build, the clinical thresholds are hers to set.** Ship with a conservative default: any contraindication tick produces amber and a practitioner reviews before booking is confirmed; nothing auto-excludes except the age gate and the emergency gate. Then tighten once she signs off the thresholds. Going to her in the next email.

**Q22. Keep the age gate.** It runs before any data is collected. Its absence from her forms is an omission, not an instruction. Keeping an existing safety exclusion needs no approval; removing one would.

**Q23. Yes, the emergency gate runs before the form, for every service.** Two reasons. Someone in crisis should not have to complete seven minutes of intake before being told to call 000. And collecting full legal name, date of birth, residential address and emergency contact from someone in an emergency is a data minimisation failure on top of a safety one. Promote the existing holistic-branch question to a universal first step.

**Q24. Mandatory before submit:** full legal name, date of birth, phone, email, both declaration checkboxes, electronic signature.

**Move residential address and emergency contact to post-booking intake.** They are not needed to triage and not needed to book, they are the highest-sensitivity fields on the form, and deferring them materially reduces the exposure in Q18. Everything still reaches the patient profile, just one step later.

This restages her form, so it goes to her for confirmation. Build it this way in the meantime.

**Q25. Drop the BMI band messaging.** Keep collecting height and weight since FRM-002 asks for them, compute and store BMI for the practitioner, and display nothing interpretive to the patient. A message telling someone they might need medication before a practitioner has seen them pre-empts clinical judgement and sits close to advertising a treatment. Removing it needs no client approval. Keeping it would.

**Q26. Confirmed, capture all of it.** Store the form ID, the version string, the submission timestamp, the signature, and a snapshot of the rendered question set as presented. The last one matters because "Version 1.1" only identifies her PDF, not what our flow actually showed after the Q4.7.1 rewording.

**Q27. A note, not a router.** Capture it as context for the practitioner and leave the person in the flow they chose. Rerouting someone mid-form reads as an upsell and loses them. A soft cross-link on the confirmation screen is fine.

### Section C: the blocking questions

**Q12. Draft it.** Build team drafts, Pracxcel compliance-reviews, then it goes to Ranjeeta for written approval before publication.

Put the real drafted copy into the pages rather than delivering a separate document, so she reviews it in situ. All three hubs are regulated pages under clause 6.2(b) and there is no deemed approval, so none of them publishes until she has signed off in writing. Health Optimisation carries the most risk; apply the Section 3.1 content rules literally, particularly no indication menu and no named treatment.

**Q16. Replace, not additive.** The four-way selector becomes eight, and each service's question set becomes its FRM where one exists. Two quizzes covering the same services was never the intent; Section 4.7's phrase "new data-collection capability" meant the fields and the signature are new to the site, not that a second quiz should exist. That wording is corrected.

This closes **Q1**: FRM-003 replaces the `hl_*` branch, so the SAS-B eligibility screen is gone from public view. That was the remaining gap between Section 3.3's intent and what was actually deployed.

**Q17. n8n is not the record of truth.**

Three things, in order:

First, **fix `QUIZ_WEBHOOK_SECRET` now.** Unsigned payloads are a defect independent of this work and should not wait on any of these answers.

Second, do not launch signature capture without a defined store. A signed declaration is a record you may need to produce years later, and `persistFallback()` logging is not that.

Third, the destination is her decision, since she is the data controller. Two viable options: delay signature capture until Get Scripted is live and write to it directly, or stand up an interim encrypted store hosted in Australia with a defined retention period. Going to her in the next email.

The tension the build team identified is real and the resolution is sequencing: build the capture, do not enable it in production until the destination exists.

**Q18. Pracxcel drafts the policy, the practice approves and owns it.**

The build team is right that it cannot write the policy that makes the collection lawful. Nor should it. Ranjeeta is the healthcare provider and the data controller.

Positions to take to her: storage in Australia, not offshore. Retention is a clinical-records question and she should take her own advice rather than accept a number from us. Collection reduced per Q24. Privacy policy link on every quiz step, which the build team can add now.

**Q9. Authorised.** Crawl and download the hero images and the "How we support you" slider assets from horizonhealthcarepartners.com.au. They are her images on her site and she instructed their reuse.

Two constraints. No before-and-after imagery is to be carried across in any form. And do not bring over any practitioner headshot, because the onboarding sheet records that the current site uses generic stock only and that real headshots are still pending; a practitioner image cannot publish without a name and an AHPRA number attached.

**Q10. Resolved. No retrieval needed.** The complete text is in Part 3 below.

**Q11. Genuinely undefined, and that is on the client.** She asked for the page in a single line and gave nothing else. Build the shell and the footer link; the content is blocked.

Provisional shape to put to her so she has something to react to rather than a blank question: what a discharge letter is, when one is issued, how to request it, expected turnaround, whether a fee applies, and a request form. Schema can mirror the other new pages once the content type is known. Going to her in the next email.

### Section D: pricing contradictions

**Q5. $89 is correct for both.** The `From $59` figures in Section 4.1.4 were the current staging values carried forward in error. Her live site prices men's and women's health at $89. Corrected.

**Q6. Correct catch, and the fix is a single source.** Service cards render each service's own floor price from the fee table, not the first-consultation fee. The mapping, which matches her live site exactly:

| Service | Card price |
|---|---|
| Weight Management | From $99 |
| Health Optimisation & Complete Wellness | Programs from $299 |
| Men's Health | From $89 |
| Women's Health | From $89 |
| Mental Health Support | From $59 |
| Online Doctor | From $49 |
| Continuity & Preventative Health | From $69 |
| Holistic Care / Alternative Medicine | From $49 |

Drive these from the same data as the Other services table so they cannot drift again.

**Q7. Option (a). The fees genuinely apply to holistic care only, and the title stays.**

This is her explicit instruction, ticked, and it matches her live site, which carries the identical heading `Our Fees: Holistic Care / Alternative Medicine` above the same three boxes. Overriding a client's own established pattern on her own site is not our call.

The prominence concern is answered by Q6: the eight per-service floor prices now sit on the service cards above this block, so the page does not price one service and ignore seven. And nothing on the page connects holistic care to cannabis, so there is no compliance breach here, only a design opinion. Do not re-ask her.

**Q8. Any $49 trigger makes the whole thing $49.** $19 applies only when all three answers are the low-cost ones: one medication, no repeats requested, currently taking it. It is the only reading consistent with the source flow she screenshotted.

It is money, so it goes to her as a one-line confirmation rather than being assumed silently.

Placement: it becomes the prescriptions branch of the unified quiz, entered from the prescriptions page call to action, and it inherits the same emergency and age gates as every other branch. It is not a separate mini-flow.

### Section E: where CURRENT did not match the build

**Q2. Roll out her exact wording to all 39 pages.** She wrote "Every page needs the following: Compulsory" and supplied the exact text. Hers is more direct and includes the 24/7 detail. Replace the deployed variant everywhere rather than keeping two near-identical strings, and add it to `/quiz`.

**Q3. Do not add the tagline to pages that never had it.** Replace it on the 33 pages that carry it. `Ready to see whether this suits you?` and `Questions about whether telehealth suits you?` are more specific and better copy than a generic line, and her instruction was to replace a phrase she disliked, not to impose a new one site-wide. The Section 9 check should read "zero instances of the old tagline", not "the new tagline on every page".

**Q4. Restore her live pricing hero.** Eyebrow `Transparent, Straightforward Pricing`, H1 `Pre-screening is free. No commitment until you're ready.` Staging's `Transparent pricing, no surprises` is a rewrite of her line, and her annotation "keep this hero page with its wording" refers to hers.

### Section F: smaller points

**Q13. Agreed, it is not a bug. Leave the gate as designed.** The spec is wrong to call it one. Remove it from the technical checklist and put it in a go-live checklist instead: setting `SITE_INDEXABLE=true` is a launch step, and the check is that the sitemap populates with every URL at that point. Do not decouple the two. A new environment being safe by omission is the correct default and was deliberate.

**Q14. Confirmed.** Public rendered copy only. Code comments, commit messages and internal documentation are out of scope. Clear the 8 found in rendered copy, including on the three unlinked pages.

**Q19. Show no quiz time and no quiz call to action on those two pages** until a form exists for them. Route to booking or contact instead. Advertising a pre-screening step that has no questions behind it is worse than not mentioning it. Revisit when FRM-001 and a Continuity form arrive.

**Q20. A triage colour is not sufficient.** Minimum mechanism: a dedicated boolean field distinct from the triage outcome, an immediate notification to a monitored channel with a named recipient, and visible prominence wherever the practitioner opens the submission. A colour code that someone has to notice is not a safety mechanism. The escalation path and response time remain hers to set.

---

## Part 3. Completed appendix

### 10.2 Your Questions Answered, complete, verbatim from the live homepage

> **How does Horizon Health Care Partners work?**
> You start with a free online pre-screening quiz. The quiz is not a diagnosis. If you look suitable, you book a real-time consultation with one of our practitioners by video or phone. The practitioner reviews your health and talks through your options with you. Any care plan comes from that consultation, not the quiz on its own.
>
> **Will I receive a prescription?**
> If clinically appropriate, your treating practitioner may issue a prescription following a comprehensive telehealth consultation. Every prescription is based on an individual clinical assessment, your medical history, current health needs, and the practitioner's professional judgement. Prescriptions are not issued solely on the basis of completing an online questionnaire or request form. Our practitioners are committed to providing safe, evidence-based care and will only prescribe medications when they believe it is clinically appropriate and in your best interests. If a prescription is not considered suitable, your practitioner will discuss alternative treatment options or recommend the most appropriate next steps.
>
> **How much does a consultation cost?**
> Consultation fees vary depending on the healthcare service, appointment type and consultation length. Any online pre-screening questionnaire is free, and there is no obligation to proceed. The full consultation fee will be displayed before you confirm and pay for your booking. Any additional costs, such as follow-up consultations, pathology tests, medications or external services, will be discussed with you where applicable.
>
> **What can I speak to a practitioner about?**
> Our practitioners consult on a range of everyday health concerns. These include weight management, mental health support, menopause support, smoking cessation, and ongoing support for chronic conditions. Each consultation is tailored to you. Individual results vary, and assessment findings do not guarantee a particular outcome.
>
> **Is telehealth right for me, and what if it is an emergency?**
> Telehealth suits many common health needs, but not all of them. Your practitioner may recommend an in-person assessment, a GP review, a specialist referral, further tests, or no treatment, depending on your circumstances. If this is a medical emergency, call 000 immediately. If you are in crisis, call Lifeline on 13 11 14 or Beyond Blue on 1300 22 4636.

Closing link: `Still have questions?` / `Explore All FAQs`

Note: the fourth answer lists the services she names publicly. Once the eight-service structure is live, that list should be updated to match, and that update is a copy change requiring her approval since it is her wording.

### 10.3 Our Story, complete, verbatim from the live About page

> Horizon Health Care Partners was founded by Healthcare Practitioner Ranjeeta Roshan on a simple but powerful belief: every Australian deserves access to compassionate, evidence-based healthcare, no matter where they live. She recognised a significant gap in our healthcare system. Patients with complex, chronic conditions often struggle to access good practitioners, particularly those in regional areas or with limited mobility. Many felt unheard, dismissed, or overwhelmed by a fragmented system.
>
> We established Horizon Health Care Partners to change that narrative. Through our secure telehealth platform, patients can now connect with qualified AHPRA-registered practitioners from the comfort of their own homes. Our mission is clear: provide accessible, professional medical consultations that empower patients to take control of their health journey with confidence and dignity.
>
> At Horizon Health Care Partners, we understand that seeking medical support can feel daunting. That's why we've built our practice on transparency, education, and compassion. Every consultation is conducted with care and respect, ensuring you feel heard, supported, and fully informed. Our experienced practitioners take time to understand your unique medical history, current symptoms, and personal goals.
>
> We work collaboratively with you to develop a personalised care plan that aligns with your needs. We believe in caring for the whole person, not just the condition. Whether you're exploring care options for the first time or seeking continuity of care, we're here to guide you every step of the way without judgment.
>
> What sets us apart is our unwavering commitment to clinical excellence and patient-centred care. We operate with full compliance to Australian medical regulations, ensuring every consultation and recommendation meets the highest standards of safety and professionalism. Our telehealth platform makes accessing quality healthcare simple and convenient, with flexible appointment times including after-hours and same-day consultations.
>
> We serve patients across Australia, from metropolitan cities to remote regional communities, because geography should never be a barrier to expert medical care. At Horizon Health Care Partners, you're not just a patient number. You're a valued individual deserving of respect, compassion, and the very best healthcare Australia has to offer.

### 10.5 Pricing hero, from the live pricing page

> Eyebrow: `Transparent, Straightforward Pricing`
> H1: `Pre-screening is free. No commitment until you're ready.`

---

## Part 4. New client questions arising

Six additions to the list going to Ranjeeta, on top of the six already drafted and the two flagged earlier:

1. Clinical thresholds for amber and red outcomes, per form (Q21).
2. Confirmation that residential address and emergency contact can move to post-booking (Q24).
3. Where signed declarations are stored, and whether to delay signature capture until Get Scripted is live (Q17).
4. Privacy policy: she approves and owns it, storage in Australia, retention period on her own advice (Q18).
5. Discharge Letter page: what it is and whether a fee applies (Q11).
6. Prescription pricing rule: any $49 trigger makes the whole request $49 (Q8).

**A fee discrepancy worth putting to her with evidence.** Her live site prices the same three-box block three different ways: the homepage shows first consultation $69 and follow-up $49, the About page shows $59 and $49, and the pricing page shows $59 and $59 with a $54 transfer. Her instruction to us says $69, $59 and $59. That is four different combinations across her own site and her email. She should confirm the correct set once, in writing, and we align everything to it.

---

## Part 5. What is now unblocked

Everything the build team listed as startable, plus:

- The full quiz architecture in Q21, including all six forms, the gates and the outcome wrapper. Only the clinical thresholds and the storage destination remain open, and neither blocks building the flow.
- The three hub pages, with copy drafted for her approval (Q12).
- Live-site image retrieval (Q9).
- Both appendix gaps, closed in Part 3.
- All pricing on the service cards and the fee table (Q5, Q6, Q7).
- Every Section E discrepancy.

Still genuinely blocked: signature capture going live, the privacy policy, the Discharge Letter content, the crisis escalation path, and the peptide rewording confirmation.
