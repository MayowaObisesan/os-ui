// @ts-nocheck
"use client";

import React, { ReactNode, useMemo } from "react";
import {useWindowStore, WindowStoreActions, WindowStoreState} from "./window-store";
import type { WindowState, WindowInfo } from "./window-store";

// Create a context for the window store
const WindowStoreContext = React.createContext<ReturnType<typeof useWindowStore> | null>(null);

export function WindowStoreProvider({ children }: { children: ReactNode }) {
  const store = useWindowStore();

  return (
    <WindowStoreContext.Provider value={store}>
      {children}
    </WindowStoreContext.Provider>
  );
}

// Custom hook for easy access to the window store
export function useWindowStoreContext() {
  const context = React.useContext(WindowStoreContext);
  if (!context) {
    throw new Error("useWindowStoreContext must be used within a WindowStoreProvider");
  }
  return context;
}

// Custom hooks for common window operations
export function useWindowManagement() {
  const store = useWindowStoreContext();

  const createWindow = React.useCallback((windowData: Parameters<typeof store.addWindow>[0]) => {
    return store.addWindow(windowData);
  }, [store]);

  const closeWindow = React.useCallback((id: string) => {
    store.removeWindow(id);
  }, [store]);

  const updateWindow = React.useCallback((id: string, updates: Parameters<typeof store.updateWindowState>[1]) => {
    store.updateWindowState(id, updates);
  }, [store]);

  const bringToFront = React.useCallback((id: string) => {
    store.bringToFront(id);
  }, [store]);

  const setActiveWindow = React.useCallback((id?: string) => {
    store.setActiveWindow(id);
  }, [store]);

  // Add missing batch operations
  const closeAllWindows = React.useCallback(() => {
    store.closeAllWindows();
  }, [store]);

  const minimizeAllWindows = React.useCallback(() => {
    store.minimizeAllWindows();
  }, [store]);

  const restoreAllWindows = React.useCallback(() => {
    store.restoreAllWindows();
  }, [store]);

  // Dock management actions
  const addWindowToDock = React.useCallback((id: string) => {
    store.addWindowToDock(id);
  }, [store]);

  const removeWindowFromDock = React.useCallback((id: string) => {
    store.removeWindowFromDock(id);
  }, [store]);

  const restoreWindowFromDock = React.useCallback((id: string) => {
    store.restoreWindowFromDock(id);
  }, [store]);

  const closeWindowFromDock = React.useCallback((id: string) => {
    store.closeWindowFromDock(id);
  }, [store]);

  const getDockItems = React.useCallback(() => {
    return store.getDockItems();
  }, [store]);

  return {
    createWindow,
    closeWindow,
    updateWindow,
    bringToFront,
    setActiveWindow,
    closeAllWindows,
    minimizeAllWindows,
    restoreAllWindows,
    addWindowToDock,
    removeWindowFromDock,
    restoreWindowFromDock,
    closeWindowFromDock,
    getDockItems,
  };
}

export function useWindowState() {
  const store = useWindowStoreContext();

  // Memoize selectors to prevent unnecessary recalculations
  const windows = store.windows;
  const windowCount = store.windowCount;
  const activeWindow = store.getActiveWindow();
  const openWindows = store.getOpenWindows();
  const minimizedWindows = store.getMinimizedWindows();
  const getWindowById = store.getWindowById;

  return {
    windows,
    windowCount,
    activeWindow,
    openWindows,
    minimizedWindows,
    getWindowById,
  };
}

// Hook for window tracking analytics
export function useWindowAnalytics() {
  const store = useWindowStoreContext();

  // Memoize window stats to prevent recalculation on every render
  const windowStats = useMemo(() => {
    const allWindows = Object.values(store.windows);
    const openCount = store.getOpenWindows().length;
    const minimizedCount = store.getWindowsByState("minimized").length;
    const maximizedCount = store.getWindowsByState("maximized").length;

    return {
      totalWindows: allWindows.length,
      openCount,
      minimizedCount,
      maximizedCount,
      closedCount: allWindows.length - openCount - minimizedCount - maximizedCount,
      windowTypes: allWindows.reduce((acc, window) => {
        acc[window.type] = (acc[window.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [store.windows, store.getOpenWindows, store.getWindowsByState]);

  return {
    windowStats,
    windowCount: store.windowCount,
  };
}

// Additional utility hooks
export function useWindowById(windowId: string) {
  const store = useWindowStoreContext();
  return store.getWindowById(windowId);
}

export function useWindowsByType(type: string) {
  const store = useWindowStoreContext();
  return useMemo(() => store.getWindowsByType(type), [store, type]);
}

export function useWindowsByState(state: WindowState) {
  const store = useWindowStoreContext();
  return useMemo(() => store.getWindowsByState(state), [store, state]);
}

// Hook for window position management
export function useWindowPosition(windowId: string) {
  const store = useWindowStoreContext();

  const setPosition = React.useCallback((position: { x: number; y: number }) => {
    store.setWindowPosition(windowId, position);
  }, [store, windowId]);

  const setSize = React.useCallback((size: { width: number; height: number }) => {
    store.setWindowSize(windowId, size);
  }, [store, windowId]);

  const window = store.getWindowById(windowId);

  return {
    position: window?.position,
    size: window?.size,
    setPosition,
    setSize,
    updatePosition: setPosition,
    updateSize: setSize,
  };
}

// Hook for dock items management
export function useDockItems() {
  const store = useWindowStoreContext();

  const dockItems = React.useMemo(() => store.getDockItems(), [store]);

  return {
    dockItems,
  };
}
