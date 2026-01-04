'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * PageViewTracker component
 * Automatically tracks page views when route changes
 * Note: Vercel Analytics already tracks page views automatically,
 * but this component can be used for additional custom tracking
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Log page views in development
    if (process.env.NODE_ENV === 'development') {
      const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
      console.log('📊 Page View:', url);
    }

    // Vercel Analytics automatically tracks page views in production
    // No additional tracking needed unless you want custom behavior
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
