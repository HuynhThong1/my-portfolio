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
- **Vercel Analytics & Speed Insights** (visitor tracking, custom events)
- Drag-and-drop page layout builder

🚧 **To-Do:**
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

## Deployment

### Docker Deployment

```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f portfolio
```

### Vercel Deployment (Free Plan)

For detailed Vercel deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

**Quick Deploy:**

1. Push your code to GitHub
2. Import project to Vercel
3. Add Vercel Postgres database
4. Set environment variables (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
5. Deploy!

**Free Plan Includes:**
- Unlimited websites
- 100GB bandwidth/month
- Free PostgreSQL database (0.5GB)
- Automatic HTTPS & CDN

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fmy-portfolio)

## Tech Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth.js v5
- **UI:** Tailwind CSS v4 + shadcn/ui
- **Animations:** Framer Motion
- **Analytics:** Vercel Analytics + Speed Insights
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

## Analytics

Track visitor behavior and website performance with built-in Vercel Analytics.

**Features:**
- Page view tracking (automatic)
- Custom event tracking (project clicks, form submissions, etc.)
- Speed Insights (performance metrics)
- Real-time visitor data
- No cookies (GDPR compliant)

See [ANALYTICS.md](./ANALYTICS.md) for detailed usage and integration examples.

## License

MIT
