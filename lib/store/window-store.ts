"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

// Define types for window state
export type WindowState = "open" | "minimized" | "maximized" | "closed";

export interface BrowserWindowData {
  currentUrl?: string;
  history?: string[];
  historyIndex?: number;
  isLoading?: boolean;
  title?: string;
  favicon?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  error?: string;
}

export interface WindowInfo {
  id: string;
  title?: string;
  type?: "basic" | "draggable" | string;
  state: WindowState;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  zIndex: number;
  createdAt: Date;
  updatedAt: Date;
  browserData?: BrowserWindowData;
  icon?: React.ReactNode; // Add icon for dock display
  // Additional window-specific data can be added here
  [key: string]: any;
}

interface WindowStoreState {
  windows: Record<string, WindowInfo>;
  windowCount: number;
  activeWindowId?: string;
  nextZIndex: number;
  dockItems: string[]; // Track window IDs in dock
}

interface WindowStoreActions {
  addWindow: (windowData: Omit<WindowInfo, "id" | "createdAt" | "updatedAt" | "zIndex">) => string;
  removeWindow: (id: string) => void;
  updateWindowState: (id: string, state: Partial<WindowInfo>) => void;
  setWindowPosition: (id: string, position: { x: number; y: number }) => void;
  setWindowSize: (id: string, size: { width: number; height: number }) => void;
  bringToFront: (id: string) => void;
  closeAllWindows: () => void;
  minimizeAllWindows: () => void;
  restoreAllWindows: () => void;
  setActiveWindow: (id?: string) => void;

  // Dock management actions
  addWindowToDock: (id: string) => void;
  removeWindowFromDock: (id: string) => void;
  getDockItems: () => WindowInfo[];
  restoreWindowFromDock: (id: string) => void;
  closeWindowFromDock: (id: string) => void;

  // Browser-specific actions
  updateBrowserData: (id: string, browserData: Partial<BrowserWindowData>) => void;
  navigateBrowser: (id: string, url: string, title?: string) => void;
  browserGoBack: (id: string) => void;
  browserGoForward: (id: string) => void;
  setBrowserLoading: (id: string, isLoading: boolean) => void;
  setBrowserError: (id: string, error?: string) => void;

  // Selectors
  getWindowById: (id: string) => WindowInfo | undefined;
  getWindowsByType: (type: string) => WindowInfo[];
  getOpenWindows: () => WindowInfo[];
  getWindowCount: () => number;
  getActiveWindow: () => WindowInfo | undefined;
  getWindowsByState: (state: WindowState) => WindowInfo[];
  getBrowserWindows: () => WindowInfo[];
  getMinimizedWindows: () => WindowInfo[];
}

// Export types for use in other files
export type { WindowStoreState, WindowStoreActions };


export const useWindowStore = create<WindowStoreState & WindowStoreActions>((set, get) => ({
  // Initial state
  windows: {},
  windowCount: 0,
  activeWindowId: undefined,
  nextZIndex: 100,
  dockItems: [],

  // Actions
  addWindow: (windowData) => {
    const id = uuidv4();
    const now = new Date();
    const newWindow: WindowInfo = {
      ...windowData,
      id,
      state: windowData.state || "open",
      zIndex: get().nextZIndex,
      createdAt: now,
      updatedAt: now,
      title: windowData.title || `Window ${get().windowCount + 1}`,
      type: windowData.type || "basic"
    };

    set((state) => ({
      windows: {
        ...state.windows,
        [id]: newWindow,
      },
      windowCount: state.windowCount + 1,
      nextZIndex: state.nextZIndex + 1,
      activeWindowId: id, // New window becomes active
    }));

    return id;
  },

  removeWindow: (id) => {
    const window = get().windows[id];
    if (!window) return;

    set((state) => {
      const newWindows = { ...state.windows };
      delete newWindows[id];

      // If removed window was active, clear active window
      const newActiveWindowId =
        state.activeWindowId === id ? undefined : state.activeWindowId;

      return {
        windows: newWindows,
        windowCount: state.windowCount - 1,
        activeWindowId: newActiveWindowId,
      };
    });
  },

  updateWindowState: (id, updates) => {
    set((state) => {
      const window = state.windows[id];
      if (!window) return state;

      const updatedWindow: WindowInfo = {
        ...window,
        ...updates,
        updatedAt: new Date(),
      };

      return {
        windows: {
          ...state.windows,
          [id]: updatedWindow,
        },
      };
    });
  },

  setWindowPosition: (id, position) => {
    get().updateWindowState(id, { position });
  },

  setWindowSize: (id, size) => {
    get().updateWindowState(id, { size });
  },

  bringToFront: (id) => {
    const window = get().windows[id];
    if (!window) return;

    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...window,
          zIndex: state.nextZIndex,
          updatedAt: new Date(),
        },
      },
      nextZIndex: state.nextZIndex + 1,
      activeWindowId: id,
    }));
  },

  closeAllWindows: () => {
    // @ts-ignore
    set((state) => {
      const updatedWindows = Object.fromEntries(
        Object.entries(state.windows).map(([id, window]) => [
          id,
          {
            ...window,
            state: "closed",
            updatedAt: new Date(),
          },
        ])
      );

      return {
        windows: updatedWindows,
        activeWindowId: undefined,
      };
    });
  },

  minimizeAllWindows: () => {
    // @ts-ignore
    set((state) => {
      const updatedWindows = Object.fromEntries(
        Object.entries(state.windows).map(([id, window]) => [
          id,
          {
            ...window,
            state: window.state === "closed" ? "closed" : "minimized",
            updatedAt: new Date(),
          },
        ])
      );

      return {
        windows: updatedWindows,
      };
    });
  },

  restoreAllWindows: () => {
    // @ts-ignore
    set((state) => {
      const updatedWindows = Object.fromEntries(
        Object.entries(state.windows).map(([id, window]) => [
          id,
          {
            ...window,
            state: window.state === "closed" ? "closed" : "open",
            updatedAt: new Date(),
          },
        ])
      );

      return {
        windows: updatedWindows,
      };
    });
  },

  setActiveWindow: (id) => {
    set({ activeWindowId: id });
  },

  // Dock management actions
  addWindowToDock: (id) => {
    const window = get().windows[id];
    if (!window) return;

    set((state) => {
      // Only add to dock if not already there
      if (state.dockItems.includes(id)) {
        return state;
      }

      return {
        dockItems: [...state.dockItems, id],
      };
    });
  },

  removeWindowFromDock: (id) => {
    set((state) => ({
      dockItems: state.dockItems.filter(itemId => itemId !== id),
    }));
  },

  getDockItems: () => {
    const state = get();
    return state.dockItems
      .map(id => state.windows[id])
      .filter(window => window && window.state === "minimized");
  },

  restoreWindowFromDock: (id) => {
    const window = get().windows[id];
    if (!window) return;

    set((state) => {
      const updatedWindow: WindowInfo = {
        ...window,
        state: "open",
        updatedAt: new Date(),
      };

      return {
        windows: {
          ...state.windows,
          [id]: updatedWindow,
        },
        dockItems: state.dockItems.filter(itemId => itemId !== id),
      };
    });
  },

  closeWindowFromDock: (id) => {
    get().removeWindow(id);
  },

  // Browser-specific actions
  updateBrowserData: (id, browserData) => {
    set((state) => {
      const window = state.windows[id];
      if (!window) return state;

      const updatedWindow: WindowInfo = {
        ...window,
        browserData: {
          ...window.browserData,
          ...browserData,
        },
        updatedAt: new Date(),
      };

      return {
        windows: {
          ...state.windows,
          [id]: updatedWindow,
        },
      };
    });
  },

  navigateBrowser: (id, url, title) => {
    get().updateBrowserData(id, {
      currentUrl: url,
      title: title || url,
      isLoading: true,
      error: undefined
    });
  },

  browserGoBack: (id) => {
    const window = get().windows[id];
    if (window?.browserData && window.browserData.history && window.browserData.historyIndex !== undefined) {
      if (window.browserData.historyIndex > 0) {
        const newIndex = window.browserData.historyIndex - 1;
        const newUrl = window.browserData.history[newIndex];
        get().updateBrowserData(id, {
          currentUrl: newUrl,
          historyIndex: newIndex,
          isLoading: true,
          error: undefined
        });
      }
    }
  },

  browserGoForward: (id) => {
    const window = get().windows[id];
    if (window?.browserData && window.browserData.history && window.browserData.historyIndex !== undefined) {
      if (window.browserData.historyIndex < window.browserData.history.length - 1) {
        const newIndex = window.browserData.historyIndex + 1;
        const newUrl = window.browserData.history[newIndex];
        get().updateBrowserData(id, {
          currentUrl: newUrl,
          historyIndex: newIndex,
          isLoading: true,
          error: undefined
        });
      }
    }
  },

  setBrowserLoading: (id, isLoading) => {
    get().updateBrowserData(id, { isLoading });
  },

  setBrowserError: (id, error) => {
    get().updateBrowserData(id, { error, isLoading: false });
  },

  // Selectors
  getWindowById: (id) => get().windows[id],
  getWindowsByType: (type) =>
    Object.values(get().windows).filter((window) => window.type === type),
  getOpenWindows: () =>
    Object.values(get().windows).filter(
      (window) => window.state === "open"
    ),
  getWindowCount: () => get().windowCount,
  getActiveWindow: () => {
    const activeId = get().activeWindowId;
    return activeId ? get().windows[activeId] : undefined;
  },
  getWindowsByState: (state) =>
    Object.values(get().windows).filter((window) => window.state === state),
  getBrowserWindows: () =>
    Object.values(get().windows).filter((window) => window.type === "browser"),
  getMinimizedWindows: () =>
    Object.values(get().windows).filter((window) => window.state === "minimized"),
}));
