# Draggable Window System

A comprehensive draggable window system built with React, dnd-kit, Zustand, and shadcn/ui components.

## Overview

This system replaces the previous AlertDialog-based window implementation with a new Card-based draggable window system that provides:

- **Multiple Window Support**: Manage up to 5 windows simultaneously
- **Drag & Drop Functionality**: Full drag-and-drop positioning using dnd-kit
- **Window State Management**: Minimize, maximize, close, and restore windows
- **Window Layering**: Proper z-index management and focus handling
- **State Persistence**: Window states are persisted using Zustand with localStorage
- **OS-Specific Styling**: Support for both macOS and Windows styling
- **Dynamic Menu Integration**: Full integration with DynamicOSMenu component

## Architecture

```
├── stores/
│   └── windowStore.ts          # Zustand store for window state management
├── components/
│   └── os/
│       ├── DraggableWindow.tsx # New Card-based draggable window
│       ├── WindowsManager.tsx  # Manager component for multiple windows
│       └── DraggableWindowDemo.tsx # Demo component showcasing functionality
```

## Key Components

### 1. WindowStore (Zustand)
Centralized state management for all windows with features:
- Window CRUD operations
- State persistence
- Window limits (max 5)
- Z-index management
- Focus handling

### 2. DraggableWindow
Card-based window component that:
- Replaces AlertDialog with Card component
- Integrates dnd-kit for drag functionality
- Preserves all existing styling and functionality
- Provides visual feedback during dragging

### 3. WindowsManager
Manages the overall window system:
- Coordinates multiple windows
- Handles window layering
- Provides taskbar for minimized windows
- Manages window focus and active states

## Usage

### Basic Usage

```tsx
import { WindowSystem, useWindowFactory } from "@/components/os/WindowsManager";

function MyApp() {
  const { createWindow } = useWindowFactory();

  const handleOpenWindow = () => {
    createWindow({
      title: "My Window",
      description: "A draggable window",
      content: <div>Window content here</div>,
      osType: 'mac',
      position: { x: 100, y: 100 },
      size: { width: 500, height: 400 }
    });
  };

  return (
    <WindowSystem>
      <button onClick={handleOpenWindow}>Open Window</button>
    </WindowSystem>
  );
}
```

### Window Configuration

```tsx
interface WindowConfig {
  title: string;              // Window title
  description?: string;       // Window description
  content?: React.ReactNode;  // Window content
  menuConfig?: any[];         // Custom menu configuration
  osType?: 'mac' | 'others';  // OS styling type
  position?: { x: number; y: number }; // Initial position
  size?: { width: number; height: number }; // Initial size
  defaultState?: 'open' | 'minimized' | 'maximized'; // Initial state
}
```

## Features

### Window Controls
- **Close**: Removes the window from the system
- **Minimize**: Hides the window and adds it to the taskbar
- **Maximize**: Expands window to fill available space
- **Restore**: Returns maximized window to normal size

### Drag Functionality
- Drag windows by their title bars
- Visual feedback during dragging (shadows, opacity changes)
- Smooth positioning with dnd-kit
- Constraints to keep windows within viewport

### Window Management
- Automatic window focusing when clicked
- Proper z-index layering (newer windows appear on top)
- Taskbar for accessing minimized windows
- Window state persistence across sessions

### OS Styling
- **macOS Style**: Window controls on the left, rounded corners
- **Windows Style**: Window controls on the right, square corners
- Maintains all existing styling from the original OSWindow component

## State Persistence

The window system uses Zustand's persist middleware to save:
- Window positions and sizes
- Window states (open, minimized, maximized)
- Window content and configuration
- Z-index ordering

Session data is automatically restored when the application reloads.

## Window Limits

The system enforces a maximum of 5 open windows simultaneously. Users will see:
- Warning messages when attempting to exceed the limit
- Disabled window creation buttons when limit is reached
- Visual indicators in the window manager controls

## Demo

Visit `/` to see the interactive demo featuring:
- Multiple sample windows
- Drag and drop functionality
- Window state management
- OS styling comparisons
- Window limits demonstration

## Migration from OSWindow

The new system maintains full compatibility with the existing OSWindow API while providing enhanced functionality:

```tsx
// Old usage
<OSWindow
  title="My Window"
  description="Description"
  open={windowOpen}
  onOpenChange={setWindowOpen}
>
  Content here
</OSWindow>

// New usage with enhanced features
const { createWindow } = useWindowFactory();
const windowId = createWindow({
  title: "My Window",
  description: "Description",
  content: <div>Content here</div>
});
```

## Technical Details

### Dependencies
- `@dnd-kit/core`: Drag and drop functionality
- `@dnd-kit/sortable`: Advanced drag features
- `@dnd-kit/utilities`: Utility functions for dnd-kit
- `zustand`: State management with persistence
- `shadcn/ui`: Card components and styling

### Performance
- Efficient window rendering (only open windows are rendered)
- Optimized drag operations with dnd-kit
- Minimal re-renders with Zustand's selective subscriptions
- Smooth animations and transitions

### Browser Support
- Modern browsers with drag-and-drop API support
- Mobile touch support through dnd-kit
- Responsive design for various screen sizes

## Future Enhancements

Potential improvements for future versions:
- Snap-to-grid functionality
- Window resizing handles
- Virtual desktops support
- Window grouping and tabbing
- Custom window themes
- Keyboard shortcuts for window management
