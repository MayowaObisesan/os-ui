# New Window Demo - How Links Open in New BrowserWindows

## ✅ YES! This is Already Implemented

The BrowserWindow system **already supports** opening links in new windows. Here's how:

## How It Works

### 1. Force New Window for All Links
```tsx
<LinkInterceptor forceNewWindow={true}>
  <div>
    <a href="https://example.com">Link 1</a>
    <a href="https://httpbin.org">Link 2</a>
    <a href="mailto:test@example.com">Email Link</a>
  </div>
</LinkInterceptor>
```
**Result:** Each click creates a **brand new browser window**

### 2. Individual Link Control
```tsx
<InterceptedLink 
  href="https://example.com" 
  config={{ forceNewWindow: true }}
>
  Always Opens New Window
</InterceptedLink>
```

### 3. Smart Window Management
- **Without `forceNewWindow`:** Uses existing window or creates new one
- **With `forceNewWindow`:** Always creates a new window
- **With `targetWindowId`:** Updates specific window

## Usage Examples

### Demo 1: Always New Windows
```tsx
<LinkInterceptor forceNewWindow={true}>
  <div className="space-y-2">
    <a href="https://example.com" className="block text-blue-600">
      Open Example.com in New Window
    </a>
    <a href="https://httpbin.org/html" className="block text-blue-600">
      Open HTTPBin in New Window
    </a>
    <a href="https://jsonplaceholder.typicode.com" className="block text-blue-600">
      Open JSONPlaceholder in New Window
    </a>
  </div>
</LinkInterceptor>
```

### Demo 2: Smart Window Usage
```tsx
<LinkInterceptor>
  {/* First link creates a new window */}
  <a href="https://example.com">First Link (creates window)</a>
  
  {/* Second link updates the same window */}
  <a href="https://httpbin.org">Second Link (updates window)</a>
</LinkInterceptor>
```

### Demo 3: Programmatic Control
```tsx
import { useLinkInterceptor } from "@/components/os/LinkInterceptor";

function MyComponent() {
  const { interceptLink } = useLinkInterceptor();

  return (
    <div>
      <button onClick={() => interceptLink('https://example.com')}>
        Open in New Window
      </button>
      <button onClick={() => interceptLink('https://httpbin.org', { forceNewWindow: true })}>
        Force New Window
      </button>
    </div>
  );
}
```

## Current Implementation Details

The `LinkInterceptor` component has these props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `forceNewWindow` | `boolean` | `false` | Always create new window |
| `targetWindowId` | `string` | `undefined` | Target specific window |
| `config` | `BrowserWindowConfig` | `{}` | Browser configuration |

## How the Logic Works

```typescript
// In openInBrowserWindow function:
if (config.forceNewWindow || !config.targetWindowId) {
  // Always create new window
  windowId = createWindow({ /* new window config */ });
} else {
  // Update existing window
  windowId = config.targetWindowId;
  updateWindow(windowId, { /* update config */ });
}
```

## Test It Yourself

1. **Basic Test:** Wrap any content with `<LinkInterceptor forceNewWindow={true}>`
2. **Click multiple links** - each should open in a new browser window
3. **Verify behavior** - windows should be draggable, minimizable, etc.

## What Happens

1. **User clicks link**
2. **LinkInterceptor catches the click**
3. **Creates new BrowserWindow** (if `forceNewWindow=true`)
4. **Window opens with the URL** in an iframe
5. **User can navigate, minimize, maximize, close** just like any other window

## Multiple Windows

You can have **multiple browser windows** open simultaneously:

```
Window 1: https://example.com
Window 2: https://httpbin.org  
Window 3: https://jsonplaceholder.typicode.com
```

Each window is independent and can be managed separately through your existing window management system.

This creates a true **multi-tab browser experience** within your OS-like interface!
