# Mokkio

[![Version](https://img.shields.io/badge/version-1.0.0--beta.4-blue.svg)](https://github.com/rosdavid/mokkio/releases)

A high-performance application for creating professional device mockups with advanced capabilities. Built with modern web technologies and optimized for both developer experience and end-user performance

## Resources

- **[CHANGELOG.md](CHANGELOG.md)** - Complete change history and version notes
- **[Live Demo](https://mokkio.vercel.app)** - Try Mokkio online
- **[David Ros Ferrer](https://davidros.vercel.app)** - Portfolio and contact

## Support & Contact

- **Issues**: [GitHub Issues](https://github.com/rosdavid/mokkio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rosdavid/mokkio/discussions)
- **Email**: Contact through [personal website](https://davidros.vercel.app)

For business inquiries or custom development, please reach out through the contact form on my website.

### Core Functionality

- **Device Mockup Engine**: Pixel-perfect rendering for iPhone 17 Pro/Max (Blue/Silver/Orange Titanium), iPad Pro 13, MacBook Pro 16, and browser frames (Chrome/Safari) with hardware-accelerated graphics
- **Scene Builder**: Multi-device layout system for creating complex mockup scenes with multiple devices, custom positioning, scaling, rotation, and z-index control
- **Interactive Canvas System**: Advanced canvas with drag-and-drop positioning, collision detection, smart guides, and real-time preview rendering
- **Text Overlay System**: Complete typography controls with font family, size, weight, color, opacity, alignment, and spacing adjustments

### Advanced Styling & Effects

- **Material Design System**: Glass, liquid, and retro effects for device frames with customizable edge thickness and dynamic lighting
- **Background Rendering Pipeline**: Multiple background types including:
  - Solid colors (72+ options)
  - Linear gradients (24 presets)
  - Radial gradients (12 presets)
  - Cosmic gradients (10 presets)
  - Magical AI-generated gradients
  - Textures (12+ options)
  - Custom image uploads
  - Transparent background
- **Shadow & Lighting Engine**: Advanced shadow presets (none, spread, hug, adaptive) with custom blur, spread, offset, and color controls
- **Color Management**: OKLCH color space implementation with perceptual uniformity and WCAG 2.1 AA compliance

### Layout System

- **Multiple Layout Modes**:
  - Single mockup display
  - Double mockup (side-by-side with adjustable spacing)
  - Scene Builder (build your own mockup)
- **Layout Presets**: Pre-configured layouts including centered, perspective, tilt 3D, isometric, flat plate, and more
- **Responsive Layouts**: Automatic adaptation for different screen sizes and orientations

### User Experience

- **Responsive Design**: Adaptive layouts optimized for mobile, tablet, and desktop with:
  - Touch gesture recognition
  - Mobile-optimized sidebar with collapsible sections
  - Unified navigation system
  - Cross-platform compatibility
- **Theme System**: Complete light/dark/system theme support with automatic system preference detection
- **Keyboard Shortcuts**: Comprehensive shortcuts for undo/redo/export operations with cross-platform support
- **Accessibility**: Full WCAG 2.1 AA compliance with ARIA labels, keyboard navigation, and screen reader support
- **Smart Guides & Snapping**: Visual guides for precise alignment with snap-to-grid and element-to-element snapping

### Mockup Management

- **Save Mockups**: Create and save mockups with custom names
- **Auto-Update**: Saving a mockup with an existing name automatically updates the previous version instead of creating duplicates
- **Load Mockups**: Load any saved mockup back into the editor with all settings preserved
- **Delete Mockups**: Remove unwanted mockups with confirmation
- **Visual Feedback**: Clear indicators show when mockups are saved, updated, or loaded

### Authentication & User Management

- **User Authentication**: Complete Supabase-powered authentication system with email/password signup and signin
- **Account Management**: User profile management with username editing and password reset functionality
- **Admin Panel**: Comprehensive admin dashboard for user management, analytics, and system monitoring
- **Session Management**: Secure session handling with automatic token refresh and logout
- **Role-Based Access**: Admin and user role system with protected routes and permissions
- **Real-time Presence**: Live tracking of online users with real-time updates

### Usage

1. **Device Selection**: Choose from iPhone 17 Pro/Max (Blue/Silver/Orange Titanium), iPad Pro, MacBook Pro, or browser frames (Chrome/Safari)
2. **Canvas Interaction**: Use drag-and-drop for positioning with collision detection, snap-to-grid, and multi-touch gesture support
3. **Customization**: Apply text overlays with advanced typography, choose from 7 background types, apply shadows and device styles
4. **Responsive Preview**: Test across mobile/tablet/desktop breakpoints with unified interface controls
5. **Export**: Generate high-resolution images with multiple format options and quality settings

## Performance Metrics

- **Bundle Size**: ~181KB First Load JS with optimized code splitting
- **First Paint**: <1.2s on modern devices with progressive loading
- **Canvas Rendering**: 60fps with hardware acceleration and debounced updates
- **Memory Usage**: <50MB for typical workflows with efficient caching
- **Lighthouse Score**: 95+ across all categories (mobile, tablet, desktop)
- **Responsive Performance**: Consistent 60fps across mobile/tablet breakpoints
- **Build Time**: ~4.7s with Turbopack optimization

## 🔐 Security Features

Mokkio implements enterprise-grade security measures:

- **Authentication Middleware**: Supabase SSR with secure cookie handling
- **Role-Based Access Control (RBAC)**: Protected admin routes and APIs
- **Rate Limiting**: Token bucket algorithm to prevent API abuse
  - Public APIs: 10 requests/minute per IP
  - Admin APIs: 20 requests/minute per IP
  - Export API: 3 requests/minute per IP (resource-intensive)
- **IP Detection**: Smart IP extraction (proxy, Cloudflare compatible)
- **Security Headers**: X-RateLimit-\* headers for transparency
- **HTTP 429 Responses**: Proper rate limit error handling with `retryAfter`

## API Reference

Mokkio provides RESTful APIs for mockup management and administrative functions. All APIs are protected with rate limiting.

### Mockup Management APIs

- **GET** `/api/export` - Export mockup as image (⚠️ Rate Limited: 3/min)
- **GET** `/api/mockups` - Retrieve all saved mockups (⚠️ Rate Limited: 10/min)
- **POST** `/api/mockups` - Save a new mockup (⚠️ Rate Limited: 10/min)
- **PUT** `/api/mockups/[id]` - Update an existing mockup (⚠️ Rate Limited: 10/min)
- **DELETE** `/api/mockups/[id]` - Delete a mockup (⚠️ Rate Limited: 10/min)

### Admin APIs (🔒 Protected)

All admin endpoints require authentication + admin role:

- **GET** `/api/admin/users` - List all users (⚠️ Rate Limited: 20/min)
- **GET** `/api/admin/analytics` - Get analytics data (⚠️ Rate Limited: 20/min)
- **GET** `/api/admin/online-users` - Get active users (⚠️ Rate Limited: 20/min)
- **PATCH** `/api/admin/users/[userId]` - Update user (⚠️ Rate Limited: 20/min)

### Rate Limit Response Headers

All API responses include rate limit information:

```
X-RateLimit-Limit: 10           // Maximum requests per window
X-RateLimit-Remaining: 7        // Requests remaining
X-RateLimit-Reset: 2025-11-08T... // When the limit resets
Retry-After: 45                 // Seconds to wait (429 only)
```

### Authentication APIs

All authentication is handled through Supabase Auth, with additional endpoints for:

- **POST** `/api/auth/callback` - Handle auth callbacks
- **GET** `/api/auth/session` - Get current session info

## Development

### Key Components

- **MockupCanvas**: Core canvas component with rendering pipeline
- **UnifiedMobileSidebar**: Unified mobile/tablet interface with expandable sections and touch-optimized controls
- **LeftSidebar**: Desktop control panel with state management
- **DeviceFrame**: Hardware-accelerated device rendering with multiple style variants
- **TextOverlay**: Typography controls with real-time preview
- **ExportButton**: Multi-format export functionality

### State Management

- **AppState**: Centralized state with TypeScript interfaces
- **History System**: Undo/redo with command pattern implementation
- **Theme Provider**: SSR-safe theme management with next-themes

## Contributing

We welcome contributions! Please follow our development guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Implement** with TypeScript strict mode and comprehensive tests
4. **Commit** with conventional commits: `git commit -m 'feat: add amazing feature'`
5. **Push** to your branch: `git push origin feature/amazing-feature`
6. **Open** a Pull Request with detailed description

## License

This project is proprietary and confidential. All rights reserved.

## Acknowledgments

- **Next.js**: React framework with App Router and Server Components
- **shadcn/ui**: High-quality UI components built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework with design system
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide**: Beautiful, consistent icon library
- **Vercel**: Platform for frontend deployment and analytics

---

Built with ❤️ by David Ros Ferrer [Visit my website](https://davidros.vercel.app)
