import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Heart, Search, Moon, Sun, Store, SlidersHorizontal, ArrowLeft } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    settings,
    cartCount,
    cartSubtotal,
    formatPrice,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    isMerchantMode,
    setIsMerchantMode,
    theme,
    toggleTheme,
  } = useStore();

  const [showSearchInput, setShowSearchInput] = useState(false);

  const categories = [
    { label: 'All Goods', id: 'All' },
    { label: 'Living', id: 'Living & Lighting' },
    { label: 'Apparel', id: 'Apparel & Knitwear' },
    { label: 'Fragrance', id: 'Fragrance & Care' },
    { label: 'Leather', id: 'Leather Goods' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (isMerchantMode) setIsMerchantMode(false);
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-left group"
            >
              <span className="font-serif text-2xl font-semibold tracking-tight text-stone-950 dark:text-stone-50 whitespace-nowrap block">
                {settings.storeName}
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 single-line clean nav links */}
          {!isMerchantMode ? (
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
              {categories.map(cat => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      const catalogEl = document.getElementById('catalog-section');
                      if (catalogEl) {
                        catalogEl.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                      isActive
                        ? 'text-stone-950 dark:text-stone-50 font-semibold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    {cat.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="font-medium text-stone-900 dark:text-stone-100">Merchant Suite</span>
              <span>·</span>
              <span>Inventory, Orders & Storefront Settings</span>
            </div>
          )}

          {/* Zone 3: Primary action & controls cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Merchant / Customer View Mode Toggle */}
            <button
              onClick={() => setIsMerchantMode(!isMerchantMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 border ${
                isMerchantMode
                  ? 'bg-stone-900 text-stone-50 border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100 shadow-sm'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={isMerchantMode ? 'Switch to Customer Storefront' : 'Open Business Merchant Portal'}
            >
              {isMerchantMode ? (
                <>
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Exit Admin</span>
                </>
              ) : (
                <>
                  <Store className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                  <span>Manage Store</span>
                </>
              )}
            </button>

            {/* Search Toggle (Storefront only) */}
            {!isMerchantMode && (
              <div className="relative flex items-center">
                {showSearchInput ? (
                  <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md px-2.5 py-1 text-xs shadow-sm w-44 sm:w-60">
                    <Search className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search objects, wool, lamp..."
                      className="bg-transparent border-none outline-none text-stone-900 dark:text-stone-100 w-full text-xs placeholder:text-stone-400"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setShowSearchInput(false);
                        setSearchQuery('');
                      }}
                      className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs ml-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearchInput(true)}
                    className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-100 rounded-md hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
                    aria-label="Search catalog"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Wishlist Button */}
            {!isMerchantMode && (
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-100 rounded-md hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors"
                aria-label="Saved Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button */}
            {!isMerchantMode && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-50 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
                aria-label="View shopping bag"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bag</span>
                <span className="font-mono tabular-nums text-[11px] bg-stone-800 dark:bg-stone-200 text-stone-100 dark:text-stone-900 px-1.5 py-0.2 rounded">
                  {cartCount}
                </span>
                {cartSubtotal > 0 && (
                  <span className="font-mono tabular-nums text-[11px] hidden md:inline opacity-90 border-l border-stone-700 dark:border-stone-300 pl-2">
                    {formatPrice(cartSubtotal)}
                  </span>
                )}
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors ml-1"
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
