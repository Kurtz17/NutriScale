'use client';

import ActionButtons from './components/action-buttons';
import CalorieChart from './components/charts/calorie-chart';
import ProteinChart from './components/charts/protein-chart';
import HealthStatus from './components/health-status';
import HealthTip from './components/health-tip';
import MealSection from './components/meal-section';
import StatCard from './components/stat-card';
import { stats } from './data/dummy-data';

export default function HealthDashboardPage() {
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
          <MealSection />
        </div>

        {/* HEALTH TIP */}
        <HealthTip />
      </div>
    </div>
  );
}
