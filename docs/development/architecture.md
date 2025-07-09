---
outline: deep
---

# Technical Architecture

This document introduces Knowlink's core technical architecture.

## Main Technology Stack

### Frontend

- **Next.js 15** - React full-stack framework
- **React 19** - User interface library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - CSS framework
- **Zustand** - State management
- **Radix UI** - UI component library

### Backend

- **Bun** - High-performance JavaScript runtime
- **Prisma ORM** - Database ORM
- **SQLite** - Default database
- **Next.js API Routes** - Server-side API

### AI Technology

- **Pollinations.ai** - Default AI provider
- **OpenAI** - GPT series models
- **Custom API** - OpenAI format compatible

### Deployment

- **Docker** - Containerized deployment
- **Docker Compose** - Multi-service orchestration

## Main Feature Modules

### Core Features

- **Note Management** - Create, edit, categorize notes
- **Bookmark Management** - Web bookmark collection
- **AI Assistant** - Intelligent dialogue and content generation
- **File Management** - File upload and storage
- **User System** - Account management and authentication

### Extended Features

- **Browser Extension** - Web content clipping
- **Calendar Integration** - Event management
- **Theme System** - Interface theme switching
- **Data Import/Export** - Data migration

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Main pages
│   │   ├── (pages)/       # Page components
│   │   ├── account/       # Account management
│   │   ├── note/          # Note editing
│   │   ├── settings/      # Settings pages
│   │   └── tools/         # Tool pages
│   ├── api/               # API routes
│   │   ├── ai/            # AI-related APIs
│   │   ├── upload/        # File upload
│   │   └── web-clipper/   # Web clipping
│   └── actions/           # Server-side actions
├── components/            # React components
│   ├── ui/               # Basic UI components
│   ├── advance/          # Advanced components
│   └── app/              # Application components
├── lib/                  # Utility libraries
│   ├── ai-agent/         # AI agent
│   ├── llm/              # LLM integration
│   ├── prisma.ts         # Database connection
│   └── utils/            # Utility functions
├── hooks/                # Custom Hooks
├── integrations/         # Third-party integrations
│   ├── file-storage/     # File storage
│   ├── i18n/             # Internationalization
│   └── markdown/         # Markdown editor
└── store/                # State management
```

## Development and Build Process

### Development Environment

1. **Environment Setup**

   ```bash
   # Install dependencies
   bun ci

   # Set environment variables
   cp .env.example .env.local
   ```

2. **Database Setup**

   ```bash
   # Generate Prisma client
   bun prisma:generate

   # Run database migrations
   bun prisma:push
   ```

3. **Start Development Server**
   ```bash
   bun dev
   ```

### Build Process

1. **Code Checking**

   ```bash
   # Type checking
   bun tsc

   # Code formatting
   bun lint

   # Code inspection
   bun lint:fix
   ```

2. **Build Application**

   ```bash
   # Production build
   bun build:default

   # Start production server
   bun start
   ```

### Deployment Process

1. **Docker Build**

   ```bash
   # Build image
   docker build -t knowlink .

   # Use Docker Compose
   docker-compose up -d
   ```

2. **Environment Configuration**

   - Set production environment variables
   - Configure database connection
   - Set AI API keys

3. **Data Migration**
   ```bash
   # Production environment database migration
   bun prisma:deploy
   ```
