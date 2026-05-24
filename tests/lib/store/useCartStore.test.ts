import { useCartStore } from '@/lib/store/useCartStore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockCartItem, mockProduct } from '../../fixtures/marketplace';

const fetchMock = vi.fn();

describe('useCartStore', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    useCartStore.setState({ cart: [], isLoading: false });
  });

  it('should fetch cart items from API', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ cart: [mockCartItem] }),
    });

    await useCartStore.getState().fetchCart();

    expect(fetchMock).toHaveBeenCalledWith('/api/cart');
    expect(useCartStore.getState().cart).toEqual([mockCartItem]);
    expect(useCartStore.getState().isLoading).toBe(false);
  });

  it('should keep cart empty and stop loading when fetch fails', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    fetchMock.mockRejectedValue(new Error('network down'));

    await useCartStore.getState().fetchCart();

    expect(useCartStore.getState().cart).toEqual([]);
    expect(useCartStore.getState().isLoading).toBe(false);
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to fetch cart:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('should optimistically add a new product and persist it', async () => {
    fetchMock.mockResolvedValue({ ok: true });

    await useCartStore.getState().addToCart(mockProduct, 2);

    expect(useCartStore.getState().cart).toEqual([
      { ...mockProduct, quantity: 2 },
    ]);
    expect(fetchMock).toHaveBeenCalledWith('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'prod-1', quantity: 2 }),
    });
  });

  it('should update an existing cart item without exceeding stock', async () => {
    fetchMock.mockResolvedValue({ ok: true });
    useCartStore.setState({ cart: [mockCartItem], isLoading: false });

    await useCartStore.getState().updateQuantity(mockProduct.id, 20);

    expect(useCartStore.getState().cart[0].quantity).toBe(5);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/cart',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          productId: 'prod-1',
          quantity: 5,
          setExact: true,
        }),
      }),
    );
  });

  it('should not add beyond stock when the product is already in cart', async () => {
    useCartStore.setState({
      cart: [{ ...mockProduct, quantity: 5 }],
      isLoading: false,
    });

    await useCartStore.getState().addToCart(mockProduct);

    expect(useCartStore.getState().cart[0].quantity).toBe(5);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should remove a cart item and call DELETE endpoint', async () => {
    fetchMock.mockResolvedValue({ ok: true });
    useCartStore.setState({ cart: [mockCartItem], isLoading: false });

    await useCartStore.getState().removeFromCart(mockProduct.id);

    expect(useCartStore.getState().cart).toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'prod-1' }),
    });
  });

  it('should clear cart locally', () => {
    useCartStore.setState({ cart: [mockCartItem], isLoading: false });

    useCartStore.getState().clearCart();

    expect(useCartStore.getState().cart).toEqual([]);
  });
});
