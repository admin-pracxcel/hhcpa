# HHCPA Build Spec v2.4: answers to round 3

**Date:** 10 September 2026
**Answers:** Q27 to Q46
**Read first:** Section D of the round 3 file lists 13 items as untouched. They are all answered in **HHCPA_Spec_v2.2_Answers.md**, which the build team has not received. Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10, Q12, Q13, Q14 and Q19 are closed in that document. Send it before reading further; this file does not repeat them.

**On the count dispute.** My crawls were of the deployed site at hhcpa.pracxcel.com. Theirs is a production build of current main, which the round 3 file notes is ahead of what is deployed. Both counts are right for their own source. Build against main and re-verify at the end. Any "CURRENT" string in v2.1 that does not match main should be treated as already fixed by those unreleased commits, not as a spec error, but flag it either way.

---

## Q28. Red outcome contact capture. Confirmed, and the fix is broader than red.

You are right, this is a regression I introduced. Moving the intake form to Step 6 fixed the privacy problem and created a contact problem.

Red-only capture would fix the promise, but it leaves a second hole: a green or amber patient who abandons partway through a 25-field form also disappears, and today's quiz captures those people. Fix both at once.

**Insert Step 5.5, after triage is computed, before branching, for every outcome.**

Fields: full name, email, phone, and a consent checkbox. Three fields and a tick, no address, no health information beyond what Step 4 already collected.

**Consent wording:**

> So we can follow up, please leave your details.
>
> ☐ I consent to Horizon Health Care Partners contacting me about this enquiry. We will use these details only for that purpose.

This means the triage submission fires at Step 5.5 for everyone, which is what makes Q36 work. See below.

---

## Q29. Peptide wording. Reversed. Build her wording at Step 6, post-booking.

**Your reasoning in (c) is better than mine and I accept it.** The screen-for versus prescribe distinction holds for the weight screening, where the clinic does not supply mirtazapine or lithium. It does not hold on the Health Optimisation flow, where the clinic is the provider. A patient reading that question on HHCPA's own health optimisation screen reasonably infers HHCPA provides it, and that inference is exactly what the guidance is aimed at. I over-extended the carve-out in v2.3 s5 and you caught it.

**Decision:**
- Step 4 public screening: neutral wording. `Have you previously used any prescribed treatment for health optimisation, recovery or healthy ageing?` Yes / No, plus free text.
- Step 6 intake, post-booking, not public: her wording verbatim, both the history question and the declaration.

**(a) Who gave the instruction.** It came from Pracxcel internally, in reply to a question list, not from Ranjeeta. It was not her direction and should not be recorded as such. That is precisely why it is being revisited now rather than defended.

**(b) Do not cut the exemption.** No exemption goes into the prohibited-terms guard. Cutting a deliberate hole for the one string that caused the original incident is the wrong trade, and with the Step 6 placement it is unnecessary.

**Consequence for v2.3.** Section 5's carve-out stands as written for medicines the clinic does not supply. Add the qualifier: it does not apply on a flow where the clinic is the provider of the named class. Write that into the v2.1 s7.2 register alongside the E1 note.

---

## Q30. Online Doctor and Continuity at Step 3.

Keep both in Step 3. Hiding two of eight services is worse than the alternative.

**Route:** Steps 0 to 2 (emergency, age, residency), then Step 5.5 contact capture, then straight to booking. No Step 4 screening and no Step 6 form.

**Rationale:** these are general and everyday care and chronic disease review. The consultation is the screening. Regulated services need eligibility gating; a GP appointment does not.

**Online Doctor needs a sub-selection at Step 3**, because its branches differ: prescriptions runs the Q8 pricing ladder as its Step 4, medical certificates runs her existing certificate questions, and pathology, imaging and specialist referrals go straight to booking.

**This closes Q19.** Those two service pages advertise no quiz duration and no pre-screening step. Their call to action is "Book a consultation", not "Take the quiz". Advertising a screening step with no questions behind it is worse than not mentioning one.

---

## Q31. FRM-004 safety yes. Red, not amber, and not a hard exit.

Your recommendation is right on red versus amber. One refinement: it should not become a hard exit either.

A hard exit turns away someone who has just disclosed. Red plus the Step 5.5 capture means they see crisis resources immediately, they are not blocked from continuing or leaving, they are not auto-booked, and a human contacts them. That is better than amber, which auto-books with nobody alerted, and better than the current hard exit, which leaves no follow-up.

**Behaviour on yes:** crisis resources render immediately and inline, before anything else. Outcome is red. No auto-book. Contact captured at Step 5.5. Submission carries a dedicated flag, not just the triage colour.

**This makes Q20 a launch blocker, not a pre-launch nicety.** A red self-harm outcome that promises a callback with nobody alerted is worse than the hard exit it replaces. Notification must exist before this ships.

---

## Q32. The 15% discount. Keep it, retie it, state the terms.

Build it. Tie eligibility to transferring care, not to holding a prescription from another prescriber.

**Page wording:**

> Receive 15% off your first consultation when you transfer your care to Horizon Health Care Partners.

**Terms and conditions, to display on the page:**

> Offer terms: 15% applies to the first consultation fee for new patients transferring their care from another provider. One use per patient. The discount applies to the consultation fee only and does not apply to medicines, pathology, imaging or any third-party cost. Not available in conjunction with any other offer. A consultation with an AHPRA-registered practitioner is required, and no treatment or prescription is guaranteed. Horizon Health Care Partners may vary or withdraw this offer at any time.

It is her offer and her margin, so the retie and the terms text go to her for approval. Build with this wording in the meantime.

---

## Q27. A note, not a router. (Answered in v2.2, restated.)

Capture it as context for the practitioner and leave the person in the flow they chose. Rerouting mid-form reads as an upsell and loses people. A soft cross-link on the confirmation screen is fine.

---

## Section F: build decisions

**Q33. Yes.** One engine at `/quiz` accepting a pre-selected service, so the eight service pages deep-link in and skip Step 3. One flow, eight doors. Not eight quiz URLs.

**Q34. Yes to both (b) and (c).** Lock triage-determining answers once triage is computed at Step 5, and stop exit screens from naming the disqualifying answer. This is the strongest compliance point raised in the whole round. A questionnaire that tells you which answer disqualified you, and lets you go back and change it, is a coaching mechanism, and AHPRA names that specifically. Add a third element: if someone restarts the flow in the same session after an exit, that restart is recorded in the payload so it is visible rather than silent.

**Q35. Yes.** Persist gates, service selection and Step 4 screening answers in sessionStorage. Never persist Step 6 intake fields or the signature. Clear on submit and on exit.

**Q36. Two submissions, not one.** Keep `clinical` segregation and add an `intake` key with the signature block inside it, as you propose. But split the submission:

- **Triage submission** fires at Step 5.5: gates, service, Step 4 answers under `clinical`, computed outcome, contact details under `contact`, plus any safety flag.
- **Intake submission** fires at Step 7: the FRM fields under `intake`, with signature, timestamp, form ID and version inside that key.

Link them with a submission ID. One webhook is fine; the stage is a field in the payload.

Single submission at the end would recreate the Q28 hole, because red exits and abandoned intakes would emit nothing.

**Q37. Yes.** Emit `{service, outcome}` and let n8n branch. Adding a ninth service should never need a site deploy.

**Q38. Option (d), ship without the upload.** Free-text "help me obtain one" field only, page and discount live, upload added when a destination exists.

**Explicitly rule out (a).** Base64 health records posted through a webhook that currently has no payload signing and whose fallback path logs is the worst of the four options. Discharge letters are health information.

If upload is wanted before Get Scripted, the answer is (b): object storage in an Australian region with signed uploads, type and size limits, and scanning. That is a real piece of infrastructure and should be scoped as its own item, not absorbed into this build.

**Q39. Yes.** Use the existing data-driven service template. Inheriting schema, breadcrumbs, gating and the compliance guards automatically is worth more than layout freedom on three pages.

**Q40. Yes.** Ungated on staging so she can review in place, gated at production until written sign-off. Staging is noindex either way.

**Q41. Yes, on-page anchors only.** Do not reserve child routes. Seven thin child pages would compete with the hub, and the URLs can be created later with the hub anchor redirecting if any sub-area earns its own page.

**Q42. Yes, breadcrumb follows the URL.** Home > Online Doctor > Mental Health Support. A BreadcrumbList that disagrees with the path is a structured-data warning for no benefit. Nav position and breadcrumb do not have to match.

**Q43(a). Prefer 4 + 4.** Eight divides evenly and a centred two-item final row reads as unintentional. If the breakpoint cannot carry four across, 3 + 3 + 2 is acceptable as a fallback.

**Q43(b). Use a clean 4 by 2 grid rather than stacking.** Your pairing works mechanically but puts Continuity under Men's Health and Holistic under Women's Health, which is arbitrary and will read as odd to anyone scanning it. Instead:

```
Row 1:  Weight Management        Men's Health      Women's Health    Online Doctor
        (1 child)                (4 children)      (3 children)      (4 children)

Row 2:  Health Optimisation &    Continuity &      Holistic Care /   Mental Health
        Complete Wellness        Preventative      Alternative       Support
                                 Health            Medicine
```

Row one holds everything with children, row two holds the four without. Balanced, no orphan headings, no arbitrary pairings.

**Q44. Yes, feature branch**, broken into reviewable commits, merged when Section 9 QA passes. The scope justifies it.

**Q45. Yes, incremental.** Section 2 global changes and Section 6 nav and footer go to staging first so she sees the shape early, hubs and quiz follow.

On who triggers the staging rebuild: that is a Pracxcel operational question, not a spec one, and it needs an owner today. If the three compliance commits on main are not live on hhcpa.pracxcel.com, then the site Ranjeeta reviewed and the site in the repo are different, which will cause confusion the moment she looks again.

**Q46. Yes, convert and record.** Em dash to comma in her verbatim copy, with each conversion logged, as already done once for the homepage intro. Keep a running list so the conversions can be shown to her if she ever asks why her punctuation changed.

---

## Summary of what is now open

Nothing in this file blocks the build. Four items remain genuinely outstanding, all with Ranjeeta or Pracxcel rather than the build team:

1. Crisis notification owner and channel (Q20), now a launch blocker because of Q31.
2. Privacy policy review against the new collection (Q18), before go-live.
3. Her approval of the reworded discount terms (Q32).
4. Who triggers the staging rebuild (Q45).
