# Saihari Papers ERP - UI Theme & Style Guide

## Overview
This document outlines the approved UI theme and styling patterns used throughout the Saihari Papers ERP system, based on the factory-dashboard design. All pages should follow these guidelines to maintain consistency.

## Color Palette

### Primary Colors
- **Background**: `bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20`
- **Primary Blue**: `from-blue-600 to-indigo-600` (Active states, primary actions)
- **White/Glass**: `bg-white/80` or `bg-white/90` (Cards, sidebar, header)

### Secondary Colors
- **Green**: `from-green-500 to-green-600` (Success, sales)
- **Purple**: `from-purple-500 to-purple-600` (Production)
- **Orange**: `from-orange-500 to-orange-600` (Financial, warnings)
- **Teal/Cyan**: `from-teal-500 to-cyan-600` (Quality metrics)
- **Emerald**: `from-emerald-500 to-green-600` (Environmental)
- **Red**: `from-red-500 to-orange-600` (Alerts, errors)

### Text Colors
- **Primary Text**: `text-slate-900` (Headings, important text)
- **Secondary Text**: `text-slate-600` (Body text, labels)
- **Muted Text**: `text-slate-500` (Descriptions, metadata)
- **Light Text**: `text-slate-400` (Subtle labels)

## Typography

### Font Weights
- **Bold**: `font-bold` (Main headings, important numbers)
- **Semibold**: `font-semibold` (Section headings)
- **Medium**: `font-medium` (Navigation items, buttons)
- **Normal**: Default weight for body text

### Font Sizes
- **Large Headings**: `text-2xl` (Page titles)
- **Section Headings**: `text-lg` (Card titles)
- **Body Text**: `text-sm` (Default content)
- **Small Text**: `text-xs` (Metadata, labels)

## Layout Components

### Sidebar
```css
/* Sidebar Container */
.sidebar {
  @apply fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out;
  @apply bg-white/80 backdrop-blur-2xl shadow-2xl shadow-slate-900/10 border-r border-white/20;
}

/* Navigation Items */
.nav-item-active {
  @apply bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25;
}

.nav-item-inactive {
  @apply text-slate-600 hover:bg-slate-100/80 hover:text-slate-900;
}
```

### Header
```css
.header {
  @apply bg-white/80 backdrop-blur-2xl shadow-lg shadow-slate-900/5 border-b border-white/20 sticky top-0 z-40;
}
```

### Cards
```css
/* Main Dashboard Cards */
.dashboard-card {
  @apply relative bg-white/90 backdrop-blur-sm rounded-2xl p-6;
  @apply shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50;
  @apply transition-all duration-300 hover:scale-[1.02] cursor-pointer;
}

/* Card Glow Effect */
.card-glow {
  @apply absolute -inset-0.5 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300;
}
```

## Glass Morphism Effects

### Backdrop Blur
- **Strong Blur**: `backdrop-blur-2xl` (Sidebar, header)
- **Medium Blur**: `backdrop-blur-sm` (Cards)
- **Light Blur**: `backdrop-blur-md` (Overlays)

### Transparency Levels
- **High Opacity**: `bg-white/90` (Main cards)
- **Medium Opacity**: `bg-white/80` (Sidebar, header)
- **Low Opacity**: `bg-white/60` (Overlays)

## Shadows & Borders

### Shadow Styles
- **Card Shadows**: `shadow-xl shadow-slate-200/50`
- **Hover Shadows**: `hover:shadow-2xl hover:shadow-slate-300/50`
- **Icon Shadows**: `shadow-lg shadow-blue-500/25`
- **Sidebar Shadow**: `shadow-2xl shadow-slate-900/10`

### Border Styles
- **Subtle Borders**: `border-white/20`
- **Section Borders**: `border-slate-200/50`
- **Glass Borders**: `border border-white/30`

## Interactive Elements

### Buttons
```css
/* Primary Button */
.btn-primary {
  @apply bg-gradient-to-r from-blue-600 to-indigo-600 text-white;
  @apply px-4 py-2 rounded-lg shadow-lg hover:shadow-xl;
  @apply transition-all duration-200;
}

/* Secondary Button */
.btn-secondary {
  @apply bg-slate-100/80 hover:bg-slate-200/80 text-slate-600;
  @apply px-4 py-2 rounded-lg transition-colors;
}
```

### Hover Effects
- **Scale Transform**: `hover:scale-[1.02]` (Cards)
- **Color Transitions**: `transition-colors` (Buttons, links)
- **All Transitions**: `transition-all duration-300` (Cards)
- **Quick Transitions**: `transition-all duration-200` (Interactive elements)

## Icon Styling

### Icon Containers
```css
.icon-container {
  @apply p-3 rounded-xl shadow-lg;
  /* Use gradient backgrounds matching the card theme */
}

.icon-size {
  @apply h-6 w-6 text-white; /* For colored backgrounds */
  @apply h-5 w-5 text-slate-500; /* For neutral contexts */
}
```

## Spacing & Layout

### Grid Systems
- **Main Cards**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- **Secondary Cards**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

### Padding & Margins
- **Card Padding**: `p-6` (Main cards)
- **Section Spacing**: `space-y-6` (Between sections)
- **Item Spacing**: `space-y-2` or `space-y-3` (Within cards)

## Responsive Design

### Breakpoints
- **Mobile**: Default styles
- **Tablet**: `md:` prefix
- **Desktop**: `lg:` prefix

### Mobile Considerations
- Sidebar transforms: `translate-x-0` / `-translate-x-full`
- Grid adjustments: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Hidden elements: `lg:hidden` for mobile-only elements

## Animation & Transitions

### Standard Transitions
- **Duration**: `duration-300` (Standard), `duration-200` (Quick)
- **Easing**: `ease-in-out` (Sidebar), default for others
- **Transforms**: `transition-transform` (Sidebar)
- **All Properties**: `transition-all` (Cards, buttons)

### Special Effects
- **Pulse Animation**: `animate-pulse` (Notification badges)
- **Blur Effects**: Applied to background elements for depth

## Status Indicators

### Alert Colors
- **Critical**: `bg-red-100 text-red-600`
- **High**: `bg-orange-100 text-orange-600`
- **Medium**: `bg-yellow-100 text-yellow-600`
- **Low**: `bg-blue-100 text-blue-600`
- **Success**: `bg-green-100 text-green-600`

## Implementation Guidelines

1. **Always use glass morphism**: Combine `bg-white/80` with `backdrop-blur-*`
2. **Maintain gradient consistency**: Use the defined color gradients for icons and active states
3. **Apply proper shadows**: Use the shadow system for depth and hierarchy
4. **Ensure responsive design**: Test on all breakpoints
5. **Use consistent spacing**: Follow the grid and spacing patterns
6. **Implement hover effects**: Add appropriate transitions and transforms
7. **Maintain accessibility**: Ensure proper contrast ratios

## File Structure Reference
- Base styles defined in: `src/app/factory-dashboard/page.tsx`
- Global styles: `src/app/globals.css`
- Component library: `src/components/ui/`

---

**Note**: This theme guide is based on the approved factory-dashboard design. All new pages and components should follow these patterns to maintain visual consistency throughout the ERP system.