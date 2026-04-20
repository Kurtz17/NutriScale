'use client';

import ActionButtons from '@/components/health-dashboard/components/action-buttons';
import AIInsightCard from '@/components/health-dashboard/components/ai-insight-card';
import CalorieChart from '@/components/health-dashboard/components/charts/calorie-chart';
import ProteinChart from '@/components/health-dashboard/components/charts/protein-chart';
import HealthStatus from '@/components/health-dashboard/components/health-status';
import HealthTip from '@/components/health-dashboard/components/health-tip';
import MealSection from '@/components/health-dashboard/components/meal-section';
import StatCard from '@/components/health-dashboard/components/stat-card';
import { Meal, Stat } from '@/components/health-dashboard/types';
import { useEffect, useState } from 'react';

export default function HealthDashboardPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [narasiAI, setNarasiAI] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/health-dashboard');
        if (res.ok) {
          const data = await res.json();
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E6EFE3]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E6EFE3] px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Health Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your nutritional journey</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) =>
            stat.title === 'Health Status' ? (
              <HealthStatus key={index} status={stat.value} />
            ) : (
              <StatCard key={index} stat={stat} />
            ),
          )}
        </div>

        {/* AI INSIGHT */}
        {narasiAI && (
          <div className="mb-8">
            <AIInsightCard narrative={narasiAI} />
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="mb-8">
          <ActionButtons />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CalorieChart />
          <ProteinChart />
        </div>

        {/* MEALS */}
        <div className="mb-8">
          <MealSection meals={meals} />
        </div>

        {/* HEALTH TIP */}
        <HealthTip />
      </div>
    </div>
  );
}
