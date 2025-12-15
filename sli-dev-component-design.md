# Sli.dev Component Integration Design

## Overview
This document outlines the architecture for integrating sli.dev presentation functionality into the OS UI component system, following the established patterns of components like `TextEditor.tsx` and `Calculator.tsx`.

## Component Architecture

### Core Component: `SlideEditor.tsx`

The main component will be `components/os/SlideEditor.tsx` which will:

1. **State Management**: Track slide content, presentation mode, and editing state
2. **Menu Registration**: Register presentation-specific menus with the MenuRegistry
3. **Markdown Processing**: Handle slide content in markdown format
4. **Preview Mode**: Toggle between edit and presentation preview modes

### Key Features

#### 1. Slide Content Management
- Store slide content as markdown strings
- Support multiple slides with slide navigation
- Real-time markdown preview
- Slide metadata (title, layout, notes)

#### 2. Menu Integration
The component will register menus for:
- **Presentation Menu**: New presentation, Save, Load, Export, Present
- **Slide Menu**: Add slide, Delete slide, Duplicate slide, Move slide
- **Format Menu**: Text formatting, Layout options, Theme selection

#### 3. Presentation Features
- Full-screen presentation mode
- Slide navigation (keyboard shortcuts)
- Speaker notes support
- Slide transitions and animations

## Component Structure

```tsx
interface SlideEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
  enablePreview?: boolean;
}

interface Slide {
  id: string;
  content: string;
  notes?: string;
  layout: 'title' | 'content' | 'image' | 'quote';
}

interface PresentationState {
  slides: Slide[];
  currentSlideIndex: number;
  isPreviewMode: boolean;
  isPresentationMode: boolean;
}
```

## Menu Registration

The component will register menus following the established pattern:

```typescript
useEffect(() => {
  const slideEditorMenu: MenuConfig[] = [
    {
      label: 'Presentation',
      content: [
        { type: 'item', label: 'New Presentation', shortcut: { keys: '⌘N' } },
        { type: 'item', label: 'Save', shortcut: { keys: '⌘S' } },
        { type: 'item', label: 'Export', shortcut: { keys: '⌘E' } },
        { type: 'separator' },
        { type: 'item', label: 'Present', shortcut: { keys: '⌘P' } }
      ]
    },
    {
      label: 'Slides',
      content: [
        { type: 'item', label: 'Add Slide', shortcut: { keys: '⌘+' } },
        { type: 'item', label: 'Delete Slide', shortcut: { keys: '⌘⌫' } },
        { type: 'separator' },
        { type: 'submenu', label: 'Layout', children: [...] }
      ]
    }
  ];

  registerMenu('slide-editor-menu', slideEditorMenu, {
    componentName: 'SlideEditor',
    priority: 'high',
    mergeStrategy: 'append',
    exclusive: true
  });

  return () => unregisterMenu('slide-editor-menu');
}, [registerMenu, unregisterMenu]);
```

## Integration Points

### 1. Menu Registry Integration
- Uses `useMenuRegistry()` hook for menu registration
- Follows the same pattern as TextEditor and Calculator
- Registers with high priority and exclusive mode

### 2. UI Components Integration
- Uses existing UI components from `@/components/ui/`
- Integrates with the theme system
- Supports the mode toggle functionality

### 3. State Management
- Local component state for presentation data
- Integration with global state if needed for persistence
- Auto-save functionality

## Dependencies

To integrate sli.dev, we would need to add:
- `sli.dev` package for presentation rendering
- Markdown processing libraries (`marked` or `remark`)
- Potentially custom styling for slide themes

## Implementation Steps

1. **Create SlideEditor component** with basic structure
2. **Implement menu registration** following existing patterns
3. **Add markdown editing capabilities** with preview
4. **Implement presentation mode** with slide navigation
5. **Add export functionality** (HTML, PDF, etc.)
6. **Test integration** with existing menu system
7. **Add to demo pages** for testing and showcase

## File Structure

```
components/os/
├── SlideEditor.tsx          # Main component
├── SlidePreview.tsx         # Presentation preview component
└── SlideRenderer.tsx        # Individual slide renderer
```

## Next Steps

1. Create the basic `SlideEditor.tsx` component
2. Implement menu registration
3. Add markdown editing functionality
4. Create presentation preview mode
5. Test with existing menu system
6. Add to demo pages
