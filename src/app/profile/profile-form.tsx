'use client'; // Wajib di paling atas
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authClient } from '@/lib/auth-client';
import { ArrowLeft, RefreshCw, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { updateProfile } from './actions';

// Typing untuk Props dari Server
interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
    image: string | null;
    umur: number;
    jenisKelamin: string;
    tinggiBadan: number;
    beratBadan: number;
    providerId: string;
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  // Hooks useState diijinkan disini karena status komponen "use client"
  const [gender, setGender] = useState(initialData.jenisKelamin || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { data: session, isPending } = authClient.useSession();

  const handleEditProfile = async (formData: FormData) => {
    setIsProcessing(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Karena komponen Select (shadcn) mungkin tidak mengirim nilainya otomatis dengan baik,
      // kita jamin dengan menambahkan statenya manual ke formData
      formData.set('jenisKelamin', gender);

      await updateProfile(formData);

      setSuccessMsg('Profil berhasil diperbarui!');
    } catch (error) {
      console.error('Gagal menyimpan profil:', error);
      setErrorMsg('Gagal menyimpan profil. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Style input disesuaikan agar font-nya bersih (font-sans) dan warna teks tidak terlalu tajam
  const inputStyle =
    'w-full bg-[#F3F4F6] border-0 rounded-xl h-12 px-4 focus:ring-1 focus:ring-gray-400 flex items-center justify-between font-sans text-sm md:text-base text-slate-700 shadow-none';

  return (
    <div className="min-h-screen bg-[#DDE5D6] px-6 md:px-20 py-12 font-sans antialiased">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 font-medium text-sm md:text-base"
      >
        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        Kembali ke Beranda
      </Link>

      {/* Header - Menggunakan tracking-tighter agar mirip NutriScale */}
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tighter">
        Profile Settings
      </h1>
      <p className="text-slate-600 mb-10 text-sm md:text-base">
        Manage your personal health information
      </p>

      {/* Profile Section */}
      <div className="flex items-center gap-6 mb-12">
        <Avatar className="w-20 h-20 md:w-24 md:h-24 border-2 border-white shadow-sm">
          <AvatarImage
            src={session?.user.image || '/avatar.jpg'}
            className="object-cover"
          />
          <AvatarFallback className="bg-slate-200">
            <User className="w-10 h-10 text-slate-500" />
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {initialData.name}
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-slate-500 text-sm md:text-base">
              {initialData.email}
            </p>
            {initialData.providerId === 'google' && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold text-slate-600 shadow-sm">
                <svg
                  width="12"
                  height="12"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
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
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                Google
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form
        action={handleEditProfile}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6"
      >
        {/* Kolom Kiri */}
        <div className="space-y-6">
          {/* Nama Lengkap */}
          <div className="space-y-2">
            {/* (Label dibuat lebih kecil (text-sm) dan semibold agar mirip gambar login) */}
            <Label className="text-sm md:text-base font-semibold text-slate-800 ml-1">
              Nama Lengkap
            </Label>
            <Input
              name="name"
              defaultValue={initialData.name || ''}
              placeholder="Masukkan nama lengkap"
              className={inputStyle}
            />
          </div>

          {/* Jenis Kelamin */}
          <div className="space-y-2">
            <Label className="text-sm md:text-base font-semibold text-slate-800 ml-1">
              Jenis Kelamin
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className={inputStyle}>
                <SelectValue placeholder="Pilih jenis kelamin" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={4}
                className="w-[var(--radix-select-trigger-width)] rounded-xl border-gray-200 bg-white font-sans"
              >
                <SelectItem value="LAKI_LAKI">Laki-laki</SelectItem>
                <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Umur */}
          <div className="space-y-2">
            <Label className="text-sm md:text-base font-semibold text-slate-800 ml-1">
              Umur
            </Label>
            <Input
              name="umur"
              type="number"
              defaultValue={initialData.umur || ''}
              placeholder="Masukkan umur"
              className={inputStyle}
              onKeyDown={(e) => {
                if (['e', 'E', '.', ','].includes(e.key)) e.preventDefault();
              }}
            />
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-6">
          {/* Tinggi Badan */}
          <div className="space-y-2">
            <Label className="text-sm md:text-base font-semibold text-slate-800 ml-1">
              Tinggi Badan (cm)
            </Label>
            <Input
              name="tinggiBadan"
              type="number"
              defaultValue={initialData.tinggiBadan || ''}
              placeholder="Masukkan tinggi badan"
              className={inputStyle}
              onKeyDown={(e) => {
                if (['e', 'E', ','].includes(e.key)) e.preventDefault();
              }}
            />
          </div>
          {/* Berat Badan */}
          <div className="space-y-2">
            <Label className="text-sm md:text-base font-semibold text-slate-800 ml-1">
              Berat Badan (kg)
            </Label>
            <Input
              name="beratBadan"
              type="number"
              defaultValue={initialData.beratBadan || ''}
              placeholder="Masukkan berat badan"
              className={inputStyle}
              onKeyDown={(e) => {
                if (['e', 'E', ','].includes(e.key)) e.preventDefault();
              }}
            />
          </div>
        </div>

        {/* Messages & Button */}
        <div className="col-span-1 md:col-span-2 flex flex-col items-center mt-10 space-y-4">
          {successMsg && (
            <p className="text-green-700 bg-green-50 px-5 py-2.5 rounded-xl text-sm font-medium border border-green-200 shadow-sm animate-in fade-in zoom-in duration-300">
              {successMsg}
            </p>
          )}
          {errorMsg && (
            <p className="text-red-700 bg-red-50 px-5 py-2.5 rounded-xl text-sm font-medium border border-red-200 shadow-sm animate-in fade-in zoom-in duration-300">
              {errorMsg}
            </p>
          )}

          <Button
            type="submit"
            className={`bg-[#1A1A1A] text-white px-16 py-7 text-lg font-bold rounded-2xl hover:bg-black/90 transition-all font-sans tracking-wide shadow-lg ${
              isProcessing ? 'opacity-80 cursor-not-allowed' : ''
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              'Edit Profile'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
