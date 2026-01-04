/**
 * Analytics Integration Examples
 *
 * This file shows how to integrate analytics tracking into your components.
 * Copy and paste these examples into your actual components.
 */

import { analytics } from '@/lib/analytics';

/**
 * Example 1: Track project clicks
 * Use in your ProjectCard component
 */
export function ProjectCardExample() {
  const handleProjectClick = (slug: string, title: string) => {
    // Track when a project is viewed
    analytics.projectViewed(slug, title);
  };

  const handleLinkClick = (slug: string, linkType: 'demo' | 'github' | 'other') => {
    // Track when external links are clicked
    analytics.projectLinkClicked(slug, linkType);
  };

  return null; // Replace with your actual component
}

/**
 * Example 2: Track contact form submission
 * Use in your ContactForm component
 */
export function ContactFormExample() {
  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      // Track submission success/failure
      analytics.contactFormSubmitted(response.ok);
    } catch (error) {
      analytics.contactFormSubmitted(false);
    }
  };

  return null; // Replace with your actual component
}

/**
 * Example 3: Track social link clicks
 * Use in your SocialLinks component
 */
export function SocialLinksExample() {
  const handleSocialClick = (platform: string) => {
    analytics.socialLinkClicked(platform);
  };

  // Example usage:
  // <a onClick={() => handleSocialClick('github')} href="...">GitHub</a>

  return null; // Replace with your actual component
}

/**
 * Example 4: Track resume download
 * Use in your Header/Hero component
 */
export function ResumeDownloadExample() {
  const handleResumeClick = () => {
    analytics.resumeDownloaded();
  };

  // Example usage:
  // <a onClick={handleResumeClick} href="/resume.pdf" download>Download Resume</a>

  return null; // Replace with your actual component
}

/**
 * Example 5: Track email/phone clicks
 * Use in your Contact section
 */
export function ContactLinksExample() {
  // Example usage:
  // <a onClick={() => analytics.emailClicked()} href="mailto:...">Email</a>
  // <a onClick={() => analytics.phoneClicked()} href="tel:...">Phone</a>

  return null; // Replace with your actual component
}

/**
 * Example 6: Track theme toggle
 * Use in your ThemeToggle component
 */
export function ThemeToggleExample() {
  const handleThemeChange = (theme: 'light' | 'dark') => {
    analytics.themeToggled(theme);
    // Your theme switching logic here
  };

  return null; // Replace with your actual component
}

/**
 * Quick Integration Guide:
 *
 * 1. Import analytics:
 *    import { analytics } from '@/lib/analytics';
 *
 * 2. Call analytics functions on user actions:
 *    onClick={() => analytics.projectViewed(slug, title)}
 *
 * 3. View analytics data:
 *    - Go to Vercel Dashboard
 *    - Select your project
 *    - Click "Analytics" tab
 *
 * 4. Custom events:
 *    import { trackEvent } from '@/lib/analytics';
 *    trackEvent('Custom Event', { key: 'value' });
 */
