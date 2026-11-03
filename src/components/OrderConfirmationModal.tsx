import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Package, Truck, Clock, ArrowRight, Printer, Sparkles } from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const { confirmedOrder, setConfirmedOrder, formatPrice, settings } = useStore();

  if (!confirmedOrder) return null;

  const order = confirmedOrder;

  const steps = [
    { label: 'Order Placed', time: 'Just now', done: true },
    { label: 'Atelier Preparation', time: 'In progress', done: order.status !== 'Pending' },
    { label: 'Shipped with Courier', time: order.estimatedDelivery ? `Est. ${order.estimatedDelivery}` : 'Pending', done: order.status === 'Shipped' || order.status === 'Delivered' },
    { label: 'Delivered', time: 'Final Destination', done: order.status === 'Delivered' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-left"
        onClick={e => e.stopPropagation()}
      >
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          
          {/* Success Banner */}
          <div className="text-center pb-6 border-b border-stone-200 dark:border-stone-800">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Order Receipt Confirmed
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 dark:text-stone-50 mt-1">
              Thank You for Your Patronage
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2">
              Order <strong className="font-mono text-stone-900 dark:text-stone-100">{order.id}</strong> has been logged with our workshop. A confirmation receipt has been dispatched to{' '}
              <strong className="text-stone-900 dark:text-stone-100">{order.customer.email}</strong>.
            </p>
          </div>

          {/* Timeline Tracking Strip */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                <span>Tracking: {order.trackingNumber}</span>
              </span>
              <span className="font-mono text-[11px] text-stone-500">Status: {order.status}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
              {steps.map((st, i) => (
                <div key={i} className="flex flex-col">
                  <div className={`h-1.5 rounded-full mb-2 ${st.done ? 'bg-stone-900 dark:bg-stone-100' : 'bg-stone-200 dark:bg-stone-700'}`} />
                  <span className={`font-medium ${st.done ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400'}`}>
                    {st.label}
                  </span>
                  <span className="text-stone-500 text-[10px] mt-0.5">{st.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details & Summary */}
          <div className="space-y-4 text-xs">
            <h3 className="font-serif text-sm font-semibold text-stone-900 dark:text-stone-100">
              Purchased Objects
            </h3>

            <div className="space-y-2 border border-stone-200 dark:border-stone-800 rounded-lg p-3 divide-y divide-stone-100 dark:divide-stone-800">
              {order.items.map(item => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded bg-stone-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-stone-100">{item.product.name}</p>
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity}
                        {Object.entries(item.selectedVariants).map(([k, v]) => ` · ${k}: ${v}`)}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-medium tabular-nums text-stone-900 dark:text-stone-100">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financials & Shipping Recipient */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded border border-stone-200 dark:border-stone-800">
                <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                  Delivery Destination
                </span>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {order.customer.fullName}<br />
                  {order.customer.address}<br />
                  {order.customer.city}, {order.customer.postalCode}<br />
                  {order.customer.country}
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded border border-stone-200 dark:border-stone-800 space-y-1 text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Freight</span>
                  <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                    {order.shippingFee === 0 ? 'Complimentary' : formatPrice(order.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({settings.taxRate}%)</span>
                  <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">{formatPrice(order.tax)}</span>
                </div>
                <div className="pt-1.5 border-t border-stone-200 dark:border-stone-700 flex justify-between font-semibold text-stone-950 dark:text-stone-50 text-sm">
                  <span>Total Settled</span>
                  <span className="font-mono tabular-nums">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Formal Receipt</span>
            </button>

            <button
              onClick={() => setConfirmedOrder(null)}
              className="px-6 py-2.5 bg-stone-950 text-stone-100 dark:bg-stone-100 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-200 rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Back to Storefront</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
