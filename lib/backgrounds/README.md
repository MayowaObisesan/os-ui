# Background Library Documentation

A comprehensive customizable background system for the OS-like UI with Pexels API integration, supporting multiple background types including images, gradients, and solid colors.

## Features

- 🎨 **Multiple Background Types**: Pexels images, gradients, solid colors, and custom uploads
- 🔍 **Pexels API Integration**: Search and browse high-quality wallpapers
- ⭐ **Favorites System**: Save and organize favorite backgrounds
- 📱 **Recent Backgrounds**: Quick access to recently used backgrounds
- 🎭 **Categories**: Nature, abstract, technology, minimalist, space, and more
- ⚙️ **Customization**: Blur, brightness, and saturation controls
- 🔄 **Auto-rotation**: Optional automatic background switching
- 💾 **Persistence**: Local storage for user preferences and selections
- 🚀 **Performance**: Image optimization, caching, and progressive loading

## Quick Start

### 1. Setup Environment Variables

Add your Pexels API key to your environment:

```env
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key_here
```

Get a free API key at [Pexels API](https://www.pexels.com/api/).

### 2. Wrap Your Application

```tsx
import { BackgroundProvider, BackgroundWrapper } from '@/lib/backgrounds';

function MyApp() {
  return (
    <BackgroundProvider>
      <BackgroundWrapper>
        <YourContent />
      </BackgroundWrapper>
    </BackgroundProvider>
  );
}
```

### 3. Use Background Hook

```tsx
import { useBackground } from '@/lib/backgrounds';

function MyComponent() {
  const { 
    currentBackground, 
    setBackground, 
    favorites, 
    searchPexelsImages 
  } = useBackground();

  return (
    <div>
      <button onClick={() => setBackground(yourBackground)}>
        Set Background
      </button>
    </div>
  );
}
```

## API Reference

### BackgroundProvider

The main context provider that manages background state and API interactions.

```tsx
<BackgroundProvider>
  <YourApp />
</BackgroundProvider>
```

### useBackground Hook

Access background state and actions:

```tsx
const {
  // State
  currentBackground: Background | null,
  backgrounds: Background[],
  favorites: Background[],
  recentBackgrounds: Background[],
  isLoading: boolean,
  error: string | null,
  preferences: BackgroundPreferences,
  
  // Actions
  setBackground: (background: Background) => void,
  addToFavorites: (backgroundId: string) => void,
  removeFromFavorites: (backgroundId: string) => void,
  addToRecent: (backgroundId: string) => void,
  searchPexelsImages: (params: PexelsSearchParams) => Promise<Background[]>,
  getCuratedPhotos: (page?: number) => Promise<Background[]>,
  loadBackgrounds: () => Promise<void>,
  saveBackgrounds: () => Promise<void>,
  updatePreferences: (preferences: Partial<BackgroundPreferences>) => void,
  clearError: () => void
} = useBackground();
```

### BackgroundPicker

A complete background selection modal:

```tsx
import { BackgroundPicker } from '@/lib/backgrounds';

function MyComponent() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setOpen(true)}>
        Change Background
      </button>
      
      <BackgroundPicker 
        open={open} 
        onOpenChange={setOpen} 
      />
    </>
  );
}
```

### BackgroundRenderer

Render different background types:

```tsx
import { BackgroundRenderer } from '@/lib/backgrounds';

function MyComponent() {
  const { currentBackground } = useBackground();
  
  return (
    <BackgroundRenderer 
      background={currentBackground}
      blurIntensity={0}
      brightness={100}
      saturation={100}
    >
      <YourContent />
    </BackgroundRenderer>
  );
}
```

## Background Types

### PexelsImageBackground

```tsx
interface PexelsImageBackground {
  id: string;
  type: 'pexels-image';
  name: string;
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
  thumbnail?: string;
  createdAt: Date;
}
```

### GradientBackground

```tsx
interface GradientBackground {
  id: string;
  type: 'gradient';
  name: string;
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
  createdAt: Date;
  thumbnail?: string;
}
```

### SolidColorBackground

```tsx
interface SolidColorBackground {
  id: string;
  type: 'solid-color';
  name: string;
  color: string;
  opacity?: number;
  createdAt: Date;
  thumbnail?: string;
}
```

## Utilities

### BackgroundPresets

Ready-to-use background presets:

```tsx
import { BackgroundPresets } from '@/lib/backgrounds';

// Access gradient presets
const gradients = BackgroundPresets.gradients;

// Access solid color presets
const colors = BackgroundPresets.colors;
```

### Color Utilities

```tsx
import { ColorUtils } from '@/lib/backgrounds';

// Generate gradient colors
const colors = ColorUtils.generateGradientColors('#3b82f6', 5);

// Blend two colors
const blended = ColorUtils.blendColors('#ff0000', '#0000ff', 0.5);
```

### Performance Utilities

```tsx
import { BackgroundPerformance } from '@/lib/backgrounds';

// Cache image for performance
BackgroundPerformance.cacheImage(url, imageElement);

// Get cached image
const cached = BackgroundPerformance.getCachedImage(url);

// Measure load time
const loadTime = await BackgroundPerformance.measureLoadTime(url);
```

## Configuration

### Environment Variables

- `NEXT_PUBLIC_PEXELS_API_KEY`: Your Pexels API key (required for Pexels integration)

### Storage Keys

The system uses the following localStorage keys:
- `os-ui-backgrounds`: Current background data
- `os-ui-background-preferences`: User preferences and settings

## Performance Tips

1. **Image Optimization**: The system automatically selects optimal image sizes based on screen resolution
2. **Caching**: Images are cached for improved performance
3. **Lazy Loading**: Background images load progressively
4. **Preloading**: Use `preloadImagesWithProgress` for better UX

## Integration Examples

### With Context Menu

```tsx
import { BackgroundPicker } from '@/lib/backgrounds';

function Desktop() {
  const [showPicker, setShowPicker] = useState(false);
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <DesktopContent />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => setShowPicker(true)}>
          Change Wallpaper
        </ContextMenuItem>
      </ContextMenuContent>
      
      <BackgroundPicker 
        open={showPicker}
        onOpenChange={setShowPicker}
      />
    </ContextMenu>
  );
}
```

### With Window Store

```tsx
import { useBackground } from '@/lib/backgrounds';

function SettingsWindow() {
  const { preferences, updatePreferences } = useBackground();
  
  return (
    <div>
      <label>
        Auto-rotate backgrounds
        <input 
          type="checkbox"
          checked={preferences.autoRotate}
          onChange={(e) => updatePreferences({ 
            autoRotate: e.target.checked 
          })}
        />
      </label>
    </div>
  );
}
```

## Error Handling

The system includes comprehensive error handling:

- API rate limiting and retry logic
- Image loading fallbacks
- Graceful degradation when Pexels API is unavailable
- User-friendly error messages

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support (with some gradient limitations)
- Mobile browsers: Optimized for touch interfaces

## Contributing

1. Follow TypeScript strict mode
2. Add comprehensive error handling
3. Include loading states for async operations
4. Maintain backwards compatibility
5. Add proper cleanup for event listeners and timers

## License

This library is part of the os-ui project and follows the same licensing terms.
