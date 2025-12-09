# Drag and Drop Implementation Plan for OSDraggableWindow

## Current Analysis
- The component already has `cursor-move` on the header (line 111)
- The project has DnD Kit libraries installed
- No existing drag/drop implementation found in the codebase

## Implementation Strategy

### Option 1: Using DnD Kit (Recommended)
Use the existing `@dnd-kit/core` library to implement proper drag functionality:

```typescript
import {useDraggable} from '@dnd-kit/core';

const {attributes, listeners, setNodeRef, transform} = useDraggable({
  id: 'draggable-window',
});
```

### Option 2: Custom Implementation
Implement a simpler custom drag solution using React state and mouse events.

## Recommended Approach: DnD Kit Implementation

### Steps:
1. Import necessary DnD Kit hooks
2. Wrap the draggable area with DnD Kit providers
3. Apply the draggable attributes to the header element
4. Handle position state management
5. Apply CSS transforms for smooth dragging

### Code Changes Needed:

1. **Add DnD Kit imports**:
```typescript
import {DndContext, useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
```

2. **Add position state**:
```typescript
const [position, setPosition] = useState({x: 0, y: 0});
```

3. **Wrap with DndContext**:
```typescript
<DndContext>
  {/* Window content */}
</DndContext>
```

4. **Make header draggable**:
```typescript
const {attributes, listeners, setNodeRef, transform} = useDraggable({
  id: 'draggable-window',
});

const headerStyle = transform
  ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      zIndex: 1000,
    }
  : undefined;
```

5. **Apply to header element**:
```typescript
<Flex
  ref={setNodeRef}
  style={headerStyle}
  {...listeners}
  {...attributes}
  className={cn("w-full cursor-move select-none", /* ... */)}
>
  {/* Header content */}
</Flex>
```

## Alternative: Simple Custom Implementation

If DnD Kit proves too complex, we can implement a simpler solution:

```typescript
const [isDragging, setIsDragging] = useState(false);
const [position, setPosition] = useState({x: 0, y: 0});
const [dragStart, setDragStart] = useState({x: 0, y: 0});

const handleMouseDown = (e) => {
  setIsDragging(true);
  setDragStart({
    x: e.clientX - position.x,
    y: e.clientY - position.y
  });
};

const handleMouseMove = (e) => {
  if (!isDragging) return;
  setPosition({
    x: e.clientX - dragStart.x,
    y: e.clientY - dragStart.y
  });
};

const handleMouseUp = () => setIsDragging(false);

// Apply to window container with transform style
