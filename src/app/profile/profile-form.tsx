'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, User } from 'lucide-react';
import { useState } from 'react';

import AddressFields from './components/address-fields';

interface ProfileData {
  name: string;
  email: string;
  image: string;
  username: string;
  tanggalLahir: string;
  phone: string;
  address: unknown;
  notification: boolean;
  providerId?: string;
}

interface Props {
  initialData: ProfileData;
}

export default function ProfileForm({ initialData }: Props) {
  const [preview, setPreview] = useState(initialData.image);
  const [notification, setNotification] = useState(initialData.notification);

  // ✅ FIX: fallback cek provider
  const isGoogle =
    initialData?.providerId === 'google' ||
    initialData?.email?.includes('gmail.com');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const inputStyle =
    'w-full bg-[#F3F4F6] rounded-xl h-12 px-4 text-slate-700 mt-1';

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">
        Profile Settings
      </h1>

      {/* Avatar + Info */}
      <div className="flex items-center gap-6 mb-10">
        <label className="relative cursor-pointer">
          <Avatar className="w-24 h-24 border-2 border-white shadow-sm">
            <AvatarImage src={preview || '/avatar.jpg'} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>

          <div className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full">
            <Plus size={16} />
          </div>

          <input type="file" hidden onChange={handleImageChange} />
        </label>

        <div>
          <h2 className="text-xl font-bold">{initialData.name}</h2>

          <div className="flex items-center gap-2">
            <p className="text-slate-500">{initialData.email}</p>

            {/* ✅ FIX: pakai isGoogle */}
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
        <form className="grid md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <Label>Nama Lengkap</Label>
            <Input
              name="name"
              defaultValue={initialData.name}
              className={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <Label>Username</Label>
            <Input
              name="username"
              defaultValue={initialData.username}
              className={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <Label>Tanggal Lahir</Label>
            <Input
              type="date"
              name="tanggalLahir"
              defaultValue={initialData.tanggalLahir}
              className={inputStyle}
            />
          </div>

          <div className="space-y-1">
            <Label>Nomor Telepon</Label>
            <Input
              name="phone"
              defaultValue={initialData.phone}
              className={inputStyle}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label>Alamat</Label>
            <AddressFields initialData={initialData.address} />
          </div>

          <div className="flex items-center justify-between md:col-span-2 mt-2">
            <Label>Notifikasi</Label>
            <input
              type="checkbox"
              checked={notification}
              onChange={(e) => setNotification(e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          <div className="md:col-span-2 flex justify-end mt-6">
            <Button className="px-10 py-5 text-base rounded-xl">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
