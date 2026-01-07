// Main Background Wrapper Component

'use client';

import React from 'react';
import { BackgroundRenderer } from './components';
import { useBackground } from './context';
import { cn } from '@/lib/utils';

interface BackgroundWrapperProps {
  children: React.ReactNode;
  className?: string;
  blurIntensity?: number;
  brightness?: number;
  saturation?: number;
}

export function BackgroundWrapper({
  children,
  className,
  blurIntensity = 0,
  brightness = 100,
  saturation = 100
}: BackgroundWrapperProps) {
  const { currentBackground, preferences } = useBackground();
  console.log("[BackgroundWrapper] currentBackground", currentBackground);

  return (
    <div className={cn("min-h-screen overflow-hidden fixed inset-0 -z-10", className)}>
      {/* Background Layer */}
      <BackgroundRenderer
        background={currentBackground}
        blurIntensity={blurIntensity || preferences.blurIntensity}
        brightness={brightness || preferences.brightness}
        saturation={saturation || preferences.saturation}
        className=""
      >
        {/* This creates the background layer */}
      </BackgroundRenderer>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default BackgroundWrapper;
