import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartCount,
    formatPrice,
    settings,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    setIsCheckoutOpen,
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const threshold = settings.freeShippingThreshold;
  const freeShippingProgress = Math.min(100, (cartSubtotal / threshold) * 100);
  const amountToFreeShipping = Math.max(0, threshold - cartSubtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setPromoFeedback({ text: res.message, isError: !res.success });
    if (res.success) setInputCode('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div
        className="w-full max-w-md bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 transition-all text-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-stone-900 dark:text-stone-100" />
            <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
              Shopping Bag
            </h2>
            <span className="font-mono text-xs tabular-nums text-stone-500 dark:text-stone-400">
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors"
            aria-label="Close bag drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-3.5 bg-stone-100 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-800 text-xs">
          <div className="flex items-center justify-between text-stone-700 dark:text-stone-300 font-medium mb-1.5">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-stone-900 dark:text-stone-100" />
              <span>
                {amountToFreeShipping === 0 ? (
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    You unlocked complimentary carbon-neutral shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="font-mono text-stone-900 dark:text-stone-100">{formatPrice(amountToFreeShipping)}</strong> more for free delivery
                  </span>
                )}
              </span>
            </div>
            <span className="font-mono text-[11px] tabular-nums text-stone-500">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-stone-900 dark:bg-stone-100 rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Line Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 dark:text-stone-400">
              <ShoppingBag className="w-12 h-12 text-stone-300 dark:text-stone-700 stroke-1 mb-3" />
              <p className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                Your bag is empty
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs">
                Explore our catalog of artisan stoneware, merino knitwear, botanical fragrance, and leather accessories.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-5 py-2.5 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold rounded-md hover:bg-stone-800 transition-colors"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800"
              >
                {/* Product Thumbnail */}
                <div className="w-18 h-18 aspect-square rounded overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Selected Variants */}
                    {Object.keys(item.selectedVariants).length > 0 && (
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        {Object.entries(item.selectedVariants).map(([name, val], idx) => (
                          <span key={name}>
                            {idx > 0 && ' · '}
                            {name}: {val}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center justify-between mt-2 pt-1">
                    <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-900">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-stone-600 dark:text-stone-400 hover:text-stone-900"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono text-xs tabular-nums text-stone-900 dark:text-stone-100 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-stone-600 dark:text-stone-400 hover:text-stone-900"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono text-xs font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 space-y-3.5">
            
            {/* Promo Code Input */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded px-2.5 py-1.5 text-xs text-emerald-800 dark:text-emerald-200">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>
                      <strong className="font-mono">{appliedPromo.code}</strong> applied ({appliedPromo.label})
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 font-medium text-xs ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={inputCode}
                      onChange={e => setInputCode(e.target.value)}
                      placeholder="Promo code (try AURA15)"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none uppercase font-mono placeholder:normal-case placeholder:font-sans"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium rounded transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoFeedback && !appliedPromo && (
                <p className={`text-[11px] mt-1 ${promoFeedback.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {promoFeedback.text}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>Promotional Savings</span>
                  <span className="font-mono tabular-nums">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Freight</span>
                <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {amountToFreeShipping === 0 || appliedPromo?.code === 'FREESHIP' ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">Complimentary</span>
                  ) : (
                    formatPrice(settings.standardShippingRate)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Sales Tax ({settings.taxRate}%)</span>
                <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {formatPrice(((cartSubtotal - discountAmount) * settings.taxRate) / 100)}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-sm font-semibold text-stone-950 dark:text-stone-50">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums text-base">
                  {formatPrice(
                    (cartSubtotal - discountAmount) +
                    ((cartSubtotal - discountAmount) * settings.taxRate) / 100 +
                    (amountToFreeShipping === 0 || appliedPromo?.code === 'FREESHIP' ? 0 : settings.standardShippingRate)
                  )}
                </span>
              </div>
            </div>

            {/* Primary Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 bg-stone-950 text-stone-50 dark:bg-stone-100 dark:text-stone-950 font-semibold rounded-md shadow-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
