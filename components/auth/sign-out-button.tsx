"use client";

import { useState } from "react";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      isLoading={isLoading}
      variant="danger"
    >
      Sign out
    </Button>
  );
}
