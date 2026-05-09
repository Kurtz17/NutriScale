import { DashboardData, Meal, Stat } from '@/types/health-dashboard';
import { useEffect, useState } from 'react';

export function useHealthDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [narasiAI, setNarasiAI] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/health-dashboard');
        if (res.ok) {
          const data: DashboardData = await res.json();
          setStats(data.stats || []);
          setMeals(data.meals || []);
          setNarasiAI(data.narasiAI || '');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    stats,
    meals,
    narasiAI,
    isLoading,
  };
}
