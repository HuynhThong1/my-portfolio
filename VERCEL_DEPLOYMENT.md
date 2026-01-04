# Vercel Deployment Guide (Free Plan Optimized)

This guide will help you deploy your portfolio to Vercel with a free PostgreSQL database.

## Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account (sign up at https://vercel.com)
- Your project pushed to a Git repository

## Step 1: Set Up Vercel Postgres (Free Tier)

1. Go to https://vercel.com/dashboard
2. Click on "Storage" tab
3. Click "Create Database"
4. Select "Postgres" (powered by Neon)
5. Choose your database name (e.g., `portfolio-db`)
6. Select region closest to you
7. Click "Create"

Vercel will automatically create these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` (use this for DATABASE_URL)
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

## Step 2: Connect Your Git Repository

1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect Next.js framework

## Step 3: Configure Environment Variables

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

### Required Variables

```env
# Database (automatically added when you connect Vercel Postgres)
DATABASE_URL=${POSTGRES_PRISMA_URL}

# NextAuth (required for authentication)
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters

# Node Environment
NODE_ENV=production
```

### Generate NEXTAUTH_SECRET

Run this command locally to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Optional OAuth Providers (if using)

```env
# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# Google OAuth
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret
```

## Step 4: Configure Build Settings

In Vercel Dashboard → Settings → General:

- **Framework Preset**: Next.js
- **Build Command**: `pnpm run vercel-build` (or leave default)
- **Output Directory**: `.next` (default)
- **Install Command**: `pnpm install` (default)
- **Node.js Version**: 20.x

## Step 5: Link Database to Project

1. In Vercel Dashboard → Storage tab
2. Click your Postgres database
3. Go to "Connect Project" tab
4. Select your portfolio project
5. Click "Connect"

This automatically adds database environment variables to your project.

## Step 6: Deploy

1. Click "Deploy" button in Vercel
2. Wait for build to complete
3. Vercel will run:
   - `pnpm install`
   - `prisma generate`
   - `prisma migrate deploy`
   - `next build`

## Step 7: Verify Deployment

1. Visit your deployed URL (e.g., `https://my-portfolio-xxx.vercel.app`)
2. Check if database is connected (try logging in)
3. Monitor build logs for any errors

## Step 8: Enable Analytics (Free)

Your portfolio already includes Vercel Analytics and Speed Insights!

1. Go to Vercel Dashboard → Your Project
2. Click "Analytics" tab
3. Analytics automatically start tracking (no setup needed)

**What's Tracked:**
- ✅ Page views (automatic)
- ✅ Unique visitors
- ✅ Custom events (project clicks, form submissions, etc.)
- ✅ Performance metrics (Speed Insights)
- ✅ Geographic data
- ✅ Device types

**Free Tier:**
- 2,500 events/day
- 30 days retention
- Real-time analytics
- No cookies (GDPR compliant)

For detailed analytics usage, see [ANALYTICS.md](./ANALYTICS.md)

## Free Plan Limits & Optimizations

### Vercel Free Tier Limits:
- ✅ 100 GB bandwidth/month
- ✅ 6,000 build minutes/month
- ✅ Serverless function execution: 100 GB-hours
- ✅ 10 second max function duration
- ✅ 1000 image optimizations/month
- ✅ Unlimited websites

### Neon (Vercel Postgres) Free Tier:
- ✅ 0.5 GB storage
- ✅ Unlimited queries
- ✅ Automatic scaling to zero
- ❌ Database pauses after 5 minutes of inactivity (resumes automatically)

### Optimizations Applied:

1. **Build Optimization** (.vercelignore)
   - Excludes tests, Docker files, and unnecessary files
   - Reduces build time and deployment size

2. **Next.js Config** (next.config.ts)
   - `swcMinify: true` - faster builds
   - `compress: true` - smaller responses
   - Removed `standalone` output (not needed for Vercel)

3. **Function Duration**
   - Set to 10 seconds max (free plan limit)
   - Configured in vercel.json

4. **Image Optimization**
   - Uses Vercel's built-in image optimization
   - Automatically cached and served from CDN

## Monitoring & Debugging

### Check Build Logs:
1. Go to Vercel Dashboard → Deployments
2. Click on your deployment
3. View build logs

### Check Function Logs:
1. Vercel Dashboard → Your Project → Logs
2. Monitor real-time function executions

### Common Issues:

**Database Connection Errors:**
```bash
# Verify DATABASE_URL is set correctly
# Should be: ${POSTGRES_PRISMA_URL}
```

**Prisma Migration Errors:**
```bash
# Run migrations locally first:
pnpm prisma migrate deploy
```

**Build Timeouts:**
- Check build logs
- Ensure dependencies are optimized
- Remove unused packages

## Continuous Deployment

Vercel automatically deploys when you push to:
- **main/master branch** → Production
- **Other branches** → Preview deployments

Every commit gets a unique preview URL!

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## Rollback Deployments

1. Go to Deployments tab
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

## Local Development vs Production

### Local (Docker):
```bash
docker-compose up
# Uses local PostgreSQL
```

### Production (Vercel):
- Serverless functions
- Vercel Postgres (Neon)
- Global CDN

## Environment Variable Checklist

- [ ] `DATABASE_URL` - Connected via Vercel Postgres
- [ ] `NEXTAUTH_URL` - Set to production URL
- [ ] `NEXTAUTH_SECRET` - Generated secure key
- [ ] Optional OAuth credentials (if using)

## Features Included

Your deployment includes:
- ✅ **Vercel Analytics** - Track visitors and behavior
- ✅ **Speed Insights** - Monitor performance metrics
- ✅ **Custom Events** - Track project clicks, form submissions
- ✅ **Database** - PostgreSQL with Prisma
- ✅ **Authentication** - NextAuth.js with role-based access
- ✅ **Auto SSL** - HTTPS enabled by default
- ✅ **CDN** - Global edge network
- ✅ **Preview Deployments** - Every branch gets a URL

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Prisma Docs**: https://www.prisma.io/docs

## Cost Breakdown (Free Plan)

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| Vercel Hosting | Hobby (Free) | $0/month | 100GB bandwidth, unlimited sites |
| Vercel Postgres | Free Tier | $0/month | 0.5GB storage, auto-pause |
| **Total** | | **$0/month** | Perfect for portfolio |

Your portfolio is now deployed! 🎉
