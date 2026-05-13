'use client';

import { UserDetailModal } from '@/components/admin/users/UserDetailModal';
import { UserFilterBar } from '@/components/admin/users/UserFilterBar';
import { UserTable } from '@/components/admin/users/UserTable';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import { AdminUser } from '@/types/admin/users';
import { useState } from 'react';

export default function UserManagementPage() {
  const {
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshUsers,
  } = useUserManagement();

  // State untuk Modal Detail
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handler buka modal
  const handleOpenDetail = (user: AdminUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8faf7] p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            Kelola daftar pengguna, role, dan status akun NutriScale.
          </p>
        </div>

        {/* Action Bar (Search & Filter) */}
        <UserFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Tabel Data */}
        <UserTable
          users={users}
          isLoading={isLoading}
          onOpenDetail={handleOpenDetail}
        />

        {/* MODAL DETAIL USER */}
        <UserDetailModal
          user={selectedUser}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onRefresh={refreshUsers}
        />
      </div>
    </div>
  );
}
