"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  resetPasswordSchema,
  updatePasswordSchema,
  ResetPasswordFormData,
  UpdatePasswordFormData,
} from "@/types/auth";
import { resetPasswordRequest, updatePassword } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  const isUpdateStep = step === "update";

  if (isUpdateStep) {
    return <UpdatePasswordForm />;
  }

  return <RequestResetForm />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

function RequestResetForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await resetPasswordRequest(data.email);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>
                We&apos;ve sent you a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert type="success">
                <p className="font-medium">Email sent!</p>
                <p className="mt-1">
                  Please check your email and click the link to reset your
                  password.
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert type="error" className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                id="email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                variant="primary"
              >
                Send reset link
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
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

function UpdatePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updatePassword(data.password);
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle>Update your password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert type="error" className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                id="password"
                type="password"
                label="New password"
                placeholder="At least 6 characters"
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                id="confirmPassword"
                type="password"
                label="Confirm new password"
                placeholder="Re-enter your password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                variant="primary"
              >
                Update password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
