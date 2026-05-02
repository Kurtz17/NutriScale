'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartData {
  day: string;
  calories: number;
  protein: number;
}

export default function CalorieChart({ data }: { data: ChartData[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Calorie Intake Progress
        </h3>
        <p className="text-sm text-gray-500">Your weekly calorie plan</p>
      </div>
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip
              contentStyle={{ borderRadius: '10px', border: 'none' }}
              formatter={(value: number) => [`${value} kcal`, 'Calories']}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#4c7dc1"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
