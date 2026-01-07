// Background Picker Components

'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Heart,
  Search,
  Star,
  Clock,
  Palette,
  Image as ImageIcon,
  Sparkles,
  Filter,
  X,
  Download,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBackground } from './context';
import { BackgroundRenderer, BackgroundPreview } from './components';
import { PexelsUtils } from './pexels-service';
import { Background, BACKGROUND_CATEGORIES, BackgroundCategory } from './types';

interface BackgroundPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BackgroundPicker({ open, onOpenChange }: BackgroundPickerProps) {
  const {
    currentBackground,
    backgrounds,
    favorites,
    recentBackgrounds,
    isLoading,
    error,
    setBackground,
    addToFavorites,
    removeFromFavorites,
    searchPexelsImages,
    getCuratedPhotos,
    clearError
  } = useBackground();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BackgroundCategory | 'all'>('all');
  const [searchResults, setSearchResults] = useState<Background[]>([]);
  const [curatedPhotos, setCuratedPhotos] = useState<Background[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load curated photos on mount
  useEffect(() => {
    if (open && curatedPhotos.length === 0) {
      loadCuratedPhotos();
    }
  }, [open]);

  const loadCuratedPhotos = async () => {
    try {
      const photos = await getCuratedPhotos();
      setCuratedPhotos(photos);

      // If no current background, set the first curated photo
      if (!currentBackground && photos.length > 0) {
        setBackground(photos[0]);
      }
    } catch (error) {
      console.error('Failed to load curated photos:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    clearError();

    try {
      const results = await searchPexelsImages({
        query: searchQuery,
        page: 1,
        orientation: 'landscape',
        size: 'large'
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategorySelect = async (category: BackgroundCategory | 'all') => {
    setSelectedCategory(category);

    if (category === 'all') {
      loadCuratedPhotos();
      return;
    }

    // For now, we'll search with category keywords
    // In a full implementation, you'd have backend categorization
    const categoryQueries: Record<string, string> = {
      [BACKGROUND_CATEGORIES.NATURE]: 'nature landscape',
      [BACKGROUND_CATEGORIES.ABSTRACT]: 'abstract art',
      [BACKGROUND_CATEGORIES.TECHNOLOGY]: 'technology digital',
      [BACKGROUND_CATEGORIES.MINIMALIST]: 'minimalist design',
      [BACKGROUND_CATEGORIES.ARCHITECTURE]: 'architecture building',
      [BACKGROUND_CATEGORIES.SPACE]: 'space galaxy nebula'
    };

    setIsSearching(true);
    try {
      const results = await searchPexelsImages({
        query: categoryQueries[category] || category,
        page: 1,
        orientation: 'landscape',
        size: 'large'
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Category search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBackgroundSelect = (background: Background) => {
    setBackground(background);
    onOpenChange(false);
  };

  const toggleFavorite = (background: Background, event: React.MouseEvent) => {
    event.stopPropagation();

    if (favorites.some(fav => fav.id === background.id)) {
      removeFromFavorites(background.id);
    } else {
      addToFavorites(background.id);
    }
  };

  const getCurrentDisplayBackgrounds = (): Background[] => {
    switch (selectedCategory) {
      case 'favorites':
        return favorites;
      case 'recent':
        return recentBackgrounds;
      case 'all':
        return curatedPhotos;
      default:
        return searchResults.length > 0 ? searchResults : backgrounds;
    }
  };

  const categories = [
    { id: 'all', name: 'All Photos', icon: ImageIcon },
    { id: BACKGROUND_CATEGORIES.NATURE, name: 'Nature', icon: Sparkles },
    { id: BACKGROUND_CATEGORIES.ABSTRACT, name: 'Abstract', icon: Palette },
    { id: BACKGROUND_CATEGORIES.TECHNOLOGY, name: 'Technology', icon: ImageIcon },
    { id: BACKGROUND_CATEGORIES.MINIMALIST, name: 'Minimalist', icon: ImageIcon },
    { id: BACKGROUND_CATEGORIES.SPACE, name: 'Space', icon: Sparkles },
    { id: 'favorites', name: 'Favorites', icon: Heart },
    { id: 'recent', name: 'Recent', icon: Clock },
  ];

  const displayBackgrounds = getCurrentDisplayBackgrounds();

  return (
      <>
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search and Filters */}
          <div className="p-6 pt-4 border-b">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search wallpapers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                variant="outline"
              >
                {isSearching ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Search
              </Button>
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={handleCategorySelect}>
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs">
                    <category.icon className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Background Grid */}
            <div className="flex-1 p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <ScrollArea className="h-full">
                {isLoading || isSearching ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-video rounded-lg bg-muted animate-pulse"
                      />
                    ))}
                  </div>
                ) : displayBackgrounds.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {displayBackgrounds.map((background) => (
                      <div key={background.id} className="group relative">
                        <BackgroundPreview
                          background={background}
                          size="medium"
                          onClick={() => handleBackgroundSelect(background)}
                          isActive={currentBackground?.id === background.id}
                          isFavorite={favorites.some(fav => fav.id === background.id)}
                          className="w-full"
                        />

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => toggleFavorite(background, e)}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4",
                                favorites.some(fav => fav.id === background.id) && "fill-red-500 text-red-500"
                              )}
                            />
                          </Button>

                          {background.type === 'pexels-image' && 'photographerUrl' in background && (
                            <Button
                              size="sm"
                              variant="secondary"
                              asChild
                            >
                              <a
                                href={background.photographerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>

                        {/* Background Info */}
                        <div className="mt-2">
                          <p className="text-sm font-medium truncate">{background.name}</p>
                          {'photographer' in background && (
                            <p className="text-xs text-muted-foreground truncate">
                              by {background.photographer}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No backgrounds found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try searching for something else or browse different categories.
                    </p>
                    <Button onClick={loadCuratedPhotos} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Sidebar - Quick Actions */}
            <div className="w-80 border-l p-6 bg-muted/30">
              <h3 className="font-semibold mb-4">Quick Actions</h3>

              {/* Current Background */}
              {currentBackground && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Current Background</h4>
                  <BackgroundPreview
                    background={currentBackground}
                    size="medium"
                    showName
                    className="w-full"
                  />
                </div>
              )}

              {/* Favorites */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Favorites</h4>
                <div className="space-y-2">
                  {favorites.slice(0, 3).map((favorite) => (
                    <BackgroundPreview
                      key={favorite.id}
                      background={favorite}
                      size="small"
                      onClick={() => handleBackgroundSelect(favorite)}
                      className="w-full"
                    />
                  ))}
                  {favorites.length === 0 && (
                    <p className="text-sm text-muted-foreground">No favorites yet</p>
                  )}
                </div>
              </div>

              {/* Recent */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Recent</h4>
                <div className="space-y-2">
                  {recentBackgrounds.slice(0, 3).map((recent) => (
                    <BackgroundPreview
                      key={recent.id}
                      background={recent}
                      size="small"
                      onClick={() => handleBackgroundSelect(recent)}
                      className="w-full"
                    />
                  ))}
                  {recentBackgrounds.length === 0 && (
                    <p className="text-sm text-muted-foreground">No recent backgrounds</p>
                  )}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="text-sm font-medium mb-2">Suggestions</h4>
                <div className="flex flex-wrap gap-1">
                  {PexelsUtils.getTrendingQueries().slice(0, 5).map((query) => (
                    <Badge
                      key={query}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => {
                        setSearchQuery(query);
                        handleSearch();
                      }}
                    >
                      {query}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*<Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="min-w-6xl max-w-6xl h-[80vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold">Choose Background</DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>*/}
      </>
  );
}

export default BackgroundPicker;
