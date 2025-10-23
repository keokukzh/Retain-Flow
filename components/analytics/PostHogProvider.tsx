'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

// PostHog types are handled by the library

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize PostHog if API key is available
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      // Load PostHog script
      const script = document.createElement('script');
      script.src = 'https://app.posthog.com/static/array.js';
      script.async = true;
      script.onload = () => {
        if (window.posthog) {
          window.posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
            loaded: (posthog: any) => {
              // Identify user if logged in
              if (user) {
                posthog.identify(user.id, {
                  email: user.email,
                  name: user.name,
                });
              }
            },
          });
        }
      };
      document.head.appendChild(script);

      return () => {
        // Cleanup
        if (window.posthog) {
          window.posthog.reset();
        }
      };
    }
  }, [user]);

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('$pageview');
    }
  }, []);

  return <>{children}</>;
}

export function trackEvent(event: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture(event, properties);
  }
}

export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.identify(userId, properties);
  }
}

export function resetUser() {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.reset();
  }
}
