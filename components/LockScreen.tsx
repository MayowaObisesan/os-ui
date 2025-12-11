"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation";

interface LockScreenProps {
  onUnlock: (password: string) => void;
  userName?: string;
  userAvatar?: string;
  showTime?: boolean;
  showDate?: boolean;
  showUserInfo?: boolean;
  unlockButtonText?: string;
  passwordPlaceholder?: string;
  className?: string;
  isLoading?: boolean;
  errorMessage?: string;
}

export function LockScreen({
  onUnlock,
  userName = "User",
  userAvatar,
  showTime = true,
  showDate = true,
  showUserInfo = true,
  unlockButtonText = "Unlock",
  passwordPlaceholder = "Enter password",
  className,
  isLoading = false,
  errorMessage,
}: LockScreenProps) {
  const [password, setPassword] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onUnlock(password);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && password.trim()) {
      onUnlock(password);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(20, 20, 40)"
      gradientBackgroundEnd="rgb(80, 20, 100)"
      firstColor="18, 113, 255"
      secondColor="221, 74, 255"
      thirdColor="100, 220, 255"
      fourthColor="200, 50, 50"
      fifthColor="180, 180, 50"
      pointerColor="140, 100, 255"
      size="60%"
      blendingValue="hard-light"
      interactive={false}
    >
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4",
          className
        )}
      >
        {/* Main lock screen container */}
        <div className="w-full max-w-md mx-auto text-center">
          {/* Time and Date Display */}
          {(showTime || showDate) && (
            <div className="mb-8">
              {showTime && (
                <div className="text-6xl font-light text-white mb-2">
                  {formatTime(currentTime)}
                </div>
              )}
              {showDate && (
                <div className="text-xl text-muted-foreground">
                  {formatDate(currentTime)}
                </div>
              )}
            </div>
          )}

          {/* User Info Section */}
          {showUserInfo && (
            <div className="mb-8">
              {userAvatar ? (
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/30">
                  <img
                    src={userAvatar}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                  <span className="text-2xl text-primary">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <h2 className="text-2xl font-semibold text-white">{userName}</h2>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={passwordPlaceholder}
                className="w-full text-center text-lg h-12 bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary/70"
                autoFocus
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {isPasswordVisible ? "👁️" : "🔒"}
              </button>
            </div>

            {errorMessage && (
              <div className="text-sm text-destructive">{errorMessage}</div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              size="lg"
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? "Unlocking..." : unlockButtonText}
            </Button>
          </form>

          {/* Additional options */}
          <div className="mt-8 flex justify-center space-x-6 text-sm text-muted-foreground">
            <button
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {isPasswordVisible ? "Hide" : "Show"} Password
            </button>
            <button
              className="hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
