'use client';
import { CartItem } from '@/types/marketplace';

export function SmartCart({
  items,
  onUpdateQty,
  onRemove,
  onCheckout,
}: {
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalCalories = items.reduce(
    (acc, item) => acc + item.calories * item.quantity,
    0,
  );

  // Logika Progress Bar (Asumsi target 2000 kcal)
  const calorieGoal = 2000;
  const progressPercent = Math.min((totalCalories / calorieGoal) * 100, 100);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl w-[320px] flex flex-col gap-6 sticky top-24 h-fit border border-gray-100">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-black text-[#1A1A1B]">Smart AI Cart</h2>
        <p className="text-gray-400 text-xs font-medium">
          Monitoring your health metrics
        </p>
      </div>

      <div className="bg-blue-50 rounded-3xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs font-bold">
            Total Calories
          </span>
          <span className="text-[#1A1A1B] font-black">
            {totalCalories} kcal
          </span>
        </div>
        <div className="w-full bg-blue-100 h-1.5 rounded-full overflow-hidden">
          {/* GUNAKAN STYLE INLINE BIAR LEBARNYA BERUBAH REAL-TIME */}
          <div
            className="bg-blue-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">check</span>
          {progressPercent >= 100 ? 'Goal Reached!' : 'Balanced selection'}
        </p>
      </div>

      {/* Cart Items List - Fix max-h class */}
      <div className="flex flex-col gap-4 max-h-100 overflow-y-auto pr-2">
        {items.length === 0 && (
          <p className="text-gray-400 text-xs text-center py-10 italic">
            Keranjang kosong
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center group">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl border border-gray-100">
              {item.image}
            </div>
            <div className="flex-1">
              <h4 className="text-[11px] font-bold text-[#1A1A1B] leading-tight truncate">
                {item.name}
              </h4>
              <p className="text-[9px] text-gray-400">
                {item.calories} kcal × {item.quantity}
              </p>
              <p className="text-xs font-black mt-0.5">
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
              {/* LOGIKA: Jika qty 1, panggil onRemove, jika > 1 panggil onUpdateQty */}
              <button
                onClick={() =>
                  item.quantity === 1
                    ? onRemove(item.id)
                    : onUpdateQty(item.id, -1)
                }
                className="w-5 h-5 flex items-center justify-center hover:text-red-500 text-xs"
              >
                <span className="material-symbols-outlined text-sm">
                  {item.quantity === 1 ? 'delete' : 'remove'}
                </span>
              </button>
              <span className="text-xs font-bold w-4 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQty(item.id, 1)}
                className="w-5 h-5 flex items-center justify-center hover:text-green-600 text-xs"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-200 pt-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-bold text-sm">Subtotal</span>
          <span className="text-[#1A1A1B] font-black text-lg">
            Rp {subtotal.toLocaleString('id-ID')}
          </span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full bg-[#1A1A1B] text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
