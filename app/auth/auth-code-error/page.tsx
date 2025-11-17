import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert type="error">
              <p className="font-medium">Something went wrong!</p>
              <p className="mt-1">
                There was an error verifying your email or resetting your password.
                Please try again.
              </p>
            </Alert>
            <div className="mt-4 text-center">
              <Link
                href="/auth/sign-in"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
