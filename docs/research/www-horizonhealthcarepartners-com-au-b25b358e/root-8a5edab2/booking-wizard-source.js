
        // --- REDIRECT URLS ---
        const BOOKING_REDIRECT_URL = "https://www.horizonhealthcarepartners.com.au/book-consultation/";
        const CERT_REDIRECT_URL = "https://www.horizonhealthcarepartners.com.au/medical-certificate/";

        // --- SUB-MENU CONFIGURATION ---
        const hhpSubMenus = {
            "general":             { title: "General & Referrals",        type: "timing", price: "From $49", caveat: "Prescriptions are at the treating practitioner's discretion after a real-time consultation only." },
            "after-hours":         { title: "After-Hours Consult",         type: "timing", price: "From $69" },
            "priority":            { title: "Priority Consult",            type: "timing", price: "From $98" },
            "prescriptions":       { title: "Prescriptions",               type: "timing", price: "From $49", introEyebrow: "Online Prescription Consultation", introHeading: "Request a Prescription with an Australian Healthcare Practitioner", introText: "Whether you need a repeat prescription or would like to discuss a new medication, our experienced practitioners can assess your request during a secure telehealth consultation.", caveat: "Please note: A consultation does not guarantee that a prescription will be issued. All prescribing decisions are made solely at the discretion of your treating practitioner." },
            "pathology-radiology": { title: "Pathology & Imaging",         type: "timing", price: "From $49" },

            "certificates": {
                title: "Medical Certificates",
                type: "certificates",
                price: "From $19.90"
            },

            "mental-health": {
                title: "Mental Health",
                type: "options",
                price: "From $59",
                categoryNote: "If you are in crisis, call Lifeline 13 11 14 (24/7) or Beyond Blue 1300 22 4636. In an emergency, call 000.",
                items: [
                    {
                        id: "mh-care",
                        title: "Ongoing Mental Health Support",
                        what: "Personalised support for mental wellbeing and ongoing care.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "mh-adhd",
                        title: "ADHD Support",
                        what: "Assessment guidance and ongoing management support for ADHD.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "mh-anxiety",
                        title: "Anxiety & PTSD",
                        what: "Support and management options for anxiety and PTSD.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "mh-smoking",
                        title: "Smoking Cessation",
                        what: "Support plan and prescription options to quit smoking.",
                        note: "AHPRA-registered practitioner consultation",
                        caveat: "Prescription medicines for smoking cessation are at the practitioner's discretion and suitability will be assessed during your consultation."
                    },
                    {
                        id: "mh-sleep",
                        title: "Sleep Concerns",
                        what: "Assessment and support for sleep-related concerns.",
                        note: "AHPRA-registered practitioner consultation"
                    }
                ]
            },

            "mens-womens-health": {
                title: "Men's & Women's Health",
                type: "options",
                price: "From $89",
                items: [
                    {
                        id: "mwh-hormonal",
                        title: "Hormonal Support",
                        what: "Assessment and management of hormonal health concerns.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "mwh-menopause",
                        title: "Menopause Support",
                        what: "Comprehensive menopause support plan and treatment options.",
                        note: "AHPRA-registered practitioner consultation",
                        caveat: "Our practitioners can discuss all aspects of menopause management including lifestyle, non-hormonal options, and hormonal therapies where clinically appropriate. Some situations may require referral to a specialist. Prescriptions are at the treating practitioner's discretion; recent pathology may be required."
                    },
                    {
                        id: "mwh-sexual",
                        title: "Sexual Health",
                        what: "Confidential sexual health assessment and support.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "mwh-fertility",
                        title: "Fertility Support",
                        what: "Fertility assessment guidance and referral support.",
                        note: "AHPRA-registered practitioner consultation"
                    }
                ]
            },

            "continuity-preventative": {
                title: "Continuity & Preventative Health",
                type: "options",
                price: "From $69",
                items: [
                    {
                        id: "cp-chronic",
                        title: "Chronic Disease Management",
                        what: "Ongoing management and monitoring of chronic health conditions.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "cp-preventative",
                        title: "Preventative Health Programs",
                        what: "Proactive health screening and preventative care programs.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "cp-care-plan",
                        title: "Structured Care Plans",
                        what: "Comprehensive structured care planning for long-term health needs.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "cp-monitoring",
                        title: "Ongoing Monitoring",
                        what: "Regular health monitoring and check-ins to track progress and outcomes.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "cp-lifestyle",
                        title: "Lifestyle & Risk Assessment",
                        what: "Assessment of lifestyle factors and health risks with personalised recommendations.",
                        note: "AHPRA-registered practitioner consultation"
                    }
                ]
            },

            "weight-management": {
                title: "Weight Management",
                type: "options",
                price: "From $99",
                categoryNote: "Weight management medications may be discussed where clinically appropriate. No prescription is guaranteed. Ongoing follow-up appointments are required. Compounded GLP-1 medications are not available. All medicines are TGA-approved.",
                items: [
                    {
                        id: "wm-initial",
                        title: "Initial Consultation",
                        what: "Comprehensive assessment and personalised weight management plan.",
                        note: "BMI pre-screening required"
                    },
                    {
                        id: "wm-followup",
                        title: "Follow-up Consultation",
                        what: "Review progress and adjust your weight management program.",
                        note: "For existing patients"
                    },
                    {
                        id: "wm-program",
                        title: "Ongoing Program",
                        what: "Structured ongoing support for sustained weight management.",
                        note: "Regular check-ins included"
                    }
                ]
            },

            "holistic": {
                title: "Holistic Care / Alternative Medicine",
                type: "options",
                price: "From $49",
                items: [
                    {
                        id: "holistic-initial",
                        title: "Initial Consultation",
                        what: "First appointment to assess your needs and develop a personalised care plan.",
                        note: "Full screening required"
                    },
                    {
                        id: "holistic-followup",
                        title: "Follow-up Consultation",
                        what: "Review progress and adjust your treatment plan as needed.",
                        note: "For existing patients"
                    },
                    {
                        id: "holistic-transfer",
                        title: "Transfer of Care",
                        what: "Transferring your care from another provider with full clinical handover.",
                        note: "Previous records required"
                    }
                ]
            },

            "metabolic-wellness": {
                title: "Health Optimisation and Wellness",
                type: "options",
                price: "Programs from $299",
                items: [
                    {
                        id: "met-longevity",
                        title: "Longevity / Complete Wellness",
                        what: "Comprehensive longevity-focused program for optimal long-term health and vitality.",
                        note: "Full health screening included"
                    },
                    {
                        id: "met-ageing",
                        title: "Healthy Ageing",
                        what: "Proactive strategies to support healthy ageing and sustained quality of life.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "met-performance",
                        title: "Performance & Recovery",
                        what: "Support physical recovery, wellbeing and active lifestyle goals through tailored programs.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "met-injury",
                        title: "Injury Recovery",
                        what: "Structured support for injury rehabilitation and return to full function.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "met-mental",
                        title: "Mental Clarity & Focus",
                        what: "Support mental clarity, focus and overall wellbeing through personalised care.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "met-vitality",
                        title: "Vitality & Immunity",
                        what: "Support vitality, wellness and healthy lifestyle goals through personalised care.",
                        note: "AHPRA-registered practitioner consultation"
                    },
                    {
                        id: "met-sexual",
                        title: "Sexual Health & Function",
                        what: "Confidential support for sexual health and function within a holistic wellness approach.",
                        note: "AHPRA-registered practitioner consultation"
                    }
                ]
            }
        };

        // --- QUIZ DATA ---
        const hhpQuizzes = {
            bmi: {
                title: "Weight Loss Pre-Screening",
                questions: [
                    { id: "age", text: "Are you over 18?", type: "single", options: ["Yes", "No"] },
                    { id: "weight", text: "Current Weight (kg)", type: "number" },
                    { id: "height", text: "Height (cm)", type: "number" },
                    { id: "bmi_calc", text: "BMI Result", type: "info" }
                ]
            }
        };

        // --- HEALTH OPTIMISATION SCREENING DATA ---
        const hhpHealthOptSteps = [
            {
                title: "Health Optimisation Screening",
                subtitle: "Tell us your primary health goal.",
                questions: [
                    {
                        id: "goal",
                        label: "What is your primary reason for seeking a Health Optimisation Program?",
                        type: "single",
                        required: true,
                        options: [
                            "Weight Management & Metabolic Health",
                            "Healthy Ageing & Longevity",
                            "Recovery & Physical Wellbeing",
                            "Mental Clarity & Focus",
                            "Energy, Vitality & Wellness",
                            "Sexual Health & Wellbeing",
                            "General Wellness Optimisation"
                        ]
                    }
                ]
            },
            {
                title: "Basic Eligibility",
                subtitle: "A couple of quick checks before we continue.",
                questions: [
                    { id: "over18", label: "Are you 18 years or older?", type: "single", required: true, options: ["Yes", "No"] },
                    { id: "inAustralia", label: "Are you currently located in Australia?", type: "single", required: true, options: ["Yes", "No"] }
                ]
            },
            {
                title: "Medical Screening",
                subtitle: "Help us understand your medical background.",
                questions: [
                    {
                        id: "usedPeptide",
                        label: "Have you previously used peptide therapy or prescription weight management medications?",
                        type: "single", required: true, options: ["Yes", "No"],
                        detailIf: "Yes", detailId: "peptideDetails", detailLabel: "If yes, please provide details."
                    },
                    { id: "underCare", label: "Are you currently under the care of a GP or Specialist?", type: "single", required: true, options: ["Yes", "No"] }
                ]
            },
            {
                title: "Safety Questions",
                subtitle: "These questions help us keep you safe.",
                questions: [
                    { id: "pregnant", label: "Are you pregnant, planning pregnancy or breastfeeding?", type: "single", required: true, options: ["Yes", "No"] },
                    { id: "cancer", label: "Have you ever been diagnosed with cancer?", type: "single", required: true, options: ["Yes", "No"] },
                    { id: "organCondition", label: "Do you have a liver, kidney or heart condition?", type: "single", required: true, options: ["Yes", "No"] },
                    {
                        id: "onMeds",
                        label: "Are you currently taking any prescription medications?",
                        type: "single", required: true, options: ["Yes", "No"],
                        detailIf: "Yes", detailId: "medsList", detailLabel: "If yes, please list."
                    },
                    { id: "injectableAllergy", label: "Do you have any allergies to injectable medications?", type: "single", required: true, options: ["Yes", "No"] }
                ]
            },
            {
                title: "Consent",
                subtitle: "Please review and acknowledge before continuing.",
                questions: [
                    {
                        id: "consentInfo",
                        type: "info",
                        text: "Health Optimisation programs may include prescription-only treatments where clinically appropriate. All patients require assessment by a registered healthcare practitioner. Additional pathology testing may be required before treatment recommendations can be made."
                    },
                    { id: "consent1", type: "check", required: true, text: "I understand that completing this form does not guarantee treatment eligibility." },
                    { id: "consent2", type: "check", required: true, text: "I understand that treatment decisions can only be made following consultation with a qualified practitioner." },
                    { id: "consent3", type: "check", required: true, text: "I consent to HHCPA collecting my health information for assessment purposes." }
                ]
            }
        ];

        // Pre-fill the goal question based on the sub-service selected
        const hhpGoalMap = {
            "met-longevity":   "Healthy Ageing & Longevity",
            "met-ageing":      "Healthy Ageing & Longevity",
            "met-performance": "Recovery & Physical Wellbeing",
            "met-injury":      "Recovery & Physical Wellbeing",
            "met-mental":      "Mental Clarity & Focus",
            "met-vitality":    "Energy, Vitality & Wellness",
            "met-sexual":      "Sexual Health & Wellbeing"
        };

        // --- STATE ---
        let hhpState = {
            service: null,
            subOption: null,
            answers: {},
            certScreen: {},
            certScreenStep: 0,
            screen: {},
            screenStep: 0
        };

        // --- DOM ---
        const hhpEls = {
            step2Label: document.getElementById('hhp-step2-label'),
            serviceSelection: document.getElementById('hhp-serviceSelection'),
            optionSection: document.getElementById('hhp-optionSection'),
            optionContent: document.getElementById('hhp-optionContent'),
            optionTitle: document.getElementById('hhp-optionTitle'),
            optionSubtitle: document.getElementById('hhp-optionSubtitle'),
            redirectMessage: document.getElementById('hhp-redirectMessage'),
            bookingEmbed: document.getElementById('hhp-bookingEmbed'),
            continueBtn: document.getElementById('hhp-continueBtn'),
            mainNav: document.getElementById('hhp-mainNav')
        };

        // --- INITIALIZATION ---
        function hhpInit() {
            document.querySelectorAll('#hhp-booking-wrapper .hhp-service-card').forEach(card => {
                card.addEventListener('click', () => hhpHandleServiceClick(card.dataset.service));
            });
            document.querySelector('#hhp-booking-wrapper [data-action="back-to-services"]').addEventListener('click', hhpReset);
            hhpEls.continueBtn.addEventListener('click', hhpHandleContinue);

            // Auto-open service from URL param ?service=xxx
            const urlParams = new URLSearchParams(window.location.search);
            const serviceParam = urlParams.get('service');
            if (serviceParam && hhpSubMenus[serviceParam]) {
                setTimeout(() => {
                    document.getElementById('hhp-booking-wrapper').scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        hhpHandleServiceClick(serviceParam);
                    }, 100);
                }, 100);
            }
        }

        // Run immediately if DOM is ready, otherwise wait
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', hhpInit);
        } else {
            hhpInit();
        }

        // --- LOGIC ---
        function hhpHandleServiceClick(serviceKey) {
            hhpState.service = serviceKey;
            let config = hhpSubMenus[serviceKey];
            
            // Visual Selection
            document.querySelectorAll('#hhp-booking-wrapper .hhp-service-card').forEach(c => c.classList.remove('selected'));
            document.querySelector(`#hhp-booking-wrapper [data-service="${serviceKey}"]`).classList.add('selected');

            hhpUpdateSteps(2);
            hhpEls.serviceSelection.style.display = 'none';
            hhpEls.optionSection.style.display = 'block';

            // SCROLL TO TOP OF WIZARD
            document.getElementById('hhp-booking-wrapper').scrollIntoView({ behavior: 'smooth' });

            if (config.type === "certificates") {
                hhpStartCertScreening(config);
            } else if (config.type === "options") {
                hhpRenderOptions(config);
            } else {
                hhpRenderTimingOptions(config);
            }
        }

        function hhpRenderOptions(config) {
            hhpEls.mainNav.style.display = 'flex';
            hhpEls.step2Label.innerText = "Service Options";
            hhpEls.optionTitle.innerText = config.title;
            hhpEls.optionSubtitle.innerText = "Please choose the specific service you require.";
            hhpEls.continueBtn.style.display = 'none';

            const priceHtml = config.price
                ? `<div style="text-align:center;margin-bottom:24px;"><p style="font-size:13px;font-weight:600;color:var(--hhp-text-light);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Consultation Fee</p><span class="hhp-service-price" style="font-size:18px;padding:8px 18px;">${config.price}</span></div>`
                : '';
            const categoryNoteHtml = config.categoryNote
                ? `<div class="hhp-cert-disclaimer">${config.categoryNote}</div>`
                : '';

            let html = priceHtml + categoryNoteHtml;
            config.items.forEach(item => {
                const priceTag = item.price ? `<span class="hhp-option-price-tag">${item.price}</span>` : '';
                const caveatHtml = item.caveat
                    ? `<div class="hhp-detail-row" style="margin-top:8px;"><span class="hhp-detail-text" style="font-size:13px;font-style:italic;">${item.caveat}</span></div>`
                    : '';
                html += `
                    <div class="hhp-option-card" onclick="hhpHandleSubOptionSelection('${item.id}')">
                        <div class="hhp-option-icon">›</div>
                        <div class="hhp-option-content">
                            <div class="hhp-option-header">
                                <span class="hhp-option-title">${item.title}</span>
                                ${priceTag}
                            </div>
                            <div class="hhp-option-detail-box">
                                <div class="hhp-detail-row">
                                    <span class="hhp-detail-label">Patients Get:</span>
                                    <span class="hhp-detail-text">${item.what}</span>
                                </div>
                                <div class="hhp-detail-row">
                                    <span class="hhp-detail-label">Delivery Note:</span>
                                    <span class="hhp-detail-text">${item.note}</span>
                                </div>
                                ${caveatHtml}
                            </div>
                        </div>
                    </div>
                `;
            });
            hhpEls.optionContent.innerHTML = html;
        }

        function hhpRenderTimingOptions(config) {
            hhpEls.mainNav.style.display = 'flex';
            hhpEls.step2Label.innerText = "Appointment Timing";
            hhpEls.optionTitle.innerText = "When would you like to book?";
            hhpEls.optionSubtitle.innerText = "Please choose the specific service you require.";
            hhpEls.continueBtn.style.display = 'none';

            const priceHtml = config && config.price
                ? `<div style="text-align:center;margin-bottom:24px;"><p style="font-size:13px;font-weight:600;color:var(--hhp-text-light);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;">Consultation Fee</p><span class="hhp-service-price" style="font-size:18px;padding:8px 18px;">${config.price}</span></div>`
                : '';

            const introHtml = config && config.introHeading
                ? `<div style="text-align:center;margin-bottom:20px;">${config.introEyebrow ? `<p style="font-size:13px;font-weight:600;color:var(--hhp-text-light);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;">${config.introEyebrow}</p>` : ''}<h3 style="font-size:18px;font-weight:600;color:var(--hhp-primary);margin-bottom:8px;">${config.introHeading}</h3>${config.introText ? `<p style="font-size:14px;color:var(--hhp-text);max-width:640px;margin:0 auto;line-height:1.6;">${config.introText}</p>` : ''}</div>`
                : '';
            const timingCaveatHtml = config && config.caveat
                ? `<div class="hhp-cert-disclaimer">${config.caveat}</div>`
                : '';

            let html = priceHtml + introHtml + timingCaveatHtml + `
                <div class="hhp-option-card" onclick="hhpHandleSubOptionSelection('asap')">
                    <div class="hhp-option-icon">⚡</div>
                    <div class="hhp-option-content">
                        <div class="hhp-option-header"><span class="hhp-option-title">Book ASAP</span></div>
                        <div class="hhp-option-detail-box">
                            <div class="hhp-detail-row"><span class="hhp-detail-text">Book the next available appointment.</span></div>
                        </div>
                    </div>
                </div>
                <div class="hhp-option-card" onclick="hhpHandleSubOptionSelection('later')">
                    <div class="hhp-option-icon">📅</div>
                    <div class="hhp-option-content">
                        <div class="hhp-option-header"><span class="hhp-option-title">Book for Later</span></div>
                        <div class="hhp-option-detail-box">
                            <div class="hhp-detail-row"><span class="hhp-detail-text">Select a specific date and time in the future.</span></div>
                        </div>
                    </div>
                </div>
            `;
            hhpEls.optionContent.innerHTML = html;
        }

        // --- MEDICAL CERTIFICATE ASSESSMENT (multi-step screening) ---
        const hhpCertSteps = [
            {
                title: "HHCPA Medical Certificate Assessment",
                subtitle: "Single-Day & Multiple-Day Medical Certificates",
                questions: [
                    {
                        id: "certImportantNotice",
                        type: "warning",
                        title: "⚠️ Important Notice",
                        text: "This service is intended for non-emergency medical certificate requests only. If you are experiencing chest pain, difficulty breathing, severe bleeding, loss of consciousness, suicidal thoughts, stroke symptoms, or any other medical emergency, call 000 immediately or attend your nearest Emergency Department. If your symptoms worsen or do not improve, please seek further medical attention from your GP or another appropriate healthcare provider."
                    },
                    {
                        id: "certIntro",
                        type: "info",
                        text: `<ul style="margin:10px 0 0 18px;padding:0;">
                            <li>Medical certificates are issued only following assessment by a registered Australian healthcare practitioner.</li>
                            <li>Medical certificates are not guaranteed and remain subject to clinical assessment.</li>
                            <li>Medical certificates cannot be backdated.</li>
                            <li>This service is not suitable for medical emergencies.</li>
                            <li>Patients must be physically located in Australia at the time of consultation.</li>
                        </ul>`
                    }
                ]
            },
            {
                title: "Purpose of Certificate",
                subtitle: "Tell us a little about what this certificate is for.",
                questions: [
                    {
                        id: "purpose", label: "What is the purpose of this certificate?", type: "single", required: true,
                        options: ["Work", "Study", "Carer's Responsibilities", "Other"],
                        detailIf: "Other", detailId: "purposeOther", detailLabel: "Please specify"
                    },
                    {
                        id: "futureDate", label: "Are you requesting a certificate for today's date or future dates?", type: "single", required: true,
                        options: ["Yes", "No"], note: "Please note: HHCPA practitioners do not provide backdated medical certificates."
                    },
                    {
                        id: "reason", label: "What is the primary reason for requesting a medical certificate today?", type: "single", required: true,
                        options: [
                            "Cold / Flu Symptoms", "COVID-19 or Respiratory Illness", "Gastrointestinal Illness (Vomiting, Diarrhoea)",
                            "Migraine / Headache", "Mental Health Concerns (Stress, Anxiety, Low Mood)", "Back, Neck or Joint Pain",
                            "Injury", "Medical Condition Flare-Up", "Other"
                        ],
                        detailIf: "Other", detailId: "reasonOther", detailLabel: "Please specify"
                    }
                ]
            },
            {
                title: "Symptom Duration & Severity",
                subtitle: "Help us understand how you're feeling.",
                questions: [
                    {
                        id: "duration", label: "When did your symptoms begin?", type: "single", required: true,
                        options: ["Today", "Yesterday", "2–3 Days Ago", "4–7 Days Ago", "More Than 1 Week Ago"]
                    },
                    {
                        id: "severity", label: "How severe are your symptoms currently?", type: "single", required: true,
                        options: ["Mild", "Moderate", "Severe"]
                    }
                ]
            },
            {
                title: "Current Symptoms",
                subtitle: "Select all that apply.",
                questions: [
                    {
                        id: "symptoms", label: "Are you currently experiencing any of the following?", type: "multi", required: true,
                        options: [
                            "Fever or High Temperature", "Cough", "Sore Throat", "Fatigue", "Headache or Migraine",
                            "Nausea", "Vomiting", "Diarrhoea", "Pain", "Reduced Mobility", "Anxiety", "Stress", "Low Mood",
                            "Poor Sleep", "Other"
                        ],
                        detailIf: "Other", detailId: "symptomsOther", detailLabel: "Please specify"
                    },
                    {
                        id: "painLevel", label: "If experiencing pain, please rate your pain level.", type: "single", required: false,
                        options: ["0–3 Mild", "4–6 Moderate", "7–10 Severe", "Not Applicable"],
                        showIf: { q: "symptoms", includes: "Pain" }
                    }
                ]
            },
            {
                title: "Functional Capacity Assessment",
                subtitle: "Tell us how this is affecting your daily activities.",
                questions: [
                    {
                        id: "functionalImpact", label: "How is your condition affecting your ability to work, study or perform your usual daily activities?", type: "multi", required: true,
                        options: [
                            "Unable to concentrate effectively", "Unable to perform usual duties", "Unable to safely drive",
                            "Unable to undertake physical tasks", "Unable to attend work or study", "Require rest and recovery",
                            "Symptoms may place myself or others at risk", "Other"
                        ],
                        detailIf: "Other", detailId: "functionalOther", detailLabel: "Please specify"
                    },
                    {
                        id: "dutiesCapacity", label: "Are you currently able to perform any of your usual duties?", type: "single", required: true,
                        options: ["Yes – Full Duties", "Yes – Modified Duties Only", "No – Unable to Perform Duties"]
                    }
                ]
            },
            {
                title: "Recovery & Treatment",
                subtitle: "Let us know what you've already tried.",
                questions: [
                    {
                        id: "treatmentSought", label: "Have you sought treatment or advice for this condition?", type: "single", required: true,
                        options: ["No", "Yes – General Practitioner", "Yes – Hospital / Emergency Department", "Yes – Specialist", "Yes – Other Healthcare Practitioner"]
                    },
                    {
                        id: "measuresTaken", label: "What measures have you taken to manage your condition?", type: "multi", required: false,
                        options: ["Rest", "Medication", "Physiotherapy", "Counselling / Psychology", "GP Review", "Hospital Review", "Other"],
                        detailIf: "Other", detailId: "measuresOther", detailLabel: "Please specify"
                    }
                ]
            },
            {
                title: "Certificate Request",
                subtitle: "Tell us the dates you need covered.",
                note: "Medical certificates cannot be backdated. Pricing: Single-day certificate $19.90 · Multiple-day certificate (2+ days) $49.",
                questions: [
                    { id: "firstDay", label: "First Day Required", type: "date", required: true },
                    { id: "lastDay", label: "Last Day Required", type: "date", required: true },
                    {
                        id: "daysRequested", label: "How many days are you requesting?", type: "single", required: true,
                        options: ["1 Day", "2–3 Days", "4–7 Days", "More Than 7 Days"]
                    },
                    {
                        id: "extraDaysReason", label: "If requesting multiple days, why do you believe additional recovery time is required?", type: "textarea", required: false,
                        showIf: { q: "daysRequested", notEquals: "1 Day" }
                    }
                ]
            },
            {
                title: "Safety Screening",
                subtitle: "These questions help us keep you safe.",
                questions: [
                    {
                        id: "safety", label: "Are you currently experiencing any of the following?", type: "multi", required: true,
                        options: [
                            "Chest Pain", "Difficulty Breathing", "Severe Allergic Reaction", "Sudden Vision Changes",
                            "Severe Dizziness", "Confusion", "Slurred Speech", "Facial Drooping", "New Weakness or Numbness",
                            "Thoughts of Self-Harm", "None of the Above"
                        ],
                        exclusiveOption: "None of the Above"
                    }
                ]
            },
            {
                title: "Work / Study Information",
                subtitle: "Tell us a little about your occupation or study.",
                questions: [
                    {
                        id: "occupation", label: "What best describes your occupation or study?", type: "single", required: true,
                        options: ["Office / Administration", "Healthcare Worker", "Driver / Transport", "Construction / Trades", "Retail / Hospitality", "Student", "Other"]
                    }
                ]
            },
            {
                title: "Additional Information",
                subtitle: "Optional — anything else the practitioner should know.",
                questions: [
                    { id: "additionalInfo", label: "Is there any other information you would like the practitioner to know? (Maximum 300 characters)", type: "textarea", required: false, maxLength: 300 }
                ]
            },
            {
                title: "Eligibility",
                subtitle: "A couple of quick checks before we continue.",
                questions: [
                    { id: "inAustralia", label: "Are you currently located in Australia?", type: "single", required: true, options: ["Yes", "No"] },
                    {
                        id: "understandsIndependently", label: "Do you understand the information provided and can complete this consultation independently?", type: "single", required: true,
                        options: ["Yes", "No – I require assistance or an interpreter"]
                    }
                ]
            },
            {
                title: "Telehealth Consent & Patient Declaration",
                subtitle: "Please review and acknowledge before continuing.",
                questions: [
                    { id: "consent1", type: "check", required: true, text: "I confirm that all information I have provided is true, complete, and accurate to the best of my knowledge." },
                    { id: "consent2", type: "check", required: true, text: "I understand that this is a telehealth service and that the practitioner's assessment is based on the information I provide." },
                    { id: "consent3", type: "check", required: true, text: "I understand that medical certificates cannot be backdated." },
                    { id: "consent4", type: "check", required: true, text: "I understand that submission of this form does not guarantee that a medical certificate will be issued." },
                    { id: "consent5", type: "check", required: true, text: "I understand that this service is not suitable for medical emergencies." },
                    { id: "consent6", type: "check", required: true, text: "I agree to seek immediate medical attention by calling 000 or attending the nearest Emergency Department if I experience severe, worsening, or potentially life-threatening symptoms." },
                    { id: "consent7", type: "check", required: true, text: "I understand that if my symptoms do not improve, worsen, or persist, I should seek further assessment from my GP or another appropriate healthcare provider." },
                    { id: "consent8", type: "check", required: true, text: "I consent to HHCPA collecting, using, and storing my personal and health information in accordance with its Privacy Policy and applicable Australian privacy legislation." }
                ]
            }
        ];

        function hhpStartCertScreening() {
            hhpState.certScreen = {};
            hhpState.certScreenStep = 0;
            hhpEls.step2Label.innerText = "Certificate Screening";
            hhpRenderCertStep();
        }

        function hhpCertFindQuestion(qid) {
            return hhpCertSteps[hhpState.certScreenStep].questions.find(q => q.id === qid);
        }

        function hhpCertCheckShowIf(q) {
            if (!q.showIf) return true;
            const val = hhpState.certScreen[q.showIf.q];
            if ('includes' in q.showIf) return Array.isArray(val) && val.includes(q.showIf.includes);
            if ('notEquals' in q.showIf) return val !== undefined && val !== '' && val !== q.showIf.notEquals;
            return true;
        }

        function hhpCertUpdateConditional(triggerQid) {
            hhpCertSteps[hhpState.certScreenStep].questions.forEach(q => {
                if (q.showIf && q.showIf.q === triggerQid) {
                    const wrap = document.getElementById('hhp-conditional-' + q.id);
                    if (wrap) wrap.style.display = hhpCertCheckShowIf(q) ? 'block' : 'none';
                }
            });
        }

        function hhpRenderCertStep() {
            const idx = hhpState.certScreenStep;
            const step = hhpCertSteps[idx];

            hhpEls.mainNav.style.display = 'none';
            hhpEls.continueBtn.style.display = 'none';

            hhpEls.optionTitle.innerText = step.title;
            hhpEls.optionSubtitle.innerText = step.subtitle || '';

            let html = `<div class="hhp-screen-counter">Step ${idx + 1} of ${hhpCertSteps.length}</div>`;
            if (step.note) {
                html += `<div class="hhp-cert-disclaimer">${step.note}</div>`;
            }

            step.questions.forEach(q => {
                if (q.type === 'warning') {
                    html += `<div class="hhp-bmi-neutral" style="margin-bottom:20px;"><h3 style="margin-bottom:8px;">${q.title}</h3><p>${q.text}</p></div>`;
                    return;
                }
                if (q.type === 'info') {
                    html += `<div class="hhp-cert-disclaimer"><strong>Important Information</strong><br>${q.text}</div>`;
                    return;
                }
                if (q.type === 'check') {
                    const checked = hhpState.certScreen[q.id] ? 'checked' : '';
                    html += `<label class="hhp-consent-row"><input type="checkbox" ${checked} onchange="hhpCertSetCheck('${q.id}', this.checked)"><span>${q.text}</span></label>`;
                    return;
                }

                const showNow = hhpCertCheckShowIf(q);
                const wrapOpen = q.showIf ? `<div id="hhp-conditional-${q.id}" style="display:${showNow ? 'block' : 'none'};">` : '';
                const wrapClose = q.showIf ? `</div>` : '';

                html += `${wrapOpen}<div class="hhp-cert-question"><label>${q.label}</label>`;

                if (q.type === 'single') {
                    html += `<div class="hhp-cert-options-row">`;
                    q.options.forEach(opt => {
                        const sel = hhpState.certScreen[q.id] === opt ? 'selected' : '';
                        const safe = opt.replace(/'/g, "\\'");
                        html += `<div class="hhp-cert-chip ${sel}" data-value="${opt.replace(/"/g, '&quot;')}" onclick="hhpCertSetSingle('${q.id}', '${safe}', this)">${opt}</div>`;
                    });
                    html += `</div>`;
                    if (q.note) html += `<div class="hhp-cert-disclaimer" style="margin-top:12px;margin-bottom:0;">${q.note}</div>`;
                } else if (q.type === 'multi') {
                    const arr = hhpState.certScreen[q.id] || [];
                    html += `<div class="hhp-cert-options-row">`;
                    q.options.forEach(opt => {
                        const sel = arr.includes(opt) ? 'selected' : '';
                        const safe = opt.replace(/'/g, "\\'");
                        const exclusive = q.exclusiveOption ? `'${q.exclusiveOption.replace(/'/g, "\\'")}'` : 'null';
                        html += `<div class="hhp-cert-chip ${sel}" data-value="${opt.replace(/"/g, '&quot;')}" onclick="hhpCertToggleMulti('${q.id}', '${safe}', this, ${exclusive})">${opt}</div>`;
                    });
                    html += `</div>`;
                } else if (q.type === 'date') {
                    const val = hhpState.certScreen[q.id] || '';
                    html += `<input type="date" class="hhp-survey-input" value="${val}" onchange="hhpCertSetText('${q.id}', this.value)">`;
                } else if (q.type === 'textarea') {
                    const val = hhpState.certScreen[q.id] || '';
                    const maxAttr = q.maxLength ? ` maxlength="${q.maxLength}"` : '';
                    html += `<textarea class="hhp-survey-input" rows="3"${maxAttr} oninput="hhpCertSetText('${q.id}', this.value)">${val}</textarea>`;
                }

                if (q.detailIf) {
                    const triggerVal = hhpState.certScreen[q.id];
                    const show = Array.isArray(triggerVal) ? triggerVal.includes(q.detailIf) : triggerVal === q.detailIf;
                    const val = hhpState.certScreen[q.detailId] || '';
                    html += `<div id="hhp-detail-${q.id}" style="display:${show ? 'block' : 'none'};margin-top:12px;">
                        <label style="font-size:14px;font-weight:600;color:var(--hhp-primary);">${q.detailLabel}</label>
                        <textarea class="hhp-survey-input" rows="2" oninput="hhpCertSetText('${q.detailId}', this.value)">${val}</textarea>
                    </div>`;
                }

                html += `</div>${wrapClose}`;
            });

            html += `<div class="hhp-quiz-navigation">`;
            if (idx === 0) {
                html += `<button class="hhp-nav-button hhp-btn-back" onclick="hhpReset()">← Back to Services</button>`;
            } else {
                html += `<button class="hhp-nav-button hhp-btn-back" onclick="hhpCertScreenBack()">← Back</button>`;
            }
            const isLast = idx === hhpCertSteps.length - 1;
            html += `<button class="hhp-nav-button hhp-btn-next" onclick="hhpCertScreenNext()">${isLast ? 'Submit' : 'Next →'}</button>`;
            html += `</div>`;

            hhpEls.optionContent.innerHTML = html;
            document.getElementById('hhp-booking-wrapper').scrollIntoView({ behavior: 'smooth' });
        }

        window.hhpCertSetSingle = (qid, val, el) => {
            hhpState.certScreen[qid] = val;
            el.parentElement.querySelectorAll('.hhp-cert-chip').forEach(c => c.classList.remove('selected'));
            el.classList.add('selected');
            const detail = document.getElementById('hhp-detail-' + qid);
            if (detail) {
                const q = hhpCertFindQuestion(qid);
                detail.style.display = (q && val === q.detailIf) ? 'block' : 'none';
            }
            hhpCertUpdateConditional(qid);
        };

        window.hhpCertToggleMulti = (qid, val, el, exclusiveVal) => {
            let arr = hhpState.certScreen[qid] || [];
            const isSelected = arr.includes(val);
            if (exclusiveVal && val === exclusiveVal) {
                arr = isSelected ? [] : [exclusiveVal];
            } else {
                arr = isSelected ? arr.filter(v => v !== val) : arr.concat([val]);
                if (exclusiveVal) arr = arr.filter(v => v !== exclusiveVal);
            }
            hhpState.certScreen[qid] = arr;
            el.parentElement.querySelectorAll('.hhp-cert-chip').forEach(c => {
                c.classList.toggle('selected', arr.includes(c.dataset.value));
            });
            const detail = document.getElementById('hhp-detail-' + qid);
            if (detail) detail.style.display = arr.includes('Other') ? 'block' : 'none';
            hhpCertUpdateConditional(qid);
        };

        window.hhpCertSetText = (id, val) => { hhpState.certScreen[id] = val; };
        window.hhpCertSetCheck = (id, checked) => { hhpState.certScreen[id] = checked; };

        window.hhpCertScreenBack = () => {
            if (hhpState.certScreenStep > 0) {
                hhpState.certScreenStep--;
                hhpRenderCertStep();
            }
        };

        window.hhpCertScreenNext = () => {
            const step = hhpCertSteps[hhpState.certScreenStep];

            for (const q of step.questions) {
                if (!q.required || !hhpCertCheckShowIf(q)) continue;
                if (q.type === 'single' && !hhpState.certScreen[q.id]) {
                    alert('Please answer all questions before continuing.');
                    return;
                }
                if (q.type === 'multi' && (!hhpState.certScreen[q.id] || hhpState.certScreen[q.id].length === 0)) {
                    alert('Please answer all questions before continuing.');
                    return;
                }
                if (q.type === 'check' && !hhpState.certScreen[q.id]) {
                    alert('Please tick all consent boxes to continue.');
                    return;
                }
                if ((q.type === 'date' || q.type === 'textarea') && !hhpState.certScreen[q.id]) {
                    alert('Please complete all required fields before continuing.');
                    return;
                }
            }

            if (step.title === "Eligibility" && hhpState.certScreen.inAustralia === 'No') {
                hhpCertShowResult('ineligible-location');
                return;
            }

            if (step.title === "Safety Screening") {
                const safety = hhpState.certScreen.safety || [];
                const flagged = safety.filter(v => v !== 'None of the Above');
                if (flagged.length > 0) {
                    hhpCertShowResult('safety-flag');
                    return;
                }
            }

            if (hhpState.certScreenStep < hhpCertSteps.length - 1) {
                hhpState.certScreenStep++;
                hhpRenderCertStep();
            } else if (hhpState.certScreen.daysRequested === '1 Day') {
                // 1-day certificates go to the certificate-only page, not the consultation booking page.
                hhpState.subOption = 'cert-today';
                hhpPerformRedirect(CERT_REDIRECT_URL);
            } else {
                hhpState.subOption = 'cert-multiple';
                hhpPerformRedirect();
            }
        };

        function hhpCertShowResult(level) {
            hhpEls.mainNav.style.display = 'none';
            hhpEls.continueBtn.style.display = 'none';
            hhpEls.optionSubtitle.innerText = '';

            let html = '';
            if (level === 'safety-flag') {
                hhpEls.optionTitle.innerText = "Please seek urgent care";
                html = `<div class="hhp-bmi-ineligible">
                            <h3 style="margin-bottom:8px;">This service may not be suitable for your condition</h3>
                            <p>Based on your responses, please seek urgent medical attention, attend your nearest Emergency Department, or call 000.</p>
                        </div>
                        <div class="hhp-quiz-navigation">
                            <button class="hhp-nav-button hhp-btn-back" onclick="hhpRenderCertStep()">← Back to Question</button>
                        </div>`;
            } else if (level === 'ineligible-location') {
                hhpEls.optionTitle.innerText = "Eligibility";
                html = `<div class="hhp-bmi-ineligible">
                            <h3 style="margin-bottom:8px;">Unable to proceed</h3>
                            <p>Medical certificates are only available to patients currently located in Australia at the time of consultation.</p>
                        </div>
                        <div class="hhp-quiz-navigation">
                            <button class="hhp-nav-button hhp-btn-back" onclick="hhpRenderCertStep()">← Back to Question</button>
                        </div>`;
            }

            hhpEls.optionContent.innerHTML = html;
            document.getElementById('hhp-booking-wrapper').scrollIntoView({ behavior: 'smooth' });
        }

        // --- HANDLE SELECTION & QUIZ ROUTING ---
        window.hhpHandleSubOptionSelection = (optionId) => {
            hhpState.subOption = optionId;

            // SCROLL TO TOP OF WIZARD
            document.getElementById('hhp-booking-wrapper').scrollIntoView({ behavior: 'smooth' });

            if (hhpState.service === 'weight-management') {
                // Weight Management -> BMI pre-screening quiz
                hhpRenderQuiz(hhpQuizzes.bmi);
            } else if (hhpState.service === 'metabolic-wellness') {
                // Health Optimisation -> multi-step screening (no immediate booking)
                hhpStartHealthOptScreening(optionId);
            } else {
                // All other services -> straight to booking
                hhpPerformRedirect();
            }
        };

        function hhpRenderQuiz(quiz) {
            hhpEls.mainNav.style.display = 'flex';
            hhpEls.step2Label.innerText = "Pre-Screening";
            hhpEls.optionTitle.innerText = quiz.title;
            hhpEls.optionSubtitle.innerText = "Please complete the questions below.";
            hhpEls.continueBtn.style.display = 'block';
            hhpEls.continueBtn.innerText = "Continue to Booking";
            
            let html = '';
            quiz.questions.forEach(q => {
                html += `<div style="margin-bottom:20px"><label style="font-weight:600">${q.text}</label>`;
                if(q.type === 'single') {
                    html += `<div class="hhp-survey-options">`;
                    q.options.forEach(opt => {
                        html += `<div class="hhp-survey-option" onclick="hhpSelectQuizOption('${q.id}', '${opt}', this)">
                            <div class="hhp-survey-option-letter">-</div><span>${opt}</span></div>`;
                    });
                    html += `</div>`;
                } else if(q.type === 'number') {
                    html += `<input type="number" class="hhp-survey-input" oninput="hhpHandleQuizInput('${q.id}', this.value)">`;
                } else if(q.type === 'info') {
                    html += `<div id="hhp-bmiResultContainer"></div>`;
                }
                html += `</div>`;
            });
            hhpEls.optionContent.innerHTML = html;
        }

        // --- QUIZ ACTIONS ---
        window.hhpSelectQuizOption = (qid, val, el) => {
            hhpState.answers[qid] = val;
            el.parentElement.querySelectorAll('.hhp-survey-option').forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            if(qid === 'age' && val === 'No') { alert('Must be 18+'); hhpReset(); }
        };

        window.hhpHandleQuizInput = (qid, val) => {
            hhpState.answers[qid] = val;
            // BMI is calculated for Weight Management ONLY.
            if(hhpState.service === 'weight-management' && hhpState.answers['weight'] && hhpState.answers['height']) {
                const w = parseFloat(hhpState.answers['weight']);
                const h = parseFloat(hhpState.answers['height']) / 100;
                if (!w || !h) return;
                const bmi = (w / (h * h)).toFixed(1);
                let cls, msg;
                if (parseFloat(bmi) < 25) {
                    cls = 'hhp-bmi-neutral';
                    msg = 'Your BMI is within the healthy range. Weight management treatments may not be appropriate, however a practitioner can discuss your health goals and determine suitable options.';
                } else {
                    cls = 'hhp-bmi-eligible';
                    msg = 'Based on your BMI, you are eligible for a practitioner review to discuss suitable weight management options.';
                }
                document.getElementById('hhp-bmiResultContainer').innerHTML = `<div class="${cls}"><h3 style="margin-bottom:6px;">Your BMI: ${bmi}</h3><p>${msg}</p></div>`;
                // All BMI tiers can now proceed to a practitioner review.
                hhpState.bmiEligible = true;
            }
        };

        function hhpHandleContinue() {
            // Weight Management requires weight + height before continuing.
            if(hhpState.service === 'weight-management') {
                if(!hhpState.answers['weight'] || !hhpState.answers['height']) {
                    alert('Please enter your weight and height to continue.');
                    return;
                }
            }
            hhpPerformRedirect();
        }

        // =========================================================
        // HEALTH OPTIMISATION SCREENING
        // =========================================================
        function hhpStartHealthOptScreening(optionId) {
            hhpState.screen = {};
            hhpState.screenStep = 0;

            // Pre-fill the primary goal from the chosen sub-service where possible
            if (hhpGoalMap[optionId]) {
                hhpState.screen.goal = hhpGoalMap[optionId];
            }

            hhpEls.step2Label.innerText = "Screening";
            hhpRenderHealthOptStep();
        }

        function hhpRenderHealthOptStep() {
            const idx = hhpState.screenStep;
            const step = hhpHealthOptSteps[idx];

            // Use our own in-content navigation, hide the default nav row
            hhpEls.mainNav.style.display = 'none';
            hhpEls.continueBtn.style.display = 'none';

            hhpEls.optionTitle.innerText = step.title;
            hhpEls.optionSubtitle.innerText = step.subtitle || '';

            let html = `<div class="hhp-screen-counter">Step ${idx + 1} of ${hhpHealthOptSteps.length}</div>`;

            step.questions.forEach(q => {
                if (q.type === 'info') {
                    html += `<div class="hhp-cert-disclaimer"><strong>Important Information</strong><br>${q.text}</div>`;
                } else if (q.type === 'check') {
                    const checked = hhpState.screen[q.id] ? 'checked' : '';
                    html += `<label class="hhp-consent-row"><input type="checkbox" ${checked} onchange="hhpSetScreenCheck('${q.id}', this.checked)"><span>${q.text}</span></label>`;
                } else if (q.type === 'single') {
                    html += `<div class="hhp-cert-question"><label>${q.label}</label><div class="hhp-cert-options-row">`;
                    q.options.forEach(opt => {
                        const sel = hhpState.screen[q.id] === opt ? 'selected' : '';
                        const safe = opt.replace(/'/g, "\\'");
                        html += `<div class="hhp-cert-chip ${sel}" onclick="hhpSetScreenSingle('${q.id}', '${safe}', this)">${opt}</div>`;
                    });
                    html += `</div>`;
                    if (q.detailIf) {
                        const show = hhpState.screen[q.id] === q.detailIf ? 'block' : 'none';
                        const val = hhpState.screen[q.detailId] || '';
                        html += `<div id="hhp-detail-${q.id}" style="display:${show};margin-top:12px;">
                            <label style="font-size:14px;font-weight:600;color:var(--hhp-primary);">${q.detailLabel}</label>
                            <textarea class="hhp-survey-input" rows="2" oninput="hhpSetScreenText('${q.detailId}', this.value)">${val}</textarea>
                        </div>`;
                    }
                    html += `</div>`;
                }
            });

            // Navigation buttons
            html += `<div class="hhp-quiz-navigation">`;
            if (idx === 0) {
                html += `<button class="hhp-nav-button hhp-btn-back" onclick="hhpReset()">← Back to Services</button>`;
            } else {
                html += `<button class="hhp-nav-button hhp-btn-back" onclick="hhpScreenBack()">← Back</button>`;
            }
            const isLast = idx === hhpHealthOptSteps.length - 1;
            html += `<button class="hhp-nav-button hhp-btn-next" onclick="hhpScreenNext()">${isLast ? 'Submit' : 'Next →'}</button>`;
            html += `</div>`;

            hhpEls.optionContent.innerHTML = html;
            document.getElementById('hhp-booking-wrapper').scrollIntoView({ behavior: 'smooth' });
        }

        window.hhpSetScreenSingle = (qid, val, el) => {
            hhpState.screen[qid] = val;
            el.parentElement.querySelectorAll('.hhp-cert-chip').forEach(c => c.classList.remove('selected'));
            el.classList.add('selected');
            // Toggle any conditional detail field
            const detail = document.getElementById('hhp-detail-' + qid);
            if (detail) {
                detail.style.display = (val === 'Yes') ? 'block' : 'none';
            }
        };

        window.hhpSetScreenText = (id, val) => { hhpState.screen[id] = val; };
        window.hhpSetScreenCheck = (id, checked) => { hhpState.screen[id] = checked; };

        window.hhpScreenBack = () => {
            if (hhpState.screenStep > 0) {
                hhpState.screenStep--;
                hhpRenderHealthOptStep();
            }
        };

        window.hhpScreenNext = () => {
            const step = hhpHealthOptSteps[hhpState.screenStep];

            // Validate current step
            for (const q of step.questions) {
                if (q.type === 'single' && q.required && !hhpState.screen[q.id]) {
                    alert('Please answer all questions before continuing.');
                    return;
                }
                if (q.type === 'check' && q.required && !hhpState.screen[q.id]) {
                    alert('Please tick all consent boxes to continue.');
                    return;
                }
            }

            // Hard eligibility stop on the Basic Eligibility step
            if (step.title === "Basic Eligibility") {
                if (hhpState.screen.over18 === 'No') { hhpShowScreenResult('ineligible-age'); return; }
                if (hhpState.screen.inAustralia === 'No') { hhpShowScreenResult('ineligible-location'); return; }
            }

            if (hhpState.screenStep < hhpHealthOptSteps.length - 1) {
                hhpState.screenStep++;
                hhpRenderHealthOptStep();
            } else {
                // Final step submitted -> run triage
                hhpShowScreenResult(hhpTriage(hhpState.screen));
            }
        };

        // Automatic triage
        function hhpTriage(s) {
            if (s.over18 === 'No') return 'ineligible-age';
            if (s.inAustralia === 'No') return 'ineligible-location';

            // RED - do not auto book
            if (s.pregnant === 'Yes') return 'red';
            if (s.cancer === 'Yes') return 'red';

            // AMBER - practitioner review required before any treatment
            if (s.organCondition === 'Yes' || s.underCare === 'Yes' || s.onMeds === 'Yes' ||
                s.usedPeptide === 'Yes' || s.injectableAllergy === 'Yes') {
                return 'amber';
            }

            // GREEN - proceed to booking
            return 'green';
        }

        function hhpShowScreenResult(level) {
            hhpEls.mainNav.style.display = 'none';
            hhpEls.continueBtn.style.display = 'none';
            hhpEls.optionSubtitle.innerText = '';

            let html = '';

            if (level === 'green') {
                hhpEls.optionTitle.innerText = "You're all set";
                html = `<div class="hhp-bmi-eligible">
                            <h3 style="margin-bottom:8px;">Great news</h3>
                            <p>Based on your responses, you can go ahead and book your initial consultation. Your practitioner will confirm the right program for you during your appointment.</p>
                        </div>
                        <div class="hhp-quiz-navigation">
                            <button class="hhp-nav-button hhp-btn-back" onclick="hhpReset()">← Start Over</button>
                            <button class="hhp-nav-button hhp-btn-next" onclick="hhpPerformRedirect()">Book Initial Consultation</button>
                        </div>`;
            } else if (level === 'amber') {
                hhpEls.optionTitle.innerText = "Practitioner review";
                html = `<div class="hhp-bmi-neutral">
                            <h3 style="margin-bottom:8px;">A quick review first</h3>
                            <p>You can go ahead and book a consultation. Based on your responses, one of our practitioners will review your information before any treatment is recommended, to make sure it is safe and suitable for you.</p>
                        </div>
                        <div class="hhp-quiz-navigation">
                            <button class="hhp-nav-button hhp-btn-back" onclick="hhpReset()">← Start Over</button>
                            <button class="hhp-nav-button hhp-btn-next" onclick="hhpPerformRedirect()">Book Consultation</button>
                        </div>`;
            } else if (level === 'red') {
                hhpEls.optionTitle.innerText = "Further review needed";
                html = `<div class="hhp-bmi-ineligible">
                            <h3 style="margin-bottom:8px;">We need to review your responses</h3>
                            <p>Based on your responses, your situation requires further review before booking. A member of our team will contact you.</p>
                        </div>
                        <div class="hhp-quiz-navigation">
                            <button class="hhp-nav-button hhp-btn-back" onclick="hhpReset()">← Start Over</button>
                        </div>`;
            } else if (level === 'ineligible-age') {
                hhpEls.optionTitle.innerText = "Eligibility";
                html = `<div class="hhp-bmi-ineligible">
                            <h3 style="margin-bottom:8px;">Unable to proceed</h3>
                            <p>Our Health Optimisation programs are only available to patients aged 18 years and over.</p>
                        </div>
                        <div class="hhp-quiz-navigation">
                            <button class="hhp-nav-button hhp-btn-back" onclick="hhpReset()">← Back to Services</button>
                        </div>`;
            } else if (level === 'ineligible-location') {
                hhpEls.optionTitle.innerText = "Eligibility";
                html = `<div class="hhp-bmi-ineligible">
                            <h3 style="margin-bottom:8px;">Unable to proceed</h3>
                            <p>Our Health Optimisation programs are only available to patients currently located in Australia.</p>
                        </div>
                        <div class="hhp-quiz-navigation">
                            <button class="hhp-nav-button hhp-btn-back" onclick="hhpReset()">← Back to Services</button>
                        </div>`;
            }

            hhpEls.optionContent.innerHTML = html;
            document.getElementById('hhp-booking-wrapper').scrollIntoView({ behavior: 'smooth' });
        }

        // =========================================================

        // Halaxy in-page booking widget (all services except medicinal cannabis).
        const HALAXY_BOOKING_EMBED = `<iframe src="https://www.halaxy.com/book/widget/horizon-health-care-partners-australia/location/1345231" allow="payment" title="Book a consultation with Horizon Health Care Partners" style="border:0;width:100%;height:1100px;max-height:90vh;" loading="lazy"></iframe>`;

        function hhpPerformRedirect(url) {
            hhpUpdateSteps(3);
            hhpEls.optionSection.style.display = 'none';

            // Explicit URL (e.g. medical certificate flow) still redirects to that page.
            if (url) {
                hhpEls.redirectMessage.style.display = 'block';
                setTimeout(() => {
                    window.location.href = url;
                }, 1500);
                return;
            }

            // Default: embed the Halaxy booking widget in-place so patients book without leaving the site.
            hhpEls.redirectMessage.style.display = 'none';
            if (hhpEls.bookingEmbed.dataset.loaded !== '1') {
                hhpEls.bookingEmbed.innerHTML = `
                    <div style="text-align:center;margin-bottom:16px;">
                        <h2 style="font-size:24px;font-weight:600;color:var(--hhp-primary);margin-bottom:6px;">Book your consultation</h2>
                        <p style="font-size:14px;color:var(--hhp-text-light);">Complete your booking securely below.</p>
                    </div>
                    ${HALAXY_BOOKING_EMBED}`;
                hhpEls.bookingEmbed.dataset.loaded = '1';
            }
            hhpEls.bookingEmbed.style.display = 'block';
            document.getElementById('hhp-booking-wrapper').scrollIntoView({ behavior: 'smooth' });
        }

        function hhpReset() {
            hhpUpdateSteps(1);
            hhpEls.serviceSelection.style.display = 'block';
            hhpEls.optionSection.style.display = 'none';
            hhpEls.redirectMessage.style.display = 'none';
            if (hhpEls.bookingEmbed) hhpEls.bookingEmbed.style.display = 'none';
            if (hhpEls.mainNav) hhpEls.mainNav.style.display = 'flex';
            hhpEls.optionSubtitle.innerText = 'Please choose the specific service you require.';
            hhpState = { service: null, subOption: null, answers: {}, certScreen: {}, certScreenStep: 0, screen: {}, screenStep: 0 };
            document.querySelectorAll('#hhp-booking-wrapper .hhp-service-card').forEach(c => c.classList.remove('selected'));
        }

        function hhpUpdateSteps(num) {
            document.querySelectorAll('#hhp-booking-wrapper .hhp-step').forEach((s, i) => {
                s.classList.remove('active','completed');
                if(i+1 < num) s.classList.add('completed');
                if(i+1 === num) s.classList.add('active');
            });
        }

        // Expose redirect/reset for inline button handlers
        window.hhpPerformRedirect = hhpPerformRedirect;
        window.hhpReset = hhpReset;
    