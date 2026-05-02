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

// Variasi waktu makan per hari agar tidak monoton
const DAY_VARIATIONS = [
  {
    pagi: '07:00 AM',
    snackPagi: '10:00 AM',
    siang: '12:30 PM',
    snackSore: '03:30 PM',
    malam: '07:00 PM',
  },
  {
    pagi: '07:30 AM',
    snackPagi: '10:30 AM',
    siang: '01:00 PM',
    snackSore: '04:00 PM',
    malam: '07:30 PM',
  },
  {
    pagi: '06:30 AM',
    snackPagi: '09:30 AM',
    siang: '12:00 PM',
    snackSore: '03:00 PM',
    malam: '06:30 PM',
  },
  {
    pagi: '07:00 AM',
    snackPagi: '10:00 AM',
    siang: '01:30 PM',
    snackSore: '04:30 PM',
    malam: '07:00 PM',
  },
  {
    pagi: '08:00 AM',
    snackPagi: '11:00 AM',
    siang: '01:00 PM',
    snackSore: '04:00 PM',
    malam: '08:00 PM',
  },
  {
    pagi: '07:00 AM',
    snackPagi: '10:00 AM',
    siang: '12:30 PM',
    snackSore: '03:30 PM',
    malam: '07:00 PM',
  },
  {
    pagi: '07:30 AM',
    snackPagi: '10:30 AM',
    siang: '01:00 PM',
    snackSore: '04:00 PM',
    malam: '07:30 PM',
  },
];

// Rotasi pilihan makanan per hari — menggeser index dari array tiap sesi
function generateMealsForDay(baseMeals: Meal[], day: number): Meal[] {
  if (baseMeals.length === 0) return [];
  const variation = DAY_VARIATIONS[(day - 1) % DAY_VARIATIONS.length];
  const times = [
    variation.pagi,
    variation.snackPagi,
    variation.siang,
    variation.snackSore,
    variation.malam,
  ];

  // Geser urutan makanan berdasarkan hari
  // Contoh: day 1 → [0,1,2,3,4], day 2 → [1,2,3,4,0], dst
  return baseMeals.map((meal, i) => {
    const shift = (day - 1 + i) % baseMeals.length;
    const sourceMeal = baseMeals[shift];
    return {
      ...sourceMeal,
      time: times[i],
      type: meal.type, // pertahankan tipe sesi (Breakfast tetap Breakfast)
    };
  });
}

export default function HealthDashboardPage() {
  const [baseMeals, setBaseMeals] = useState<Meal[]>([]);
  const [narasiAI, setNarasiAI] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const [activeDay, setActiveDay] = useState(1);

  const [checkedByDay, setCheckedByDay] = useState<Record<number, Set<string>>>(
    () => {
      try {
        const saved = localStorage.getItem('checkedByDay');
        if (!saved) return {};
        const parsed = JSON.parse(saved) as Record<number, string[]>;
        return Object.fromEntries(
          Object.entries(parsed).map(([day, keys]) => [day, new Set(keys)]),
        );
      } catch {
        return {};
      }
    },
  );

  const [targetCalories, setTargetCalories] = useState(2000);
  const [targetProtein, setTargetProtein] = useState(50);
  const [hazValue, setHazValue] = useState('0.0 SD');
  const [hazStatus, setHazStatus] = useState('No Data');
  const [healthStatus, setHealthStatus] = useState('No Data Yet');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/health-dashboard');
        if (res.ok) {
          const data = await res.json();
          setBaseMeals(data.meals || []);
          setNarasiAI(data.narasiAI || '');

          const calStat = (data.stats || []).find(
            (s: Stat) => s.title === 'Daily Calories',
          );
          const proStat = (data.stats || []).find(
            (s: Stat) => s.title === 'Protein Intake',
          );
          const hazStat = (data.stats || []).find(
            (s: Stat) => s.title === 'WHO Z-Score (HAZ)',
          );
          const healthStat = (data.stats || []).find(
            (s: Stat) => s.title === 'Health Status',
          );

          if (calStat?.value) {
            const parts = calStat.value.split('/');
            if (parts[1]) setTargetCalories(parseFloat(parts[1].trim()));
          }
          if (proStat?.value) {
            const parts = proStat.value.split('/');
            if (parts[1])
              setTargetProtein(parseFloat(parts[1].replace('g', '').trim()));
          }
          if (hazStat?.value) setHazValue(hazStat.value);
          if (hazStat?.status) setHazStatus(hazStat.status || 'Normal');
          if (healthStat?.value) setHealthStatus(healthStat.value);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Ganti hari — checklist hari lain TIDAK direset
  const handleDayChange = (day: number) => {
    setActiveDay(day);
  };

  // Toggle ceklis — disimpan per hari
  const handleToggleMeal = (mealKey: string) => {
    setCheckedByDay((prev) => {
      const currentSet = new Set(prev[activeDay] || []);
      if (currentSet.has(mealKey)) {
        currentSet.delete(mealKey);
      } else {
        currentSet.add(mealKey);
      }
      const next = { ...prev, [activeDay]: currentSet };

      // Simpan ke localStorage — convert Set ke array dulu karena JSON tidak support Set
      const toSave = Object.fromEntries(
        Object.entries(next).map(([day, keys]) => [day, Array.from(keys)]),
      );
      localStorage.setItem('checkedByDay', JSON.stringify(toSave));

      return next;
    });
  };

  // Meal list untuk hari aktif
  const mealsForActiveDay = generateMealsForDay(baseMeals, activeDay);
  const checkedMeals = checkedByDay[activeDay] || new Set<string>();

  // Hitung kalori & protein yang sudah dicentang di hari aktif
  const checkedCalories = mealsForActiveDay
    .filter((m) => checkedMeals.has(`${activeDay}-${m.type}-${m.title}`))
    .reduce((sum, m) => sum + m.calories, 0);

  const checkedProtein = mealsForActiveDay
    .filter((m) => checkedMeals.has(`${activeDay}-${m.type}-${m.title}`))
    .reduce((sum, m) => sum + m.protein, 0);

  const calorieProgress = Math.min(
    Math.round((checkedCalories / targetCalories) * 100),
    100,
  );
  const proteinProgress = Math.min(
    Math.round((checkedProtein / targetProtein) * 100),
    100,
  );

  // Stats dinamis — berdasarkan ceklis hari aktif
  const dynamicStats: Stat[] = [
    {
      title: 'WHO Z-Score (HAZ)',
      value: hazValue,
      status: hazStatus,
    },
    {
      title: 'Daily Calories',
      value: `${Math.round(checkedCalories)} / ${Math.round(targetCalories)}`,
      progress: calorieProgress,
    },
    {
      title: 'Protein Intake',
      value: `${Math.round(checkedProtein)} / ${Math.round(targetProtein)}g`,
      progress: proteinProgress,
    },
    {
      title: 'Health Status',
      value: healthStatus,
    },
  ];

  // Chart — total kalori & protein yang sudah dicentang per hari
  const dayLabels = [
    'Day 1',
    'Day 2',
    'Day 3',
    'Day 4',
    'Day 5',
    'Day 6',
    'Day 7',
  ];
  const chartData = dayLabels.map((label, i) => {
    const day = i + 1;
    const dayMeals = generateMealsForDay(baseMeals, day);
    const dayChecked = checkedByDay[day] || new Set<string>();

    const cal = dayMeals
      .filter((m) => dayChecked.has(`${day}-${m.type}-${m.title}`))
      .reduce((sum, m) => sum + m.calories, 0);

    const pro = dayMeals
      .filter((m) => dayChecked.has(`${day}-${m.type}-${m.title}`))
      .reduce((sum, m) => sum + m.protein, 0);

    return { day: label, calories: cal, protein: pro };
  });

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
          {dynamicStats.map((stat, index) =>
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
          <CalorieChart data={chartData} />
          <ProteinChart data={chartData} />
        </div>

        {/* MEALS */}
        <div className="mb-8">
          <MealSection
            meals={mealsForActiveDay}
            activeDay={activeDay}
            onDayChange={handleDayChange}
            checkedMeals={checkedMeals}
            onToggleMeal={handleToggleMeal}
          />
        </div>

        {/* HEALTH TIP */}
        <HealthTip />
      </div>
    </div>
  );
}
