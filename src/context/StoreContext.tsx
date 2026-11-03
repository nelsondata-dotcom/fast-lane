import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, StoreSettings, Review, OrderStatus } from '../types/ecommerce';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_ORDERS, INITIAL_REVIEWS } from '../data/initialData';

interface StoreContextType {
  // Store Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  formatPrice: (amount: number) => string;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  activeModalProduct: Product | null;
  setActiveModalProduct: (product: Product | null) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest') => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, selectedVariants?: Record<string, string>, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  discountAmount: number;
  appliedPromo: { code: string; percentOff: number; label: string } | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'status' | 'trackingNumber' | 'estimatedDelivery'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  confirmedOrder: Order | null;
  setConfirmedOrder: (order: Order | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Reviews
  reviews: Review[];
  addReview: (productId: string, author: string, rating: number, title: string, comment: string) => void;
  getProductReviews: (productId: string) => Review[];

  // Merchant Admin Mode
  isMerchantMode: boolean;
  setIsMerchantMode: (isMerchant: boolean) => void;
  merchantTab: 'overview' | 'products' | 'orders' | 'settings';
  setMerchantTab: (tab: 'overview' | 'products' | 'orders' | 'settings') => void;
  resetToSampleData: () => void;

  // Dual Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('aura_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('aura_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('aura_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('aura_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const formatPrice = (amount: number): string => {
    const symbol = settings.currencySymbol || '$';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('aura_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('aura_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (newProd: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    if (activeModalProduct && activeModalProduct.id === id) {
      setActiveModalProduct(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (activeModalProduct && activeModalProduct.id === id) {
      setActiveModalProduct(null);
    }
  };

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aura_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percentOff: number; label: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, selectedVariants: Record<string, string> = {}, quantity: number = 1) => {
    // Generate variant signature
    const variantKey = Object.entries(selectedVariants)
      .sort(([k1], [k2]) => k1.localeCompare(k2))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
    const itemId = `${product.id}${variantKey ? `-${variantKey}` : ''}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: itemId, product, selectedVariants, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setPromoCode('');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'AURA15') {
      const promo = { code: 'AURA15', percentOff: 15, label: '15% Off VIP Welcome' };
      setAppliedPromo(promo);
      return { success: true, message: 'Promo code AURA15 applied (15% discount)!' };
    }
    if (clean === 'WELCOME10') {
      const promo = { code: 'WELCOME10', percentOff: 10, label: '10% First Order' };
      setAppliedPromo(promo);
      return { success: true, message: 'Promo code WELCOME10 applied (10% discount)!' };
    }
    if (clean === 'FREESHIP') {
      const promo = { code: 'FREESHIP', percentOff: 0, label: 'Complimentary Shipping' };
      setAppliedPromo(promo);
      return { success: true, message: 'Complimentary shipping promo applied!' };
    }
    return { success: false, message: 'Invalid or expired promotional code. Try AURA15.' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const discountAmount = appliedPromo && appliedPromo.percentOff > 0
    ? (cartSubtotal * appliedPromo.percentOff) / 100
    : 0;

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('aura_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aura_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('aura_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'status' | 'trackingNumber' | 'estimatedDelivery'>): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `AC-${randomSuffix}`;
    const tracking = `TRK-${Math.floor(1000000 + Math.random() * 9000000)}US`;
    
    // Estimated delivery 4 business days ahead
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      date: new Date().toISOString(),
      status: 'Processing',
      trackingNumber: tracking,
      estimatedDelivery,
    };

    setOrders(prev => [newOrder, ...prev]);

    // Deduct stock from products
    setProducts(prevProducts =>
      prevProducts.map(prod => {
        const orderedItem = orderData.items.find(item => item.product.id === prod.id);
        if (orderedItem) {
          const newStock = Math.max(0, prod.stock - orderedItem.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );

    clearCart();
    setConfirmedOrder(newOrder);
    setIsCheckoutOpen(false);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
    if (confirmedOrder && confirmedOrder.id === orderId) {
      setConfirmedOrder(prev => (prev ? { ...prev, status } : null));
    }
  };

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('aura_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('aura_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (productId: string, author: string, rating: number, title: string, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      author: author.trim() || 'Verified Patron',
      rating,
      title: title.trim(),
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verified: true,
    };

    setReviews(prev => [newRev, ...prev]);

    // Recalculate average rating & review count for the product
    setProducts(prev =>
      prev.map(prod => {
        if (prod.id === productId) {
          const prodReviews = [...reviews.filter(r => r.productId === productId), newRev];
          const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
          return {
            ...prod,
            rating: Number(avg.toFixed(1)),
            reviewCount: prodReviews.length,
          };
        }
        return prod;
      })
    );
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter(r => r.productId === productId);
  };

  // Merchant Portal Mode
  const [isMerchantMode, setIsMerchantMode] = useState(false);
  const [merchantTab, setMerchantTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');

  const resetToSampleData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('aura_products');
    localStorage.removeItem('aura_orders');
    localStorage.removeItem('aura_reviews');
    localStorage.removeItem('aura_settings');
    localStorage.removeItem('aura_cart');
    localStorage.removeItem('aura_wishlist');
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        formatPrice,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        activeModalProduct,
        setActiveModalProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        cartSubtotal,
        promoCode,
        setPromoCode,
        discountAmount,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        orders,
        createOrder,
        updateOrderStatus,
        confirmedOrder,
        setConfirmedOrder,
        isCheckoutOpen,
        setIsCheckoutOpen,
        reviews,
        addReview,
        getProductReviews,
        isMerchantMode,
        setIsMerchantMode,
        merchantTab,
        setMerchantTab,
        resetToSampleData,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
