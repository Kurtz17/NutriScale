import { formatHarga } from '@/lib/utils';

type OrderSummaryProps = {
  totalPrice: number;
  note: string | null;
};

export function OrderSummary({ totalPrice, note }: OrderSummaryProps) {
  return (
    <div className="space-y-8">
      {/* Total Bayar */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          Ringkasan Pembayaran
        </h3>
        <div className="flex items-center justify-between p-6 bg-[#1A1A1B] rounded-[1.5rem] shadow-lg">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
            Total Bayar
          </span>
          <span className="text-2xl font-black text-[#7CB342] font-mono">
            {formatHarga(totalPrice)}
          </span>
        </div>
      </div>

      {/* Catatan */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          Catatan Pesanan
        </h3>
        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 min-h-[80px]">
          <p className="text-sm font-medium text-gray-600 leading-relaxed">
            {note || 'Tidak ada catatan pesanan.'}
          </p>
        </div>
      </div>
    </div>
  );
}
