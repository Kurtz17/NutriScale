import { Input } from '@/components/ui/input';
import { type ProductFormData } from '@/types/admin/product';
import React from 'react';

import { CategorySelect } from './category-select';
import { FormField } from './form-field';
import { TagSection } from './tag-section';

type ProductFormFieldsProps = {
  form: ProductFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
};

export function ProductFormFields({
  form,
  onChange,
  onAddTag,
  onRemoveTag,
}: ProductFormFieldsProps) {
  return (
    <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
      <FormField label="Nama Produk" required>
        <Input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Contoh: Beras Merah Organik"
          className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-[#7CB342]"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Kategori">
          <CategorySelect value={form.category} onChange={onChange} />
        </FormField>
        <FormField label="Label Risiko">
          <Input
            name="label_risiko"
            value={form.label_risiko}
            onChange={onChange}
            placeholder="Contoh: Risiko Diabetes Tinggi"
            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-[#7CB342]"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Kalori (kkal)">
          <Input
            type="number"
            name="calories"
            value={form.calories}
            onChange={onChange}
            placeholder="0"
            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 font-mono focus:bg-white focus:ring-[#7CB342]"
          />
        </FormField>
        <FormField label="Protein (g)">
          <Input
            type="number"
            name="protein"
            value={form.protein}
            onChange={onChange}
            placeholder="0"
            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 font-mono focus:bg-white focus:ring-[#7CB342]"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Harga (Rp)" required>
          <Input
            type="number"
            name="harga"
            value={form.harga}
            onChange={onChange}
            placeholder="0"
            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 font-mono focus:bg-white focus:ring-[#7CB342]"
          />
        </FormField>
        <FormField label="Stok">
          <Input
            type="number"
            name="stok"
            value={form.stok}
            onChange={onChange}
            placeholder="0"
            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 font-mono focus:bg-white focus:ring-[#7CB342]"
          />
        </FormField>
      </div>

      <FormField label="URL Gambar / Emoji">
        <Input
          name="image"
          value={form.image}
          onChange={onChange}
          placeholder="https://... atau emoji 🍚"
          className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-[#7CB342]"
        />
      </FormField>

      <TagSection
        tags={form.tags}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />
    </div>
  );
}
