import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, CreditCard, Smartphone, Banknote, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CustomerDetails } from '../types/ecommerce';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    settings,
    formatPrice,
    createOrder,
    appliedPromo,
  } = useStore();

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: 'Julian Mercer',
    email: 'julian.mercer@atelier.com',
    phone: '+1 (415) 392-1829',
    address: '420 Montgomery Street, Suite 500',
    city: 'San Francisco',
    postalCode: '94104',
    country: 'United States',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'Card' | 'ApplePay' | 'COD'>('Card');

  // Simulated Card State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('384');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen || cart.length === 0) return null;

  const threshold = settings.freeShippingThreshold;
  const isFreeStandard = cartSubtotal >= threshold || appliedPromo?.code === 'FREESHIP';
  
  const shippingFee = shippingMethod === 'standard'
    ? (isFreeStandard ? 0 : settings.standardShippingRate)
    : settings.expressShippingRate;

  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const tax = Number(((taxableAmount * settings.taxRate) / 100).toFixed(2));
  const orderTotal = Number((taxableAmount + tax + shippingFee).toFixed(2));

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      createOrder({
        items: cart,
        subtotal: cartSubtotal,
        discount: discountAmount,
        tax,
        shippingFee,
        total: orderTotal,
        customer,
        paymentMethod,
      });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/50">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <h2 className="font-serif text-lg sm:text-xl font-semibold text-stone-900 dark:text-stone-100">
              Secure Checkout · {settings.storeName}
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Section 1: Customer Contact */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold mb-3">
                  1. Contact & Recipient Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customer.fullName}
                      onChange={e => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={e => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">Telephone Contact</label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Address */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold mb-3">
                  2. Shipping Destination
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-3">
                    <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={customer.address}
                      onChange={e => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={e => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={customer.postalCode}
                      onChange={e => setCustomer({ ...customer, postalCode: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">Country</label>
                    <select
                      value={customer.country}
                      onChange={e => setCustomer({ ...customer, country: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none focus:ring-1 focus:ring-stone-900"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Delivery Speed */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold mb-3">
                  3. Delivery Service
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      shippingMethod === 'standard'
                        ? 'border-stone-900 bg-stone-50 dark:border-stone-100 dark:bg-stone-800'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="mt-0.5 text-stone-900"
                      />
                      <div>
                        <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                          Standard Carbon-Neutral
                        </span>
                        <span className="text-stone-500 dark:text-stone-400">3–5 business days</span>
                      </div>
                    </div>
                    <span className="font-mono font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                      {isFreeStandard ? 'Free' : formatPrice(settings.standardShippingRate)}
                    </span>
                  </label>

                  <label
                    className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      shippingMethod === 'express'
                        ? 'border-stone-900 bg-stone-50 dark:border-stone-100 dark:bg-stone-800'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="mt-0.5 text-stone-900"
                      />
                      <div>
                        <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                          Express Air Courier
                        </span>
                        <span className="text-stone-500 dark:text-stone-400">1–2 business days</span>
                      </div>
                    </div>
                    <span className="font-mono font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                      {formatPrice(settings.expressShippingRate)}
                    </span>
                  </label>
                </div>
              </div>

              {/* Section 4: Payment Method */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold mb-3">
                  4. Payment Method
                </h3>
                
                <div className="grid grid-cols-3 gap-2.5 mb-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`py-2.5 px-3 rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'Card'
                        ? 'border-stone-900 bg-stone-900 text-stone-100 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ApplePay')}
                    className={`py-2.5 px-3 rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'ApplePay'
                        ? 'border-stone-900 bg-stone-900 text-stone-100 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Pay / Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`py-2.5 px-3 rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'COD'
                        ? 'border-stone-900 bg-stone-900 text-stone-100 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>COD</span>
                  </button>
                </div>

                {paymentMethod === 'Card' && (
                  <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded font-mono text-xs outline-none"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">Expiration</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded font-mono text-xs outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">CVC Code</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded font-mono text-xs outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'ApplePay' && (
                  <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300">
                    <p className="font-semibold text-stone-900 dark:text-stone-100 mb-1">Express Biometric Authentication</p>
                    <p>Instant authorized payment via your connected digital device wallet with end-to-end tokenization.</p>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 space-y-1.5">
                    <p className="font-semibold text-stone-900 dark:text-stone-100">Cash on Delivery Terms</p>
                    <p>Pay upon physical receipt at your doorstep. Please ensure exact change of <strong className="font-mono text-stone-900 dark:text-stone-100">{formatPrice(orderTotal)}</strong> is available for the courier dispatch.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Review Summary (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-stone-50 dark:bg-stone-800/40 p-5 rounded-lg border border-stone-200 dark:border-stone-800 text-xs">
              <div>
                <h3 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 mb-4 pb-2 border-b border-stone-200 dark:border-stone-700">
                  Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </h3>

                {/* Items preview list */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded bg-stone-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">{item.product.name}</p>
                          <p className="text-[11px] text-stone-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono font-medium tabular-nums text-stone-900 dark:text-stone-100">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cost lines */}
                <div className="space-y-2 pt-3 border-t border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">{formatPrice(cartSubtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                      <span>Promotion Discount</span>
                      <span className="font-mono tabular-nums">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                      {shippingFee === 0 ? <span className="text-emerald-700 dark:text-emerald-400">Complimentary</span> : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax ({settings.taxRate}%)</span>
                    <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">{formatPrice(tax)}</span>
                  </div>

                  <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-between text-base font-semibold text-stone-950 dark:text-stone-50">
                    <span>Total Due</span>
                    <span className="font-mono tabular-nums text-lg">{formatPrice(orderTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-700 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-stone-950 text-stone-50 dark:bg-stone-100 dark:text-stone-950 text-sm font-semibold rounded-md shadow-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Authorize Order · {formatPrice(orderTotal)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                  <span>256-Bit SSL Encrypted & Verified Checkout</span>
                </div>
              </div>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
