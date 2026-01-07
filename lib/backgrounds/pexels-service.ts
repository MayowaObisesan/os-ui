// Pexels API Service

import { PexelsSearchParams, PexelsCuratedPhotos, PexelsPhoto, Background, I_PexelsImageBackground } from './types';

const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY || '';
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

if (!PEXELS_API_KEY) {
  console.warn('Pexels API key not found. Set NEXT_PUBLIC_PEXELS_API_KEY in your environment variables.');
}

class PexelsService {
  private apiKey: string;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(apiKey: string = PEXELS_API_KEY) {
    this.apiKey = apiKey;
  }

  private async fetchWithCache<T>(url: string): Promise<T> {
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Error fetching from Pexels API:', error);
      throw new Error('Failed to fetch images from Pexels API');
    }
  }

  async searchPhotos(params: PexelsSearchParams): Promise<PexelsCuratedPhotos> {
    const searchParams = new URLSearchParams({
      query: params.query,
      page: (params.page || 1).toString(),
      per_page: (params.perPage || 15).toString(),
    });

    if (params.orientation) {
      searchParams.append('orientation', params.orientation);
    }
    if (params.color) {
      searchParams.append('color', params.color);
    }
    if (params.size) {
      searchParams.append('size', params.size);
    }

    const url = `${PEXELS_BASE_URL}/search?${searchParams.toString()}`;
    return this.fetchWithCache<PexelsCuratedPhotos>(url);
  }

  async getCuratedPhotos(page: number = 1, perPage: number = 15): Promise<PexelsCuratedPhotos> {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const url = `${PEXELS_BASE_URL}/curated?${searchParams.toString()}`;
    return this.fetchWithCache<PexelsCuratedPhotos>(url);
  }

  async getPhoto(id: number): Promise<PexelsPhoto> {
    const url = `${PEXELS_BASE_URL}/photos/${id}`;
    return this.fetchWithCache<PexelsPhoto>(url);
  }

  async searchWallpapers(query?: string, page: number = 1): Promise<Background[]> {
    try {
      let result: PexelsCuratedPhotos;

      if (query) {
        result = await this.searchPhotos({
          query,
          page,
          perPage: 15,
          orientation: 'landscape',
          size: 'large'
        });
      } else {
        result = await this.getCuratedPhotos(page, 15);
      }

      return this.transformPexelsPhotosToBackgrounds(result.photos);
    } catch (error) {
      console.error('Error searching wallpapers:', error);
      return [];
    }
  }

  async getPopularWallpapers(page: number = 1): Promise<Background[]> {
    const queries = ['wallpaper', 'nature', 'abstract', 'technology', 'minimalist', 'space'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    return this.searchWallpapers(randomQuery, page);
  }

  async getCategoryWallpapers(category: string, page: number = 1): Promise<Background[]> {
    const categoryMap: Record<string, string> = {
      'nature': 'nature landscape wallpaper',
      'abstract': 'abstract wallpaper',
      'technology': 'technology wallpaper',
      'minimalist': 'minimalist wallpaper',
      'architecture': 'architecture wallpaper',
      'space': 'space wallpaper',
    };

    const query = categoryMap[category] || category;
    return this.searchWallpapers(query, page);
  }

  private transformPexelsPhotosToBackgrounds(photos: PexelsPhoto[]): I_PexelsImageBackground[] {
    return photos.map(photo => ({
      id: `pexels-${photo.id}`,
      type: 'pexels-image' as const,
      name: photo.alt || `Photo by ${photo.photographer}`,
      originalUrl: photo.src.original,
      largeUrl: photo.src.large2x || photo.src.large,
      mediumUrl: photo.src.medium,
      smallUrl: photo.src.small,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      altText: photo.alt || '',
      width: photo.width,
      height: photo.height,
      avgColor: photo.avg_color,
      source: 'pexels' as const,
      pexelsId: photo.id,
      thumbnail: photo.src.tiny,
      createdAt: new Date(),
    }));
  }

  // Rate limiting helper
  private async rateLimitedRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    // Simple rate limiting - wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
    return requestFn();
  }

  // Preload images for better UX
  async preloadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
      img.src = url;
    });
  }

  // Batch preload multiple images
  async preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
    const promises = urls.map(url => this.preloadImage(url));
    return Promise.allSettled(promises).then(results =>
      results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<HTMLImageElement>).value)
    );
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const pexelsService = new PexelsService();

// Utility functions for working with Pexels API
export const PexelsUtils = {
  // Generate search suggestions based on popular categories
  getSearchSuggestions(): string[] {
    return [
      'wallpaper',
      'nature',
      'abstract',
      'technology',
      'minimalist',
      'space',
      'architecture',
      'gradient',
      'ocean',
      'mountain',
      'forest',
      'city',
      'sunset',
      'nebula',
      'pattern'
    ];
  },

  // Get trending search queries
  getTrendingQueries(): string[] {
    return [
      '4k wallpaper',
      'desktop wallpaper',
      'aesthetic wallpaper',
      'dark wallpaper',
      'colorful abstract',
      'geometric wallpaper',
      'nature landscape',
      'space galaxy',
      'minimalist design',
      'tech wallpaper'
    ];
  },

  // Get image size recommendations based on screen resolution
  getRecommendedImageSize(screenWidth: number, screenHeight: number): 'large' | 'medium' | 'small' {
    const resolution = screenWidth * screenHeight;

    if (resolution >= 1920 * 1080) {
      return 'large'; // For HD and above
    } else if (resolution >= 1280 * 720) {
      return 'medium'; // For standard HD
    } else {
      return 'small'; // For smaller screens
    }
  }
};

export default PexelsService;
