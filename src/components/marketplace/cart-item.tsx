import { CartItem as CartItemType } from '@/types/marketplace';
import { Minus, Plus, X } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string | number, quantity: number) => void;
  removeFromCart: (id: string | number) => void;
}

export default function CartItem({
  item,
  updateQuantity,
  removeFromCart,
}: CartItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 transition-all hover:bg-white hover:shadow-md group">
      <div className="bg-white rounded-xl w-14 h-14 flex items-center justify-center shrink-0 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
        <span className="text-3xl">{item.image}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {item.calories * item.quantity} kcal
          </span>
        </div>
        <p className="text-sm font-black text-gray-900 mt-1.5">
          Rp {(item.price * item.quantity).toLocaleString()}
        </p>
      </div>

      <div className="flex flex-col items-end gap-3 shrink-0">
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
          <button
            onClick={() =>
              item.quantity === 1
                ? removeFromCart(item.id)
                : updateQuantity(item.id, item.quantity - 1)
            }
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-sm font-black w-5 text-center text-gray-900">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={
              item.stok !== null && item.quantity >= (item.stok ?? Infinity)
            }
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-20"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
