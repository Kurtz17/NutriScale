'use client';

import { Button as UIButton } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { OrderHistory } from '@/types/orders';
import { Activity, Calendar, ChevronRight, Package } from 'lucide-react';

import { OrderDetailSheet } from './OrderDetailSheet';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: OrderHistory;
  onRefresh: () => void | Promise<void>;
}

export function OrderCard({ order, onRefresh }: OrderCardProps) {
  return (
    <Card className="border border-gray-50 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden bg-white">
      <CardContent className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Info ID & Tanggal */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-2xl ${
                  order.status === 'SELESAI'
                    ? 'bg-green-100'
                    : order.status === 'DIBATALKAN' || order.status === 'GAGAL'
                      ? 'bg-red-100'
                      : order.status === 'TERTUNDA'
                        ? 'bg-yellow-100'
                        : 'bg-blue-100'
                }`}
              >
                <Package
                  className={`w-6 h-6 ${
                    order.status === 'SELESAI'
                      ? 'text-green-600'
                      : order.status === 'DIBATALKAN' ||
                          order.status === 'GAGAL'
                        ? 'text-red-600'
                        : order.status === 'TERTUNDA'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                  }`}
                />
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
              <OrderStatusBadge status={order.status} />

              <div className="bg-[#1A1A1B] text-white px-4 py-1.5 rounded-full border-none flex gap-1.5 items-center hover:bg-gray-800 transition-colors text-[10px] font-bold">
                <Activity className="w-3 h-3 text-[#7CB342]" />
                <span>{order.totalCalories} kcal</span>
              </div>
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

            <div className="flex flex-col gap-2">
              {order.status === 'TERTUNDA' && order.snapToken && (
                <UIButton
                  onClick={() => {
                    if (window.snap && order.snapToken) {
                      window.snap.pay(order.snapToken, {
                        onSuccess: () => onRefresh(),
                        onPending: () => onRefresh(),
                        onError: () => onRefresh(),
                        onClose: () => onRefresh(),
                      });
                    }
                  }}
                  className="rounded-2xl bg-[#7CB342] hover:bg-[#689f38] text-white transition-all font-bold px-7 w-full shadow-md"
                >
                  Bayar Sekarang
                </UIButton>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <UIButton
                    variant="outline"
                    className="rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all font-bold px-7 group text-[#1A1A1B] w-full"
                  >
                    Details{' '}
                    <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </UIButton>
                </SheetTrigger>

                <OrderDetailSheet order={order} onRefresh={onRefresh} />
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
