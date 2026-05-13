import { Input } from '@/components/ui/input';
import React from 'react';

import { FormField } from './form-field';

type TagSectionProps = {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
};

const PREDEFINED_TAGS = [
  'Umum',
  'Anak Balita',
  'Ibu Hamil',
  'Pasca Operasi',
  'Rendah Gula',
  'Rendah Lemak',
  'Tinggi Protein',
  'Tinggi Serat',
  'Bebas Gluten',
  'Vegetarian',
];

export function TagSection({ tags, onAddTag, onRemoveTag }: TagSectionProps) {
  const [tagInput, setTagInput] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim()) {
        onAddTag(tagInput.trim());
        setTagInput('');
      }
    }
  };

  const allTags = [
    ...PREDEFINED_TAGS,
    ...tags.filter((t) => !PREDEFINED_TAGS.includes(t)),
  ];

  return (
    <FormField label="Tag Nutrisi (Pilih atau Ketik & Enter)">
      <div className="space-y-4 pt-2">
        {/* Input Manual */}
        <div className="relative">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik tag baru lalu tekan Enter..."
            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 pr-12 focus:bg-white focus:ring-[#7CB342]"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Enter
          </div>
        </div>

        {/* Daftar Pilihan */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isSelected = tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => (isSelected ? onRemoveTag(tag) : onAddTag(tag))}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#1A1A1B] text-white border-[#1A1A1B] shadow-lg scale-105'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-green-200 hover:bg-green-50/30'
                }`}
              >
                {tag}
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7CB342]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </FormField>
  );
}
