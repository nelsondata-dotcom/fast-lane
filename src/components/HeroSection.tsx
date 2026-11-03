import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { settings, setSelectedCategory } = useStore();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <div className="text-xs font-mono tracking-widest text-stone-500 dark:text-stone-400 uppercase mb-3">
              Spring / Summer 2026 Collection
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight leading-[1.15] text-balance">
              Timeless Objects Crafted for Considered Living
            </h1>
            
            <p className="mt-5 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-lg">
              Hand-thrown textured ceramics, pure 19.5-micron merino knitwear, botanical extracts, and vegetable-tanned leather. Everyday essentials shaped by master artisans for enduring ritual.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={scrollToCatalog}
                className="px-6 py-3.5 bg-stone-950 hover:bg-stone-800 text-stone-50 dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-950 text-xs sm:text-sm font-semibold rounded-md transition-all shadow-sm flex items-center gap-2.5 whitespace-nowrap group"
              >
                <span>Explore Full Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('Living & Lighting');
                  scrollToCatalog();
                }}
                className="px-5 py-3.5 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap"
              >
                Atelier Ceramics
              </button>
            </div>

            {/* Proof & Authenticity Indicators */}
            <div className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center gap-6 text-xs text-stone-500 dark:text-stone-400">
              <div>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">100%</span>
                <span className="ml-1.5">Ethical Traceability</span>
              </div>
              <span aria-hidden="true">·</span>
              <div>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">4.9/5</span>
                <span className="ml-1.5">Patron Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Campaign Visual */}
          <div className="lg:col-span-7">
            <div className="relative rounded-lg overflow-hidden shadow-xl bg-stone-200 dark:bg-stone-800 aspect-[16/10] sm:aspect-[16/9]">
              <img
                src="/src/assets/images/hero_editorial_storefront_1793745087670.jpg"
                alt="AURA & CO. artisanal home objects and tactile textiles"
                className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-stone-100 text-xs sm:text-sm font-medium drop-shadow-md">
                Featured: The Minimalist Living Suite · Limited Edition
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Full-width 4-Column Trust Proof Strip */}
      <div className="border-t border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-950/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-600 dark:text-stone-400 text-xs">
            
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-stone-900 dark:text-stone-100 shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100 block">Carbon-Neutral Freight</span>
                <span>Free delivery over ${settings.freeShippingThreshold}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-stone-900 dark:text-stone-100 shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100 block">Artisan Master Warranty</span>
                <span>Lifetime repair guarantee</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-stone-900 dark:text-stone-100 shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100 block">30-Day In-Home Trial</span>
                <span>Prepaid frictionless returns</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-stone-900 dark:text-stone-100 shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100 block">Direct From Atelier</span>
                <span>No wholesale markups</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
