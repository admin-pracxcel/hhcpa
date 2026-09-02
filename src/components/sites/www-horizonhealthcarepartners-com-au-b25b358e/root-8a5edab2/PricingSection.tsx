/**
 * "Our fees" pricing section for https://www.horizonhealthcarepartners.com.au/
 *
 * Structure mirrors the source markup:
 *   section                      — --hhcp-section-space-m block / --hhcp-gutter inline
 *     └─ .hhcp-container         — global 1340px wrapper, inline padding zeroed
 *          ├─ .heading           — eyebrow + h2, 45px bottom padding over a hairline
 *          └─ .grid              — 3 → 2 → 1 columns at 1199px / 991px
 *               └─ article × 3   — pill, price, divider, feature list, CTA
 *
 * Breakpoints 1199 / 991 are the target's own (Bricks defaults), not Tailwind's,
 * so the responsive rules live in the scoped <style> block rather than in
 * utility classes. Server component: hover is pure CSS, so no client boundary.
 *
 * The two CTA variants are the source's `bricks-button` styles verbatim —
 * including `letter-spacing: normal`, which the theme's 0.36px rule loses to
 * downstream, and the different transition timings on each variant.
 */

import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "../shared/icons";

const QUIZ_HREF = "https://www.horizonhealthcarepartners.com.au/quiz/";
const DISCHARGE_HREF = "https://www.horizonhealthcarepartners.com.au/discharge/";

export interface PricingPlan {
  /** White chip above the price. */
  label: string;
  price: string;
  caption: string;
  features: readonly string[];
  cta: { text: string; href: string };
  /** Cards 1 and 3 are light-green with a mint CTA; card 2 is accent + dark CTA. */
  variant: "mint" | "dark";
}

const PLANS: readonly PricingPlan[] = [
  {
    label: "First Medical Consultation",
    price: "$69",
    caption: "Start your health journey",
    features: [
      "Consult with AHPRA-registered practitioner",
      "Review of your medical history and current treatments",
      "Discussion of suitable treatment options",
    ],
    cta: { text: "Get Started", href: QUIZ_HREF },
    variant: "mint",
  },
  {
    label: "Follow-Up Consultation",
    price: "$59",
    caption: "Continued medical guidance",
    features: [
      "Ongoing care with your dedicated practitioner",
      "Progress review and plan adjustments",
      "Renewals and medication management",
    ],
    cta: { text: "Book Appointment", href: QUIZ_HREF },
    variant: "dark",
  },
  {
    label: "Transfer Consultation",
    price: "$59",
    caption: "Seamless care transition",
    features: [
      "Quick onboarding",
      "Review of current treatment and medical records",
      "Continuity of care with no disruption",
    ],
    cta: { text: "Transfer Your Care", href: DISCHARGE_HREF },
    variant: "mint",
  },
] as const;

const EYEBROW = "Our Fees";
const HEADING = "Our fees - Holistic Care/Alternative Therapy";

const STYLES = `
.hhcp-pr-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

/* The section supplies the gutter, so the shared container must not add its own. */
.hhcp-pr-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-pr-heading {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-pr-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hhcp-pr-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-pr-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pr-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pr-footnote {
  font-size: var(--hhcp-text-s, 16px);
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-pr-footnote-link {
  color: var(--hhcp-primary, #013126);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: all 0.3s linear;
}

.hhcp-pr-footnote-link:hover {
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-pr-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.hhcp-pr-card {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
  padding: 30px;
  border-radius: 10px;
}

.hhcp-pr-card--mint {
  background-color: var(--hhcp-light-green, #ddffeb);
}

.hhcp-pr-card--dark {
  background-color: var(--hhcp-accent, #f5fff9);
}

/* flex:1 pins every CTA to the bottom of its card regardless of list length. */
.hhcp-pr-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-pr-head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--hhcp-space-s, 20px);
}

/* align-self keeps the chip hugging its text inside the flex-start column. */
.hhcp-pr-pill {
  align-self: flex-start;
  padding: 13.3px;
  border-radius: 8px;
  background-color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-pr-price-group {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.hhcp-pr-price {
  font-size: var(--hhcp-h1, 64px);
  line-height: var(--hhcp-heading-lh, 68.512px);
  font-weight: 400;
  letter-spacing: -0.6px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pr-caption {
  font-size: 16px;
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-pr-divider {
  width: 100%;
  height: 1px;
  border-top: 1px solid rgba(57, 68, 43, 0.2);
}

.hhcp-pr-list {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  list-style: none;
  padding: 0;
  margin: 0;
}

.hhcp-pr-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
}

.hhcp-pr-row-icon {
  flex: none;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-pr-row-text {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-pr-cta {
  width: 100%;
  padding: 12.132px 19.2px;
  border-radius: 800px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: normal;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hhcp-pr-cta--mint {
  background-color: var(--hhcp-action, #58eda2);
  border: 1px solid var(--hhcp-action, #58eda2);
  color: var(--hhcp-primary, #013126);
  line-height: 28px;
  transition: all 0.4s ease;
}

.hhcp-pr-cta--mint:hover {
  background-color: var(--hhcp-primary, #013126);
  border-color: var(--hhcp-primary, #013126);
  color: #ffffff;
}

.hhcp-pr-cta--dark {
  min-height: 52px;
  background-color: var(--hhcp-primary, #013126);
  border: 1px solid var(--hhcp-primary, #013126);
  color: #e6fef9;
  line-height: 12px;
  transition: all 0.3s linear;
}

.hhcp-pr-cta--dark:hover {
  box-shadow: 5px 5px 25px 0 rgba(33, 33, 33, 0.1);
}

@media (max-width: 1199px) {
  .hhcp-pr-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hhcp-pr-card {
    padding: 45px 20px;
  }
}

@media (max-width: 991px) {
  .hhcp-pr-grid {
    grid-template-columns: 1fr;
  }
}
`;

interface PricingSectionProps {
  className?: string;
  eyebrow?: string;
  heading?: string;
  plans?: readonly PricingPlan[];
  /** Small print under the grid. The cloned homepage has none. */
  footnote?: string;
  footnoteCta?: { label: string; href: string };
}

export function PricingSection({
  className,
  eyebrow = EYEBROW,
  heading = HEADING,
  plans = PLANS,
  footnote,
  footnoteCta,
}: PricingSectionProps) {
  return (
    <section className={cn("hhcp-pr-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-pr-container">
        <div className="hhcp-pr-heading">
          <div className="hhcp-pr-eyebrow">
            <span className="hhcp-pr-dot" />
            <span className="hhcp-pr-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>
          <h2 className="hhcp-pr-title font-dm-sans">{heading}</h2>
        </div>

        <div className="hhcp-pr-grid">
          {plans.map((plan) => (
            <article
              key={plan.label}
              className={cn("hhcp-pr-card", `hhcp-pr-card--${plan.variant}`)}
            >
              <div className="hhcp-pr-body">
                <div className="hhcp-pr-head">
                  <p className="hhcp-pr-pill font-roboto-mono">{plan.label}</p>
                  <div className="hhcp-pr-price-group">
                    <h3 className="hhcp-pr-price font-dm-sans">{plan.price}</h3>
                    <p className="hhcp-pr-caption font-dm-sans">
                      {plan.caption}
                    </p>
                  </div>
                </div>

                <div className="hhcp-pr-divider" />

                <ul className="hhcp-pr-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <div className="hhcp-pr-row">
                        <CheckCircleIcon
                          className="hhcp-pr-row-icon"
                          width={24}
                          height={25}
                        />
                        <span className="hhcp-pr-row-text font-dm-sans">
                          {feature}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                className={cn("hhcp-pr-cta", `hhcp-pr-cta--${plan.variant}`, "font-roboto-mono")}
                href={plan.cta.href}
              >
                {plan.cta.text}
              </a>
            </article>
          ))}
        </div>

        {footnote !== undefined && (
          <p className="hhcp-pr-footnote font-dm-sans">
            {footnote}
            {footnoteCta !== undefined && (
              <>
                {" "}
                <a className="hhcp-pr-footnote-link" href={footnoteCta.href}>
                  {footnoteCta.label}
                </a>
              </>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
