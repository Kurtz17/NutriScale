import { useCheckout } from '@/hooks/useCheckout';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useCartStore } from '@/lib/store/useCartStore';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  mockCartItem,
  mockProduct,
  mockSecondProduct,
} from '../fixtures/marketplace';

const navigationMocks = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: navigationMocks.push }),
}));

const fetchMock = vi.fn();

describe('marketplace and checkout hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('alert', vi.fn());
    fetchMock.mockReset();
    useCartStore.setState({ cart: [], isLoading: false });
  });

  it('useMarketplace should load products, derive filters, and compute cart totals', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url === '/api/products') {
        return Promise.resolve({
          ok: true,
          headers: new Headers({ 'X-Target-Calories': '1800' }),
          json: () => Promise.resolve([mockProduct, mockSecondProduct]),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cart: [mockCartItem] }),
      });
    });

    const { result } = renderHook(() => useMarketplace());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.products).toHaveLength(2);
    expect(result.current.categories).toEqual([
      'All',
      'Sarapan',
      'Makan Siang',
    ]);
    expect(result.current.targetCalories).toBe(1800);
    expect(result.current.totalCalories).toBe(640);
    expect(result.current.subtotal).toBe(50000);

    act(() => {
      result.current.setSearchQuery('salad');
    });

    expect(result.current.filteredProducts).toEqual([mockSecondProduct]);
  });

  it('useMarketplace should block checkout for an empty cart and route when cart has items', () => {
    const { result, rerender } = renderHook(() => useMarketplace());

    act(() => result.current.handleCheckout());
    expect(window.alert).toHaveBeenCalledWith('Keranjang masih kosong!');

    useCartStore.setState({ cart: [mockCartItem], isLoading: false });
    rerender();
    act(() => result.current.handleCheckout());

    expect(navigationMocks.push).toHaveBeenCalledWith('/checkout');
  });

  it('useCheckout should load default user address and toggle it into the form', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url === '/api/user/me') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              name: 'Nadia',
              phone: '08123456789',
              address: {
                detailAlamat: 'Rumah A',
                jalan: 'Jl. Mawar',
                rt: '01',
                rw: '02',
                provinsi: 'DKI Jakarta',
              },
            }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cart: [] }),
      });
    });

    const { result } = renderHook(() => useCheckout());

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/user/me'));
    act(() => result.current.handleToggleDefault());

    expect(result.current.formData).toEqual({
      name: 'Nadia',
      phone: '08123456789',
      address: 'Rumah A, Jl. Mawar, RT 01 / RW 02, DKI Jakarta',
    });
  });

  it('useCheckout should warn when payment starts with an empty cart', () => {
    const { result } = renderHook(() => useCheckout());

    act(() => result.current.handlePayment());

    expect(result.current.notification).toEqual({
      isOpen: true,
      message: 'Keranjang belanja Anda kosong!',
      type: 'warning',
    });
  });

  it('useCheckout should process payment and hand the token to Midtrans snap', async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url === '/api/user/me') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ name: '', phone: '', address: null }),
        });
      }

      if (url === '/api/checkout') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ snapToken: 'snap-token-123' }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ cart: [mockCartItem] }),
      });
    });
    const snapPay = vi.mocked(window.snap.pay);
    snapPay.mockImplementation((_token, options) => options.onSuccess?.());

    const { result } = renderHook(() => useCheckout());
    await waitFor(() => expect(result.current.cart).toHaveLength(1));

    act(() => {
      result.current.setFormData({
        name: 'Nadia',
        phone: '08123456789',
        address: 'Jl. Mawar',
      });
    });
    await act(async () => {
      await result.current.processPayment();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/checkout',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(snapPay).toHaveBeenCalledWith(
      'snap-token-123',
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onPending: expect.any(Function),
        onError: expect.any(Function),
        onClose: expect.any(Function),
      }),
    );
    expect(navigationMocks.push).toHaveBeenCalledWith('/order-history');
  });
});
