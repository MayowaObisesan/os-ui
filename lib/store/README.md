# Window Store Documentation

## Overview

The Window Store is a centralized state management system for tracking and managing windows in the OS UI application. It uses Zustand for efficient state management and provides comprehensive window tracking capabilities.

## Installation

The store is already integrated into the project. The WindowStoreProvider is automatically included in the main layout.

## Core Concepts

### Window State Management

Each window has the following properties tracked in the store:

- `id`: Unique identifier (UUID)
- `title`: Window title
- `type`: Window type ("basic", "draggable", "calculator", etc.)
- `state`: Current state ("open", "minimized", "maximized", "closed")
- `position`: Window position (for draggable windows)
- `size`: Window size
- `zIndex`: Z-index for window stacking
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Store Features

- **Centralized State**: All window states in one place
- **Window Count Tracking**: Automatic counting of open windows
- **Z-Index Management**: Automatic window stacking order
- **Analytics**: Real-time window statistics
- **Type Safety**: Full TypeScript support

## API Reference

### Basic Usage

```typescript
import { useWindowManagement, useWindowState } from "@/lib/store";

// In your component
function MyComponent() {
  const { createWindow, closeWindow, updateWindow } = useWindowManagement();
  const { windows, windowCount, activeWindow } = useWindowState();

  // Create a new window
  const windowId = createWindow({
    title: "My Window",
    type: "basic",
    state: "open",
  });

  // Update window state
  updateWindow(windowId, { state: "minimized" });

  // Close window
  closeWindow(windowId);

  return (
    <div>
      <p>Total windows: {windowCount}</p>
      <p>Active window: {activeWindow?.title}</p>
    </div>
  );
}
```

### Window Management Hooks

#### `useWindowManagement()`

Provides methods for managing windows:

```typescript
const {
  createWindow,
  closeWindow,
  updateWindow,
  bringToFront,
  setActiveWindow
} = useWindowManagement();
```

**Methods:**

- `createWindow(windowData)`: Creates a new window and returns its ID
- `closeWindow(id)`: Closes and removes a window
- `updateWindow(id, updates)`: Updates window properties
- `bringToFront(id)`: Brings window to front (highest z-index)
- `setActiveWindow(id?)`: Sets the active window

#### `useWindowState()`

Provides access to window state:

```typescript
const {
  windows,          // All windows as record
  windowCount,      // Total window count
  activeWindow,     // Currently active window
  openWindows,      // Array of open windows
  getWindowById     // Function to get window by ID
} = useWindowState();
```

#### `useWindowAnalytics()`

Provides window analytics and statistics:

```typescript
const { windowStats, windowCount } = useWindowAnalytics();

// windowStats includes:
{
  totalWindows: number,
  openCount: number,
  minimizedCount: number,
  maximizedCount: number,
  closedCount: number,
  windowTypes: Record<string, number> // Count by type
}
```

### Store Window Components

#### `<StoreWindow />`

A store-managed version of the basic window:

```jsx
<StoreWindow
  windowId="optional-id"  // If provided, uses existing window
  title="My Window"
  type="basic"
  description="Window description"
  onClose={() => console.log("Window closed")}
  onMinimize={() => console.log("Window minimized")}
>
  {/* Window content */}
  <p>Window content goes here</p>
</StoreWindow>
```

#### `<StoreDraggableWindow />`

A store-managed draggable window:

```jsx
<StoreDraggableWindow
  windowId="optional-id"
  title="Draggable Window"
  type="draggable"
  defaultPosition={{ x: 100, y: 100 }}
>
  {/* Window content */}
</StoreDraggableWindow>
```

#### `<WindowTracker />`

A component that displays real-time window analytics:

```jsx
<WindowTracker />
```

## Advanced Usage

### Custom Window Types

You can define custom window types:

```typescript
// Create a custom window
const windowId = createWindow({
  title: "Custom Window",
  type: "custom",  // Custom type
  state: "open",
  // Additional custom properties
  customData: { foo: "bar" }
});

// Access custom properties
const window = useWindowState().getWindowById(windowId);
console.log(window.customData); // { foo: "bar" }
```

### Window Lifecycle Management

```typescript
import { useEffect } from "react";
import { useWindowManagement } from "@/lib/store";

function WindowLifecycleDemo({ windowId }) {
  const { updateWindow, closeWindow } = useWindowManagement();

  useEffect(() => {
    // Window mounted - set initial state
    updateWindow(windowId, { state: "open" });

    return () => {
      // Window unmounted - clean up
      closeWindow(windowId);
    };
  }, [windowId]);

  return <div>Window lifecycle managed</div>;
}
```

### Batch Operations

```typescript
const { closeAllWindows, minimizeAllWindows, restoreAllWindows } = useWindowManagement();

// Close all windows
closeAllWindows();

// Minimize all open windows
minimizeAllWindows();

// Restore all minimized windows
restoreAllWindows();
```

## Integration with Existing Components

### Migrating from OSWindow to StoreWindow

```jsx
// Before (OSWindow)
<OSWindow
  title="My Window"
  onClose={handleClose}
  onMinimize={handleMinimize}
>
  Content
</OSWindow>

// After (StoreWindow)
<StoreWindow
  title="My Window"
  type="basic"
  onClose={handleClose}
  onMinimize={handleMinimize}
>
  Content
</StoreWindow>
```

### Using Both Systems Together

The store system is designed to work alongside existing components:

```jsx
function MixedWindowSystem() {
  return (
    <div>
      {/* Legacy window */}
      <OSWindow title="Legacy Window">
        Legacy content
      </OSWindow>

      {/* Store-managed window */}
      <StoreWindow title="Store Window" type="basic">
        Store-managed content
      </StoreWindow>
    </div>
  );
}
```

## Performance Considerations

### Selective Subscription

Zustand allows selective subscription to only the state you need:

```typescript
// Only re-render when windowCount changes
const windowCount = useWindowStore(state => state.windowCount);

// Only re-render when specific window changes
const window = useWindowStore(state =>
  state.windows[windowId]
);
```

### Memoization

For derived data, consider memoization:

```typescript
import { useMemo } from "react";

function WindowList() {
  const windows = useWindowStore(state => state.windows);

  const openWindows = useMemo(() =>
    Object.values(windows).filter(w => w.state === "open"),
    [windows]
  );

  return (
    <ul>
      {openWindows.map(window => (
        <li key={window.id}>{window.title}</li>
      ))}
    </ul>
  );
}
```

## Debugging

### Store Inspection

```typescript
// Get the entire store state for debugging
const storeState = useWindowStore.getState();
console.log("Current store state:", storeState);
```

### Window Tracking

The `<WindowTracker />` component provides real-time monitoring of all windows.

### Development Tools

- **Redux DevTools**: Zustand supports Redux DevTools for time-travel debugging
- **Console Logging**: The store logs important state changes

## Best Practices

1. **Window Identification**: Always use the returned window ID from `createWindow()`
2. **Cleanup**: Always call `closeWindow()` when windows are unmounted
3. **Type Safety**: Use the provided TypeScript types for better IDE support
4. **Performance**: Use selective subscription to minimize re-renders
5. **Error Handling**: Check if windows exist before operating on them

## Example: Complete Window Management System

```typescript
import { useWindowManagement, useWindowState } from "@/lib/store";

function WindowManager() {
  const { createWindow, closeWindow, bringToFront } = useWindowManagement();
  const { windowCount, openWindows } = useWindowState();

  const handleCreateWindow = () => {
    const windowId = createWindow({
      title: `Window ${windowCount + 1}`,
      type: "basic",
      state: "open",
    });

    // Automatically bring new window to front
    bringToFront(windowId);
  };

  const handleCloseAll = () => {
    openWindows.forEach(window => {
      closeWindow(window.id);
    });
  };

  return (
    <div>
      <h2>Window Manager</h2>
      <p>Open windows: {windowCount}</p>

      <button onClick={handleCreateWindow}>Create Window</button>
      <button onClick={handleCloseAll}>Close All</button>

      <div className="window-list">
        {openWindows.map(window => (
          <StoreWindow
            key={window.id}
            windowId={window.id}
            title={window.title}
          >
            <p>Window ID: {window.id}</p>
            <p>Created: {window.createdAt.toLocaleString()}</p>
          </StoreWindow>
        ))}
      </div>
    </div>
  );
}
```

## Troubleshooting

### Common Issues

**Issue**: Windows not appearing in tracker
**Solution**: Ensure `WindowStoreProvider` is wrapping your application

**Issue**: Window state not updating
**Solution**: Check that you're using the correct window ID and calling `updateWindow`

**Issue**: Performance issues with many windows
**Solution**: Use selective subscription and memoization

**Issue**: TypeScript errors
**Solution**: Ensure you're using the correct types from the store

## API Reference Summary

### Types

```typescript
type WindowState = "open" | "minimized" | "maximized" | "closed";

interface WindowInfo {
  id: string;
  title: string;
  type: string;
  state: WindowState;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  zIndex: number;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any; // Custom properties
}
```

### Store Methods

- `addWindow(windowData)`: Creates a window
- `removeWindow(id)`: Removes a window
- `updateWindowState(id, updates)`: Updates window state
- `setWindowPosition(id, position)`: Updates window position
- `bringToFront(id)`: Brings window to front
- `closeAllWindows()`: Closes all windows
- `minimizeAllWindows()`: Minimizes all windows
- `restoreAllWindows()`: Restores all windows
- `setActiveWindow(id?)`: Sets active window

### Selectors

- `getWindowById(id)`: Get window by ID
- `getWindowsByType(type)`: Get windows by type
- `getOpenWindows()`: Get all open windows
- `getWindowCount()`: Get total window count
- `getActiveWindow()`: Get active window
- `getWindowsByState(state)`: Get windows by state

## Demo

Check out the live demo at `/store-demo` to see the window store in action with real-time tracking and analytics.
