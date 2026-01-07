// Background Types and Data Structures

export type BackgroundType = 'pexels-image' | 'gradient' | 'solid-color' | 'custom-upload';

export interface BaseBackground {
  id: string;
  type: BackgroundType;
  name: string;
  thumbnail?: string;
  createdAt: Date;
  isFavorite?: boolean;
}

export interface I_PexelsImageBackground extends BaseBackground {
  type: 'pexels-image';
  originalUrl: string;
  largeUrl: string;
  mediumUrl: string;
  smallUrl: string;
  photographer: string;
  photographerUrl: string;
  altText: string;
  width: number;
  height: number;
  avgColor: string;
  source: 'pexels';
  pexelsId: number;
}

export interface GradientBackground extends BaseBackground {
  type: 'gradient';
  gradientConfig: {
    backgroundStart: string;
    backgroundEnd: string;
    firstColor: string;
    secondColor: string;
    thirdColor: string;
    fourthColor: string;
    fifthColor: string;
    pointerColor: string;
    size: string;
    blendingValue: string;
  };
}

export interface I_SolidColorBackground extends BaseBackground {
  type: 'solid-color';
  color: string;
  opacity?: number;
}

export interface CustomUploadBackground extends BaseBackground {
  type: 'custom-upload';
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export type Background = I_PexelsImageBackground | GradientBackground | I_SolidColorBackground | CustomUploadBackground;

export interface BackgroundCollection {
  id: string;
  name: string;
  description: string;
  category: string;
  backgrounds: Background[];
  isDefault?: boolean;
}

export interface PexelsSearchParams {
  query: string;
  page?: number;
  perPage?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  color?: string;
  size?: 'large' | 'medium' | 'small';
}

export interface PexelsCuratedPhotos {
  page: number;
  perPage: number;
  photos: PexelsPhoto[];
  totalResults: number;
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface BackgroundPreferences {
  currentBackgroundId: string | null;
  favorites: string[];
  recentBackgrounds: string[];
  autoRotate: boolean;
  rotationInterval: number; // in minutes
  blurIntensity: number; // 0-100
  brightness: number; // 0-100
  saturation: number; // 0-100
}

export interface BackgroundContextType {
  // State
  currentBackground: Background | null;
  backgrounds: Background[];
  favorites: Background[];
  recentBackgrounds: Background[];
  isLoading: boolean;
  error: string | null;
  preferences: BackgroundPreferences;

  // Actions
  setBackground: (background: Background) => void;
  addToFavorites: (backgroundId: string) => void;
  removeFromFavorites: (backgroundId: string) => void;
  addToRecent: (backgroundId: string) => void;
  searchPexelsImages: (params: PexelsSearchParams) => Promise<Background[]>;
  getCuratedPhotos: (page?: number) => Promise<Background[]>;
  loadBackgrounds: () => Promise<void>;
  saveBackgrounds: () => Promise<void>;
  updatePreferences: (preferences: Partial<BackgroundPreferences>) => void;
  clearError: () => void;
}

// Background categories for organization
export const BACKGROUND_CATEGORIES = {
  NATURE: 'nature',
  ABSTRACT: 'abstract',
  TECHNOLOGY: 'technology',
  MINIMALIST: 'minimalist',
  ARCHITECTURE: 'architecture',
  SPACE: 'space',
  GRADIENTS: 'gradients',
  SOLID_COLORS: 'solid-colors',
  CUSTOM: 'custom'
} as const;

export type BackgroundCategory = typeof BACKGROUND_CATEGORIES[keyof typeof BACKGROUND_CATEGORIES];
