import { useState } from 'react';
import { CheckCircle2, CreditCard, Wallet, Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import { orderPerks, paymentMethods, discount, TAX_RATE } from '../../data/cart.js';

const PAYMENT_ICONS = {
  credit_card: CreditCard,
  account_balance_wallet: Wallet,
  account_balance: Building2,
};

/**
 * Sticky order summary panel for the Checkout page.
 * Receives the live cart items array and recomputes totals dynamically.
 * `onSubmit` is called when the CTA button is clicked.
 */
function OrderSummary({ items, onSubmit, isSubmitting, selectedPayment, onPaymentChange }) {
  const [localSelectedPayment, setLocalSelectedPayment] = useState('card');
  const activePayment = selectedPayment ?? localSelectedPayment;

  // ── Live total calculations ──
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = subtotal * discount.rate;
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * TAX_RATE;
  const total = discountedSubtotal + tax;

  const hasItems = items.length > 0;

  return (
    <aside
      className="lg:sticky flex flex-col gap-stack-md"
      style={{ top: '100px' }}
      aria-label="Order summary"
    >
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-stack-md md:p-stack-lg shadow-xl">

        {/* ── Title ── */}
        <h2 className="font-title-lg text-title-lg text-on-surface mb-stack-md">Order Summary</h2>

        {/* ── Pricing Breakdown ── */}
        <div className="flex flex-col gap-stack-sm border-b border-outline-variant/20 pb-stack-md">
          <div className="flex justify-between text-on-surface-variant">
            <span className="font-body-md text-body-md">Subtotal</span>
            <span className="font-body-md text-body-md">₹{subtotal.toFixed(2)}</span>
          </div>

          {hasItems && discountAmount > 0 && (
            <div className="flex justify-between text-secondary">
              <span className="font-body-md text-body-md">{discount.label}</span>
              <span className="font-body-md text-body-md font-semibold">-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-on-surface-variant">
            <span className="font-body-md text-body-md">Taxes (Estimated)</span>
            <span className="font-body-md text-body-md">₹{tax.toFixed(2)}</span>
          </div>
        </div>

        {/* ── Total Due ── */}
        <div className="flex justify-between items-center py-stack-md border-b border-outline-variant/20">
          <span className="font-headline-sm text-headline-sm text-on-surface">Total Due</span>
          <span className="font-headline-sm text-headline-sm text-primary">
            ₹{total.toFixed(2)}
          </span>
        </div>

        {/* ── Purchase Perks ── */}
        <ul className="flex flex-col gap-3 py-stack-md" aria-label="What's included">
          {orderPerks.map((perk) => (
            <li key={perk.id} className="flex items-center gap-3 text-on-surface-variant font-label-md text-label-md">
              <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 fill-secondary/20" />
              {perk.label}
            </li>
          ))}
        </ul>

        {/* ── Payment Method Chips ── */}
        <div className="py-stack-md border-t border-outline-variant/20">
          <p className="font-label-md text-label-md text-on-surface-variant mb-3 uppercase tracking-widest">
            Preferred Payment
          </p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Payment method">
            {paymentMethods.map((method) => {
              const Icon = PAYMENT_ICONS[method.icon] || CreditCard;
               const isActive = activePayment === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => {
                    setLocalSelectedPayment(method.id);
                    onPaymentChange?.(method.id);
                  }}
                  className={`px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-2 transition-all duration-200 ${
                    activePayment === method.id
                      ? 'border-2 border-secondary bg-secondary/5 text-secondary'
                      : 'border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {method.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CTA Button ── */}
        <button
          type="button"
          disabled={!hasItems || isSubmitting}
          onClick={onSubmit}
          className="w-full bg-primary text-on-primary py-4 rounded-xl font-title-lg text-title-lg hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {isSubmitting ? 'Processing…' : 'Get Instant Access'}
          {!isSubmitting && <ArrowRight className="w-5 h-5" />}
        </button>

        {/* ── Trust Footer ── */}
        <div className="mt-6 pt-6 border-t border-outline-variant/20 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 opacity-50">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Razorpay Secure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">SSL Protected</span>
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant text-center uppercase tracking-widest font-bold">
            Trusted by Thousands of Legal Professionals
          </p>
        </div>
      </div>
    </aside>
  );
}

export default OrderSummary;
