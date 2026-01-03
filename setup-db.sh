#!/bin/bash

echo "🗄️  Setting up the database..."

# Check if database is running
if ! docker compose ps db | grep -q "Up"; then
  echo "Starting PostgreSQL database..."
  docker compose up db -d
  echo "Waiting for database to be ready..."
  sleep 5
fi

# Update .env with correct database URL
if [ -f .env ]; then
  echo "Updating .env file..."
  sed -i.bak 's|DATABASE_URL=.*|DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio?schema=public"|' .env
else
  echo "Creating .env file..."
  cp .env.example .env
  sed -i '' 's|DATABASE_URL=.*|DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio?schema=public"|' .env
fi

echo "Running database migrations..."
pnpm prisma migrate dev --name init

echo "Seeding database with initial data..."
pnpm prisma db seed

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Database connection details:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: portfolio"
echo "  Username: postgres"
echo "  Password: postgres"
echo ""
echo "Default admin login:"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
echo "You can now run: pnpm dev"
