import CartSidebar from '@/components/marketplace/cart-sidebar';
import MarketplaceFilter from '@/components/marketplace/marketplace-filter';
import ProductGrid from '@/components/marketplace/product-grid';
import { CartItem, Product } from '@/types/marketplace';
import { fireEvent, render, screen } from '@testing-library/react';
import { useMemo, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { mockProduct, mockSecondProduct } from '../fixtures/marketplace';

const products = [mockProduct, mockSecondProduct];

function MarketplaceHarness({ onCheckout }: { onCheckout: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [searchQuery, selectedCategory],
  );

  const addToCart = (product: Product) => {
    setCart((items) => [...items, { ...product, quantity: 1 }]);
  };

  return (
    <>
      <MarketplaceFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={['All', 'Sarapan', 'Makan Siang']}
      />
      <ProductGrid products={filteredProducts} onAdd={addToCart} />
      <CartSidebar
        cart={cart}
        totalCalories={cart.reduce(
          (total, item) => total + item.calories * item.quantity,
          0,
        )}
        targetCalories={2000}
        subtotal={cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        )}
        updateQuantity={vi.fn()}
        removeFromCart={(id) =>
          setCart((items) => items.filter((item) => item.id !== id))
        }
        handleCheckout={onCheckout}
      />
    </>
  );
}

describe('marketplace integration flow', () => {
  it('should search products, show empty state, add to cart, and enable checkout', () => {
    const onCheckout = vi.fn();

    render(<MarketplaceHarness onCheckout={onCheckout} />);

    fireEvent.change(
      screen.getByPlaceholderText('Search healthy products...'),
      {
        target: { value: 'not-found' },
      },
    );
    expect(screen.getByText('No products found')).toBeTruthy();

    fireEvent.change(
      screen.getByPlaceholderText('Search healthy products...'),
      {
        target: { value: 'oatmeal' },
      },
    );
    fireEvent.click(screen.getByRole('button', { name: /\+ Add/i }));

    expect(screen.getByText('1 Items')).toBeTruthy();
    expect(screen.getByText('320 kcal')).toBeTruthy();

    const checkout = screen.getByRole('button', {
      name: /Proceed to Checkout/i,
    }) as HTMLButtonElement;
    expect(checkout.disabled).toBe(false);
    fireEvent.click(checkout);

    expect(onCheckout).toHaveBeenCalledTimes(1);
  });
});
