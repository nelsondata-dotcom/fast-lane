import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setSelectedCategory, setIsMerchantMode } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-stone-900 text-stone-300 dark:bg-stone-950 dark:text-stone-400 border-t border-stone-800 text-left pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-stone-800">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-5 space-y-3">
            <span className="font-serif text-2xl font-bold text-stone-100 tracking-tight block">
              {settings.storeName}
            </span>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              {settings.storeTagline}. Curated objects designed for daily contemplation and generational permanence.
            </p>
            <div className="text-xs text-stone-400 pt-2 space-y-1">
              <p>Direct Inquiries: <a href={`mailto:${settings.supportEmail}`} className="text-stone-200 underline">{settings.supportEmail}</a></p>
              <p>Telephone: <span className="font-mono text-stone-200">{settings.contactPhone}</span></p>
            </div>
          </div>

          {/* Catalog Navigation */}
          <div className="md:col-span-2 space-y-2 text-xs">
            <h4 className="font-mono uppercase tracking-wider text-stone-200 font-semibold mb-3">
              Collections
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory('Living & Lighting')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Living & Ceramics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('Apparel & Knitwear')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Merino Knitwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('Fragrance & Care')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Botanical Fragrance
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('Leather Goods')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Tuscan Leather
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2 space-y-2 text-xs">
            <h4 className="font-mono uppercase tracking-wider text-stone-200 font-semibold mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><span>Carbon-Neutral Freight</span></li>
              <li><span>Lifetime Repair Policy</span></li>
              <li><span>30-Day Frictionless Returns</span></li>
              <li>
                <button
                  onClick={() => setIsMerchantMode(true)}
                  className="text-stone-300 hover:text-white transition-colors underline"
                >
                  Merchant Business Suite
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Dispatch */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-mono uppercase tracking-wider text-stone-200 font-semibold">
              The Atelier Journal
            </h4>
            <p className="text-stone-400">
              Seasonal archive dispatches, private studio previews, and material provenance notes.
            </p>

            {subscribed ? (
              <div className="p-2.5 bg-stone-800 border border-stone-700 text-stone-200 rounded text-xs flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>You are subscribed to our seasonal journal.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter email address..."
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-l text-stone-100 placeholder:text-stone-500 text-xs outline-none focus:border-stone-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-stone-100 text-stone-900 rounded-r font-semibold hover:bg-stone-200 transition-colors shrink-0"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-stone-500 block">We respect privacy. Unsubscribe at any time.</span>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {settings.storeName}. All rights reserved. Mastercrafted with natural honesty.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Terms of Service</span>
            <span>·</span>
            <span>Privacy Charter</span>
            <span>·</span>
            <span>Ethical Sourcing Disclosure</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
