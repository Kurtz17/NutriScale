'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Activity,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type OrderItem = {
  name: string;
  price: number;
  qty: number;
};

type OrderHistory = {
  id: string;
  date: string;
  totalPrice: number;
  totalCalories: number;
  status: string;
  items: OrderItem[];
};

export default function OrderHistoryPage() {
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
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
    }
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8faf7] p-6 lg:p-12 flex justify-center items-center">
        <p className="text-gray-500 font-bold">Memuat riwayat pesanan...</p>
      </div>
    );
  }

  return (
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
        {orderHistory.map((order) => (
          <Card
            key={order.id}
            className="border border-gray-50 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden bg-white"
          >
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Info ID & Tanggal */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#E1EEDD] rounded-2xl">
                      <Package className="w-6 h-6 text-[#7CB342]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        {order.id}
                      </p>
                      <div className="flex items-center gap-2 text-[#1A1A1B] mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#7CB342]" />
                        <span className="text-sm font-bold">{order.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={`px-4 py-1.5 rounded-full font-bold border-none text-xs ${
                        order.status === 'SELESAI'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'DIPROSES' ||
                              order.status === 'DIKIRIM'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.status === 'SELESAI'
                        ? '✓ Selesai'
                        : order.status === 'DIKIRIM'
                          ? '● Sedang Dikirim'
                          : order.status === 'DIPROSES'
                            ? '● Sedang Diproses'
                            : '● Menunggu Pembayaran'}
                    </Badge>

                    <Badge className="bg-[#1A1A1B] text-white px-4 py-1.5 rounded-full border-none flex gap-1.5 items-center hover:bg-gray-800 transition-colors">
                      <Activity className="w-3 h-3 text-[#7CB342]" />
                      <span className="text-xs font-bold">
                        {order.totalCalories} kcal
                      </span>
                    </Badge>
                  </div>
                </div>

                {/* Ringkasan Barang (Preview) */}
                <div className="flex-1 lg:px-10">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest">
                    Preview Items
                  </p>
                  <p className="text-[#1A1A1B] font-medium line-clamp-1 italic text-sm">
                    {order.items.map((i) => i.name).join(', ')}
                  </p>
                </div>

                {/* Harga & Tombol Detail */}
                <div className="flex items-center justify-between lg:flex-col lg:items-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div className="lg:text-right">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      Total Bill
                    </p>
                    <p className="text-xl font-black text-[#1A1A1B] leading-tight">
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all font-bold px-7 group text-[#1A1A1B]"
                      >
                        Details{' '}
                        <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </SheetTrigger>

                    <SheetContent className="w-full sm:max-w-md border-none p-0 bg-white shadow-2xl overflow-hidden">
                      <div className="h-full flex flex-col font-sans">
                        {/* Header Detail */}
                        <div className="p-8 bg-[#E1EEDD]/40">
                          <SheetHeader className="text-left">
                            <SheetTitle className="text-2xl font-black text-[#1A1A1B]">
                              Order Details
                            </SheetTitle>
                            <SheetDescription className="text-gray-600 font-bold flex items-center gap-2 mt-1">
                              <span className="bg-white/80 px-2 py-0.5 rounded-lg border border-white/50 text-[11px] uppercase">
                                {order.id}
                              </span>
                              <span>•</span>
                              <span className="text-xs">{order.date}</span>
                            </SheetDescription>
                          </SheetHeader>
                        </div>

                        {/* Konten Scrollable */}
                        <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                          {/* Tracking Sederhana */}
                          <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                              Status
                            </h3>
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-3 h-3 rounded-full ring-4 ${order.status === 'SELESAI' ? 'bg-[#7CB342] ring-[#E1EEDD]' : order.status === 'DIKIRIM' || order.status === 'DIPROSES' ? 'bg-blue-400 ring-blue-50' : 'bg-yellow-400 ring-yellow-50'}`}
                                ></div>
                                <div className="w-0.5 h-10 bg-gray-100 mt-1"></div>
                              </div>
                              <div>
                                <p className="font-bold text-[#1A1A1B] text-sm">
                                  {order.status === 'SELESAI'
                                    ? 'Pesanan Sudah Sampai'
                                    : order.status === 'DIKIRIM'
                                      ? 'Pesanan Sedang Dikirim'
                                      : order.status === 'DIPROSES'
                                        ? 'Pesanan Sedang Disiapkan'
                                        : 'Menunggu Pembayaran'}
                                </p>
                                <p className="text-xs text-gray-500 font-medium">
                                  {order.status === 'SELESAI'
                                    ? 'Pesanan telah diterima dengan baik.'
                                    : 'Kurir akan segera memperbarui status pengiriman.'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Rincian Barang Lengkap */}
                          <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                              Items Summary
                            </h3>
                            <div className="space-y-3">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center bg-gray-50/40 p-4 rounded-2xl border border-gray-50"
                                >
                                  <div className="flex-1">
                                    <p className="font-bold text-[#1A1A1B] text-sm">
                                      {item.name}
                                    </p>
                                    <p className="text-[11px] text-gray-400 font-medium">
                                      Rp {item.price.toLocaleString('id-ID')} x{' '}
                                      {item.qty}
                                    </p>
                                  </div>
                                  <span className="text-sm font-black text-[#1A1A1B]">
                                    Rp{' '}
                                    {(item.price * item.qty).toLocaleString(
                                      'id-ID',
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Alamat Pengiriman */}
                          <div className="p-5 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-[#7CB342]" />{' '}
                              Shipping Address
                            </h3>
                            <p className="text-[11px] font-bold text-[#1A1A1B] leading-relaxed">
                              Pondok NutriScale, Blok A-12, <br />
                              Jln. Kesehatan Raya, Kota Bandung, 40123
                            </p>
                          </div>
                        </div>

                        {/* Footer: Rincian Biaya & Tombol Support */}
                        <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter">
                              <span>Subtotal Items</span>
                              <span>
                                Rp {order.totalPrice.toLocaleString('id-ID')}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter">
                              <span>Shipping Fee</span>
                              <span className="text-[#7CB342]">FREE</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-[#1A1A1B] pt-3 border-t border-gray-200">
                              <span>Grand Total</span>
                              <span>
                                Rp {order.totalPrice.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>

                          {/* Tombol Support yang lebih aman/simpel */}
                          <Button
                            variant="outline"
                            className="w-full rounded-2xl border-2 border-gray-200 text-[#1A1A1B] py-7 text-sm font-black hover:bg-white transition-all shadow-sm"
                          >
                            <MessageCircle className="w-4 h-4 mr-2 text-[#7CB342]" />{' '}
                            Hubungi Customer Service
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Halaman */}
      <p className="mt-12 text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
        NutriScale • Your Healthy Life Companion
      </p>
    </div>
  );
}
