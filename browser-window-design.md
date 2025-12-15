# BrowserWindow Component Design

## Overview
Create a custom browser-like experience where ALL links (internal and external) open within StoreDraggableWindow components, creating an OS-like browsing experience.

## Core Concept
Instead of links opening in new tabs or the same tab, they all open in draggable, minimizable windows within your OS interface - like a real operating system browser.

## Architecture

### 1. BrowserWindow Component (`components/os/BrowserWindow.tsx`)
```typescript
interface BrowserWindowProps {
  windowId?: string;
  initialUrl?: string;
  title?: string;
  onClose?: () => void;
  className?: string;
  allowExternalLinks?: boolean;
  allowedDomains?: string[];
  blockedDomains?: string[];
}
```

### 2. BrowserContent Component (`components/os/BrowserContent.tsx`)
```typescript
interface BrowserContentProps {
  url: string;
  onUrlChange: (url: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  error?: string;
}
```

### 3. LinkInterceptor Component (`components/os/LinkInterceptor.tsx`)
```typescript
interface LinkInterceptorProps {
  children: React.ReactNode;
  targetWindowId?: string;
  forceNewWindow?: boolean;
  allowedDomains?: string[];
  blockedDomains?: string[];
}
```

## Key Features

### 1. URL Navigation
- **Address Bar**: Editable URL input with validation
- **Navigation Controls**: Back, Forward, Refresh, Home buttons
- **History**: Track browsing history within each window
- **Bookmarks**: Save frequently visited sites

### 2. Content Display
- **Iframe Integration**: Display external websites safely
- **Next.js Pages**: Render internal routes in iframe
- **Error Handling**: Display error pages for failed loads
- **Loading States**: Show loading indicators

### 3. Security Features
- **Domain Filtering**: Whitelist/blacklist specific domains
- **XSS Protection**: Sanitize content and prevent script injection
- **Popup Blocking**: Prevent unwanted popups and redirects
- **Safe Mode**: Disable JavaScript for untrusted sites

### 4. Window Management
- **Multiple Windows**: Support multiple browser windows simultaneously
- **Window Tabs**: Each window can have multiple tabs
- **Window Sharing**: Share window state across components
- **Persistent Storage**: Save window positions and sizes

## Implementation Approach

### Phase 1: Basic BrowserWindow
1. Create BrowserWindow wrapper around StoreDraggableWindow
2. Add basic URL bar and navigation controls
3. Integrate iframe for content display
4. Handle basic navigation (back/forward/refresh)

### Phase 2: Link Interception
1. Create LinkInterceptor component
2. Override default link behavior
3. Route all clicks through browser window system
4. Handle different link types (internal/external/protocols)

### Phase 3: Advanced Features
1. Add tab support within windows
2. Implement history management
3. Add bookmark functionality
4. Create settings and preferences

### Phase 4: Security & Polish
1. Implement domain filtering
2. Add popup blocking
3. Error handling and recovery
4. Performance optimization

## Usage Examples

### Basic Browser Window
```tsx
<BrowserWindow
  initialUrl="https://example.com"
  title="Example Browser"
  windowId="browser-1"
>
  {/* Browser content automatically rendered */}
</BrowserWindow>
```

### Link Interception
```tsx
<LinkInterceptor targetWindowId="browser-1">
  <div>
    <a href="https://google.com">Google</a>
    <a href="/about">About Page</a>
    <a href="mailto:test@example.com">Email</a>
  </div>
</LinkInterceptor>
```

### Global Link Interception
```tsx
// App.tsx
<LinkInterceptor 
  forceNewWindow={true}
  allowedDomains={['trusted-sites.com']}
>
  <AppContent />
</LinkInterceptor>
```

## Technical Considerations

### Iframe Security
- Use `sandbox` attribute for untrusted content
- Set appropriate `referrerpolicy`
- Handle `X-Frame-Options` from target sites

### URL Handling
- Validate and sanitize URLs
- Handle relative URLs correctly
- Support various protocols (http, https, mailto, tel)

### Performance
- Lazy load iframe content
- Implement content caching
- Optimize re-rendering

### Cross-Origin Issues
- Handle CORS restrictions
- Proxy external content if needed
- Fallback for blocked content

## Integration with Existing System

### Window Store Integration
```typescript
// Extend window store for browser-specific data
interface BrowserWindowInfo extends WindowInfo {
  currentUrl: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  title: string;
}
```

### Menu Integration
```typescript
// Add browser-specific menu items
const browserMenuConfig = [
  {
    label: 'File',
    items: [
      { label: 'New Window', action: 'new-window' },
      { label: 'New Tab', action: 'new-tab' },
      { label: 'Close', action: 'close-window' }
    ]
  },
  // ... more menu items
];
```

## Example Implementation Flow

1. **User clicks a link**
   - LinkInterceptor captures the click
   - Determines target window or creates new one
   - Opens/uses BrowserWindow

2. **BrowserWindow opens**
   - Shows loading state
   - Loads content in iframe
   - Updates URL bar and window title

3. **Navigation within window**
   - Back/forward buttons work
   - New links within iframe open in same window
   - External links can open in new window or same

4. **Window management**
   - Windows can be minimized, maximized, closed
   - Multiple windows can be open simultaneously
   - Window state persists

## Benefits of This Approach

1. **Consistent Experience**: All browsing happens within your OS interface
2. **Enhanced Control**: Full control over browsing behavior and security
3. **Multi-tasking**: Multiple browser windows like a real OS
4. **Integration**: Seamlessly integrated with your existing window system
5. **Customization**: Fully customizable browser experience

This creates a truly OS-like browsing experience where the user never leaves your application interface!
