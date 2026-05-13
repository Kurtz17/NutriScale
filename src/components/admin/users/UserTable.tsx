'use client';

import { AdminUser } from '@/types/admin/users';

import { UserTableRow } from './UserTableRow';

interface UserTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onOpenDetail: (user: AdminUser) => void;
}

export function UserTable({ users, isLoading, onOpenDetail }: UserTableProps) {
  return (
    <div className="bg-white rounded-[32px] p-2 sm:p-6 shadow-sm border border-gray-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b-2 border-gray-50">
              <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                User Info
              </th>
              <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Role
              </th>
              <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Join Date
              </th>
              <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Last Online
              </th>
              <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-10 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-bold">
                      Memuat data user...
                    </p>
                  </div>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onOpenDetail={onOpenDetail}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-10 text-center">
                  <p className="text-gray-400 font-bold">
                    Tidak ada data user yang sesuai.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
