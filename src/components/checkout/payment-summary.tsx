import { ShieldCheck } from 'lucide-react';

interface PaymentSummaryProps {
  totalCalories: number;
  subtotal: number;
  shipping: number;
  cartLength: number;
  isPending: boolean;
  onPayment: () => void;
}

export function PaymentSummary({
  totalCalories,
  subtotal,
  shipping,
  cartLength,
  isPending,
  onPayment,
}: PaymentSummaryProps) {
  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      <div className="bg-[#1A1A1B] text-white rounded-[2rem] p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-4 text-[#7CB342]">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            AI Nutrition Summary
          </span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-sm font-bold">Total Kalori</span>
          <span className="text-xl font-black text-[#7CB342]">
            {totalCalories} kcal
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
        <h3 className="font-black text-lg text-[#1A1A1B]">Ringkasan Tagihan</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium text-gray-400">
            <span>Subtotal ({cartLength} item)</span>
            <span>Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-400">
            <span>Ongkos Kirim</span>
            <span>Rp {shipping.toLocaleString('id-ID')}</span>
          </div>
          <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
            <span className="font-black text-[#1A1A1B]">Total Pembayaran</span>
            <span className="font-black text-[#1A1A1B] text-xl">
              Rp {(subtotal + shipping).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <button
          onClick={onPayment}
          disabled={isPending || cartLength === 0}
          className="w-full bg-[#1A1A1B] text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
        >
          {isPending ? 'Processing...' : 'Bayar Sekarang'}
        </button>
      </div>
    </div>
  );
}
