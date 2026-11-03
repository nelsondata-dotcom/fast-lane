export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  description: string;
  details: string[];
  materials: string;
  dimensions?: string;
  tags: string[];
  variants?: ProductVariant[];
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  id: string; // unique item instance id: `${productId}-${variantKey}`
  product: Product;
  selectedVariants: Record<string, string>;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  customer: CustomerDetails;
  paymentMethod: 'Card' | 'ApplePay' | 'COD';
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  currency: string;
  currencySymbol: string;
  taxRate: number; // percentage, e.g. 8 for 8%
  freeShippingThreshold: number;
  standardShippingRate: number;
  expressShippingRate: number;
  supportEmail: string;
  contactPhone: string;
  announcementBanner: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}
