import { AdminUser, UserStatus } from '@/types/admin/users';
import { useEffect, useMemo, useState } from 'react';

export function useUserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus>('All');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        const result = await response.json();
        if (result.success) {
          setUsers(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      let userStatus: UserStatus = 'Aktif';
      if (user.banned) {
        userStatus = 'Banned';
      } else if (!user.lastOnline) {
        userStatus = 'Nonaktif';
      } else {
        const lastOnlineDate = new Date(user.lastOnline);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        if (lastOnlineDate < oneMonthAgo) {
          userStatus = 'Nonaktif';
        }
      }

      const matchStatus =
        statusFilter === 'All' ? true : userStatus === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [users, searchQuery, statusFilter]);

  return {
    users: filteredUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    refreshUsers: async () => {
      setIsLoading(true);
      // Fetch logic again if needed
    },
  };
}
