import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, Heart, Check, Truck, ShieldCheck, ArrowRight, Plus, Minus, MessageSquare } from 'lucide-react';

export const ProductModal: React.FC = () => {
  const {
    activeModalProduct,
    setActiveModalProduct,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    getProductReviews,
    addReview,
    settings,
  } = useStore();

  const product = activeModalProduct;

  // Selected variant state
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    if (!product || !product.variants) return {};
    const initial: Record<string, string> = {};
    product.variants.forEach(v => {
      if (v.options.length > 0) initial[v.name] = v.options[0];
    });
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'shipping' | 'reviews'>('details');
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState(false);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const reviews = getProductReviews(product.id);

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option,
    }));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariants, quantity);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1800);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    addReview(product.id, reviewName, reviewRating, reviewTitle, reviewComment);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
    setReviewSubmittedMsg(true);
    setTimeout(() => setReviewSubmittedMsg(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={() => setActiveModalProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-full shadow-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Gallery Column (5 cols) */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 shadow-inner">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 left-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-colors ${
                    isFavorited
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails if multiple images */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-[4/3] w-20 rounded-md overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-stone-900 dark:border-stone-100 scale-95'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Artisan badge / Specs summary */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-lg text-xs space-y-2 border border-stone-200/60 dark:border-stone-800">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                  <span className="font-medium">Primary Material:</span>
                  <span className="text-stone-900 dark:text-stone-200 font-medium">{product.materials}</span>
                </div>
                {product.dimensions && (
                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                    <span className="font-medium">Dimensions:</span>
                    <span className="text-stone-900 dark:text-stone-200 font-mono">{product.dimensions}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                  <span className="font-medium">Freight:</span>
                  <span className="text-stone-900 dark:text-stone-200">
                    Free standard delivery over ${settings.freeShippingThreshold}
                  </span>
                </div>
              </div>
            </div>

            {/* Purchase Module Column (7 cols) */}
            <div className="md:col-span-6 flex flex-col text-left">
              
              {/* Category & Rating */}
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
                <span className="font-medium uppercase tracking-wider">{product.category}</span>
                <span aria-hidden="true">·</span>
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="ml-1 font-mono font-bold text-stone-800 dark:text-stone-200 tabular-nums">
                    {product.rating}
                  </span>
                  <span className="ml-1 text-stone-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight">
                {product.name}
              </h2>

              <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                {product.subtitle}
              </p>

              {/* Price & Stock */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-mono font-semibold tabular-nums text-stone-950 dark:text-stone-50">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <>
                    <span className="text-sm font-mono text-stone-400 line-through tabular-nums">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                      Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                    </span>
                  </>
                )}
                <span className="ml-auto text-xs font-medium text-stone-500 dark:text-stone-400">
                  {isOutOfStock ? (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">Out of Stock</span>
                  ) : product.stock < 10 ? (
                    <span className="text-amber-700 dark:text-amber-400 font-medium">Only {product.stock} units remaining</span>
                  ) : (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">In Stock ({product.stock} units)</span>
                  )}
                </span>
              </div>

              {/* Variant Selectors */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6 space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
                  {product.variants.map(variant => (
                    <div key={variant.name}>
                      <div className="flex items-center justify-between text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">
                        <span>Select {variant.name}:</span>
                        <span className="font-semibold text-stone-900 dark:text-stone-100">
                          {selectedVariants[variant.name]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map(opt => {
                          const isSelected = selectedVariants[variant.name] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleVariantSelect(variant.name, opt)}
                              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap ${
                                isSelected
                                  ? 'bg-stone-900 text-stone-50 border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100 shadow-sm'
                                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-600'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Stepper & Add to Cart Action */}
              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center gap-3">
                <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-md bg-stone-50 dark:bg-stone-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-mono font-medium text-xs tabular-nums text-stone-900 dark:text-stone-100 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddedRecently}
                  className={`flex-1 py-3 px-5 text-sm font-semibold rounded-md transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-500 dark:bg-stone-800 dark:text-stone-500 cursor-not-allowed'
                      : isAddedRecently
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-950 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-200'
                  }`}
                >
                  {isAddedRecently ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Temporarily Out of Stock</span>
                  ) : (
                    <>
                      <span>Add to Bag</span>
                      <span className="opacity-80">·</span>
                      <span className="font-mono tabular-nums">{formatPrice(product.price * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tabs: Description / Craftsmanship / Reviews */}
              <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-2 text-xs font-medium">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`transition-colors py-1 ${
                      activeTab === 'details'
                        ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100 -mb-2'
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className={`transition-colors py-1 ${
                      activeTab === 'materials'
                        ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100 -mb-2'
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`transition-colors py-1 flex items-center gap-1 ${
                      activeTab === 'reviews'
                        ? 'text-stone-900 dark:text-stone-100 font-semibold border-b-2 border-stone-900 dark:border-stone-100 -mb-2'
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    <span>Patron Reviews</span>
                    <span className="font-mono tabular-nums text-[11px] text-stone-400">({reviews.length})</span>
                  </button>
                </div>

                <div className="pt-4 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {activeTab === 'details' && (
                    <div className="space-y-3">
                      <p>{product.description}</p>
                      <ul className="space-y-1.5 list-disc pl-4 text-stone-600 dark:text-stone-300">
                        {product.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'materials' && (
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-stone-900 dark:text-stone-100">Primary Material: </span>
                        <span>{product.materials}</span>
                      </div>
                      {product.dimensions && (
                        <div>
                          <span className="font-semibold text-stone-900 dark:text-stone-100">Dimensions: </span>
                          <span>{product.dimensions}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-stone-900 dark:text-stone-100">Provenance: </span>
                        <span>Direct workshop collaboration with ethical artisan ateliers. Certified non-toxic and sustainably packaged in molded recycled fiber pulp.</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {reviewSubmittedMsg && (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded text-xs font-medium">
                          Thank you for sharing your experience! Your review has been recorded.
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-900 dark:text-stone-100">
                          {reviews.length} Verified Patron Reviews
                        </span>
                        <button
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="px-3 py-1 text-xs font-medium bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded transition-colors"
                        >
                          {showReviewForm ? 'Cancel' : 'Write a Review'}
                        </button>
                      </div>

                      {showReviewForm && (
                        <form onSubmit={handleReviewSubmit} className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-lg space-y-3 border border-stone-200 dark:border-stone-700 text-xs">
                          <div>
                            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Your Name</label>
                            <input
                              type="text"
                              value={reviewName}
                              onChange={e => setReviewName(e.target.value)}
                              placeholder="e.g. Liam Sterling"
                              className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100"
                              required
                            />
                          </div>

                          <div>
                            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Rating</label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  className="p-1 text-amber-500 hover:scale-110 transition-transform"
                                >
                                  <Star className={`w-4 h-4 ${reviewRating >= star ? 'fill-current' : 'text-stone-300 dark:text-stone-600'}`} />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Review Headline</label>
                            <input
                              type="text"
                              value={reviewTitle}
                              onChange={e => setReviewTitle(e.target.value)}
                              placeholder="e.g. Masterful finish and fast shipping"
                              className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100"
                              required
                            />
                          </div>

                          <div>
                            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Review Comments</label>
                            <textarea
                              rows={3}
                              value={reviewComment}
                              onChange={e => setReviewComment(e.target.value)}
                              placeholder="Describe craftsmanship, fit, or daily utility..."
                              className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            className="px-4 py-2 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-semibold rounded text-xs hover:bg-stone-800 transition-colors"
                          >
                            Submit Review
                          </button>
                        </form>
                      )}

                      <div className="space-y-3 pt-2">
                        {reviews.length === 0 ? (
                          <p className="text-stone-400 italic">No reviews yet. Be the first patron to review this piece.</p>
                        ) : (
                          reviews.map(rev => (
                            <div key={rev.id} className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded border border-stone-100 dark:border-stone-800/80">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-semibold text-stone-900 dark:text-stone-100">{rev.author}</span>
                                <span className="text-stone-400">{rev.date}</span>
                              </div>
                              <div className="flex items-center gap-1 text-amber-500 mb-1">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-current" />
                                ))}
                                {rev.verified && (
                                  <span className="text-[10px] text-stone-500 dark:text-stone-400 ml-2 font-mono">
                                    Verified Buyer
                                  </span>
                                )}
                              </div>
                              <p className="font-medium text-stone-900 dark:text-stone-100 text-xs">{rev.title}</p>
                              <p className="text-stone-600 dark:text-stone-300 text-xs mt-1">{rev.comment}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
