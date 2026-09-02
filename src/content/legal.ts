/**
 * Privacy Policy and Terms and Conditions.
 *
 * Migrated verbatim from the client's live site rather than written here. These
 * are legal instruments — the Privacy Policy makes binding representations
 * under the Privacy Act 1988 and the Australian Privacy Principles — and
 * drafting them is not a job for a rebuild.
 *
 * Structure was corrected in migration, wording was not. The live pages mark
 * most of their section headings as plain paragraphs, so the documents had one
 * real heading each and no outline at all for anyone navigating by heading or
 * using a screen reader. Those are promoted to h2 and h3 here.
 *
 * Every block was checked against the source: 113 of 113 in the Terms and 45 of
 * 49 in the Privacy Policy are verbatim. The four that differ are the cookie
 * sub-labels — "Managing Cookies:", "Third-Party Cookies:", "Consent:" and
 * "Changes to This Section:" — which became h3 headings and lost the trailing
 * colon a heading does not need. No sentence has been changed, added or
 * dropped.
 *
 * ⚠️ Three inconsistencies came out of the migration and need the client's
 * decision. They are faithful to the source, which is the point — they were
 * already live:
 *
 *   1. The Privacy Policy names Google Ads, Google Analytics, Google Tag
 *      Manager and Meta Pixel cookies. This rebuild sets none of them. Either
 *      the tags go in or that section is wrong, and a policy describing
 *      tracking the site does not do is a false statement to patients.
 *   2. The Terms say they are governed by the law of New South Wales, while
 *      the clinic is described throughout as based in West End, Queensland.
 *      This also bears on the Complaints page, where the state health
 *      complaints body to name first is still unconfirmed.
 *   3. The two documents carry different "last updated" dates, and the Terms
 *      are dated later than the Privacy Policy they incorporate.
 */

export type LegalBlock =
  | { readonly kind: "h2"; readonly text: string }
  | { readonly kind: "h3"; readonly text: string }
  | { readonly kind: "p"; readonly text: string }
  | { readonly kind: "ul"; readonly items: readonly string[] };

export interface LegalDocument {
  readonly meta: {
    readonly title: string;
    readonly description: string;
    readonly path: string;
  };
  readonly heading: string;
  readonly lastUpdated: string;
  readonly blocks: readonly LegalBlock[];
}

export const PRIVACY_POLICY: LegalDocument = {
  meta: {
    title: "Privacy Policy | Horizon Health Care Partners",
    description:
      "How Horizon Health Care Partners collects, uses and protects your personal information, in line with the Australian Privacy Principles.",
    path: "/privacy/",
  },
  heading: "Privacy Policy",
  lastUpdated: "Last updated, Oct 2025",
  blocks: [
    {
      kind: "p",
      text: "We are committed to providing quality services to you and this policy outlines our ongoing obligations to you in respect of how we manage your Personal Information.",
    },
    {
      kind: "p",
      text: "We have adopted the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth) (the Privacy Act). The APPs govern the way in which we collect, use, disclose, store, secure and dispose of your Personal Information.",
    },
    {
      kind: "p",
      text: "A copy of the Australian Privacy Principles may be obtained from the website of The Office of the Australian Information Commissioner at https://www.oaic.gov.au/.",
    },
    {
      kind: "h2",
      text: "What is Personal Information and why do we collect it?",
    },
    {
      kind: "p",
      text: "Personal Information is information or an opinion that identifies an individual. Examples of Personal Information we collect include names, addresses, email addresses, phone and facsimile numbers.",
    },
    {
      kind: "p",
      text: "This Personal Information is obtained in many ways including correspondence, by telephone and facsimile, by email, via our website, from your website, from media and publications, from other publicly available sources, from cookies and from third parties. We don’t guarantee website links or policy of authorised third parties.",
    },
    {
      kind: "p",
      text: "We collect your Personal Information for the primary purpose of providing our services to you, providing information to our clients and marketing. We may also use your Personal Information for secondary purposes closely related to the primary purpose, in circumstances where you would reasonably expect such use or disclosure. You may unsubscribe from our mailing/marketing lists at any time by contacting us in writing.",
    },
    {
      kind: "p",
      text: "When we collect Personal Information we will, where appropriate and where possible, explain to you why we are collecting the information and how we plan to use it.",
    },
    { kind: "h2", text: "Sensitive Information" },
    {
      kind: "p",
      text: "Sensitive information is defined in the Privacy Act to include information or opinion about such things as an individual’s racial or ethnic origin, political opinions, membership of a political association, religious or philosophical beliefs, membership of a trade union or other professional body, criminal record or health information.",
    },
    { kind: "p", text: "Sensitive information will be used by us only:" },
    {
      kind: "ul",
      items: [
        "For the primary purpose for which it was obtained",
        "For a secondary purpose that is directly related to the primary purpose",
        "With your consent; or where required or authorised by law.",
      ],
    },
    { kind: "h2", text: "Third Parties" },
    {
      kind: "p",
      text: "Where reasonable and practicable to do so, we will collect your Personal Information only from you. However, in some circumstances we may be provided with information by third parties. In such a case we will take reasonable steps to ensure that you are made aware of the information provided to us by the third party.",
    },
    { kind: "h2", text: "Disclosure of Personal Information" },
    {
      kind: "p",
      text: "Your Personal Information may be disclosed in a number of circumstances including the following:",
    },
    {
      kind: "ul",
      items: [
        "Third parties where you consent to the use or disclosure; and",
        "Where required or authorised by law.",
      ],
    },
    { kind: "h2", text: "Security of Personal Information" },
    {
      kind: "p",
      text: "Your Personal Information is stored in a manner that reasonably protects it from misuse and loss and from unauthorised access, modification or disclosure.",
    },
    {
      kind: "p",
      text: "When your Personal Information is no longer needed for the purpose for which it was obtained, we will take reasonable steps to destroy or permanently de-identify your Personal Information. However, most of the Personal Information is or will be stored in client files which will be kept by us for a minimum of 7 years.",
    },
    { kind: "h2", text: "Access to your Personal Information" },
    {
      kind: "p",
      text: "You may access the Personal Information we hold about you and update and/or correct it, subject to certain exceptions. If you wish to access your Personal Information, please contact us in writing.",
    },
    {
      kind: "p",
      text: "We will not charge any fee for your access request, but may charge an administrative fee for providing a copy of your Personal Information.",
    },
    {
      kind: "p",
      text: "In order to protect your Personal Information we may require identification from you before releasing the requested information.",
    },
    {
      kind: "h2",
      text: "Maintaining the Quality of your Personal Information",
    },
    {
      kind: "p",
      text: "It is important to us that your Personal Information is up to date. We will take reasonable steps to make sure that your Personal Information is accurate, complete and up-to-date. If you find that the information we have is not up to date or is inaccurate, please advise us as soon as practicable so we can update our records and ensure we can continue to provide quality services to you.",
    },
    { kind: "h2", text: "Use of Cookies and Tracking Technologies" },
    {
      kind: "p",
      text: "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. These technologies include, but are not limited to, cookies from Google Ads, Google Analytics, Google Tag Manager, and Meta Pixel.",
    },
    { kind: "p", text: "Types of Cookies We Use:" },
    {
      kind: "ul",
      items: [
        "Google Ads: We use Google Ads cookies to deliver targeted advertisements and measure the performance of our advertising campaigns. These cookies help us understand how users interact with our ads and enhance the relevance of the ads shown to you.",
        "Google Analytics: We employ Google Analytics cookies to collect information about how you use our website. This data helps us analyse website traffic and improve our services. The information collected is aggregated and anonymised, ensuring it does not personally identify you.",
        "Google Tag Manager: Google Tag Manager cookies allow us to manage and deploy marketing tags (snippets of code or tracking pixels) on our website without modifying the code. This helps us streamline the deployment of various marketing services and improves the efficiency of our campaigns.",
        "Meta Pixel: We use Meta Pixel cookies to track user interactions on our website and measure the effectiveness of our advertising on Meta platforms (such as Facebook and Instagram). These cookies help us deliver ads that are relevant to your interests and measure ad performance.",
      ],
    },
    { kind: "h3", text: "Managing Cookies" },
    {
      kind: "p",
      text: "You can control the use of cookies at the individual browser level. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. If you choose to disable cookies, you may still use our website, but your ability to use some features or areas of our site may be limited.",
    },
    { kind: "h3", text: "Third-Party Cookies" },
    {
      kind: "p",
      text: "In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. These third-party cookies are used only for the purpose of enhancing your user experience and improving the Service.",
    },
    { kind: "h3", text: "Consent" },
    {
      kind: "p",
      text: "By using our website and services, you consent to the use of cookies and similar tracking technologies as described in this section of our Privacy Policy. You can withdraw your consent at any time by adjusting your browser settings or by contacting us directly.",
    },
    { kind: "h3", text: "Changes to This Section" },
    {
      kind: "p",
      text: "We may update this section of our Privacy Policy from time to time to reflect changes in our practices and services. Any changes will be posted on our website, and we encourage you to review this section periodically.",
    },
    {
      kind: "p",
      text: "If you have any questions or concerns about our use of cookies and tracking technologies, please contact us.",
    },
    { kind: "h2", text: "Policy Updates" },
    {
      kind: "p",
      text: "This Policy may change from time to time and is available on our website.",
    },
    { kind: "h2", text: "Privacy Policy Complaints and Enquiries" },
    {
      kind: "p",
      text: "If you have any queries or complaints about our Privacy Policy please contact us.",
    },
  ],
};

export const TERMS_AND_CONDITIONS: LegalDocument = {
  meta: {
    title: "Terms and Conditions | Horizon Health Care Partners",
    description:
      "Terms and Conditions for telehealth services, consultations, payments and patient responsibilities at Horizon Health Care Partners.",
    path: "/terms-and-conditions/",
  },
  heading: "Terms and Conditions",
  lastUpdated: "Last updated, Jul 2026",
  blocks: [
    { kind: "h2", text: "Introduction" },
    {
      kind: "p",
      text: "Welcome to Horizon Health Care Partners (“we,” “us,” “our”). By accessing and using our services, including our website and digital platforms (collectively referred to as the “Platform”), you agree to comply with these Terms & Conditions (“Terms”). If you do not agree with any part of these Terms, please refrain from using our Services.",
    },
    { kind: "h2", text: "Definitions" },
    {
      kind: "ul",
      items: [
        "Terms: These Terms & Conditions, along with our Privacy Policy and any other agreements you accept with us.",
        "Medicine: Any medication prescribed by a licensed healthcare practitioner.",
        "Pharmacy: A third-party pharmacy engaged to dispense and supply Medicine.",
        "Services: The healthcare and telehealth services provided by Horizon Health Care Partners.",
        "Clinic Services: Consultations and related services provided by our healthcare practitioners.",
        "Platform: Our website, digital media, and service platforms used to deliver our Services.",
        "Staff: Employees or contractors engaged to provide our Services.",
        "Healthcare Practitioners: Licensed medical professionals such as practitioners providing healthcare services.",
        "Fee: Charges for Clinic Services, as specified from time to time.",
        "Authorised Representative: An individual legally authorised to act on behalf of a patient.",
      ],
    },
    { kind: "h2", text: "Our Services" },
    { kind: "p", text: "Horizon Health Care Partners provides:" },
    {
      kind: "ul",
      items: [
        "Initial and follow-up consultations with qualified healthcare professionals.",
        "Access to telehealth services for medical assessments and prescriptions.",
        "Facilitation of prescription fulfillment through third-party pharmacies.",
      ],
    },
    {
      kind: "p",
      text: "Prescriptions are issued solely at the discretion of our Healthcare Practitioners, who assess each patient’s individual medical condition to determine the appropriateness of treatment. This process is conducted in strict adherence to Australian laws and regulations, including obtaining necessary approvals from the regulator and relevant state or territory health authorities, as required.",
    },
    { kind: "h2", text: "No Emergency Services" },
    {
      kind: "p",
      text: "Our services are not intended for use in medical emergencies or urgent situations.",
    },
    {
      kind: "p",
      text: "If you are experiencing a medical emergency — including, but not limited to, chest pain, difficulty breathing, severe bleeding, loss of consciousness, or thoughts of self-harm — you should immediately call 000 or attend your nearest emergency department.",
    },
    {
      kind: "p",
      text: "Horizon Health Care Partners Australia does not provide emergency or crisis management services and does not offer continuous patient monitoring.",
    },
    {
      kind: "p",
      text: "If, during an interaction, our practitioners or staff identify a potential immediate risk to your health or safety, we reserve the right to contact emergency services or relevant third parties where reasonably necessary.",
    },
    {
      kind: "p",
      text: "Our services are not a substitute for your regular general practitioner or primary healthcare provider. You are encouraged to maintain ongoing care with your usual healthcare providers for comprehensive and continuous medical management.",
    },
    {
      kind: "p",
      text: "We do not guarantee response times and communications may not be monitored continuously.",
    },
    { kind: "h2", text: "Eligibility" },
    {
      kind: "p",
      text: "To qualify for our treatment services, you must meet the following conditions:",
    },
    {
      kind: "ul",
      items: [
        "Age Requirement: You must be at least 18 years old.",
        "Residency Status: You must reside in Australia and possess a valid Australian residential address.",
        "Personal Use: You must utilise our services for yourself unless you are legally authorised to act on behalf of another individual. In such cases, appropriate legal documentation confirming your authority will be required.",
        "Consent to Treatment: You must provide informed consent for the proposed treatment plan, acknowledging the potential benefits and risks involved.",
      ],
    },
    {
      kind: "p",
      text: "Please note that meeting these eligibility criteria does not guarantee acceptance into our treatment program. Final decisions are made at the discretion of our healthcare practitioners, based on a comprehensive evaluation of your health status and in accordance with Australian medical standards.",
    },
    { kind: "h2", text: "Your Obligations and Responsibilities" },
    { kind: "p", text: "By using our Services, you agree to:" },
    {
      kind: "ul",
      items: [
        "Provide accurate, complete, and up-to-date medical and personal information.",
        "Attend scheduled consultations and notify us in advance if you are unable to do so.",
        "Authorise us to share necessary prescription details with pharmacies and other partners to facilitate your treatment.",
        "Comply with all applicable laws and regulations, including those related to the use of medicinal cannabis.",
        "Follow the prescribed treatment plans.",
        "Promptly report any adverse reactions to Medicine to us.",
      ],
    },
    { kind: "h2", text: "Accurate Information" },
    {
      kind: "p",
      text: "You are responsible for ensuring that all information you provide is accurate and up to date. Failure to do so may affect our ability to provide Services and may result in suspension or termination of your access to our Services.",
    },
    { kind: "h2", text: "Appropriate Use" },
    { kind: "p", text: "You agree not to:" },
    {
      kind: "ul",
      items: [
        "Engage in fraudulent or unlawful activity.",
        "Mislead or deceive our Staff, partners, or any other individuals or entities associated with our Services.",
        "Use language or engage in conduct that is abusive, threatening, harassing, discriminatory, or otherwise offensive towards our Staff, partners, suppliers, or other users.",
        "Attempt to access or interfere with our Platform’s security features or operations.",
      ],
    },
    { kind: "h2", text: "Authorised Representative" },
    {
      kind: "p",
      text: "You may designate an Authorised Representative to assist with managing your healthcare needs. Additional documentation may be required for this arrangement. To nominate an Authorised Representative, please contact us directly for the necessary forms and procedures.",
    },
    { kind: "h2", text: "Payment of Fees" },
    {
      kind: "p",
      text: "To ensure clarity and transparency regarding our fee structure, please review the following policies:",
    },
    {
      kind: "ul",
      items: [
        "Consultation Fees: All consultation fees are payable in full at the time of booking.",
        "These fees cover the consultation services provided by our healthcare practitioners and do not include the cost of any prescribed medications or their delivery.",
        "Medication and Delivery Costs: The cost of prescribed medications and their delivery are separate expenses.",
        "Arrangements for the purchase and delivery of medications should be made directly through the designated pharmacy.",
        "Refund Policy: Refunds for consultation fees are available under the following conditions: Appointment Cancellation by Clinic: If we cancel an appointment and are unable to reschedule it within a reasonable timeframe.",
        "Refunds will be processed in the original payment method within a reasonable timeframe.",
        "Cancellation and Rescheduling Policy: Patient-Initiated Cancellations: Cancellations made more than 48 hours before the scheduled appointment time will receive a full refund or the option to reschedule without penalty.",
        "Cancellations made within 48 hours of the scheduled appointment time may incur a cancellation fee equivalent to 50% of the consultation fee.",
        "No-Show Policy: Failure to attend a scheduled appointment without prior notice will result in the forfeiture of the full consultation fee.",
        "Late Arrivals for Telehealth Appointments:Punctuality is essential for the effective delivery of our telehealth services. If you join your telehealth appointment late, we will make reasonable efforts to accommodate you; however, the session may need to be shortened to conclude at the originally scheduled time, and the full consultation fee will still apply. If you are more than 15 minutes late, the appointment may be considered a no-show, necessitating rescheduling and the application of our no-show policy. To ensure a smooth experience, please log in to your telehealth session a few minutes before the scheduled start time to address any potential technical issues.",
      ],
    },
    {
      kind: "p",
      text: "By adhering to these payment policies, we aim to provide a fair and efficient service to all our patients. If you have any questions or require further clarification, please do not hesitate to contact our administrative team.",
    },
    { kind: "h2", text: "Termination of Services" },
    {
      kind: "p",
      text: "We reserve the right to suspend or terminate your access to our Services under the following circumstances:",
    },
    {
      kind: "ul",
      items: [
        "Breach of Terms: If you violate any provision of these Terms and fail to remedy the breach within five business days after receiving written notice from us.",
        "Unlawful or Prohibited Use: If you engage in activities that are fraudulent, illegal, or prohibited under these Terms, including but not limited to: Misrepresentation of personal information.",
        "Unauthorised use of our Platform or Services.",
        "Violation of applicable laws or regulations.",
        "Misuse of Services: If you misuse our Services in a manner that disrupts our operations or harms other users, including but not limited to: Attempting to interfere with the security or functionality of our Platform.",
        "Engaging in abusive or threatening behaviour towards our Staff, partners, or other users.",
        "Legal Requirements: If required to do so by law or in response to a valid legal process.",
      ],
    },
    {
      kind: "p",
      text: "Notice of Termination: In the event of suspension or termination, we will provide you with written notice outlining the reason(s) for such action and the effective date. Notice will be sent to the email address associated with your account.",
    },
    {
      kind: "p",
      text: "Effect of Termination: Upon termination of your access to our Services:",
    },
    {
      kind: "ul",
      items: [
        "All rights granted to you under these Terms will cease immediately.",
        "You must discontinue all use of our Services and Platform.",
        "Any outstanding fees or charges will become immediately due and payable.",
        "We reserve the right to delete or deactivate your account and all related information, subject to our data retention policies and applicable laws.",
      ],
    },
    {
      kind: "p",
      text: "Survival of Terms: Provisions of these Terms that, by their nature, should survive termination will remain in effect, including but not limited to:",
    },
    {
      kind: "ul",
      items: [
        "Payment obligations.",
        "Intellectual property rights.",
        "Limitation of liability.",
        "Indemnity clauses.",
      ],
    },
    { kind: "h2", text: "Intellectual Property" },
    {
      kind: "p",
      text: "All content available on our Platform, including but not limited to text, images, graphics, logos, videos, software, and digital materials (collectively referred to as “Content”), is the exclusive property of Horizon Health Care Partners or its licensors and is protected by Australian and international intellectual property laws. Prohibited Actions:",
    },
    {
      kind: "ul",
      items: [
        "You must not reproduce, distribute, modify, transmit, display, perform, publish, license, create derivative works from, or sell any Content without prior written consent from Horizon Health Care Partners.",
        "You must not use any Content for commercial purposes or public display without explicit permission.",
        "You must not remove or alter any copyright, trademark, or other proprietary notices from the Content.",
        "You must not use any automated tools or methods to access, acquire, copy, or monitor any portion of the Platform or Content.",
      ],
    },
    {
      kind: "p",
      text: "Trademarks: All trademarks, service marks, and logos displayed on the Platform are the property of Horizon Health Care Partners or their respective owners. Use of these marks without prior written consent is strictly prohibited.",
    },
    {
      kind: "p",
      text: "Third-Party Content: Our Platform may include content provided by third parties, including materials provided by other users, bloggers, and third-party licensors. All statements and opinions expressed in these materials, and all articles and responses to questions and other content, other than the Content provided by Horizon Health Care Partners, are solely the opinions and the responsibility of the person or entity providing those materials. These materials do not necessarily reflect the opinion of Horizon Health Care Partners. We are not responsible, or liable to you or any third party, for the content or accuracy of any materials provided by any third parties.",
    },
    {
      kind: "p",
      text: "Reporting Intellectual Property Infringements: If you believe that any Content on our Platform infringes upon your intellectual property rights, please contact us promptly with detailed information so that we can investigate and address the issue appropriately.",
    },
    { kind: "h2", text: "Privacy Policy" },
    {
      kind: "p",
      text: "Our Privacy Policy outlines how we collect, use, and protect your personal information. By using our Services, you consent to our data practices as detailed in our Privacy Policy.",
    },
    { kind: "h2", text: "Limitation of Liability & Indemnity" },
    {
      kind: "p",
      text: "We strive to provide reliable and high-quality Services; however, we cannot guarantee uninterrupted or error-free access to our Platform or Services. To the maximum extent permitted by Australian law, we exclude all liability for any loss or damage arising from your use of our Services, including but not limited to direct, indirect, incidental, consequential, or punitive damages.",
    },
    {
      kind: "p",
      text: "The information contained on the Platform is provided for general informational purposes only and is not intended nor implied to be a substitute for professional medical advice, diagnosis, or treatment. You should not rely on any information provided on the Platform for your health needs. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on the Platform.",
    },
    {
      kind: "p",
      text: "Except for information provided by our Healthcare Practitioners during consultations, nothing contained on the Platform or provided by our Services is intended to be or should be taken for medical advice, diagnosis, or treatment. You take full and total responsibility for what you do with this information, and any resulting outcomes from your actions.",
    },
    {
      kind: "p",
      text: "You agree to indemnify, defend, and hold harmless Horizon Health Care Partners, its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, liabilities, costs, or expenses (including reasonable legal fees) arising from:",
    },
    {
      kind: "ul",
      items: [
        "Your misuse of our Services or Platform.",
        "Your breach of these Terms.",
        "Your violation of any applicable laws or regulations.",
      ],
    },
    {
      kind: "p",
      text: "This indemnification obligation will survive the termination or expiration of your account and/or these Terms.",
    },
    { kind: "h2", text: "Amendments to Terms and Conditions" },
    {
      kind: "p",
      text: "We reserve the right to amend these Terms and Conditions at any time. All amendments will become effective upon publication on our Platform or upon notification to you through other appropriate means. We will strive to notify you of any significant changes to these Terms by providing notice through our Platform, via email, or other reasonable methods. It is your responsibility to review the Terms regularly to stay informed of any changes. By continuing to access or use our Services after any amendments become effective, you agree to be bound by the updated Terms. If you do not agree to the amended Terms, you must discontinue your use of our Services immediately.",
    },
    { kind: "h2", text: "Governing Law" },
    {
      kind: "p",
      text: "These Terms are governed by and construed in accordance with the laws of the State of New South Wales, Australia. Any disputes arising from or in connection with these Terms or the use of our Services will be subject to the exclusive jurisdiction of the courts of New South Wales, Australia. By using our Services, you irrevocably submit to the jurisdiction of these courts.",
    },
    { kind: "h2", text: "Severability" },
    {
      kind: "p",
      text: "If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision will be deemed severed from these Terms, and the remaining provisions will continue in full force and effect. The invalidity of any provision will not affect the validity of the remaining provisions, which will remain binding and enforceable.",
    },
    { kind: "h2", text: "Entire Agreement" },
    {
      kind: "p",
      text: "These Terms, together with our Privacy Policy and any other documents expressly incorporated by reference, constitute the entire agreement between you and Horizon Health Care Partners regarding your use of our Services. This agreement supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding such subject matter. You acknowledge that you have not relied on any statement, representation, or warranty not expressly set out in these Terms.",
    },
    {
      kind: "p",
      text: "By using our Services, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.",
    },
  ],
};
