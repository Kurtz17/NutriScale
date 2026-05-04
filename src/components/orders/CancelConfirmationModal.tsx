'use client';

import { Activity } from 'lucide-react';

interface CancelConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export function CancelConfirmationModal({
  onClose,
  onConfirm,
}: CancelConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 flex flex-col text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
          <Activity className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-black text-[#1A1A1B] mb-2">
          Batalkan Pesanan?
        </h3>
        <p className="text-gray-500 font-medium mb-8 text-sm">
          Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak
          dapat diurungkan.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-black text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Kembali
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 rounded-2xl font-black text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg"
          >
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}
