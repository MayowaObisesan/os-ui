// Background Utilities

import { Background, I_PexelsImageBackground, GradientBackground, I_SolidColorBackground } from './types';

// Generate unique ID for backgrounds
export function generateBackgroundId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Validate background URL
export function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  } catch {
    return false;
  }
}

// Get optimal image URL based on screen size
export function getOptimalImageUrl(
  background: I_PexelsImageBackground,
  screenWidth: number,
  screenHeight: number
): string {
  const resolution = screenWidth * screenHeight;

  if (resolution >= 2560 * 1440) {
    return background.largeUrl; // 4K
  } else if (resolution >= 1920 * 1080) {
    return background.mediumUrl; // 1080p
  } else {
    return background.smallUrl; // Lower resolution
  }
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

// Check if image is loaded
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

// Batch preload images with progress tracking
export async function preloadImagesWithProgress(
  urls: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<HTMLImageElement[]> {
  const total = urls.length;
  const loadedImages: HTMLImageElement[] = [];

  for (let i = 0; i < urls.length; i++) {
    try {
      const img = await preloadImage(urls[i]);
      loadedImages.push(img);
      onProgress?.(loadedImages.length, total);
    } catch (error) {
      console.warn(`Failed to preload image: ${urls[i]}`, error);
    }
  }

  return loadedImages;
}

// Create solid color background
export function createSolidColorBackground(
  color: string,
  name?: string
): I_SolidColorBackground {
  return {
    id: generateBackgroundId('solid'),
    type: 'solid-color',
    name: name || `Color ${color}`,
    color,
    createdAt: new Date()
  };
}

// Create gradient background
export function createGradientBackground(
  config: GradientBackground['gradientConfig'],
  name?: string
): GradientBackground {
  return {
    id: generateBackgroundId('gradient'),
    type: 'gradient',
    name: name || 'Custom Gradient',
    gradientConfig: config,
    createdAt: new Date()
  };
}

// Convert hex color to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Convert RGB to hex
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// Get complementary color
export function getComplementaryColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const complementR = 255 - rgb.r;
  const complementG = 255 - rgb.g;
  const complementB = 255 - rgb.b;

  return rgbToHex(complementR, complementG, complementB);
}

// Calculate relative luminance for text contrast
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Check if color is light or dark for text contrast
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;

  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
  return luminance > 0.5;
}

// Get text color for best contrast
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}

// Storage utilities
export const BackgroundStorage = {
  // Save background to localStorage
  saveBackground: (key: string, background: Background): void => {
    try {
      localStorage.setItem(`background-${key}`, JSON.stringify(background));
    } catch (error) {
      console.error('Failed to save background:', error);
    }
  },

  // Load background from localStorage
  loadBackground: (key: string): Background | null => {
    try {
      const stored = localStorage.getItem(`background-${key}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load background:', error);
      return null;
    }
  },

  // Remove background from localStorage
  removeBackground: (key: string): void => {
    try {
      localStorage.removeItem(`background-${key}`);
    } catch (error) {
      console.error('Failed to remove background:', error);
    }
  },

  // Clear all background data
  clearAll: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('background-')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear background data:', error);
    }
  }
};

// Performance utilities
export class BackgroundPerformance {
  private static imageCache = new Map<string, HTMLImageElement>();
  private static maxCacheSize = 50;

  // Cache image for performance
  static cacheImage(url: string, image: HTMLImageElement): void {
    if (this.imageCache.size >= this.maxCacheSize) {
      const firstKey = this.imageCache.keys().next().value;
      if (firstKey)
        this.imageCache.delete(firstKey);
    }
    this.imageCache.set(url, image);
  }

  // Get cached image
  static getCachedImage(url: string): HTMLImageElement | null {
    return this.imageCache.get(url) || null;
  }

  // Clear image cache
  static clearCache(): void {
    this.imageCache.clear();
  }

  // Measure image load performance
  static async measureLoadTime(url: string): Promise<number> {
    const start = performance.now();
    try {
      await preloadImage(url);
      return performance.now() - start;
    } catch {
      return -1;
    }
  }
}

// Color utilities for gradients
export const ColorUtils = {
  // Generate gradient colors
  generateGradientColors: (baseColor: string, count: number = 5): string[] => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return [baseColor];

    const colors = [baseColor];
    const lightnessStep = 20;

    for (let i = 1; i < count; i++) {
      const lightness = Math.min(100, 50 + (i * lightnessStep));
      const color = hslToHex(
        rgb.r,
        rgb.g,
        rgb.b,
        lightness
      );
      colors.push(color);
    }

    return colors;
  },

  // Blend two colors
  blendColors: (color1: string, color2: string, ratio: number = 0.5): string => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1;

    const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
    const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
    const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

    return rgbToHex(r, g, b);
  }
};

// Helper function for HSL conversion (simplified)
function hslToHex(r: number, g: number, b: number, lightness: number): string {
  // This is a simplified version - in a full implementation you'd want proper HSL conversion
  const factor = lightness / 100;
  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);
  return rgbToHex(newR, newG, newB);
}

// Export common presets
export const BackgroundPresets = {
  // Popular gradient presets
  gradients: [
    {
      name: 'Ocean Breeze',
      config: {
        backgroundStart: 'rgb(30, 58, 138)',
        backgroundEnd: 'rgb(147, 197, 253)',
        firstColor: '30, 58, 138',
        secondColor: '59, 130, 246',
        thirdColor: '147, 197, 253',
        fourthColor: '191, 219, 254',
        fifthColor: '59, 130, 246',
        pointerColor: '147, 197, 253',
        size: '80%',
        blendingValue: 'overlay'
      }
    },
    {
      name: 'Sunset Vibes',
      config: {
        backgroundStart: 'rgb(255, 107, 107)',
        backgroundEnd: 'rgb(78, 205, 196)',
        firstColor: '255, 107, 107',
        secondColor: '78, 205, 196',
        thirdColor: '255, 195, 113',
        fourthColor: '255, 159, 67',
        fifthColor: '255, 87, 51',
        pointerColor: '255, 195, 113',
        size: '80%',
        blendingValue: 'soft-light'
      }
    },
    {
      name: 'Cosmic Night',
      config: {
        backgroundStart: 'rgb(108, 0, 162)',
        backgroundEnd: 'rgb(0, 17, 82)',
        firstColor: '18, 113, 255',
        secondColor: '221, 74, 255',
        thirdColor: '100, 220, 255',
        fourthColor: '200, 50, 50',
        fifthColor: '180, 180, 50',
        pointerColor: '140, 100, 255',
        size: '80%',
        blendingValue: 'hard-light'
      }
    }
  ],

  // Popular solid colors
  colors: [
    { name: 'Midnight', color: '#0f172a' },
    { name: 'Deep Forest', color: '#14532d' },
    { name: 'Royal Purple', color: '#581c87' },
    { name: 'Ocean Blue', color: '#0c4a6e' },
    { name: 'Warm Gray', color: '#374151' },
    { name: 'Rich Black', color: '#111827' }
  ]
};
