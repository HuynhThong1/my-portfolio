# Professional Portfolio Builder

A modern, database-driven portfolio builder built with Next.js 16, featuring authentication, full customization capabilities, and Docker deployment.

## Features

✅ **Completed:**
- Next.js 16 with App Router and Server Components
- TypeScript for type safety
- Tailwind CSS v4 + shadcn/ui components
- PostgreSQL database with Prisma ORM
- NextAuth.js v5 authentication with role-based access control
- Database-backed content management
- Reusable block components (Hero, About, Skills, Projects, Experience, Contact)
- SEO optimization utilities
- Docker deployment configuration
- Database seeding with sample data
- Framer Motion animations

🚧 **To-Do:**
- Drag-and-drop admin builder interface
- Full admin panel with CRUD operations
- Additional portfolio pages
- Image upload functionality
- Contact form API endpoint

## Prerequisites

- Node.js 20+ with pnpm
- PostgreSQL 16+
- Docker & Docker Compose (optional)

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Update `.env` with your database credentials.

### 3. Set Up Database

```bash
# Run migrations
pnpm prisma migrate dev --name init

# Seed database with sample data
pnpm prisma db seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit:
- Portfolio: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Default Admin Login:**
- Email: admin@example.com
- Password: admin123

## Docker Deployment

```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f portfolio
```

## Tech Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth.js v5
- **UI:** Tailwind CSS v4 + shadcn/ui
- **Animations:** Framer Motion
- **Package Manager:** pnpm

## Development

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # Lint code
```

## Database Commands

```bash
pnpm prisma migrate dev      # Create migration
pnpm prisma generate         # Generate Prisma client
pnpm prisma db seed          # Seed database
pnpm prisma studio           # Open Prisma Studio
```

## License

MIT
