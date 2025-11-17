'use client';

export function AdvisorLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin mb-4">
        <div className="inline-block h-8 w-8 border-4 border-blue-600 border-b-transparent rounded-full"></div>
      </div>
      <p className="text-gray-700 font-medium">Analyzing your finances...</p>
      <p className="text-gray-500 text-sm mt-2">
        Our AI is generating personalized recommendations
      </p>
    </div>
  );
}
