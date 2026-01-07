"use client";

import { useEffect } from 'react';
import { useBackground } from '@/lib/backgrounds';

export function BackgroundPreloader() {
  const { backgrounds } = useBackground();

  useEffect(() => {
    // Preload first few background images
    const preloadPromises = backgrounds
      .slice(0, 5)
      .filter(bg => bg.type === 'pexels-image')
      .map(bg => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = bg.mediumUrl;
        });
      });

    Promise.allSettled(preloadPromises).then(() => {
      console.log('Background images preloaded');
    });
  }, [backgrounds]);

  return null; // This component doesn't render anything
}
