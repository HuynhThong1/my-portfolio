# Portfolio Setup Guide

## What Has Been Built

Your professional portfolio foundation is ready! Here's what's been implemented:

### ✅ Core Infrastructure
1. **Next.js 16 Application** with App Router and TypeScript
2. **Database Schema** (Prisma + PostgreSQL) with all necessary models
3. **Authentication System** (NextAuth.js v5) with role-based access
4. **Styling System** (Tailwind CSS v4 + shadcn/ui components)
5. **Docker Configuration** for easy deployment

### ✅ Key Components
1. **Block Components:**
   - HeroBlock - Landing page hero section
   - AboutBlock - About me section
   - SkillsBlock - Technical skills with proficiency bars
   - ProjectsBlock - Project cards with tags and links
   - ExperienceBlock - Timeline of work experience
   - ContactBlock - Contact form

2. **Library Utilities:**
   - Prisma client setup
   - Config loader (database-backed)
   - SEO utilities
   - NextAuth configuration

3. **Database Models:**
   - User (authentication)
   - Profile (portfolio owner info)
   - Project (portfolio projects)
   - Experience (work history)
   - Education (academic history)
   - Skill (technical skills)
   - PageLayout (dynamic page configs)
   - SiteConfig (site settings)
   - AuditLog (change tracking)

### 🚧 What Still Needs to Be Built

#### 1. Admin Panel (Priority: High)
- Dashboard page (`src/app/admin/page.tsx`)
- Admin layout with sidebar and header
- CRUD interfaces for:
  - Projects management
  - Experience management
  - Skills management
  - Profile settings

#### 2. API Routes (Priority: High)
Create these API endpoints:
- `src/app/api/admin/projects/route.ts` - List/Create projects
- `src/app/api/admin/projects/[id]/route.ts` - Get/Update/Delete project
- `src/app/api/admin/experience/route.ts` - Experience CRUD
- `src/app/api/admin/layouts/route.ts` - Page layout management
- `src/app/api/config/route.ts` - Get/Update site config
- `src/app/api/contact/route.ts` - Handle contact form submissions

#### 3. Drag-and-Drop Builder (Priority: Medium)
- Canvas component for visual editing
- BlockWrapper for draggable sections
- PropertyEditor for editing block properties
- Sidebar with available blocks
- Real-time preview

#### 4. Additional Pages (Priority: Medium)
- `/projects` - Projects listing page
- `/projects/[slug]` - Individual project page
- `/about` - About page
- `/experience` - Resume/Experience page
- `/contact` - Contact page

#### 5. Admin Components (Priority: Medium)
- AdminSidebar - Navigation sidebar
- AdminHeader - Top header with user menu
- Data tables for content management
- Form components for editing

## Getting Started

### Step 1: Set Up PostgreSQL

Make sure you have PostgreSQL running. You can use Docker:

```bash
docker run --name portfolio-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=portfolio \
  -p 5432:5432 \
  -d postgres:16-alpine
```

Or install PostgreSQL locally on your system.

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Generate Prisma Client

```bash
pnpm prisma generate
```

### Step 4: Run Database Migrations

```bash
pnpm prisma migrate dev --name init
```

This will create all the necessary database tables.

### Step 5: Seed the Database

```bash
pnpm prisma db seed
```

This will create:
- Admin user (admin@example.com / admin123)
- Sample profile
- Sample projects
- Sample skills
- Sample experience
- Default page layouts

### Step 6: Run the Development Server

```bash
pnpm dev
```

Visit:
- **Portfolio:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin/login

## Next Steps for Development

### 1. Test the Current Setup

1. Visit http://localhost:3000 - You should see the homepage with the Hero section
2. Visit http://localhost:3000/admin/login
3. Log in with:
   - Email: admin@example.com
   - Password: admin123
4. You'll be redirected to /admin (which doesn't exist yet)

### 2. Build the Admin Dashboard

Start by creating `src/app/admin/page.tsx`:

```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {session.user.name}!</h1>
      <p>Admin dashboard coming soon...</p>
    </div>
  );
}
```

### 3. Create API Routes

Follow the examples in the `portfolio-auth-database-addon.md` file to create:
- Projects CRUD API
- Experience CRUD API
- Config management API

### 4. Build Admin UI Components

Create reusable components for:
- Data tables
- Forms
- Navigation
- Settings panels

## Folder Structure

```
src/
├── app/
│   ├── (portfolio)/      # Public pages ✅
│   │   ├── page.tsx      # Home ✅
│   │   ├── about/        # To build
│   │   ├── projects/     # To build
│   │   ├── experience/   # To build
│   │   └── contact/      # To build
│   ├── admin/            # Admin panel 🚧
│   │   ├── page.tsx      # Dashboard (to build)
│   │   ├── login/        # Login ✅
│   │   ├── projects/     # Projects CRUD (to build)
│   │   └── settings/     # Settings (to build)
│   └── api/              # API routes 🚧
│       ├── auth/         # NextAuth ✅
│       ├── config/       # Config API (to build)
│       └── admin/        # Admin APIs (to build)
├── components/
│   ├── ui/               # shadcn ✅
│   ├── blocks/           # Content blocks ✅
│   ├── builder/          # Builder UI (to build)
│   ├── common/           # Common components (to build)
│   └── admin/            # Admin components (to build)
├── lib/                  # Utilities ✅
├── types/                # TypeScript types ✅
└── middleware.ts         # Auth middleware ✅
```

## Environment Variables

Your `.env` file should contain:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-change-in-production"
```

For production, generate a secure secret:
```bash
openssl rand -base64 32
```

## Deployment

### Docker Deployment

```bash
# Using Docker Compose
docker-compose up -d

# Or build manually
docker build -t my-portfolio .
docker run -p 3000:3000 my-portfolio
```

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d portfolio

# Check Prisma schema
pnpm prisma validate

# Reset database (WARNING: Deletes all data)
pnpm prisma migrate reset
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
pnpm prisma generate

# Rebuild
pnpm build
```

### Authentication Issues

Make sure `NEXTAUTH_SECRET` is set in your `.env` file. Generate a new one:

```bash
openssl rand -base64 32
```

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth.js Docs:** https://authjs.dev
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com/docs

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify database connection
3. Ensure all environment variables are set
4. Check the Prisma schema matches your database

## What's Working Now

✅ Authentication (login/logout)
✅ Database models and relationships
✅ Homepage with hero section
✅ Block component system
✅ Docker deployment
✅ Database seeding

## What to Build Next

Priority Order:
1. Admin dashboard page
2. Projects CRUD API
3. Projects management UI
4. Other CRUD APIs (Experience, Skills)
5. Additional portfolio pages
6. Drag-and-drop builder
7. Image upload
8. Contact form handler

Happy coding! 🚀
