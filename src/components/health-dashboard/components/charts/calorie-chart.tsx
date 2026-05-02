'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export default function CalorieChart({
  targetCalories = 2000,
}: {
  targetCalories?: number;
}) {
  const data = [
    { day: 'Mon', target: targetCalories },
    { day: 'Tue', target: targetCalories },
    { day: 'Wed', target: targetCalories },
    { day: 'Thu', target: targetCalories },
    { day: 'Fri', target: targetCalories },
    { day: 'Sat', target: targetCalories },
    { day: 'Sun', target: targetCalories },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 w-full">
      {/* TITLE */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Recommended Calorie Intake
        </h3>
        <p className="text-sm text-gray-500">
          Your daily calorie target for the week
        </p>
      </div>

      {/* CHART */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: '10px',
                border: 'none',
              }}
            />

            <Line
              type="monotone"
              dataKey="target"
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
