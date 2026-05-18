'use client';

import { OrderCancelButton } from '@/components/orders/OrderCancelButton';
import { Button } from '@/components/ui/button';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { OrderHistory } from '@/types/orders';
import { MapPin, MessageCircle } from 'lucide-react';

interface OrderDetailSheetProps {
  order: OrderHistory;
  onRefresh: () => void | Promise<void>;
}

export function OrderDetailSheet({ order, onRefresh }: OrderDetailSheetProps) {
  return (
    <SheetContent className="w-full sm:max-w-md border-none p-0 bg-white shadow-2xl overflow-hidden font-sans">
      <div className="h-full flex flex-col">
        {/* Header Detail */}
        <div className="p-8 bg-[#E1EEDD]/40">
          <SheetHeader className="text-left">
            <SheetTitle className="text-2xl font-black text-[#1A1A1B]">
              Order Details
            </SheetTitle>
            <SheetDescription className="text-gray-600 font-bold flex items-center gap-2 mt-1 text-xs">
              <span className="bg-white/80 px-2 py-0.5 rounded-lg border border-white/50 text-[11px] uppercase">
                {order.id}
              </span>
              <span>•</span>
              <span>{order.date}</span>
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
                  className={`w-3 h-3 rounded-full ring-4 ${
                    order.status === 'SELESAI'
                      ? 'bg-green-500 ring-green-50'
                      : order.status === 'DIBATALKAN' ||
                          order.status === 'GAGAL'
                        ? 'bg-red-500 ring-red-50'
                        : order.status === 'TERTUNDA'
                          ? 'bg-yellow-400 ring-yellow-50'
                          : 'bg-blue-400 ring-blue-50'
                  }`}
                ></div>
                <div className="w-0.5 h-10 bg-gray-100 mt-1"></div>
              </div>
              <div>
                <p className="font-bold text-[#1A1A1B] text-sm">
                  {order.status === 'SELESAI'
                    ? 'Pesanan Sudah Sampai'
                    : order.status === 'DIBATALKAN'
                      ? 'Pesanan Dibatalkan'
                      : order.status === 'GAGAL'
                        ? 'Pembayaran Gagal/Expired'
                        : order.status === 'DIKIRIM'
                          ? 'Pesanan Sedang Dikirim'
                          : order.status === 'DIPROSES'
                            ? 'Pesanan Sedang Disiapkan'
                            : 'Menunggu Pembayaran'}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  {order.status === 'SELESAI'
                    ? 'Pesanan telah diterima dengan baik.'
                    : order.status === 'DIBATALKAN'
                      ? 'Pesanan telah dibatalkan.'
                      : order.status === 'GAGAL'
                        ? 'Waktu pembayaran telah habis.'
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
                      Rp {item.price.toLocaleString('id-ID')} x {item.qty}
                    </p>
                  </div>
                  <span className="text-sm font-black text-[#1A1A1B]">
                    Rp {(item.price * item.qty).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alamat Pengiriman */}
          <div className="p-5 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <MapPin className="w-3 h-3 text-[#7CB342]" /> Shipping Address
            </h3>
            {order.alamatKirim ? (
              <p className="text-[11px] font-bold text-[#1A1A1B] leading-relaxed">
                {order.alamatKirim.name} ({order.alamatKirim.phone})
                <br />
                {order.alamatKirim.address}
              </p>
            ) : (
              <p className="text-[11px] font-bold text-[#1A1A1B] leading-relaxed">
                Pondok NutriScale, Blok A-12, <br />
                Jln. Kesehatan Raya, Kota Bandung, 40123
              </p>
            )}
          </div>
        </div>

        {/* Footer: Rincian Biaya & Tombol Support */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter">
              <span>Subtotal Items</span>
              <span>
                Rp {(order.totalPrice - 15000).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter">
              <span>Shipping Fee</span>
              <span className="text-[#1A1A1B]">Rp 15.000</span>
            </div>
            <div className="flex justify-between text-lg font-black text-[#1A1A1B] pt-3 border-t border-gray-200">
              <span>Grand Total</span>
              <span>Rp {order.totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full rounded-2xl border-2 border-gray-200 text-[#1A1A1B] py-7 text-sm font-black hover:bg-white transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4 mr-2 text-[#7CB342]" /> Hubungi
            Customer Service
          </Button>

          {order.status === 'TERTUNDA' && (
            <OrderCancelButton
              rawDate={order.rawDate}
              orderId={order.id}
              onCancel={onRefresh}
            />
          )}
        </div>
      </div>
    </SheetContent>
  );
}
