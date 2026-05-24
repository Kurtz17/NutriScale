import CartItem from '@/components/marketplace/cart-item';
import CartSidebar from '@/components/marketplace/cart-sidebar';
import MarketplaceFilter from '@/components/marketplace/marketplace-filter';
import ProductGrid from '@/components/marketplace/product-grid';
import ProductCard from '@/components/ui/productCard';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { mockCartItem, mockProduct } from '../../fixtures/marketplace';

describe('marketplace components', () => {
  it('ProductCard should render stock, nutrition, badges, and add action', () => {
    const onAdd = vi.fn();

    render(<ProductCard product={mockProduct} onAdd={onAdd} />);

    expect(screen.getByText('Oatmeal Pisang')).toBeTruthy();
    expect(screen.getByText('Stok: 5')).toBeTruthy();
    expect(screen.getByText('Health-Safe')).toBeTruthy();
    expect(screen.getByText('AI Recommended')).toBeTruthy();
    expect(screen.getByText('Calories: 320')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /\+ Add/i }));

    expect(onAdd).toHaveBeenCalledWith(mockProduct);
  });

  it('ProductCard should disable add action when product is out of stock', () => {
    const onAdd = vi.fn();

    render(<ProductCard product={{ ...mockProduct, stok: 0 }} onAdd={onAdd} />);

    const button = screen.getByRole('button', { name: /Habis/i });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(button);
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('ProductGrid should show empty state when filters remove all products', () => {
    render(<ProductGrid products={[]} onAdd={vi.fn()} />);

    expect(screen.getByText('No products found')).toBeTruthy();
  });

  it('MarketplaceFilter should emit search changes and show selected category', () => {
    const setSearchQuery = vi.fn();

    render(
      <MarketplaceFilter
        searchQuery=""
        setSearchQuery={setSearchQuery}
        selectedCategory="Sarapan"
        setSelectedCategory={vi.fn()}
        categories={['All', 'Sarapan']}
      />,
    );

    fireEvent.change(
      screen.getByPlaceholderText('Search healthy products...'),
      {
        target: { value: 'oat' },
      },
    );

    expect(setSearchQuery).toHaveBeenCalledWith('oat');
    expect(screen.getByRole('button', { name: /Sarapan/i })).toBeTruthy();
  });

  it('CartItem should update, decrement, and remove items', () => {
    const updateQuantity = vi.fn();
    const removeFromCart = vi.fn();

    render(
      <CartItem
        item={mockCartItem}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />,
    );

    expect(screen.getByText('Oatmeal Pisang')).toBeTruthy();
    expect(screen.getByText('640 kcal')).toBeTruthy();

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[0]);

    expect(updateQuantity).toHaveBeenCalledWith('prod-1', 1);
    expect(updateQuantity).toHaveBeenCalledWith('prod-1', 3);
    expect(removeFromCart).toHaveBeenCalledWith('prod-1');
  });

  it('CartSidebar should render empty state and disable checkout without items', () => {
    render(
      <CartSidebar
        cart={[]}
        totalCalories={0}
        targetCalories={2000}
        subtotal={0}
        updateQuantity={vi.fn()}
        removeFromCart={vi.fn()}
        handleCheckout={vi.fn()}
      />,
    );

    expect(screen.getByText('0 Items')).toBeTruthy();
    expect(screen.getByText('Your cart is feeling lonely')).toBeTruthy();
    expect(
      (
        screen.getByRole('button', {
          name: /Proceed to Checkout/i,
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
});
