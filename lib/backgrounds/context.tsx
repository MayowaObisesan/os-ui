// Background Context Provider

'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Background, BackgroundContextType, BackgroundPreferences, GradientBackground, I_SolidColorBackground } from './types';
import { pexelsService } from './pexels-service';

const STORAGE_KEY = 'os-ui-backgrounds';
const PREFERENCES_STORAGE_KEY = 'os-ui-background-preferences';

// Default gradient backgrounds
const DEFAULT_GRADIENTS: GradientBackground[] = [
  {
    id: 'gradient-1',
    type: 'gradient',
    name: 'Purple Blue Gradient',
    gradientConfig: {
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
    },
    createdAt: new Date(),
    thumbnail: undefined
  },
  {
    id: 'gradient-2',
    type: 'gradient',
    name: 'Sunset Gradient',
    gradientConfig: {
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
    },
    createdAt: new Date(),
    thumbnail: undefined
  },
  {
    id: 'gradient-3',
    type: 'gradient',
    name: 'Ocean Gradient',
    gradientConfig: {
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
    },
    createdAt: new Date(),
    thumbnail: undefined
  }
];

// Default solid colors
const DEFAULT_SOLID_COLORS: I_SolidColorBackground[] = [
  {
    id: 'solid-1',
    type: 'solid-color',
    name: 'Dark Gray',
    color: '#1f2937',
    createdAt: new Date(),
    thumbnail: undefined
  },
  {
    id: 'solid-2',
    type: 'solid-color',
    name: 'Midnight Blue',
    color: '#0f172a',
    createdAt: new Date(),
    thumbnail: undefined
  },
  {
    id: 'solid-3',
    type: 'solid-color',
    name: 'Charcoal',
    color: '#374151',
    createdAt: new Date(),
    thumbnail: undefined
  },
  {
    id: 'solid-4',
    type: 'solid-color',
    name: 'Deep Purple',
    color: '#581c87',
    createdAt: new Date(),
    thumbnail: undefined
  }
];

// Initial state
const initialState = {
  currentBackground: null as Background | null,
  backgrounds: [...DEFAULT_GRADIENTS, ...DEFAULT_SOLID_COLORS] as Background[],
  favorites: [] as Background[],
  recentBackgrounds: [] as Background[],
  isLoading: false,
  error: null as string | null,
  preferences: {
    currentBackgroundId: null,
    favorites: [],
    recentBackgrounds: [],
    autoRotate: false,
    rotationInterval: 30, // 30 minutes
    blurIntensity: 0,
    brightness: 100,
    saturation: 100
  } as BackgroundPreferences
};

// Action types
type BackgroundAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BACKGROUNDS'; payload: Background[] }
  | { type: 'SET_CURRENT_BACKGROUND'; payload: Background | null }
  | { type: 'ADD_TO_FAVORITES'; payload: string }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'ADD_TO_RECENT'; payload: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<BackgroundPreferences> }
  | { type: 'LOAD_PERSISTED_DATA'; payload: {
      currentBackground: Background | null,
      favorites: Background[],
      recentBackgrounds: Background[],
      preferences: BackgroundPreferences
    } }
  | { type: 'ADD_PEXELS_BACKGROUNDS'; payload: Background[] };

// Reducer
function backgroundReducer(state: typeof initialState, action: BackgroundAction): typeof initialState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_BACKGROUNDS':
      return { ...state, backgrounds: action.payload };

    case 'SET_CURRENT_BACKGROUND':
      return {
        ...state,
        currentBackground: action.payload,
        preferences: {
          ...state.preferences,
          currentBackgroundId: action.payload?.id || null
        }
      };

    case 'ADD_TO_FAVORITES':
      if (state.preferences.favorites.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, ...state.backgrounds.filter(bg => bg.id === action.payload)],
        preferences: {
          ...state.preferences,
          favorites: [...state.preferences.favorites, action.payload]
        }
      };

    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(bg => bg.id !== action.payload),
        preferences: {
          ...state.preferences,
          favorites: state.preferences.favorites.filter(id => id !== action.payload)
        }
      };

    case 'ADD_TO_RECENT':
      const foundBackground = state.backgrounds.find(bg => bg.id === action.payload);
      if (!foundBackground) {
        return state; // Background not found, don't update
      }

      // Remove from recent if already exists, then add to beginning
      const recentWithout = state.recentBackgrounds.filter(bg => bg.id !== action.payload);
      const updatedRecent = [
        foundBackground,
        ...recentWithout
      ].slice(0, 10); // Keep only last 10

      return {
        ...state,
        recentBackgrounds: updatedRecent,
        preferences: {
          ...state.preferences,
          recentBackgrounds: [action.payload, ...state.preferences.recentBackgrounds.filter(id => id !== action.payload)].slice(0, 10)
        }
      };


    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };

    case 'LOAD_PERSISTED_DATA':
      return {
        ...state,
        currentBackground: action.payload.currentBackground,
        favorites: action.payload.favorites,
        recentBackgrounds: action.payload.recentBackgrounds,
        preferences: action.payload.preferences
      };

    case 'ADD_PEXELS_BACKGROUNDS':
      return {
        ...state,
        backgrounds: [...state.backgrounds, ...action.payload]
      };

    default:
      return state;
  }
}

// Create context
const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

// Context provider component
interface BackgroundProviderProps {
  children: ReactNode;
}

export function BackgroundProvider({ children }: BackgroundProviderProps) {
  const [state, dispatch] = useReducer(backgroundReducer, initialState);

  // Auto-load curated photos and set default background on mount
  useEffect(() => {
    loadInitialBackgrounds();
  }, []);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Save data when state changes
  useEffect(() => {
    if (state.currentBackground || state.preferences.favorites.length > 0 || state.preferences.recentBackgrounds.length > 0) {
      savePersistedData();
    }
  }, [state.currentBackground, state.favorites, state.recentBackgrounds, state.preferences]);

  // Auto-rotate backgrounds if enabled
  useEffect(() => {
    if (!state.preferences.autoRotate || !state.backgrounds.length) return;

    const interval = setInterval(() => {
      const nextBackground = getNextBackground();
      if (nextBackground) {
        dispatch({ type: 'SET_CURRENT_BACKGROUND', payload: nextBackground });
      }
    }, state.preferences.rotationInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.preferences.autoRotate, state.preferences.rotationInterval, state.backgrounds]);

  const loadInitialBackgrounds = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Load curated photos
      const curatedPhotos = await getCuratedPhotos(1);

      // Set the first curated photo as default if no background is set
      if (curatedPhotos.length > 0 && !state.currentBackground) {
        dispatch({ type: 'SET_CURRENT_BACKGROUND', payload: curatedPhotos[0] });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Failed to load initial backgrounds:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getNextBackground = (): Background | null => {
    const availableBackgrounds = state.backgrounds.filter(bg =>
      bg.id !== state.currentBackground?.id
    );

    if (availableBackgrounds.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableBackgrounds.length);
    return availableBackgrounds[randomIndex];
  };

  const setBackground = (background: Background) => {
    dispatch({ type: 'SET_CURRENT_BACKGROUND', payload: background });
    addToRecent(background.id);
  };

  const addToFavorites = (backgroundId: string) => {
    dispatch({ type: 'ADD_TO_FAVORITES', payload: backgroundId });
  };

  const removeFromFavorites = (backgroundId: string) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: backgroundId });
  };

  const addToRecent = (backgroundId: string) => {
    dispatch({ type: 'ADD_TO_RECENT', payload: backgroundId });
  };

  const searchPexelsImages = async (params: any): Promise<Background[]> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const backgrounds = await pexelsService.searchWallpapers(params.query, params.page);
      dispatch({ type: 'SET_LOADING', payload: false });
      return backgrounds;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to search Pexels images' });
      return [];
    }
  };

  const getCuratedPhotos = async (page: number = 1): Promise<Background[]> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const backgrounds = await pexelsService.getPopularWallpapers(page);
      dispatch({ type: 'ADD_PEXELS_BACKGROUNDS', payload: backgrounds });
      dispatch({ type: 'SET_LOADING', payload: false });
      return backgrounds;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load curated photos' });
      return [];
    }
  };

  const loadBackgrounds = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Load curated photos on first load
      const curated = await getCuratedPhotos();
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load backgrounds' });
    }
  };

  const saveBackgrounds = async (): Promise<void> => {
    // This will be handled by useEffect
    savePersistedData();
  };

  const updatePreferences = (preferences: Partial<BackgroundPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const savePersistedData = () => {
    try {
      const dataToSave = {
        currentBackground: state.currentBackground,
        favorites: state.favorites,
        recentBackgrounds: state.recentBackgrounds,
        preferences: state.preferences
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave.currentBackground));
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(dataToSave.preferences));
    } catch (error) {
      console.error('Failed to save background data:', error);
    }
  };

  const loadPersistedData = () => {
    try {
      const savedBackground = localStorage.getItem(STORAGE_KEY);
      const savedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);

      if (savedBackground) {
        const currentBackground = JSON.parse(savedBackground);
        dispatch({ type: 'SET_CURRENT_BACKGROUND', payload: currentBackground });
      }

      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
      }

      // Load favorites and recent from preferences
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        const favorites = state.backgrounds.filter(bg => preferences.favorites.includes(bg.id));
        const recentBackgrounds = preferences.recentBackgrounds
          .map((id: string) => state.backgrounds.find(bg => bg.id === id))
          .filter(Boolean) as Background[];

        dispatch({
          type: 'LOAD_PERSISTED_DATA',
          payload: {
            currentBackground: JSON.parse(savedBackground || 'null'),
            favorites,
            recentBackgrounds,
            preferences
          }
        });
      }
    } catch (error) {
      console.error('Failed to load background data:', error);
    }
  };

  const contextValue: BackgroundContextType = {
    // State
    currentBackground: state.currentBackground,
    backgrounds: state.backgrounds,
    favorites: state.favorites,
    recentBackgrounds: state.recentBackgrounds,
    isLoading: state.isLoading,
    error: state.error,
    preferences: state.preferences,

    // Actions
    setBackground,
    addToFavorites,
    removeFromFavorites,
    addToRecent,
    searchPexelsImages,
    getCuratedPhotos,
    loadBackgrounds,
    saveBackgrounds,
    updatePreferences,
    clearError
  };

  return (
    <BackgroundContext.Provider value={contextValue}>
      {children}
    </BackgroundContext.Provider>
  );
}

// Hook to use background context
export function useBackground(): BackgroundContextType {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}

export default BackgroundProvider;
