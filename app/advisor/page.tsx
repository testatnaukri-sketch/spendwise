import { Metadata } from 'next';
import { AdvisorPanel } from '@/components/AdvisorPanel';
import { mockAdvisorInput } from '@/__mocks__/advisor-responses';

export const metadata: Metadata = {
  title: 'Purchase Advisor | Spendwise',
  description: 'Get AI-powered recommendations for smarter purchasing decisions',
};

export default function AdvisorPage() {
  // In a real implementation, you would:
  // 1. Get the user's auth token from session/cookies
  // 2. Fetch financial data from Supabase
  // 3. Pass the data to AdvisorPanel component

  // For now, using mock data for demonstration
  const mockToken = 'demo_token_for_testing';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Purchase Advisor
          </h1>
          <p className="text-lg text-gray-600">
            Get personalized AI recommendations based on your spending habits,
            budget allocations, and financial goals.
          </p>
        </div>

        <div className="grid gap-8 mb-8">
          <AdvisorPanel
            token={mockToken}
            input={mockAdvisorInput}
            title="Your Personal Advisor"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              How It Works
            </h2>
            <ol className="space-y-2 text-gray-700">
              <li className="flex gap-3">
                <span className="font-semibold text-blue-600 min-w-fit">1.</span>
                <span>Load your financial data (expenses, budgets, goals)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-blue-600 min-w-fit">2.</span>
                <span>Request recommendations from the AI</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-blue-600 min-w-fit">3.</span>
                <span>Review categorized insights (Necessity, Luxury, Waste)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-blue-600 min-w-fit">4.</span>
                <span>Follow actionable tips to improve your finances</span>
              </li>
            </ol>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Features
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span>🔒</span>
                <span>Your data is anonymized before analysis</span>
              </li>
              <li className="flex gap-2">
                <span>⚡</span>
                <span>Responses are cached for fast access</span>
              </li>
              <li className="flex gap-2">
                <span>🎯</span>
                <span>Personalized insights based on your goals</span>
              </li>
              <li className="flex gap-2">
                <span>🔄</span>
                <span>Manual refresh to get updated recommendations</span>
              </li>
              <li className="flex gap-2">
                <span>💡</span>
                <span>Actionable tips you can implement today</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Pro Tip
          </h2>
          <p className="text-blue-800">
            Update your recommendations regularly to account for changes in your
            spending patterns and financial goals. The AI learns better from
            recent data!
          </p>
        </div>
      </div>
    </main>
  );
}
