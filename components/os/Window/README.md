# Dynamic OS Window Component

A fully dynamic, configurable window component that mimics operating system window behavior with support for different OS styling, dynamic menus, and flexible content rendering.

## Features

- **Window State Management**: Full support for minimize, maximize, close, and open states
- **Dynamic Menu System**: Integrated with the `DynamicMenu` system for flexible menu configuration
- **OS-Specific Styling**: Support for both Mac and Windows/other OS styling patterns
- **Custom Content**: Accepts any React content as children
- **Controlled & Uncontrolled**: Can be controlled by parent state or work independently
- **Event Callbacks**: Comprehensive callback system for window state changes
- **Responsive Design**: Adapts to different screen sizes

## Basic Usage

### Simple Window

```tsx
import { OSWindow } from "@/components/os/Window";

export default function Example() {
  return (
    <OSWindow 
      title="My Application"
      description="This is a simple window"
    />
  );
}
```

### Custom Menu Configuration

```tsx
import { OSWindow, MenuConfig } from "@/components/os/Window";

const customMenu: MenuConfig[] = [
  {
    label: 'File',
    content: [
      { type: 'item', label: 'New', shortcut: { keys: '⌘N' } },
      { type: 'item', label: 'Open...', shortcut: { keys: '⌘O' } },
      { type: 'separator' },
      { type: 'item', label: 'Save', shortcut: { keys: '⌘S' } },
    ]
  },
  {
    label: 'Edit',
    content: [
      { type: 'item', label: 'Undo', shortcut: { keys: '⌘Z' } },
      { type: 'item', label: 'Redo', shortcut: { keys: '⇧⌘Z' } },
      { type: 'separator' },
      { type: 'checkbox', label: 'Auto-save', checked: true },
    ]
  }
];

export default function CustomMenuExample() {
  return (
    <OSWindow 
      title="Custom Application"
      description="Window with custom menu"
      menuConfig={customMenu}
    />
  );
}
```

### Custom Content

```tsx
export default function CustomContentExample() {
  return (
    <OSWindow 
      title="Rich Content Window"
      description="Window with custom content"
    >
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-blue-900">Custom Content</h3>
          <p className="text-blue-700 mt-2">
            This content is completely customizable.
          </p>
        </div>
        {/* Any React content here */}
      </div>
    </OSWindow>
  );
}
```

### Controlled Window

```tsx
import { useState } from "react";

export default function ControlledExample() {
  const [windowOpen, setWindowOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setWindowOpen(true)}>
        Open Window
      </button>
      
      <OSWindow 
        title="Controlled Window"
        description="This window is controlled by parent state"
        open={windowOpen}
        onOpenChange={setWindowOpen}
        onClose={() => console.log('Window closed')}
        onMinimize={() => console.log('Window minimized')}
        onMaximize={() => console.log('Window maximized')}
      >
        <div className="text-center py-8">
          <p>🎉 Hello from controlled window!</p>
        </div>
      </OSWindow>
    </div>
  );
}
```

### Custom Trigger

```tsx
import { Button } from "@/components/ui/button";

export default function CustomTriggerExample() {
  return (
    <OSWindow 
      title="Custom Trigger"
      trigger={
        <Button variant="outline" size="lg">
          Open My Window
        </Button>
      }
    >
      <p>This window uses a custom trigger button.</p>
    </OSWindow>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Dynamic Window"` | Window title displayed in the title bar |
| `description` | `string` | `"This is a dynamic window..."` | Description shown below the title |
| `menuConfig` | `MenuConfig[]` | `defaultOSMenuConfig` | Dynamic menu configuration |
| `onClose` | `() => void` | `undefined` | Callback when window is closed |
| `onMinimize` | `() => void` | `undefined` | Callback when window is minimized |
| `onMaximize` | `() => void` | `undefined` | Callback when window is maximized |
| `children` | `React.ReactNode` | `undefined` | Custom window content |
| `trigger` | `React.ReactNode` | `undefined` | Custom trigger element |
| `open` | `boolean` | `false` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback for open state changes |
| `osType` | `'mac' \| 'others'` | `'mac'` | OS styling type (Mac vs Windows) |
| `className` | `string` | `undefined` | Additional CSS classes |

## Window States

The component supports the following window states:

- **`open`**: Window is visible and active
- **`minimized`**: Window is minimized (visual feedback in controls)
- **`maximized`**: Window is maximized (visual feedback in controls)
- **`closed`**: Window is closed/hidden

## Interactive Features

### Window Controls

- **Close Button**: Closes the window (triggers `onClose` callback)
- **Minimize Button**: Minimizes the window (triggers `onMinimize` callback)
- **Maximize Button**: Toggles maximize state (triggers `onMaximize` callback)

### OS Styling Toggle

Double-click on the title bar to toggle between Mac and Windows/other OS styling patterns. This is useful for testing and demonstration purposes.

### Dynamic Menu System

The window integrates with the `DynamicMenu` system, allowing for:

- Configurable menu items with shortcuts
- Checkbox and radio button menu items
- Submenu support
- Custom event handlers for menu actions

## Menu Configuration

See the [DynamicMenu Documentation](../DynamicMenu/README.md) for detailed information about menu configuration options.

## Customization

### Styling

The component uses Radix UI Themes and Tailwind CSS for styling. You can customize the appearance by:

1. Modifying the component's `className` prop
2. Using the Theme provider for global styling
3. Extending the CSS with custom classes

### Custom Window Controls

You can implement custom window control behavior by providing your own callback functions:

```tsx
<OSWindow 
  onClose={() => {
    // Custom close logic
    setWindowVisible(false);
    // Additional cleanup
  }}
  onMinimize={() => {
    // Custom minimize logic
    setWindowState('minimized');
  }}
  onMaximize={() => {
    // Custom maximize logic
    toggleFullscreen();
  }}
/>
```

## Examples

See the main demo page (`app/page.tsx`) for comprehensive examples of all features:

- Basic window usage
- Custom menu configuration
- Custom content rendering
- Controlled window state
- Multiple windows with different OS styles

## Integration

This component is designed to work seamlessly with:

- Next.js 15+ with App Router
- React 19+
- Radix UI components
- Tailwind CSS
- TypeScript

## TypeScript Support

The component is fully typed with TypeScript, providing:

- Comprehensive prop interfaces
- Type-safe menu configuration
- Proper state management types
- Event callback typing

## Accessibility

The component follows accessibility best practices:

- Keyboard navigation support
- Screen reader compatibility
- ARIA labels and roles
- Focus management
- High contrast support
