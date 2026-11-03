import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

export const StorySection: React.FC = () => {
  const { settings } = useStore();

  return (
    <section className="bg-stone-100 dark:bg-stone-900/60 border-t border-b border-stone-200 dark:border-stone-800 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono tracking-widest text-stone-500 dark:text-stone-400 uppercase block">
              Atelier Philosophy
            </span>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-950 dark:text-stone-50 leading-tight">
              Honoring Natural Provenance and Patient Mastery
            </h2>
            
            <div className="space-y-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              <p>
                Every object in the {settings.storeName} catalog begins with unadulterated raw materials: long-staple Normandy flax, Roman travertine slabs, vegetable-tanned Tuscan hides, and botanical oils macerated over seasonal cycles.
              </p>
              <p>
                We collaborate directly with independent multi-generational workshops across Kyoto, Florence, and Melbourne. By cutting wholesale distributor intermediaries, we channel fair livable wages directly into master craft while offering heirloom durability to your home.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="p-4 bg-white dark:bg-stone-800 rounded-lg border border-stone-200/80 dark:border-stone-700/80">
                <span className="font-mono text-xl font-bold tabular-nums text-stone-900 dark:text-stone-100 block">
                  Zero Plastic
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 mt-1 block">
                  100% recyclable molded cellulose & paper pulp packing
                </span>
              </div>

              <div className="p-4 bg-white dark:bg-stone-800 rounded-lg border border-stone-200/80 dark:border-stone-700/80">
                <span className="font-mono text-xl font-bold tabular-nums text-stone-900 dark:text-stone-100 block">
                  Fair Atelier
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 mt-1 block">
                  Living wages paid to every ceramicist & leather artisan
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual Story Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-lg overflow-hidden shadow-xl bg-stone-200 dark:bg-stone-800 aspect-[4/3]">
              <img
                src="/src/assets/images/hero_editorial_storefront_1793745087670.jpg"
                alt="Artisan ceramic craftsmanship at AURA atelier"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-stone-100">
                <p className="font-serif text-lg sm:text-xl font-semibold italic text-balance">
                  "Objects should not demand attention through noise, but hold it through timeless resonance and honesty of material."
                </p>
                <span className="text-xs font-mono uppercase tracking-wider text-stone-300 mt-3 block">
                  — Atelier Founder & Chief Craftsman
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
