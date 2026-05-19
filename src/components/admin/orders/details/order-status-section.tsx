import { OrderStatusDropdown } from '@/components/admin/orders/OrderStatusDropdown';
import { Badge } from '@/components/ui/badge';
import {
  AdminOrder,
  AdminOrderStatus,
  AdminPaymentStatus,
  PAYMENT_STATUS_LABELS,
} from '@/types/admin-orders';

const paymentTone: Record<AdminPaymentStatus, string> = {
  BERHASIL: 'bg-green-100 text-green-700',
  GAGAL: 'bg-red-100 text-red-700',
  TERTUNDA: 'bg-yellow-100 text-yellow-700',
  DIBATALKAN: 'bg-gray-100 text-gray-700',
  KADALUWARSA: 'bg-orange-100 text-orange-700',
};

type OrderStatusSectionProps = {
  order: AdminOrder;
  onStatusChange: (orderId: string, status: AdminOrderStatus) => void;
  isUpdating: boolean;
};

export function OrderStatusSection({
  order,
  onStatusChange,
  isUpdating,
}: OrderStatusSectionProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          Status Pembayaran
        </p>
        <Badge
          variant="outline"
          className={`rounded-full border-none px-3 py-1 text-[10px] font-black uppercase ${
            paymentTone[order.paymentStatus]
          }`}
        >
          {PAYMENT_STATUS_LABELS[order.paymentStatus]}
        </Badge>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          Status Pesanan
        </p>
        <OrderStatusDropdown
          value={order.status}
          paymentStatus={order.paymentStatus}
          onChange={(status) => onStatusChange(order.id, status)}
          disabled={isUpdating}
        />
      </div>
    </div>
  );
}
