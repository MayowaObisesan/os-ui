"use client";

import { useEffect } from 'react';
import { useBackground } from '@/lib/backgrounds';

export function DefaultBackgroundLoader() {
  const {
    currentBackground,
    backgrounds,
    setBackground,
    getCuratedPhotos
  } = useBackground();

  useEffect(() => {
    const initializeDefaultBackground = async () => {
      // If no background is set, load curated photos and set a default
      if (!currentBackground && backgrounds.length === 0) {
        try {
          const curatedPhotos = await getCuratedPhotos(1);
          if (curatedPhotos.length > 0) {
            setBackground(curatedPhotos[0]); // Set first curated photo as default
          }
        } catch (error) {
          console.error('Failed to load default background:', error);
        }
      }
    };

    initializeDefaultBackground();
  }, [currentBackground, backgrounds, setBackground, getCuratedPhotos]);

  return null;
}
