/**
 * The core consultation fees on `/pricing/`, as cards.
 *
 * The three consultations render in the homepage's pricing cards — literally
 * that component, not a copy of it — so the canonical price list and the
 * homepage cannot show the same three consultations two different ways. The
 * plan copy comes from `consultation-plans.ts`, which both pages read.
 *
 * The pre-screening quiz sits above them in a band of its own, full width.
 * It belongs on this list — it is the first thing a patient pays nothing for —
 * but it is not a consultation, and a fourth column beside the three would say
 * that it was. The band also lets the one free item on the page say so in
 * words rather than as a "$0" in a column of dollar amounts.
 */

import { cn } from "@/lib/utils";
import { formatPrice } from "@/content/pricing";
import type { PriceKey } from "@/content/pricing";
import type { ConsultationPlan } from "@/content/consultation-plans";
import { PricingSection } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/root-8a5edab2/PricingSection";

const STYLES = `
.hhcp-pc-feature {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--hhcp-space-m, 24px);
  padding: var(--hhcp-space-m, 24px) var(--hhcp-space-l, 45px);
  border-radius: var(--hhcp-radius-m, 10px);
  background: var(--hhcp-accent, #f5fff9);
  border: 1px solid #d6e8e1;
}

.hhcp-pc-feature-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* Takes the slack so the CTA stays hard right until the row wraps. */
  flex: 1 1 420px;
}

.hhcp-pc-feature-top {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.hhcp-pc-feature-title {
  font-size: 24px;
  line-height: 1.3;
  letter-spacing: -0.6px;
  font-weight: 400;
  color: var(--hhcp-primary, #013126);
}

.hhcp-pc-feature-price {
  padding: 6px 12px;
  border-radius: var(--hhcp-radius-pill, 100px);
  background: var(--hhcp-action, #58eda2);
  font-size: 12px;
  line-height: 1;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
  white-space: nowrap;
}

.hhcp-pc-feature-body {
  font-size: 14px;
  line-height: 1.6;
  color: #526f68;
}

@media (max-width: 767px) {
  .hhcp-pc-feature {
    padding: var(--hhcp-space-m, 24px);
  }
  .hhcp-pc-feature-title {
    font-size: 20px;
  }
}
`;

export interface PriceFeature {
  /** Reads its amount from pricing.ts like every other figure on the page. */
  readonly key: PriceKey;
  readonly title: string;
  readonly body: string;
  readonly cta: { readonly label: string; readonly href: string };
}

interface PriceCardsProps {
  className?: string;
  eyebrow: string;
  heading: string;
  feature: PriceFeature;
  plans: readonly ConsultationPlan[];
  footnote?: string;
}

export function PriceCards({
  className,
  eyebrow,
  heading,
  feature,
  plans,
  footnote,
}: PriceCardsProps) {
  return (
    <>
      <style>{STYLES}</style>
      <PricingSection
        className={cn(className)}
        eyebrow={eyebrow}
        heading={heading}
        plans={plans}
        footnote={footnote}
        feature={
          <div className="hhcp-pc-feature">
            <div className="hhcp-pc-feature-text">
              <div className="hhcp-pc-feature-top">
                <h3 className="hhcp-pc-feature-title font-dm-sans">
                  {feature.title}
                </h3>
                <span className="hhcp-pc-feature-price font-roboto-mono">
                  {formatPrice(feature.key)}
                </span>
              </div>
              <p className="hhcp-pc-feature-body font-dm-sans">
                {feature.body}
              </p>
            </div>
            <a className="hhcp-btn" href={feature.cta.href}>
              {feature.cta.label}
            </a>
          </div>
        }
      />
    </>
  );
}
