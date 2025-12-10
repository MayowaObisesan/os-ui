# Menu Registry System - Documentation

## Overview

The Menu Registry System is a context-based solution that allows dynamic menu registration and merging for components within `StoreDraggableWindow`. This system enables multiple components to contribute their own menu items that are automatically merged into a single, functional menu bar.

## Features

- ✅ **Automatic Registration**: Components register menus when they mount
- ✅ **Intelligent Merging**: Multiple menus with the same label are merged intelligently
- ✅ **Full State Access**: Menu actions have direct access to component state and methods
- ✅ **Priority System**: High, normal, and low priority menus control merge order
- ✅ **Merge Strategies**: Append, prepend, and replace strategies for menu items
- ✅ **Type Safety**: Full TypeScript support with proper type definitions
- ✅ **Backward Compatible**: Works alongside existing static menu approach

## Architecture

### Core Components

1. **MenuRegistryContext**: Context provider that manages menu registration and merging
2. **useMenuRegistry Hook**: React hook for components to register/unregister menus
3. **MenuRegistryProvider**: Provider component that wraps windows and manages the registry
4. **StoreDraggableWindow Integration**: Updated to support both registry and static menus

### Key Types

```typescript
// Menu registration options
interface MenuRegistrationOptions {
  componentName?: string;
  priority?: 'high' | 'normal' | 'low';
  mergeStrategy?: 'append' | 'prepend' | 'replace';
}

// Registered menu configuration
interface RegisteredMenuConfig extends MenuConfig {
  id: string;
  componentName: string;
  priority: 'high' | 'normal' | 'low';
  mergeStrategy: 'append' | 'prepend' | 'replace';
  timestamp: number;
}

// Context API
interface MenuRegistryContextType {
  registerMenu: (id: string, config: MenuConfig[], options?: MenuRegistrationOptions) => void;
  unregisterMenu: (id: string) => void;
  updateMenu: (id: string, config: MenuConfig[]) => void;
  getRegisteredMenus: () => RegisteredMenuConfig[];
  getMergedMenu: (overrideConfig?: MenuConfig[]) => MenuConfig[];
  getMenuByComponent: (componentName: string) => RegisteredMenuConfig[];
  isMenuRegistryEnabled: boolean;
  setMenuRegistryEnabled: (enabled: boolean) => void;
}
```

## Usage Examples

### Basic Component Menu Registration

```typescript
import { useMenuRegistry } from "@/components/os/MenuRegistryContext";
import { useEffect } from "react";

function MyComponent() {
  const { registerMenu, unregisterMenu } = useMenuRegistry();
  
  useEffect(() => {
    const myMenu: MenuConfig[] = [
      {
        label: 'My Component',
        content: [
          {
            type: 'item',
            label: 'Action 1',
            onClick: () => console.log('Action 1 clicked')
          },
          {
            type: 'separator'
          },
          {
            type: 'checkbox',
            label: 'Enable Feature',
            checked: true,
            onCheckedChange: (checked) => {
              console.log('Feature enabled:', checked);
            }
          }
        ]
      }
    ];

    registerMenu('my-component-menu', myMenu, {
      componentName: 'MyComponent',
      priority: 'normal',
      mergeStrategy: 'append'
    });

    return () => {
      unregisterMenu('my-component-menu');
    };
  }, [registerMenu, unregisterMenu]);

  return <div>My Component Content</div>;
}
```

### Component with State-Dependent Menu

```typescript
function Calculator() {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);
  const { registerMenu, unregisterMenu } = useMenuRegistry();

  useEffect(() => {
    const calculatorMenu: MenuConfig[] = [
      {
        label: 'Calculator',
        content: [
          {
            type: 'item',
            label: 'Copy Result',
            shortcut: { keys: '⌘C' },
            onClick: () => {
              navigator.clipboard.writeText(display);
            }
          },
          {
            type: 'item',
            label: 'Clear All',
            onClick: () => {
              setDisplay('0');
              setMemory(0);
            }
          }
        ]
      },
      {
        label: 'Memory',
        content: [
          {
            type: 'item',
            label: 'Memory Store (M+)',
            onClick: () => {
              setMemory(prev => prev + parseFloat(display));
            }
          },
          {
            type: 'item',
            label: 'Memory Recall (MR)',
            onClick: () => {
              setDisplay(String(memory));
            }
          }
        ]
      }
    ];

    registerMenu('calculator-menu', calculatorMenu, {
      componentName: 'Calculator',
      priority: 'high',
      mergeStrategy: 'append'
    });
  }, [display, memory, registerMenu, unregisterMenu]);

  return <div>Calculator UI</div>;
}
```

### Using in StoreDraggableWindow

```typescript
// New approach with menu registry
<StoreDraggableWindow
  title="My Window"
  description="Window with dynamic menus"
  enableMenuRegistry={true}
>
  <MyComponent />
  <AnotherComponent />
</StoreDraggableWindow>

// Legacy approach (still works)
<StoreDraggableWindow
  title="Legacy Window"
  menuConfig={staticMenuConfig}
  enableMenuRegistry={false}
>
  <div>Static content</div>
</StoreDraggableWindow>
```

## Menu Merging Behavior

### By Label Merging

When multiple components register menus with the same label, their content is merged:

```typescript
// Component 1 registers:
{ label: 'File', content: [New, Open, Save] }

// Component 2 registers:
{ label: 'File', content: [Export, Import] }

// Result:
File
├─ New
├─ Open
├─ Save
├─ Export  ← Component 2 items
└─ Import
```

### Merge Strategies

1. **Append** (default): Add items to the end
2. **Prepend**: Add items to the beginning
3. **Replace**: Replace existing content (keep first occurrence)

### Priority System

- **High**: Appears first in merge order
- **Normal**: Default priority
- **Low**: Appears last in merge order

## Advanced Features

### Conditional Menu Registration

```typescript
function ConditionalMenuComponent({ userRole }) {
  const { registerMenu } = useMenuRegistry();
  
  useEffect(() => {
    const menuConfig = userRole === 'admin' 
      ? adminMenuConfig 
      : userMenuConfig;
      
    registerMenu('conditional-menu', menuConfig);
  }, [userRole, registerMenu]);
}
```

### Dynamic Menu Updates

```typescript
function DynamicMenuComponent() {
  const { updateMenu } = useMenuRegistry();
  
  const handleDataChange = (newData) => {
    const updatedMenu = [
      {
        label: 'Data',
        content: [
          ...newData.map(item => ({
            type: 'item',
            label: item.name,
            onClick: () => processItem(item)
          }))
        ]
      }
    ];
    
    updateMenu('data-menu', updatedMenu);
  };
}
```

### Higher-Order Component

```typescript
// Automatic menu registration with HOC
const MenuRegisteredComponent = withMenuRegistration(
  MyComponent,
  {
    label: 'Component',
    content: [
      { type: 'item', label: 'Action', onClick: handleAction }
    ]
  },
  {
    priority: 'normal',
    mergeStrategy: 'append'
  }
);
```

## Debugging

### View Registered Menus

```typescript
function DebugPanel() {
  const { getRegisteredMenus } = useMenuRegistry();
  const menus = getRegisteredMenus();
  
  return (
    <div>
      <h3>Registered Menus ({menus.length})</h3>
      {menus.map(menu => (
        <div key={menu.id}>
          {menu.label} ({menu.componentName}) - {menu.priority}
        </div>
      ))}
    </div>
  );
}
```

## Migration Guide

### From Static Menus

**Before:**
```typescript
<StoreDraggableWindow
  menuConfig={[
    {
      label: 'File',
      content: [
        { type: 'item', label: 'New', onClick: handleNew }
      ]
    }
  ]}
>
  <MyComponent />
</StoreDraggableWindow>
```

**After:**
```typescript
<StoreDraggableWindow enableMenuRegistry={true}>
  <MyComponent />  {/* Registers its own menu */}
</StoreDraggableWindow>
```

### Gradual Migration

1. **Phase 1**: Add `enableMenuRegistry={true}` to existing windows
2. **Phase 2**: Convert components to use `useMenuRegistry` hook
3. **Phase 3**: Remove static `menuConfig` props when no longer needed

## Best Practices

### 1. Always Clean Up

```typescript
useEffect(() => {
  registerMenu('my-menu', menuConfig);
  
  return () => {
    unregisterMenu('my-menu');  // Important for cleanup
  };
}, [registerMenu, unregisterMenu]);
```

### 2. Use Specific Dependencies

```typescript
// Good: Include all dependencies that affect the menu
useEffect(() => {
  registerMenu('menu', menuConfig);
}, [someState, anotherState, registerMenu]);
```

### 3. Choose Appropriate Priority

```typescript
// Essential menu items
registerMenu('essential', config, { priority: 'high' });

// Standard functionality
registerMenu('standard', config, { priority: 'normal' });

// Optional features
registerMenu('optional', config, { priority: 'low' });
```

### 4. Use Descriptive IDs

```typescript
// Good
registerMenu('calculator-memory-menu', config);

// Avoid
registerMenu('menu1', config);
```

## API Reference

### MenuRegistryContext

#### Methods

- `registerMenu(id, config, options)`: Register a new menu
- `unregisterMenu(id)`: Remove a registered menu
- `updateMenu(id, config)`: Update an existing menu
- `getRegisteredMenus()`: Get all registered menus
- `getMergedMenu(overrideConfig?)`: Get the final merged menu configuration
- `getMenuByComponent(componentName)`: Get menus for a specific component

#### Options

- `componentName`: Name of the component registering the menu
- `priority`: 'high' | 'normal' | 'low' (default: 'normal')
- `mergeStrategy`: 'append' | 'prepend' | 'replace' (default: 'append')

### MenuItem Types

- `item`: Regular menu item with onClick handler
- `separator`: Visual separator between items
- `checkbox`: Checkbox menu item
- `radioGroup`: Radio button group
- `submenu`: Nested submenu

## Troubleshooting

### Common Issues

1. **Menu not appearing**: Ensure component is wrapped in `MenuRegistryProvider`
2. **Actions not working**: Check that onClick handlers are properly bound
3. **Performance issues**: Use `useCallback` for menu action functions
4. **Memory leaks**: Always clean up with `unregisterMenu` in useEffect return

### Debug Steps

1. Enable debug panel to see registered menus
2. Check browser console for registration errors
3. Verify component mounting/unmounting order
4. Test with `enableMenuRegistry={false}` to isolate issues

## Future Enhancements

- [ ] Menu animation and transitions
- [ ] Keyboard shortcut management
- [ ] Menu state persistence
- [ ] Drag-and-drop menu reordering
- [ ] Contextual menus based on selection
- [ ] Menu internationalization support
