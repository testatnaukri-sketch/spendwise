import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ percentage, showLabel = true, size = 'md' }: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  const heightStyles = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const getColor = () => {
    if (clampedPercentage >= 100) return 'bg-green-600';
    if (clampedPercentage >= 75) return 'bg-blue-600';
    if (clampedPercentage >= 50) return 'bg-yellow-600';
    return 'bg-orange-600';
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightStyles[size]}`}>
        <div
          className={`${getColor()} h-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-600 mt-1">
          {clampedPercentage.toFixed(1)}% complete
        </p>
      )}
    </div>
  );
}
