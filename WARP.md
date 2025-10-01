# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Mevi Living is a luxury e-commerce website for artisanal home decor and serveware, built with Next.js 15, React 19, and modern web technologies. The application features a sophisticated design system with advanced animations and interactive components.

## Development Commands

### Essential Commands
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Database Commands
```bash
# Generate database schema migrations
npm run db:generate

# Run database migrations
npm run db:migrate

# Open database studio
npm run db:studio
```

## Architecture Overview

### Core Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Frontend**: React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 with custom animations
- **Database**: SQLite with Drizzle ORM and LibSQL
- **Authentication**: Better Auth with email/password and OAuth (Google, GitHub)
- **UI Components**: Radix UI primitives with custom styling
- **Animations**: Framer Motion, React Three Fiber, and specialized animation libraries

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/            # Authentication routes (login, register, etc.)
│   ├── collections/       # Product collection pages
│   ├── products/          # Individual product pages
│   ├── policies/          # Legal and policy pages
│   └── pages/             # Static pages (about-us)
├── components/
│   ├── sections/          # Major page sections (hero, footer, etc.)
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── visual-edits/          # Visual editing components

src/
├── lib/                   # Backend logic and utilities
│   ├── auth.ts           # Better Auth configuration
│   ├── auth-client.ts    # Client-side auth utilities
│   ├── db.ts             # Database connection
│   ├── schema.ts         # Drizzle database schema
│   └── utils.ts          # General utility functions
```

### Database Schema
The application uses SQLite with the following main entities:
- **Users**: Basic user information with email verification
- **Sessions**: User sessions with IP and user agent tracking
- **Accounts**: OAuth provider accounts linked to users
- **Verification**: Email verification tokens

### Authentication System
- Built with Better Auth library
- Supports email/password and OAuth (Google, GitHub)
- Session-based authentication with 7-day expiry
- Database adapter using Drizzle ORM

### Key Features
- **E-commerce**: Product catalog with collections and individual product pages
- **Visual Editing**: Custom component tagging system for visual editing
- **Advanced UI**: Heavy use of Radix UI components with custom styling
- **3D Graphics**: React Three Fiber integration for interactive elements
- **Animations**: Extensive use of Framer Motion and particle systems
- **Responsive Design**: Mobile-first design with advanced responsive components

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Set required environment variables:
   - `DATABASE_URL`: SQLite database path
   - `BETTER_AUTH_SECRET`: Secret key for authentication
   - OAuth credentials (optional): Google and GitHub client IDs/secrets

## Database Development

### Initial Setup
```bash
# Run initial migration
npm run db:migrate

# Open database studio for inspection
npm run db:studio
```

### Schema Changes
1. Modify `lib/schema.ts`
2. Generate migration: `npm run db:generate`
3. Apply migration: `npm run db:migrate`

## Testing Individual Components

Since this is a component-heavy application with many UI sections, you can test individual components by:
1. Navigating to specific routes (e.g., `/collections`, `/products/[slug]`)
2. Using the database studio to inspect data
3. Testing authentication flows at `/login` and `/register`

## Performance Considerations

- Uses Next.js 15 with Turbopack for fast development
- Heavy use of client-side animations may require performance monitoring
- SQLite database is suitable for development but consider LibSQL for production
- Image optimization configured for remote patterns

## Visual Editing System

The application includes a custom visual editing system with:
- Component tagging loader for development
- Visual edits messenger for real-time updates
- Error reporting system for debugging