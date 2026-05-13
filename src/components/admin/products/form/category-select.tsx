import { KATEGORI_OPTIONS } from '@/constants/admin/product';

type CategorySelectProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <select
      name="category"
      value={value}
      onChange={onChange}
      className="w-full h-12 px-4 border border-gray-100 bg-gray-50/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7CB342] focus:bg-white transition-all"
    >
      <option value="">Pilih Kategori</option>
      {KATEGORI_OPTIONS.map((k) => (
        <option key={k} value={k}>
          {k}
        </option>
      ))}
    </select>
  );
}
