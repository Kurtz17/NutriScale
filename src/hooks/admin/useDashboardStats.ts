import { DashboardData } from '@/types/admin/dashboard';
import { useEffect, useState } from 'react';

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7d');

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/dashboard?range=${range}`);
        const json = await response.json();

        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error('Gagal sinkronisasi API Admin:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, [range]);

  return { stats, loading, range, setRange };
}
