'use client';

import { OrderRow } from '@/components/admin/orders/OrderRow';
import { Button } from '@/components/ui/button';
import { AdminOrder, AdminOrderStatus } from '@/types/admin-orders';

interface OrdersTableProps {
  orders: AdminOrder[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onOpenDetail: (order: AdminOrder) => void;
  onStatusChange: (orderId: string, status: AdminOrderStatus) => void;
  updatingOrderId: string | null;
}

const TABLE_HEADERS = [
  { label: 'Order ID' },
  { label: 'Nama User' },
  { label: 'Tanggal Pesanan' },
  { label: 'Total Harga' },
  { label: 'Status Pembayaran' },
  { label: 'Status Pesanan' },
  { label: 'Action', alignRight: true },
];

export function OrdersTable({
  orders,
  isLoading,
  error,
  onRetry,
  onOpenDetail,
  onStatusChange,
  updatingOrderId,
}: OrdersTableProps) {
  const renderState = (content: React.ReactNode) => (
    <tr>
      <td colSpan={7} className="p-10 text-center">
        {content}
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-[32px] p-2 sm:p-6 shadow-sm border border-gray-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b-2 border-gray-50">
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header.label}
                  className={`p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest ${
                    header.alignRight ? 'text-right' : ''
                  }`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              renderState(
                <p className="text-gray-400 font-bold animate-pulse">
                  Memuat data pesanan...
                </p>,
              )}

            {!isLoading &&
              error &&
              renderState(
                <div className="space-y-3">
                  <p className="text-red-500 font-bold">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-2 border-gray-100 font-bold"
                    onClick={onRetry}
                  >
                    Coba lagi
                  </Button>
                </div>,
              )}

            {!isLoading &&
              !error &&
              orders.length === 0 &&
              renderState(
                <p className="text-gray-400 font-bold">
                  Belum ada pesanan yang sesuai.
                </p>,
              )}

            {!isLoading &&
              !error &&
              orders.length > 0 &&
              orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onOpenDetail={onOpenDetail}
                  onStatusChange={onStatusChange}
                  isUpdating={updatingOrderId === order.id}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
