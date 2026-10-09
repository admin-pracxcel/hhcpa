/**
 * `/quiz-book/` — where a green or amber submission lands.
 *
 * Green and amber share this page because the patient's experience of them is
 * identical: both book. The difference between the two is an email to the
 * clinic so a practitioner reviews the amber answers, which is an n8n branch on
 * the `outcome` already in the payload — the site does nothing differently.
 * Two pages that render the same thing would be two pages to keep in step.
 *
 * It renders one of two things, and the phone block is the default.
 *
 *   checkout  the live products for the service the patient chose, each a
 *             link into Ranjeeta's portal
 *   phone     a number that answers seven days a week
 *
 * ─── WHEN THE PHONE BLOCK SHOWS ────────────────────────────────────────────
 *
 *   - amber. The patient flagged conditions or current medications for a
 *     practitioner to look at, so a person decides what they book, not a
 *     checkout. (Red never arrives here; it goes to /quiz-thank-you/.)
 *   - a service with no connected calendar — six of the eight today
 *   - a referral request: all three referral products exist in her catalogue
 *     and none is bookable yet
 *   - no handoff at all: arrived directly, reloaded late, private browsing,
 *     or a record this cannot vouch for
 *
 * That list is the point rather than an afterthought. A patient who has just
 * been told they can book must not reach a dead end, and a checkout that
 * cannot complete is worse than a number that can.
 *
 * ⚠️ Payment comes before scheduling in her portal, which is the reverse of
 * what most people expect. The line above the buttons says so. Do not remove
 * it: someone who thinks they are picking a time and is asked for a card has
 * been surprised by their own clinic.
 */

"use client";

import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";
import { CLINIC } from "@/content/clinic";
import {
  parseBookingHandoff,
  readBookingHandoffRaw,
} from "@/lib/booking-handoff";
import {
  checkoutUrl,
  productsFor,
  type CheckoutProduct,
} from "@/lib/checkout-products";

const STYLES = `
.hhcp-bk-section {
  /* Clears the fixed header, the allowance ServiceHero makes. */
  padding: calc(var(--hhcp-section-space-m) + 122px) var(--hhcp-gutter)
    var(--hhcp-section-space-m);
  background-color: var(--hhcp-accent, #f5fff9);
}

@media (max-width: 991px) {
  .hhcp-bk-section {
    padding-top: calc(var(--hhcp-section-space-m) + 108px);
  }
}

.hhcp-bk-container {
  max-width: 715px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: var(--hhcp-space-l, 45px);
}

.hhcp-bk-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--hhcp-space-s, 20px);
  text-align: center;
}

.hhcp-bk-tick {
  width: 48px;
  height: 48px;
  flex: none;
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-bk-heading {
  font-size: var(--hhcp-h3);
  line-height: var(--hhcp-heading-lh);
  font-weight: 400;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
}

.hhcp-bk-body {
  font-size: var(--hhcp-text-m, 16px);
  line-height: var(--hhcp-text-lh, 1.5);
  color: rgba(1, 49, 38, 0.8);
}

/*
 * The phone block. It was a dashed placeholder standing in for a booking
 * widget; it is now a real route to a booking, so it is drawn as one — solid
 * border, no "placeholder" label. For most services today this is the whole
 * offer, and it should not look like something unfinished.
 */
.hhcp-bk-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--hhcp-space-s, 20px);
  padding: var(--hhcp-section-space-xs) var(--hhcp-space-l);
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #d6e8e1;
  text-align: center;
}

.hhcp-bk-slot-text {
  max-width: 46ch;
  font-size: var(--hhcp-text-m, 16px);
  line-height: var(--hhcp-text-lh, 1.5);
  color: rgba(1, 49, 38, 0.8);
}

.hhcp-bk-phone {
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: -0.42px;
  color: var(--hhcp-primary, #013126);
  text-decoration: none;
}

.hhcp-bk-phone:hover {
  color: var(--hhcp-action-dark, #0c7340);
}

.hhcp-bk-hours {
  font-size: 14px;
  line-height: 1.6;
  color: #526f68;
}

.hhcp-bk-order {
  font-size: var(--hhcp-text-m, 16px);
  line-height: 1.6;
  text-align: center;
  color: var(--hhcp-primary, #013126);
  font-weight: 600;
}

.hhcp-bk-products {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: var(--hhcp-space-s, 20px);
}

.hhcp-bk-product {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid #d6e8e1;
  border-radius: 10px;
  background: #ffffff;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.15s linear,
    background-color 0.15s linear;
}

.hhcp-bk-product:hover {
  border-color: var(--hhcp-primary, #013126);
  background: #f4fffa;
}

.hhcp-bk-product:focus-visible {
  outline: 2px solid var(--hhcp-action-dark, #0c7340);
  outline-offset: 2px;
}

/* Block, or the note sits on the same line and its margin does nothing. */
.hhcp-bk-product-label {
  display: block;
  font-size: var(--hhcp-text-m, 16px);
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
}

.hhcp-bk-product-note {
  display: block;
  margin-top: 2px;
  font-size: 14px;
  line-height: 1.4;
  color: #526f68;
}

.hhcp-bk-product-price {
  font-family: var(--font-roboto-mono-local), ui-monospace, monospace;
  font-size: var(--hhcp-text-m, 16px);
  font-weight: 500;
  color: var(--hhcp-primary, #013126);
}

/*
 * The price and the chevron, kept together on the right.
 *
 * The chevron is not decoration. Without it the four rows read as a price
 * list, and this is the step where a patient pays — what is tappable has to
 * look tappable before they will tap it.
 */
.hhcp-bk-product-go {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: none;
}

.hhcp-bk-product-chev {
  width: 18px;
  height: 18px;
  flex: none;
  color: var(--hhcp-action-dark, #0c7340);
  transition: transform 0.15s linear;
}

.hhcp-bk-product:hover .hhcp-bk-product-chev {
  transform: translateX(3px);
}

@media (prefers-reduced-motion: reduce) {
  .hhcp-bk-product-chev {
    transition: none;
  }
  .hhcp-bk-product:hover .hhcp-bk-product-chev {
    transform: none;
  }
}

/* The row stays a row. Stacking the price under the label reads as a list
   again, which is the thing the chevron is there to prevent. */
@media (max-width: 478px) {
  .hhcp-bk-product {
    padding: 16px;
    gap: 12px;
  }
}

.hhcp-bk-note {
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  color: #526f68;
}
`;

/* Nothing to subscribe to: the record is written before this page mounts and
   never changes while it is open. */
const subscribe = () => () => {};
const serverSnapshot = (): string | null => null;

/**
 * The analytics event, fired before navigation rather than after.
 *
 * ⚠️ Service, ref and price only. No triage level and no contact details: the
 * dataLayer is read by whatever tag manager is installed later, and a
 * patient's clinical outcome must not be sitting in it.
 */
function trackCheckout(service: string, product: CheckoutProduct): void {
  try {
    const layer = (window as unknown as {
      dataLayer?: unknown[];
    }).dataLayer;
    if (Array.isArray(layer)) {
      layer.push({
        event: "checkout_start",
        service,
        ref: product.ref,
        price: product.price,
      });
    }
  } catch {
    /* Never let a tracking failure stand between a patient and a booking. */
  }
}

/** "$24.90", "$99" — cents only where there are cents. */
const money = (amount: number) =>
  Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;

export function BookingPanel({ className }: { className?: string }) {
  const raw = useSyncExternalStore(
    subscribe,
    readBookingHandoffRaw,
    serverSnapshot,
  );
  const handoff = parseBookingHandoff(raw);

  /*
   * Green only. Amber reaches this page — it is offered a booking — but the
   * booking it is offered is a phone call, because something in the answers
   * wants a practitioner's eye before a time is held.
   */
  const products =
    handoff !== null && handoff.level === "green"
      ? productsFor({
          service: handoff.service,
          onlineDoctorKind: handoff.onlineDoctorKind,
          prescriptionFee: handoff.prescriptionFee,
        })
      : [];

  return (
    <section className={cn("hhcp-bk-section", className)}>
      <style>{STYLES}</style>
      <div className="hhcp-bk-container">
        <div className="hhcp-bk-head">
          <svg
            className="hhcp-bk-tick"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12.5 2.5 2.5L16 9.5" strokeLinecap="round" />
          </svg>

          <h1 className="hhcp-bk-heading font-dm-sans">
            Thanks, we’ve got your details
          </h1>
          <p className="hhcp-bk-body font-dm-sans">
            Your pre-screening answers have been received. You can book your
            consultation with an AHPRA-registered practitioner now.
          </p>
        </div>

        {products.length > 0 ? (
          <div>
            {/* Her portal takes payment first. See the header. */}
            <p className="hhcp-bk-order font-dm-sans">
              Payment is taken first, then you choose your appointment time
              with your practitioner.
            </p>
            <div className="hhcp-bk-products">
              {products.map((product) => (
                /*
                  Same tab. A checkout opened in a new one loses the patient
                  the back button, and on a phone it is a second window they
                  did not ask for.
                */
                <a
                  key={product.ref}
                  className="hhcp-bk-product"
                  href={checkoutUrl(product)}
                  rel="noopener"
                  onClick={() => trackCheckout(handoff?.service ?? "", product)}
                >
                  <span>
                    <span className="hhcp-bk-product-label font-dm-sans">
                      {product.label}
                    </span>
                    {product.note !== undefined && (
                      <span className="hhcp-bk-product-note font-dm-sans">
                        {product.note}
                      </span>
                    )}
                  </span>
                  <span className="hhcp-bk-product-go">
                    <span className="hhcp-bk-product-price">
                      {money(product.price)}
                    </span>
                    <svg
                      className="hhcp-bk-product-chev"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path
                        d="m9 5 7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="hhcp-bk-slot">
            <p className="hhcp-bk-slot-text font-dm-sans">
              Call our team and we will match you with the right practitioner
              and find you a time.
            </p>
            <a className="hhcp-bk-phone font-dm-sans" href={CLINIC.phoneHref}>
              {CLINIC.phone}
            </a>
            <p className="hhcp-bk-hours font-dm-sans">{CLINIC.hours}</p>
          </div>
        )}

        <p className="hhcp-bk-note font-dm-sans">
          Nothing has been prescribed from this quiz. Any care plan comes from
          your consultation. If your enquiry is urgent, please call 000 or
          contact your GP.
        </p>
      </div>
    </section>
  );
}
