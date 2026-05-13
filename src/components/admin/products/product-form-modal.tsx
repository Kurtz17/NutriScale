import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KATEGORI_OPTIONS } from '@/constants/admin/product';
import { type ProductFormData, type Produk } from '@/types/admin/product';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { FormField } from './form-field';

type ProductFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  editData?: Produk | null;
};

const emptyForm: ProductFormData = {
  name: '',
  category: '',
  calories: '',
  protein: '',
  harga: '',
  stok: '',
  label_risiko: '',
  image: '',
};

export default function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  editData,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name ?? '',
        category: editData.category ?? '',
        calories: editData.calories?.toString() ?? '',
        protein: editData.protein?.toString() ?? '',
        harga: editData.price?.toString() ?? '',
        stok: editData.stok?.toString() ?? '',
        label_risiko: editData.label_risiko ?? '',
        image: editData.image ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
  }, [editData, isOpen]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      setError('Nama produk wajib diisi.');
      return;
    }
    if (!form.harga || isNaN(Number(form.harga))) {
      setError('Harga harus berupa angka.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const url = isEdit
        ? `/api/admin/products/${editData?.id}`
        : `/api/admin/products`;
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaProduk: form.name,
          kategori: form.category,
          harga: Number(form.harga),
          stok: Number(form.stok),
          labelRisiko: form.label_risiko,
          gambar: form.image,
          nilaiGizi: {
            calories: Number(form.calories),
            protein: Number(form.protein),
          },
        }),
      });
      if (!res.ok) throw new Error();
      onSuccess(
        isEdit ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!',
      );
      onClose();
    } catch {
      setError('Gagal menyimpan data produk.');
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#1A1A1B]/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-50">
          <div>
            <h2 className="text-2xl font-black text-[#1A1A1B] tracking-tight">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              Informasi Nutrisi & Inventaris
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold px-6 py-4 rounded-2xl animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <FormField label="Product Name" required>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Organic Brown Rice"
              className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-[#7CB342]"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-gray-100 bg-gray-50/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7CB342] focus:bg-white transition-all"
              >
                <option value="">Select Category</option>
                {KATEGORI_OPTIONS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Nutrition Label">
              <Input
                name="label_risiko"
                value={form.label_risiko}
                onChange={handleChange}
                placeholder="e.g. High Fiber"
                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-[#7CB342]"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Calories (kcal)">
              <Input
                type="number"
                name="calories"
                value={form.calories}
                onChange={handleChange}
                placeholder="0"
                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 font-mono focus:bg-white focus:ring-[#7CB342]"
              />
            </FormField>
            <FormField label="Protein (g)">
              <Input
                type="number"
                name="protein"
                value={form.protein}
                onChange={handleChange}
                placeholder="0"
                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 font-mono focus:bg-white focus:ring-[#7CB342]"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price (IDR)" required>
              <Input
                type="number"
                name="harga"
                value={form.harga}
                onChange={handleChange}
                placeholder="0"
                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 font-mono focus:bg-white focus:ring-[#7CB342]"
              />
            </FormField>
            <FormField label="Stock">
              <Input
                type="number"
                name="stok"
                value={form.stok}
                onChange={handleChange}
                placeholder="0"
                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 font-mono focus:bg-white focus:ring-[#7CB342]"
              />
            </FormField>
          </div>

          <FormField label="Image URL / Emoji">
            <Input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://... or emoji 🍚"
              className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-[#7CB342]"
            />
          </FormField>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-50 flex gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl border-gray-100 font-bold hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 h-14 rounded-2xl bg-[#1A1A1B] text-white font-black hover:scale-105 transition-all shadow-xl disabled:opacity-50"
          >
            {isLoading
              ? 'Saving...'
              : isEdit
                ? 'Save Changes'
                : 'Create Product'}
          </Button>
        </div>
      </div>
    </div>
  );
}
