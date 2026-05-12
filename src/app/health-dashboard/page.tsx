'use client';

import ActionButtons from '@/components/health-dashboard/components/action-buttons';
import AIInsightCard from '@/components/health-dashboard/components/ai-insight-card';
import HealthStatus from '@/components/health-dashboard/components/health-status';
import HealthTip from '@/components/health-dashboard/components/health-tip';
import MealSection from '@/components/health-dashboard/components/meal-section';
import StatCard from '@/components/health-dashboard/components/stat-card';
import { useHealthDashboard } from '@/hooks/useHealthDashboard';

export default function HealthDashboardPage() {
  const { stats, meals, narasiAI, isLoading } = useHealthDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E6EFE3]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#7CB342] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#1A1A1B] font-bold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E6EFE3] px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#1A1A1B]">
            Health Dashboard
          </h1>
          <p className="text-gray-500 font-bold mt-1">
            Track your nutritional journey
          </p>
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
