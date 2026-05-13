'use client';

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
import { AdminUser } from '@/types/admin/users';
import { AlertCircle, Clock, Gavel } from 'lucide-react';

interface UserBanSectionProps {
  user: AdminUser;
  isLoading: boolean;
  showBanForm: boolean;
  setShowBanForm: (show: boolean) => void;
  banReason: string;
  setBanReason: (reason: string) => void;
  banDuration: string;
  setBanDuration: (duration: string) => void;
  handleBanStatus: (shouldBan: boolean) => void;
}

export function UserBanSection({
  user,
  isLoading,
  showBanForm,
  setShowBanForm,
  banReason,
  setBanReason,
  banDuration,
  setBanDuration,
  handleBanStatus,
}: UserBanSectionProps) {
  return (
    <div className="space-y-6">
      {/* Ban Info Section if Banned */}
      {user.banned && (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 space-y-2">
          <div className="flex items-center gap-2 text-red-700 font-black text-xs uppercase tracking-widest">
            <AlertCircle className="w-4 h-4" /> Detail Blokir
          </div>
          <p className="text-sm text-gray-700 font-medium italic">
            &quot;{user.banReason || 'Tidak ada alasan spesifik'}&quot;
          </p>
          {user.banExpires && (
            <div className="flex items-center gap-2 text-xs text-red-600 font-bold">
              <Clock className="w-3 h-3" /> Berakhir pada:{' '}
              {new Date(user.banExpires).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          )}
        </div>
      )}

      {/* Ban Action Button or Form */}
      {user.banned ? (
        <Button
          variant="outline"
          disabled={isLoading}
          className="w-full rounded-2xl py-6 font-bold border-2 border-green-100 text-green-600 hover:bg-green-50 transition-all"
          onClick={() => handleBanStatus(false)}
        >
          {isLoading ? 'Memproses...' : 'Cabut Blokir Pengguna'}
        </Button>
      ) : !showBanForm ? (
        <Button
          variant="outline"
          className="w-full rounded-2xl py-6 font-bold border-2 border-orange-100 text-orange-600 hover:bg-orange-50 transition-all"
          onClick={() => setShowBanForm(true)}
        >
          <Gavel className="w-4 h-4 mr-2" /> Blokir Pengguna
        </Button>
      ) : (
        <div className="space-y-4 p-5 bg-orange-50/50 rounded-3xl border-2 border-dashed border-orange-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-orange-700 tracking-widest">
              Alasan Pemblokiran
            </Label>
            <Input
              placeholder="Contoh: Pelanggaran syarat & ketentuan..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="bg-white border-none rounded-xl shadow-sm h-11 text-sm focus-visible:ring-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-orange-700 tracking-widest">
              Durasi Blokir
            </Label>
            <Select value={banDuration} onValueChange={setBanDuration}>
              <SelectTrigger className="bg-white border-none rounded-xl shadow-sm h-11 text-sm focus:ring-orange-500">
                <SelectValue placeholder="Pilih Durasi" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                <SelectItem value="3">3 Hari</SelectItem>
                <SelectItem value="7">7 Hari</SelectItem>
                <SelectItem value="30">30 Hari</SelectItem>
                <SelectItem value="permanent">Permanen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              className="flex-1 rounded-xl font-bold text-gray-500"
              onClick={() => setShowBanForm(false)}
            >
              Batal
            </Button>
            <Button
              disabled={isLoading || !banReason}
              className="flex-2 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-md transition-all active:scale-95"
              onClick={() => handleBanStatus(true)}
            >
              {isLoading ? 'Memproses...' : 'Konfirmasi Blokir'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
