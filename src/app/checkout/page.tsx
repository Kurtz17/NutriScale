'use client';
import { CartItem } from '@/types/marketplace';
import {
  ChevronLeft,
  Info,
  MapPin,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('nutriscale-cart');

    setTimeout(() => {
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      setHasHydrated(true);
    }, 0);
  }, []);

  if (!hasHydrated) {
    return null; // mungkin nanti ada spinner loading kecil
  }
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalCalories = items.reduce(
    (acc, item) => acc + item.calories * item.quantity,
    0,
  );
  const shipping = 15000;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Kembali ke Marketplace</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* KIRI: Alamat & Pembayaran */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#E1EEDD] rounded-2xl">
                <ShoppingCart className="w-6 h-6 text-[#7CB342]" />
              </div>
              <h2 className="text-xl font-black text-[#1A1A1B]">
                Daftar Pesanan
              </h2>
            </div>

            <div className="space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                        {item.image}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1A1A1B]">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-400 font-medium">
                          {item.calories} kcal • {item.quantity} pcs
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#1A1A1B]">
                        Rp{' '}
                        {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4 italic">
                  Belum ada item pilihan.
                </p>
              )}
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#E1EEDD] rounded-2xl">
                <MapPin className="w-6 h-6 text-[#7CB342]" />
              </div>
              <h2 className="text-xl font-black text-[#1A1A1B]">
                Alamat Pengiriman
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama Penerima"
                className="bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#7CB342] outline-none"
              />
              <input
                type="text"
                placeholder="Nomor Telepon"
                className="bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#7CB342] outline-none"
              />
              <textarea
                placeholder="Alamat Lengkap (Jl. Raya Bandung-Sumedang, Jatinangor)"
                className="md:col-span-2 bg-gray-50 border-none rounded-2xl p-4 h-32 focus:ring-2 focus:ring-[#7CB342] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#1A1A1B] text-white rounded-[2rem] p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[#7CB342]">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                AI Nutrition Summary
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-6 font-medium">
              Rekapitulasi asupan gizi dari pesananmu:
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold">Total Kalori</span>
                <span className="text-xl font-black text-[#7CB342]">
                  {totalCalories} kcal
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
            <h3 className="font-black text-lg text-[#1A1A1B]">
              Ringkasan Tagihan
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-gray-400">
                <span>Subtotal ({items.length} item)</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-400">
                <span>Ongkos Kirim</span>
                <span>Rp {shipping.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
                <span className="font-black text-[#1A1A1B]">
                  Total Pembayaran
                </span>
                <span className="font-black text-[#1A1A1B] text-xl">
                  Rp {(subtotal + shipping).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={() => alert('Pesanan Berhasil!')}
              className="w-full bg-[#1A1A1B] text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
            >
              Bayar Sekarang
            </button>

            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter justify-center">
              <Info className="w-3 h-3" />
              Pesanan ini berkontribusi pada SDGs poin 2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
