# LockScreen Component Design

## Overview
A beautiful, modern lock screen UI component that follows the project's design system and provides a secure way to unlock the system.

## Design Requirements

### Visual Design
- **Full-screen overlay** with semi-transparent background
- **Gradient background** using the project's color scheme
- **Centered lock screen content** with proper spacing
- **Responsive design** that works on all screen sizes
- **Dark/light theme support** using the existing theme system

### Components
1. **Time & Date Display**
   - Large, prominent time display
   - Smaller date display below
   - Auto-updating using JavaScript Date

2. **User Information**
   - User avatar/photo area
   - User name display
   - Optional status indicator

3. **Authentication Input**
   - Password input field (using existing Input component)
   - Placeholder text for guidance
   - Secure input (password type)

4. **Action Buttons**
   - Primary unlock button (using existing Button component)
   - Optional secondary actions (sleep, shutdown, etc.)

5. **System Information**
   - Battery status (if applicable)
   - Network status
   - Notifications indicator

## Technical Implementation

### Dependencies
- Existing UI components: `Button`, `Input`, `Card`
- Utility functions: `cn()` from `lib/utils`
- Theme system: Dark/light mode support
- Icons: For visual elements (user avatar, status indicators)

### Props Interface
```typescript
interface LockScreenProps {
  onUnlock: (password: string) => void;
  userName?: string;
  userAvatar?: string;
  showTime?: boolean;
  showDate?: boolean;
  showUserInfo?: boolean;
  unlockButtonText?: string;
  passwordPlaceholder?: string;
  className?: string;
}
```

### Component Structure
```
LockScreen
├── BackgroundOverlay (with gradient)
├── MainContent (centered)
│   ├── TimeDateDisplay
│   ├── UserInfoSection
│   ├── AuthenticationForm
│   │   ├── PasswordInput
│   │   └── UnlockButton
│   └── SystemStatus (optional)
└── Footer (optional actions)
```

## Styling Approach
- Use Tailwind CSS classes for layout and spacing
- Leverage existing theme variables for colors
- Follow the project's design system patterns
- Add subtle animations for user feedback
- Ensure proper contrast for accessibility

## Functionality
- Password input validation
- Enter key support for unlocking
- Focus management
- Error handling for failed attempts
- Loading state during authentication

## Accessibility
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus traps for modal behavior
- Color contrast compliance
