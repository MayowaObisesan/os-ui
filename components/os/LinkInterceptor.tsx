"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import {useWindowManagement, useWindowStore} from "@/lib/store";
import { processUrl, handleSpecialProtocol, BrowserWindowConfig } from "@/lib/utils/browser-utils";

export interface LinkInterceptorProps {
  children: React.ReactNode;
  targetWindowId?: string;
  forceNewWindow?: boolean;
  config?: BrowserWindowConfig;
  onLinkClick?: (url: string, processedUrl: any) => void;
  className?: string;
}

interface LinkHandlerConfig extends Required<BrowserWindowConfig> {
  targetWindowId?: string;
  forceNewWindow?: boolean;
  onLinkClick?: (url: string, processedUrl: any) => void;
}

/**
 * Global event handler for link clicks
 */
function useGlobalLinkInterceptor(config: LinkHandlerConfig) {
  const { createWindow, updateWindow } = useWindowManagement();
  const { getWindowById } = useWindowStore();

  const openInBrowserWindow = useCallback((url: string, processedUrl: any) => {
    let windowId: string;

    console.log('openInBrowserWindow called with:', { url, config });

    // Always create a new window if forceNewWindow is true
    if (config.forceNewWindow) {
      console.log('Creating new window due to forceNewWindow=true');
      windowId = createWindow({
        title: "Browser",
        type: "browser",
        state: "open",
        position: {
          x: 100 + Math.random() * 400,
          y: 100 + Math.random() * 300
        },
        browserData: {
          currentUrl: url,
          history: [url],
          historyIndex: 0,
          isLoading: true,
          title: url,
        },
      });
    }
    // If targetWindowId is specified, check if it exists
    else if (config.targetWindowId) {
      console.log('Checking for existing window with ID:', config.targetWindowId);
      const existingWindow = getWindowById ? getWindowById(config.targetWindowId) : null;
      console.log('Existing window found:', !!existingWindow, existingWindow);

      if (existingWindow) {
        // Update existing window
        console.log('Updating existing window');
        windowId = config.targetWindowId;
        updateWindow(windowId, {
          browserData: {
            currentUrl: url,
            title: url,
            isLoading: true,
            error: undefined,
          },
        });
      } else {
        // Create new window with the specified ID
        console.log('Creating new window (targetWindowId specified but not found)');
        windowId = createWindow({
          title: "Browser",
          type: "browser",
          state: "open",
          position: {
            x: 100 + Math.random() * 400,
            y: 100 + Math.random() * 300
          },
          browserData: {
            currentUrl: url,
            history: [url],
            historyIndex: 0,
            isLoading: true,
            title: url,
          },
        });
      }
    }
    // Default behavior: create new window
    else {
      console.log('Creating new window (default behavior)');
      windowId = createWindow({
        title: "Browser",
        type: "browser",
        state: "open",
        position: {
          x: 100 + Math.random() * 400,
          y: 100 + Math.random() * 300
        },
        browserData: {
          currentUrl: url,
          history: [url],
          historyIndex: 0,
          isLoading: true,
          title: url,
        },
      });
    }

    console.log('Final windowId:', windowId);
    return windowId;
  }, [createWindow, updateWindow, config.targetWindowId, config.forceNewWindow, getWindowById]);

  const handleLinkClick = useCallback((event: Event) => {
    const target = event.target as HTMLElement;

    // Find the closest anchor element
    const link = target.closest('a') as HTMLAnchorElement;
    if (!link) return;

    const url = link.getAttribute('href');
    if (!url) return;

    // Skip if it's a special link that should be handled normally
    if (link.hasAttribute('data-no-intercept') ||
        link.getAttribute('target') === '_blank' ||
        link.getAttribute('rel')?.includes('external')) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const processedUrl = processUrl(url, config);

    // Call custom onLinkClick handler
    config.onLinkClick?.(url, processedUrl);

    // Handle the URL based on its type
    if (!processedUrl.isValid || !processedUrl.isAllowed) {
      console.warn(`Blocked link: ${processedUrl.error || 'Invalid URL'}`);
      return;
    }

    // Handle special protocols
    if (!processedUrl.shouldUseIframe) {
      handleSpecialProtocol(url, processedUrl.protocol);
      return;
    }

    // Open in browser window
    console.log('Opening browser window for URL:', url, 'with config:', config);
    const windowId = openInBrowserWindow(url, processedUrl);
    console.log('Created/Updated window with ID:', windowId);
  }, [config, openInBrowserWindow]);

  useEffect(() => {
    document.addEventListener('click', handleLinkClick, true);
    return () => document.removeEventListener('click', handleLinkClick, true);
  }, [handleLinkClick]);
}

/**
 * Component that intercepts all link clicks within its children
 */
export function LinkInterceptor({
  children,
  targetWindowId,
  forceNewWindow = false,
  config = {},
  onLinkClick,
  className,
}: LinkInterceptorProps) {
  const mergedConfig = useMemo(() => ({
    allowedDomains: [],
    blockedDomains: [],
    enableJavaScript: true,
    enablePopups: false,
    userAgent: 'Mozilla/5.0 (compatible; BrowserWindow/1.0)',
    referrerPolicy: 'strict-origin-when-cross-origin',
    targetWindowId,
    forceNewWindow,
    onLinkClick,
    ...config,
  }), [config, targetWindowId, forceNewWindow, onLinkClick]);
  console.log("Before LinkInterceptor rendered", targetWindowId);

  useGlobalLinkInterceptor(mergedConfig);

  console.log("LinkInterceptor rendered", targetWindowId);

  return (
    <div className={className}>
      {children}
    </div>
  );
}

/**
 * Hook to manually intercept a link click
 */
export function useLinkInterceptor() {
  const { createWindow, updateWindow } = useWindowManagement();
  const { getWindowById} = useWindowStore();

  const interceptLink = useCallback((url: string, config: BrowserWindowConfig = {}) => {
    const processedUrl = processUrl(url, config);

    if (!processedUrl.isValid || !processedUrl.isAllowed) {
      console.warn(`Blocked link: ${processedUrl.error || 'Invalid URL'}`);
      return null;
    }

    // Handle special protocols
    if (!processedUrl.shouldUseIframe) {
      handleSpecialProtocol(url, processedUrl.protocol);
      return null;
    }

    // Open in browser window
    const windowId = createWindow({
      title: "Browser",
      type: "draggable",
      state: "open",
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      browserData: {
        currentUrl: url,
        history: [url],
        historyIndex: 0,
        isLoading: true,
        title: url,
      },
    });

    return windowId;
  }, [createWindow]);

  return { interceptLink };
}

/**
 * Higher-order component that adds link interception to any component
 */
export function withLinkInterceptor<P extends object>(
  Component: React.ComponentType<P>,
  config: BrowserWindowConfig = {}
) {
  const WrappedComponent = (props: P) => (
    <LinkInterceptor config={config}>
      <Component {...props} />
    </LinkInterceptor>
  );

  WrappedComponent.displayName = `withLinkInterceptor(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Component for creating links that are automatically intercepted
 */
interface InterceptedLinkProps extends React.PropsWithChildren {
  href: string;
  className?: string;
  config?: BrowserWindowConfig;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const InterceptedLink: React.FC<InterceptedLinkProps> = ({
  href,
  children,
  className,
  config = {},
  onClick,
}) => {
  const { interceptLink } = useLinkInterceptor();

  const handleClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();

    interceptLink(href, config);
    onClick?.(event);
  }, [href, config, onClick, interceptLink]);

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      data-intercepted-link="true"
    >
      {children}
    </a>
  );
};

export default LinkInterceptor;
