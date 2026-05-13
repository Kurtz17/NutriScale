'use client';

import { authClient } from '@/lib/auth-client';
import { useEffect } from 'react';

const UPDATE_INTERVAL = 1000 * 60 * 60; // 1 hour

export default function ActivityProvider() {
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session?.user?.id || session.user.role === 'admin') return;

    const storageKey = `last_activity_update_${session.user.id}`;
    const lastUpdate = localStorage.getItem(storageKey);
    const now = Date.now();

    if (!lastUpdate || now - parseInt(lastUpdate) > UPDATE_INTERVAL) {
      fetch('/api/auth/touch', { method: 'POST' })
        .then((res) => {
          if (res.ok) {
            localStorage.setItem(storageKey, now.toString());
          }
        })
        .catch((err) => console.error('Failed to update activity:', err));
    }
  }, [session]);

  return null;
}
