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
    <div className="bg-white rounded-[2rem] border border-white/50 overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-gray-50">
              <th className="p-6 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                Info Pengguna
              </th>
              <th className="p-6 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                Role
              </th>
              <th className="p-6 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                Status
              </th>
              <th className="p-6 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                Tgl Bergabung
              </th>
              <th className="p-6 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                Terakhir Online
              </th>
              <th className="p-6 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                Aksi
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
