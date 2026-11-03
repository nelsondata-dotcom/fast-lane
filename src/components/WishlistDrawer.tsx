import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    formatPrice,
    setActiveModalProduct,
  } = useStore();

  if (!isWishlistOpen) return null;

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div
        className="w-full max-w-md bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 transition-all text-left"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-stone-900 dark:text-stone-100 fill-current" />
            <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
              Saved Pieces
            </h2>
            <span className="font-mono text-xs tabular-nums text-stone-500">
              ({savedProducts.length})
            </span>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <Heart className="w-10 h-10 stroke-1 text-stone-300 dark:text-stone-700 mb-3" />
              <p className="font-serif text-base font-medium text-stone-900 dark:text-stone-100">
                Your wishlist is empty
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                Tap the heart on any product card or details view to save pieces for later.
              </p>
            </div>
          ) : (
            savedProducts.map(prod => (
              <div
                key={prod.id}
                className="flex gap-3.5 p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800"
              >
                <div
                  onClick={() => {
                    setActiveModalProduct(prod);
                    setIsWishlistOpen(false);
                  }}
                  className="w-18 h-18 aspect-square rounded overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0 cursor-pointer"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        onClick={() => {
                          setActiveModalProduct(prod);
                          setIsWishlistOpen(false);
                        }}
                        className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1 cursor-pointer hover:underline"
                      >
                        {prod.name}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(prod.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-stone-500">{prod.category}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="font-mono text-xs font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                      {formatPrice(prod.price)}
                    </span>

                    <button
                      onClick={() => {
                        addToCart(prod, {}, 1);
                        toggleWishlist(prod.id);
                      }}
                      disabled={prod.stock <= 0}
                      className="px-2.5 py-1 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-[11px] font-medium rounded hover:bg-stone-800 transition-colors flex items-center gap-1 disabled:opacity-40"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
