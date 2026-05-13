'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdminUser } from '@/types/admin/users';
import {
  Calendar,
  Mail,
  Power,
  Shield,
  Trash2,
  UserCircle,
} from 'lucide-react';
import { useState } from 'react';

interface UserDetailModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onOpenChange,
}: UserDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) return null;

  const isInactive =
    !user.lastOnline ||
    new Date().getTime() - new Date(user.lastOnline).getTime() >
      30 * 24 * 60 * 60 * 1000;

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
              {user.id}
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

            <div className="h-[1px] w-full bg-gray-100 my-4"></div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className={`w-full rounded-2xl py-6 font-bold border-2 transition-all ${
                  !user.banned
                    ? 'text-orange-600 border-orange-100 hover:bg-orange-50'
                    : 'text-green-600 border-green-100 hover:bg-green-50'
                }`}
                onClick={() => console.log('Ubah Status clicked')}
              >
                {!user.banned ? 'Nonaktifkan Akun Ini' : 'Aktifkan Akun Ini'}
              </Button>

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
                      onClick={() => console.log('Hapus clicked')}
                    >
                      Ya, Hapus
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
