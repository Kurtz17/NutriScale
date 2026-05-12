'use client';

import { fetchAdminOrders, updateAdminOrderStatus } from '@/services/orders';
import {
  AdminOrder,
  AdminOrderStatus,
  AdminOrderStatusFilter,
} from '@/types/admin-orders';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<AdminOrderStatusFilter>('ALL');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'ALL' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const updateOrderStatus = useCallback(
    async (orderId: string, status: AdminOrderStatus) => {
      setUpdatingOrderId(orderId);
      setError(null);
      try {
        await updateAdminOrderStatus(orderId, status);
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update order status',
        );
      } finally {
        setUpdatingOrderId(null);
      }
    },
    [],
  );

  return {
    orders,
    filteredOrders,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshOrders: loadOrders,
    updateOrderStatus,
    updatingOrderId,
  };
}
