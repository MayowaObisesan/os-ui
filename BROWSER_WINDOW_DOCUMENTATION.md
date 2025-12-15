# BrowserWindow System Documentation

## Overview

The BrowserWindow system creates a custom browser-like experience where **ALL links** (both internal and external) open within StoreDraggableWindow components. This creates an OS-like browsing experience where users never leave your application interface.

## Core Components

### 1. BrowserWindow Component
A draggable browser window that displays web content in iframes with full navigation controls.

**Key Features:**
- URL bar with search and navigation
- Back, Forward, Refresh, and Home buttons
- Iframe integration for displaying web content
- Loading states and error handling
- Security features and domain filtering
- Integration with your existing window management system

### 2. LinkInterceptor Component
Intercepts all link clicks globally and routes them through the browser window system.

**Key Features:**
- Global link interception
- Security validation and filtering
- Custom window targeting
- Support for all link types (http, https, mailto, tel, etc.)
- Configurable behavior

### 3. Utility Functions
Supporting utilities for URL processing, validation, and browser history management.

## Quick Start

### Basic BrowserWindow
```tsx
import { BrowserWindow } from "@/components/os/BrowserWindow";

function MyComponent() {
  return (
    <BrowserWindow
      initialUrl="https://www.google.com"
      title="My Browser"
      defaultPosition={{ x: 100, y: 100 }}
    />
  );
}
```

### Global Link Interception
```tsx
import { LinkInterceptor } from "@/components/os/LinkInterceptor";

function App() {
  return (
    <LinkInterceptor>
      <div>
        <a href="https://example.com">Example</a>
        <a href="mailto:test@example.com">Email</a>
        <a href="/about">About Page</a>
      </div>
    </LinkInterceptor>
  );
}
```

### Individual Intercepted Links
```tsx
import { InterceptedLink } from "@/components/os/LinkInterceptor";

function MyComponent() {
  return (
    <div>
      <InterceptedLink href="https://google.com">
        Search on Google
      </InterceptedLink>
      <InterceptedLink href="mailto:support@example.com">
        Contact Support
      </InterceptedLink>
    </div>
  );
}
```

## API Reference

### BrowserWindow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `windowId` | `string` | `undefined` | Specific window ID for targeting |
| `initialUrl` | `string` | `"https://www.google.com"` | Starting URL |
| `title` | `string` | `"Browser"` | Window title |
| `onClose` | `() => void` | `undefined` | Close handler |
| `className` | `string` | `undefined` | Additional CSS classes |
| `config` | `BrowserWindowConfig` | `{}` | Browser configuration |
| `defaultPosition` | `{ x: number; y: number }` | `{ x: 100, y: 100 }` | Initial position |
| `trigger` | `React.ReactNode` | `undefined` | Custom trigger button |
| `open` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Open state change handler |

### LinkInterceptor Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Content to intercept |
| `targetWindowId` | `string` | `undefined` | Target specific browser window |
| `forceNewWindow` | `boolean` | `false` | Force new window for each link |
| `config` | `BrowserWindowConfig` | `{}` | Browser configuration |
| `onLinkClick` | `(url: string, processedUrl: ProcessedUrl) => void` | `undefined` | Custom click handler |
| `className` | `string` | `undefined` | Additional CSS classes |

### BrowserWindowConfig

```typescript
interface BrowserWindowConfig {
  allowedDomains?: string[];      // Whitelist specific domains
  blockedDomains?: string[];      // Blacklist specific domains  
  enableJavaScript?: boolean;     // Enable JS in iframes (default: true)
  enablePopups?: boolean;         // Allow popups (default: false)
  userAgent?: string;             // Custom user agent
  referrerPolicy?: string;        // Referrer policy (default: 'strict-origin-when-cross-origin')
}
```

## Link Types Supported

### 1. External Links (https://example.com)
- Opens in new browser window
- Security attributes applied automatically
- Iframe-based display with sandboxing

### 2. Internal Links (/about, ./contact, ../parent)
- Handled through Next.js routing
- Can display in iframe or navigate directly
- Respects app's routing structure

### 3. Protocol Links
- **mailto:** - Opens email client
- **tel:** - Initiates phone call  
- **ftp:** - Opens FTP client or new window
- **http/https:** - Opens in browser window

### 4. Anchor Links (#section)
- Smooth scroll to page section
- Handled by browser's native behavior

### 5. Relative Links
- Converted to absolute URLs
- Processed through routing system

## Security Features

### Protocol Blocking
Blocked protocols (cannot be displayed):
- `javascript:` - Prevents XSS attacks
- `data:` - Blocks potential data injection  
- `vbscript:` - Legacy security
- `file:` - Local file access
- `chrome:` - Browser-specific protocols

### Domain Filtering
```tsx
<BrowserWindow
  config={{
    allowedDomains: ['trusted-sites.com', 'api.example.com'],
    blockedDomains: ['malicious-sites.com', 'phishing.com']
  }}
/>
```

### Iframe Security
- Automatic sandbox attributes
- Referrer policy enforcement
- Content Security Policy support
- XSS prevention measures

## Advanced Usage

### Custom Window Targeting
```tsx
// Open all links in a specific browser window
<LinkInterceptor targetWindowId="main-browser">
  <MyContent />
</LinkInterceptor>
```

### Multiple Browser Windows
```tsx
function App() {
  return (
    <>
      <BrowserWindow windowId="main" title="Main Browser" />
      <BrowserWindow windowId="dev" title="Dev Tools" />
      <LinkInterceptor targetWindowId="dev">
        <DeveloperTools />
      </LinkInterceptor>
    </>
  );
}
```

### Programmatic Link Interception
```tsx
import { useLinkInterceptor } from "@/components/os/LinkInterceptor";

function MyComponent() {
  const { interceptLink } = useLinkInterceptor();

  const handleCustomClick = () => {
    interceptLink('https://example.com', {
      blockedDomains: ['google.com']
    });
  };

  return <button onClick={handleCustomClick}>Open Safely</button>;
}
```

### Custom Protocol Handlers
```tsx
// Extend utility functions for custom protocols
import { handleSpecialProtocol } from "@/lib/utils/browser-utils";

// Add custom protocol handling in your components
const handleCustomProtocol = (url: string) => {
  if (url.startsWith('app:')) {
    // Handle custom app protocol
    openAppFeature(url);
  }
};
```

## Integration with Existing System

### Window Store Integration
The BrowserWindow system extends your existing window store with browser-specific data:

```typescript
// Browser data is automatically managed
interface BrowserWindowData {
  currentUrl: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
  title: string;
  favicon?: string;
  canGoBack: boolean;
  canGoForward: boolean;
  error?: string;
}
```

### Menu Integration
Browser windows integrate with your existing menu system:

```tsx
// Browser-specific menu items are automatically added
const browserMenuConfig = [
  {
    label: 'File',
    items: [
      { label: 'New Window', action: 'new-window' },
      { label: 'Close', action: 'close-window' }
    ]
  },
  // ... more menu items
];
```

### Theme Integration
BrowserWindow respects your existing theme system:
- Dark/light mode support
- Consistent styling with other windows
- Responsive design

## Performance Considerations

### Iframe Optimization
- Lazy loading of iframe content
- Efficient re-rendering
- Memory management for multiple windows
- Debounced URL updates

### Security vs Performance Trade-offs
- JavaScript disabled by default for untrusted content
- Selective iframe sandboxing
- Content caching strategies
- Error boundary handling

## Troubleshooting

### Common Issues

**1. Links not opening in browser windows**
- Ensure LinkInterceptor is wrapping your content
- Check for `data-no-intercept` attributes on links
- Verify browser window is properly initialized

**2. Iframe content not loading (X-Frame-Options errors)**
This is the most common issue. Many major websites block iframe embedding:

```
Refused to display 'https://www.google.com/' in a frame because it set 'X-Frame-Options' to 'sameorigin'.
```

**Sites that commonly block iframe embedding:**
- Google (google.com, gmail.com, etc.)
- Facebook (facebook.com, instagram.com)
- Twitter (twitter.com)
- YouTube (youtube.com)
- GitHub (github.com)
- LinkedIn (linkedin.com)

**Solutions:**
- Use sites that allow iframe embedding (example.com, httpbin.org, etc.)
- For blocked sites, the browser window will show a helpful error message
- Consider using protocol handlers (mailto:, tel:) for contact links
- Implement a fallback that opens blocked sites in new tabs

**3. Iframe content not loading**
- Check domain is not in blocked list
- Verify CORS permissions
- Check for X-Frame-Options headers

**4. Security errors**
- Review allowed/blocked domain lists
- Check protocol filtering settings
- Verify iframe sandbox attributes

**5. Performance issues**
- Limit number of concurrent browser windows
- Consider disabling JavaScript for untrusted content
- Implement content caching

### Debug Mode
Enable debug logging:
```tsx
<LinkInterceptor
  config={{
    // Add debug logging
    debug: true
  }}
>
  <Content />
</LinkInterceptor>
```

## Best Practices

### Security
1. Always specify allowed/blocked domains
2. Disable JavaScript for untrusted content
3. Use iframe sandboxing appropriately
4. Validate URLs before opening

### Performance
1. Limit concurrent browser windows
2. Implement proper error boundaries
3. Use lazy loading for iframe content
4. Clean up resources when windows close

### User Experience
1. Provide clear visual feedback for loading states
2. Handle errors gracefully with user-friendly messages
3. Implement proper navigation (back/forward)
4. Maintain consistent window behavior

## Examples

See `components/os/BrowserDemo.tsx` for a comprehensive demonstration of all features and use cases.

## Migration Guide

If you're upgrading from a basic link system:

1. **Replace direct links** with LinkInterceptor or InterceptedLink
2. **Update window management** to handle browser-specific data
3. **Add security configurations** for your use case
4. **Test all link types** to ensure proper behavior
5. **Optimize performance** based on your usage patterns

This system creates a truly OS-like browsing experience where users can browse the web entirely within your custom window system!
