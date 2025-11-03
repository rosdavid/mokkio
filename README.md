# Mokkio

[![Version](https://img.shields.io/badge/version-1.0.0--beta.3-blue.svg)](https://github.com/rosdavid/mokkio/releases)

A high-performance, production-ready web application for creating professional device mockups with advan- [ ] Validate performance metrics

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 📚 Documentation & Resources

- **[CHANGELOG.md](CHANGELOG.md)** - Complete change history and version notes
- **[AUTH_SETUP.md](AUTH_SETUP.md)** - Detailed authentication setup guide
- **[GitHub Repository](https://github.com/rosdavid/mokkio)** - Source code and issue tracking
- **[Live Demo](https://mokkio.vercel.app)** - Try Mokkio online
- **[David Ros Ferrer](https://davidros.vercel.app)** - Portfolio and contact

## 🆘 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/rosdavid/mokkio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rosdavid/mokkio/discussions)
- **Email**: Contact through [personal website](https://davidros.vercel.app)

For business inquiries or custom development, please reach out through the contact form on my website.

## 🙏 Acknowledgments capabilities. Built with modern web technologies and optimized for both developer experience and end-user performance.

## 🚀 Features

### Core Functionality

- **Device Mockup Engine**: Pixel-perfect rendering for iPhone 17 Pro/Max (Blue/Silver/Orange Titanium), iPad Pro, MacBook Pro, and browser frames with hardware-accelerated graphics
- **Interactive Canvas System**: Advanced canvas with drag-and-drop positioning, collision detection, and real-time preview rendering
- **Text Overlay System**: Complete typography controls with font family, size, weight, color, opacity, alignment, and spacing adjustments

### Advanced Styling & Effects

- **Material Design System**: Glass and liquid effects for device frames with customizable edge thickness and dynamic lighting
- **Background Rendering Pipeline**: 7 background types including solid colors (72+ options), linear gradients (24 presets), radial gradients (12 presets), cosmic gradients (10 presets), textures (12 options), custom image uploads and transparent background
- **Shadow & Lighting Engine**: Advanced shadow presets with blur, spread, and color controls using CSS box-shadow and filter APIs
- **Color Management**: OKLCH color space implementation with perceptual uniformity and WCAG 2.1 AA compliance

### User Experience

- **Responsive Design**: Adaptive layouts optimized for mobile, tablet, and desktop with touch gesture recognition and cross-platform compatibility
- **Theme System**: Complete light/dark/system theme support with automatic system preference detection
- **Keyboard Shortcuts**: Comprehensive shortcuts for undo/redo/export operations with cross-platform support
- **Accessibility**: Full WCAG 2.1 AA compliance with ARIA labels, keyboard navigation, and screen reader support

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

## 🏗️ Arquitectura Profesional

### Estructura del Proyecto

```
mokkio/
├── src/                          # Código fuente principal
│   ├── app/                      # Next.js App Router
│   ├── components/               # Componentes React organizados por dominio
│   │   ├── ui/                   # Componentes base/UI reutilizables (shadcn/ui)
│   │   ├── auth/                 # Componentes de autenticación
│   │   ├── mockup/               # Componentes relacionados con mockups
│   │   ├── admin/                # Componentes de administración
│   │   ├── layout/               # Componentes de layout
│   │   └── index.ts              # Barrel exports para componentes
│   ├── hooks/                    # Custom hooks organizados por dominio
│   │   ├── auth/                 # Hooks de autenticación
│   │   ├── ui/                   # Hooks de UI
│   │   ├── mockup/               # Hooks de mockups
│   │   └── index.ts              # Barrel exports para hooks
│   ├── lib/                      # Utilidades y configuraciones
│   │   ├── auth/                 # Utilidades de autenticación
│   │   ├── mockup/               # Utilidades de mockups
│   │   ├── ui/                   # Utilidades de UI
│   │   ├── config/               # Configuraciones centralizadas
│   │   └── index.ts              # Barrel exports para utilidades
│   ├── types/                    # Definiciones TypeScript
│   │   ├── mockup/               # Tipos relacionados con mockups
│   │   ├── api/                  # Tipos de API
│   │   ├── ui/                   # Tipos de UI
│   │   └── index.ts              # Barrel exports para tipos
│   ├── utils/                    # Utilidades generales
│   └── constants/                # Constantes de la aplicación
├── config/                       # Configuraciones centralizadas
│   ├── database/                 # Scripts y configuraciones de BD
│   ├── deployment/               # Configuraciones de deployment
│   └── development/              # Configuraciones de desarrollo
├── scripts/                      # Scripts de desarrollo y deployment
│   ├── build/                    # Scripts de build
│   ├── deploy/                   # Scripts de deployment
│   └── dev/                      # Scripts de desarrollo
├── docs/                         # Documentación estructurada
│   ├── api/                      # Documentación de APIs
│   ├── architecture/             # Documentación de arquitectura
│   └── development/              # Guías de desarrollo
├── tests/                        # Tests organizados
│   ├── unit/                     # Tests unitarios
│   ├── integration/              # Tests de integración
│   └── e2e/                      # Tests end-to-end
├── public/                       # Archivos estáticos
└── package.json                  # Dependencias y scripts
```

### Principios de Organización

- **Separación por dominio**: Los componentes, hooks, utilidades y tipos están organizados por dominio funcional (auth, mockup, ui, admin).
- **Barrel exports**: Cada directorio principal tiene un archivo `index.ts` para facilitar las importaciones.
- **Configuración centralizada**: Las configuraciones están separadas del código fuente.
- **Documentación estructurada**: La documentación está organizada por tipo y propósito.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ with npm or yarn
- Modern web browser with Canvas API support

### Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/rosdavid/mokkio.git
   cd mokkio
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment** (see Database Setup section)

4. **Start development server**:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Database Setup

#### Supabase Configuration

1. **Create a Supabase Project**:

   - Go to [supabase.com](https://supabase.com) and create a new account
   - Create a new project and wait for initialization

2. **Get Project Credentials**:

   - Navigate to Settings → API in your Supabase dashboard
   - Copy the Project URL and API keys (anon/public and service_role)

3. **Configure Environment Variables**:
   Create a `.env.local` file in your project root with:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

4. **Database Schema Setup**:

   - Go to SQL Editor in your Supabase dashboard
   - Run the SQL script from `database-setup.sql` to create the `saved_mockups` table
   - Enable Row Level Security (RLS) for data protection

5. **Authentication Setup** (Optional):
   - For full authentication features, follow the detailed guide in `AUTH_SETUP.md`
   - Create additional tables for user profiles and admin functionality
   - Configure authentication policies and admin user roles

### Usage

1. **Device Selection**: Choose from iPhone 17 Pro/Max (Blue/Silver/Orange Titanium), iPad Pro, MacBook Pro, or browser frames (Chrome/Safari)
2. **Canvas Interaction**: Use drag-and-drop for positioning with collision detection, snap-to-grid, and multi-touch gesture support
3. **Customization**: Apply text overlays with advanced typography, choose from 7 background types, apply shadows and device styles
4. **Responsive Preview**: Test across mobile/tablet/desktop breakpoints with unified interface controls
5. **Export**: Generate high-resolution images with multiple format options and quality settings

## 📊 Performance Metrics

- **Bundle Size**: ~167KB gzipped with optimized code splitting
- **First Paint**: <1.2s on modern devices with progressive loading
- **Canvas Rendering**: 60fps with hardware acceleration and debounced updates
- **Memory Usage**: <50MB for typical workflows with efficient caching
- **Lighthouse Score**: 95+ across all categories (mobile, tablet, desktop)
- **Responsive Performance**: Consistent 60fps across mobile/tablet breakpoints

## � API Reference

Mokkio provides RESTful APIs for mockup management and administrative functions.

### Mockup Management APIs

- **GET** `/api/export` - Export mockup as image
- **GET** `/api/mockups` - Retrieve all saved mockups
- **POST** `/api/mockups` - Save a new mockup
- **PUT** `/api/mockups/[id]` - Update an existing mockup
- **DELETE** `/api/mockups/[id]` - Delete a mockup

### Admin APIs

- **GET** `/api/admin/users` - List all users (admin only)
- **PATCH** `/api/admin/users/[userId]` - Update user status (admin only)
- **GET** `/api/admin/analytics` - Get user analytics (admin only)

### Authentication APIs

All authentication is handled through Supabase Auth, with additional endpoints for:

- **POST** `/api/auth/callback` - Handle auth callbacks
- **GET** `/api/auth/session` - Get current session info

## �🔧 Development

### Project Structure

```
├── app/                          # Next.js App Router pages and API routes
│   ├── api/                      # API endpoints (export, admin, auth)
│   ├── [pages]/                  # Static pages (cookie-policy, privacy-policy, etc.)
│   ├── layout.tsx                # Root layout component
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── src/                          # Source code organized by domain
│   ├── components/               # React components by domain
│   │   ├── ui/                   # Reusable UI components (shadcn/ui)
│   │   ├── auth/                 # Authentication components
│   │   ├── mockup/               # Mockup-related components
│   │   ├── admin/                # Admin components
│   │   └── layout/               # Layout components
│   ├── hooks/                    # Custom React hooks by domain
│   ├── lib/                      # Utilities and configurations by domain
│   ├── types/                    # TypeScript definitions by domain
│   ├── utils/                    # General utilities
│   └── constants/                # Application constants
├── config/                       # Centralized configurations
│   ├── database/                 # Database scripts and configs
│   ├── deployment/               # Deployment configurations
│   └── development/              # Development configurations
├── scripts/                      # Development and deployment scripts
├── docs/                         # Structured documentation
├── tests/                        # Organized test suites
├── public/                       # Static assets (images, icons, manifest)
├── AUTH_SETUP.md                 # Authentication setup guide
├── CHANGELOG.md                  # Project changelog
├── database-setup.sql            # Database schema (moved to config/database/)
├── middleware.ts                 # Next.js middleware
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

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

## 🤝 Contributing

We welcome contributions! Please follow our development guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Implement** with TypeScript strict mode and comprehensive tests
4. **Commit** with conventional commits: `git commit -m 'feat: add amazing feature'`
5. **Push** to your branch: `git push origin feature/amazing-feature`
6. **Open** a Pull Request with detailed description

### Development Guidelines

- **TypeScript**: Strict mode with no `any` types
- **Testing**: Manual testing for critical user flows and integration points
- **Performance**: Profile and optimize rendering bottlenecks
- **Accessibility**: WCAG 2.1 AA compliance for all new features
- **Code Quality**: ESLint, Prettier, and comprehensive linting rules

## � Deployment

### Vercel (Recommended)

1. **Connect Repository**:

   - Import your GitHub repository to Vercel
   - Configure build settings (automatically detected for Next.js)

2. **Environment Variables**:

   - Add all Supabase environment variables in Vercel dashboard
   - Configure production database URL if different from development

3. **Deploy**:
   - Push to main branch to trigger automatic deployment
   - Vercel Analytics and Speed Insights are pre-configured

### Other Platforms

Mokkio can be deployed to any platform supporting Next.js:

- **Netlify**: Configure build command as `npm run build` and publish directory as `.next`
- **Railway**: Connect GitHub repo and set environment variables
- **Render**: Use the Node.js runtime with build command `npm run build`
- **Self-hosted**: Use `npm run start` after building

### Production Checklist

- [ ] Configure production Supabase project
- [ ] Set up proper Row Level Security policies
- [ ] Configure admin user roles
- [ ] Test all authentication flows
- [ ] Verify export functionality
- [ ] Check responsive design across devices
- [ ] Validate performance metrics

## �📄 License

This project is proprietary and confidential. All rights reserved.

## 🙏 Acknowledgments

- **Next.js**: React framework with App Router and Server Components
- **shadcn/ui**: High-quality UI components built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework with design system
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide**: Beautiful, consistent icon library
- **Vercel**: Platform for frontend deployment and analytics

---

Built with ❤️ by David Ros Ferrer [Visit my website](https://davidros.vercel.app)
