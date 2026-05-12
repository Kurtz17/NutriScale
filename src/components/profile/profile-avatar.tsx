import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import React from 'react';

interface ProfileAvatarProps {
  preview: string;
  defaultInitial: string;
  isEditing: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileAvatar({
  preview,
  defaultInitial,
  isEditing,
  handleImageChange,
}: ProfileAvatarProps) {
  return (
    <label
      className={`relative inline-block ${isEditing ? 'cursor-pointer group' : 'cursor-default'}`}
    >
      <Avatar className="w-28 h-28 border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105">
        <AvatarImage src={preview || ''} className="object-cover" />
        <AvatarFallback className="text-3xl font-black bg-[#E1EEDD] text-green-700">
          {defaultInitial}
        </AvatarFallback>
      </Avatar>

      {isEditing && (
        <div className="absolute bottom-1 right-1 bg-green-600 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform duration-300 hover:scale-110">
          <Plus size={18} strokeWidth={3} />
        </div>
      )}

      <input
        type="file"
        hidden
        disabled={!isEditing}
        onChange={handleImageChange}
        accept="image/*"
      />
    </label>
  );
}
