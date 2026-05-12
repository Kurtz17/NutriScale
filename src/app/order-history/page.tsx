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
  ChevronRight,
  MapPin,
  MessageCircle,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// Data Riwayat Pesanan
const orderHistory = [
  {
    id: 'ORD-2026-9901',
    date: '18 April 2026',
    totalPrice: 125000,
    totalCalories: 850,
    status: 'Processing',
    items: [
      { name: 'Fresh Chicken Breast', price: 45000, qty: 1 },
      { name: 'Organic Brown Rice', price: 25000, qty: 2 },
      { name: 'Honey', price: 30000, qty: 1 },
    ],
  },
  {
    id: 'ORD-2026-8842',
    date: '15 April 2026',
    totalPrice: 45000,
    totalCalories: 420,
    status: 'Completed',
    items: [
      { name: 'Greek Yogurt', price: 25000, qty: 1 },
      { name: 'Sweet Potato', price: 20000, qty: 1 },
    ],
  },
];

export default function OrderHistoryPage() {
  return (
    <div className="min-h-screen bg-[#f8faf7] p-6 lg:p-12">
      <div className="max-w-4xl mx-auto font-sans">
        <Link
          href="/marketplace"
          className="flex items-center w-fit gap-2 text-sm font-bold text-gray-400 hover:text-green-600 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Marketplace
        </Link>

        {/* Header - Simpel & Clean */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Order History
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            Pantau asupan nutrisi dari riwayat belanja sehatmu.
          </p>
        </div>

        {/* Daftar Kartu Pesanan */}
        <div className="flex flex-col gap-5">
          {orderHistory.map((order) => (
            <Card
              key={order.id}
              className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-[32px] overflow-hidden bg-white"
            >
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Info ID & Tanggal */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 bg-gray-50 rounded-2xl text-gray-400">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                          {order.id}
                        </p>
                        <div className="flex items-center gap-2 text-gray-700 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-sm font-bold">
                            {order.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={`px-4 py-1.5 rounded-full font-bold border-none text-xs ${
                          order.status === 'Processing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {order.status === 'Processing'
                          ? '● Sedang Diproses'
                          : '✓ Selesai'}
                      </Badge>

                      <Badge className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full border-none flex gap-1.5 items-center hover:bg-blue-100 transition-colors">
                        <Activity className="w-3 h-3" />
                        <span className="text-xs font-bold">
                          {order.totalCalories} kcal
                        </span>
                      </Badge>
                    </div>
                  </div>

                  {/* Ringkasan Barang (Preview) */}
                  <div className="flex-1 lg:px-10">
                    <p className="text-[10px] font-black text-gray-300 uppercase mb-1.5 tracking-widest">
                      Preview Items
                    </p>
                    <p className="text-gray-600 font-medium line-clamp-1 italic text-sm">
                      {order.items.map((i) => i.name).join(', ')}
                    </p>
                  </div>

                  {/* Harga & Tombol Detail */}
                  <div className="flex items-center justify-between lg:flex-col lg:items-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
                    <div className="lg:text-right">
                      <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">
                        Total Bill
                      </p>
                      <p className="text-xl font-black text-gray-900 leading-tight">
                        Rp {order.totalPrice.toLocaleString()}
                      </p>
                    </div>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-2xl border-2 border-gray-50 hover:bg-gray-50 transition-all font-bold px-7 group"
                        >
                          Details{' '}
                          <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </SheetTrigger>

                      <SheetContent className="w-full sm:max-w-md border-none p-0 bg-white shadow-2xl overflow-hidden">
                        <div className="h-full flex flex-col font-sans">
                          {/* Header Detail */}
                          <div className="p-8 bg-[#e2eddb]/40">
                            <SheetHeader className="text-left">
                              <SheetTitle className="text-2xl font-black text-gray-900">
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
                              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">
                                Status
                              </h3>
                              <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`w-3 h-3 rounded-full ring-4 ${order.status === 'Processing' ? 'bg-yellow-400 ring-yellow-50' : 'bg-green-400 ring-green-50'}`}
                                  ></div>
                                  <div className="w-0.5 h-10 bg-gray-100 mt-1"></div>
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-sm">
                                    {order.status === 'Processing'
                                      ? 'Pesanan Sedang Disiapkan'
                                      : 'Pesanan Sudah Sampai'}
                                  </p>
                                  <p className="text-xs text-gray-500 font-medium">
                                    Kurir akan segera memperbarui status
                                    pengiriman.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Rincian Barang Lengkap */}
                            <div>
                              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">
                                Items Summary
                              </h3>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center bg-gray-50/40 p-4 rounded-2xl border border-gray-50"
                                  >
                                    <div className="flex-1">
                                      <p className="font-bold text-gray-800 text-sm">
                                        {item.name}
                                      </p>
                                      <p className="text-[11px] text-gray-400 font-medium">
                                        Rp {item.price.toLocaleString()} x{' '}
                                        {item.qty}
                                      </p>
                                    </div>
                                    <span className="text-sm font-black text-blue-600">
                                      Rp{' '}
                                      {(item.price * item.qty).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Alamat Pengiriman */}
                            <div className="p-5 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl">
                              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> Shipping Address
                              </h3>
                              <p className="text-[11px] font-bold text-gray-700 leading-relaxed">
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
                                  Rp {order.totalPrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                <span>Shipping Fee</span>
                                <span className="text-green-600">FREE</span>
                              </div>
                              <div className="flex justify-between text-lg font-black text-gray-900 pt-3 border-t border-gray-200">
                                <span>Grand Total</span>
                                <span>
                                  Rp {order.totalPrice.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Tombol Support yang lebih aman/simpel */}
                            <Button
                              variant="outline"
                              className="w-full rounded-2xl border-2 border-gray-200 text-gray-700 py-7 text-sm font-black hover:bg-white transition-all shadow-sm"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" /> Hubungi
                              Customer Service
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
    </div>
  );
}
