'use client';

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
import { RefreshCw, User } from 'lucide-react';
import { useState } from 'react';

export default function ProfileSettingsPage() {
  const [gender, setGender] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulasi proses edit profile (misalnya, bisa diganti dengan API call sebenarnya)
  const handleEditProfile = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  // Style input disesuaikan agar font-nya bersih (font-sans) dan warna teks tidak terlalu tajam
  const inputStyle =
    'w-full bg-[#F3F4F6] border-0 rounded-xl h-12 px-4 focus:ring-1 focus:ring-gray-400 flex items-center justify-between font-sans text-sm md:text-base text-slate-700 shadow-none';

  return (
    <div className="min-h-screen bg-[#DDE5D6] px-6 md:px-20 py-12 font-sans antialiased">
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
          <AvatarImage src="/avatar.jpg" className="object-cover" />
          <AvatarFallback className="bg-slate-200">
            <User className="w-10 h-10 text-slate-500" />
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            John Terry
          </h2>
          <p className="text-slate-500 text-sm md:text-base">
            johnterry@gmail.com
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {/* Kolom Kiri */}
        <div className="space-y-6">
          {/* Nama Lengkap */}
          <div className="space-y-2">
            {/* (Label dibuat lebih kecil (text-sm) dan semibold agar mirip gambar login) */}
            <Label className="text-sm md:text-base font-semibold text-slate-800 ml-1">
              Nama Lengkap
            </Label>
            <Input defaultValue="John Terry" className={inputStyle} />
          </div>

          {/* Jenis Kelamin */}
          <div className="space-y-2">
            <Label className="text-sm md:text-base font-semibold text-slate-800 ml-1">
              Jenis Kelamin
            </Label>
            <Select onValueChange={setGender}>
              <SelectTrigger className={inputStyle}>
                <SelectValue placeholder="Pilih jenis kelamin" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={4}
                className="w-[var(--radix-select-trigger-width)] rounded-xl border-gray-200 bg-white font-sans"
              >
                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                <SelectItem value="Perempuan">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Umur */}
          <div className="space-y-2">
            <Label className="text-sm md:text-base font-semibold text-slate-800 ml-1">
              Umur
            </Label>
            <Input
              type="number"
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
              type="number"
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
              type="number"
              placeholder="Masukkan berat badan"
              className={inputStyle}
              onKeyDown={(e) => {
                if (['e', 'E', ','].includes(e.key)) e.preventDefault();
              }}
            />
          </div>
        </div>
      </div>

      {/* Button Simpan */}
      <div className="flex justify-center mt-16">
        <Button
          className={`bg-[#1A1A1A] text-white px-16 py-7 text-lg font-bold rounded-2xl hover:bg-black/90 transition-all font-sans tracking-wide shadow-lg ${
            isProcessing ? 'opacity-80 cursor-not-allowed' : ''
          }`}
          onClick={handleEditProfile}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            'Edit Profile'
          )}
        </Button>
      </div>
    </div>
  );
}
