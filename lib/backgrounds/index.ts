// Background Library Main Export

export * from './types';
export * from './context';
export * from './components';
export * from './pexels-service';

// Re-export main components for easy import
export { BackgroundProvider, useBackground } from './context';
export { BackgroundRenderer, BackgroundPreview, PexelsImageBackground, SolidColorBackground, GradientBackgroundComponent } from './components';
export { pexelsService } from './pexels-service';

// Background picker components
export * from './picker';

// Background management utilities
export * from './utils';
