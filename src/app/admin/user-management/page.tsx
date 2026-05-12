'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Filter,
  Mail,
  Power,
  Search,
  Shield,
  Trash2,
  UserCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Mock Data Sementara
const mockUsers = [
  {
    id: '1',
    name: 'Zahran Muntazar',
    email: 'zahran@nutriscale.com',
    role: 'Admin',
    status: 'Aktif',
    joinDate: '01 Mei 2026',
  },
  {
    id: '2',
    name: 'Jannatul Sabila',
    email: 'sabila@example.com',
    role: 'User',
    status: 'Aktif',
    joinDate: '03 Mei 2026',
  },
  {
    id: '3',
    name: 'Budi Santoso',
    email: 'budi.s@example.com',
    role: 'User',
    status: 'Nonaktif',
    joinDate: '05 Mei 2026',
  },
  {
    id: '4',
    name: 'Raymond Frans',
    email: 'raymond@nutriscale.com',
    role: 'Admin',
    status: 'Aktif',
    joinDate: '06 Mei 2026',
  },
  {
    id: '5',
    name: 'Arya Rafi',
    email: 'arya@example.com',
    role: 'User',
    status: 'Nonaktif',
    joinDate: '08 Mei 2026',
  },
];

// Define Type
type User = (typeof mockUsers)[0];

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // State untuk Modal Detail & Delete Confirmation
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fitur Search & Filter
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === 'All' ? true : user.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchQuery, statusFilter]);

  // Handler buka modal
  const handleOpenDetail = (user: User) => {
    setSelectedUser(user);
    setShowDeleteConfirm(false); // Reset status konfirmasi tiap buka modal
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

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Cari nama atau email..."
              className="pl-11 rounded-2xl border-none shadow-sm h-12 bg-white focus-visible:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto bg-white p-1.5 rounded-2xl shadow-sm overflow-x-auto">
            <Filter className="w-4 h-4 text-gray-400 ml-2 hidden sm:block" />
            {['All', 'Aktif', 'Nonaktif'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-black text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Data */}
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
                  <th className="p-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-50 hover:bg-[#f8faf7]/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                            <UserCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-400 font-medium">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-bold text-gray-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg ${
                            user.status === 'Aktif'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-gray-500">
                          {user.joinDate}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {/* Tombol Detail untuk memicu Modal */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDetail(user)}
                          className="rounded-xl border-2 border-gray-100 font-bold hover:bg-gray-50 transition-all text-xs"
                        >
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center">
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

        {/* MODAL DETAIL USER  */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md rounded-[32px] p-0 border-none bg-white overflow-hidden shadow-2xl">
            {selectedUser && (
              <div className="flex flex-col">
                {/* Header Modal */}
                <div className="bg-[#f8faf7] p-8 text-center relative border-b border-gray-100">
                  <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-green-600 mx-auto mb-4">
                    <UserCircle className="w-10 h-10" />
                  </div>
                  <DialogTitle className="text-2xl font-black text-gray-900">
                    {selectedUser.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm font-medium text-gray-500 mt-1">
                    {selectedUser.id}
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
                        {selectedUser.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-500">
                        <Shield className="w-4 h-4" />{' '}
                        <span className="text-xs font-bold uppercase tracking-widest">
                          Role
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {selectedUser.role}
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
                        {selectedUser.joinDate}
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
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${selectedUser.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>

                  <div className="h-[1px] w-full bg-gray-100 my-4"></div>

                  {/* Action Buttons (Tombol Aktifkan/Nonaktifkan & Hapus) */}
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      className={`w-full rounded-2xl py-6 font-bold border-2 transition-all ${
                        selectedUser.status === 'Aktif'
                          ? 'text-orange-600 border-orange-100 hover:bg-orange-50'
                          : 'text-green-600 border-green-100 hover:bg-green-50'
                      }`}
                      onClick={() => console.log('Ubah Status clicked')} // Placeholder
                    >
                      {selectedUser.status === 'Aktif'
                        ? 'Nonaktifkan Akun Ini'
                        : 'Aktifkan Akun Ini'}
                    </Button>

                    {/* Konfirmasi Hapus Akun */}
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
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
