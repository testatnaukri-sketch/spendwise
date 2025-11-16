import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Spendwise
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your expenses and manage your finances with ease
          </p>

          {user ? (
            <div className="space-y-6">
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>You&apos;re logged in!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Welcome back, {user.email}
                  </p>
                  <Link href="/protected">
                    <Button variant="primary" className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/sign-in">
                <Button variant="primary" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🔒 Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your data is protected with industry-standard encryption and
                  authentication.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Simple</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Easy-to-use interface makes expense tracking effortless and
                  intuitive.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⚡ Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built with Next.js and Supabase for lightning-fast
                  performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
