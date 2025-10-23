import prisma from '@/lib/prisma';

export interface PostHogEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  distinctId?: string;
  timestamp?: Date;
}

export interface PostHogUserProperties {
  userId: string;
  properties: Record<string, any>;
}

export interface PostHogFeatureFlag {
  key: string;
  value: any;
  isEnabled: boolean;
}

export interface PostHogInsight {
  id: string;
  name: string;
  description: string;
  query: Record<string, any>;
  results?: any[];
}

export class PostHogService {
  private static readonly API_URL = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
  private static readonly API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  private static readonly PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

  /**
   * Track an event
   */
  static async trackEvent(eventData: PostHogEvent): Promise<boolean> {
    try {
      if (!this.API_KEY) {
        console.warn('PostHog API key not configured');
        return false;
      }

      const payload = {
        api_key: this.API_KEY,
        event: eventData.event,
        properties: {
          ...eventData.properties,
          timestamp: eventData.timestamp?.toISOString() || new Date().toISOString(),
        },
        distinct_id: eventData.distinctId || eventData.userId || 'anonymous',
      };

      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/capture/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      });

      return response.ok;
    } catch (error) {
      console.error('Error tracking PostHog event:', error);
      return false;
    }
  }

  /**
   * Set user properties
   */
  static async setUserProperties(userProps: PostHogUserProperties): Promise<boolean> {
    try {
      if (!this.API_KEY) {
        console.warn('PostHog API key not configured');
        return false;
      }

      const payload = {
        api_key: this.API_KEY,
        event: '$set',
        properties: userProps.properties,
        distinct_id: userProps.userId,
      };

      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/capture/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      });

      return response.ok;
    } catch (error) {
      console.error('Error setting PostHog user properties:', error);
      return false;
    }
  }

  /**
   * Check if feature flag is enabled
   */
  static async isFeatureEnabled(userId: string, flagKey: string): Promise<boolean> {
    try {
      if (!this.API_KEY) {
        return false;
      }

      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/decide/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: this.API_KEY,
            distinct_id: userId,
          }),
        });
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.featureFlags?.[flagKey] === true;
    } catch (error) {
      console.error('Error checking PostHog feature flag:', error);
      return false;
    }
  }

  /**
   * Get feature flags for user
   */
  static async getFeatureFlags(userId: string): Promise<PostHogFeatureFlag[]> {
    try {
      if (!this.API_KEY) {
        return [];
      }

      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/decide/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: this.API_KEY,
            distinct_id: userId,
          }),
        });
      });

      if (!response.ok) {
        return [];
      }

      const result = await response.json();
      const flags: PostHogFeatureFlag[] = [];

      if (result.featureFlags) {
        for (const [key, value] of Object.entries(result.featureFlags)) {
          flags.push({
            key,
            value,
            isEnabled: value === true,
          });
        }
      }

      return flags;
    } catch (error) {
      console.error('Error getting PostHog feature flags:', error);
      return [];
    }
  }

  /**
   * Get insights/analytics data
   */
  static async getInsights(userId: string, query: Record<string, any>): Promise<any[]> {
    try {
      if (!this.PERSONAL_API_KEY) {
        console.warn('PostHog Personal API key not configured');
        return [];
      }

      const response = await this.retryRequest(async () => {
        return await fetch(`${this.API_URL}/api/projects/${this.getProjectId()}/insights/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.PERSONAL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
      });

      if (!response.ok) {
        return [];
      }

      const result = await response.json();
      return result.results || [];
    } catch (error) {
      console.error('Error getting PostHog insights:', error);
      return [];
    }
  }

  /**
   * Track user signup
   */
  static async trackUserSignup(userId: string, email: string, name?: string): Promise<boolean> {
    return await this.trackEvent({
      event: 'user_signed_up',
      userId,
      properties: {
        email,
        name,
        signup_method: 'email',
      },
    });
  }

  /**
   * Track user login
   */
  static async trackUserLogin(userId: string, email: string): Promise<boolean> {
    return await this.trackEvent({
      event: 'user_logged_in',
      userId,
      properties: {
        email,
        login_method: 'email',
      },
    });
  }

  /**
   * Track subscription created
   */
  static async trackSubscriptionCreated(userId: string, planType: string, price: number): Promise<boolean> {
    return await this.trackEvent({
      event: 'subscription_created',
      userId,
      properties: {
        plan_type: planType,
        price,
        currency: 'USD',
      },
    });
  }

  /**
   * Track subscription cancelled
   */
  static async trackSubscriptionCancelled(userId: string, planType: string, reason?: string): Promise<boolean> {
    return await this.trackEvent({
      event: 'subscription_cancelled',
      userId,
      properties: {
        plan_type: planType,
        cancellation_reason: reason,
      },
    });
  }

  /**
   * Track churn prediction
   */
  static async trackChurnPrediction(userId: string, score: number, riskLevel: string): Promise<boolean> {
    return await this.trackEvent({
      event: 'churn_prediction',
      userId,
      properties: {
        churn_score: score,
        risk_level: riskLevel,
        prediction_timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Track retention offer sent
   */
  static async trackRetentionOfferSent(userId: string, offerType: string, discountPercent?: number): Promise<boolean> {
    return await this.trackEvent({
      event: 'retention_offer_sent',
      userId,
      properties: {
        offer_type: offerType,
        discount_percent: discountPercent,
      },
    });
  }

  /**
   * Track retention offer used
   */
  static async trackRetentionOfferUsed(userId: string, offerType: string, discountPercent?: number): Promise<boolean> {
    return await this.trackEvent({
      event: 'retention_offer_used',
      userId,
      properties: {
        offer_type: offerType,
        discount_percent: discountPercent,
      },
    });
  }

  /**
   * Get project ID from API key
   */
  private static getProjectId(): string {
    // Extract project ID from API key (PostHog format: phc_<project_id>_<random>)
    if (this.API_KEY?.startsWith('phc_')) {
      const parts = this.API_KEY.split('_');
      return parts[1] || '';
    }
    return '';
  }

  /**
   * Retry request with exponential backoff
   */
  private static async retryRequest<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
    throw new Error('Max retries reached');
  }
}
