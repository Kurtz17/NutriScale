import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdminOrder, AdminOrderStatus } from '@/types/admin-orders';

import { OrderCustomerInfo } from './details/order-customer-info';
import { OrderItemsList } from './details/order-items-list';
import { OrderStatusSection } from './details/order-status-section';
import { OrderSummary } from './details/order-summary';

interface OrderDetailModalProps {
  order: AdminOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (orderId: string, status: AdminOrderStatus) => void;
  isUpdating: boolean;
}

export function OrderDetailModal({
  order,
  open,
  onOpenChange,
  onStatusChange,
  isUpdating,
}: OrderDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-[2rem] p-0 border-none bg-white overflow-hidden shadow-2xl">
        {!order ? (
          <div className="p-20 text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
              Detail pesanan tidak tersedia.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#f8faf7] p-8 border-b border-gray-100 shrink-0">
              <DialogHeader className="text-left">
                <DialogTitle className="text-3xl font-black text-[#1A1A1B] tracking-tighter">
                  Detail Pesanan
                </DialogTitle>
                <DialogDescription className="text-gray-400 font-bold mt-2 text-[10px] uppercase tracking-widest">
                  ID: {order.id} • {order.createdAt}
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              <OrderStatusSection
                order={order}
                onStatusChange={onStatusChange}
                isUpdating={isUpdating}
              />

              <OrderCustomerInfo customer={order.customer} />

              <OrderItemsList items={order.items} />

              <OrderSummary totalPrice={order.totalPrice} note={order.note} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
