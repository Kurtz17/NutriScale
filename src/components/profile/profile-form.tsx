'use client';

import ProfileFormContent from '@/components/profile/profile-form-content';
import ProfileHeader from '@/components/profile/profile-header';
import { Button } from '@/components/ui/button';
import { useProfileForm } from '@/hooks/useProfileForm';
import { ProfileData } from '@/types/profile';
import { Save, X } from 'lucide-react';

interface Props {
  initialData: ProfileData;
}

export default function ProfileForm({ initialData }: Props) {
  const {
    preview,
    notification,
    setNotification,
    isEditing,
    toggleEditing,
    isLoading,
    isGoogle,
    defaultInitial,
    handleImageChange,
    handleSubmit,
  } = useProfileForm(initialData);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <form onSubmit={handleSubmit} className="space-y-8">
        <ProfileHeader
          initialData={initialData}
          preview={preview}
          defaultInitial={defaultInitial}
          isEditing={isEditing}
          isGoogle={isGoogle}
          toggleEditing={toggleEditing}
          handleImageChange={handleImageChange}
        />

        <ProfileFormContent
          initialData={initialData}
          isEditing={isEditing}
          notification={notification}
          setNotification={setNotification}
        />

        {isEditing && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-500 z-50">
            <Button
              type="button"
              variant="outline"
              onClick={() => toggleEditing(false)}
              disabled={isLoading}
              className="px-8 py-7 text-base font-black rounded-2xl border-2 hover:bg-slate-50 transition-all flex gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#7CB342] hover:bg-[#689f38] text-white px-12 py-7 text-base font-black rounded-2xl shadow-xl shadow-green-900/10 flex gap-2 active:scale-95 transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isLoading ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
