/**
 * Analytics utility for tracking custom events and page views
 * Works with Vercel Analytics for production and logs to console in development
 */

import { track } from '@vercel/analytics';

type EventProperties = {
  [key: string]: string | number | boolean | null;
};

/**
 * Track custom events
 * @param eventName - Name of the event to track
 * @param properties - Additional properties to track with the event
 */
export function trackEvent(eventName: string, properties?: EventProperties) {
  if (process.env.NODE_ENV === 'production') {
    track(eventName, properties);
  } else {
    console.log('📊 Analytics Event:', eventName, properties);
  }
}

/**
 * Pre-defined event tracking functions for common actions
 */
export const analytics = {
  // Portfolio Events
  projectViewed: (projectSlug: string, projectTitle: string) => {
    trackEvent('Project Viewed', {
      slug: projectSlug,
      title: projectTitle,
    });
  },

  projectLinkClicked: (projectSlug: string, linkType: 'demo' | 'github' | 'other') => {
    trackEvent('Project Link Clicked', {
      slug: projectSlug,
      linkType,
    });
  },

  // Contact Events
  contactFormSubmitted: (success: boolean) => {
    trackEvent('Contact Form Submitted', {
      success,
    });
  },

  emailClicked: () => {
    trackEvent('Email Clicked');
  },

  phoneClicked: () => {
    trackEvent('Phone Clicked');
  },

  // Social Events
  socialLinkClicked: (platform: string) => {
    trackEvent('Social Link Clicked', {
      platform,
    });
  },

  resumeDownloaded: () => {
    trackEvent('Resume Downloaded');
  },

  // Admin Events
  adminLogin: (success: boolean) => {
    trackEvent('Admin Login', {
      success,
    });
  },

  contentUpdated: (contentType: string) => {
    trackEvent('Content Updated', {
      contentType,
    });
  },

  // General Events
  searchPerformed: (query: string, resultsCount: number) => {
    trackEvent('Search Performed', {
      query,
      resultsCount,
    });
  },

  filterApplied: (filterType: string, filterValue: string) => {
    trackEvent('Filter Applied', {
      filterType,
      filterValue,
    });
  },

  themeToggled: (theme: 'light' | 'dark') => {
    trackEvent('Theme Toggled', {
      theme,
    });
  },
};

/**
 * Track page views (Next.js handles this automatically with Vercel Analytics)
 * This is here for custom page view tracking if needed
 */
export function trackPageView(url: string, title?: string) {
  if (process.env.NODE_ENV === 'production') {
    // Vercel Analytics tracks page views automatically
    // Only use this for custom tracking scenarios
    track('Page View', {
      url,
      title: title || document.title,
    });
  } else {
    console.log('📊 Page View:', url, title);
  }
}
