# Analytics Guide

This portfolio includes comprehensive analytics tracking to monitor visitor behavior and website performance.

## What's Tracked

### Automatic Tracking (Vercel Analytics)
- ✅ Page views (all routes automatically tracked)
- ✅ Unique visitors
- ✅ Geographic data (country, city)
- ✅ Device type (desktop, mobile, tablet)
- ✅ Referrer sources
- ✅ Browser and OS information

### Custom Event Tracking
The following user actions are tracked:

**Portfolio Interactions:**
- Project views (when a project is clicked)
- Project link clicks (demo, GitHub, other)
- Filter usage (by category, tag)

**Contact Actions:**
- Contact form submissions (success/failure)
- Email link clicks
- Phone link clicks
- Social media link clicks (GitHub, LinkedIn, etc.)
- Resume downloads

**General Actions:**
- Search queries
- Theme toggles (light/dark)
- Admin login attempts

## Setup

### 1. Already Configured

The analytics are already set up in your project:
- ✅ `@vercel/analytics` installed
- ✅ `@vercel/speed-insights` installed
- ✅ Analytics components added to root layout
- ✅ Custom tracking utilities created

### 2. Enable in Vercel Dashboard

1. Deploy your project to Vercel
2. Go to your project in Vercel Dashboard
3. Click on the "Analytics" tab
4. Analytics will automatically start tracking (no configuration needed)

**Free Tier Includes:**
- 2,500 events per day
- 30 days of data retention
- Real-time analytics
- Custom event tracking

## Viewing Analytics

### Vercel Dashboard

1. Visit https://vercel.com/dashboard
2. Select your project
3. Click "Analytics" tab

You'll see:
- **Visitors**: Unique and total visitors
- **Page Views**: Most visited pages
- **Top Pages**: Your most popular content
- **Referrers**: Where visitors come from
- **Devices**: Desktop vs mobile breakdown
- **Countries**: Geographic distribution
- **Custom Events**: Your tracked actions

### Real-time Monitoring

The Analytics tab shows real-time data, updating as visitors interact with your site.

## Using Analytics in Your Code

### Import the Analytics Utility

```typescript
import { analytics } from '@/lib/analytics';
```

### Track Project Clicks

```tsx
'use client';

import { analytics } from '@/lib/analytics';

export function ProjectCard({ project }) {
  return (
    <div
      onClick={() => analytics.projectViewed(project.slug, project.title)}
      className="cursor-pointer"
    >
      <h3>{project.title}</h3>
      <a
        href={project.demoUrl}
        onClick={(e) => {
          e.stopPropagation();
          analytics.projectLinkClicked(project.slug, 'demo');
        }}
      >
        View Demo
      </a>
    </div>
  );
}
```

### Track Contact Form

```tsx
'use client';

import { analytics } from '@/lib/analytics';

export function ContactForm() {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: new FormData(e.target),
      });

      analytics.contactFormSubmitted(response.ok);

      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      analytics.contactFormSubmitted(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Track Social Links

```tsx
'use client';

import { analytics } from '@/lib/analytics';

export function SocialLinks() {
  return (
    <div>
      <a
        href="https://github.com/yourusername"
        onClick={() => analytics.socialLinkClicked('github')}
      >
        GitHub
      </a>
      <a
        href="https://linkedin.com/in/yourusername"
        onClick={() => analytics.socialLinkClicked('linkedin')}
      >
        LinkedIn
      </a>
    </div>
  );
}
```

### Track Resume Download

```tsx
'use client';

import { analytics } from '@/lib/analytics';

export function ResumeButton() {
  return (
    <a
      href="/resume.pdf"
      download
      onClick={() => analytics.resumeDownloaded()}
    >
      Download Resume
    </a>
  );
}
```

### Custom Event Tracking

For events not covered by the pre-defined functions:

```typescript
import { trackEvent } from '@/lib/analytics';

// Track custom events
trackEvent('Newsletter Signup', {
  source: 'footer',
  success: true,
});

trackEvent('Video Played', {
  videoId: 'intro-video',
  duration: 120,
});
```

## Admin Dashboard

The analytics card is available in the admin dashboard to remind you where to view analytics.

To add it to your admin dashboard:

```tsx
import { AnalyticsCard } from '@/components/analytics/analytics-card';

export default function AdminDashboard() {
  return (
    <div>
      <AnalyticsCard />
      {/* Other dashboard components */}
    </div>
  );
}
```

## Speed Insights

Speed Insights tracks your website's performance:

- **First Contentful Paint (FCP)**
- **Largest Contentful Paint (LCP)**
- **First Input Delay (FID)**
- **Cumulative Layout Shift (CLS)**
- **Time to First Byte (TTFB)**

View in Vercel Dashboard → Speed Insights tab

## Privacy & GDPR

Vercel Analytics is privacy-friendly:

- ✅ No cookies used
- ✅ No personal data collected
- ✅ GDPR compliant
- ✅ No IP addresses stored
- ✅ Anonymous visitor tracking

You don't need a cookie banner for Vercel Analytics!

## Development vs Production

### Development Mode
- Analytics are logged to browser console
- No data sent to Vercel
- Easy debugging with console logs

### Production Mode
- Data sent to Vercel Analytics
- Real-time tracking
- View in Vercel Dashboard

## Analytics Free Tier Limits

Vercel Analytics Free Tier:
- **Events**: 2,500 per day
- **Retention**: 30 days
- **Custom Events**: ✅ Included
- **Speed Insights**: ✅ Included

If you exceed limits, Vercel will notify you and you can upgrade to Pro tier.

## Best Practices

### 1. Track Meaningful Actions
```typescript
// ✅ Good - tracks meaningful user action
analytics.projectViewed(slug, title);

// ❌ Avoid - too granular, uses up event quota
trackEvent('Mouse Moved', { x: 100, y: 200 });
```

### 2. Include Context
```typescript
// ✅ Good - includes useful context
analytics.projectLinkClicked(slug, 'demo');

// ❌ Less useful - missing context
trackEvent('Click');
```

### 3. Track Business Goals
Focus on events that help you understand:
- Which projects get the most attention
- How visitors engage with your portfolio
- Where visitors come from
- Which content drives contact form submissions

### 4. Don't Over-Track
- Track user intent, not every click
- Respect the free tier limits
- Focus on actionable insights

## Troubleshooting

### Analytics Not Showing Up

1. **Verify deployment**: Analytics only work in production (deployed on Vercel)
2. **Check environment**: Run `console.log(process.env.NODE_ENV)` to verify
3. **Wait a few minutes**: Data can take 1-2 minutes to appear
4. **Verify Analytics tab**: Make sure you're in the right project

### Events Not Tracking

1. **Check browser console**: Look for analytics logs in development
2. **Verify imports**: Ensure you're importing from `@/lib/analytics`
3. **Client components**: Analytics must be called from 'use client' components
4. **Network tab**: Check if requests are being sent to Vercel

### Console Logs in Production

If you see analytics logs in production:
- Check that `NODE_ENV` is set to "production"
- Rebuild and redeploy your application

## Resources

- **Vercel Analytics Docs**: https://vercel.com/docs/analytics
- **Speed Insights Docs**: https://vercel.com/docs/speed-insights
- **Web Vitals**: https://web.dev/vitals/

## Example Integration Checklist

- [ ] Analytics added to root layout
- [ ] Project click tracking implemented
- [ ] Contact form tracking added
- [ ] Social link tracking added
- [ ] Resume download tracking added
- [ ] Deployed to Vercel
- [ ] Verified events in Vercel Dashboard

---

Your portfolio now has comprehensive analytics! Monitor your visitors and optimize your content based on real data. 📊
