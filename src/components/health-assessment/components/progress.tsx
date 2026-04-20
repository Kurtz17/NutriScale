'use client';

export default function Progress({ step }: { step: number }) {
  const percent = Math.round((step / 3) * 100);

  return (
    <div className="w-full max-w-xl bg-white rounded-xl p-4 shadow mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">Health Assessment</h2>

        <span className="text-sm text-gray-500">Step {step} of 3</span>
      </div>

      {/* BAR */}
      <div className="w-full h-2 bg-gray-200 rounded">
        <div
          className="h-2 bg-black rounded transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* PERCENT */}
      <p className="text-right text-sm mt-1 text-gray-600">
        {percent}% Complete
      </p>
    </div>
  );
}
