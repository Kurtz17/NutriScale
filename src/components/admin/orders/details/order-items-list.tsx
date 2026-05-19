import { formatHarga } from '@/lib/utils';
import { AdminOrder } from '@/types/admin-orders';

type OrderItemsListProps = {
  items: AdminOrder['items'];
};

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
        Daftar Produk Pesanan
      </h3>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className="flex justify-between items-center bg-gray-50/40 p-4 rounded-2xl border border-gray-50"
          >
            <div>
              <p className="font-bold text-[#1A1A1B] text-sm">{item.name}</p>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">
                {formatHarga(item.price)} x {item.qty}
              </p>
            </div>
            <span className="text-sm font-black text-[#1A1A1B] font-mono">
              {formatHarga(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
