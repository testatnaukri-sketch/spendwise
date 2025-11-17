'use client';

import type { RecommendationCategory } from '@/types';

interface AdvisorRecommendationCardProps {
  recommendation: RecommendationCategory;
}

export function AdvisorRecommendationCard({
  recommendation,
}: AdvisorRecommendationCardProps) {
  const typeColors: Record<string, string> = {
    necessity: 'bg-blue-50 border-blue-200',
    luxury: 'bg-purple-50 border-purple-200',
    waste: 'bg-red-50 border-red-200',
  };

  const typeIcons: Record<string, string> = {
    necessity: '🛒',
    luxury: '✨',
    waste: '🗑️',
  };

  return (
    <div className={`border-l-4 p-4 rounded-lg ${typeColors[recommendation.type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{typeIcons[recommendation.type]}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-lg capitalize">
            {recommendation.title}
          </h3>
          <p className="text-gray-700 text-sm mt-1">{recommendation.description}</p>

          {recommendation.items.length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium text-sm text-gray-800">Examples:</h4>
              <ul className="list-disc list-inside mt-1 text-sm text-gray-700">
                {recommendation.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {recommendation.actionableTips.length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium text-sm text-gray-800">Tips:</h4>
              <ul className="list-disc list-inside mt-1 text-sm text-gray-700">
                {recommendation.actionableTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
