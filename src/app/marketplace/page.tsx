'use client';

import CartSidebar from '@/components/marketplace/cart-sidebar';
import MarketplaceFilter from '@/components/marketplace/marketplace-filter';
import MarketplaceHeader from '@/components/marketplace/marketplace-header';
import ProductGrid from '@/components/marketplace/product-grid';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function MarketplacePage() {
  const {
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    targetCalories,
    categories,
    filteredProducts,
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    totalCalories,
    subtotal,
    handleCheckout,
  } = useMarketplace();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F8E9]">
        <div className="w-16 h-16 border-4 border-[#7CB342] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold animate-pulse text-lg">
          Loading marketplace...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${inter.className} bg-[#E6EFE3] min-h-screen px-6 md:px-10 py-8`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Brand & Title */}
        <MarketplaceHeader />

        {/* Navigation & Search */}
        <MarketplaceFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Product Gallery */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <ProductGrid products={filteredProducts} onAdd={addToCart} />
          </div>

          {/* AI Sidebar */}
          <div className="w-full lg:w-auto order-1 lg:order-2">
            <CartSidebar
              cart={cart}
              totalCalories={totalCalories}
              targetCalories={targetCalories}
              subtotal={subtotal}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              handleCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
