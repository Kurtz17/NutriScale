'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface UserDeleteSectionProps {
  isLoading: boolean;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  handleDelete: () => void;
}

export function UserDeleteSection({
  isLoading,
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleDelete,
}: UserDeleteSectionProps) {
  return (
    <div className="space-y-4">
      {!showDeleteConfirm ? (
        <Button
          variant="ghost"
          className="w-full rounded-2xl py-6 font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" /> Hapus Akun Permanen
        </Button>
      ) : (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center animate-in fade-in zoom-in duration-200">
          <p className="text-xs font-bold text-red-600 mb-3">
            Tindakan ini tidak bisa dibatalkan. Yakin?
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl text-xs font-bold bg-white"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Batal
            </Button>
            <Button
              className="flex-1 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700"
              disabled={isLoading}
              onClick={handleDelete}
            >
              {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
