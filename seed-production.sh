#!/bin/bash

# Script to seed production database
# Usage: ./seed-production.sh

echo "🌱 Seeding production database..."
echo ""
echo "⚠️  Make sure you've updated .env.production with your Vercel database URL!"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    # Load production environment variables
    export $(cat .env.production | grep -v '^#' | xargs)

    # Run migrations first
    echo "📦 Running migrations..."
    npx prisma migrate deploy

    # Then seed
    echo "🌱 Seeding database..."
    npx prisma db seed

    echo "✅ Done!"
else
    echo "❌ Cancelled"
    exit 1
fi
