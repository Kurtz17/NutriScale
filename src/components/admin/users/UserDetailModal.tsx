'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUserActions } from '@/hooks/admin/useUserActions';
import { AdminUser } from '@/types/admin/users';

import { UserBanSection } from './detail/UserBanSection';
import { UserDeleteSection } from './detail/UserDeleteSection';
import { UserHeader } from './detail/UserHeader';
import { UserInfoGrid } from './detail/UserInfoGrid';

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
  const {
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
  } = useUserActions(user, onRefresh, onOpenChange);

  if (!user) return null;

  const isInactive =
    !user.lastOnline ||
    new Date().getTime() - new Date(user.lastOnline).getTime() >
      30 * 24 * 60 * 60 * 1000;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[32px] p-0 border-none bg-white overflow-hidden shadow-2xl">
        <div className="flex flex-col">
          <UserHeader name={user.name} id={user.id} />

          <div className="p-8 space-y-6">
            <UserInfoGrid user={user} isInactive={isInactive} />

            <div className="h-[1px] w-full bg-gray-100 my-4"></div>

            <UserBanSection
              user={user}
              isLoading={isLoading}
              showBanForm={showBanForm}
              setShowBanForm={setShowBanForm}
              banReason={banReason}
              setBanReason={setBanReason}
              banDuration={banDuration}
              setBanDuration={setBanDuration}
              handleBanStatus={handleBanStatus}
            />

            <UserDeleteSection
              isLoading={isLoading}
              showDeleteConfirm={showDeleteConfirm}
              setShowDeleteConfirm={setShowDeleteConfirm}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
