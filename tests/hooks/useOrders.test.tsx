import { useOrders } from '@/hooks/useOrders';
import { AdminOrder } from '@/types/admin-orders';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const orderServiceMocks = vi.hoisted(() => ({
  fetchAdminOrders: vi.fn(),
  updateAdminOrderStatus: vi.fn(),
}));

vi.mock('@/services/orders', () => ({
  fetchAdminOrders: orderServiceMocks.fetchAdminOrders,
  updateAdminOrderStatus: orderServiceMocks.updateAdminOrderStatus,
}));

const mockOrders: AdminOrder[] = [
  {
    id: 'ORD-001',
    createdAt: '1 Mei 2026',
    rawDate: '2026-05-01T00:00:00.000Z',
    totalPrice: 100000,
    status: 'TERTUNDA',
    paymentStatus: 'TERTUNDA',
    customer: {
      name: 'Nadia',
      email: 'nadia@test.local',
      phone: '0812',
      address: 'Jl. Mawar',
    },
    items: [{ name: 'Oatmeal', price: 50000, qty: 2 }],
    note: null,
  },
  {
    id: 'ORD-002',
    createdAt: '2 Mei 2026',
    rawDate: '2026-05-02T00:00:00.000Z',
    totalPrice: 75000,
    status: 'DIKIRIM',
    paymentStatus: 'BERHASIL',
    customer: {
      name: 'Rafi',
      email: 'rafi@test.local',
      phone: null,
      address: null,
    },
    items: [{ name: 'Salad', price: 75000, qty: 1 }],
    note: null,
  },
];

describe('useOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    orderServiceMocks.fetchAdminOrders.mockResolvedValue(mockOrders);
  });

  it('should load orders and filter by search query and status', async () => {
    const { result } = renderHook(() => useOrders());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.filteredOrders).toHaveLength(2);

    act(() => {
      result.current.setSearchQuery('rafi');
      result.current.setStatusFilter('DIKIRIM');
    });

    expect(result.current.filteredOrders).toEqual([mockOrders[1]]);
  });

  it('should update order status locally after service success', async () => {
    orderServiceMocks.updateAdminOrderStatus.mockResolvedValue(undefined);
    const { result } = renderHook(() => useOrders());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateOrderStatus('ORD-001', 'DIPROSES');
    });

    expect(orderServiceMocks.updateAdminOrderStatus).toHaveBeenCalledWith(
      'ORD-001',
      'DIPROSES',
    );
    expect(result.current.orders[0].status).toBe('DIPROSES');
    expect(result.current.updatingOrderId).toBeNull();
  });

  it('should expose service errors without losing loaded state shape', async () => {
    orderServiceMocks.fetchAdminOrders.mockRejectedValue(
      new Error('Failed to load orders'),
    );

    const { result } = renderHook(() => useOrders());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Failed to load orders');
    expect(result.current.orders).toEqual([]);
  });
});
