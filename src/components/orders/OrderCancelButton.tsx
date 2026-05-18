'use client';

import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CancelConfirmationModal } from './CancelConfirmationModal';

interface OrderCancelButtonProps {
  rawDate: string;
  orderId: string;
  onCancel: () => void | Promise<void>;
}

export function OrderCancelButton({
  rawDate,
  orderId,
  onCancel,
}: OrderCancelButtonProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [canCancel, setCanCancel] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: 'error' | 'warning' | 'success';
  } | null>(null);

  useEffect(() => {
    const targetTime = new Date(rawDate).getTime() + 15 * 60 * 1000;

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setCanCancel(false);
        setTimeLeft('');
        return;
      }

      setCanCancel(true);
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(
        `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
      );
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [rawDate]);

  if (!canCancel) return null;

  const handleCancelClick = () => {
    setIsConfirmOpen(true);
  };

  const proceedCancel = async () => {
    setIsConfirmOpen(false);
    setIsCanceling(true);
    try {
      const res = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        onCancel();
      } else {
        const data = await res.json();
        setNotification({
          isOpen: true,
          message: data.error || 'Gagal membatalkan pesanan',
          type: 'error',
        });
      }
    } catch (err) {
      console.error(err);
      setNotification({
        isOpen: true,
        message: 'Terjadi kesalahan sistem',
        type: 'error',
      });
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        disabled={isCanceling}
        onClick={handleCancelClick}
        className="w-full mt-3 bg-red-600 text-white rounded-2xl border-none py-7 text-sm font-black hover:bg-red-700 transition-all shadow-sm flex items-center justify-between px-6 group"
      >
        <span>Batalkan Pesanan</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-red-200 group-hover:text-red-100">
            Sisa Waktu:
          </span>
          <span className="text-white bg-red-800/40 px-3 py-1 rounded-lg tabular-nums border border-red-700/50">
            {timeLeft}
          </span>
        </div>
      </Button>

      {/* Modal Konfirmasi Terpisah */}
      {isConfirmOpen && (
        <CancelConfirmationModal
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={proceedCancel}
        />
      )}

      {/* Universal Notification Modal */}
      {notification?.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-8 max-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 flex flex-col items-center text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                notification.type === 'error'
                  ? 'bg-red-100'
                  : notification.type === 'warning'
                    ? 'bg-yellow-100'
                    : 'bg-green-100'
              }`}
            >
              <ShieldCheck
                className={`w-8 h-8 ${
                  notification.type === 'error'
                    ? 'text-red-600'
                    : notification.type === 'warning'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                }`}
              />
            </div>
            <h3 className="text-xl font-black text-[#1A1A1B] mb-2">
              {notification.type === 'error'
                ? 'Oops! Terjadi Kesalahan'
                : notification.type === 'warning'
                  ? 'Perhatian'
                  : 'Berhasil'}
            </h3>
            <p className="text-gray-500 font-medium mb-8">
              {notification.message}
            </p>
            <button
              onClick={() => setNotification(null)}
              className="w-full py-4 rounded-2xl font-black text-white bg-[#1A1A1B] hover:bg-gray-800 transition-colors shadow-lg"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
