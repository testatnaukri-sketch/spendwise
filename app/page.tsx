import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Spendwise
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-Powered Personal Finance Advisor
          </p>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Get personalized recommendations for smarter purchasing decisions.
            Our AI analyzes your spending patterns, budget status, and financial
            goals to provide categorized insights and actionable tips.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              🎯 Smart Analysis
            </h2>
            <p className="text-gray-600">
              Our AI analyzes your recent expenses and budget to identify
              patterns and opportunities for optimization.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              💡 Categorized Insights
            </h2>
            <p className="text-gray-600">
              Recommendations are categorized into Necessity, Luxury, and Waste
              to help you understand your spending better.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              🔒 Privacy First
            </h2>
            <p className="text-gray-600">
              All sensitive data is anonymized before analysis. Your financial
              information stays private and secure.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Getting Started
          </h2>
          <p className="text-gray-700 mb-4">
            The Purchase Advisor is currently integrated into the Spendwise
            platform. To use it:
          </p>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>
              <strong>Set up your environment</strong> with Supabase and OpenAI
              API keys
            </li>
            <li>
              <strong>Load your financial data</strong> - recent expenses,
              budgets, and goals
            </li>
            <li>
              <strong>Request recommendations</strong> - The AI analyzes your
              data and provides insights
            </li>
            <li>
              <strong>Take action</strong> - Implement the suggested tips to
              improve your finances
            </li>
          </ol>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Check out the documentation to learn more about the API and
            implementation.
          </p>
          <Link
            href="/api/advisor"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            API Documentation
          </Link>
        </div>
      </div>
    </main>
  );
}
