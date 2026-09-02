/**
 * "Who it may suit" — an eligibility list with its counterweight.
 *
 * The caveat is a callout rather than a fifth bullet on purpose. Every item in
 * the list is a reason to book; the caveat is the reason not to, and the source
 * copy gives it its own paragraph. Rendering it as one more tick would read as
 * another qualifier for treatment, which is the opposite of what it says, and
 * the sort of thing clause 6.5 exists to prevent.
 */

import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "../sites/www-horizonhealthcarepartners-com-au-b25b358e/shared/icons";

const STYLES = `
.hhcp-ck-section {
  padding: var(--hhcp-section-space-m) var(--hhcp-gutter);
}

.hhcp-ck-container {
  padding-inline: 0;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-ck-heading {
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-s, 20px);
  padding-bottom: var(--hhcp-space-l, 45px);
  border-bottom: 1px solid #ececec;
}

.hhcp-ck-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hhcp-ck-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hhcp-action, #58eda2);
  flex: none;
}

.hhcp-ck-eyebrow-label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.36px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ck-title {
  font-size: var(--hhcp-h2, 42px);
  line-height: var(--hhcp-heading-lh, 46.336px);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ck-intro {
  max-width: 620px;
  font-size: var(--hhcp-text-s, 16px);
  line-height: 24px;
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-ck-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--hhcp-space-m, 30px);
  list-style: none;
  margin: 0;
  padding: 0;
}

.hhcp-ck-row {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.hhcp-ck-row-icon {
  flex: none;
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-ck-row-text {
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.5;
  color: var(--hhcp-primary, #013126);
}

.hhcp-ck-caveat {
  padding: var(--hhcp-space-m, 30px);
  border-radius: 12px;
  background: var(--hhcp-cream, #ede9e3);
  font-size: var(--hhcp-text-s, 16px);
  line-height: 1.5;
  color: var(--hhcp-primary, #013126);
}

@media (max-width: 767px) {
  .hhcp-ck-list {
    grid-template-columns: 1fr;
    gap: var(--hhcp-space-s, 20px);
  }
}
`;

interface ChecklistSectionProps {
  className?: string;
  eyebrow: string;
  heading: string;
  intro: string;
  items: readonly string[];
  caveat: string;
}

export function ChecklistSection({
  className,
  eyebrow,
  heading,
  intro,
  items,
  caveat,
}: ChecklistSectionProps) {
  return (
    <section className={cn("hhcp-ck-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-container hhcp-ck-container">
        <div className="hhcp-ck-heading">
          <div className="hhcp-ck-eyebrow">
            <span className="hhcp-ck-dot" />
            <span className="hhcp-ck-eyebrow-label font-roboto-mono">
              {eyebrow}
            </span>
          </div>
          <h2 className="hhcp-ck-title font-dm-sans">{heading}</h2>
          <p className="hhcp-ck-intro font-dm-sans">{intro}</p>
        </div>

        <ul className="hhcp-ck-list">
          {items.map((item) => (
            <li key={item} className="hhcp-ck-row">
              <CheckCircleIcon
                className="hhcp-ck-row-icon"
                width={24}
                height={25}
              />
              <span className="hhcp-ck-row-text font-dm-sans">{item}</span>
            </li>
          ))}
        </ul>

        <p className="hhcp-ck-caveat font-dm-sans">{caveat}</p>
      </div>
    </section>
  );
}
