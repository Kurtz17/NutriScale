import { NotificationState } from '@/types/checkout';
import { ShieldCheck } from 'lucide-react';

interface CheckoutModalsProps {
  isConfirmOpen: boolean;
  onConfirmClose: () => void;
  onProcessPayment: () => void;
  notification: NotificationState | null;
  onNotificationClose: () => void;
}

export function CheckoutModals({
  isConfirmOpen,
  onConfirmClose,
  onProcessPayment,
  notification,
  onNotificationClose,
}: CheckoutModalsProps) {
  return (
    <>
      {/* Pop-up Konfirmasi Pesanan */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-black text-[#1A1A1B] mb-2 text-center">
              Konfirmasi Pesanan
            </h3>
            <p className="text-gray-500 text-center mb-8 font-medium">
              Apakah Anda yakin ingin memproses pesanan ini? Pastikan keranjang
              dan alamat pengiriman sudah sesuai.
            </p>
            <div className="flex gap-4">
              <button
                onClick={onConfirmClose}
                className="flex-1 py-4 rounded-2xl font-black text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={onProcessPayment}
                className="flex-1 py-4 rounded-2xl font-black text-white bg-[#1A1A1B] hover:bg-gray-800 transition-colors shadow-lg"
              >
                Ya, Proses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Notification Modal */}
      {notification?.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 flex flex-col items-center text-center">
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
              onClick={onNotificationClose}
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
