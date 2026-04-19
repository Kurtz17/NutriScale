export default function Loading() {
  return (
    <div className="min-h-screen bg-[#EAF3EC] px-8 py-6 animate-pulse">
      {/* HEADER */}
      <div className="mb-6">
        <div className="h-8 w-64 bg-gray-300 rounded-md mb-2"></div>
        <div className="h-4 w-80 bg-gray-200 rounded-md"></div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-md space-y-4">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-6 w-24 bg-gray-300 rounded"></div>
            <div className="h-2 w-full bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-6 mb-8">
        <div className="flex-1 h-14 bg-gray-300 rounded-xl"></div>
        <div className="flex-1 h-14 bg-gray-200 rounded-xl"></div>
      </div>

      {/* MEAL SECTION HEADER */}
      <div className="mb-4">
        <div className="h-5 w-56 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-80 bg-gray-200 rounded"></div>
      </div>

      {/* MEAL CARDS */}
      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
            </div>

            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>

            <div className="flex gap-4 mt-3">
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>

            <div className="flex gap-2 mt-3">
              <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* HEALTH TIP */}
      <div className="mt-8 bg-[#DFF3E3] rounded-2xl p-6 flex gap-4">
        <div className="w-10 h-10 bg-green-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 bg-green-200 rounded"></div>
          <div className="h-3 w-full bg-green-100 rounded"></div>
          <div className="h-3 w-3/4 bg-green-100 rounded"></div>
        </div>
      </div>
    </div>
  );
}
