'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  AlertCircle,
  Calendar,
  Clock,
  Gavel,
  Mail,
  Power,
  Shield,
  Trash2,
  UserCircle,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UserDetailModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onOpenChange,
  onRefresh,
}: UserDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBanForm, setShowBanForm] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('7'); // Default 7 days
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const isInactive =
    !user.lastOnline ||
    new Date().getTime() - new Date(user.lastOnline).getTime() >
      30 * 24 * 60 * 60 * 1000;

  const handleBanStatus = async (shouldBan: boolean) => {
    setIsLoading(true);
    try {
      let expires = null;
      if (shouldBan && banDuration !== 'permanent') {
        const date = new Date();
        date.setDate(date.getDate() + parseInt(banDuration));
        expires = date.toISOString();
      }

      const response = await fetch('/api/admin/users/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          banned: shouldBan,
          reason: shouldBan ? banReason : null,
          expires: expires,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(
          shouldBan ? 'User berhasil dibanned' : 'Ban berhasil dicabut',
        );
        setShowBanForm(false);
        setBanReason('');
        if (onRefresh) onRefresh();
        onOpenChange(false);
      } else {
        toast.error(result.error || 'Gagal mengubah status ban');
      }
    } catch (error) {
      console.error('Ban error:', error);
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users?userId=${user.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Akun user berhasil dihapus permanen');
        if (onRefresh) onRefresh();
        onOpenChange(false);
      } else {
        toast.error(result.error || 'Gagal menghapus user');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[32px] p-0 border-none bg-white overflow-hidden shadow-2xl">
        <div className="flex flex-col">
          {/* Header Modal */}
          <div className="bg-[#f8faf7] p-8 text-center relative border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-green-600 mx-auto mb-4">
              <UserCircle className="w-10 h-10" />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-900">
              {user.name}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-gray-500 mt-1">
              ID: {user.id}
            </DialogDescription>
          </div>

          {/* Body Info */}
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail className="w-4 h-4" />{' '}
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Email
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Shield className="w-4 h-4" />{' '}
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Role
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 capitalize">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Calendar className="w-4 h-4" />{' '}
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Join Date
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Power className="w-4 h-4" />{' '}
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Status
                  </span>
                </div>
                <span
                  className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${
                    user.banned
                      ? 'bg-red-100 text-red-700'
                      : isInactive
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-green-100 text-green-700'
                  }`}
                >
                  {user.banned ? 'Banned' : isInactive ? 'Nonaktif' : 'Aktif'}
                </span>
              </div>
            </div>

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

            <div className="h-[1px] w-full bg-gray-100 my-4"></div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
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

              {!showDeleteConfirm ? (
                <Button
                  variant="ghost"
                  className="w-full rounded-2xl py-6 font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Hapus Akun Permanen
                </Button>
              ) : (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center animate-in fade-in zoom-in duration-200">
                  <p className="text-xs font-bold text-red-600 mb-3">
                    Tindakan ini tidak bisa dibatalkan. Yakin?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl text-xs font-bold bg-white"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      className="flex-1 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700"
                      disabled={isLoading}
                      onClick={handleDelete}
                    >
                      {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
