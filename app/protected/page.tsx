import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Protected Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Welcome to the protected area!
                </h3>
                <p className="mt-2 text-gray-600">
                  You are successfully authenticated.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-medium text-blue-900">User Information</h4>
                <dl className="mt-2 space-y-1">
                  <div>
                    <dt className="text-sm font-medium text-blue-800">Email:</dt>
                    <dd className="text-sm text-blue-700">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-blue-800">User ID:</dt>
                    <dd className="text-sm text-blue-700">{user.id}</dd>
                  </div>
                </dl>
              </div>

              <div className="pt-4">
                <SignOutButton />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
