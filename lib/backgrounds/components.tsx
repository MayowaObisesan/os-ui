// Background Rendering Components

'use client';

import React, { useEffect, useState } from 'react';
import { Background, I_PexelsImageBackground, GradientBackground, I_SolidColorBackground } from './types';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { cn } from '@/lib/utils';

// Pexels Image Background Component
interface PexelsImageBackgroundProps {
  background: I_PexelsImageBackground;
  blurIntensity?: number;
  brightness?: number;
  saturation?: number;
  className?: string;
  children?: React.ReactNode;
}

export function PexelsImageBackground({
  background,
  blurIntensity = 0,
  brightness = 100,
  saturation = 100,
  className,
  children
}: PexelsImageBackgroundProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(background.mediumUrl);

  // Select optimal image size based on screen
  useEffect(() => {
    const selectOptimalImage = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const resolution = screenWidth * screenHeight;

      if (resolution >= 1920 * 1080) {
        setImageSrc(background.largeUrl);
      } else if (resolution >= 1280 * 720) {
        setImageSrc(background.mediumUrl);
      } else {
        setImageSrc(background.smallUrl);
      }
    };

    selectOptimalImage();
  }, [background]);

  const backgroundStyles = {
    backgroundImage: `url(${imageSrc})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    filter: `blur(${blurIntensity}px) brightness(${brightness}%) saturate(${saturation}%)`,
    transition: 'all 0.3s ease-in-out',
  };

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={backgroundStyles}
      >
        {/* Loading state */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}

        {/* Image element for loading detection */}
        <img
          src={imageSrc}
          alt={background.altText}
          className="hidden"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            // Fallback to smaller size if large image fails
            if (imageSrc !== background.smallUrl) {
              setImageSrc(background.smallUrl);
            }
          }}
        />
      </div>

      {/* Content overlay */}
      {children && (
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      )}

      {/* Attribution */}
      {background.photographer && (
        <div className="absolute bottom-2 right-2 z-20 text-xs text-white/70 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
          Photo by{' '}
          <a
            href={background.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 hover:text-white underline"
          >
            {background.photographer}
          </a>
        </div>
      )}
    </div>
  );
}

// Solid Color Background Component
interface SolidColorBackgroundProps {
  background: I_SolidColorBackground;
  className?: string;
  children?: React.ReactNode;
}

export function SolidColorBackground({
  background,
  className,
  children
}: SolidColorBackgroundProps) {
  const backgroundStyle = {
    backgroundColor: background.color,
    opacity: background.opacity || 1,
  };

  return (
    <div
      className={cn("relative w-full h-full", className)}
      style={backgroundStyle}
    >
      {children && (
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      )}
    </div>
  );
}

// Gradient Background Component (enhanced existing one)
interface GradientBackgroundProps {
  background: GradientBackground;
  className?: string;
  children?: React.ReactNode;
}

export function GradientBackgroundComponent({
  background,
  className,
  children
}: GradientBackgroundProps) {
  const { gradientConfig } = background;

  return (
    <div className={cn("relative w-full h-full", className)}>
      <BackgroundGradientAnimation
        gradientBackgroundStart={gradientConfig.backgroundStart}
        gradientBackgroundEnd={gradientConfig.backgroundEnd}
        firstColor={gradientConfig.firstColor}
        secondColor={gradientConfig.secondColor}
        thirdColor={gradientConfig.thirdColor}
        fourthColor={gradientConfig.fourthColor}
        fifthColor={gradientConfig.fifthColor}
        pointerColor={gradientConfig.pointerColor}
        size={gradientConfig.size}
        blendingValue={gradientConfig.blendingValue}
        containerClassName="h-full w-full"
      >
        {children}
      </BackgroundGradientAnimation>
    </div>
  );
}

// Main Background Renderer Component
interface BackgroundRendererProps {
  background: Background | null;
  children?: React.ReactNode;
  className?: string;
  blurIntensity?: number;
  brightness?: number;
  saturation?: number;
}

export function BackgroundRenderer({
  background,
  children,
  className,
  blurIntensity = 0,
  brightness = 100,
  saturation = 100
}: BackgroundRendererProps) {
  if (!background) {
    return (
      <div className={cn("relative w-full h-full", className)}>
        {children}
      </div>
    );
  }

  const renderBackground = () => {
    switch (background.type) {
      case 'pexels-image':
        return (
          <PexelsImageBackground
            background={background}
            blurIntensity={blurIntensity}
            brightness={brightness}
            saturation={saturation}
            className="h-full w-full"
          >
            {children}
          </PexelsImageBackground>
        );

      case 'gradient':
        return (
          <GradientBackgroundComponent
            background={background}
            className="h-full w-full"
          >
            {children}
          </GradientBackgroundComponent>
        );

      case 'solid-color':
        return (
          <SolidColorBackground
            background={background}
            className="h-full w-full"
          >
            {children}
          </SolidColorBackground>
        );

      case 'custom-upload':
        return (
          <PexelsImageBackground
            background={{
              ...background,
              type: 'pexels-image',
              mediumUrl: background.url,
              largeUrl: background.url,
              smallUrl: background.url,
              altText: background.name,
            } as unknown as I_PexelsImageBackground}
            blurIntensity={blurIntensity}
            brightness={brightness}
            saturation={saturation}
            className="h-full w-full"
          >
            {children}
          </PexelsImageBackground>
        );

      default:
        return (
          <div className={cn("relative w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900", className)}>
            {children}
          </div>
        );
    }
  };

  return renderBackground();
}

// Background Preview Component for thumbnails
interface BackgroundPreviewProps {
  background: Background;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  onClick?: () => void;
  isActive?: boolean;
  isFavorite?: boolean;
  className?: string;
}

export function BackgroundPreview({
  background,
  size = 'medium',
  showName = false,
  onClick,
  isActive = false,
  isFavorite = false,
  className
}: BackgroundPreviewProps) {
  const sizeClasses = {
    small: 'w-16 h-12',
    medium: 'w-24 h-18',
    large: 'w-32 h-24'
  };

  const containerClasses = cn(
    'relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg',
    sizeClasses[size],
    isActive && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-background',
    className
  );

  const renderPreview = () => {
    switch (background.type) {
      case 'pexels-image':
        return (
          <img
            src={background.thumbnail || background.smallUrl}
            alt={background.name}
            className="w-full h-full object-cover"
          />
        );

      case 'gradient':
        return (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(45deg, ${background.gradientConfig.backgroundStart}, ${background.gradientConfig.backgroundEnd})`
            }}
          />
        );

      case 'solid-color':
        return (
          <div
            className="w-full h-full"
            style={{ backgroundColor: background.color }}
          />
        );

      case 'custom-upload':
        return (
          <img
            src={background.url}
            alt={background.name}
            className="w-full h-full object-cover"
          />
        );

      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
        );
    }
  };

  return (
    <div className={containerClasses} onClick={onClick}>
      {renderPreview()}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full" />
      )}

      {/* Favorite indicator */}
      {isFavorite && (
        <div className="absolute top-1 left-1 text-yellow-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      )}

      {/* Name overlay */}
      {showName && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
          {background.name}
        </div>
      )}
    </div>
  );
}

export default BackgroundRenderer;
