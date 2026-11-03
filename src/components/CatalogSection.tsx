import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, ArrowUpDown, Check, RefreshCw } from 'lucide-react';

export const CatalogSection: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly,
  } = useStore();

  const categories = [
    { label: 'All Pieces', id: 'All' },
    { label: 'Living & Lighting', id: 'Living & Lighting' },
    { label: 'Apparel & Knitwear', id: 'Apparel & Knitwear' },
    { label: 'Fragrance & Care', id: 'Fragrance & Care' },
    { label: 'Leather Goods', id: 'Leather Goods' },
  ];

  // Filter products
  let filtered = products.filter(product => {
    // Category filter
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }
    // In-stock filter
    if (inStockOnly && product.stock <= 0) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchSubtitle = product.subtitle.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchMaterials = product.materials.toLowerCase().includes(q);
      const matchTags = product.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchSubtitle && !matchCategory && !matchMaterials && !matchTags) {
        return false;
      }
    }
    return true;
  });

  // Sort products
  filtered.sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    // featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const hasActiveFilters = selectedCategory !== 'All' || inStockOnly || searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedCategory('All');
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section id="catalog-section" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800 text-left">
        <div>
          <span className="text-xs font-mono tracking-widest text-stone-500 dark:text-stone-400 uppercase">
            Curated Atelier Archive
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 dark:text-stone-50 mt-1">
            {selectedCategory === 'All' ? 'Complete Collection' : selectedCategory}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Displaying {filtered.length} of {products.length} registered craft objects
          </p>
        </div>

        {/* Sort & Quick Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* In stock filter */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3 py-2 rounded-md border font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              inStockOnly
                ? 'bg-stone-900 text-stone-50 border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-stone-400'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${inStockOnly ? 'opacity-100' : 'opacity-30'}`} />
            <span>In-Stock Only</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent border-none outline-none text-stone-800 dark:text-stone-200 text-xs font-medium cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">New Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Reset all filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Category Segmented Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors border ${
                isSelected
                  ? 'bg-stone-900 text-stone-50 border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100 shadow-sm'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:text-stone-900 dark:hover:text-stone-200 hover:border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search feedback when searching */}
      {searchQuery.trim() && (
        <div className="mb-6 p-3 bg-stone-100 dark:bg-stone-800/60 rounded-md text-xs text-stone-700 dark:text-stone-300 flex items-center justify-between">
          <span>
            Search query results for: <strong className="text-stone-900 dark:text-stone-100">"{searchQuery}"</strong> ({filtered.length} found)
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 font-medium ml-2"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Product Grid (3-column desktop baseline with gap-6 to gap-8) */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-lg p-8">
          <p className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
            No artisan objects match your criteria
          </p>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or resetting filters to browse all catalog categories.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold rounded-md hover:bg-stone-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </section>
  );
};
