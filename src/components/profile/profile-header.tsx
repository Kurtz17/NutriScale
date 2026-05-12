import { Button } from '@/components/ui/button';
import { ProfileData } from '@/types/profile';
import { Edit3, Mail, ShieldCheck } from 'lucide-react';

import ProfileAvatar from './profile-avatar';

interface ProfileHeaderProps {
  initialData: ProfileData;
  preview: string;
  defaultInitial: string;
  isEditing: boolean;
  isGoogle: boolean;
  toggleEditing: (val: boolean) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileHeader({
  initialData,
  preview,
  defaultInitial,
  isEditing,
  isGoogle,
  toggleEditing,
  handleImageChange,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12 bg-white/40 p-8 rounded-[2.5rem] backdrop-blur-sm border border-white/50 shadow-sm">
      <ProfileAvatar
        preview={preview}
        defaultInitial={defaultInitial}
        isEditing={isEditing}
        handleImageChange={handleImageChange}
      />

      <div className="flex-1 text-center md:text-left space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {initialData.name}
          </h2>
          {isGoogle && (
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Account
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 font-bold">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-green-600" />
            <span>{initialData.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest text-green-700">
              Online Now
            </span>
          </div>
        </div>
      </div>

      {!isEditing && (
        <Button
          type="button"
          onClick={() => toggleEditing(true)}
          className="bg-black hover:bg-slate-800 text-white px-8 py-7 rounded-2xl font-black text-lg shadow-xl shadow-black/10 flex gap-2 active:scale-95 transition-all"
        >
          <Edit3 className="w-5 h-5" />
          Edit Profile
        </Button>
      )}
    </div>
  );
}
