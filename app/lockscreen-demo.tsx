"use client";

import { useState } from "react";
import { LockScreen } from "@/components/LockScreen";
import { ThemeProvider } from "@/components/theme-provider";

export default function LockScreenDemo() {
  const [isLocked, setIsLocked] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = (password: string) => {
    setIsLoading(true);
    setError(undefined);

    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);

      // Simple password check (in real app, this would be proper auth)
      if (password === "password123") {
        setIsLocked(false);
      } else {
        setError("Incorrect password. Please try again.");
      }``
    }, 1000);
  };

  if (!isLocked) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-muted-foreground">You have successfully unlocked the system.</p>
            <button
              onClick={() => setIsLocked(true)}
              className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Lock Again
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LockScreen
        onUnlock={handleUnlock}
        userName="John Doe"
        userAvatar="https://i.pravatar.cc/150?u=john-doe"
        unlockButtonText="Unlock System"
        passwordPlaceholder="Enter your password"
        isLoading={isLoading}
        errorMessage={error}
      />
    </ThemeProvider>
  );
}
