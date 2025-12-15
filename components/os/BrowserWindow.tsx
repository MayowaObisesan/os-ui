"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoreDraggableWindow } from "@/components/os/StoreDraggableWindow";
import {useWindowManagement, useWindowStore} from "@/lib/store";
import { processUrl, handleSpecialProtocol, BrowserWindowConfig, BrowserHistory } from "@/lib/utils/browser-utils";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Home,
  Search,
  AlertCircle,
  Loader2,
  Globe
} from "lucide-react";
import { Flex } from "@radix-ui/themes";
import { cn } from "@/lib/utils";

export interface BrowserWindowProps {
  windowId?: string;
  initialUrl?: string;
  title?: string;
  onClose?: () => void;
  className?: string;
  config?: BrowserWindowConfig;
  defaultPosition?: { x: number; y: number };
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  icon?: React.ReactNode; // Icon for dock display
}

interface BrowserContentProps {
  windowId: string;
  url: string;
  isLoading: boolean;
  error?: string;
  canGoBack: boolean;
  canGoForward: boolean;
  title: string;
  config: Required<BrowserWindowConfig>;
  onUrlChange: (url: string) => void;
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  onGoHome: () => void;
}

const BrowserToolbar: React.FC<{
  url: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  title: string;
  onUrlChange: (url: string) => void;
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  onGoHome: () => void;
}> = ({
  url,
  isLoading,
  canGoBack,
  canGoForward,
  title,
  onUrlChange,
  onNavigate,
  onGoBack,
  onGoForward,
  onRefresh,
  onGoHome,
}) => {
  const [inputUrl, setInputUrl] = useState(url);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputUrl(url);
  }, [url]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onNavigate(inputUrl);
  }, [inputUrl, onNavigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onNavigate(inputUrl);
    }
  }, [inputUrl, onNavigate]);

  return (
    <Flex className="w-full p-2 gap-2 items-center bg-card">
      <Button
        variant="ghost"
        size="icon"
        onClick={onGoBack}
        disabled={!canGoBack}
        className="shrink-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onGoForward}
        disabled={!canGoForward}
        className="shrink-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRefresh}
        className="shrink-0"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onGoHome}
        className="shrink-0"
      >
        <Home className="h-4 w-4" />
      </Button>

      <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search or enter URL..."
            className="pl-10 pr-4"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>
        <Button type="submit" size="sm">
          Go
        </Button>
      </form>
    </Flex>
  );
};

const BrowserContent: React.FC<BrowserContentProps> = ({
  windowId,
  url,
  isLoading,
  error,
  canGoBack,
  canGoForward,
  title,
  config,
  onUrlChange,
  onNavigate,
  onGoBack,
  onGoForward,
  onRefresh,
  onGoHome,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const processedUrl = useMemo(() => processUrl(url, config), [url, config]);

  useEffect(() => {
    if (processedUrl.shouldUseIframe && iframeRef.current) {
      const iframe = iframeRef.current;

      const handleLoad = () => {
        onUrlChange(url);
      };

      const handleError = () => {
        onUrlChange(url); // Still update URL on error
      };

      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
    }
  }, [url, processedUrl.shouldUseIframe, onUrlChange]);

  const handleIframeMessage = useCallback((event: MessageEvent) => {
    // Handle messages from iframe if needed
    // This could be used for security checks or communication
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [handleIframeMessage]);

  const renderContent = () => {
    if (error) {
      return (
        <Flex className="h-full w-full items-center justify-center bg-background">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load page</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={onRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        </Flex>
      );
    }

    if (!processedUrl.isValid || !processedUrl.isAllowed) {
      return (
        <Flex className="h-full w-full items-center justify-center bg-background">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Cannot display this content</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {processedUrl.error || "This URL cannot be displayed in the browser"}
            </p>
          </div>
        </Flex>
      );
    }

    if (!processedUrl.shouldUseIframe) {
      // Handle special protocols (mailto, tel, etc.)
      handleSpecialProtocol(url, processedUrl.protocol);
      return (
        <Flex className="h-full w-full items-center justify-center bg-background">
          <div className="text-center">
            <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Opening external application</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {processedUrl.protocol === 'mailto:' && 'Opening email client...'}
              {processedUrl.protocol === 'tel:' && 'Initiating phone call...'}
              {processedUrl.protocol === 'ftp:' && 'Opening FTP client...'}
            </p>
          </div>
        </Flex>
      );
    }

    return (
      <div className="h-full w-full relative">
        {isLoading && (
          <div className="absolute inset-0 bg-card flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full min-h-200 h-full border-0"
          title={title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <BrowserToolbar
        url={url}
        isLoading={isLoading}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        title={title}
        onUrlChange={onUrlChange}
        onNavigate={onNavigate}
        onGoBack={onGoBack}
        onGoForward={onGoForward}
        onRefresh={onRefresh}
        onGoHome={onGoHome}
      />
      <div className="overflow-y-auto flex-1 min-h-0">
        {renderContent()}
      </div>
    </div>
  );
};

export function BrowserWindow({
  windowId,
  initialUrl = "https://www.google.com",
  title = "Browser",
  onClose,
  className,
  config = {},
  defaultPosition = { x: 100, y: 100 },
  trigger,
  open = false,
  onOpenChange,
  icon,
}: BrowserWindowProps) {
  const { createWindow, updateWindow } = useWindowManagement();
  const {getWindowById} = useWindowStore();
  const [browserHistory] = useState(() => new BrowserHistory(initialUrl, title));
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const effectiveWindowId = windowId;
  const window = effectiveWindowId ? getWindowById(effectiveWindowId) : null;
  const effectiveConfig = useMemo(() => ({
    allowedDomains: [],
    blockedDomains: [],
    enableJavaScript: true,
    enablePopups: false,
    userAgent: 'Mozilla/5.0 (compatible; BrowserWindow/1.0)',
    referrerPolicy: 'strict-origin-when-cross-origin',
    ...config,
  }), [config]);

  const handleNavigate = useCallback((url: string) => {
    const processed = processUrl(url, effectiveConfig);

    if (!processed.isValid || !processed.isAllowed) {
      setError(processed.error);
      return;
    }

    setError(undefined);
    setIsLoading(true);
    setCurrentUrl(url);

    // Add to history
    browserHistory.addEntry(url, url);

    // Update window title
    if (effectiveWindowId) {
      updateWindow(effectiveWindowId, { title: url });
    }
  }, [effectiveWindowId, effectiveConfig, browserHistory, updateWindow]);

  const handleGoBack = useCallback(() => {
    const entry = browserHistory.goBack();
    if (entry) {
      setCurrentUrl(entry.url);
      setError(undefined);
      setIsLoading(true);
    }
  }, [browserHistory]);

  const handleGoForward = useCallback(() => {
    const entry = browserHistory.goForward();
    if (entry) {
      setCurrentUrl(entry.url);
      setError(undefined);
      setIsLoading(true);
    }
  }, [browserHistory]);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setError(undefined);
    // Force iframe reload by changing src
    if (window) {
      updateWindow(window.id, { updatedAt: new Date() });
    }
  }, [window, updateWindow]);

  const handleGoHome = useCallback(() => {
    handleNavigate(initialUrl);
  }, [handleNavigate, initialUrl]);

  const handleContentLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleContentError = useCallback((errorMessage: string) => {
    setIsLoading(false);
    setError(errorMessage);
  }, []);

  // Auto-load initial URL when window opens
  useEffect(() => {
    if (open && currentUrl === initialUrl) {
      handleNavigate(initialUrl);
    }
  }, [open, currentUrl, initialUrl, handleNavigate]);

  return (
    <StoreDraggableWindow
      // windowId={effectiveWindowId}
      title={title}
      description="Browser Window"
      type="browser"
      icon={icon}
      defaultPosition={defaultPosition}
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      onClose={onClose}
      className={className}
    >
      <BrowserContent
        windowId={effectiveWindowId || ''}
        url={currentUrl}
        isLoading={isLoading}
        error={error}
        canGoBack={browserHistory.canGoBack()}
        canGoForward={browserHistory.canGoForward()}
        title={title}
        config={effectiveConfig}
        onUrlChange={handleContentLoad}
        onNavigate={handleNavigate}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onRefresh={handleRefresh}
        onGoHome={handleGoHome}
      />
    </StoreDraggableWindow>
  );
}
