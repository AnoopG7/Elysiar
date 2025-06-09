# Ride-Hailing Website Design System

## Brand Identity

The design system for our ride-hailing website clone aims to create a modern, clean, and intuitive user experience that surpasses the original Uber/Ola websites. The visual language emphasizes clarity, accessibility, and delight through thoughtful animations and interactions.

## Color Scheme

Our color palette is designed to be vibrant yet sophisticated, with strong contrast ratios to ensure accessibility while maintaining visual appeal.

### Primary Colors

- **Primary Blue** (#1A73E8): This vibrant blue serves as our primary brand color, used for key actions, buttons, and important UI elements. It conveys trust, reliability, and technology.

- **Secondary Teal** (#00C4B4): A refreshing teal that complements the primary blue, used for secondary actions, highlights, and accents.

### Neutral Colors

- **Dark Gray** (#212121): Used for primary text and important UI elements.
- **Medium Gray** (#757575): Used for secondary text and less prominent UI elements.
- **Light Gray** (#F5F5F5): Used for backgrounds, cards, and subtle separators.
- **White** (#FFFFFF): Used for backgrounds, cards, and text on dark backgrounds.

### Accent Colors

- **Success Green** (#34A853): Used for positive actions, confirmations, and success states.
- **Warning Amber** (#FBBC05): Used for warnings, important notices, and pending states.
- **Error Red** (#EA4335): Used for errors, destructive actions, and critical alerts.

### Dark Mode Colors

- **Dark Background** (#121212): Primary background for dark mode.
- **Dark Surface** (#1E1E1E): Secondary background for cards and elevated surfaces in dark mode.
- **Dark Text Primary** (#FFFFFF): Primary text color in dark mode.
- **Dark Text Secondary** (#B0B0B0): Secondary text color in dark mode.

## Typography

Typography plays a crucial role in creating a clear hierarchy and ensuring readability across all device sizes.

### Font Family

- **Primary Font**: 'Inter', sans-serif
  - A modern, highly readable sans-serif font that works well at all sizes and weights.
  - Fallback: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif

### Font Sizes

- **Display Large**: 48px / 3rem (56px line height)
- **Display Medium**: 36px / 2.25rem (44px line height)
- **Display Small**: 30px / 1.875rem (38px line height)
- **Heading Large**: 24px / 1.5rem (32px line height)
- **Heading Medium**: 20px / 1.25rem (28px line height)
- **Heading Small**: 18px / 1.125rem (24px line height)
- **Body Large**: 16px / 1rem (24px line height)
- **Body Medium**: 14px / 0.875rem (20px line height)
- **Body Small**: 12px / 0.75rem (16px line height)
- **Caption**: 11px / 0.6875rem (16px line height)

### Font Weights

- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Spacing System

A consistent spacing system helps create rhythm and hierarchy throughout the interface.

- **4px / 0.25rem**: Micro spacing (borders, small gaps)
- **8px / 0.5rem**: Extra small spacing
- **12px / 0.75rem**: Small spacing
- **16px / 1rem**: Base spacing
- **24px / 1.5rem**: Medium spacing
- **32px / 2rem**: Large spacing
- **48px / 3rem**: Extra large spacing
- **64px / 4rem**: 2x extra large spacing
- **96px / 6rem**: 3x extra large spacing

## Border Radius

- **Small**: 4px
- **Medium**: 8px
- **Large**: 12px
- **Extra Large**: 16px
- **Pill**: 9999px (for buttons and tags that should appear fully rounded)

## Shadows

- **Shadow Small**: 0 1px 2px rgba(0, 0, 0, 0.05)
- **Shadow Medium**: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- **Shadow Large**: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
- **Shadow Extra Large**: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)

## Animations and Transitions

- **Fast**: 100ms ease-in-out
- **Standard**: 200ms ease-in-out
- **Slow**: 300ms ease-in-out
- **Entry**: 200ms cubic-bezier(0.0, 0.0, 0.2, 1)
- **Exit**: 150ms cubic-bezier(0.4, 0.0, 1, 1)

## Component Design Guidelines

### Buttons

- **Primary Button**: Filled with primary color, bold text, medium border radius
- **Secondary Button**: Outlined with primary color, medium border radius
- **Text Button**: No background, primary color text
- **Icon Button**: Circular, with icon centered
- **Floating Action Button**: Circular, elevated, primary color with icon

### Form Elements

- **Text Fields**: Outlined style with floating labels
- **Dropdowns**: Custom styled select elements with animated indicators
- **Checkboxes and Radio Buttons**: Custom styled with animations
- **Toggles**: Pill-shaped with smooth transitions

### Cards

- **Elevation Levels**: 3 levels of elevation for different card types
- **Padding**: Consistent internal padding (16px/1rem)
- **Borders**: Either subtle shadows or 1px borders depending on context

### Navigation

- **Top Navigation**: Fixed position, elevated with shadow
- **Bottom Navigation (Mobile)**: Fixed at bottom, large touch targets
- **Side Navigation (Desktop)**: Collapsible, with hover states

### Modals and Dialogs

- **Entry Animation**: Fade in and scale up
- **Exit Animation**: Fade out and scale down slightly
- **Backdrop**: Semi-transparent black overlay
- **Dismissal**: Click outside or dedicated close button

### Maps and Location UI

- **Map Pins**: Custom designed with animation on selection
- **Route Lines**: Primary color with appropriate thickness
- **Location Input**: Special autocomplete field with recent locations

### Vehicle Selection

- **Vehicle Cards**: Visual representation with key details
- **Selection State**: Clear visual indication of selected vehicle
- **Comparison View**: Side-by-side comparison of options

### Loader and Progress Indicators

- **Spinner**: Circular animation using primary and secondary colors
- **Progress Bar**: Linear indicator for determinate progress
- **Skeleton Screens**: Placeholder animations for loading content

## Responsive Design Breakpoints

- **Mobile Small**: < 375px
- **Mobile**: 376px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px - 1439px
- **Desktop Large**: ≥ 1440px

## Accessibility Guidelines

- Maintain WCAG 2.1 AA compliance throughout the interface
- Ensure color contrast ratios meet accessibility standards
- Provide text alternatives for all non-text content
- Design keyboard navigation patterns for all interactive elements
- Support screen readers with appropriate ARIA attributes
- Ensure touch targets are at least 44px × 44px on mobile

## Dark Mode Implementation

- All components should have dark mode variants
- Avoid pure black (#000000) backgrounds; use dark grays instead
- Reduce contrast slightly in dark mode to prevent eye strain
- Maintain brand colors but adjust saturation and brightness as needed
