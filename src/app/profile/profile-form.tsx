'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { updateProfile } from './actions';
import AddressFields from './components/address-fields';
import { AddressData } from './types';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  image: string;
  username: string;
  tanggalLahir: string;
  phone: string;
  address: AddressData;
  notification: boolean;
  providerId?: string;
}

interface Props {
  initialData: ProfileData;
}

export default function ProfileForm({ initialData }: Props) {
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
        alert(
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
      alert('Profil berhasil diperbarui!');
      window.location.reload();
    } else {
      alert(res.error || 'Gagal memperbarui profil');
    }
  };

  const inputStyle =
    'w-full bg-[#F3F4F6] rounded-xl h-12 px-4 text-slate-700 mt-1 disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Avatar + Info */}
        <div className="flex items-center gap-6 mb-10">
          <label
            className={`relative ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Avatar className="w-24 h-24 border-2 border-white shadow-sm">
              <AvatarImage src={preview || ''} />
              <AvatarFallback className="text-2xl font-bold bg-[#E1EEDD] text-green-700">
                {defaultInitial}
              </AvatarFallback>
            </Avatar>

            {isEditing && (
              <div className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full">
                <Plus size={16} />
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

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold">{initialData.name}</h2>
              {!isEditing && (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="ml-auto px-6 py-2 rounded-xl"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <p className="text-slate-500">{initialData.email}</p>

              {isGoogle && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold text-slate-600 shadow-sm">
                  <svg width="12" height="12" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  Google
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CONTAINER FORM */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <Label>Nama Lengkap</Label>
              <Input
                name="name"
                defaultValue={initialData.name}
                disabled={!isEditing}
                className={inputStyle}
              />
            </div>

            <div className="space-y-1">
              <Label>Username</Label>
              <Input
                name="username"
                defaultValue={initialData.username}
                disabled={!isEditing}
                className={inputStyle}
              />
            </div>

            <div className="space-y-1">
              <Label>Tanggal Lahir</Label>
              <Input
                type="date"
                name="tanggalLahir"
                defaultValue={initialData.tanggalLahir}
                disabled={!isEditing}
                className={inputStyle}
              />
            </div>

            <div className="space-y-1">
              <Label>Nomor Telepon</Label>
              <Input
                name="phone"
                defaultValue={initialData.phone}
                disabled={!isEditing}
                className={inputStyle}
              />
            </div>

            <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Alamat Lengkap
              </h3>
              <AddressFields
                initialData={initialData.address}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between md:col-span-2 mt-2">
              <Label>Notifikasi</Label>
              <input
                type="checkbox"
                checked={notification}
                onChange={(e) => setNotification(e.target.checked)}
                disabled={!isEditing}
                className="w-5 h-5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {isEditing && (
              <div className="md:col-span-2 flex justify-end mt-6 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                  className="px-6 py-5 text-base rounded-xl"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-10 py-5 text-base rounded-xl"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
