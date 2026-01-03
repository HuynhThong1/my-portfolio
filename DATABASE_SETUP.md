# Database Setup Guide

## Quick Start (Automated)

Run this single command to set up everything:

```bash
./setup-db.sh
```

This script will:
1. Start the PostgreSQL database in Docker
2. Run database migrations
3. Seed the database with initial data

## Manual Setup

### Step 1: Start the Database

```bash
# Start PostgreSQL using Docker
docker compose up db -d

# Verify it's running
docker compose ps
```

### Step 2: Run Migrations

```bash
# Create the database schema
pnpm prisma migrate dev --name init
```

### Step 3: Seed the Database

```bash
# Add initial data (admin user, sample projects, etc.)
pnpm prisma db seed
```

## Database Connection Details

- **Host**: localhost
- **Port**: 5432
- **Database**: portfolio
- **Username**: postgres
- **Password**: postgres
- **Connection String**: `postgresql://postgres:postgres@localhost:5432/portfolio`

## Default Admin Credentials

After seeding, you can login to the admin panel at `/admin/login` with:

- **Email**: admin@example.com
- **Password**: admin123

⚠️ **Important**: Change these credentials in production!

## Useful Commands

```bash
# View database logs
docker compose logs db -f

# Stop the database
docker compose down

# Reset the database (⚠️ deletes all data)
docker compose down -v
pnpm prisma migrate reset

# Open Prisma Studio (database GUI)
pnpm prisma studio

# Generate Prisma Client (after schema changes)
pnpm prisma generate
```

## Troubleshooting

### Database won't start
```bash
# Check if port 5432 is already in use
lsof -i :5432

# Stop any existing PostgreSQL services
brew services stop postgresql  # if using Homebrew
```

### Connection refused
```bash
# Make sure DATABASE_URL in .env matches:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio?schema=public"
```

### Migration errors
```bash
# Reset and start fresh
pnpm prisma migrate reset
pnpm prisma db seed
```

## Development Workflow

1. Start database: `docker compose up db -d`
2. Run migrations: `pnpm prisma migrate dev`
3. Start dev server: `pnpm dev`
4. View database: `pnpm prisma studio` (optional)

## Production Deployment

For production, update your `.env` file with a secure database URL:

```env
DATABASE_URL="postgresql://user:password@your-db-host:5432/portfolio"
NEXTAUTH_SECRET="generate-a-secure-secret-here"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```
