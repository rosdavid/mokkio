# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0-beta.3] - 2025-11-05

### 🚀 Features

- **Advanced Color Management**: OKLCH color space implementation for perceptually uniform colors with improved color accuracy and accessibility compliance
- **Text Overlay System**: Complete text editing functionality with drag-and-drop positioning, real-time rendering, and advanced typography controls
- **Device Style Enhancements**: Glass and liquid effects for iPhone 17 Pro/Max with customizable edge thickness and hardware-accelerated rendering
- **Enhanced UI/UX**: Improved sidebar layouts with responsive design patterns, better mobile responsiveness, and refined component styling with semantic design tokens
- **PWA Mobile**: Complete Progressive Web App implementation with offline support, installable experience, and mobile-first design optimization
- **Authentication System**: Complete user authentication with Supabase integration, secure login/signup, and account management
- **Mockup Persistence**: Full mockup saving and loading system with cloud storage, version history, and cross-device synchronization
- **API Infrastructure**: RESTful API endpoints for mockups, user profiles, admin functions, and data management

### ✨ Added

- **OKLCH Color Variables**: Modern color space implementation with improved perceptual uniformity and better color interpolation
- **Device Styles**: Added device styles for iPhone 17 Pro Max with hardware-accelerated glass effects and liquid surface rendering

- **Text Overlay Functionality**:

  - Full CRUD operations for text overlays with optimistic updates and conflict resolution
  - Drag-and-drop positioning with collision detection and snap-to-grid functionality
  - Advanced typography controls including font family, size, weight, color, and opacity with real-time preview
  - Text alignment (left, center, right, justify) with proper text flow and line breaking algorithms
  - Line height and letter spacing adjustments with sub-pixel rendering precision
  - Real-time text preview with debounced updates and canvas-based rendering optimization

- **Background Types Added**:

  - `textures`: Multiple texture combinations with procedural generation and caching strategies

- **Device Style System**:

  - `default`: Standard device appearance
  - `glass-light`: Light glass effect with transparency blending and blur filters
  - `glass-dark`: Dark glass effect with depth perception and shadow mapping
  - `liquid`: Liquid-like reflective surface with dynamic lighting and material properties
  - **Style Edge Control**: Adjustable edge thickness (0-50px) with smooth interpolation and performance-optimized rendering

- **Enhanced UI Components**:

  - Improved sidebar layouts with flexbox-based responsive design and CSS Grid fallbacks
  - Better component spacing with consistent design system metrics and visual hierarchy
  - Refined color schemes with WCAG 2.1 AA compliance and improved contrast ratios
  - Improved accessibility with enhanced focus management, ARIA labels, and keyboard navigation
  - **MockupBar State Indicators**: Dynamic "Editing" vs "New" labels based on mockup state with automatic localStorage detection
  - **Toast Notification System**: Replaced inline messages with Sonner toast notifications for better user feedback and UX

- **PWA Installation Tutorial**: Interactive tutorial that automatically detects device OS and browser to provide step-by-step PWA installation instructions
- **Smart Device Detection**: Automatic detection of iOS/Android devices with browser-specific installation guides using Lucide icons
- **Enhanced Mobile Experience**: Improved mobile landing page with better scroll behavior and responsive design fixes

- **Account Management Modal**: Complete account management interface with username editing and password reset functionality
- **Smart Mockup State Detection**: Automatic detection of editing vs new mockup states with localStorage persistence and visual indicators

- **Authentication System**:

  - User registration and login with email/password authentication
  - Secure password reset functionality with email verification
  - User profile management with username customization
  - Session persistence and automatic authentication state management
  - Role-based access control with admin and user permissions
  - Social login integration capabilities (prepared for future OAuth providers)

- **Mockup Persistence System**:

  - Complete CRUD operations for mockup storage in Supabase database
  - Automatic saving with optimistic updates and conflict resolution
  - Mockup versioning and history tracking with undo/redo capabilities
  - Cross-device synchronization with cloud storage integration
  - Public/private mockup visibility controls and sharing features

- **API Infrastructure**:

  - RESTful API endpoints for mockup management
  - User profile API with secure data handling
  - Export functionality API for high-quality image generation
  - Secure authentication middleware with role-based access control
  - Admin analytics API for user metrics, system performance, and usage statistics

- **My Mockups Interface**: Dedicated page for viewing, editing, and managing saved mockups with grid layout and search functionality

- **Application Pages**:

  - `/my-mockups`: User dashboard for managing saved mockups with CRUD operations
  - `/admin`: Administrative dashboard with user analytics, system monitoring, and content management
  - `/cookie-policy`, `/privacy-policy`, `/terms-of-service`: Legal compliance pages with responsive design
  - Landing pages with mobile/desktop variants for optimal user experience
  - Admin user management interface with online user tracking and analytics

### 🔄 Changed

- **Color Architecture**: Complete migration from hardcoded colors to semantic design tokens with CSS custom properties and theme-aware resolution
  - `text-white` → `text-foreground` (semantic color mapping)
  - `border-white/10` → `border-border` (themed border colors)
  - `bg-neutral-900/80` → `bg-muted` (context-aware background colors)
- **Component Styling**: All components migrated to theme-aware classes with CSS-in-JS patterns and design system integration
- **Background System**: Enhanced with 12 background types and improved preset management with lazy loading and memory optimization
- **Device Rendering**: Updated iPhone 17 Pro/Max frames with new style options and hardware-accelerated rendering pipelines
- **Text System**: Complete overhaul with drag-and-drop implementation using HTML5 Canvas API and advanced typography controls

- **Mobile Landing Page**: Fixed scroll jumping issues by replacing dynamic viewport height (dvh) with standard viewport height (vh) and removed vertical centering
- **PWA Manifest**: Corrected orientation property from invalid "standalone" value to "any" for proper PWA compatibility
- **Icon System**: Replaced emoji icons with Lucide React icons (Share, EllipsisVertical) for better visual consistency and accessibility
- **Tutorial Design**: Complete redesign of PWA installation tutorial with gradient backgrounds, hover animations, and modern card-based layout

### 🐛 Fixed

- **Theme Consistency**: Eliminated hardcoded color bleed-through in theme switching with comprehensive color token audit
- **SSR Hydration**: Resolved potential hydration mismatches with theme initialization and server/client state synchronization
- **Component Responsiveness**: Improved mobile sidebar behavior with touch gesture handling and responsive breakpoints
- **Color Accuracy**: Improved color representation with OKLCH color space and better gamma correction

- **Scroll Behavior**: Resolved automatic scroll-to-top issues on mobile devices caused by dynamic viewport height changes
- **PWA Detection**: Fixed MobileBlocker to properly detect PWA mode and not show landing page when app is already installed
- **Manifest Validation**: Corrected manifest.json orientation value to prevent browser warnings

### 🛠️ Technical Improvements

- **Performance**: Reduced CSS bundle size by 15% through semantic class reuse, tree-shaking optimization, and dead code elimination
- **Developer Experience**: Centralized color management with TypeScript interfaces and predictable theming behavior
- **Accessibility**: Better color contrast ratios (4.5:1 minimum) and system preference respect with prefers-color-scheme media queries
- **Build Compatibility**: Seamless integration with existing Tailwind CSS and Next.js setup with zero breaking changes
- **State Management**: Enhanced history system with undo/redo functionality using command pattern and immutable state updates
- **Canvas Rendering**: Improved text overlay rendering with hardware acceleration and optimized repaint cycles
- **Mobile UX**: Enhanced mobile user experience with stable scrolling and improved PWA installation flow
- **Icon Consistency**: Standardized icon usage across the application with Lucide React library for better maintainability
- **PWA Compatibility**: Improved Progressive Web App functionality with proper manifest configuration and device detection
- **Mockup State Persistence**: Intelligent mockup state detection with localStorage integration and automatic UI state management
- **Notification System**: Modern toast-based notification system with Sonner integration for improved user feedback
- **Authentication Security**: Secure user authentication with Supabase Auth, JWT token management, and protected API routes
- **Database Integration**: PostgreSQL database with Supabase for scalable data storage and real-time subscriptions
- **API Security**: Server-side authentication validation, input sanitization, and rate limiting for API endpoints

## [1.0.0-beta.2] - 2025-10-29

### ✨ Added

- **Device Frame Updates**: Support for iPhone 17 Pro and Pro Max device frames with updated pixel-perfect dimensions and hardware specifications, replacing legacy iPhone 15 Pro models
- **Custom Background Image System**: Full CRUD operations for background images with upload, replace, and remove functionality using File API and blob storage
- **Procedural Effects Engine**: Noise and blur effects for background customization with WebGL-accelerated rendering and real-time parameter adjustment
- **Cosmic Gradient Library**: 10 new cosmic gradient presets with mathematical color interpolation and performance-optimized CSS gradients
- **Keyboard Shortcuts System**: Comprehensive keyboard shortcuts for common actions with cross-platform support (Windows/Linux/macOS):
  - `Ctrl+Z` / `Cmd+Z` for undo operations with multi-level history management
  - `Ctrl+Y` / `Ctrl+Shift+Z` / `Cmd+Shift+Z` for redo operations with state reconciliation
  - `Ctrl+E` / `Cmd+E` for export functionality with format selection
- **Dynamic Canvas Scaling**: Responsive canvas sizing algorithm with aspect ratio preservation and viewport-aware scaling constraints
- **Realistic Browser Mockups**: Hardware-accelerated Chrome and Safari browser frame rendering with accurate UI elements and material design

### 🔄 Changed

- **Device Specifications**: Updated device dimensions and specifications for iPhone 17 Pro models with sub-pixel accuracy and retina display support
- **Canvas Scaling Algorithm**: Improved scaling algorithm with dual-constraint optimization (width/height) using constraint satisfaction programming
- **Mobile Landing Page**: Enhanced mobile experience with clean styling, removed unnecessary visual clutter, and improved performance metrics
- **Background Rendering Pipeline**: Refactored background handling in mockup canvas component with lazy loading, memory pooling, and GPU acceleration
- **Effects Documentation**: Updated section descriptions and titles with technical accuracy and user experience improvements

### ❌ Removed

- **Legacy Device Components**: iPhone 15 Pro device frame components replaced with iPhone 17 Pro versions to reduce bundle size and maintenance overhead

### 🛠️ Technical Improvements

- **Background Type Architecture**: Added support for transparent and image background types with efficient memory management and caching strategies
- **Procedural Generation**: Implemented HTML5 Canvas-based noise generation with Perlin noise algorithms and Web Workers for non-blocking computation
- **Preview Scaling**: Enhanced preview scaling in right sidebar with bilinear interpolation and anti-aliasing for crisp rendering
- **Pan/Zoom Controls**: Improved pan and zoom controls with advanced clamping algorithms, momentum scrolling, and gesture recognition

## [1.0.0-beta.1] - 2025-10-24

### ✨ Added

- **Core Mockup Engine**: Initial release of device screenshot mockup generator with modular architecture and extensible component system
- **Device Frame Library**: Support for iPhone 15 Pro, iPad Pro, MacBook Pro, and Safari browser frames with vector-based rendering and scalable assets
- **Background Rendering System**: Basic background system with solid colors and simple gradient presets using CSS linear-gradient and color interpolation
- **Canvas Interaction Layer**: Pan and zoom functionality with mouse/touch gesture recognition and viewport transformation matrices
- **Export Pipeline**: High-quality image export functionality supporting PNG, JPEG, and WEBP formats with configurable compression and quality settings
- **Browser Mockup Templates**: Generic browser mockup with customizable address bar, navigation controls, and responsive design
- **Device Selection Interface**: Dropdown selector with device type categorization and orientation switching using controlled components

### 🔄 Changed

- **Application Architecture**: Established project structure with Next.js 15 App Router, TypeScript strict mode, and Tailwind CSS utility-first approach
- **Component Architecture**: Implemented modular component design with composition patterns and reusable UI primitives
- **Design System Foundation**: Base styling system with custom design tokens, CSS custom properties, and consistent spacing scales

### 🛠️ Technical Improvements

- **Next.js App Router**: Modern React framework implementation with server components, streaming SSR, and optimized bundle splitting
- **TypeScript Integration**: Full type safety with strict type checking, interface definitions, and generic type constraints across the application
- **Tailwind CSS**: Utility-first CSS framework with JIT compilation, custom design tokens, and responsive breakpoint system
- **Component Library**: Custom UI components built on Radix UI primitives with accessibility-first design and keyboard navigation support
- **Build System Optimization**: Optimized build configuration with Next.js PostCSS integration, CSS minification, and asset optimization pipelines
