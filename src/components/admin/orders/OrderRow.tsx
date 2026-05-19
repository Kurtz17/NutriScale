'use client';

import { OrderStatusDropdown } from '@/components/admin/orders/OrderStatusDropdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AdminOrder,
  AdminOrderStatus,
  AdminPaymentStatus,
  PAYMENT_STATUS_LABELS,
} from '@/types/admin-orders';

interface OrderRowProps {
  order: AdminOrder;
  onOpenDetail: (order: AdminOrder) => void;
  onStatusChange: (orderId: string, status: AdminOrderStatus) => void;
  isUpdating: boolean;
}

const paymentTone: Record<AdminPaymentStatus, string> = {
  BERHASIL: 'bg-green-100 text-green-700',
  GAGAL: 'bg-red-100 text-red-700',
  TERTUNDA: 'bg-yellow-100 text-yellow-700',
  DIBATALKAN: 'bg-gray-100 text-gray-700',
  KADALUWARSA: 'bg-orange-100 text-orange-700',
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

export function OrderRow({
  order,
  onOpenDetail,
  onStatusChange,
  isUpdating,
}: OrderRowProps) {
  return (
    <tr className="border-b border-gray-50 hover:bg-[#f8faf7]/50 transition-colors">
      <td className="p-4">
        <p className="text-xs font-black text-gray-900 uppercase">{order.id}</p>
      </td>
      <td className="p-4">
        <div>
          <p className="font-bold text-gray-900 text-sm">
            {order.customer.name}
          </p>
          <p className="text-xs text-gray-400 font-medium">
            {order.customer.email}
          </p>
        </div>
      </td>
      <td className="p-4">
        <span className="text-sm font-medium text-gray-500">
          {order.createdAt}
        </span>
      </td>
      <td className="p-4">
        <span className="text-sm font-bold text-gray-700">
          {formatCurrency(order.totalPrice)}
        </span>
      </td>
      <td className="p-4">
        <Badge
          variant="outline"
          className={`rounded-full border-none px-3 py-1 text-[10px] font-black uppercase ${
            paymentTone[order.paymentStatus]
          }`}
        >
          {PAYMENT_STATUS_LABELS[order.paymentStatus]}
        </Badge>
      </td>
      <td className="p-4">
        <OrderStatusDropdown
          value={order.status}
          paymentStatus={order.paymentStatus}
          onChange={(status) => onStatusChange(order.id, status)}
          disabled={isUpdating}
        />
      </td>
      <td className="p-4 text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenDetail(order)}
          className="rounded-xl border-2 border-gray-100 font-bold hover:bg-gray-50 transition-all text-xs"
        >
          Detail
        </Button>
      </td>
    </tr>
  );
}
