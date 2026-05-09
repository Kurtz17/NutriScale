import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toTitleCase } from '@/hooks/useRegionData';

interface RegionItem {
  id: string;
  name: string;
}

interface RegionSelectProps {
  label: string;
  value: string;
  onValueChange: (val: string) => void;
  items: RegionItem[];
  loading: boolean;
  disabled: boolean;
  placeholder: string;
  emptyPlaceholder: string;
}

export default function RegionSelect({
  label,
  value,
  onValueChange,
  items,
  loading,
  disabled,
  placeholder,
  emptyPlaceholder,
}: RegionSelectProps) {
  const inputStyle =
    'w-full bg-[#F8FAFC] rounded-2xl h-14 px-5 text-slate-800 font-bold border-2 border-slate-100 focus:border-[#7CB342] focus:ring-0 transition-all disabled:opacity-50 disabled:bg-slate-50 disabled:border-slate-50';

  return (
    <div className="space-y-2">
      <Label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
        {label}
      </Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || loading}
      >
        <SelectTrigger className={inputStyle}>
          <SelectValue
            placeholder={
              loading
                ? 'Memuat...'
                : items.length === 0 && !loading
                  ? emptyPlaceholder
                  : placeholder
            }
          />
        </SelectTrigger>
        <SelectContent className="rounded-2xl p-2 shadow-xl border-none">
          {items.map((item) => (
            <SelectItem
              key={item.id}
              value={item.id}
              className="rounded-xl py-3 px-4 font-medium cursor-pointer"
            >
              {toTitleCase(item.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
