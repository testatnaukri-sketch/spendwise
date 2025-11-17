'use client';

import { useState, useCallback } from 'react';
import type { PurchaseAdvisorResponse, PurchaseAdvisorInput } from '@/types';
import { AdvisorRecommendationCard } from './AdvisorRecommendationCard';
import { AdvisorLoadingState } from './AdvisorLoadingState';
import { AdvisorErrorState } from './AdvisorErrorState';

interface PurchaseAdvisorProps {
  token: string;
  input: PurchaseAdvisorInput;
}

export function PurchaseAdvisor({ token, input }: PurchaseAdvisorProps) {
  const [response, setResponse] = useState<PurchaseAdvisorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  const fetchRecommendations = useCallback(async (skipCache = false) => {
    setLoading(true);
    setError(null);

    try {
      // Clear cache if requested
      if (skipCache) {
        await fetch('/api/advisor', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get recommendations');
      }

      const data = await res.json();
      setResponse(data);
      setCached(data.cached ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [token, input]);

  if (loading) {
    return <AdvisorLoadingState />;
  }

  if (error) {
    return (
      <AdvisorErrorState
        error={error}
        onRetry={() => fetchRecommendations(false)}
      />
    );
  }

  if (!response) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          Get personalized spending recommendations based on your financial data
        </p>
        <button
          onClick={() => fetchRecommendations()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Get Recommendations
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cached && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm">
          ℹ️ These recommendations are cached (generated at {new Date(response.generatedAt).toLocaleTimeString()})
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-lg mb-2">Summary</h3>
        <p className="text-gray-700">{response.summary}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-lg mb-2">Analysis Reasoning</h3>
        <p className="text-gray-700">{response.reasoning}</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recommendations</h3>
        {response.recommendations.map((rec, idx) => (
          <AdvisorRecommendationCard key={idx} recommendation={rec} />
        ))}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <button
          onClick={() => fetchRecommendations(true)}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Refresh Recommendations
        </button>
        <button
          onClick={() => {
            setResponse(null);
            setError(null);
            setCached(false);
          }}
          className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
