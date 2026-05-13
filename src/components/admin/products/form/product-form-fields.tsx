import { Input } from '@/components/ui/input';
import { type ProductFormData } from '@/types/admin/product';

import { CategorySelect } from './category-select';
import { FormField } from './form-field';

type ProductFormFieldsProps = {
  form: ProductFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
};

export function ProductFormFields({ form, onChange }: ProductFormFieldsProps) {
  return (
    <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
      <FormField label="Product Name" required>
        <Input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="e.g. Organic Brown Rice"
          className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-[#7CB342]"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Category">
          <CategorySelect value={form.category} onChange={onChange} />
        </FormField>
        <FormField label="Nutrition Label">
          <Input
            name="label_risiko"
            value={form.label_risiko}
            onChange={onChange}
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
        <FormField label="Price (IDR)" required>
          <Input
            type="number"
            name="harga"
            value={form.harga}
            onChange={onChange}
            placeholder="0"
            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 font-mono focus:bg-white focus:ring-[#7CB342]"
          />
        </FormField>
        <FormField label="Stock">
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

      <FormField label="Image URL / Emoji">
        <Input
          name="image"
          value={form.image}
          onChange={onChange}
          placeholder="https://... or emoji 🍚"
          className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-[#7CB342]"
        />
      </FormField>
    </div>
  );
}
