import { Button } from '@/components/ui/button';

type ProductFormActionsProps = {
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isEdit: boolean;
};

export function ProductFormActions({
  onCancel,
  onSubmit,
  isLoading,
  isEdit,
}: ProductFormActionsProps) {
  return (
    <div className="p-8 border-t border-gray-50 flex gap-4">
      <Button
        variant="outline"
        onClick={onCancel}
        className="flex-1 h-14 rounded-2xl border-gray-100 font-bold hover:bg-gray-50"
      >
        Batal
      </Button>
      <Button
        onClick={onSubmit}
        disabled={isLoading}
        className="flex-1 h-14 rounded-2xl bg-[#1A1A1B] text-white font-black hover:scale-105 transition-all shadow-xl disabled:opacity-50"
      >
        {isLoading
          ? 'Menyimpan...'
          : isEdit
            ? 'Simpan Perubahan'
            : 'Tambah Produk'}
      </Button>
    </div>
  );
}
