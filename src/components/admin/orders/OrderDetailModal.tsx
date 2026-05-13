'use client';

import { OrderStatusDropdown } from '@/components/admin/orders/OrderStatusDropdown';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AdminOrder,
  AdminOrderStatus,
  AdminPaymentStatus,
  PAYMENT_STATUS_LABELS,
} from '@/types/admin-orders';

interface OrderDetailModalProps {
  order: AdminOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (orderId: string, status: AdminOrderStatus) => void;
  isUpdating: boolean;
}

const paymentTone: Record<AdminPaymentStatus, string> = {
  BERHASIL: 'bg-green-100 text-green-700',
  GAGAL: 'bg-red-100 text-red-700',
  TERTUNDA: 'bg-yellow-100 text-yellow-700',
};

const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

export function OrderDetailModal({
  order,
  open,
  onOpenChange,
  onStatusChange,
  isUpdating,
}: OrderDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-[32px] p-0 border-none bg-white overflow-hidden shadow-2xl">
        {!order ? (
          <div className="p-8 text-center text-gray-500 font-bold">
            Detail pesanan tidak tersedia.
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="bg-[#f8faf7] p-8 border-b border-gray-100">
              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl font-black text-gray-900">
                  Order Details
                </DialogTitle>
                <DialogDescription className="text-gray-500 font-bold mt-1 text-xs">
                  {order.id} • {order.createdAt}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
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
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
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
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Informasi Customer
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Nama</span>
                    <span className="text-gray-900 font-bold">
                      {order.customer.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Email</span>
                    <span className="text-gray-900 font-bold">
                      {order.customer.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">Telepon</span>
                    <span className="text-gray-900 font-bold">
                      {order.customer.phone || '-'}
                    </span>
                  </div>
                  <div className="flex items-start justify-between text-sm gap-4">
                    <span className="text-gray-500 font-medium">Alamat</span>
                    <span className="text-gray-900 font-bold text-right">
                      {order.customer.address || '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  List Item Pesanan
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={`${item.name}-${idx}`}
                      className="flex justify-between items-center bg-gray-50/40 p-4 rounded-2xl border border-gray-50"
                    >
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium">
                          {formatCurrency(item.price)} x {item.qty}
                        </p>
                      </div>
                      <span className="text-sm font-black text-gray-900">
                        {formatCurrency(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Total Pembayaran
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">
                    Total
                  </span>
                  <span className="text-lg font-black text-gray-900">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Catatan Pesanan
                </h3>
                <p className="text-sm font-medium text-gray-600">
                  {order.note || 'Tidak ada catatan pesanan.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
