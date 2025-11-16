import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Spendwise</h1>
          <p className="text-xl text-gray-600 mb-8">
            Personal Finance Management Made Simple
          </p>

          <div className="space-y-4">
            <Link
              href="/profile"
              className="inline-block bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              View Profile (Demo)
            </Link>
          </div>

          <div className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Manage your personal profile and financial information</li>
              <li>✓ Track income and fixed expenses</li>
              <li>✓ Set and monitor savings goals</li>
              <li>✓ View spending capacity metrics</li>
              <li>✓ Secure data stored in Supabase</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
