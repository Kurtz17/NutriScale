import { CartItem } from '@/types/marketplace';
import { ShoppingCart } from 'lucide-react';

interface OrderListProps {
  items: CartItem[];
}

export function OrderList({ items }: OrderListProps) {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#E1EEDD] rounded-2xl">
          <ShoppingCart className="w-6 h-6 text-[#7CB342]" />
        </div>
        <h2 className="text-xl font-black text-[#1A1A1B]">Daftar Pesanan</h2>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{item.image}</span>
              <div>
                <h4 className="font-bold text-sm text-[#1A1A1B]">
                  {item.name}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase">
                  {item.quantity} pcs
                </p>
              </div>
            </div>
            <p className="font-black text-sm text-[#1A1A1B]">
              Rp {(item.price * item.quantity).toLocaleString('id-ID')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
