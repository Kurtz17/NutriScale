'use client';

import { OrderCard } from '@/components/orders/OrderCard';
import { OrderHistory } from '@/types/orders';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function OrderHistoryPage() {
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (res.ok) {
        setOrderHistory(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8faf7] p-6 lg:p-12 flex justify-center items-center font-sans">
        <p className="text-gray-500 font-bold">Memuat riwayat pesanan...</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
      <div className="max-w-7xl mx-auto px-4 py-10 pb-20 font-sans">
        <Link
          href="/marketplace"
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors group w-fit"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Kembali ke Marketplace</span>
        </Link>

        {/* Header - Simpel & Clean */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#1A1A1B] tracking-tight">
            Riwayat Pesanan
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            Pantau asupan nutrisi dari riwayat belanja sehatmu.
          </p>
        </div>

        {/* Daftar Kartu Pesanan */}
        <div className="flex flex-col gap-6">
          {orderHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-gray-50 shadow-sm text-center">
              <div className="text-7xl mb-6">🛒</div>
              <h2 className="text-2xl font-black text-[#1A1A1B] mb-2">
                Belum Ada Pesanan
              </h2>
              <p className="text-gray-400 font-medium text-sm max-w-xs">
                Riwayat pesananmu akan muncul di sini setelah kamu melakukan
                pembelian pertama.
              </p>
              <Link
                href="/marketplace"
                className="mt-8 inline-flex items-center gap-2 bg-[#1A1A1B] text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                Mulai Belanja
              </Link>
            </div>
          ) : (
            orderHistory.map((order) => (
              <OrderCard key={order.id} order={order} onRefresh={fetchOrders} />
            ))
          )}
        </div>

        {/* Footer Halaman */}
        <p className="mt-12 text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
          NutriScale • Your Healthy Life Companion
        </p>
      </div>
    </>
  );
}
