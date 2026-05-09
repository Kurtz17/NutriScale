import { updateProfile } from '@/actions/profile';
import { supabase } from '@/lib/supabase';
import { AddressData, ProfileData } from '@/types/profile';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export function useProfileForm(initialData: ProfileData) {
  const [preview, setPreview] = useState(initialData.image);
  const [notification, setNotification] = useState(initialData.notification);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isGoogle =
    initialData?.providerId === 'google' ||
    initialData?.email?.includes('gmail.com');

  const defaultInitial =
    initialData.username?.[0]?.toUpperCase() ||
    initialData.name?.[0]?.toUpperCase() ||
    'U';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${initialData.id}/Avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('Avatars')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('Avatars').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    let imageUrl = initialData.image;
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(
          'Gagal mengupload gambar. Pastikan bucket "avatars" sudah ada dan public.',
        );
        setIsLoading(false);
        return;
      }
    }

    const address: AddressData = {
      provinsi: (formData.get('provinsi') as string) || undefined,
      provinsiId: (formData.get('provinsiId') as string) || undefined,
      kabupaten: (formData.get('kabupaten') as string) || undefined,
      kabupatenId: (formData.get('kabupatenId') as string) || undefined,
      kecamatan: (formData.get('kecamatan') as string) || undefined,
      kecamatanId: (formData.get('kecamatanId') as string) || undefined,
      kelurahan: (formData.get('kelurahan') as string) || undefined,
      kelurahanId: (formData.get('kelurahanId') as string) || undefined,
      rt: (formData.get('rt') as string) || undefined,
      rw: (formData.get('rw') as string) || undefined,
      detailAlamat: (formData.get('detailAlamat') as string) || undefined,
      kodePos: (formData.get('kodePos') as string) || undefined,
    };

    const data = {
      name: formData.get('name') as string,
      username: formData.get('username') as string,
      tanggalLahir: formData.get('tanggalLahir') as string,
      phone: formData.get('phone') as string,
      address,
      notification,
      image: imageUrl,
    };

    const res = await updateProfile(data);
    setIsLoading(false);

    if (res.success) {
      setIsEditing(false);
      toast.success('Profil berhasil diperbarui!');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast.error(res.error || 'Gagal memperbarui profil');
    }
  };

  const toggleEditing = useCallback((val: boolean) => setIsEditing(val), []);

  return {
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
  };
}
