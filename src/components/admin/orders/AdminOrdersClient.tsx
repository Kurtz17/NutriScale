'use client';

import { OrderDetailModal } from '@/components/admin/orders/OrderDetailModal';
import { OrderFilters } from '@/components/admin/orders/OrderFilters';
import { OrdersTable } from '@/components/admin/orders/OrdersTable';
import { useOrders } from '@/hooks/useOrders';
import { useMemo, useState } from 'react';

export default function AdminOrdersClient() {
  const {
    orders,
    filteredOrders,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshOrders,
    updateOrderStatus,
    updatingOrderId,
  } = useOrders();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) || null,
    [orders, selectedOrderId],
  );

  const isDetailOpen = Boolean(selectedOrderId);

  return (
    <>
      <OrderFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <OrdersTable
        orders={filteredOrders}
        isLoading={isLoading}
        error={error}
        onRetry={refreshOrders}
        onOpenDetail={(order) => setSelectedOrderId(order.id)}
        onStatusChange={updateOrderStatus}
        updatingOrderId={updatingOrderId}
      />

      <OrderDetailModal
        order={selectedOrder}
        open={isDetailOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrderId(null);
          }
        }}
        onStatusChange={updateOrderStatus}
        isUpdating={selectedOrder?.id === updatingOrderId}
      />
    </>
  );
}
