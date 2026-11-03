import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CatalogSection } from './components/CatalogSection';
import { StorySection } from './components/StorySection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductModal } from './components/ProductModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { MerchantDashboard } from './components/MerchantDashboard';

const MainLayout: React.FC = () => {
  const { isMerchantMode } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {isMerchantMode ? (
          <MerchantDashboard />
        ) : (
          <>
            <HeroSection />
            <CatalogSection />
            <StorySection />
          </>
        )}
      </main>

      <Footer />

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductModal />
      <CheckoutModal />
      <OrderConfirmationModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
