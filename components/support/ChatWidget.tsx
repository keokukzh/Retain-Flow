'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

// Chatwoot types are handled by the library

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  launcherTitle?: string;
  launcherMessage?: string;
  theme?: 'light' | 'dark';
}

export function ChatWidget({
  position = 'bottom-right',
  launcherTitle = 'Need Help?',
  launcherMessage = 'Chat with our support team',
  theme = 'light',
}: ChatWidgetProps) {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only load Chatwoot if website token is configured
    if (!process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN) {
      // Chatwoot website token not configured
      return;
    }

    // Load Chatwoot SDK
    const script = document.createElement('script');
    script.src = 'https://app.chatwoot.com/packs/js/sdk.js';
    script.async = true;
    script.onload = () => {
      if (window.chatwootSDK) {
        // Initialize Chatwoot
        window.chatwootSDK.run({
          websiteToken: process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN,
          baseUrl: 'https://app.chatwoot.com',
          position,
          launcherTitle,
          launcherMessage,
          theme,
        });

        // Set user context if logged in
        if (user) {
          window.chatwootSDK.setUser(user.id, {
            name: user.name || 'Unknown',
            email: user.email,
            avatar_url: undefined, // Add avatar URL if available
            identifier_hash: user.id,
          });

          // Set custom attributes
          window.chatwootSDK.setCustomAttributes({
            user_id: user.id,
            plan: 'free', // This would come from user subscription data
            signup_date: new Date().toISOString(), // Use current date as fallback
          });
        }

        setIsLoaded(true);
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (window.chatwootSDK) {
        window.chatwootSDK.hide();
      }
    };
  }, [user, position, launcherTitle, launcherMessage, theme]);

  // Don't render anything if not loaded or no token
  if (!isLoaded || !process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN) {
    return null;
  }

  return null; // Chatwoot renders its own UI
}

// Hook for programmatic control
export function useChatwoot() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkChatwoot = () => {
      if (window.chatwootSDK) {
        setIsReady(true);
      } else {
        setTimeout(checkChatwoot, 100);
      }
    };

    checkChatwoot();
  }, []);

  const show = () => {
    if (window.chatwootSDK) {
      window.chatwootSDK.show();
    }
  };

  const hide = () => {
    if (window.chatwootSDK) {
      window.chatwootSDK.hide();
    }
  };

  const toggle = () => {
    if (window.chatwootSDK) {
      window.chatwootSDK.toggle();
    }
  };

  const setUser = (userId: string, userData: {
    name?: string;
    email?: string;
    avatar_url?: string;
  }) => {
    if (window.chatwootSDK) {
      window.chatwootSDK.setUser(userId, userData);
    }
  };

  const setCustomAttributes = (attributes: Record<string, any>) => {
    if (window.chatwootSDK) {
      window.chatwootSDK.setCustomAttributes(attributes);
    }
  };

  const setLabel = (label: string) => {
    if (window.chatwootSDK) {
      window.chatwootSDK.setLabel(label);
    }
  };

  const setLocale = (locale: string) => {
    if (window.chatwootSDK) {
      window.chatwootSDK.setLocale(locale);
    }
  };

  return {
    isReady,
    show,
    hide,
    toggle,
    setUser,
    setCustomAttributes,
    setLabel,
    setLocale,
  };
}

// Conditional ChatWidget that only shows for logged-in users
export function ConditionalChatWidget(props: ChatWidgetProps) {
  const { user } = useAuth();

  // Only show widget for logged-in users
  if (!user) {
    return null;
  }

  return <ChatWidget {...props} />;
}

// ChatWidget for specific pages
export function PageChatWidget({ 
  allowedPages = ['/dashboard', '/billing', '/integrations'],
  ...props 
}: ChatWidgetProps & { allowedPages?: string[] }) {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Only show widget on allowed pages
  if (!allowedPages.includes(currentPath)) {
    return null;
  }

  return <ChatWidget {...props} />;
}
