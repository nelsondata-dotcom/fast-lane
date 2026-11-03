import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus } from '../types/ecommerce';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Settings,
  RefreshCw,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';

export const MerchantDashboard: React.FC = () => {
  const {
    settings,
    updateSettings,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    formatPrice,
    resetToSampleData,
    merchantTab,
    setMerchantTab,
    setIsMerchantMode,
  } = useStore();

  // Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status !== 'Cancelled' ? ord.total : 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const inStockProducts = products.filter(p => p.stock > 0).length;

  // New Product Modal Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    category: 'Living & Lighting',
    price: 120,
    compareAtPrice: '',
    stock: 15,
    images: '/src/assets/images/hero_editorial_storefront_1793745087670.jpg',
    description: '',
    materials: 'Ceramic Stoneware, Solid Brass',
    dimensions: '12" H × 8" W',
    tags: 'Craft, Artisan, New',
  });

  const availableImagePresets = [
    { label: 'Minimalist Ceramic Lamp', url: '/src/assets/images/product_minimalist_ceramic_lamp_1793745088201.jpg' },
    { label: 'Merino Wool Knitwear', url: '/src/assets/images/product_merino_wool_knit_1793745088892.jpg' },
    { label: 'Amber Botanical Fragrance', url: '/src/assets/images/product_amber_glass_fragrance_1793745089002.jpg' },
    { label: 'Saddle Leather Tote', url: '/src/assets/images/product_sculptural_leather_tote_1793745089718.jpg' },
    { label: 'Artisan Living Suite', url: '/src/assets/images/hero_editorial_storefront_1793745087670.jpg' },
  ];

  // Settings form local state
  const [localSettings, setLocalSettings] = useState(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // Search in inventory
  const [inventorySearch, setInventorySearch] = useState('');

  const openAddModal = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      subtitle: '',
      category: 'Living & Lighting',
      price: 120,
      compareAtPrice: '',
      stock: 15,
      images: availableImagePresets[0].url,
      description: 'Handcrafted piece designed with tactile precision and natural materials for considered spaces.',
      materials: 'Natural Stoneware, Turned Brass',
      dimensions: '14" H × 9" W',
      tags: 'Artisanal, Essential',
    });
    setShowAddProductModal(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormData({
      name: prod.name,
      subtitle: prod.subtitle,
      category: prod.category,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice ? String(prod.compareAtPrice) : '',
      stock: prod.stock,
      images: prod.images[0] || availableImagePresets[0].url,
      description: prod.description,
      materials: prod.materials,
      dimensions: prod.dimensions || '',
      tags: prod.tags.join(', '),
    });
    setShowAddProductModal(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    const compPrice = formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formData.name,
        subtitle: formData.subtitle,
        category: formData.category,
        price: Number(formData.price),
        compareAtPrice: compPrice,
        stock: Number(formData.stock),
        images: [formData.images],
        description: formData.description,
        materials: formData.materials,
        dimensions: formData.dimensions,
        tags: tagArray,
      });
    } else {
      addProduct({
        name: formData.name,
        subtitle: formData.subtitle,
        category: formData.category,
        price: Number(formData.price),
        compareAtPrice: compPrice,
        stock: Number(formData.stock),
        images: [formData.images],
        description: formData.description,
        details: [
          'Master-artisan batch crafted',
          'Sustainably packed in recyclable fiber',
          'Lifetime repair and maintenance support',
        ],
        materials: formData.materials,
        dimensions: formData.dimensions,
        tags: tagArray,
        isNew: true,
      });
    }

    setShowAddProductModal(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 2500);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-left">
      
      {/* Merchant Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 mb-1">
            <span>Merchant Management Suite</span>
            <span>·</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100">{settings.storeName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 dark:text-stone-50">
            Store Operations & Business Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMerchantMode(false)}
            className="px-4 py-2 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold rounded-md hover:bg-stone-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Customer Storefront</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 sm:gap-2 my-6 p-1 bg-stone-100 dark:bg-stone-900 rounded-lg w-fit text-xs font-medium border border-stone-200 dark:border-stone-800">
        <button
          onClick={() => setMerchantTab('overview')}
          className={`px-4 py-2 rounded-md transition-colors ${
            merchantTab === 'overview'
              ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-50 shadow-sm font-semibold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          Analytics & Overview
        </button>
        <button
          onClick={() => setMerchantTab('products')}
          className={`px-4 py-2 rounded-md transition-colors ${
            merchantTab === 'products'
              ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-50 shadow-sm font-semibold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          Product Catalog ({products.length})
        </button>
        <button
          onClick={() => setMerchantTab('orders')}
          className={`px-4 py-2 rounded-md transition-colors ${
            merchantTab === 'orders'
              ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-50 shadow-sm font-semibold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          Orders Fulfillment ({orders.length})
        </button>
        <button
          onClick={() => setMerchantTab('settings')}
          className={`px-4 py-2 rounded-md transition-colors ${
            merchantTab === 'settings'
              ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-50 shadow-sm font-semibold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          Store Settings
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {merchantTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="p-5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-medium">Gross Settled Revenue</span>
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="font-mono text-2xl font-bold tabular-nums text-stone-950 dark:text-stone-50">
                {formatPrice(totalRevenue)}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">From {totalOrders} customer orders</div>
            </div>

            <div className="p-5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-medium">Total Orders Placed</span>
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="font-mono text-2xl font-bold tabular-nums text-stone-950 dark:text-stone-50">
                {totalOrders}
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">100% fulfillable</div>
            </div>

            <div className="p-5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-medium">Average Order Value (AOV)</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="font-mono text-2xl font-bold tabular-nums text-stone-950 dark:text-stone-50">
                {formatPrice(avgOrderValue)}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">Artisan luxury basket size</div>
            </div>

            <div className="p-5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
                <span className="text-xs font-medium">Active In-Stock Catalog</span>
                <Package className="w-4 h-4" />
              </div>
              <div className="font-mono text-2xl font-bold tabular-nums text-stone-950 dark:text-stone-50">
                {inStockProducts} <span className="text-sm font-normal text-stone-400">/ {products.length} SKUs</span>
              </div>
              <div className="text-[11px] text-stone-500 mt-1">Ready for warehouse dispatch</div>
            </div>

          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-stone-950 dark:text-stone-50">
                Recent Customer Orders
              </h2>
              <button
                onClick={() => setMerchantTab('orders')}
                className="text-xs font-semibold text-stone-900 dark:text-stone-100 hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 font-mono uppercase text-[11px] border-b border-stone-200 dark:border-stone-800">
                  <tr>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Patron</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Items</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                      <td className="py-3 px-3 font-mono font-semibold text-stone-900 dark:text-stone-100">
                        {o.id}
                      </td>
                      <td className="py-3 px-3 text-stone-800 dark:text-stone-200 font-medium">
                        {o.customer.fullName}
                      </td>
                      <td className="py-3 px-3 text-stone-500">
                        {new Date(o.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-stone-600 dark:text-stone-400">
                        {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                        {formatPrice(o.total)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT INVENTORY CATALOG */}
      {merchantTab === 'products' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={inventorySearch}
                onChange={e => setInventorySearch(e.target.value)}
                placeholder="Search inventory by title or category..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md text-stone-900 dark:text-stone-100 outline-none"
              />
            </div>

            <button
              onClick={openAddModal}
              className="px-4 py-2.5 bg-stone-950 text-stone-50 dark:bg-stone-100 dark:text-stone-950 rounded-md text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 font-mono uppercase text-[11px] border-b border-stone-200 dark:border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Inventory Level</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded bg-stone-100 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-stone-500 line-clamp-1">{prod.subtitle}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600 dark:text-stone-300 font-medium">
                        {prod.category}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                        {formatPrice(prod.price)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={prod.stock}
                            onChange={e => updateProduct(prod.id, { stock: Math.max(0, parseInt(e.target.value) || 0) })}
                            className="w-16 px-2 py-1 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-mono text-xs tabular-nums text-stone-900 dark:text-stone-100"
                          />
                          <span className="text-stone-400 text-[11px]">units</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {prod.stock <= 0 ? (
                          <span className="text-rose-600 dark:text-rose-400 font-semibold text-[11px]">Out of Stock</span>
                        ) : prod.stock < 10 ? (
                          <span className="text-amber-700 dark:text-amber-400 font-medium text-[11px]">Low Stock ({prod.stock})</span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium text-[11px]">Available</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${prod.name}" from catalog?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS FULFILLMENT */}
      {merchantTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-stone-950 dark:text-stone-50">
              Customer Orders Log ({orders.length})
            </h2>
            <span className="text-xs text-stone-500">
              Change status to simulate customer fulfillment tracking updates
            </span>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 font-mono uppercase text-[11px] border-b border-stone-200 dark:border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer Contact</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Purchased Items</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-stone-900 dark:text-stone-100 block">
                          {order.id}
                        </span>
                        <span className="text-stone-500 text-[11px]">
                          {new Date(order.date).toLocaleDateString()} · {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                          {order.customer.fullName}
                        </span>
                        <span className="text-stone-500 text-[11px]">{order.customer.email}</span>
                      </td>
                      <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                        {order.customer.city}, {order.customer.country}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {order.items.map(it => (
                            <div key={it.id} className="text-stone-700 dark:text-stone-300 font-medium">
                              {it.quantity}× {it.product.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-medium text-xs text-stone-900 dark:text-stone-100 outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STORE SETTINGS */}
      {merchantTab === 'settings' && (
        <div className="max-w-2xl bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="font-serif text-lg font-semibold text-stone-950 dark:text-stone-50">
              Storefront Branding & Business Parameters
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Configure your business identity, currencies, tax calculation, and freight thresholds.
            </p>
          </div>

          {settingsSavedMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Store parameters successfully saved and applied to your storefront!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Business / Brand Name
                </label>
                <input
                  type="text"
                  value={localSettings.storeName}
                  onChange={e => setLocalSettings({ ...localSettings, storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Currency Symbol & Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={localSettings.currencySymbol}
                    onChange={e => setLocalSettings({ ...localSettings, currencySymbol: e.target.value })}
                    className="w-16 px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono text-center outline-none"
                    placeholder="$"
                    required
                  />
                  <select
                    value={localSettings.currency}
                    onChange={e => setLocalSettings({ ...localSettings, currency: e.target.value })}
                    className="flex-1 px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none"
                  >
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                    <option value="GHS">GHS - Ghana Cedi (₵)</option>
                    <option value="CAD">CAD - Canadian Dollar ($)</option>
                    <option value="AUD">AUD - Australian Dollar ($)</option>
                    <option value="JPY">JPY - Japanese Yen (¥)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                Storefront Tagline / Editorial Kicker
              </label>
              <input
                type="text"
                value={localSettings.storeTagline}
                onChange={e => setLocalSettings({ ...localSettings, storeTagline: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Sales Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={localSettings.taxRate}
                  onChange={e => setLocalSettings({ ...localSettings, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Free Freight Minimum ($)
                </label>
                <input
                  type="number"
                  value={localSettings.freeShippingThreshold}
                  onChange={e => setLocalSettings({ ...localSettings, freeShippingThreshold: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Standard Shipping Fee ($)
                </label>
                <input
                  type="number"
                  value={localSettings.standardShippingRate}
                  onChange={e => setLocalSettings({ ...localSettings, standardShippingRate: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                Announcement Banner Text
              </label>
              <input
                type="text"
                value={localSettings.announcementBanner}
                onChange={e => setLocalSettings({ ...localSettings, announcementBanner: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Support Concierge Email
                </label>
                <input
                  type="email"
                  value={localSettings.supportEmail}
                  onChange={e => setLocalSettings({ ...localSettings, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Support Phone Contact
                </label>
                <input
                  type="text"
                  value={localSettings.contactPhone}
                  onChange={e => setLocalSettings({ ...localSettings, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-2.5 bg-stone-950 text-stone-50 dark:bg-stone-100 dark:text-stone-950 rounded-md font-semibold hover:bg-stone-800 transition-colors"
              >
                Save Business Parameters
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset store data back to initial sample catalog and orders?')) {
                    resetToSampleData();
                    setLocalSettings(settings);
                  }
                }}
                className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 font-medium flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Samples</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add or Edit Product */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div
            className="w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl overflow-hidden my-auto p-6 text-left"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-4">
              <h3 className="font-serif text-lg font-semibold text-stone-950 dark:text-stone-50">
                {editingProductId ? 'Edit Product Item' : 'Add New Artisan Product'}
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Stoneware Carafe & Tumbler"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Subtitle / Short Highlight
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Wheel-thrown stoneware with unglazed textured base"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none"
                  >
                    <option value="Living & Lighting">Living & Lighting</option>
                    <option value="Apparel & Knitwear">Apparel & Knitwear</option>
                    <option value="Fragrance & Care">Fragrance & Care</option>
                    <option value="Leather Goods">Leather Goods</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Inventory Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-mono text-stone-900 dark:text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-mono text-stone-900 dark:text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Compare at Price ($ optional)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.compareAtPrice}
                    onChange={e => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="Regular price if discounted"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-mono text-stone-900 dark:text-stone-100 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Product Imagery
                  </label>
                  <div className="grid grid-cols-5 gap-2 mb-2">
                    {availableImagePresets.map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, images: preset.url })}
                        className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                          formData.images === preset.url
                            ? 'border-stone-900 dark:border-stone-100 scale-95 shadow-md'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={e => setFormData({ ...formData, images: e.target.value })}
                    placeholder="Or enter image URL path"
                    className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono text-[11px] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Description & Narrative
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Materials & Finishes
                  </label>
                  <input
                    type="text"
                    value={formData.materials}
                    onChange={e => setFormData({ ...formData, materials: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Dimensions (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-950 text-stone-50 dark:bg-stone-100 dark:text-stone-950 font-semibold rounded hover:bg-stone-800 transition-colors shadow-sm"
                >
                  {editingProductId ? 'Update Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
