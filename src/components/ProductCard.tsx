import React, { useState } from 'react';
import { Product } from '../types/ecommerce';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    addToCart,
    setActiveModalProduct,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    // Pick first variant options by default if variants exist
    const defaultVariants: Record<string, string> = {};
    if (product.variants) {
      product.variants.forEach(v => {
        if (v.options.length > 0) {
          defaultVariants[v.name] = v.options[0];
        }
      });
    }

    addToCart(product, defaultVariants, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  return (
    <div
      onClick={() => setActiveModalProduct(product)}
      className="group relative flex flex-col bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      {/* Product Image Stage (4:3 Aspect Ratio) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        {imageLoaded && product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={() => setImageLoaded(false)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-200 dark:bg-stone-800 text-stone-500">
            <span className="font-serif text-lg font-medium text-stone-700 dark:text-stone-300">
              {product.name}
            </span>
            <span className="text-xs text-stone-500 mt-1">{product.category}</span>
          </div>
        )}

        {/* Status indicator tag (Clean unboxed text, max 1 subtle flag) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNew && (
            <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-stone-900 dark:text-stone-100 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm">
              New Arrival
            </span>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-[11px] font-mono uppercase font-semibold text-amber-900 dark:text-amber-200 bg-amber-50/90 dark:bg-amber-950/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm">
              Sale
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[11px] font-mono uppercase font-semibold text-rose-700 dark:text-rose-300 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
            isFavorited
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white shadow-sm opacity-90 sm:opacity-0 group-hover:opacity-100'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Action Tray */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={e => {
              e.stopPropagation();
              setActiveModalProduct(product);
            }}
            className="flex-1 py-2 px-3 text-xs font-semibold bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm text-stone-900 dark:text-stone-100 hover:bg-white dark:hover:bg-stone-800 rounded shadow-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              disabled={isAddedRecently}
              className={`py-2 px-3 text-xs font-semibold rounded shadow-md transition-colors flex items-center justify-center gap-1 whitespace-nowrap ${
                isAddedRecently
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-200'
              }`}
              title="Add default selection to bag"
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Bag</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between text-left">
        <div>
          {/* Clean unboxed metadata with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            <span className="font-medium">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{isOutOfStock ? 'Waitlist' : `${product.stock} in stock`}</span>
            {product.reviewCount > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-stone-700 dark:text-stone-300">
                  ★ {product.rating} ({product.reviewCount})
                </span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
            {product.name}
          </h3>

          {/* Subtitle / Key spec */}
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-1">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Mobile Add CTA */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base font-semibold tabular-nums text-stone-950 dark:text-stone-50">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="font-mono text-xs tabular-nums text-stone-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Mobile direct Add button */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`sm:hidden p-2 text-xs font-medium rounded-md transition-colors ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-600'
                : isAddedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
            }`}
            aria-label="Add to bag"
          >
            {isAddedRecently ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
