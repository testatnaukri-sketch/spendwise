'use client';

interface AdvisorErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function AdvisorErrorState({ error, onRetry }: AdvisorErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Unable to Generate Recommendations
      </h3>
      <p className="text-gray-600 text-center mb-4 max-w-md">{error}</p>
      <button
        onClick={onRetry}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        Try Again
      </button>
    </div>
  );
}
