'use client';

import { AdminUser } from '@/types/admin/users';
import { useState } from 'react';
import { toast } from 'sonner';

export function useUserActions(
  user: AdminUser | null,
  onRefresh?: () => void,
  onOpenChange?: (open: boolean) => void,
) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBanForm, setShowBanForm] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('7'); // Default 7 days
  const [isLoading, setIsLoading] = useState(false);

  const handleBanStatus = async (shouldBan: boolean) => {
    if (!user) return;
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
        if (onOpenChange) onOpenChange(false);
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
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users?userId=${user.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Akun user berhasil dihapus permanen');
        if (onRefresh) onRefresh();
        if (onOpenChange) onOpenChange(false);
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

  return {
    showDeleteConfirm,
    setShowDeleteConfirm,
    showBanForm,
    setShowBanForm,
    banReason,
    setBanReason,
    banDuration,
    setBanDuration,
    isLoading,
    handleBanStatus,
    handleDelete,
  };
}
